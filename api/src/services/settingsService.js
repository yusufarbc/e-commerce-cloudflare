/**
 * Service responsible for global system settings business logic.
 */
export class SettingsService {
    /**
     * @param {import('../repositories/settingsRepository.js').SettingsRepository} settingsRepository
     */
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    /**
     * Fetches the global settings singleton, creating it with defaults if it doesn't exist.
     */
    async getSettings() {
        let settings = await this.settingsRepository.getSettings();
        if (!settings) {
            settings = await this.settingsRepository.createSettings({
                kargoAgirlikCarpani: 15.00,
                ucretsizKargoAltLimit: 5000.00,
                maintenanceMode: false,
                siteAdi: 'E-Market'
            });
        }
        return settings;
    }

    /**
     * Updates the global settings singleton.
     */
    async updateSettings(data) {
        return this.settingsRepository.updateSettings(data);
    }
}
