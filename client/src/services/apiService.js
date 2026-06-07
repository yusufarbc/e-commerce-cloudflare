import api from '../lib/axios';

/**
 * API Service Layer
 * Abstracts all API calls and provides a clean interface for data fetching.
 * Implements Dependency Inversion Principle - components depend on this abstraction, not on axios directly.
 */

// ============================================
// Product Service
// ============================================

/**
 * Fetch all products with optional filters
 * @param {Object} params - Query parameters (markaId, kategoriId, search, limit)
 * @returns {Promise<Array>} Array of products
 */
export const fetchProducts = async (params = {}) => {
    try {
        const response = await api.get('/api/v1/products', { params });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw new Error('Ürünler yüklenemedi. Lütfen tekrar deneyin.');
    }
};

/**
 * Fetch a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product details
 */
export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/api/v1/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product with id:', id, error);
        throw new Error('Ürün detayları yüklenemedi.');
    }
};

/**
 * Fetch a single product by Slug
 * @param {string} slug - Product Slug
 * @returns {Promise<Object>} Product details
 */
export const fetchProductBySlug = async (slug) => {
    try {
        const response = await api.get(`/api/v1/products/slug/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch product with slug:', slug, error);
        throw new Error('Ürün detayları yüklenemedi.');
    }
};

// ============================================
// Category Service
// ============================================

/**
 * Fetch all categories
 * @returns {Promise<Array>} Array of categories with subcategories
 */
export const fetchCategories = async () => {
    try {
        const response = await api.get('/api/v1/categories');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw new Error('Kategoriler yüklenemedi.');
    }
};

/**
 * Get top-level categories (no parent)
 * @returns {Promise<Array>} Array of top-level categories sorted by order
 */
export const fetchTopCategories = async () => {
    try {
        const categories = await fetchCategories();
        return categories
            .filter(c => !c.ustKategoriId)
            .sort((a, b) => (a.sira || 0) - (b.sira || 0));
    } catch (error) {
        throw error;
    }
};

// ============================================
// Brand Service
// ============================================

/**
 * Fetch all brands
 * @returns {Promise<Array>} Array of brands
 */
export const fetchBrands = async () => {
    try {
        const response = await api.get('/api/v1/brands');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch brands:', error);
        throw new Error('Markalar yüklenemedi.');
    }
};

// ============================================
// Order Service
// ============================================

/**
 * Create a new order and initiate payment
 * @param {Object} orderData - Order details including items, guestInfo, invoiceInfo
 * @returns {Promise<Object>} Order response with payment URL
 */
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/api/v1/orders/checkout', orderData);
        return response.data;
    } catch (error) {
        console.error('Failed to create order:', error);

        // Extract validation errors if available
        if (error.response?.data?.errors) {
            const validationErrors = {};
            error.response.data.errors.forEach(err => {
                const fieldName = err.path?.length > 1 ? err.path[1] : err.path?.[0];
                if (fieldName) validationErrors[fieldName] = err.message;
            });
            throw { validationErrors, message: 'Lütfen form bilgilerinizi kontrol edin.' };
        }

        throw new Error('Sipariş oluşturulamadı. Lütfen tekrar deneyin.');
    }
};

/**
 * Track an order by token
 * @param {string} token - Order tracking token
 * @returns {Promise<Object>} Order details
 */
export const trackOrder = async (token) => {
    try {
        const response = await api.get('/api/v1/orders/track', {
            params: { token }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to track order:', error);
        throw new Error('Sipariş bulunamadı. Lütfen takip numaranızı kontrol edin.');
    }
};

/**
 * Cancel an order
 * @param {string} token - Order tracking token
 * @param {string} reason - Cancellation reason
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelOrder = async (token, reason) => {
    try {
        const response = await api.post('/api/v1/orders/cancel', { token, reason });
        return response.data;
    } catch (error) {
        console.error('Failed to cancel order:', error);
        throw new Error('Sipariş iptal edilemedi. Lütfen müşteri hizmetleri ile iletişime geçin.');
    }
};

// ============================================
// Settings Service
// ============================================

/**
 * Fetch application settings
 * @returns {Promise<Object>} Settings object
 */
export const fetchSettings = async () => {
    try {
        const response = await api.get('/api/v1/settings');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Return default settings if fetch fails
        return {
            ucretsizKargoAltLimit: 2500,
            kargoDesiCarpani: 15
        };
    }
};
