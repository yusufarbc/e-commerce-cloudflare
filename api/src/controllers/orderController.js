import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Sipariş HTTP isteklerini yöneten Controller.
 * OrderController
 */
export class OrderController {
    /**
     * OrderController örneği oluşturur.
     * @param {import('../services/orderService.js').OrderService} orderService - Sipariş servisi.
     */
    constructor(orderService) {
        this.orderService = orderService;
    }

    /**
     * Checkout (Ödeme Başlatma) işlemini yönetir.
     * 
     * @param {import('express').Request} req - Express istek nesnesi.
     * @param {import('express').Response} res - Express yanıt nesnesi.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    createCheckoutSession = asyncHandler(async (req, res, next) => {
        const result = await this.orderService.processCheckout(req.body);
        res.json(result);
    });

    /**
     * Güvenli token ile sipariş takibini sağlar.
     * 
     * @param {import('express').Request} req - Express istek nesnesi.
     * @param {import('express').Response} res - Express yanıt nesnesi.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    trackOrder = asyncHandler(async (req, res, next) => {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ status: 'failure', errorMessage: 'Takip kodu eksik.' });
        }

        const order = await this.orderService.getOrderByTrackingToken(token);

        if (!order) {
            return res.status(404).json({ status: 'failure', errorMessage: 'Sipariş bulunamadı.' });
        }

        res.json({
            status: 'success',
            data: {
                siparisNumarasi: order.siparisNumarasi,
                durum: order.durum,
                olusturulmaTarihi: order.olusturulmaTarihi,

                // Financials
                toplamTutar: order.toplamTutar,
                kargoUcreti: order.kargoUcreti,
                araToplam: (Number(order.toplamTutar) - Number(order.kargoUcreti)).toFixed(2),

                // Items
                kalemler: order.kalemler.map(item => ({
                    urunAd: item.urunAdSnapshot,
                    secilenRenk: item.secilenRenk,
                    adet: item.adet,
                    birimFiyat: item.urunFiyatSnapshot,
                    toplamFiyat: item.toplamFiyat,
                    iadeyeUygunMu: item.iadeyeUygunMuSnapshot
                })),

                // Safe Location Info ONLY
                teslimatAdresi: {
                    ilce: order.ilce,
                    sehir: order.sehir,
                    acikAdres: '* Güvenlik nedeniyle tam adres gizlenmiştir.'
                }
            }
        });
    });

    /**
     * Bir siparişi iptal eder.
     * 
     * @param {import('express').Request} req - Express istek nesnesi.
     * @param {import('express').Response} res - Express yanıt nesnesi.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    cancelOrder = asyncHandler(async (req, res, next) => {
        const { token, reason } = req.body;

        if (!token) {
            return res.status(400).json({ status: 'failure', errorMessage: 'Takip kodu (token) gereklidir.' });
        }

        try {
            const result = await this.orderService.cancelOrder(token, reason);
            res.json(result);
        } catch (error) {
            return res.status(400).json({ status: 'failure', errorMessage: error.message });
        }
    });

    /**
     * Admin panel order listing.
     */
    adminGetOrders = asyncHandler(async (req, res, next) => {
        const orders = await this.orderService.getAllOrdersForAdmin();
        res.json({ status: 'success', data: orders });
    });

    /**
     * Admin panel order details.
     */
    adminGetOrder = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const order = await this.orderService.getOrderByIdWithDetails(id);
        if (!order) {
            return res.status(404).json({ status: 'error', errorMessage: 'Sipariş bulunamadı.' });
        }
        res.json({ status: 'success', data: order });
    });

    /**
     * Admin panel order status / detail update.
     */
    adminUpdateOrder = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        try {
            const updatedOrder = await this.orderService.updateOrder(id, req.body);
            res.json({ status: 'success', data: updatedOrder });
        } catch (error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    });
}
