/**
 * ParamService — Param POS Payment Gateway Integration
 *
 * Implements the IPaymentProvider interface for the Param POS (TurkPOS) gateway.
 * Uses raw SOAP XML over native fetch — no external 'soap' library dependency —
 * making this suitable for Cloudflare Workers (which lack Node.js built-ins).
 *
 * @implements {IPaymentProvider}
 */
export class ParamService {
    /**
     * Creates an instance of ParamService.
     *
     * @param {Object} config                  - Application configuration object.
     * @param {string} config.clientCode        - Param POS client code.
     * @param {string} config.clientUsername    - Param POS client username.
     * @param {string} config.clientPassword    - Param POS client password.
     * @param {string} config.guid              - Param POS GUID (36-char UUID format).
     * @param {string} config.baseUrl           - Param ASMX WSDL endpoint URL.
     * @param {string} config.callbackUrl       - Base URL for 3D Secure callback redirects.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Resolves the SOAP ASMX service endpoint URL, stripping any `?wsdl` suffix.
     *
     * @returns {string} Clean endpoint URL for direct SOAP calls.
     * @private
     */
    _getEndpointUrl() {
        const url = this.config.baseUrl || 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx';
        return url.split('?')[0];
    }

    /**
     * Extracts the inner text value of a named XML element from a SOAP response string.
     *
     * Simple string-based extraction avoids a full XML parser dependency,
     * which is acceptable given the predictable Param SOAP response structure.
     *
     * @param {string} xml      - Full SOAP XML response string.
     * @param {string} tagName  - XML element name to extract (without angle brackets).
     * @returns {string|null}   The trimmed inner text, or null if the tag is not found.
     * @private
     */
    _extractTag(xml, tagName) {
        if (!xml || !tagName) return null;
        const startTag = `<${tagName}>`;
        const endTag   = `</${tagName}>`;
        const startIndex = xml.indexOf(startTag);
        if (startIndex === -1) return null;
        const endIndex = xml.indexOf(endTag, startIndex + startTag.length);
        if (endIndex === -1) return null;
        return xml.substring(startIndex + startTag.length, endIndex).trim();
    }

    /**
     * Formats a numeric amount into the Param-expected string format.
     * Param requires comma as the decimal separator (e.g. "1500,00").
     *
     * @param {number|string} amount - Numeric amount.
     * @returns {string} Amount string with comma decimal separator.
     * @private
     */
    _formatAmount(amount) {
        return Number(amount).toFixed(2).replace('.', ',');
    }

    /**
     * Validates that the configured GUID is a well-formed UUID v4 string.
     *
     * Param rejects requests with malformed GUIDs, so we validate early to
     * produce a clear error message rather than an opaque SOAP fault.
     *
     * @param {string} guid - The GUID string to validate.
     * @returns {boolean}   True if valid, false otherwise.
     * @private
     */
    _validateGuid(guid) {
        if (!guid || guid.length !== 36) {
            console.error('[Param] Invalid GUID length: %d, expected 36', guid?.length || 0);
            return false;
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return guidRegex.test(guid);
    }

    /**
     * Sends a raw SOAP envelope to the Param ASMX endpoint via fetch.
     *
     * Builds a standards-compliant SOAP 1.1 envelope and sets the required
     * SOAPAction header. Throws on non-2xx HTTP responses.
     *
     * @param {string} actionName     - SOAP action name (used in SOAPAction header and element namespace).
     * @param {string} soapBodyContent - Pre-formatted XML content to embed inside <soap:Body>.
     * @returns {Promise<string>}     Raw XML response text from Param.
     * @private
     */
    async _sendSoapRequest(actionName, soapBodyContent) {
        const endpoint = this._getEndpointUrl();
        const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    ${soapBodyContent}
  </soap:Body>
</soap:Envelope>`;

        console.log('[Param SOAP] Sending action: %s to %s', actionName, endpoint);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': `https://turkpos.com.tr/${actionName}`
            },
            body: xmlPayload
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Param SOAP request failed with status ${response.status}: ${errText}`);
        }

        return response.text();
    }

    /**
     * Initiates a 3D Secure payment session using the TP_WMD_UCD SOAP action.
     *
     * Builds an HMAC-SHA1 hash over key transaction fields (required by Param's
     * anti-tampering scheme), then submits card and order details to Param's SOAP API.
     * On success, returns the UCD_HTML form that the browser must render to trigger
     * the bank's 3D Secure verification page.
     *
     * @param {Object} order            - Order record (id, siparisNumarasi, toplamTutar, adres, etc.)
     * @param {Array}  basketItems      - Order line items (not used by Param but kept for interface compatibility).
     * @param {Object} buyer            - Buyer details.
     * @param {string} buyer.name       - Cardholder first name.
     * @param {string} buyer.surname    - Cardholder last name.
     * @param {string} buyer.phone      - Cardholder GSM number.
     * @param {string} buyer.cardNumber - 16-digit card number (no spaces).
     * @param {string} buyer.cardExpMonth - Card expiry month (1–12).
     * @param {string} buyer.cardExpYear  - Card expiry year (2-digit or 4-digit).
     * @param {string} buyer.cardCvc    - 3-digit CVC code.
     * @param {string} buyer.ip         - Cardholder IP address.
     * @returns {Promise<Object>} { status: 'success', ucdHtml: string, dekontId: string, siparisId: string }
     * @throws {Error} If GUID is invalid or Param returns a non-success result code.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        if (!this._validateGuid(this.config.guid)) {
            throw new Error('Param GUID configuration is invalid.');
        }

        const islemTutar  = this._formatAmount(order.toplamTutar);
        const toplamTutar = this._formatAmount(order.toplamTutar);
        const taksit      = 1; // Single payment — installments handled separately
        const orderId     = order.siparisNumarasi;

        // Callback URLs use the provider-specific path (Param redirects via browser POST)
        const errorUrl   = `${this.config.callbackUrl}/api/v1/payment/callback/param/error`;
        const successUrl = `${this.config.callbackUrl}/api/v1/payment/callback/param/success`;

        // Build the hash string: clientCode + guid + taksit + islemTutar + toplamTutar + orderId
        // Then compute SHA-1 via Web Crypto API (native in Workers — no Node.js crypto needed)
        const hashDataString  = `${this.config.clientCode}${this.config.guid}${taksit}${islemTutar}${toplamTutar}${orderId}`;
        const encoder         = new TextEncoder();
        const hashDataBytes   = encoder.encode(hashDataString);
        const hashBuffer      = await crypto.subtle.digest('SHA-1', hashDataBytes);
        const hash            = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

        // Strip non-digits from GSM number; Param expects digits only
        const cardHolderGSM = buyer.phone?.replace(/\D/g, '') || '';

        // Normalise expiry year to 4-digit format
        const cardExpYear  = buyer.cardExpYear.length === 2 ? `20${buyer.cardExpYear}` : buyer.cardExpYear;
        const cardExpMonth = buyer.cardExpMonth.padStart(2, '0');

        const bodyContent = `
    <TP_WMD_UCD xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${this.config.clientCode}</CLIENT_CODE>
        <CLIENT_USERNAME>${this.config.clientUsername}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${this.config.clientPassword}</CLIENT_PASSWORD>
      </G>
      <GUID>${this.config.guid}</GUID>
      <KK_Sahibi>${buyer.name} ${buyer.surname}</KK_Sahibi>
      <KK_No>${buyer.cardNumber}</KK_No>
      <KK_SK_Ay>${cardExpMonth}</KK_SK_Ay>
      <KK_SK_Yil>${cardExpYear}</KK_SK_Yil>
      <KK_CVC>${buyer.cardCvc}</KK_CVC>
      <KK_Sahibi_GSM>${cardHolderGSM}</KK_Sahibi_GSM>
      <Hata_URL>${errorUrl}</Hata_URL>
      <Basarili_URL>${successUrl}</Basarili_URL>
      <Siparis_ID>${orderId}</Siparis_ID>
      <Siparis_Aciklama>Sipariş #${orderId}</Siparis_Aciklama>
      <Taksit>${taksit}</Taksit>
      <Islem_Tutar>${islemTutar}</Islem_Tutar>
      <Toplam_Tutar>${toplamTutar}</Toplam_Tutar>
      <Islem_Hash>${hash}</Islem_Hash>
      <Islem_Guvenlik_Tip>3D</Islem_Guvenlik_Tip>
      <Islem_ID>${orderId}</Islem_ID>
      <IPAdr>${buyer.ip || '127.0.0.1'}</IPAdr>
      <Ref_URL>${this.config.callbackUrl}</Ref_URL>
      <Data1></Data1>
      <Data2></Data2>
      <Data3></Data3>
      <Data4></Data4>
      <Data5></Data5>
    </TP_WMD_UCD>`;

        const responseXml = await this._sendSoapRequest('TP_WMD_UCD', bodyContent);

        // Param returns Sonuc='1' on success; any other value is an error
        const sonuc    = this._extractTag(responseXml, 'Sonuc');
        const sonucStr = this._extractTag(responseXml, 'Sonuc_Str');
        const ucdHtml  = this._extractTag(responseXml, 'UCD_HTML');
        const dekontId = this._extractTag(responseXml, 'Dekont_ID');

        if (sonuc !== '1') {
            console.error('[Param] API error:', sonucStr);
            throw new Error(sonucStr || 'Ödeme başlatılamadı.');
        }

        return {
            status:    'success',
            ucdHtml:   ucdHtml,
            dekontId:  dekontId,
            siparisId: order.id
        };
    }

    /**
     * Verifies the 3D Secure callback POST data received from Param.
     *
     * Param sends mdStatus='1' for a successful 3D authentication.
     * All other mdStatus values indicate failure or cancellation.
     *
     * @param {Object} callbackData            - POST body from Param's browser redirect.
     * @param {string} callbackData.mdStatus   - 3D Secure result code ('1' = success).
     * @param {string} callbackData.orderId    - Order reference number.
     * @param {string} callbackData.islemGUID  - Param transaction GUID (used as paymentId).
     * @returns {Object} { status, paymentId?, siparisNumarasi, errorMessage?, amount?, rawResult }
     */
    verifyCallback(callbackData) {
        console.log('[Param] Verifying callback:', callbackData);

        const mdStatus        = callbackData.mdStatus || callbackData.md_status;
        const isSuccess       = mdStatus === '1';
        const siparisNumarasi = callbackData.orderId || callbackData.siparis_id || callbackData.Siparis_ID;

        if (!isSuccess) {
            return {
                status:        'failure',
                errorCode:     mdStatus,
                errorMessage:  callbackData.md_errormessage || 'Ödeme doğrulaması başarısız.',
                siparisNumarasi
            };
        }

        return {
            status:         'success',
            paymentId:      callbackData.islemGUID || callbackData.dekont_id || callbackData.Dekont_ID,
            siparisNumarasi,
            amount:         callbackData.transactionAmount || callbackData.islem_tutar || callbackData.Islem_Tutar,
            rawResult:      callbackData
        };
    }

    /**
     * Cancels or refunds a Param POS transaction via the TP_Islem_Iptal_Iade SOAP action.
     *
     * @param {string} dekontId - Param Dekont_ID (receipt ID) of the transaction to cancel.
     * @param {string} reason   - Human-readable cancellation reason (logged only; not sent to Param).
     * @returns {Promise<Object>} { status: 'success', dekontId, message }
     * @throws {Error} If Param returns a non-success result code.
     */
    async cancelPayment(dekontId, reason) {
        console.log('[Param] Cancelling payment %s — reason: %s', dekontId, reason);

        const bodyContent = `
    <TP_Islem_Iptal_Iade xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${this.config.clientCode}</CLIENT_CODE>
        <CLIENT_USERNAME>${this.config.clientUsername}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${this.config.clientPassword}</CLIENT_PASSWORD>
      </G>
      <GUID>${this.config.guid}</GUID>
      <Durum>IPTAL</Durum>
      <Siparis_ID></Siparis_ID>
      <Dekont_ID>${dekontId}</Dekont_ID>
      <Tutar></Tutar>
    </TP_Islem_Iptal_Iade>`;

        const responseXml = await this._sendSoapRequest('TP_Islem_Iptal_Iade', bodyContent);

        const sonuc    = this._extractTag(responseXml, 'Sonuc');
        const sonucStr = this._extractTag(responseXml, 'Sonuc_Str');

        if (sonuc !== '1') {
            throw new Error(sonucStr || 'İptal işlemi başarısız.');
        }

        return {
            status:   'success',
            dekontId: dekontId,
            message:  'Payment successfully cancelled.'
        };
    }

    /**
     * Retrieves available installment plans for a card BIN using TP_Ozel_Oran_SK_Liste.
     *
     * Parses <Temp> blocks from the SOAP response dataset to extract installment count
     * and commission rate per plan. Returns only plans with more than 1 instalment.
     *
     * @param {string} bin    - First 6 digits of the card number (BIN/IIN).
     * @param {number} amount - Total transaction amount in TRY.
     * @returns {Promise<Array<{Taksit: number, Komi_Oran: number}>>}
     *   Sorted array of installment options, or [] on error / no options available.
     */
    async getInstallmentOptions(bin, amount) {
        const formattedAmount = this._formatAmount(amount);

        const bodyContent = `
    <TP_Ozel_Oran_SK_Liste xmlns="https://turkpos.com.tr/">
      <G>
        <CLIENT_CODE>${this.config.clientCode}</CLIENT_CODE>
        <CLIENT_USERNAME>${this.config.clientUsername}</CLIENT_USERNAME>
        <CLIENT_PASSWORD>${this.config.clientPassword}</CLIENT_PASSWORD>
      </G>
      <GUID>${this.config.guid}</GUID>
      <Bin>${bin}</Bin>
      <Tutar>${formattedAmount}</Tutar>
    </TP_Ozel_Oran_SK_Liste>`;

        try {
            const responseXml = await this._sendSoapRequest('TP_Ozel_Oran_SK_Liste', bodyContent);
            const sonuc = this._extractTag(responseXml, 'Sonuc');

            if (sonuc !== '1') return [];

            // Extract all <Temp> blocks — each represents one installment option in the dataset
            const tempBlocks = responseXml.match(/<Temp>([\s\S]*?)<\/Temp>/g) || [];

            const installments = tempBlocks
                .map(block => {
                    const taksitMatch = block.match(/<Taksit_Sayisi>(.*?)<\/Taksit_Sayisi>/)
                                     || block.match(/<Taksit>(.*?)<\/Taksit>/);
                    const komiMatch   = block.match(/<Komi_Oran>(.*?)<\/Komi_Oran>/)
                                     || block.match(/<Oran>(.*?)<\/Oran>/);

                    return {
                        Taksit:    taksitMatch ? parseInt(taksitMatch[1].trim(), 10) : 1,
                        Komi_Oran: komiMatch   ? parseFloat(komiMatch[1].trim().replace(',', '.')) : 0
                    };
                })
                .filter(inst => inst.Taksit > 1); // Single-draw is always available; only surface multi-instalment plans

            // Return sorted ascending by instalment count for UI display order
            return installments.sort((a, b) => a.Taksit - b.Taksit);
        } catch (error) {
            console.error('[Param] Installment fetch failed:', error);
            return [];
        }
    }
}
