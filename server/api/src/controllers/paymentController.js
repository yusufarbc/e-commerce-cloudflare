import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config.js';

/**
 * Controller handling payment-related HTTP requests.
 * Manages 3D Secure flow for Param POS.
 */
export class PaymentController {
    /**
     * Creates an instance of PaymentController.
     * @param {import('../services/orderService.js').OrderService} orderService - Order service.
     */
    constructor(orderService) {
        this.orderService = orderService;
    }

    /**
     * Initiates payment process with credit card details.
     * Called via AJAX from the frontend checkout page.
     * 
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    initiatePayment = asyncHandler(async (req, res) => {
        const { orderId, cardInfo, buyerInfo } = req.body;

        if (!orderId || !cardInfo) {
            return res.status(400).json({
                status: 'failure',
                message: 'Sipariş ID ve Kart Bilgileri zorunludur.'
            });
        }

        const result = await this.orderService.initiateParamPayment(orderId, cardInfo, buyerInfo);

        if (result.status === 'success') {
            res.json(result); // Returns UCD_HTML form for 3D redirect
        } else {
            res.status(400).json(result);
        }
    });

    /**
     * Handles successful 3D Secure callback from Param.
     * Param redirects user here via POST if 3D verification is successful.
     * 
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    handleParamSuccess = asyncHandler(async (req, res) => {
        console.log('Payment Success Callback:', req.body);

        try {
            const result = await this.orderService.completePayment(req.body);

            if (result.status === 'success') {
                // Redirect to Frontend Success Page
                const redirectUrl = `${config.clientUrl}/payment/success?orderNumber=${result.orderNumber}&trackingToken=${result.trackingToken}`;
                console.log('Redirecting to Success:', redirectUrl);
                res.redirect(redirectUrl);
            } else {
                // Should theoretically not happen if mdStatus=1, but safe fallback
                const redirectUrl = `${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent(result.errorMessage)}`;
                res.redirect(redirectUrl);
            }
        } catch (error) {
            console.error('Callback Handling Error:', error);
            res.redirect(`${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent('Sistem hatası oluştu.')}`);
        }
    });

    /**
     * Handles failed 3D Secure callback from Param.
     * Param redirects here if 3D authentication fails or user cancels.
     * 
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    handleParamError = asyncHandler(async (req, res) => {
        console.log('Payment Error Callback:', req.body);

        const errorMessage = req.body.md_errormessage || req.body.Sonuc_Str || 'Ödeme işlemi başarısız oldu veya iptal edildi.';
        const redirectUrl = `${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent(errorMessage)}`;

        console.log('Redirecting to Failure:', redirectUrl);
        res.redirect(redirectUrl);
    });

    /**
     * Gets installment options for a card BIN.
     * Called when user enters first 6 digits of card number.
     * 
     * @param {import('express').Request} req - Express request object.
     * @param {import('express').Response} res - Express response object.
     */
    getInstallments = asyncHandler(async (req, res) => {
        const { amount } = req.query;
        const rawBin = req.query.bin;

        let binValue = null;
        if (typeof rawBin === 'string') {
            binValue = rawBin;
        } else if (Array.isArray(rawBin) && typeof rawBin[0] === 'string') {
            binValue = rawBin[0];
        }

        if (!binValue || binValue.length < 6) {
            return res.status(400).json({
                status: 'failure',
                message: 'Kart BIN numarası (ilk 6 hane) gereklidir.'
            });
        }

        if (!amount || isNaN(Number(amount))) {
            return res.status(400).json({
                status: 'failure',
                message: 'Geçerli bir tutar gereklidir.'
            });
        }

        try {
            const installments = await this.orderService.getInstallmentOptions(binValue, Number(amount));
            res.json({
                status: 'success',
                installments
            });
        } catch (error) {
            console.error('Installment fetch error:', error);
            res.json({
                status: 'success',
                installments: [] // Return empty if error (no installments available)
            });
        }
    });
}
