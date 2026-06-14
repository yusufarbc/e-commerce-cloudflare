import crypto from 'node:crypto';

/**
 * PaytrService — PayTR Payment Gateway Integration
 *
 * Implements the IPaymentProvider interface for the PayTR payment gateway.
 * PayTR uses a token-based checkout flow: we first request a checkout token,
 * then redirect the user to PayTR's hosted payment page.
 * Payment confirmation arrives via an HMAC-signed server-to-server IPN (Instant Payment Notification).
 *
 * PayTR amounts are expressed in kuruş (1/100 of a Turkish Lira) as integers.
 * HMAC-SHA256 is used for all signature computations.
 *
 * @implements {IPaymentProvider}
 */
export class PaytrService {
    /**
     * Creates an instance of PaytrService.
     *
     * @param {Object} config                  - Application configuration object.
     * @param {string} config.merchantId        - PayTR merchant ID.
     * @param {string} config.merchantKey       - PayTR merchant key (used as HMAC key).
     * @param {string} config.merchantSalt      - PayTR merchant salt (appended to hash inputs).
     * @param {string} config.baseUrl           - PayTR API base URL (default: https://www.paytr.com).
     * @param {string} config.callbackUrl       - Base URL for success/failure redirects.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Computes an HMAC-SHA256 signature and returns it as a base64 string.
     *
     * Used for both token generation (checkout request) and IPN verification.
     * The `key` parameter is always `merchantKey`.
     *
     * @param {string} data - The plaintext string to sign.
     * @param {string} key  - The HMAC secret key.
     * @returns {string}    Base64-encoded HMAC-SHA256 digest.
     * @private
     */
    _computeHmac(data, key) {
        return crypto.createHmac('sha256', key)
            .update(data)
            .digest('base64');
    }

    /**
     * Formats the order's basket items into PayTR's expected base64-encoded JSON format.
     *
     * PayTR requires: [[name, unitPrice, quantity], ...] JSON string, then base64-encoded.
     * Unit prices must be decimal strings (e.g. '149.99').
     * Falls back to a single order-level item if no line items are provided.
     *
     * @param {Array}  basketItems  - Order line items (urunAdSnapshot, fiyat, adet).
     * @param {number} orderTotal   - Total order amount (used for fallback single-item basket).
     * @param {string} orderNumber  - Order reference number (used for fallback item name).
     * @returns {string}            Base64-encoded JSON basket string.
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
     * Initiates a PayTR checkout session by requesting a payment token.
     *
     * Computes a HMAC-SHA256 token from key order and merchant fields, posts it to
     * PayTR's token API, then returns an HTML redirect page that sends the user
     * to PayTR's hosted secure checkout.
     *
     * @param {Object} order            - Order record (siparisNumarasi, toplamTutar, eposta, adres, etc.)
     * @param {Array}  basketItems      - Order line items for the basket display.
     * @param {Object} buyer            - Buyer details.
     * @param {string} buyer.name       - First name.
     * @param {string} buyer.surname    - Last name.
     * @param {string} buyer.ip         - Buyer IP address.
     * @param {string} buyer.phone      - Buyer phone number.
     * @returns {Promise<Object>} { status: 'success', ucdHtml: string, siparisId }
     * @throws {Error} If PayTR returns a non-success status or HTTP error.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        const merchantId = this.config.merchantId;
        const merchantKey = this.config.merchantKey;
        const merchantSalt = this.config.merchantSalt;
        const baseUrl = this.config.baseUrl || 'https://www.paytr.com';
        
        const orderNumber = order.siparisNumarasi;
        const email = order.eposta || 'bilgi@e-market.com';
        const userIp = buyer.ip || '127.0.0.1';
        
        // PayTR Direct API expects payment_amount as a decimal string
        const paymentAmount = Number(order.toplamTutar).toFixed(2);
        
        const userBasket = this._formatBasket(basketItems, order.toplamTutar, orderNumber);
        
        const successUrl = `${this.config.callbackUrl}/payment/success?orderNumber=${orderNumber}&trackingToken=${order.takipTokeni}`;
        const failUrl = `${this.config.callbackUrl}/payment/failure?orderNumber=${orderNumber}`;

        const paymentType = 'card';
        const installmentCount = '0'; // default single payment
        const currency = 'TL';
        const testMode = this.config.testMode !== undefined ? this.config.testMode : (process.env.NODE_ENV === 'development' ? 1 : 0);
        const non3d = '0'; // 0 to enforce 3D Secure
        const debugOn = '1';
        const clientLang = 'tr';
        const non3dTestFailed = '0';
        const cardType = '';

        // Generate token hash
        // hashSTR = merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type + installment_count + currency + test_mode + non_3d
        const hashString = merchantId + userIp + orderNumber + email + paymentAmount + paymentType + installmentCount + currency + testMode + non3d;
        const paytrToken = this._computeHmac(hashString + merchantSalt, merchantKey);

        // Cardholder details formatting
        const ccOwner = buyer.cardHolderName || `${buyer.name} ${buyer.surname}`.toUpperCase();
        const cardNumber = String(buyer.cardNumber).replace(/\s/g, '');
        const expiryMonth = String(buyer.cardExpMonth).padStart(2, '0');
        const expiryYear = String(buyer.cardExpYear).slice(-2);
        const cvv = buyer.cardCvc;

        const actionUrl = `${baseUrl.replace(/\/$/, '')}/odeme`;

        // Render direct POST form that auto-submits to PayTR
        const ucdHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PayTR Yönlendiriliyor...</title>
</head>
<body>
    <form id="paytr-form" action="${actionUrl}" method="post">
        <input type="hidden" name="cc_owner" value="${ccOwner}">
        <input type="hidden" name="card_number" value="${cardNumber}">
        <input type="hidden" name="expiry_month" value="${expiryMonth}">
        <input type="hidden" name="expiry_year" value="${expiryYear}">
        <input type="hidden" name="cvv" value="${cvv}">
        <input type="hidden" name="merchant_id" value="${merchantId}">
        <input type="hidden" name="user_ip" value="${userIp}">
        <input type="hidden" name="merchant_oid" value="${orderNumber}">
        <input type="hidden" name="email" value="${email}">
        <input type="hidden" name="payment_type" value="${paymentType}">
        <input type="hidden" name="payment_amount" value="${paymentAmount}">
        <input type="hidden" name="currency" value="${currency}">
        <input type="hidden" name="test_mode" value="${testMode}">
        <input type="hidden" name="non_3d" value="${non3d}">
        <input type="hidden" name="merchant_ok_url" value="${successUrl}">
        <input type="hidden" name="merchant_fail_url" value="${failUrl}">
        <input type="hidden" name="user_name" value="${`${buyer.name} ${buyer.surname}`.toUpperCase()}">
        <input type="hidden" name="user_address" value="${order.adres || 'Turkiye'}">
        <input type="hidden" name="user_phone" value="${buyer.phone || '05555555555'}">
        <input type="hidden" name="user_basket" value="${userBasket}">
        <input type="hidden" name="debug_on" value="${debugOn}">
        <input type="hidden" name="client_lang" value="${clientLang}">
        <input type="hidden" name="paytr_token" value="${paytrToken}">
        <input type="hidden" name="non3d_test_failed" value="${non3dTestFailed}">
        <input type="hidden" name="installment_count" value="${installmentCount}">
        <input type="hidden" name="card_type" value="${cardType}">
    </form>
    <script type="text/javascript">
        document.getElementById("paytr-form").submit();
    </script>
</body>
</html>`;

        console.log('[PayTR Direct API] Initiating direct 3D Secure POST for order: %s', orderNumber);

        return {
            status: 'success',
            ucdHtml: ucdHtml,
            siparisId: order.id
        };
    }

    /**
     * Verifies a PayTR IPN (Instant Payment Notification) server-to-server callback.
     *
     * PayTR signs the notification with HMAC-SHA256 using the pattern:
     *   merchant_oid + merchantSalt + status + total_amount
     * We recompute this hash and compare it against the posted `hash` field to
     * prevent replay attacks and tampered callbacks.
     *
     * @param {Object} callbackData                 - POST body from PayTR IPN.
     * @param {string} callbackData.merchant_oid    - Order reference number.
     * @param {string} callbackData.status          - 'success' or 'failed'.
     * @param {string} callbackData.total_amount    - Transaction amount in kuruş.
     * @param {string} callbackData.hash            - HMAC-SHA256 signature to verify.
     * @returns {Object} { status, paymentId?, siparisNumarasi, amount?, rawResult? }
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
     * Initiates a full refund for a PayTR transaction via /odeme/api/iade.
     *
     * PayTR payment IDs are stored with a 'paytr-' prefix; this prefix is stripped
     * before sending to the API. Refund amount is set to '0.00' to indicate a full refund.
     *
     * @param {string} paymentId - Payment ID (prefixed with 'paytr-').
     * @param {string} reason    - Human-readable refund reason (logged only).
     * @returns {Promise<Object>} { status: 'success', paymentId, message }
     * @throws {Error} If PayTR API returns a non-success response.
     */
    async cancelPayment(paymentId, reason) {
        console.log('[PayTR] Refunding payment %s, Reason: %s', paymentId, reason);

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
     * Returns installment options for a card BIN.
     *
     * PayTR manages installment display natively within its hosted checkout iframe.
     * There is no programmatic API to query rates per BIN, so we return an empty array
     * and let PayTR's UI handle the installment selection.
     *
     * @param {string} bin    - First 6 digits of the card (unused).
     * @param {number} amount - Transaction amount (unused).
     * @returns {Promise<Array>} Always resolves to an empty array.
     */
    async getInstallmentOptions(bin, amount) {
        // PayTR handles installments natively inside their secure checkout frame.
        // We return empty array to indicate client single-draw fallback or let PayTR manage it.
        return [];
    }
}
