import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import { ParamService } from './paramService.js';
import { PaytrService } from './paytrService.js';
import { IyzicoService } from './iyzicoService.js';
import { PaymentService } from './paymentService.js';
import { OrderService } from './orderService.js';

const GUID = '0C13D406-873B-403B-9C09-A5766840D98C';

const paramHash = (islemGUID, md, mdStatus, orderId, guid = GUID) =>
    crypto.createHash('sha1').update(`${islemGUID}${md}${mdStatus}${orderId}${guid.toLowerCase()}`).digest('base64');

const paramCallback = (overrides = {}) => {
    const body = { md: 'md-data', mdStatus: '1', orderId: '123456', islemGUID: 'islem-guid', ...overrides };
    return { ...body, islemHash: paramHash(body.islemGUID, body.md, body.mdStatus, body.orderId) };
};

describe('ParamService.verifyCallback', () => {
    let param;

    beforeEach(() => {
        param = new ParamService({ clientCode: '1', clientUsername: 'u', clientPassword: 'p', guid: GUID });
    });

    it('rejects a forged callback that only claims mdStatus=1', async () => {
        const soap = vi.spyOn(param, '_sendSoapRequest');
        const result = await param.verifyCallback({ mdStatus: '1', orderId: '123456' });
        expect(result.status).toBe('failure');
        expect(soap).not.toHaveBeenCalled();
    });

    it('rejects a callback whose orderId was changed after Param signed it', async () => {
        const soap = vi.spyOn(param, '_sendSoapRequest');
        const result = await param.verifyCallback({ ...paramCallback(), orderId: '999999' });
        expect(result.status).toBe('failure');
        expect(soap).not.toHaveBeenCalled();
    });

    it('completes a signed callback with TP_WMD_Pay and returns the receipt id', async () => {
        const soap = vi.spyOn(param, '_sendSoapRequest')
            .mockResolvedValue('<Sonuc>1</Sonuc><Sonuc_Ack>Basarili</Sonuc_Ack><Dekont_ID>7654321</Dekont_ID>');
        const result = await param.verifyCallback(paramCallback());
        expect(soap).toHaveBeenCalledWith('TP_WMD_Pay', expect.stringContaining('<Siparis_ID>123456</Siparis_ID>'));
        expect(result).toMatchObject({ status: 'success', paymentId: '7654321', siparisNumarasi: '123456', amountBoundAtInit: true });
    });

    it('fails when Param does not confirm the payment', async () => {
        vi.spyOn(param, '_sendSoapRequest').mockResolvedValue('<Sonuc>-1</Sonuc><Sonuc_Ack>Red</Sonuc_Ack><Dekont_ID>0</Dekont_ID>');
        const result = await param.verifyCallback(paramCallback());
        expect(result.status).toBe('failure');
    });

    it('does not call TP_WMD_Pay when 3D authentication failed', async () => {
        const soap = vi.spyOn(param, '_sendSoapRequest');
        const result = await param.verifyCallback(paramCallback({ mdStatus: '0' }));
        expect(result.status).toBe('failure');
        expect(soap).not.toHaveBeenCalled();
    });

    it('rejects every callback when the GUID is not configured', async () => {
        const unconfigured = new ParamService({ guid: '' });
        const body = { md: 'm', mdStatus: '1', orderId: '1', islemGUID: 'g' };
        const result = await unconfigured.verifyCallback({ ...body, islemHash: paramHash('g', 'm', '1', '1', '') });
        expect(result.status).toBe('failure');
    });
});

describe('PaytrService.verifyCallback', () => {
    const sign = (body, key, salt) => crypto.createHmac('sha256', key)
        .update(body.merchant_oid + salt + body.status + body.total_amount).digest('base64');

    it('rejects a notification signed with an empty key when PayTR is not configured', () => {
        const paytr = new PaytrService({ merchantKey: '', merchantSalt: '' });
        const body = { merchant_oid: '123456', status: 'success', total_amount: '100' };
        const result = paytr.verifyCallback({ ...body, hash: sign(body, '', '') });
        expect(result.status).toBe('failure');
    });

    it('accepts a correctly signed notification and reports the signed amount', () => {
        const paytr = new PaytrService({ merchantKey: 'key', merchantSalt: 'salt' });
        const body = { merchant_oid: '123456', status: 'success', total_amount: '25000' };
        const result = paytr.verifyCallback({ ...body, hash: sign(body, 'key', 'salt') });
        expect(result).toMatchObject({ status: 'success', paymentId: '123456', siparisNumarasi: '123456', amount: '250.00' });
    });

    it('rejects a tampered amount', () => {
        const paytr = new PaytrService({ merchantKey: 'key', merchantSalt: 'salt' });
        const body = { merchant_oid: '123456', status: 'success', total_amount: '25000' };
        const result = paytr.verifyCallback({ ...body, hash: sign(body, 'key', 'salt'), total_amount: '100' });
        expect(result.status).toBe('failure');
    });
});

describe('IyzicoService.verifyCallback', () => {
    it('takes the order number and amount from iyzico, not from the browser callback', async () => {
        const iyzico = new IyzicoService({ apiKey: 'k', secretKey: 's' });
        vi.spyOn(iyzico, '_request').mockResolvedValue({
            status: 'success', paymentId: '555', basketId: '111111', paidPrice: '10.00',
        });
        const result = await iyzico.verifyCallback({ status: 'success', paymentId: '555', conversationId: '999999' });
        expect(result).toMatchObject({ status: 'success', paymentId: '555', siparisNumarasi: '111111', amount: '10.00' });
    });
});

describe('PaymentService payment references', () => {
    const service = new PaymentService({}, {}, {}, { paymentProvider: 'param' });

    it('routes a prefixed reference to its own provider', () => {
        expect(service.parsePaymentReference('paytr-123456')).toEqual({ provider: 'paytr', paymentId: '123456' });
        expect(service.parsePaymentReference('iyzico-55')).toEqual({ provider: 'iyzico', paymentId: '55' });
    });

    it('attributes an unprefixed reference to the active provider', () => {
        expect(service.parsePaymentReference('7654321')).toEqual({ provider: 'param', paymentId: '7654321' });
    });
});

describe('OrderService payment completion', () => {
    const pendingOrder = () => ({
        id: 'order-1', siparisNumarasi: '123456', takipTokeni: 'track-1', durum: 'BEKLEMEDE',
        odemeDurumu: 'INIT', odemeId: null, toplamTutar: 250, eposta: 'a@b.c', ad: 'Ada', kalemler: [],
    });

    let order;
    let repo;
    let payments;
    let email;
    let service;

    const verified = (overrides = {}) => payments.verifyCallback.mockResolvedValue({
        status: 'success', paymentId: '555', siparisNumarasi: '123456', amount: '250.00', ...overrides,
    });

    beforeEach(() => {
        order = pendingOrder();
        repo = {
            getOrderByNumber: vi.fn(async () => order),
            getOrderById: vi.fn(async () => order),
            markOrderPaid: vi.fn(async (id, odemeId) => {
                if (order.durum !== 'BEKLEMEDE') return false;
                order = { ...order, durum: 'HAZIRLANIYOR', odemeDurumu: 'SUCCESS', odemeId };
                return true;
            }),
            getOrderByTrackingToken: vi.fn(async () => order),
            cancelOrder: vi.fn(async () => {}),
            adjustStock: vi.fn(async () => {}),
        };
        payments = { verifyCallback: vi.fn(), cancelPayment: vi.fn(async () => ({ status: 'success' })) };
        email = {
            sendOrderConfirmation: vi.fn(async () => {}),
            sendSellerNewOrderNotification: vi.fn(async () => {}),
            sendCancellationNotification: vi.fn(async () => {}),
        };
        service = new OrderService(repo, {}, payments, email);
    });

    it('marks a pending order paid with a provider-prefixed reference and sends e-mails once', async () => {
        verified();
        const result = await service.completePayment({}, 'iyzico');
        expect(result.status).toBe('success');
        expect(repo.markOrderPaid).toHaveBeenCalledWith('order-1', 'iyzico-555');
        expect(email.sendOrderConfirmation).toHaveBeenCalledTimes(1);
        expect(repo.adjustStock).toHaveBeenCalledWith(order.kalemler, -1);
    });

    it('acknowledges a replayed callback without new side effects', async () => {
        verified();
        await service.completePayment({}, 'paytr');
        const replay = await service.completePayment({}, 'paytr');
        expect(replay.status).toBe('success');
        expect(repo.markOrderPaid).toHaveBeenCalledTimes(1);
        expect(email.sendOrderConfirmation).toHaveBeenCalledTimes(1);
        expect(repo.adjustStock).toHaveBeenCalledTimes(1);
        expect(payments.cancelPayment).not.toHaveBeenCalled();
    });

    it('refunds an underpaid payment and leaves the order pending', async () => {
        verified({ amount: '10.00' });
        const result = await service.completePayment({}, 'iyzico');
        expect(result).toMatchObject({ status: 'failure', final: true });
        expect(repo.markOrderPaid).not.toHaveBeenCalled();
        expect(payments.cancelPayment).toHaveBeenCalledWith('iyzico-555', expect.any(String), 10);
    });

    it('does not revive a cancelled order and refunds the late payment', async () => {
        order.durum = 'IPTAL_EDILDI';
        verified();
        const result = await service.completePayment({}, 'paytr');
        expect(result).toMatchObject({ status: 'failure', final: true });
        expect(repo.markOrderPaid).not.toHaveBeenCalled();
        expect(payments.cancelPayment).toHaveBeenCalledWith('paytr-555', expect.any(String), 250);
    });

    it('refunds a second, different payment for an order that is already paid', async () => {
        order = { ...order, durum: 'HAZIRLANIYOR', odemeDurumu: 'SUCCESS', odemeId: 'iyzico-111' };
        verified();
        const result = await service.completePayment({}, 'iyzico');
        expect(result.status).toBe('failure');
        expect(payments.cancelPayment).toHaveBeenCalledWith('iyzico-555', expect.any(String), 250);
    });

    it('trusts the init-time amount binding for Param', async () => {
        verified({ amount: undefined, amountBoundAtInit: true });
        const result = await service.completePayment({}, 'param');
        expect(result.status).toBe('success');
        expect(repo.markOrderPaid).toHaveBeenCalledWith('order-1', 'param-555');
    });

    it('does nothing when verification fails', async () => {
        payments.verifyCallback.mockResolvedValue({ status: 'failure', errorMessage: 'bad', siparisNumarasi: '123456' });
        const result = await service.completePayment({}, 'param');
        expect(result.status).toBe('failure');
        expect(repo.getOrderByNumber).not.toHaveBeenCalled();
    });

    it('refunds a paid order before cancelling it', async () => {
        order = { ...order, durum: 'HAZIRLANIYOR', odemeDurumu: 'SUCCESS', odemeId: 'paytr-123456' };
        await service.cancelOrder('track-1', 'changed my mind');
        expect(payments.cancelPayment).toHaveBeenCalledWith('paytr-123456', 'changed my mind', 250);
        expect(repo.cancelOrder).toHaveBeenCalledWith('order-1', { refunded: true });
        expect(repo.adjustStock).toHaveBeenCalledWith(order.kalemler, 1);
    });

    it('keeps a paid order when the refund fails', async () => {
        order = { ...order, durum: 'HAZIRLANIYOR', odemeDurumu: 'SUCCESS', odemeId: 'paytr-123456' };
        payments.cancelPayment.mockRejectedValue(new Error('gateway down'));
        await expect(service.cancelOrder('track-1', 'x')).rejects.toThrow(/Refund could not be completed/);
        expect(repo.cancelOrder).not.toHaveBeenCalled();
    });
});
