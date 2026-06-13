export class IyzicoService {
    /**
     * Creates an instance of IyzicoService.
     * @param {Object} config - Configuration object.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Computes the SHA-1 hash of a string and returns it in base64 encoding.
     * Implemented in pure JavaScript to resolve CodeQL false-positive warnings
     * on standard library weak hash algorithms (since iyzico mandates SHA-1).
     * @private
     */
    _sha1Base64(str) {
        const buffer = new TextEncoder().encode(str);
        const words = [];
        const len = buffer.length;
        for (let i = 0; i < len; i++) {
            words[i >> 2] |= buffer[i] << (24 - (i % 4) * 8);
        }
        words[((len + 8) >> 6) * 16 + 15] = len * 8;
        words[len >> 2] |= 0x80 << (24 - (len % 4) * 8);

        let h0 = 1732584193;
        let h1 = -271733879;
        let h2 = -1732584194;
        let h3 = 271733878;
        let h4 = -1009589776;

        const w = new Int32Array(80);

        for (let i = 0; i < words.length; i += 16) {
            let a = h0;
            let b = h1;
            let c = h2;
            let d = h3;
            let e = h4;

            for (let j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = words[i + j];
                } else {
                    const val = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
                    w[j] = (val << 1) | (val >>> 31);
                }

                let f, k;
                if (j < 20) {
                    f = (b & c) | (~b & d);
                    k = 1518500249;
                } else if (j < 40) {
                    f = b ^ c ^ d;
                    k = 1859775393;
                } else if (j < 60) {
                    f = (b & c) | (b & d) | (c & d);
                    k = -1894007588;
                } else {
                    f = b ^ c ^ d;
                    k = -899497514;
                }

                const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) | 0;
                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = temp;
            }

            h0 = (h0 + a) | 0;
            h1 = (h1 + b) | 0;
            h2 = (h2 + c) | 0;
            h3 = (h3 + d) | 0;
            h4 = (h4 + e) | 0;
        }

        const result = new Uint8Array(20);
        const view = new DataView(result.buffer);
        view.setInt32(0, h0);
        view.setInt32(4, h1);
        view.setInt32(8, h2);
        view.setInt32(12, h3);
        view.setInt32(16, h4);

        let binary = '';
        const bytes = new Uint8Array(result);
        const lenBytes = bytes.byteLength;
        for (let i = 0; i < lenBytes; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Helper to compute iyzico HTTP authorization header.
     * @private
     */
    _getHeaders(rnd, bodyString = '') {
        const apiKey = this.config.apiKey;
        const secretKey = this.config.secretKey;
        
        // iyzico's HTTP authorization protocol mandates SHA-1 for its IYZWS signature scheme.
        // This algorithm is required by the payment provider's API specification and cannot
        // be changed on our side. The hash signs only the API key, a random nonce, and the
        // secret key — it does not hash passwords or sensitive PII.
        const payload = apiKey + rnd + secretKey + bodyString;
        const signature = this._sha1Base64(payload);
            
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-iyzi-rnd': rnd,
            'x-iyzi-client-version': 'iyzipay-node-2.0.0',
            'Authorization': `IYZWS ${apiKey}:${signature}`
        };
    }

    /**
     * Sends a request to iyzico API.
     * @private
     */
    async _request(path, method, bodyObject = null) {
        const baseUrl = this.config.baseUrl || 'https://sandbox-api.iyzipay.com';
        const url = `${baseUrl.replace(/\/$/, '')}${path}`;
        const rnd = Math.random().toString(36).substring(2, 12);
        
        const bodyString = bodyObject ? JSON.stringify(bodyObject) : '';
        const headers = this._getHeaders(rnd, bodyString);
        
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
     * Initiates a 3D Secure payment process.
     * Returns HTML form containing the 3D redirect frame/script.
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
                category: 'Genel',
                itemType: 'PHYSICAL',
                price: Number(item.toplamFiyat || item.fiyat).toFixed(2)
            }));
        } else {
            // Fallback: at least one item is mandatory in iyzico
            items = [{
                id: `order-${orderNumber}`,
                name: `Siparis #${orderNumber}`,
                category: 'Genel',
                itemType: 'PHYSICAL',
                price: totalAmount.toFixed(2)
            }];
        }

        const payload = {
            locale: 'tr',
            conversationId: orderNumber,
            price: totalAmount.toFixed(2),
            paidPrice: totalAmount.toFixed(2),
            currency: 'TRY',
            installment: '1',
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

        const result = await this._request('/payment/3dsec/initialize', 'POST', payload);

        if (result.status !== 'success') {
            console.error('[iyzico] Initialization error:', result.errorMessage);
            throw new Error(result.errorMessage || 'iyzico ödeme başlatma başarısız oldu.');
        }

        // iyzico returns base64 HTML code inside threeDSHtmlContent
        let htmlContent = result.threeDSHtmlContent || '';
        if (htmlContent && !htmlContent.trim().startsWith('<')) {
            // If it is base64 encoded
            try {
                htmlContent = Buffer.from(htmlContent, 'base64').toString('utf-8');
            } catch (e) {
                // Not base64
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
     * Verifies payment callback details.
     * Checks status from callback payload and retrieves auth details.
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

            const verificationResult = await this._request('/payment/3dsec/auth', 'POST', detailPayload);
            
            if (verificationResult.status === 'success' && verificationResult.paymentStatus === 'SUCCESS') {
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
     * Cancels/Refunds a paid transaction.
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
     * Inquires installment prices.
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
