/**
 * PaymentService — Strategy Pattern Orchestrator
 *
 * Implements the Strategy design pattern for payment provider selection.
 * At runtime, the active provider is resolved from config (PAYMENT_PROVIDER env var)
 * and all payment operations are delegated to the corresponding concrete service.
 *
 * Supported providers: 'iyzico' | 'param' | 'paytr'
 *
 * ---
 * IPaymentProvider interface contract (all concrete services MUST implement):
 *
 * @typedef {Object} IPaymentProvider
 * @property {function(order: Object, basketItems: Array, buyer: Object): Promise<Object>} startPaymentProcess
 *   Initiates a 3D Secure payment. Returns an object containing at minimum { status, ucdHtml }.
 * @property {function(callbackData: Object): Promise<Object>|Object} verifyCallback
 *   Verifies the gateway's callback payload. Returns { status, paymentId, siparisNumarasi, amount, ... }.
 *   `siparisNumarasi` and `amount` must come from data the gateway vouches for (a signature or a
 *   server-to-server confirmation), never from unsigned fields of the browser POST. A provider whose
 *   amount was fixed by a signed request at initiation returns `amountBoundAtInit: true` instead.
 * @property {function(paymentId: string, reason: string, amount: number): Promise<Object>} cancelPayment
 *   Cancels or fully refunds a completed payment. Returns { status, message }.
 * @property {function(bin: string, amount: number): Promise<Array>} getInstallmentOptions
 *   Returns available installment plans for a card BIN. Returns empty array if not supported.
 */
export class PaymentService {
    /**
     * Creates an instance of PaymentService.
     *
     * Constructor follows Dependency Inversion Principle — all concrete provider
     * implementations are injected, never instantiated here.
     *
     * @param {Object} paramService   - Concrete Param POS payment strategy.
     * @param {Object} iyzicoService  - Concrete iyzico payment strategy.
     * @param {Object} paytrService   - Concrete PayTR payment strategy.
     * @param {Object} config         - Global application config object.
     */
    constructor(paramService, iyzicoService, paytrService, config) {
        this.paramService = paramService;
        this.iyzicoService = iyzicoService;
        this.paytrService = paytrService;
        this.config = config;
    }

    /**
     * Resolves the name of the currently active payment provider from config.
     *
     * Reads PAYMENT_PROVIDER env var (via config). Defaults to 'iyzico' if unset.
     * Value is normalised to lowercase and trimmed for safe comparison.
     *
     * @returns {'iyzico'|'param'|'paytr'} The active provider identifier.
     */
    getProvider() {
        return (this.config.paymentProvider || 'iyzico').toLowerCase().trim();
    }

    /**
     * Resolves and returns the concrete provider service instance for the given provider name.
     *
     * Implements the Strategy selection logic (Open/Closed Principle: adding a new provider
     * only requires a new service class and a new branch here, without modifying callers).
     *
     * @param {string} [provider] - Optional provider name override. Falls back to getProvider().
     * @returns {Object} The concrete payment provider service instance.
     * @private
     */
    _getService(provider) {
        const active = provider || this.getProvider();

        if (active === 'iyzico') return this.iyzicoService;
        if (active === 'paytr')  return this.paytrService;

        // Default fallback — Param POS
        return this.paramService;
    }

    /**
     * Initiates a 3D Secure payment process via the active provider.
     *
     * @param {Object} order       - Siparis model record (id, siparisNumarasi, toplamTutar, etc.)
     * @param {Array}  basketItems - Line items for the order.
     * @param {Object} buyer       - Buyer details including card data and IP address.
     * @returns {Promise<Object>}  Provider response containing { status, ucdHtml, ... }.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        const service = this._getService();
        console.log('[PaymentService] Starting payment — provider: %s', this.getProvider());
        return service.startPaymentProcess(order, basketItems, buyer);
    }

    /**
     * Verifies a 3D Secure callback payload from the gateway.
     *
     * The provider is determined from the `provider` argument when available
     * (e.g. for iyzico and PayTR callbacks which arrive at provider-specific endpoints),
     * otherwise falls back to the globally active provider.
     *
     * @param {Object} callbackData - Raw callback body from the payment gateway.
     * @param {string} [provider]   - Explicit provider identifier (e.g. 'iyzico', 'paytr').
     * @returns {Promise<Object>}   Verification result: { status, paymentId, siparisNumarasi, ... }.
     */
    async verifyCallback(callbackData, provider) {
        const activeProvider = provider || this.getProvider();
        const service = this._getService(activeProvider);
        console.log('[PaymentService] Verifying callback — provider: %s', activeProvider);
        return service.verifyCallback(callbackData);
    }

    /**
     * Builds the payment reference stored on the order (`odemeId`). The provider prefix keeps
     * refunds routed to the gateway that took the payment, even if PAYMENT_PROVIDER changes later.
     *
     * @param {string} provider  - 'iyzico' | 'param' | 'paytr'.
     * @param {string} paymentId - Provider-specific payment reference.
     * @returns {string} e.g. 'iyzico-12345678'.
     */
    static paymentReference(provider, paymentId) {
        return `${provider}-${paymentId}`;
    }

    /**
     * Splits a stored payment reference into provider and provider-specific id.
     * References without a known prefix are attributed to the active provider.
     *
     * @param {string} reference - Value of `odemeId`.
     * @returns {{ provider: string, paymentId: string }}
     */
    parsePaymentReference(reference) {
        const match = /^(iyzico|param|paytr)-(.+)$/.exec(reference || '');
        if (match) {
            return { provider: match[1], paymentId: match[2] };
        }
        return { provider: this.getProvider(), paymentId: reference };
    }

    /**
     * Cancels or fully refunds a completed payment transaction.
     *
     * @param {string} reference - Stored payment reference (`odemeId`, provider-prefixed).
     * @param {string} reason    - Human-readable cancellation reason.
     * @param {number} amount    - Amount that was charged, in TRY (PayTR needs it for a full refund).
     * @returns {Promise<Object>} Refund result: { status, message }.
     */
    async cancelPayment(reference, reason, amount) {
        const { provider, paymentId } = this.parsePaymentReference(reference);
        const service = this._getService(provider);
        console.log('[PaymentService] Cancelling payment — provider: %s', provider);
        return service.cancelPayment(paymentId, reason, amount);
    }

    /**
     * Queries installment options for a given card BIN and transaction amount.
     *
     * Uses the active provider's installment API. Providers that do not support
     * programmatic installment queries (e.g. PayTR) return an empty array.
     *
     * @param {string} bin    - First 6 digits of the card number (BIN/IIN).
     * @param {number} amount - Total transaction amount in TRY.
     * @returns {Promise<Array>} Array of installment option objects, or [] if not supported.
     */
    async getInstallmentOptions(bin, amount) {
        const service = this._getService();
        console.log('[PaymentService] Fetching installments — provider: %s', this.getProvider());
        return service.getInstallmentOptions(bin, amount);
    }
}
