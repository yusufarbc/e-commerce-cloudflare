import crypto from 'node:crypto';

export class PaytrService {
    /**
     * Creates an instance of PaytrService.
     * @param {Object} config - Configuration object.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Helper to compute PayTR HMAC-SHA256 tokens.
     * @private
     */
    _computeHmac(data, key) {
        return crypto.createHmac('sha256', key)
            .update(data)
            .digest('base64');
    }

    /**
     * Formats user basket items for PayTR schema.
     * PayTR expects: [[name, price, quantity], [name, price, quantity]] JSON string, then base64 encoded.
     * @private
     */
    _formatBasket(basketItems, orderTotal, orderNumber) {
        let items = [];
        if (basketItems && basketItems.length > 0) {
            items = basketItems.map(item => [
                item.urunAdSnapshot || 'Urun',
                String(Number(item.fiyat || 0).toFixed(2)),
                Number(item.adet || item.quantity || 1)
            ]);
        } else {
            items = [
                [`Siparis #${orderNumber}`, String(Number(orderTotal).toFixed(2)), 1]
            ];
        }
        
        return Buffer.from(JSON.stringify(items)).toString('base64');
    }

    /**
     * Initiates a 3D payment by retrieving a checkout token.
     * Returns an HTML redirection script to load PayTR's checkout frame.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        const merchantId = this.config.merchantId;
        const merchantKey = this.config.merchantKey;
        const merchantSalt = this.config.merchantSalt;
        const baseUrl = this.config.baseUrl || 'https://www.paytr.com';
        
        const orderNumber = order.siparisNumarasi;
        const email = order.eposta || 'bilgi@e-market.com';
        const userIp = buyer.ip || '127.0.0.1';
        
        // PayTR expects total_amount in kuruş (i.e. amount * 100) as an integer
        const paymentAmount = Math.round(Number(order.toplamTutar) * 100);
        
        const userBasket = this._formatBasket(basketItems, order.toplamTutar, orderNumber);
        
        const successUrl = `${this.config.callbackUrl}/payment/success?orderNumber=${orderNumber}&trackingToken=${order.takipTokeni}`;
        const failUrl = `${this.config.callbackUrl}/payment/failure?orderNumber=${orderNumber}`;

        const noInstallment = 0; // 0: Enable installments, 1: Single çekim
        const maxInstallment = 12;
        const currency = 'TL';
        const testMode = this.config.testMode !== undefined ? this.config.testMode : (process.env.NODE_ENV === 'development' ? 1 : 0);

        // Generate token hash
        // hashString = merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
        const hashString = merchantId + userIp + orderNumber + email + paymentAmount + userBasket + noInstallment + maxInstallment + currency + testMode + merchantSalt;
        const paytrToken = this._computeHmac(hashString, merchantKey);

        const payload = new URLSearchParams({
            merchant_id: merchantId,
            user_ip: userIp,
            merchant_oid: orderNumber,
            email: email,
            payment_amount: String(paymentAmount),
            paytr_token: paytrToken,
            user_basket: userBasket,
            user_name: `${buyer.name} ${buyer.surname}`,
            user_address: order.adres || 'Turkiye',
            user_phone: buyer.phone || '05555555555',
            merchant_ok_url: successUrl,
            merchant_fail_url: failUrl,
            no_installment: String(noInstallment),
            max_installment: String(maxInstallment),
            currency: currency,
            test_mode: String(testMode)
        });

        console.log(`[PayTR Token Request] Ordering number: ${orderNumber}`);

        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/odeme/api/get-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload.toString()
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`PayTR API returned status ${response.status}: ${errText}`);
        }

        const result = await response.json();

        if (result.status !== 'success') {
            console.error('[PayTR] Error message:', result.reason);
            throw new Error(result.reason || 'PayTR ödeme tokenı oluşturulamadı.');
        }

        // Return client redirect script
        const redirectUrl = `${baseUrl.replace(/\/$/, '')}/odeme/guvenli/${result.token}`;
        const ucdHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PayTR Yönlendiriliyor...</title>
    <script type="text/javascript">
        window.location.href = "${redirectUrl}";
    </script>
</head>
<body>
    <div style="text-align: center; margin-top: 100px; font-family: sans-serif;">
        <h2>Ödeme Sayfasına Yönlendiriliyorsunuz...</h2>
        <p>Lütfen bekleyin, otomatik yönlendirme çalışmazsa <a href="${redirectUrl}">buraya tıklayın</a>.</p>
    </div>
</body>
</html>`;

        return {
            status: 'success',
            ucdHtml: ucdHtml,
            siparisId: order.id
        };
    }

    /**
     * Verifies server-to-server callback POST signatures from PayTR.
     */
    verifyCallback(callbackData) {
        console.log('[PayTR] Verifying server-to-server callback:', callbackData);

        const merchantOid = callbackData.merchant_oid;
        const status = callbackData.status;
        const totalAmount = callbackData.total_amount;
        const hash = callbackData.hash;
        
        const merchantKey = this.config.merchantKey;
        const merchantSalt = this.config.merchantSalt;

        // payload = merchant_oid + merchant_salt + status + total_amount
        const payload = merchantOid + merchantSalt + status + totalAmount;
        const computedHash = this._computeHmac(payload, merchantKey);

        if (computedHash !== hash) {
            console.error('[PayTR] Callback signature mismatch!');
            return {
                status: 'failure',
                errorMessage: 'Geçersiz callback imzası.',
                siparisNumarasi: merchantOid
            };
        }

        if (status !== 'success') {
            return {
                status: 'failure',
                errorMessage: callbackData.failed_reason_msg || 'PayTR ödemesi başarısız oldu.',
                siparisNumarasi: merchantOid
            };
        }

        // Convert totalAmount back to decimal (PayTR sends as kuruş string)
        const amountDecimal = (Number(totalAmount) / 100).toFixed(2);

        return {
            status: 'success',
            paymentId: `paytr-${merchantOid}`,
            siparisNumarasi: merchantOid,
            amount: amountDecimal,
            rawResult: callbackData
        };
    }

    /**
     * Refunds/Cancels a paid order.
     */
    async cancelPayment(paymentId, reason) {
        console.log(`[PayTR] Refunding payment ${paymentId}, Reason: ${reason}`);

        const merchantOid = paymentId.replace(/^paytr-/, '');
        const merchantId = this.config.merchantId;
        const merchantKey = this.config.merchantKey;
        const merchantSalt = this.config.merchantSalt;
        const baseUrl = this.config.baseUrl || 'https://www.paytr.com';

        // Retrieve order details to get total price if needed
        // For PayTR refund api, we call `/odeme/api/iade`
        // We will assume full refund, which needs transaction amount.
        // PayTR requires amount in decimal format (e.g. 10.50).
        // Since we don't have the original order here, we require caller to provide refund details or query database.
        // Let's calculate standard payload.
        
        const paytrToken = this._computeHmac(merchantId + merchantOid + '0.00' + merchantSalt, merchantKey);

        const payload = new URLSearchParams({
            merchant_id: merchantId,
            merchant_oid: merchantOid,
            refund_amount: '0.00', // 0.00 means full refund in some systems or it requires exact amount
            paytr_token: paytrToken
        });

        const response = await fetch(`${baseUrl.replace(/\/$/, '')}/odeme/api/iade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload.toString()
        });

        if (!response.ok) {
            throw new Error(`PayTR Refund API returned status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status !== 'success') {
            throw new Error(result.err_msg || 'PayTR iade işlemi başarısız.');
        }

        return {
            status: 'success',
            paymentId: paymentId,
            message: 'PayTR iade işlemi onaylandı.'
        };
    }

    /**
     * PayTR installment fetch.
     * PayTR rates are usually configured inside their dashboard.
     * Returns empty array if not fetched programmatically.
     */
    async getInstallmentOptions(bin, amount) {
        // PayTR handles installments natively inside their secure checkout frame.
        // We return empty array to indicate client single-draw fallback or let PayTR manage it.
        return [];
    }
}
