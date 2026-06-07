/**
 * Utility functions for formatting data
 * Implements DRY principle - reusable formatting functions used across the app
 */

/**
 * Format price in Turkish Lira
 * @param {number|string} price - Price value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted price string with ₺ symbol
 */
export const formatPrice = (price, decimals = 2) => {
    const numPrice = Number(price) || 0;
    return `₺${numPrice.toLocaleString('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })}`;
};

/**
 * Format phone number to Turkish format (0XXX XXX XX XX)
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 0) return '';
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;

    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9, 11)}`;
};

/**
 * Clean phone number by removing all non-digit characters
 * @param {string} phone - Formatted phone number
 * @returns {string} Clean phone number (only digits)
 */
export const cleanPhone = (phone) => {
    return phone.replace(/\D/g, '');
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {number} Discount percentage (rounded)
 */
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
    if (!discountedPrice || !originalPrice || discountedPrice >= originalPrice) {
        return 0;
    }
    return Math.round((1 - discountedPrice / originalPrice) * 100);
};

/**
 * Get display price (prefer discounted price over regular price)
 * @param {Object} product - Product object with fiyat and indirimliFiyat
 * @returns {number} Price to display
 */
export const getDisplayPrice = (product) => {
    return Number(product.indirimliFiyat || product.fiyat) || 0;
};

/**
 * Format date to Turkish locale
 * @param {string|Date} date - Date to format
 * @param {boolean} includeTime - Include time in output
 * @returns {string} Formatted date string
 */
export const formatDate = (date, includeTime = false) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...(includeTime && {
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    return dateObj.toLocaleDateString('tr-TR', options);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
