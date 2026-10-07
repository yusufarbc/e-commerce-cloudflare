import crypto from 'node:crypto';
import { escapeMarkup } from '../utils/escape.js';
import { timingSafeEqual } from '../utils/timingSafeEqual.js';

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
        const email = order.eposta || 'bilgi@ecommerceflaredev.web.tr';
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
    <form id="paytr-form" action="${escapeMarkup(actionUrl)}" method="post">
        <input type="hidden" name="cc_owner" value="${escapeMarkup(ccOwner)}">
        <input type="hidden" name="card_number" value="${escapeMarkup(cardNumber)}">
        <input type="hidden" name="expiry_month" value="${escapeMarkup(expiryMonth)}">
        <input type="hidden" name="expiry_year" value="${escapeMarkup(expiryYear)}">
        <input type="hidden" name="cvv" value="${escapeMarkup(cvv)}">
        <input type="hidden" name="merchant_id" value="${escapeMarkup(merchantId)}">
        <input type="hidden" name="user_ip" value="${escapeMarkup(userIp)}">
        <input type="hidden" name="merchant_oid" value="${escapeMarkup(orderNumber)}">
        <input type="hidden" name="email" value="${escapeMarkup(email)}">
        <input type="hidden" name="payment_type" value="${escapeMarkup(paymentType)}">
        <input type="hidden" name="payment_amount" value="${escapeMarkup(paymentAmount)}">
        <input type="hidden" name="currency" value="${escapeMarkup(currency)}">
        <input type="hidden" name="test_mode" value="${escapeMarkup(testMode)}">
        <input type="hidden" name="non_3d" value="${escapeMarkup(non3d)}">
        <input type="hidden" name="merchant_ok_url" value="${escapeMarkup(successUrl)}">
        <input type="hidden" name="merchant_fail_url" value="${escapeMarkup(failUrl)}">
        <input type="hidden" name="user_name" value="${escapeMarkup(`${buyer.name} ${buyer.surname}`.toUpperCase())}">
        <input type="hidden" name="user_address" value="${escapeMarkup(order.adres || 'Turkiye')}">
        <input type="hidden" name="user_phone" value="${escapeMarkup(buyer.phone || '05555555555')}">
        <input type="hidden" name="user_basket" value="${escapeMarkup(userBasket)}">
        <input type="hidden" name="debug_on" value="${escapeMarkup(debugOn)}">
        <input type="hidden" name="client_lang" value="${escapeMarkup(clientLang)}">
        <input type="hidden" name="paytr_token" value="${escapeMarkup(paytrToken)}">
        <input type="hidden" name="non3d_test_failed" value="${escapeMarkup(non3dTestFailed)}">
        <input type="hidden" name="installment_count" value="${escapeMarkup(installmentCount)}">
        <input type="hidden" name="card_type" value="${escapeMarkup(cardType)}">
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

        // With PayTR unconfigured the key and salt are empty strings, and anyone can compute an
        // HMAC under an empty key, so an unconfigured provider must reject every notification.
        if (!merchantKey || !merchantSalt || typeof hash !== 'string') {
            return {
                status: 'failure',
                errorMessage: 'PayTR yapılandırılmamış veya imza eksik.',
                siparisNumarasi: merchantOid
            };
        }

        // payload = merchant_oid + merchant_salt + status + total_amount
        const payload = merchantOid + merchantSalt + status + totalAmount;
        const computedHash = this._computeHmac(payload, merchantKey);

        if (!timingSafeEqual(computedHash, hash)) {
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
            paymentId: merchantOid,
            siparisNumarasi: merchantOid,
            amount: amountDecimal,
            rawResult: callbackData
        };
    }

    /**
     * Initiates a full refund for a PayTR transaction via /odeme/api/iade.
     *
     * PayTR has no "refund everything" shortcut: `return_amount` must be the amount to refund,
     * and the token signs merchant_id + merchant_oid + return_amount + merchant_salt.
     *
     * @param {string} merchantOid - PayTR merchant_oid (our order number).
     * @param {string} reason      - Human-readable refund reason (logged only).
     * @param {number} amount      - Charged amount in TRY.
     * @returns {Promise<Object>} { status: 'success', paymentId, message }
     * @throws {Error} If the amount is missing or PayTR API returns a non-success response.
     */
    async cancelPayment(merchantOid, reason, amount) {
        console.log('[PayTR] Refunding payment %s, Reason: %s', merchantOid, reason);

        if (!(Number(amount) > 0)) {
            throw new Error('PayTR iadesi için tutar gereklidir.');
        }

        const merchantId = this.config.merchantId;
        const merchantKey = this.config.merchantKey;
        const merchantSalt = this.config.merchantSalt;
        const baseUrl = this.config.baseUrl || 'https://www.paytr.com';
        const returnAmount = Number(amount).toFixed(2);

        const paytrToken = this._computeHmac(merchantId + merchantOid + returnAmount + merchantSalt, merchantKey);

        const payload = new URLSearchParams({
            merchant_id: merchantId,
            merchant_oid: merchantOid,
            return_amount: returnAmount,
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
            paymentId: merchantOid,
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
