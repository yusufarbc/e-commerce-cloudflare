import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Kategori HTTP isteklerini yöneten Controller.
 * CategoryController
 */
export class CategoryController {
    /**
     * CategoryController örneği oluşturur.
     * @param {import('../services/categoryService.js').CategoryService} categoryService - Kategori servisi.
     */
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Tüm kategorileri getiren isteği işler.
     * 
     * @param {import('express').Request} req - Express istek nesnesi.
     * @param {import('express').Response} res - Express yanıt nesnesi.
     * @param {import('express').NextFunction} next - Express next fonksiyonu.
     */
    getCategories = asyncHandler(async (req, res, next) => {
        const categories = await this.categoryService.getAllCategories();
        res.json(categories);
    });

    /**
     * Admin panel category listing.
     */
    adminGetCategories = asyncHandler(async (req, res, next) => {
        const categories = await this.categoryService.getAllCategoriesForAdmin();
        res.json({ status: 'success', data: categories });
    });

    /**
     * Admin panel category creation.
     */
    adminCreateCategory = asyncHandler(async (req, res, next) => {
        const body = req.body;
        const slug = body.ad.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const cat = await this.categoryService.createCategory({
            ad: body.ad,
            slug: slug,
            resim: body.resim || null,
            sira: parseInt(body.sira || 0, 10),
            aktif: body.aktif !== false
        });

        res.json({ status: 'success', data: cat });
    });

    /**
     * Admin panel category update.
     */
    adminUpdateCategory = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const body = req.body;

        const data = {};
        if (body.ad !== undefined) {
            data.ad = body.ad;
            data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (body.resim !== undefined) data.resim = body.resim;
        if (body.sira !== undefined) data.sira = parseInt(body.sira, 10);
        if (body.aktif !== undefined) data.aktif = body.aktif !== false;

        const cat = await this.categoryService.updateCategory(id, data);
        res.json({ status: 'success', data: cat });
    });

    /**
     * Admin panel category delete.
     */
    adminDeleteCategory = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        await this.categoryService.deleteCategory(id);
        res.json({ status: 'success', message: 'Kategori silindi.' });
    });
}
