import axios from 'axios';

/**
 * API Base URL Configuration
 * Uses proxy in development to avoid CORS, and direct URL in production.
 */
export const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('ecommerce-api.yusuftalhaarabaci-91d.workers.dev') && !envUrl.includes('ecommerce-api-staging.yusuftalhaarabaci-91d.workers.dev')) {
        return envUrl;
    }
    if (import.meta.env.DEV) return '';
    
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    if (hostname.includes('test') || hostname.includes('staging') || hostname.includes('ecommerce-admin-v4s') || hostname.includes('ecommerce-storefront-dm5')) {
        return 'https://e-commerce-cloudflare-staging.yusuftalhaarabaci-91d.workers.dev';
    }
    return 'https://e-commerce-cloudflare.yusuftalhaarabaci-91d.workers.dev';
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
