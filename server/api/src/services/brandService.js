import { config } from '../config.js';

/**
 * Service responsible for brand business logic.
 * Handles brand retrieval and logo URL formatting.
 */
export class BrandService {
    /**
     * Creates an instance of BrandService.
     * @param {import('../repositories/brandRepository.js').BrandRepository} brandRepository - Brand repository instance.
     */
    constructor(brandRepository) {
        this.brandRepository = brandRepository;
    }

    /**
     * Formats brand data (adds CDN prefix to logo URL).
     * @param {Object} brand - Raw brand object from database.
     * @returns {Object|null} Formatted brand with CDN-prefixed logo URL.
     * @private
     */
    _formatBrand(brand) {
        if (!brand) return null;
        let logoUrl = brand.logoUrl;

        if (logoUrl && !logoUrl.startsWith('http') && config.cdnUrl) {
            const baseUrl = config.cdnUrl.endsWith('/') ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
            const path = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
            logoUrl = `${baseUrl}${path}`;
        }

        return {
            ...brand,
            logoUrl
        };
    }

    /**
     * Retrieves all brands sorted by display order.
     * @returns {Promise<Array<Object>>} Array of formatted brands.
     */
    async getAllBrands() {
        const brands = await this.brandRepository.findAll();
        return brands.map(b => this._formatBrand(b));
    }

    /**
     * Retrieves a single brand by its ID.
     * @param {string} id - Brand UUID.
     * @returns {Promise<Object|null>} Brand object or null if not found.
     */
    async getBrandById(id) {
        const brand = await this.brandRepository.findById(id);
        return this._formatBrand(brand);
    }

    /**
     * Creates a new brand.
     * @param {Object} data - Brand data (ad, slug, logoUrl, aktif, sira).
     * @returns {Promise<Object>} Created brand object.
     */
    async createBrand(data) {
        return this.brandRepository.create(data);
    }

    /**
     * Retrieves a single brand by its URL slug.
     * @param {string} slug - Brand URL slug.
     * @returns {Promise<Object|null>} Brand object or null if not found.
     */
    async getBrandBySlug(slug) {
        const brand = await this.brandRepository.findBySlug(slug);
        return this._formatBrand(brand);
    }
}

