import { config } from '../config.js';

/**
 * Service responsible for category business logic.
 * Handles category retrieval and image URL formatting.
 */
export class CategoryService {

    /**
     * Creates an instance of CategoryService.
     * @param {import('../repositories/categoryRepository.js').CategoryRepository} categoryRepository - Category repository instance.
     */
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Formats category data (adds CDN prefix to image URL).
     * Recursively formats subcategories as well.
     * @param {Object} category - Raw category object from database.
     * @returns {Object|null} Formatted category with CDN-prefixed image URLs.
     * @private
     */
    _formatCategory(category) {
        if (!category) return null;
        let resim = category.resim;

        if (resim && !resim.startsWith('http') && config.cdnUrl) {
            const baseUrl = config.cdnUrl.endsWith('/') ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
            const path = resim.startsWith('/') ? resim : `/${resim}`;
            resim = `${baseUrl}${path}`;
        }

        // Recursively format subcategories
        let altKategoriler = category.altKategoriler;
        if (altKategoriler && Array.isArray(altKategoriler)) {
            altKategoriler = altKategoriler.map(cat => this._formatCategory(cat));
        }

        return {
            ...category,
            resim,
            altKategoriler
        };
    }

    /**
     * Retrieves all categories with subcategories.
     * @returns {Promise<Array<Object>>} Array of formatted categories.
     */
    async getAllCategories() {
        const categories = await this.categoryRepository.findAll();
        return categories.map(c => this._formatCategory(c));
    }
}

