/**
 * Service for handling Param POS payment gateway integrations inside Cloudflare Workers.
 * Uses native fetch with raw XML SOAP envelopes instead of Node-dependent 'soap' library.
 */
export class ParamService {
    /**
     * Creates an instance of ParamService.
     * @param {Object} config - Configuration object.
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * Resolves the ASMX service endpoint from the config baseUrl.
     * Strips '?wsdl' if present.
     * @private
     */
    _getEndpointUrl() {
        const url = this.config.baseUrl || 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx';
        return url.split('?')[0];
    }

    /**
     * Helper to extract the value of a specific XML tag from a SOAP response string.
     * @private
     */
    _extractTag(xml, tagName) {
        const regex = new RegExp(`<${tagName}>(.*?)</${tagName}>`, 's');
        const match = xml.match(regex);
        return match ? match[1].trim() : null;
    }

    /**
     * Formats amount to Param's expected format (comma as decimal separator).
     * @private
     */
    _formatAmount(amount) {
        return Number(amount).toFixed(2).replace('.', ',');
    }

    /**
     * Validates GUID format (should be 36 characters with dashes).
     * @private
     */
    _validateGuid(guid) {
        if (!guid || guid.length !== 36) {
            console.error(`[Param] Invalid GUID length: ${guid?.length || 0}, expected 36`);
            return false;
        }
        const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return guidRegex.test(guid);
    }

    /**
     * Sends a raw SOAP request via fetch.
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

        console.log(`[Param SOAP] Sending request for action: ${actionName} to ${endpoint}`);

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
     * Initiates a 3D Secure payment process.
     * Returns HTML form for 3D redirect.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        if (!this._validateGuid(this.config.guid)) {
            throw new Error('Param GUID yapılandırması geçersiz.');
        }

        const islemTutar = this._formatAmount(order.toplamTutar);
        const toplamTutar = this._formatAmount(order.toplamTutar);
        const taksit = 1;
        const orderId = order.siparisNumarasi;

        const errorUrl = `${this.config.callbackUrl}/api/v1/payment/param/error`;
        const successUrl = `${this.config.callbackUrl}/api/v1/payment/param/success`;

        const hashDataString = `${this.config.clientCode}${this.config.guid}${taksit}${islemTutar}${toplamTutar}${orderId}`;
        
        // Calculate SHA-1 hash using native Web Crypto API
        const encoder = new TextEncoder();
        const hashDataBytes = encoder.encode(hashDataString);
        const hashBuffer = await crypto.subtle.digest('SHA-1', hashDataBytes);
        const hash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

        const cardHolderGSM = buyer.phone?.replace(/\D/g, '') || '';
        const cardExpYear = buyer.cardExpYear.length === 2 ? `20${buyer.cardExpYear}` : buyer.cardExpYear;
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
        
        const sonuc = this._extractTag(responseXml, 'Sonuc');
        const sonucStr = this._extractTag(responseXml, 'Sonuc_Str');
        const ucdHtml = this._extractTag(responseXml, 'UCD_HTML');
        const dekontId = this._extractTag(responseXml, 'Dekont_ID');

        if (sonuc !== '1') {
            console.error('[Param] API Error:', sonucStr);
            throw new Error(sonucStr || 'Ödeme başlatılamadı');
        }

        return {
            status: 'success',
            ucdHtml: ucdHtml,
            dekontId: dekontId,
            siparisId: order.id
        };
    }

    /**
     * Verifies payment callback from Param.
     */
    verifyCallback(callbackData) {
        console.log('[Param] Verifying callback:', callbackData);

        const mdStatus = callbackData.mdStatus || callbackData.md_status;
        const isSuccess = mdStatus === '1';
        const siparisNumarasi = callbackData.orderId || callbackData.siparis_id || callbackData.Siparis_ID;

        if (!isSuccess) {
            return {
                status: 'failure',
                errorCode: mdStatus,
                errorMessage: callbackData.md_errormessage || 'Ödeme doğrulaması başarısız',
                siparisNumarasi: siparisNumarasi
            };
        }

        return {
            status: 'success',
            paymentId: callbackData.islemGUID || callbackData.dekont_id || callbackData.Dekont_ID,
            siparisNumarasi: siparisNumarasi,
            amount: callbackData.transactionAmount || callbackData.islem_tutar || callbackData.Islem_Tutar,
            rawResult: callbackData
        };
    }

    /**
     * Cancels/refunds a payment.
     */
    async cancelPayment(dekontId, reason) {
        console.log(`[Param] Cancelling payment ${dekontId}, Reason: ${reason}`);

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
        
        const sonuc = this._extractTag(responseXml, 'Sonuc');
        const sonucStr = this._extractTag(responseXml, 'Sonuc_Str');

        if (sonuc !== '1') {
            throw new Error(sonucStr || 'İptal işlemi başarısız');
        }

        return {
            status: 'success',
            dekontId: dekontId,
            message: 'Ödeme iptal edildi'
        };
    }

    /**
     * Gets installment options for a card BIN.
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

            if (sonuc !== '1') {
                return [];
            }

            // Extract all <Temp> records containing installment data from the dataset
            const tempBlocks = responseXml.match(/<Temp>([\s\S]*?)<\/Temp>/g) || [];
            
            const installments = tempBlocks.map(block => {
                const taksitMatch = block.match(/<Taksit_Sayisi>(.*?)<\/Taksit_Sayisi>/) || block.match(/<Taksit>(.*?)<\/Taksit>/);
                const komiMatch = block.match(/<Komi_Oran>(.*?)<\/Komi_Oran>/) || block.match(/<Oran>(.*?)<\/Oran>/);

                return {
                    Taksit: taksitMatch ? parseInt(taksitMatch[1].trim(), 10) : 1,
                    Komi_Oran: komiMatch ? parseFloat(komiMatch[1].trim().replace(',', '.')) : 0
                };
            }).filter(inst => inst.Taksit > 1); // Only return installments (> 1)

            // Sort installments by number of payments
            return installments.sort((a, b) => a.Taksit - b.Taksit);
        } catch (error) {
            console.error('[Param] Installment Options fetch failed:', error);
            return [];
        }
    }
}
