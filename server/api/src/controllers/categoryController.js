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
}
