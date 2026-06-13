import crypto from 'node:crypto';

/**
 * IyzicoService — iyzico Payment Gateway Integration
 *
 * Implements the IPaymentProvider interface for the iyzico (iyzipay) payment gateway.
 * Communicates with iyzico's REST JSON API, computing IYZWSv2 authorization headers
 * using HMAC-SHA256 (required by iyzico's API specification).
 *
 * Sandbox base URL: https://sandbox-api.iyzipay.com
 * Production base URL: https://api.iyzipay.com
 *
 * @implements {IPaymentProvider}
 */
export class IyzicoService {
    /**
     * Creates an instance of IyzicoService.
     * @param {Object} config - Configuration object.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Builds the iyzico IYZWSv2 authorization header for a given request.
     *
     * The authorization scheme requires:
     *   1. A random nonce string (`x-iyzi-rnd`) included in the header.
     *   2. A Base64-encoded parameter string containing apiKey, randomKey, and HMAC-SHA256 signature.
     *
     * @param {string} rnd         - Random nonce string for this request.
     * @param {string} path        - API path (e.g. '/payment/3dsecure/initialize').
     * @param {Object} bodyObject  - Request payload, or null.
     * @returns {Object} HTTP headers object including Authorization and iyzico-specific fields.
     * @private
     */
    _getHeaders(rnd, path, bodyObject = null) {
        const apiKey = this.config.apiKey;
        const secretKey = this.config.secretKey;
        
        const bodyString = bodyObject ? JSON.stringify(bodyObject) : '';
        const signature = crypto
            .createHmac('sha256', secretKey)
            .update(rnd + path + bodyString)
            .digest('hex');
            
        const separator = ':';
        const authorizationParams = [
            'apiKey' + separator + apiKey,
            'randomKey' + separator + rnd,
            'signature' + separator + signature
        ];
        
        const base64Auth = btoa(authorizationParams.join('&'));
            
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-iyzi-rnd': rnd,
            'x-iyzi-client-version': 'iyzipay-node-2.0.67',
            'Authorization': `IYZWSv2 ${base64Auth}`
        };
    }

    /**
     * Sends an authenticated HTTP request to the iyzico REST API.
     *
     * Serialises the body to JSON if provided, computes the IYZWSv2 authorization header,
     * and throws a descriptive error on non-2xx HTTP responses.
     *
     * @param {string}  path        - API path (e.g. '/payment/3dsecure/initialize').
     * @param {string}  method      - HTTP method ('POST' or 'GET').
     * @param {Object|null} bodyObject - Request payload, or null for GET requests.
     * @returns {Promise<Object>}   Parsed JSON response from iyzico.
     * @throws {Error}              If the HTTP response status is not 2xx.
     * @private
     */
    async _request(path, method, bodyObject = null) {
        const baseUrl = this.config.baseUrl || 'https://sandbox-api.iyzipay.com';
        const url = `${baseUrl.replace(/\/$/, '')}${path}`;
        const rnd = Math.random().toString(36).substring(2, 12);
        
        const headers = this._getHeaders(rnd, path, bodyObject);
        const bodyString = bodyObject ? JSON.stringify(bodyObject) : '';
        
        console.log('[iyzico Request] %s %s', method, url);
        
        const response = await fetch(url, {
            method,
            headers,
            body: bodyObject ? bodyString : undefined
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`iyzico API failed with status ${response.status}: ${errText}`);
        }
        
        return response.json();
    }

    /**
     * Initiates a 3D Secure payment session via iyzico's initialize endpoint.
     *
     * Submits card details, buyer info, basket items, and callback URL to iyzico.
     * On success, iyzico returns a base64-encoded HTML page (`threeDSHtmlContent`)
     * that must be rendered in the browser to trigger the bank's 3D Secure step.
     *
     * @param {Object} order             - Order record (id, siparisNumarasi, toplamTutar, eposta, adres, etc.)
     * @param {Array}  basketItems       - Order line items used to populate iyzico's basketItems array.
     * @param {Object} buyer             - Buyer and card details.
     * @param {string} buyer.name        - First name.
     * @param {string} buyer.surname     - Last name.
     * @param {string} buyer.cardNumber  - 16-digit card number.
     * @param {string} buyer.cardExpMonth - Expiry month (1–12).
     * @param {string} buyer.cardExpYear  - Expiry year (2 or 4 digits).
     * @param {string} buyer.cardCvc     - 3-digit CVC.
     * @param {string} buyer.ip          - Cardholder IP address.
     * @returns {Promise<Object>} { status: 'success', ucdHtml: string, siparisId, conversationId }
     * @throws {Error} If iyzico returns a non-success status.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        const orderNumber = order.siparisNumarasi;
        const callbackUrl = `${this.config.callbackUrl}/api/v1/payment/callback/iyzico`;
        const totalAmount = Number(order.toplamTutar);
        
        // Prepare basket items formatted for iyzico
        let items = [];
        if (basketItems && basketItems.length > 0) {
            items = basketItems.map(item => ({
                id: item.urunId || 'item-id',
                name: item.urunAdSnapshot || 'Urun',
                category1: 'Genel',
                itemType: 'PHYSICAL',
                price: Number(item.toplamFiyat || item.fiyat).toFixed(2)
            }));
        } else {
            // Fallback: at least one item is mandatory in iyzico
            items = [{
                id: `order-${orderNumber}`,
                name: `Siparis #${orderNumber}`,
                category1: 'Genel',
                itemType: 'PHYSICAL',
                price: totalAmount.toFixed(2)
            }];
        }

        // Calculate sum of item prices
        let itemsPriceSum = items.reduce((sum, item) => sum + Number(item.price), 0);

        // Account for shipping costs or any other price gaps where totalAmount is higher
        const difference = totalAmount - itemsPriceSum;
        if (difference > 0.01) {
            items.push({
                id: `shipping-${orderNumber}`,
                name: 'Kargo Ucreti',
                category1: 'Kargo',
                itemType: 'VIRTUAL',
                price: difference.toFixed(2)
            });
            // Recalculate sum of item prices
            itemsPriceSum = items.reduce((sum, item) => sum + Number(item.price), 0);
        }

        const payload = {
            locale: 'tr',
            conversationId: orderNumber,
            price: itemsPriceSum.toFixed(2), // Total sum of all items in the basket
            paidPrice: totalAmount.toFixed(2), // Actual amount charged to the card
            currency: 'TRY',
            installment: 1, // Must be an integer per iyzico specifications
            paymentChannel: 'WEB', // Required parameter
            paymentGroup: 'PRODUCT', // Required parameter
            basketId: orderNumber,
            paymentCard: {
                cardHolderName: `${buyer.name} ${buyer.surname}`.toUpperCase(),
                cardNumber: buyer.cardNumber,
                expireMonth: buyer.cardExpMonth.padStart(2, '0'),
                expireYear: buyer.cardExpYear.length === 2 ? `20${buyer.cardExpYear}` : buyer.cardExpYear,
                cvc: buyer.cardCvc
            },
            buyer: {
                id: order.id,
                name: buyer.name,
                surname: buyer.surname,
                gsmNumber: buyer.phone || '+905555555555',
                email: order.eposta,
                identityNumber: '11111111111',
                registrationAddress: order.adres,
                ip: buyer.ip || '127.0.0.1',
                city: order.sehir,
                country: 'Turkey',
                zipCode: order.postaKodu
            },
            shippingAddress: {
                contactName: `${buyer.name} ${buyer.surname}`,
                city: order.sehir,
                country: 'Turkey',
                address: order.adres,
                zipCode: order.postaKodu
            },
            billingAddress: {
                contactName: `${buyer.name} ${buyer.surname}`,
                city: order.sehir,
                country: 'Turkey',
                address: order.adres,
                zipCode: order.postaKodu
            },
            basketItems: items,
            callbackUrl: callbackUrl
        };

        const result = await this._request('/payment/3dsecure/initialize', 'POST', payload);

        if (result.status !== 'success') {
            console.error('[iyzico] Initialization error:', result.errorMessage);
            throw new Error(result.errorMessage || 'iyzico ödeme başlatma başarısız oldu.');
        }

        // iyzico returns base64 HTML code inside threeDSHtmlContent
        let htmlContent = result.threeDSHtmlContent || '';
        if (htmlContent && !htmlContent.trim().startsWith('<')) {
            // If it is base64 encoded
            try {
                if (typeof Buffer !== 'undefined') {
                    htmlContent = Buffer.from(htmlContent, 'base64').toString('utf-8');
                } else if (typeof atob === 'function') {
                    htmlContent = decodeURIComponent(escape(atob(htmlContent)));
                }
            } catch (e) {
                // Not base64 or decode failed
            }
        }

        return {
            status: 'success',
            ucdHtml: htmlContent,
            siparisId: order.id,
            conversationId: result.conversationId
        };
    }

    /**
     * Verifies an iyzico 3D Secure callback and confirms the payment with iyzico's auth endpoint.
     *
     * iyzico POSTs a callback containing `paymentId`, `conversationId`, and `status`.
     * We re-confirm with iyzico's `/payment/3dsec/auth` endpoint to prevent tampering.
     *
     * @param {Object} callbackData                - POST body from iyzico's 3D callback.
     * @param {string} callbackData.paymentId      - iyzico payment transaction ID.
     * @param {string} callbackData.conversationId - Our order number (siparisNumarasi).
     * @param {string} callbackData.status         - 'success' or 'failure'.
     * @returns {Promise<Object>} { status, paymentId?, siparisNumarasi, amount?, rawResult? }
     */
    async verifyCallback(callbackData) {
        console.log('[iyzico] Verifying callback:', callbackData);
        
        const paymentId = callbackData.paymentId;
        const conversationId = callbackData.conversationId;
        const status = callbackData.status;

        if (status !== 'success' || !paymentId) {
            return {
                status: 'failure',
                errorMessage: 'Ödeme işlemi iptal edildi veya başarısız.',
                siparisNumarasi: conversationId
            };
        }

        // Query payment detail to verify transaction securely
        try {
            const detailPayload = {
                locale: 'tr',
                conversationId: conversationId,
                paymentId: paymentId
            };

            if (callbackData.conversationData) {
                detailPayload.conversationData = callbackData.conversationData;
            }

            const verificationResult = await this._request('/payment/3dsecure/auth', 'POST', detailPayload);
            
            if (verificationResult.status === 'success') {
                return {
                    status: 'success',
                    paymentId: verificationResult.paymentId,
                    siparisNumarasi: conversationId,
                    amount: verificationResult.paidPrice,
                    rawResult: verificationResult
                };
            } else {
                return {
                    status: 'failure',
                    errorMessage: verificationResult.errorMessage || 'Ödeme doğrulama hatası.',
                    siparisNumarasi: conversationId
                };
            }
        } catch (error) {
            console.error('[iyzico] Secure verification detail check failed:', error);
            return {
                status: 'failure',
                errorMessage: error.message || 'Ödeme doğrulanamadı.',
                siparisNumarasi: conversationId
            };
        }
    }

    /**
     * Refunds a paid iyzico transaction via the /payment/refund endpoint.
     *
     * Performs a full refund by paymentId. iyzico issues a unique refund conversationId
     * to correlate the refund request.
     *
     * @param {string} paymentId - iyzico payment transaction ID to refund.
     * @param {string} reason    - Human-readable refund reason (logged only; not sent to iyzico).
     * @returns {Promise<Object>} { status: 'success', paymentId, message }
     * @throws {Error} If iyzico returns a non-success status.
     */
    async cancelPayment(paymentId, reason) {
        console.log('[iyzico] Refunding payment %s, Reason: %s', paymentId, reason);

        const payload = {
            locale: 'tr',
            conversationId: Math.floor(100000 + Math.random() * 900000).toString(),
            paymentId: paymentId,
            ip: '127.0.0.1'
        };

        // iyzico has refund endpoint
        const result = await this._request('/payment/refund', 'POST', payload);

        if (result.status !== 'success') {
            throw new Error(result.errorMessage || 'iyzico iade işlemi başarısız.');
        }

        return {
            status: 'success',
            paymentId: paymentId,
            message: 'iyzico iade işlemi onaylandı.'
        };
    }

    /**
     * Queries available installment plans for a card BIN via iyzico's installment check endpoint.
     *
     * Maps iyzico's `installmentPrices` response into the shared { Taksit, Komi_Oran } format
     * used across all provider implementations. Single-draw (1 instalment) entries are excluded
     * since they are always available and shown separately in the UI.
     *
     * @param {string} bin    - First 6 digits of the card number (BIN/IIN).
     * @param {number} amount - Total transaction amount in TRY.
     * @returns {Promise<Array<{Taksit: number, Komi_Oran: number}>>} Installment plan list, or [] on error.
     */
    async getInstallmentOptions(bin, amount) {
        const payload = {
            locale: 'tr',
            conversationId: Math.random().toString(36).substring(7),
            binNumber: bin.slice(0, 6),
            price: Number(amount).toFixed(2)
        };

        try {
            const result = await this._request('/payment/installment/check', 'POST', payload);
            
            if (result.status !== 'success' || !result.installmentDetails || result.installmentDetails.length === 0) {
                return [];
            }

            const details = result.installmentDetails[0];
            const prices = details.installmentPrices || [];
            
            // Format to fit common format: { Taksit: number, Komi_Oran: number }
            return prices.map(priceInfo => {
                const count = priceInfo.installmentNumber;
                const total = parseFloat(priceInfo.totalPrice);
                const commission = total > amount ? ((total - amount) / amount) : 0;
                
                return {
                    Taksit: count,
                    Komi_Oran: commission
                };
            }).filter(item => item.Taksit > 1);
        } catch (err) {
            console.error('[iyzico] Get installments error:', err);
            return [];
        }
    }
}
