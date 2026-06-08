import { BaseRepository } from './baseRepository.js';

export class ReturnRepository extends BaseRepository {
    constructor(dbClient) {
        super(dbClient.iadeTalebi);
    }

    /**
     * Finds a return request by ID with the associated order.
     * @param {string} id
     */
    async findByIdWithOrder(id) {
        return this.model.findUnique({
            where: { id },
            include: { siparis: true }
        });
    }

    /**
     * Retrieves all return requests for administration panel lists.
     * @returns {Promise<Array>}
     */
    async findAllForAdmin() {
        return this.model.findMany({
            include: { siparis: true },
            orderBy: { olusturulmaTarihi: 'desc' }
        });
    }
}
