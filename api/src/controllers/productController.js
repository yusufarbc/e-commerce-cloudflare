import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Ürün HTTP isteklerini yöneten Controller.
 * ProductController
 */
export class ProductController {
    /**
     * ProductController örneği oluşturur.
     * @param {import('../services/productService.js').ProductService} productService - Ürün servisi.
     */
    constructor(productService) {
        this.productService = productService;
    }

    /**
     * Tüm ürünleri getiren isteği işler.
     * 
     * @param {import('express').Request} req - Express istek nesnesi.
     * @param {import('express').Response} res - Express yanıt nesnesi.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    getProducts = asyncHandler(async (req, res, next) => {
        const { markaId, kategoriId, kategori, kategoriSlug, oneCikan, firsatUrunu, yeniUrun, cokSatanlar } = req.query;
        const products = await this.productService.getAllProducts({
            markaId,
            kategoriId,
            kategoriSlug: kategoriSlug || kategori, // Support both 'kategoriSlug' (from frontend) and 'kategori' (legacy)
            oneCikan: oneCikan === 'true',
            firsatUrunu: firsatUrunu === 'true',
            yeniUrun: yeniUrun === 'true',
            cokSatanlar: cokSatanlar === 'true'
        });
        res.json(products);
    });

    /**
     * ID'ye göre ürün detayını getirir ve görüntülenme sayısını artırır.
     * 
     * @param {import('express').Request} req - Express istek nesnesi.
     * @param {import('express').Response} res - Express yanıt nesnesi.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    getProduct = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const product = await this.productService.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        // Increment view count asynchronously (fire and forget)
        this.productService.incrementViewCount(id).catch(err =>
            console.error('Failed to increment view count:', err)
        );

        res.json(product);
    });

    /**
     * Slug'a göre ürün detayını getirir.
     * 
     * @param {import('express').Request} req - Express istek nesnesi.
     * @param {import('express').Response} res - Express yanıt nesnesi.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    getProductBySlug = asyncHandler(async (req, res, next) => {
        const { slug } = req.params;
        const product = await this.productService.getProductBySlug(slug);

        if (!product) {
            return res.status(404).json({ error: 'Ürün bulunamadı' });
        }

        // Increment view count asynchronously (fire and forget)
        if (product.id) {
            this.productService.incrementViewCount(product.id).catch(err =>
                console.error('Failed to increment view count:', err)
            );
        }

        res.json(product);
    });

    /**
     * Admin panel product listing.
     */
    adminGetProducts = asyncHandler(async (req, res, next) => {
        const products = await this.productService.getAllProductsForAdmin();
        res.json({ status: 'success', data: products });
    });

    /**
     * Admin panel product creation.
     */
    adminCreateProduct = asyncHandler(async (req, res, next) => {
        const body = req.body;
        const slug = body.ad.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const product = await this.productService.createProduct({
            ad: body.ad,
            slug: slug,
            fiyat: parseFloat(body.fiyat),
            indirimliFiyat: body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null,
            kisaAciklama: body.kisaAciklama || null,
            renkSecenekleri: Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]",
            boyutSecenekleri: Array.isArray(body.boyutSecenekleri) ? JSON.stringify(body.boyutSecenekleri) : "[]",
            iadeImkaniVar: body.iadeImkaniVar !== false,
            agirlik: parseFloat(body.agirlik || 1),
            aciklama: body.aciklama || '',
            resimUrl: body.resimUrl || null,
            aktif: body.aktif !== false,
            oneCikan: !!body.oneCikan,
            firsatUrunu: !!body.firsatUrunu,
            yeniUrun: !!body.yeniUrun,
            cokSatanlar: !!body.cokSatanlar,
            stokAdedi: parseInt(body.stokAdedi || 0, 10),
            varyantBasligi: body.varyantBasligi || null,
            kategoriId: body.kategoriId || null,
            markaId: body.markaId || null
        });

        res.json({ status: 'success', data: product });
    });

    /**
     * Admin panel product update.
     */
    adminUpdateProduct = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const body = req.body;
        
        const data = {};
        if (body.ad !== undefined) {
            data.ad = body.ad;
            data.slug = body.ad.toLowerCase()
                .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
                .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        if (body.fiyat !== undefined) data.fiyat = parseFloat(body.fiyat);
        if (body.indirimliFiyat !== undefined) data.indirimliFiyat = body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null;
        if (body.kisaAciklama !== undefined) data.kisaAciklama = body.kisaAciklama || null;
        if (body.renkSecenekleri !== undefined) data.renkSecenekleri = Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]";
        if (body.boyutSecenekleri !== undefined) data.boyutSecenekleri = Array.isArray(body.boyutSecenekleri) ? JSON.stringify(body.boyutSecenekleri) : "[]";
        if (body.iadeImkaniVar !== undefined) data.iadeImkaniVar = body.iadeImkaniVar !== false;
        if (body.agirlik !== undefined) data.agirlik = parseFloat(body.agirlik);
        if (body.aciklama !== undefined) data.aciklama = body.aciklama;
        if (body.resimUrl !== undefined) data.resimUrl = body.resimUrl;
        if (body.aktif !== undefined) data.aktif = body.aktif !== false;
        if (body.oneCikan !== undefined) data.oneCikan = !!body.oneCikan;
        if (body.firsatUrunu !== undefined) data.firsatUrunu = !!body.firsatUrunu;
        if (body.yeniUrun !== undefined) data.yeniUrun = !!body.yeniUrun;
        if (body.cokSatanlar !== undefined) data.cokSatanlar = !!body.cokSatanlar;
        if (body.stokAdedi !== undefined) data.stokAdedi = parseInt(body.stokAdedi, 10);
        if (body.varyantBasligi !== undefined) data.varyantBasligi = body.varyantBasligi;
        if (body.kategoriId !== undefined) data.kategoriId = body.kategoriId || null;
        if (body.markaId !== undefined) data.markaId = body.markaId || null;

        const product = await this.productService.updateProduct(id, data);
        res.json({ status: 'success', data: product });
    });

    /**
     * Admin panel product delete.
     */
    adminDeleteProduct = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        await this.productService.deleteProduct(id);
        res.json({ status: 'success', message: 'Ürün silindi.' });
    });
}
