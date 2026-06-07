import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Urun data interactions.
 * Extends BaseRepository for common CRUD operations.
 */
export class ProductRepository extends BaseRepository {
    /**
     * Creates an instance of ProductRepository.
     * @param {import('@prisma/client').PrismaClient} dbClient - The database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.urun);
    }

    /**
     * Retrieves all products including their associated category.
     * @returns {Promise<Array<import('@prisma/client').Urun & { kategori: import('@prisma/client').Kategori }>>} A promise that resolves to an array of products with categories.
     */
    async findAllWithCategories(filters = {}) {
        const where = { aktif: true }; // Only active products by default

        if (filters.markaId) where.markaId = filters.markaId;
        if (filters.kategoriId) {
            where.OR = [
                { kategoriId: filters.kategoriId }, // Direct match (product is in this category)
                { kategori: { ustKategoriId: filters.kategoriId } } // Indirect match (product is in a subcategory of this category)
            ];
        }

        // Feature flag filters
        if (filters.oneCikan) where.oneCikan = true;
        if (filters.firsatUrunu) where.firsatUrunu = true;
        if (filters.yeniUrun) where.yeniUrun = true;
        if (filters.cokSatanlar) where.cokSatanlar = true;

        // Determine ordering based on filters
        let orderBy = { olusturulmaTarihi: 'desc' };
        if (filters.cokSatanlar) {
            orderBy = { satisAdedi: 'desc' }; // Sort best sellers by sales count
        } else if (filters.oneCikan) {
            orderBy = { goruntulemeSayisi: 'desc' }; // Sort featured by views
        }

        return this.findAll({
            where,
            include: {
                kategori: true,
                marka: true,
                resimler: {
                    orderBy: { sira: 'asc' }
                }
            },
            orderBy
        });
    }

    /**
     * Retrieves a single product by its ID with relations.
     * @param {string} id - The ID of the product.
     * @returns {Promise<import('@prisma/client').Urun|null>} The product with relations.
     */
    async findById(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                kategori: true,
                marka: true,
                resimler: {
                    orderBy: { sira: 'asc' }
                }
            }
        });
    }

    /**
     * Retrieves a single product by its Slug with relations.
     * @param {string} slug - The SEO slug of the product.
     * @returns {Promise<import('@prisma/client').Urun|null>} The product with relations.
     */
    async findBySlug(slug) {
        return this.model.findUnique({
            where: { slug },
            include: {
                kategori: true,
                marka: true,
                resimler: {
                    orderBy: { sira: 'asc' }
                }
            }
        });
    }

    /**
     * Increments the view count for a product.
     * @param {string} id - The ID of the product.
     * @returns {Promise<void>}
     */
    async incrementViewCount(id) {
        await this.model.update({
            where: { id },
            data: {
                goruntulemeSayisi: {
                    increment: 1
                }
            }
        });
    }
}
