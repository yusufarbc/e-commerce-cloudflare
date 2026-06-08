import { BaseRepository } from './baseRepository.js';

export class BrandRepository extends BaseRepository {
    constructor(dbClient) {
        super(dbClient.marka);
    }

    async findAll() {
        return this.model.findMany({
            where: { aktif: true },
            orderBy: { sira: 'asc' },
        });
    }

    async findBySlug(slug) {
        return this.model.findUnique({
            where: { slug }
        });
    }

    /**
     * Retrieves all brands ordered by index for administrative panel.
     * @returns {Promise<Array>}
     */
    async findAllForAdmin() {
        return this.model.findMany({
            orderBy: { sira: 'asc' }
        });
    }
}
