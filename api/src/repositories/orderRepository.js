import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Order data interactions.
 * Extends BaseRepository for standard CRUD operations.
 */
export class OrderRepository extends BaseRepository {
    /**
     * Creates an instance of OrderRepository.
     * @param {import('../generated/prisma/client.ts').PrismaClient} dbClient - Database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.siparis);
        this.prisma = dbClient; // Required for transaction queries
    }

    /**
     * Creates a new order with its associated line items.
     * @param {Object} orderData - Order data containing line items.
     * @returns {Promise<Object>} The created order.
     */
    async createOrder(orderData) {
        return this.model.create({
            data: orderData
        });
    }

    /**
     * Updates payment and order status.
     * @param {string} id - Order ID.
     * @param {string} paymentStatus - New payment status.
     * @param {string} status - New order status.
     * @returns {Promise<Object>} The updated order.
     */
    async updateStatus(id, paymentStatus, status) {
        return this.model.update({
            where: { id },
            data: {
                odemeDurumu: paymentStatus,
                durum: status
            }
        });
    }

    /**
     * Retrieves an order by ID with line items and product details.
     * @param {string} id - Order ID.
     * @returns {Promise<Object>} Detailed order object.
     */
    async getOrderById(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                kalemler: {
                    include: {
                        urun: true
                    }
                }
            }
        });
    }

    /**
     * Marks a pending order as paid ('HAZIRLANIYOR', payment 'SUCCESS') and stores the payment reference.
     *
     * A single conditional update: only an order still in 'BEKLEMEDE' changes, so concurrent or
     * replayed gateway callbacks cannot finalize the same order twice.
     *
     * @param {string} id      - Order ID.
     * @param {string} odemeId - Provider-prefixed payment reference (e.g. 'iyzico-123').
     * @returns {Promise<boolean>} True if this call moved the order to paid.
     */
    async markOrderPaid(id, odemeId) {
        const { count } = await this.model.updateMany({
            where: { id, durum: 'BEKLEMEDE' },
            data: {
                durum: 'HAZIRLANIYOR',
                odemeDurumu: 'SUCCESS',
                odemeId,
                faturaDurumu: 'DUZENLENMEDI' // Invoice to be issued later
            }
        });
        return count === 1;
    }

    /**
     * Moves stock for an order's line items: -1 takes the quantities out of stock (payment
     * received), +1 puts them back (paid order cancelled and refunded).
     *
     * D1 has no interactive transactions, so each product is updated with its own atomic
     * increment; a concurrent checkout can still oversell by the quantity in flight.
     *
     * @param {Array<{urunId: string, adet: number}>} items - Order line items.
     * @param {-1|1} direction - Take out of (-1) or return to (+1) stock.
     */
    async adjustStock(items, direction) {
        for (const item of items || []) {
            if (!item.urunId || !(item.adet > 0)) continue;
            await this.prisma.urun.update({
                where: { id: item.urunId },
                data: { stokAdedi: { increment: direction * item.adet } }
            });
        }
    }

    /**
     * Updates the payment token for an order.
     * @param {string} id - Order ID.
     * @param {string} token - Payment gateway token.
     */
    async updatePaymentToken(id, token) {
        return this.model.update({
            where: { id },
            data: { odemeTokeni: token }
        });
    }

    /**
     * Finds an order by its payment token.
     * @param {string} token - Payment token.
     * @returns {Promise<Object>} Order.
     */
    async getOrderByPaymentToken(token) {
        return this.model.findUnique({
            where: { odemeTokeni: token },
            include: { kalemler: true }
        });
    }

    /**
     * Finds an order by its 6-digit order number.
     * @param {string} orderNumber - 6-digit order number.
     * @returns {Promise<Object>} Order with line items.
     */
    async getOrderByNumber(orderNumber) {
        return this.model.findUnique({
            where: { siparisNumarasi: orderNumber },
            include: {
                kalemler: {
                    include: {
                        urun: true
                    }
                }
            }
        });
    }

    /**
     * Finds an order by its secure tracking token.
     * @param {string} token - Tracking UUID token.
     * @returns {Promise<Object>} Order with line items.
     */
    async getOrderByTrackingToken(token) {
        return this.model.findUnique({
            where: { takipTokeni: token },
            include: {
                kalemler: {
                    include: {
                        urun: true
                    }
                }
            }
        });
    }

    /**
     * Sets an order status to IPTAL_EDILDI (Canceled).
     * @param {string} id - Order ID.
     * @param {Object} [options]
     * @param {boolean} [options.refunded] - The payment was refunded; marks it 'REFUNDED'.
     * @returns {Promise<Object>} The updated order.
     */
    async cancelOrder(id, { refunded = false } = {}) {
        return this.model.update({
            where: { id },
            data: refunded ? { durum: 'IPTAL_EDILDI', odemeDurumu: 'REFUNDED' } : { durum: 'IPTAL_EDILDI' }
        });
    }

    /**
     * Retrieves all orders for administration panel lists.
     * @returns {Promise<Array>}
     */
    async findAllForAdmin() {
        return this.model.findMany({
            include: { kalemler: true },
            orderBy: { olusturulmaTarihi: 'desc' }
        });
    }

    /**
     * Retrieves order details with kalemler, gecmis and iadeTalebi.
     * @param {string} id - Order ID.
     * @returns {Promise<Object|null>}
     */
    async getOrderByIdWithDetails(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                kalemler: true,
                gecmis: true,
                iadeTalebi: true
            }
        });
    }

    /**
     * Adds an audit trail entry for status changes.
     * @param {Object} historyData
     */
    async createOrderHistory(historyData) {
        return this.prisma.islemGecmisi.create({
            data: {
                siparisId: historyData.siparisId,
                eskiDurum: historyData.eskiDurum,
                yeniDurum: historyData.yeniDurum,
                not: historyData.not,
                islemYapan: historyData.islemYapan || 'SYSTEM'
            }
        });
    }
}
