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
        // Note: View count is still ID based, so we use product.id
        if (product.id) {
            this.productService.incrementViewCount(product.id).catch(err =>
                console.error('Failed to increment view count:', err)
            );
        }

        res.json(product);
    });
}
