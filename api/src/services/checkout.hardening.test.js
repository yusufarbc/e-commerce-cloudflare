import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../prisma.js', () => ({
    default: { sistemAyarlari: { findUnique: vi.fn(async () => ({ kargoPolitikaTuru: 'SABIT_UCRET', kargoSabitUcret: 50 })) } },
}));

const { OrderService, generateOrderNumber } = await import('./orderService.js');
const { ReturnService } = await import('./returnService.js');
const { detectImageType } = await import('../controllers/uploadController.js');
const { SettingsController } = await import('../controllers/settingsController.js');

const guestInfo = {
    name: 'Ada Lovelace', email: 'ada@example.com', phone: '05551234567',
    address: 'Example street 1', city: 'İstanbul', district: 'Kadıköy', zipCode: '34000',
};

describe('checkout validation', () => {
    let products;
    let repo;
    let service;

    beforeEach(() => {
        products = {
            p1: { id: 'p1', ad: 'Kupa', fiyat: 100, aktif: true, stokAdedi: 3, agirlik: 1 },
            p2: { id: 'p2', ad: 'Lamba', fiyat: 200, aktif: false, stokAdedi: 10, agirlik: 1 },
        };
        repo = { createOrder: vi.fn(async (data) => ({ id: 'o1', ...data })) };
        service = new OrderService(repo, { getProductById: vi.fn(async (id) => products[id] || null) }, {}, {});
    });

    const checkout = (items) => service.processCheckout({ items, guestInfo });

    it('rejects a product that does not exist instead of skipping it', async () => {
        await expect(checkout([{ id: 'missing', quantity: 1 }])).rejects.toMatchObject({ statusCode: 400 });
        expect(repo.createOrder).not.toHaveBeenCalled();
    });

    it('rejects an inactive product', async () => {
        await expect(checkout([{ id: 'p2', quantity: 1 }])).rejects.toMatchObject({ statusCode: 400 });
    });

    it('rejects a quantity above stock, also when split across cart lines', async () => {
        await expect(checkout([{ id: 'p1', quantity: 4 }])).rejects.toMatchObject({ statusCode: 400 });
        await expect(checkout([{ id: 'p1', quantity: 2 }, { id: 'p1', quantity: 2 }])).rejects.toMatchObject({ statusCode: 400 });
    });

    it('prices from the database and issues a 10-digit order number', async () => {
        const result = await checkout([{ id: 'p1', quantity: 3, price: 1 }]);
        expect(result.total).toBe(350);
        expect(result.orderNumber).toMatch(/^[1-9]\d{9}$/);
    });
});

describe('generateOrderNumber', () => {
    it('returns 10 digits without a leading zero and does not repeat in practice', () => {
        const numbers = new Set(Array.from({ length: 1000 }, generateOrderNumber));
        expect(numbers.size).toBe(1000);
        for (const n of numbers) expect(n).toMatch(/^[1-9]\d{9}$/);
    });
});

describe('detectImageType', () => {
    const bytes = (...values) => new Uint8Array(values);
    const text = (s) => new TextEncoder().encode(s);

    it('accepts WebP, JPEG and PNG by their magic bytes', () => {
        expect(detectImageType(text('RIFF\0\0\0\0WEBPVP8 '))).toEqual({ extension: 'webp', contentType: 'image/webp' });
        expect(detectImageType(bytes(0xff, 0xd8, 0xff, 0xe0))).toEqual({ extension: 'jpg', contentType: 'image/jpeg' });
        expect(detectImageType(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))).toEqual({ extension: 'png', contentType: 'image/png' });
    });

    it('rejects SVG and HTML whatever their name or declared type', () => {
        expect(detectImageType(text('<svg xmlns="http://www.w3.org/2000/svg">'))).toBeNull();
        expect(detectImageType(text('<!doctype html><script>'))).toBeNull();
    });
});

describe('public settings', () => {
    it('leaves out the Google Merchant feed token', async () => {
        const controller = new SettingsController({
            getSettings: async () => ({ siteAdi: 'E-Market', googleMerchantToken: 'secret' }),
        });
        const res = { json: vi.fn() };
        await controller.getPublicSettings({}, res, vi.fn());
        expect(res.json).toHaveBeenCalledWith({ siteAdi: 'E-Market' });
    });
});

describe('return request updates', () => {
    it('does not reset the order status when only the admin note changes', async () => {
        const orders = { update: vi.fn(), createOrderHistory: vi.fn() };
        const returns = {
            findByIdWithOrder: vi.fn(async () => ({ id: 'r1', siparisId: 'o1', siparis: { durum: 'IADE_EDILDI' } })),
            update: vi.fn(async (id, data) => ({ id, ...data })),
        };
        await new ReturnService(returns, orders).updateReturnRequest('r1', { adminNotu: 'kargo bekleniyor' });
        expect(orders.update).not.toHaveBeenCalled();
        expect(orders.createOrderHistory).not.toHaveBeenCalled();
    });

    it('moves the order to IADE_EDILDI when the return is approved', async () => {
        const orders = { update: vi.fn(), createOrderHistory: vi.fn() };
        const returns = {
            findByIdWithOrder: vi.fn(async () => ({ id: 'r1', siparisId: 'o1', siparis: { durum: 'IADE_TALEP_EDILDI' } })),
            update: vi.fn(async (id, data) => ({ id, ...data })),
        };
        await new ReturnService(returns, orders).updateReturnRequest('r1', { durum: 'ONAYLANDI' });
        expect(orders.update).toHaveBeenCalledWith('o1', { durum: 'IADE_EDILDI' });
    });
});
