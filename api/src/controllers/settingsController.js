import { asyncHandler } from '../utils/asyncHandler.js';

export class SettingsController {
    /**
     * @param {import('../services/settingsService.js').SettingsService} settingsService
     */
    constructor(settingsService) {
        this.settingsService = settingsService;
    }

    /**
     * Get system settings (Public or Admin)
     */
    getSettings = asyncHandler(async (req, res, next) => {
        const settings = await this.settingsService.getSettings();
        res.json(settings);
    });

    /**
     * Update system settings (Admin)
     */
    updateSettings = asyncHandler(async (req, res, next) => {
        const body = req.body;
        const data = {};
        if (body.kargoAgirlikCarpani !== undefined) data.kargoAgirlikCarpani = parseFloat(body.kargoAgirlikCarpani);
        if (body.ambarEsikAgirlik !== undefined) data.ambarEsikAgirlik = parseInt(body.ambarEsikAgirlik, 10);
        if (body.ucretsizKargoAltLimit !== undefined) data.ucretsizKargoAltLimit = parseFloat(body.ucretsizKargoAltLimit);
        if (body.kargoFiyatListesi !== undefined) {
            data.kargoFiyatListesi = typeof body.kargoFiyatListesi === 'object' 
                ? JSON.stringify(body.kargoFiyatListesi) 
                : body.kargoFiyatListesi;
        }
        if (body.maintenanceMode !== undefined) data.maintenanceMode = !!body.maintenanceMode;

        const settings = await this.settingsService.updateSettings(data);
        res.json({ status: 'success', data: settings });
    });
}
