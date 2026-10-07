import { config } from '../config.js';
import prisma from '../prisma.js';
import { PaymentService } from './paymentService.js';

/** An error caused by the request (bad cart, stock), reported as 400 by the error handler. */
function clientError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

/**
 * Ten-digit order number, first digit non-zero, from crypto.getRandomValues.
 * Each random byte gives two uniformly distributed hex digits; keeping only the decimal ones
 * (1-9 for the first) leaves every digit equally likely, with no modulo or division bias.
 */
export function generateOrderNumber() {
    let value = '';
    while (value.length < 10) {
        for (const byte of crypto.getRandomValues(new Uint8Array(16))) {
            for (const hex of byte.toString(16).padStart(2, '0')) {
                if (value.length < 10 && (value.length === 0 ? /[1-9]/ : /[0-9]/).test(hex)) {
                    value += hex;
                }
            }
        }
    }
    return value;
}

/**
 * Service for managing order processing and checkout operations.
 * Houses business rules including validations, shipping cost calculations, payment integration, and email triggers.
 */
export class OrderService {
    /**
     * Creates an instance of OrderService.
     * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository - Order repository.
     * @param {import('./productService.js').ProductService} productService - Product service.
     * @param {import('./paymentService.js').PaymentService} paymentService - Unified payment service.
     * @param {import('./emailService.js').EmailService} emailService - Email service.
     */
    constructor(orderRepository, productService, paymentService, emailService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.paymentService = paymentService;
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

        // Validate products and calculate total weight/prices. Every line must be a product that is
        // on sale and in stock; a cart line that does not resolve is an error, not a skipped line.
        const quantityByProduct = new Map();
        for (const item of items) {
            const product = await this.productService.getProductById(item.id);
            if (!product || product.aktif === false) {
                throw clientError('Sepetinizdeki bir ürün artık satışta değil.');
            }

            const requested = (quantityByProduct.get(product.id) || 0) + item.quantity;
            quantityByProduct.set(product.id, requested);
            if (requested > Number(product.stokAdedi || 0)) {
                throw clientError(`${product.ad} için yeterli stok yok.`);
            }

            const unitPrice = Number(product.indirimliFiyat || product.fiyat);
            const productColors = Array.isArray(product.renkSecenekleri)
                ? product.renkSecenekleri.filter(Boolean)
                : [];
            let selectedColor = typeof item.selectedColor === 'string' ? item.selectedColor.trim() : '';

            if (productColors.length > 0 && !selectedColor) {
                selectedColor = productColors[0];
            }

            if (selectedColor && !productColors.includes(selectedColor)) {
                throw clientError(`Selected color for ${product.ad} is invalid.`);
            }

            // Use the selected color name directly
            const finalColorName = selectedColor;

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

        // Safeguard: Block orders exceeding 100kg limits
        if (totalWeight > 100) {
            throw clientError('Order total weight exceeds 100kg limit. Please contact satis@ecommerceflaredev.web.tr or our WhatsApp line for bulk cargo shipping pricing.');
        }

        // Shipping Fee Logic (Dynamic Multi-Policy Pricing)
        let settings = await prisma.sistemAyarlari.findUnique({ where: { id: 'global-settings' } });
        const policy = settings?.kargoPolitikaTuru || 'SABIT_UCRET';
        const sabitUcret = settings?.kargoSabitUcret !== undefined ? Number(settings.kargoSabitUcret) : 0;
        const ucretsizKargoAltLimit = settings?.ucretsizKargoAltLimit !== undefined ? Number(settings.ucretsizKargoAltLimit) : 5000.00;
        const weightMultiplier = settings?.kargoAgirlikCarpani > 0 ? Number(settings.kargoAgirlikCarpani) : 15.00;
        let shippingFee = 0;

        if (policy === 'UCRETSIZ') {
            shippingFee = 0;
        } else if (policy === 'SABIT_UCRET') {
            shippingFee = sabitUcret;
        } else if (policy === 'SEPET_LIMITI') {
            if (subTotal >= ucretsizKargoAltLimit) {
                shippingFee = 0;
            } else {
                shippingFee = totalWeight * weightMultiplier;
            }
        } else if (policy === 'AGIRLIK_KADEMELI') {
            // Dynamic price list tiers from dashboard settings
            let priceList = settings && settings.kargoFiyatListesi ? settings.kargoFiyatListesi : null;
            if (typeof priceList === 'string') {
                try {
                    priceList = JSON.parse(priceList);
                } catch {
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
                    // Exceeds max weight logic - no multiplier allowed!
                    shippingFee = null;
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
        } else {
            shippingFee = sabitUcret;
        }

        if (shippingFee === null) {
            throw new Error('Shipping calculations failed for this weight. Contact customer support.');
        }

        // Round shipping fee to avoid float precision errors
        shippingFee = Number(shippingFee.toFixed(2));
        const toplamTutar = subTotal + shippingFee;

        // 2. Generate and Insert Pending Order Record
        const { isCorporate, companyName, taxOffice, taxNumber } = checkoutData.invoiceInfo || {};

        // The order number identifies the order to payment gateways and customers, so it must be
        // unique and not guessable: 10 digits from a CSPRNG.
        const siparisNumarasi = generateOrderNumber();

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
     * Initiates a payment gateway session using the active provider strategy.
     *
     * Retrieves the pending order, validates its state, builds the buyer payload,
     * and delegates to PaymentService (which dispatches to iyzico / Param / PayTR).
     * Stores the provider's transaction reference token on the order record.
     *
     * @param {string} orderId     - UUID of the pending order.
     * @param {Object} cardInfo    - Card details: { cardNumber, cardExpMonth, cardExpYear, cardCvc, cardHolderName }.
     * @param {Object} buyerInfo   - Supplementary buyer data (e.g. { ip }).
     * @returns {Promise<Object>}  { status: 'success', ucdHtml: string, orderId } on success,
     *                             { status: 'failure', errorMessage: string } on error.
     */
    async initiatePayment(orderId, cardInfo, buyerInfo) {
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
                cardHolderName: cardInfo.cardHolderName,
                ip: buyerInfo.ip || '127.0.0.1'
            };

            const paymentResult = await this.paymentService.startPaymentProcess(siparis, siparis.kalemler || [], buyer);

            // Store verification code/token
            const tokenValue = paymentResult.dekontId || paymentResult.paymentId;
            if (tokenValue) {
                await this.orderRepository.updatePaymentToken(siparis.id, tokenValue);
            }

            return {
                status: 'success',
                ucdHtml: paymentResult.ucdHtml,
                orderId: siparis.id
            };
        } catch (error) {
            console.error('[Payment Strategy] Error initiating payment:', error);
            return { status: 'failure', errorMessage: error.message || 'Payment initiation failed.' };
        }
    }

    /**
     * Backward-compatible alias for initiatePayment.
     */
    async initiateParamPayment(orderId, cardInfo, buyerInfo) {
        return this.initiatePayment(orderId, cardInfo, buyerInfo);
    }

    /**
     * Completes and finalises a payment after a gateway callback.
     *
     * The provider verifies the callback and reports which order was paid and how much, from data
     * the gateway vouches for. The order then moves from 'BEKLEMEDE' to 'HAZIRLANIYOR' in one
     * conditional update, so a replayed or concurrent callback cannot finalize it twice or revive
     * a cancelled order. A verified payment that cannot be applied (order no longer pending,
     * already paid by another payment, or underpaid) is refunded.
     *
     * @param {Object} callbackData - Raw callback payload from the payment gateway.
     * @param {'iyzico'|'param'|'paytr'} provider - Provider whose callback endpoint was called.
     * @returns {Promise<Object>}   { status: 'success', orderId, orderNumber, trackingToken } when the
     *                              order is paid (also for a repeated callback of the same payment);
     *                              { status: 'failure', errorMessage, orderNumber, final? } otherwise.
     *                              `final` marks a verified callback that was handled and must not be retried.
     */
    async completePayment(callbackData, provider) {
        const result = await this.paymentService.verifyCallback(callbackData, provider);

        if (result.status !== 'success') {
            return {
                status: 'failure',
                errorMessage: result.errorMessage || 'Payment verification failed.',
                orderNumber: result.siparisNumarasi
            };
        }

        const siparis = await this.orderRepository.getOrderByNumber(result.siparisNumarasi);
        if (!siparis) {
            throw new Error('Order not found for the given payment.');
        }

        const odemeId = PaymentService.paymentReference(provider, result.paymentId);
        const paid = {
            status: 'success',
            orderId: siparis.id,
            orderNumber: siparis.siparisNumarasi,
            trackingToken: siparis.takipTokeni
        };

        // Gateways retry notifications (PayTR until it gets "OK"); a payment already recorded on the
        // order is acknowledged again without side effects (no second e-mail, no second refund).
        const alreadyRecorded = (order) => (order.odemeDurumu === 'SUCCESS'
            ? paid
            : { status: 'failure', errorMessage: 'Order was cancelled.', orderNumber: siparis.siparisNumarasi, final: true });
        if (siparis.odemeId === odemeId) {
            return alreadyRecorded(siparis);
        }

        const rejectWithRefund = async (errorMessage) => {
            console.error('[Payment] %s Order: %s, payment: %s', errorMessage, siparis.siparisNumarasi, odemeId);
            await this._refundUnappliedPayment(odemeId, result.amount ?? siparis.toplamTutar, errorMessage);
            return { status: 'failure', errorMessage, orderNumber: siparis.siparisNumarasi, final: true };
        };

        if (siparis.durum !== 'BEKLEMEDE' || siparis.odemeDurumu === 'SUCCESS') {
            return rejectWithRefund('Order is no longer awaiting payment.');
        }

        if (!result.amountBoundAtInit) {
            const amount = Number(result.amount);
            if (!Number.isFinite(amount) || amount + 0.005 < Number(siparis.toplamTutar)) {
                return rejectWithRefund('Paid amount does not match the order total.');
            }
        }

        const claimed = await this.orderRepository.markOrderPaid(siparis.id, odemeId);
        if (!claimed) {
            // Another request changed the order between the read and the update.
            const current = await this.orderRepository.getOrderById(siparis.id);
            if (current?.odemeId === odemeId) {
                return alreadyRecorded(current);
            }
            return rejectWithRefund('Order is no longer awaiting payment.');
        }

        await this.orderRepository.adjustStock(siparis.kalemler, -1);

        const freshOrder = await this.orderRepository.getOrderById(siparis.id);
        if (freshOrder) {
            await this.emailService.sendOrderConfirmation(freshOrder.eposta, freshOrder.ad, {
                id: freshOrder.id,
                orderNumber: freshOrder.siparisNumarasi,
                trackingToken: freshOrder.takipTokeni,
                total: freshOrder.toplamTutar,
                items: freshOrder.kalemler
            });
            await this.emailService.sendSellerNewOrderNotification(freshOrder);
        }

        return paid;
    }

    /**
     * Refunds a verified payment that could not be applied to its order. A failed refund is
     * logged for manual follow-up; it must not turn the callback into a retry loop.
     *
     * @param {string} odemeId - Provider-prefixed payment reference.
     * @param {number} amount  - Charged amount in TRY.
     * @param {string} reason  - Why the payment was not applied.
     * @private
     */
    async _refundUnappliedPayment(odemeId, amount, reason) {
        try {
            await this.paymentService.cancelPayment(odemeId, reason, Number(amount));
        } catch (error) {
            console.error('[Payment Refund Failed] Manual refund needed for %s:', odemeId, error);
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

        console.log('[Order Cancel] Order: %s, Reason: %s', order.siparisNumarasi, reason);

        let refundStatus = 'NONE';

        // A paid order is cancelled only after the gateway confirms the refund; otherwise the
        // customer would lose the money and the order would no longer show it.
        if (order.odemeDurumu === 'SUCCESS') {
            if (!order.odemeId) {
                throw new Error('Payment reference is missing; please contact customer support to cancel this order.');
            }
            try {
                await this.paymentService.cancelPayment(order.odemeId, reason, Number(order.toplamTutar));
            } catch (error) {
                console.error('[Payment Refund Failed] Order: %s', order.siparisNumarasi, error);
                throw new Error('Refund could not be completed; please contact customer support to cancel this order.');
            }
            refundStatus = 'SUCCESS';
            console.log('[Payment Refund] Successful, Order: %s', order.siparisNumarasi);
        }

        await this.orderRepository.cancelOrder(order.id, { refunded: refundStatus === 'SUCCESS' });
        if (refundStatus === 'SUCCESS') {
            // Stock was taken out when the payment arrived; an unpaid order never held any.
            await this.orderRepository.adjustStock(order.kalemler, 1);
        }

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
        return this.paymentService.getInstallmentOptions(bin, amount);
    }

    /**
     * Retrieves all orders for admin panel.
     */
    async getAllOrdersForAdmin() {
        return this.orderRepository.findAllForAdmin();
    }

    /**
     * Retrieves order details with logs.
     */
    async getOrderByIdWithDetails(id) {
        return this.orderRepository.getOrderByIdWithDetails(id);
    }

    /**
     * Updates an order by admin, logging status change histories.
     */
    async updateOrder(id, body) {
        const currentOrder = await this.orderRepository.getOrderById(id);
        if (!currentOrder) {
            throw new Error('Sipariş bulunamadı.');
        }

        const data = {};
        if (body.durum) data.durum = body.durum;
        if (body.kargoTakipNo !== undefined) data.kargoTakipNo = body.kargoTakipNo;
        if (body.kargoFirmasi !== undefined) data.kargoFirmasi = body.kargoFirmasi;
        if (body.faturaNo !== undefined) data.faturaNo = body.faturaNo;
        if (body.faturaDurumu !== undefined) data.faturaDurumu = body.faturaDurumu;
        if (body.durum === 'TESLIM_EDILDI' && !currentOrder.teslimTarihi) {
            data.teslimTarihi = new Date();
        }

        const updatedOrder = await this.orderRepository.update(id, data);

        if (body.durum && body.durum !== currentOrder.durum) {
            await this.orderRepository.createOrderHistory({
                siparisId: id,
                eskiDurum: currentOrder.durum,
                yeniDurum: body.durum,
                not: body.not || `Sipariş durumu ${body.durum} olarak güncellendi.`,
                islemYapan: 'ADMIN'
            });
        }

        return updatedOrder;
    }
}
