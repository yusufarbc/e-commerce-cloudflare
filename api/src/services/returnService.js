export class ReturnService {
    /**
     * Creates an instance of ReturnService.
     * @param {import('../repositories/returnRepository.js').ReturnRepository} returnRepository
     * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository
     */
    constructor(returnRepository, orderRepository) {
        this.returnRepository = returnRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Creates a return request.
     * @param {Object} data - { token, iadeTipi, sebepAciklamasi, fotografUrls }
     */
    async createReturnRequest(data) {
        const { token, iadeTipi, sebepAciklamasi, fotografUrls } = data;

        // 1. Find the Order
        const order = await this.orderRepository.getOrderByTrackingToken(token);

        if (!order) {
            throw new Error('Sipariş bulunamadı.');
        }

        // 2. Run validations
        if (order.durum !== 'TESLIM_EDILDI') {
            throw new Error('Sadece teslim edilmiş siparişler için iade talebi oluşturulabilir.');
        }

        if (order.iadeTalebi) {
            throw new Error('Bu sipariş için zaten bir iade talebi mevcut.');
        }

        const hasNonReturnableItems = Array.isArray(order.kalemler)
            && order.kalemler.some((line) => line.iadeyeUygunMuSnapshot === false || line.urun?.iadeImkaniVar === false);

        if (hasNonReturnableItems) {
            throw new Error('Bu siparişte özel yapım/iade edilemez ürün bulunduğu için iade talebi oluşturulamaz.');
        }

        // 3. 14 Days Rule validation
        if (!order.teslimTarihi) {
            // If delivery date is missing, raise error. We enforce delivery date to be registered.
            throw new Error('Sipariş teslim tarihi bilgisi eksik, iade işlemi başlatılamıyor. Lütfen destek ile iletişime geçin.');
        }

        const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000;
        const timeDiff = new Date() - new Date(order.teslimTarihi);

        if (timeDiff > fourteenDaysInMs) {
            throw new Error('İade süresi (14 gün) dolmuştur.');
        }

        // 4. Create the Return Request
        const iade = await this.returnRepository.create({
            siparisId: order.id,
            talepTipi: iadeTipi,
            aciklama: sebepAciklamasi,
            fotografUrls: Array.isArray(fotografUrls) ? JSON.stringify(fotografUrls) : "[]",
            durum: 'ONAY_BEKLENIYOR'
        });

        // 5. Update Order Status
        await this.orderRepository.update(order.id, { durum: 'IADE_TALEP_EDILDI' });

        return {
            ...iade,
            fotografUrls: Array.isArray(fotografUrls) ? fotografUrls : []
        };
    }

    /**
     * Retrieves the return status of an order.
     */
    async getReturnStatus(token) {
        const order = await this.orderRepository.getOrderByTrackingToken(token);

        if (!order) throw new Error('Sipariş bulunamadı.');

        const iadeTalebi = order.iadeTalebi;
        if (iadeTalebi && typeof iadeTalebi.fotografUrls === 'string') {
            try {
                iadeTalebi.fotografUrls = JSON.parse(iadeTalebi.fotografUrls);
            } catch (e) {
                iadeTalebi.fotografUrls = [];
            }
        }

        return iadeTalebi;
    }

    /**
     * Retrieves all return requests for admin panel.
     */
    async getAllReturnsForAdmin() {
        const returns = await this.returnRepository.findAllForAdmin();
        return returns.map(r => {
            let fotografUrls = [];
            try {
                fotografUrls = typeof r.fotografUrls === 'string' ? JSON.parse(r.fotografUrls) : r.fotografUrls;
            } catch (e) {
                fotografUrls = [];
            }
            return { ...r, fotografUrls };
        });
    }

    /**
     * Updates return status by admin, logging status change histories and updating the order status.
     */
    async updateReturnRequest(id, body) {
        const iade = await this.returnRepository.findByIdWithOrder(id);
        if (!iade) {
            throw new Error('İade talebi bulunamadı.');
        }

        const data = {};
        if (body.durum) data.durum = body.durum;
        if (body.adminNotu !== undefined) data.adminNotu = body.adminNotu;
        if (body.manuelIadeKodu !== undefined) data.manuelIadeKodu = body.manuelIadeKodu;

        const updatedReturn = await this.returnRepository.update(id, data);

        // Update order status if approved or rejected
        let targetOrderStatus = 'IADE_TALEP_EDILDI';
        if (body.durum === 'ONAYLANDI') {
            targetOrderStatus = 'IADE_EDILDI';
        } else if (body.durum === 'REDDEDILDI') {
            targetOrderStatus = 'TESLIM_EDILDI'; // Rollback status
        }

        await this.orderRepository.update(iade.siparisId, { durum: targetOrderStatus });

        await this.orderRepository.createOrderHistory({
            siparisId: iade.siparisId,
            eskiDurum: iade.siparis.durum,
            yeniDurum: targetOrderStatus,
            not: `İade talebi ${body.durum} olarak güncellendi. Admin Notu: ${body.adminNotu || '-'}`,
            islemYapan: 'ADMIN'
        });

        return updatedReturn;
    }
}
