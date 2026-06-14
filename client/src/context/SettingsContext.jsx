import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';
import { MaintenancePage } from '../pages/MaintenancePage';
import { initFacebookPixel, initGTM } from '../utils/analytics';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        siteTitle: 'E-Market',
        companyName: 'E-Market',
        currency: 'TRY',
        kargoDesiCarpani: 15,
        ucretsizKargoAltLimit: 10000 // Default fallback
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/api/v1/settings');
                // Ensure numbers are numbers
                const formattedSettings = {
                    ...response.data,
                    kargoDesiCarpani: Number(response.data.kargoDesiCarpani),
                    ucretsizKargoAltLimit: Number(response.data.ucretsizKargoAltLimit)
                };
                setSettings(formattedSettings);
                if (formattedSettings.metaPixelId) {
                    initFacebookPixel(formattedSettings.metaPixelId);
                }
                if (formattedSettings.gtmContainerId) {
                    initGTM(formattedSettings.gtmContainerId);
                }
            } catch (error) {
                console.error('Settings Fetch Error:', error);
                // Keep defaults on error
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    if (!loading && settings.maintenanceMode) {
        return <MaintenancePage />;
    }

    return (
        <SettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
