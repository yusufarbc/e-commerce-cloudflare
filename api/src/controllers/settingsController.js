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

        // Kargo Ayarları
        if (body.kargoAgirlikCarpani !== undefined) data.kargoAgirlikCarpani = parseFloat(body.kargoAgirlikCarpani);
        if (body.ambarEsikAgirlik !== undefined) data.ambarEsikAgirlik = parseInt(body.ambarEsikAgirlik, 10);
        if (body.ucretsizKargoAltLimit !== undefined) data.ucretsizKargoAltLimit = parseFloat(body.ucretsizKargoAltLimit);
        if (body.kargoFiyatListesi !== undefined) {
            data.kargoFiyatListesi = typeof body.kargoFiyatListesi === 'object' 
                ? JSON.stringify(body.kargoFiyatListesi) 
                : body.kargoFiyatListesi;
        }
        if (body.kargoPolitikaTuru !== undefined) data.kargoPolitikaTuru = body.kargoPolitikaTuru;
        if (body.kargoSabitUcret !== undefined) data.kargoSabitUcret = parseFloat(body.kargoSabitUcret);
        if (body.maintenanceMode !== undefined) data.maintenanceMode = !!body.maintenanceMode;

        // Site Genel Ayarları
        if (body.siteAdi !== undefined) data.siteAdi = body.siteAdi;

        // İletişim Bilgileri
        if (body.iletisimEmail !== undefined) data.iletisimEmail = body.iletisimEmail || null;
        if (body.whatsappNumarasi !== undefined) data.whatsappNumarasi = body.whatsappNumarasi || null;
        if (body.telefon !== undefined) data.telefon = body.telefon || null;
        if (body.adres !== undefined) data.adres = body.adres || null;

        // Sosyal Medya
        if (body.instagramUrl !== undefined) data.instagramUrl = body.instagramUrl || null;
        if (body.facebookUrl !== undefined) data.facebookUrl = body.facebookUrl || null;
        if (body.twitterUrl !== undefined) data.twitterUrl = body.twitterUrl || null;
        if (body.youtubeUrl !== undefined) data.youtubeUrl = body.youtubeUrl || null;

        // Entegrasyonlar
        if (body.metaPixelId !== undefined) data.metaPixelId = body.metaPixelId || null;
        if (body.googleMerchantToken !== undefined) data.googleMerchantToken = body.googleMerchantToken || null;

        // İçerik
        if (body.hakkindaMetni !== undefined) data.hakkindaMetni = body.hakkindaMetni || null;

        const settings = await this.settingsService.updateSettings(data);
        res.json({ status: 'success', data: settings });
    });
}
