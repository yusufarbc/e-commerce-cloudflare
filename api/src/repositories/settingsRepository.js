import { BaseRepository } from './baseRepository.js';

export class SettingsRepository extends BaseRepository {
    constructor(dbClient) {
        super(dbClient.sistemAyarlari);
    }

    async getSettings() {
        return this.model.findUnique({
            where: { id: 'global-settings' }
        });
    }

    async createSettings(data) {
        return this.model.create({
            data: {
                id: 'global-settings',
                ...data
            }
        });
    }

    async updateSettings(data) {
        return this.model.update({
            where: { id: 'global-settings' },
            data
        });
    }
}
