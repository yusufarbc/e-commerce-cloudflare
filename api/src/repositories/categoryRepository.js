import { BaseRepository } from './baseRepository.js';

/**
 * Kategori veri etkileşimlerini yöneten Repository.
 * Temel CRUD işlemleri için BaseRepository'yi genişletir.
 */
export class CategoryRepository extends BaseRepository {
    /**
     * CategoryRepository örneği oluşturur.
     * @param {import('@prisma/client').PrismaClient} dbClient - Veritabanı istemcisi (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.kategori);
    }

    async findAll() {
        return this.model.findMany({
            where: {
                ustKategoriId: null
            },
            include: {
                altKategoriler: true
            },
            orderBy: {
                id: 'asc'
            }
        });
    }

    /**
     * Slug'a göre kategori bulur.
     * @param {string} slug - Kategori slug'ı.
     * @returns {Promise<Object|null>} Kategori.
     */
    async findBySlug(slug) {
        return this.model.findUnique({
            where: { slug }
        });
    }

    /**
     * Retrieves all categories ordered by index for administrative panel.
     * @returns {Promise<Array>}
     */
    async findAllForAdmin() {
        return this.model.findMany({
            orderBy: { sira: 'asc' }
        });
    }
}
