import axios from 'axios';

/**
 * API Base URL Configuration
 * Uses proxy in development to avoid CORS, and direct URL in production.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV
    ? '' // Relative path in dev to trigger Vite proxy
    : 'https://api.e-market-domain.com');

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
