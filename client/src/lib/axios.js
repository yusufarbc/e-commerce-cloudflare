import axios from 'axios';

/**
 * API Base URL Configuration
 * Uses proxy in development to avoid CORS, and direct URL in production.
 */
const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (import.meta.env.DEV) return '';
    
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    if (hostname.includes('test') || hostname.includes('staging')) {
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
