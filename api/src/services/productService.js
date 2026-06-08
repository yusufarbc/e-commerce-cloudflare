import { config } from '../config.js';

/**
 * Service responsible for product business logic.
 * Handles product retrieval, image URL formatting, and CDN integration.
 */
export class ProductService {
    /**
     * Creates an instance of ProductService.
     * @param {import('../repositories/productRepository.js').ProductRepository} productRepository - Product repository instance.
     * @param {import('../repositories/categoryRepository.js').CategoryRepository} categoryRepository - Category repository instance.
     * @param {import('@prisma/client').PrismaClient} prisma - Prisma client for palette lookups.
     */
    constructor(productRepository, categoryRepository, prisma) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.prisma = prisma;
    }

    _getSectionCandidates(isInteriorPaint, isExteriorPaint) {
        if (isInteriorPaint) {
            return ['ic-cephe', 'İç Cephe', 'Ic Cephe', 'iç cephe'];
        }

        if (isExteriorPaint) {
            return ['dis-cephe', 'Dış Cephe', 'Dis Cephe', 'dış cephe'];
        }

        return [];
    }

    /**
     * Formats product data, ensuring image URLs are absolute paths with CDN prefix.
     * @param {Object} product - Raw product object from database.
     * @returns {Object|null} Formatted product with CDN-prefixed image URLs.
     * @private
     */
    async _formatProduct(product) {
        if (!product) return null;

        // Parse renkSecenekleri from JSON string if stored as text (SQLite)
        if (typeof product.renkSecenekleri === 'string') {
            try {
                product.renkSecenekleri = JSON.parse(product.renkSecenekleri);
            } catch (e) {
                product.renkSecenekleri = [];
            }
        }

        const paletteRows = await this._getPaletteRows(product);

        let resimUrl = product.resimUrl;

        // Backward compatibility: Use first image from array as main image if available
        if (product.resimler && product.resimler.length > 0) {
            resimUrl = product.resimler[0].url;
        }

        if (resimUrl && !resimUrl.startsWith('http') && config.cdnUrl) {
            const baseUrl = config.cdnUrl.endsWith('/') ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
            const path = resimUrl.startsWith('/') ? resimUrl : `/${resimUrl}`;
            resimUrl = `${baseUrl}${path}`;
        }

        // Format all images in the array (add CDN URL)
        const resimler = (product.resimler || []).map(img => {
            let url = img.url;
            if (url && !url.startsWith('http') && config.cdnUrl) {
                const baseUrl = config.cdnUrl.endsWith('/') ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
                const path = url.startsWith('/') ? url : `/${url}`;
                url = `${baseUrl}${path}`;
            }
            return { ...img, url };
        });

        return {
            ...product,
            resimUrl,
            resimler,
            renkKartelasi: paletteRows
        };
    }

    async _getPaletteRows(product) {
        if (!product) return [];

        const isInteriorPaint = Boolean(product.kartelaIcCephe);
        const isExteriorPaint = Boolean(product.kartelaDisCephe);

        // Force return empty array if not explicitly marked as a paint color palette product.
        // This ensures generic products use simple color selections (renkSecenekleri) without database palette lookups.
        if (!isInteriorPaint && !isExteriorPaint) {
            return [];
        }

        const selectedNames = Array.isArray(product.renkSecenekleri)
            ? product.renkSecenekleri.map((item) => String(item || '').trim()).filter(Boolean)
            : [];

        const hasSelectedNames = selectedNames.length > 0;

        // Log for production debugging to verify deployment
        console.log(`[PaletteCheck] Product: "${product.ad}" | Colors: ${hasSelectedNames} | Int: ${isInteriorPaint} | Ext: ${isExteriorPaint}`);

        const sectionCandidates = this._getSectionCandidates(isInteriorPaint, isExteriorPaint);

        const where = {
            aktif: true,
            ...(hasSelectedNames
                ? { name: { in: selectedNames } }
                : { section: { in: sectionCandidates } })
        };

        const rows = await this.prisma.renkKartelasi.findMany({
            where,
            orderBy: [{ sira: 'asc' }, { name: 'asc' }]
        });

        return rows.map((row) => ({
            id: row.id,
            section: row.section,
            code: row.code,
            name: row.name,
            hex: row.hex,
            rgb: row.rgb,
            sourceFile: row.sourceFile
        }));
    }

    /**
     * Retrieves all products with optional filtering.
     * @param {Object} [filters={}] - Optional filters (kategoriId, markaId).
     * @returns {Promise<Array<Object>>} Array of formatted products.
     */
    async getAllProducts(filters = {}) {
        // If slug provided instead of ID, look up the category ID
        if (filters.kategoriSlug && !filters.kategoriId && this.categoryRepository) {
            const category = await this.categoryRepository.findBySlug(filters.kategoriSlug);

            if (category) {
                filters.kategoriId = category.id;
            }
        }

        const products = await this.productRepository.findAllWithCategories(filters);
        return Promise.all(products.map((p) => this._formatProduct(p)));
    }

    /**
     * Retrieves a single product by its ID.
     * @param {string} id - Product UUID.
     * @returns {Promise<Object|null>} Product object or null if not found.
     */
    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        return this._formatProduct(product);
    }

    /**
     * Retrieves a single product by its Slug.
     * @param {string} slug - Product Slug.
     * @returns {Promise<Object|null>} Product object or null if not found.
     */
    async getProductBySlug(slug) {
        const product = await this.productRepository.findBySlug(slug);
        return this._formatProduct(product);
    }

    /**
     * Increments the view count for a product.
     * @param {string} id - Product UUID.
     * @returns {Promise<void>}
     */
    async incrementViewCount(id) {
        await this.productRepository.incrementViewCount(id);
    }

    /**
     * Retrieves all products (including inactive ones) for administration list.
     */
    async getAllProductsForAdmin() {
        const products = await this.productRepository.findAllForAdmin();
        return Promise.all(products.map(p => this._formatProduct(p)));
    }

    /**
     * Creates a new product.
     */
    async createProduct(data) {
        return this.productRepository.create(data);
    }

    /**
     * Updates an existing product.
     */
    async updateProduct(id, data) {
        return this.productRepository.update(id, data);
    }

    /**
     * Deletes a product.
     */
    async deleteProduct(id) {
        return this.productRepository.delete(id);
    }
}

