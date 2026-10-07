import { describe, it, expect, vi } from 'vitest';
import { ProductController, validateProductNumbers } from './productController.js';
import { FeedController } from './feedController.js';

const fakeRes = () => {
    const res = { statusCode: 200, headers: {} };
    res.status = vi.fn((code) => { res.statusCode = code; return res; });
    res.json = vi.fn(() => res);
    res.send = vi.fn(() => res);
    res.set = vi.fn((k, v) => { res.headers[k] = v; return res; });
    return res;
};

describe('validateProductNumbers', () => {
    it('accepts the admin form defaults and a normal product', () => {
        expect(validateProductNumbers({ fiyat: 100, indirimliFiyat: null, stokAdedi: 0, agirlik: 1 })).toBeNull();
    });

    it('rejects negative, zero or non-numeric prices, stock and weight', () => {
        expect(validateProductNumbers({ fiyat: -5 })).toMatch(/Fiyat/);
        expect(validateProductNumbers({ fiyat: NaN })).toMatch(/Fiyat/);
        expect(validateProductNumbers({ indirimliFiyat: 0 })).toMatch(/İndirimli/);
        expect(validateProductNumbers({ stokAdedi: -1 })).toMatch(/Stok/);
        expect(validateProductNumbers({ stokAdedi: NaN })).toMatch(/Stok/);
        expect(validateProductNumbers({ agirlik: 0 })).toMatch(/Ağırlık/);
    });

    it('does not create a product with an invalid price', async () => {
        const service = { createProduct: vi.fn() };
        const res = fakeRes();
        await new ProductController(service).adminCreateProduct({ body: { ad: 'Kupa', fiyat: '-10' } }, res, vi.fn());
        expect(res.statusCode).toBe(400);
        expect(service.createProduct).not.toHaveBeenCalled();
    });
});

describe('public product detail', () => {
    const controllerWith = (product) => new ProductController({
        getProductById: vi.fn(async () => product),
        getProductBySlug: vi.fn(async () => product),
        incrementViewCount: vi.fn(async () => {}),
    });

    it('hides inactive products by id and by slug', async () => {
        const controller = controllerWith({ id: 'p1', aktif: false });
        const byId = fakeRes();
        await controller.getProduct({ params: { id: 'p1' } }, byId, vi.fn());
        const bySlug = fakeRes();
        await controller.getProductBySlug({ params: { slug: 'taslak' } }, bySlug, vi.fn());
        expect(byId.statusCode).toBe(404);
        expect(bySlug.statusCode).toBe(404);
    });

    it('returns active products', async () => {
        const res = fakeRes();
        await controllerWith({ id: 'p1', aktif: true }).getProduct({ params: { id: 'p1' } }, res, vi.fn());
        expect(res.statusCode).toBe(200);
        expect(res.json).toHaveBeenCalledWith({ id: 'p1', aktif: true });
    });
});

describe('Google Shopping feed', () => {
    const feed = () => new FeedController(
        { findAll: vi.fn(async () => []) },
        { getSettings: vi.fn(async () => ({ googleMerchantToken: 'feed-secret' })) },
    );

    it('rejects a missing or wrong token', async () => {
        for (const token of [undefined, 'wrong', ['feed-secret']]) {
            const res = fakeRes();
            await feed().getGoogleShoppingFeed({ query: { token } }, res, vi.fn());
            expect(res.statusCode).toBe(401);
        }
    });

    it('serves the feed for the right token without allowing shared caches', async () => {
        const res = fakeRes();
        await feed().getGoogleShoppingFeed({ query: { token: 'feed-secret' } }, res, vi.fn());
        expect(res.statusCode).toBe(200);
        expect(res.headers['Cache-Control']).toMatch(/^private/);
    });
});
