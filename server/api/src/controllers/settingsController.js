import prisma from '../prisma.js';

export const settingsController = {
    /**
     * Get Global System Settings
     * Strategy: Since we enforce a singleton with ID "global-settings", we can directly fetch it.
     */
    getSettings: async (req, res, next) => {
        try {
            let settings = await prisma.sistemAyarlari.findUnique({
                where: { id: 'global-settings' }
            });

            // Fallback if seeded or found deleted
            if (!settings) {
                settings = await prisma.sistemAyarlari.create({
                    data: {
                        id: 'global-settings',
                        kargoAgirlikCarpani: 0,
                        ucretsizKargoAltLimit: 5000.00
                    }
                });
            }

            res.json(settings);
        } catch (error) {
            next(error);
        }
    }
};
