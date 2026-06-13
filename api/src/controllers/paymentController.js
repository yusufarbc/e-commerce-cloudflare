import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config.js';

/**
 * PaymentController
 *
 * Handles all payment-related HTTP requests in a provider-agnostic manner.
 * Delegates business logic to OrderService which internally uses the PaymentService
 * Strategy pattern to dispatch calls to the active gateway (iyzico, Param, or PayTR).
 *
 * Single Responsibility Principle: this controller only translates HTTP request/response.
 * It does NOT contain payment logic — that lives in the service layer.
 */
export class PaymentController {
    /**
     * Creates a new PaymentController instance.
     *
     * @param {import('../services/orderService.js').OrderService} orderService
     *   The order service that orchestrates payment and order lifecycle operations.
     */
    constructor(orderService) {
        this.orderService = orderService;
    }

    /**
     * Initiates a 3D Secure payment session using the configured payment provider.
     *
     * Receives card details and order ID from the storefront, delegates to OrderService
     * which routes the request to the active provider (iyzico / Param / PayTR).
     * On success, returns an HTML snippet or redirect URL for the 3D Secure step.
     *
     * @route POST /api/v1/payment/initiate
     * @param {Object} req.body.orderId    - UUID of the pending order.
     * @param {Object} req.body.cardInfo   - Card holder name, number, expiry, CVC.
     * @param {Object} req.body.buyerInfo  - Supplementary buyer data (IP address etc.).
     * @returns {200} { status: 'success', ucdHtml: string } on success.
     * @returns {400} { status: 'failure', errorMessage: string } on validation or provider error.
     */
    initiatePayment = asyncHandler(async (req, res) => {
        const { orderId, cardInfo, buyerInfo } = req.body;

        if (!orderId || !cardInfo) {
            return res.status(400).json({
                status: 'failure',
                errorMessage: 'Geçersiz istek: orderId ve cardInfo zorunludur.'
            });
        }

        const result = await this.orderService.initiatePayment(orderId, cardInfo, buyerInfo);

        if (result.status === 'success') {
            return res.json(result);
        }

        return res.status(400).json(result);
    });

    /**
     * Handles a successful 3D Secure redirect callback from Param POS.
     *
     * Param redirects the user's browser here via POST after successful 3D authentication.
     * Finalises the order, triggers stock deduction and confirmation emails, then
     * redirects the user to the storefront success page.
     *
     * @route POST /api/v1/payment/callback/param/success
     * @param {Object} req.body - Param callback fields (mdStatus, orderId, etc.)
     */
    handleParamSuccess = asyncHandler(async (req, res) => {
        console.log('[Payment] Param success callback received:', req.body);

        try {
            const result = await this.orderService.completePayment(req.body, 'param');

            if (result.status === 'success') {
                const redirectUrl = `${config.clientUrl}/payment/success?orderNumber=${result.orderNumber}&trackingToken=${result.trackingToken}`;
                console.log('[Payment] Param success — redirecting to:', redirectUrl);
                return res.redirect(redirectUrl);
            }

            const redirectUrl = `${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent(result.errorMessage || 'Ödeme doğrulaması başarısız.')}`;
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('[Payment] Param success callback error:', error);
            return res.redirect(`${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent('Sistem hatası oluştu.')}`);
        }
    });

    /**
     * Handles a failed or cancelled 3D Secure redirect from Param POS.
     *
     * Param redirects here when the user cancels 3D verification or authentication fails.
     * Redirects the user to the storefront failure page with the error reason.
     *
     * @route POST /api/v1/payment/callback/param/error
     * @param {Object} req.body - Param error fields (md_errormessage, Sonuc_Str, etc.)
     */
    handleParamError = asyncHandler(async (req, res) => {
        console.log('[Payment] Param error callback received:', req.body);

        const errorMessage = req.body.md_errormessage
            || req.body.Sonuc_Str
            || 'Ödeme işlemi başarısız oldu veya iptal edildi.';

        const redirectUrl = `${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent(errorMessage)}`;
        console.log('[Payment] Param error — redirecting to:', redirectUrl);
        return res.redirect(redirectUrl);
    });

    /**
     * Handles the iyzico 3D Secure post-payment callback.
     *
     * iyzico POSTs payment result data here after 3D authentication.
     * Verifies the payment with iyzico's auth endpoint, finalises the order,
     * and redirects the user to the appropriate storefront page.
     *
     * @route POST /api/v1/payment/callback/iyzico
     * @param {Object} req.body - iyzico callback fields (paymentId, conversationId, status, etc.)
     */
    handleIyzicoCallback = asyncHandler(async (req, res) => {
        console.log('[Payment] iyzico callback received:', req.body);

        try {
            const result = await this.orderService.completePayment(req.body, 'iyzico');

            if (result.status === 'success') {
                const redirectUrl = `${config.clientUrl}/payment/success?orderNumber=${result.orderNumber}&trackingToken=${result.trackingToken}`;
                return res.redirect(redirectUrl);
            }

            const redirectUrl = `${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent(result.errorMessage || 'iyzico ödeme başarısız.')}`;
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('[Payment] iyzico callback error:', error);
            return res.redirect(`${config.clientUrl}/payment/failure?errorMessage=${encodeURIComponent('iyzico ödeme doğrulama hatası oluştu.')}`);
        }
    });

    /**
     * Handles the PayTR server-to-server Instant Payment Notification (IPN).
     *
     * PayTR sends a signed POST to this endpoint after each payment attempt.
     * The response MUST be the literal string "OK" on success, or "FAIL" on error
     * — any other response causes PayTR to retry the notification.
     *
     * @route POST /api/v1/payment/callback/paytr
     * @param {Object} req.body - PayTR IPN fields (merchant_oid, status, total_amount, hash, etc.)
     */
    handlePaytrCallback = asyncHandler(async (req, res) => {
        console.log('[Payment] PayTR IPN callback received:', req.body);

        try {
            const result = await this.orderService.completePayment(req.body, 'paytr');

            if (result.status === 'success') {
                // PayTR requires the exact string "OK" — any other response triggers a retry
                return res.send('OK');
            }

            console.error('[Payment] PayTR IPN validation failed:', result.errorMessage);
            res.set('Content-Type', 'text/plain');
            return res.send('FAIL');
        } catch (error) {
            console.error('[Payment] PayTR IPN error:', error.message || error);
            res.set('Content-Type', 'text/plain');
            return res.send('FAIL');
        }
    });

    /**
     * Returns available installment options for a given card BIN and total amount.
     *
     * Called client-side when the user enters the first 6 digits of their card number.
     * Delegates to the active payment provider's installment API.
     * Returns an empty array if the provider does not support installment queries.
     *
     * @route GET /api/v1/payment/installments?bin=589004&amount=1500
     * @param {string} req.query.bin    - First 6 digits of the card (BIN/IIN).
     * @param {number} req.query.amount - Total transaction amount in TRY.
     * @returns {200} { status: 'success', installments: Array }
     */
    getInstallments = asyncHandler(async (req, res) => {
        const { amount } = req.query;
        const rawBin = req.query.bin;

        // Normalise bin — query params can arrive as string or array
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
            return res.json({ status: 'success', installments });
        } catch (error) {
            console.error('[Payment] Installment fetch error:', error);
            // Return empty list rather than error — installments are optional UI enhancement
            return res.json({ status: 'success', installments: [] });
        }
    });
}
