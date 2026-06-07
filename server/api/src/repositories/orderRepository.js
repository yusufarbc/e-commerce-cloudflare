import { BaseRepository } from './baseRepository.js';

/**
 * Sipariş veri etkileşimlerini yöneten Repository.
 * Temel CRUD işlemleri için BaseRepository'yi genişletir.
 */
export class OrderRepository extends BaseRepository {
    /**
     * OrderRepository örneği oluşturur.
     * @param {import('@prisma/client').PrismaClient} dbClient - Veritabanı istemcisi (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.siparis);
        this.prisma = dbClient; // Transaction işlemleri için gerekli
    }

    /**
     * İlişkili kalemleriyle birlikte yeni bir sipariş oluşturur.
     * @param {Object} orderData - Kalemleri de içeren sipariş verisi.
     * @returns {Promise<Object>} Oluşturulan sipariş.
     */
    async createOrder(orderData) {
        return this.model.create({
            data: orderData
        });
    }

    /**
     * Ödeme ve sipariş durumunu günceller.
     * @param {string} id - Sipariş ID.
     * @param {string} paymentStatus - Yeni ödeme durumu.
     * @param {string} status - Yeni sipariş durumu.
     * @returns {Promise<Object>} Güncellenen sipariş.
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
     * ID'ye göre siparişi, kalemleri ve ürün detaylarıyla birlikte getirir.
     * @param {string} id - Sipariş ID.
     * @returns {Promise<Object>} Sipariş detayları.
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
     * Siparişi tamamlar: Durumu 'HAZIRLANIYOR' yapar, ödemeyi başarılı işaretler ve stoğu düşer.
     * Atomikliği sağlamak için veritabanı "transaction" kullanır.
     * 
     * @param {string} id - Sipariş ID
     * @returns {Promise<Object>} Güncellenen Sipariş
     */
    async finalizeOrder(id) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Sipariş kalemlerini ve o anki ürün bilgilerini getir
            const siparis = await tx.siparis.findUnique({
                where: { id },
                include: { kalemler: true }
            });

            if (!siparis) throw new Error('Sipariş bulunamadı');

            // 2. Stok takibi yapılmadığı için stok düşürme işlemi kaldırıldı.
            // (Eskiden burada kalem.adet kadar stok düşürülüyordu)

            // 3. Sipariş Durumunu Güncelle
            return tx.siparis.update({
                where: { id },
                data: {
                    durum: 'HAZIRLANIYOR',
                    odemeDurumu: 'SUCCESS',
                    faturaDurumu: 'DUZENLENMEDI' // Fatura sonradan düzenlenecek
                }
            });
        });
    }

    /**
     * Sipariş için ödeme tokenini günceller.
     * @param {string} id - Sipariş ID.
     * @param {string} token - Iyzico'dan gelen ödeme tokeni.
     */
    async updatePaymentToken(id, token) {
        return this.model.update({
            where: { id },
            data: { odemeTokeni: token }
        });
    }

    /**
     * Ödeme tokenine göre siparişi bulur.
     * @param {string} token - Ödeme tokeni.
     * @returns {Promise<Object>} Sipariş.
     */
    async getOrderByPaymentToken(token) {
        return this.model.findUnique({
            where: { odemeTokeni: token },
            include: { kalemler: true }
        });
    }

    /**
     * Sipariş numarasına göre siparişi getirir.
     * @param {string} orderNumber - Sipariş numarası (6 haneli).
     * @returns {Promise<Object>} Sipariş ve kalemleri.
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
     * Takip tokenine göre siparişi getirir.
     * @param {string} token - Takip tokeni.
     * @returns {Promise<Object>} Sipariş ve kalemleri.
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
     * Bir siparişi IPTAL_EDILDI durumuna çeker.
     * @param {string} id - Sipariş ID.
     * @returns {Promise<Object>} Güncellenen sipariş.
     */
    async cancelOrder(id) {
        return this.model.update({
            where: { id },
            data: { durum: 'IPTAL_EDILDI' }
        });
    }
}
