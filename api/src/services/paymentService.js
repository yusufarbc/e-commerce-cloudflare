/**
 * Unified Payment Service Orchestrator
 * 
 * Strategy pattern coordinator that dispatches calls to the active payment provider
 * (Param, iyzico, or PayTR) dynamically at runtime.
 */
export class PaymentService {
    /**
     * Creates an instance of PaymentService.
     * @param {import('./paramService.js').ParamService} paramService
     * @param {import('./iyzicoService.js').IyzicoService} iyzicoService
     * @param {import('./paytrService.js').PaytrService} paytrService
     * @param {Object} config - System config object.
     */
    constructor(paramService, iyzicoService, paytrService, config) {
        this.paramService = paramService;
        this.iyzicoService = iyzicoService;
        this.paytrService = paytrService;
        this.config = config;
    }

    /**
     * Resolves the active provider name from the config object.
     * @returns {string} active payment provider ('param', 'iyzico', 'paytr').
     */
    getProvider() {
        return (this.config.paymentProvider || 'param').toLowerCase().trim();
    }

    /**
     * Helper to retrieve the active payment provider service strategy class.
     * @param {string} [provider] - Optional override provider override name.
     * @private
     */
    _getService(provider) {
        const active = provider || this.getProvider();
        if (active === 'iyzico') {
            return this.iyzicoService;
        }
        if (active === 'paytr') {
            return this.paytrService;
        }
        return this.paramService; // Default fallback: Param POS
    }

    /**
     * Initiates 3D secure payment request.
     * @param {Object} order - Siparis model record.
     * @param {Array} basketItems - Items array.
     * @param {Object} buyer - Buyer detail payload.
     * @returns {Promise<Object>} Redirection details or HTML.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        const service = this._getService();
        console.log(`[Payment Strategy] Initiating payment using provider: ${this.getProvider()}`);
        return service.startPaymentProcess(order, basketItems, buyer);
    }

    /**
     * Verifies the 3D secure callback data from target gateway.
     * @param {Object} callbackData - Callback variables payload.
     * @param {string} [provider] - Gateway identifier.
     * @returns {Promise<Object>} Verified payment details.
     */
    async verifyCallback(callbackData, provider) {
        const activeProvider = provider || this.getProvider();
        const service = this._getService(activeProvider);
        console.log(`[Payment Strategy] Verifying callback using provider: ${activeProvider}`);
        return service.verifyCallback(callbackData);
    }

    /**
     * Refunds/Cancels a transaction.
     * @param {string} paymentId - Payment reference ID.
     * @param {string} reason - Cancel reason.
     * @param {string} [provider] - Gateway identifier.
     * @returns {Promise<Object>} Refund action results.
     */
    async cancelPayment(paymentId, reason, provider) {
        const activeProvider = provider || this.getProvider();
        const service = this._getService(activeProvider);
        console.log(`[Payment Strategy] Refunding payment using provider: ${activeProvider}`);
        return service.cancelPayment(paymentId, reason);
    }

    /**
     * Inquires installment rates for credit cards.
     * @param {string} bin - Card BIN number (first 6 digits).
     * @param {number} amount - Total amount.
     * @returns {Promise<Array>} Available installments.
     */
    async getInstallmentOptions(bin, amount) {
        const service = this._getService();
        console.log(`[Payment Strategy] Retrieving installments using provider: ${this.getProvider()}`);
        return service.getInstallmentOptions(bin, amount);
    }
}
