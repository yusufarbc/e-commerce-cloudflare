import prisma from '../prisma.js';

/**
 * Service responsible for order business logic, payment processing, and checkout operations.
 * Handles the complete order lifecycle from creation to completion.
 */
export class OrderService {
    /**
     * Creates an instance of OrderService.
     * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository - Order repository for data access.
     * @param {import('./productService.js').ProductService} productService - Product service for price validation.
     * @param {import('./paramService.js').ParamService} paramService - Param POS payment gateway service.
     * @param {import('./emailService.js').EmailService} emailService - Email notification service.
     */
    constructor(orderRepository, productService, paramService, emailService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.paramService = paramService;
        this.emailService = emailService;
    }

    /**
     * Processes checkout request, validates cart items, calculates totals, and initiates payment.
     * @param {Object} checkoutData - Cart items, guest info, and invoice details.
     * @returns {Promise<Object>} Checkout result with payment page URL.
     */
    async processCheckout(checkoutData) {
        const { items, guestInfo: customerInfo } = checkoutData;

        // 1. Toplam Hesaplama ve Doğrulama
        let subTotal = 0;
        let totalDesi = 0;
        let totalWeight = 0;
        const indexItems = []; // Prisma veritabanı için


        // Ürünleri doğrula ve toplamı hesapla
        for (const item of items) {
            const product = await this.productService.getProductById(item.id);
            if (product) {
                const unitPrice = Number(product.indirimliFiyat || product.fiyat);
                const productColors = Array.isArray(product.renkSecenekleri)
                    ? product.renkSecenekleri.filter(Boolean)
                    : [];
                const selectedColor = typeof item.selectedColor === 'string' ? item.selectedColor.trim() : '';

                if (productColors.length > 0 && !selectedColor) {
                    throw new Error(`${product.ad} için renk seçimi zorunludur.`);
                }

                if (selectedColor && !productColors.includes(selectedColor)) {
                    throw new Error(`${product.ad} için seçilen renk geçersiz.`);
                }

                // Find color code from palette if available
                let finalColorName = selectedColor || null;
                if (selectedColor && Array.isArray(product.renkKartelasi)) {
                    const colorRecord = product.renkKartelasi.find(c => c.name === selectedColor);
                    if (colorRecord && colorRecord.code) {
                        finalColorName = `${selectedColor} (${colorRecord.code})`;
                    }
                }

                subTotal += unitPrice * item.quantity;
                totalWeight += Number(product.agirlik || 1) * item.quantity;

                // Veritabanı Kaydı İçin (Snapshot Dahil)
                indexItems.push({
                    urunId: product.id,
                    secilenRenk: finalColorName,
                    adet: item.quantity,
                    iadeyeUygunMuSnapshot: product.iadeImkaniVar !== false,
                    fiyat: unitPrice,
                    urunAdSnapshot: product.ad,
                    urunFiyatSnapshot: unitPrice,
                    toplamFiyat: unitPrice * item.quantity
                });

            }
        }

        // Safeguard: Block orders > 100kg
        if (totalWeight > 100) {
            throw new Error('Sipariş toplam ağırlığı 100kg üzerindedir. Lütfen toplu satış ve özel nakliye için satis@e-market.com veya WhatsApp hattımız üzerinden iletişime geçiniz.');
        }



        // ... (existing helper methods if any)

        // Kargo Ücreti Mantığı (Kademeli Fiyatlandırma - Dinamik)
        let settings = await prisma.sistemAyarlari.findUnique({ where: { id: 'global-settings' } });

        const ucretsizKargoAltLimit = settings && settings.ucretsizKargoAltLimit ? Number(settings.ucretsizKargoAltLimit) : 5000.00;

        let shippingFee = 0;

        // Ücretsiz Kargo Kontrolu
        // Ücretsiz Kargo Mantığı İptal Edildi - Her Sipariş Ücretli
        // if (subTotal >= ucretsizKargoAltLimit) { ... } logic removed

        // Dinamik Fiyat Listesi Kontrolü
        let priceList = settings && settings.kargoFiyatListesi ? settings.kargoFiyatListesi : null;
        if (typeof priceList === 'string') {
            try {
                priceList = JSON.parse(priceList);
            } catch (e) {
                priceList = null;
            }
        }

        if (Array.isArray(priceList) && priceList.length > 0) {
            // Listeyi ağırlığa göre sırala (küçükten büyüğe)
            // JSON format: [{ "maxWeight": 1, "price": 50 }, { "maxWeight": 2, "price": 100 }]
            const sortedList = [...priceList].sort((a, b) => a.maxWeight - b.maxWeight);

            // Uygun aralığı bul
            const matchingTier = sortedList.find(tier => totalWeight <= tier.maxWeight);

            if (matchingTier) {
                shippingFee = Number(matchingTier.price);
            } else {
                // If weight exceeds the max defined tier, calculate based on the last tier + extra cost
                const lastTier = sortedList[sortedList.length - 1];
                const extraWeight = Math.ceil(totalWeight - lastTier.maxWeight);

                // Add 15 TL for every extra kg (Matching Frontend Logic)
                shippingFee = Number(lastTier.price) + (extraWeight * 15.00);
            }
        } else {
            // Fallback: Kod içi varsayılan tablo (Admin panelinden ayar yapılmamışsa)
            // Aralıklar: 0-1, 1-2, 2-3, 3-4, 4-5, 5-10, 10-20, 20-35, 35-50, 50-75, 75-100
            if (totalWeight <= 1) shippingFee = 65.00;
            else if (totalWeight <= 2) shippingFee = 85.00;
            else if (totalWeight <= 3) shippingFee = 105.00;
            else if (totalWeight <= 4) shippingFee = 125.00;
            else if (totalWeight <= 5) shippingFee = 145.00;
            else if (totalWeight <= 10) shippingFee = 200.00;
            else if (totalWeight <= 20) shippingFee = 350.00;
            else if (totalWeight <= 35) shippingFee = 550.00;
            else if (totalWeight <= 50) shippingFee = 800.00;
            else if (totalWeight <= 75) shippingFee = 1200.00;
            else if (totalWeight <= 100) shippingFee = 1600.00;
            else {
                // 100 kg üzeri: Otomatik hesaplama yok, iletişime geçilmeli
                shippingFee = null;
            }
        }


        // Küsürat hatalarını önle
        shippingFee = Number(shippingFee.toFixed(2));

        const toplamTutar = subTotal + shippingFee;



        // 2. Bekleyen Siparişi Oluştur (PENDING Order)
        const { isCorporate, companyName, taxOffice, taxNumber } = checkoutData.invoiceInfo || {};

        // Kısa Sipariş Numarası Üret (Örn: 738492)
        const siparisNumarasi = Math.floor(100000 + Math.random() * 900000).toString();

        // Ad Soyad Ayrıştırma
        const fullNameParts = customerInfo.name.trim().split(' ');
        const soyad = fullNameParts.length > 1 ? fullNameParts.pop() : '';
        const ad = fullNameParts.join(' ');

        // Telefon Formatlama (+90...)
        let rawPhone = customerInfo.phone.replace(/\s/g, ''); // Boşlukları kaldır
        if (rawPhone.startsWith('0')) {
            rawPhone = '+90' + rawPhone.substring(1);
        } else if (!rawPhone.startsWith('+')) {
            rawPhone = '+90' + rawPhone; // 5XX... -> +905XX... varsayımı
        }

        const ulke = 'Türkiye';

        // Güvenli Takip Tokeni Oluştur (UUID)
        const takipTokeni = crypto.randomUUID();

        const orderData = {
            toplamTutar,
            kargoUcreti: shippingFee,
            durum: 'BEKLEMEDE',
            siparisNumarasi: siparisNumarasi,
            takipTokeni: takipTokeni,
            ad: ad || customerInfo.name, // Ayrıştırma başarısızsa tam adı kullan
            soyad: soyad,
            eposta: customerInfo.email,
            telefon: rawPhone,
            adres: customerInfo.address,
            sehir: customerInfo.city,
            ilce: customerInfo.district,
            postaKodu: customerInfo.zipCode,
            ulke: ulke,
            kurumsalMi: !!isCorporate,
            sirketAdi: companyName || null,
            vergiDairesi: taxOffice || null,
            vergiNumarasi: taxNumber || null,
            kalemler: {
                create: indexItems
            }
        };

        const siparis = await this.orderRepository.createOrder(orderData);

        // 3. Return order details - Param requires card info from frontend
        // Payment will be initiated when customer submits card form
        return {
            status: 'pending_payment',
            orderId: siparis.id,
            orderNumber: siparis.siparisNumarasi,
            total: siparis.toplamTutar,
            message: 'Sipariş oluşturuldu, ödeme bekleniyor'
        };
    }

    /**
     * Initiates Param payment with card details.
     * Called after customer submits card information.
     * @param {string} orderId - Order UUID.
     * @param {Object} cardInfo - Card details (cardNumber, cardExpMonth, cardExpYear, cardCvc).
     * @param {Object} buyerInfo - Buyer info (name, surname, phone, ip).
     * @returns {Promise<Object>} UCD_HTML for 3D redirect or error.
     */
    async initiateParamPayment(orderId, cardInfo, buyerInfo) {
        const siparis = await this.orderRepository.getOrderById(orderId);

        if (!siparis) {
            throw new Error('Sipariş bulunamadı.');
        }

        if (siparis.durum !== 'BEKLEMEDE') {
            throw new Error('Bu sipariş için ödeme yapılamaz.');
        }

        try {
            const buyer = {
                name: siparis.ad,
                surname: siparis.soyad,
                phone: siparis.telefon,
                cardNumber: cardInfo.cardNumber,
                cardExpMonth: cardInfo.cardExpMonth,
                cardExpYear: cardInfo.cardExpYear,
                cardCvc: cardInfo.cardCvc,
                ip: buyerInfo.ip || '127.0.0.1'
            };

            const paymentResult = await this.paramService.startPaymentProcess(siparis, [], buyer);

            // Store dekont ID for later verification
            if (paymentResult.dekontId) {
                await this.orderRepository.updatePaymentToken(siparis.id, paymentResult.dekontId);
            }

            return {
                status: 'success',
                ucdHtml: paymentResult.ucdHtml,
                orderId: siparis.id
            };
        } catch (error) {
            console.error('Param Payment Error:', error);
            return { status: 'failure', errorMessage: error.message || 'Ödeme başlatılamadı.' };
        }
    }

    /**
     * Completes payment after successful Param 3D callback.
     * Verifies callback data and finalizes order.
     * @param {Object} callbackData - POST data from Param callback.
     * @returns {Promise<Object>} Completion result with order details.
     */
    async completePayment(callbackData) {
        try {
            // 1. Verify callback with Param service
            const result = this.paramService.verifyCallback(callbackData);

            if (result.status === 'success') {
                // 2. Find order by siparisNumarasi from callback (Param sends our order number as 'orderId')
                console.log('Completing payment, Order Number:', result.siparisNumarasi);

                const siparis = await this.orderRepository.getOrderByNumber(result.siparisNumarasi);

                if (!siparis) {
                    throw new Error('Order not found for the given payment.');
                }

                // 3. Update order with payment ID
                await this.orderRepository.updatePaymentToken(siparis.id, result.paymentId);

                // 4. Finalize order (update status)
                await this.orderRepository.finalizeOrder(siparis.id);

                // 5. Send confirmation email
                const freshOrder = await this.orderRepository.getOrderById(siparis.id);

                if (freshOrder) {
                    await this.emailService.sendOrderConfirmation(freshOrder.eposta, freshOrder.ad, {
                        id: freshOrder.id,
                        orderNumber: freshOrder.siparisNumarasi,
                        trackingToken: freshOrder.takipTokeni,
                        total: freshOrder.toplamTutar,
                        items: freshOrder.kalemler
                    });

                    // Internal notification for seller team with full order/address details.
                    await this.emailService.sendSellerNewOrderNotification(freshOrder);
                }

                return {
                    status: 'success',
                    orderId: siparis.id,
                    orderNumber: siparis.siparisNumarasi,
                    trackingToken: siparis.takipTokeni
                };
            } else {
                return {
                    status: 'failure',
                    errorMessage: result.errorMessage || 'Ödeme doğrulanamadı.',
                    orderNumber: result.siparisNumarasi
                };
            }
        } catch (error) {
            console.error('Payment Completion Error:', error);
            throw error;
        }
    }

    /**
     * Cancels an order with a specified reason and processes refund if applicable.
     * @param {string} token - Order tracking token.
     * @param {string} reason - Cancellation reason.
     * @returns {Promise<Object>} Success message with refund status.
     */
    async cancelOrder(token, reason) {
        const order = await this.orderRepository.getOrderByTrackingToken(token);

        if (!order) {
            throw new Error('Sipariş bulunamadı.');
        }

        if (order.durum === 'IPTAL_EDILDI') {
            throw new Error('Sipariş zaten iptal edilmiş.');
        }

        if (order.durum === 'KARGOLANDI' || order.durum === 'TESLIM_EDILDI' || order.durum === 'TAMAMLANDI') {
            throw new Error('Kargoya verilmiş veya tamamlanmış siparişler iptal edilemez.');
        }

        const hasNonReturnableItems = Array.isArray(order.kalemler)
            && order.kalemler.some((line) => line.iadeyeUygunMuSnapshot === false || line.urun?.iadeImkaniVar === false);

        if (hasNonReturnableItems) {
            throw new Error('Bu siparişte özel yapım/iade edilemez ürün olduğu için iptal edilemez.');
        }

        console.log(`[Sipariş İptali] Sipariş: ${order.siparisNumarasi}, Sebep: ${reason}`);

        let refundStatus = 'NONE';

        if (order.odemeDurumu === 'SUCCESS' && order.odemeId) {
            try {
                await this.paramService.cancelPayment(order.odemeId, reason);
                refundStatus = 'SUCCESS';
                console.log(`[Param Refund] Successful, Order: ${order.siparisNumarasi}`);
            } catch (error) {
                console.error(`[Param Refund Failed] Order: ${order.siparisNumarasi}`, error);
                // Continue with cancellation even if refund fails, but log it
                // Admin notification mechanism should be added for production
            }
        }

        await this.orderRepository.cancelOrder(order.id);

        // İptal Maili Gönder
        if (order.eposta) {
            await this.emailService.sendCancellationNotification(order.eposta, order.ad, {
                orderNumber: order.siparisNumarasi,
                refundStatus: refundStatus,
                trackingToken: token // trackingToken is passed as 'token' argument to this method
            });
        }

        return { status: 'success', message: 'Sipariş başarıyla iptal edildi ve ücret iadesi işlemi başlatıldı.' };
    }

    /**
     * Retrieves an order by its secure tracking token.
     * @param {string} token - Order tracking token (UUID).
     * @returns {Promise<Object>} Order object with all details.
     */
    async getOrderByTrackingToken(token) {
        return this.orderRepository.getOrderByTrackingToken(token);
    }

    /**
     * Retrieves an order by ID with optional email verification.
     * @param {string} id - Order UUID.
     * @param {string} [email] - Email address for verification (optional).
     * @returns {Promise<Object|null>} Order object or null if not found.
     * @throws {Error} If email is provided but doesn't match.
     */
    async getOrderById(id, email) {
        const siparis = await this.orderRepository.getOrderById(id);
        if (!siparis) return null;

        if (email && siparis.eposta !== email) {
            throw new Error('Erişim reddedildi: E-posta adresi eşleşmiyor.');
        }

        return siparis;
    }

    /**
     * Gets installment options for a card BIN.
     * @param {string} bin - First 6 digits of card number.
     * @param {number} amount - Transaction amount.
     * @returns {Promise<Array>} Available installment options.
     */
    async getInstallmentOptions(bin, amount) {
        return this.paramService.getInstallmentOptions(bin, amount);
    }
}
