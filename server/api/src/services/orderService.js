import prisma from '../prisma.js';
import { config } from '../config.js';

/**
 * Service for managing order processing and checkout operations.
 * Houses business rules including validations, shipping cost calculations, payment integration, and email triggers.
 */
export class OrderService {
    /**
     * Creates an instance of OrderService.
     * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository - Order repository.
     * @param {import('./productService.js').ProductService} productService - Product service.
     * @param {import('./paramService.js').ParamService} paramService - POS service.
     * @param {import('./emailService.js').EmailService} emailService - Email service.
     */
    constructor(orderRepository, productService, paramService, emailService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.paramService = paramService;
        this.emailService = emailService;
    }

    /**
     * Initiates checkout session, calculates total pricing/shipping, and records a PENDING order.
     * @param {Object} checkoutData - Items list and shipping/invoice billing details.
     * @returns {Promise<Object>} Checkout result with payment page URL.
     */
    async processCheckout(checkoutData) {
        const { items, guestInfo: customerInfo } = checkoutData;

        // 1. Total Price Calculation and Validations
        let subTotal = 0;
        let totalDesi = 0;
        let totalWeight = 0;
        const indexItems = []; // Array to map line items for Prisma schema

        // Validate products and calculate total weight/prices
        for (const item of items) {
            const product = await this.productService.getProductById(item.id);
            if (product) {
                const unitPrice = Number(product.indirimliFiyat || product.fiyat);
                const productColors = Array.isArray(product.renkSecenekleri)
                    ? product.renkSecenekleri.filter(Boolean)
                    : [];
                const selectedColor = typeof item.selectedColor === 'string' ? item.selectedColor.trim() : '';

                if (productColors.length > 0 && !selectedColor) {
                    throw new Error(`Color selection is required for ${product.ad}.`);
                }

                if (selectedColor && !productColors.includes(selectedColor)) {
                    throw new Error(`Selected color for ${product.ad} is invalid.`);
                }

                // Resolve color code from palette if available
                let finalColorName = selectedColor;
                if (selectedColor) {
                    const colorRecord = await prisma.renkKartelasi.findFirst({
                        where: { name: selectedColor, aktif: true }
                    });
                    if (colorRecord) {
                        finalColorName = `${selectedColor} (${colorRecord.code})`;
                    }
                }

                subTotal += unitPrice * item.quantity;
                totalWeight += Number(product.agirlik || 1) * item.quantity;

                // Build database snapshot record representation
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

        // Safeguard: Block orders exceeding 100kg limits
        if (totalWeight > 100) {
            throw new Error('Order total weight exceeds 100kg limit. Please contact satis@e-market.com or our WhatsApp line for bulk cargo shipping pricing.');
        }

        // Shipping Fee Logic (Dynamic Tier Pricing)
        let settings = await prisma.sistemAyarlari.findUnique({ where: { id: 'global-settings' } });
        const ucretsizKargoAltLimit = settings && settings.ucretsizKargoAltLimit ? Number(settings.ucretsizKargoAltLimit) : 5000.00;
        let shippingFee = 0;

        // Dynamic price list tiers from dashboard settings
        let priceList = settings && settings.kargoFiyatListesi ? settings.kargoFiyatListesi : null;
        if (typeof priceList === 'string') {
            try {
                priceList = JSON.parse(priceList);
            } catch (e) {
                priceList = null;
            }
        }

        if (Array.isArray(priceList) && priceList.length > 0) {
            // Sort list by weight tier ascending
            const sortedList = [...priceList].sort((a, b) => a.maxWeight - b.maxWeight);

            // Find matching weight tier
            const matchingTier = sortedList.find(tier => totalWeight <= tier.maxWeight);

            if (matchingTier) {
                shippingFee = Number(matchingTier.price);
            } else {
                // If weight exceeds the maximum tier, calculate base price plus surcharge per extra kg
                const lastTier = sortedList[sortedList.length - 1];
                const extraWeight = Math.ceil(totalWeight - lastTier.maxWeight);
                shippingFee = Number(lastTier.price) + (extraWeight * 15.00);
            }
        } else {
            // Fallback: Hardcoded default tiers if system configurations are missing
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
                shippingFee = null;
            }
        }

        if (shippingFee === null) {
            throw new Error('Shipping calculations failed for this weight. Contact customer support.');
        }

        // Round shipping fee to avoid float precision errors
        shippingFee = Number(shippingFee.toFixed(2));
        const toplamTutar = subTotal + shippingFee;

        // 2. Generate and Insert Pending Order Record
        const { isCorporate, companyName, taxOffice, taxNumber } = checkoutData.invoiceInfo || {};

        // Generate short 6-digit reference number
        const siparisNumarasi = Math.floor(100000 + Math.random() * 900000).toString();

        // Split Full Name into First and Last names
        const fullNameParts = customerInfo.name.trim().split(' ');
        const soyad = fullNameParts.length > 1 ? fullNameParts.pop() : '';
        const ad = fullNameParts.join(' ');

        // Format Turkish phone numbers into standard format
        let rawPhone = customerInfo.phone.replace(/\s/g, '');
        if (rawPhone.startsWith('0')) {
            rawPhone = '+90' + rawPhone.substring(1);
        } else if (!rawPhone.startsWith('+')) {
            rawPhone = '+90' + rawPhone;
        }

        const ulke = 'Türkiye';
        const takipTokeni = crypto.randomUUID(); // Secure unique tracking token

        const orderData = {
            toplamTutar,
            kargoUcreti: shippingFee,
            durum: 'BEKLEMEDE',
            siparisNumarasi: siparisNumarasi,
            takipTokeni: takipTokeni,
            ad: ad || customerInfo.name,
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

        return {
            status: 'pending_payment',
            orderId: siparis.id,
            orderNumber: siparis.siparisNumarasi,
            total: siparis.toplamTutar,
            message: 'Order created successfully, awaiting payment'
        };
    }

    /**
     * Initiates Param payment gateway session with card details.
     * @param {string} orderId - Order UUID.
     * @param {Object} cardInfo - Card details (cardNumber, cardExpMonth, cardExpYear, cardCvc).
     * @param {Object} buyerInfo - Buyer details (IP address, etc.).
     * @returns {Promise<Object>} 3D secure redirect HTML or error object.
     */
    async initiateParamPayment(orderId, cardInfo, buyerInfo) {
        const siparis = await this.orderRepository.getOrderById(orderId);

        if (!siparis) {
            throw new Error('Order not found.');
        }

        if (siparis.durum !== 'BEKLEMEDE') {
            throw new Error('This order is not eligible for payment.');
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

            // Store verification code/token
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
            return { status: 'failure', errorMessage: error.message || 'Payment initiation failed.' };
        }
    }

    /**
     * Completes and finalizes payment after successful 3D secure callback.
     * @param {Object} callbackData - Callback parameters sent from Param gateway.
     * @returns {Promise<Object>} Payment completion results.
     */
    async completePayment(callbackData) {
        try {
            const result = this.paramService.verifyCallback(callbackData);

            if (result.status === 'success') {
                console.log('Completing payment, Order Number:', result.siparisNumarasi);

                const siparis = await this.orderRepository.getOrderByNumber(result.siparisNumarasi);

                if (!siparis) {
                    throw new Error('Order not found for the given payment.');
                }

                // Update payment transaction token
                await this.orderRepository.updatePaymentToken(siparis.id, result.paymentId);

                // Finalize order status and manage inventory
                await this.orderRepository.finalizeOrder(siparis.id);

                // Fetch finalized order details to trigger email dispatches
                const freshOrder = await this.orderRepository.getOrderById(siparis.id);

                if (freshOrder) {
                    // Send customer order confirmation
                    await this.emailService.sendOrderConfirmation(freshOrder.eposta, freshOrder.ad, {
                        id: freshOrder.id,
                        orderNumber: freshOrder.siparisNumarasi,
                        trackingToken: freshOrder.takipTokeni,
                        total: freshOrder.toplamTutar,
                        items: freshOrder.kalemler
                    });

                    // Send internal new order alert to seller team
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
                    errorMessage: result.errorMessage || 'Payment verification failed.',
                    orderNumber: result.siparisNumarasi
                };
            }
        } catch (error) {
            console.error('Payment Completion Error:', error);
            throw error;
        }
    }

    /**
     * Cancels an order, releases hold slots, and refunds payment if applicable.
     * @param {string} token - Secure tracking token.
     * @param {string} reason - Cancellation reason statement.
     * @returns {Promise<Object>} Result message with status.
     */
    async cancelOrder(token, reason) {
        const order = await this.orderRepository.getOrderByTrackingToken(token);

        if (!order) {
            throw new Error('Order not found.');
        }

        if (order.durum === 'IPTAL_EDILDI') {
            throw new Error('Order is already canceled.');
        }

        if (order.durum === 'KARGOLANDI' || order.durum === 'TESLIM_EDILDI' || order.durum === 'TAMAMLANDI') {
            throw new Error('Shipped or completed orders cannot be canceled.');
        }

        const hasNonReturnableItems = Array.isArray(order.kalemler)
            && order.kalemler.some((line) => line.iadeyeUygunMuSnapshot === false || line.urun?.iadeImkaniVar === false);

        if (hasNonReturnableItems) {
            throw new Error('This order contains custom or non-returnable items and cannot be canceled.');
        }

        console.log(`[Order Cancel] Order: ${order.siparisNumarasi}, Reason: ${reason}`);

        let refundStatus = 'NONE';

        if (order.odemeDurumu === 'SUCCESS' && order.odemeId) {
            try {
                await this.paramService.cancelPayment(order.odemeId, reason);
                refundStatus = 'SUCCESS';
                console.log(`[Param Refund] Successful, Order: ${order.siparisNumarasi}`);
            } catch (error) {
                console.error(`[Param Refund Failed] Order: ${order.siparisNumarasi}`, error);
            }
        }

        await this.orderRepository.cancelOrder(order.id);

        // Send cancellation email to customer
        if (order.eposta) {
            await this.emailService.sendCancellationNotification(order.eposta, order.ad, {
                orderNumber: order.siparisNumarasi,
                refundStatus: refundStatus,
                trackingToken: token
            });
        }

        return { status: 'success', message: 'Order successfully canceled and refund process initiated.' };
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
     * @param {string} [email] - Email address for verification.
     * @returns {Promise<Object|null>} Order object or null if not found.
     * @throws {Error} If email is provided but doesn't match.
     */
    async getOrderById(id, email) {
        const siparis = await this.orderRepository.getOrderById(id);
        if (!siparis) return null;

        if (email && siparis.eposta !== email) {
            throw new Error('Access denied: Email address does not match.');
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
