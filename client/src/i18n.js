import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import trJSON from './locales/tr.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            tr: {
                translation: trJSON
            }
        },
        lng: 'tr', // Default language
        fallbackLng: 'tr',

        interpolation: {
            escapeValue: false // React already escapes by default
        }
    });

export default i18n;
