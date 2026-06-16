import axios from 'axios';

/**
 * API Base URL Configuration
 * Uses proxy in development to avoid CORS, and direct URL in production.
 */
export const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl) {
        return envUrl;
    }
    if (import.meta.env.DEV) return '';
    
    return 'https://api.ecommerceflaredev.web.tr';
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
