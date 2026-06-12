/**
 * KVKK / GDPR Compliance Privacy Middleware
 * 
 * Cleanses user telemetry requests by:
 * 1. Masking IP address (IPv4 last octet, IPv6 last 64 bits).
 * 2. Scrubbing personal identifiers (email address, phone numbers) from URL params, query string, and body payloads.
 */

// Email regex pattern matching standard RFC-5322 emails
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Turkish mobile phone format regex (e.g., 555 123 4567, 05551234567, +905551234567)
const TURKISH_PHONE_REGEX = /(?:\+90|0090|0)?\s*5[0-9]{2}\s*[0-9]{3}\s*[0-9]{2}\s*[0-9]{2}/g;

/**
 * Anonymizes IPv4 and IPv6 addresses.
 * @param {string} ip - Input IP address.
 * @returns {string} Anonymized IP address.
 */
export function maskIp(ip) {
    if (!ip) return '0.0.0.0';
    
    // IPv4 Address
    if (ip.includes('.')) {
        const parts = ip.split('.');
        if (parts.length === 4) {
            parts[3] = '0'; // Zero out last octet
            return parts.join('.');
        }
    }
    
    // IPv6 Address
    if (ip.includes(':')) {
        const parts = ip.split(':');
        // Zero out interface identifier details (lower 64 bits/last 4 blocks)
        if (parts.length >= 4) {
            const maskedParts = parts.slice(0, 4);
            return `${maskedParts.join(':')}::`;
        }
    }
    
    return '0.0.0.0';
}

/**
 * Sanitizes a string by replacing PII values with placeholders.
 * @param {string} str - Raw string content.
 * @returns {string} Sanitized string.
 */
export function sanitizeString(str) {
    if (!str || typeof str !== 'string') return str;
    return str
        .replace(EMAIL_REGEX, '[MASKED_EMAIL]')
        .replace(TURKISH_PHONE_REGEX, '[MASKED_PHONE]');
}

/**
 * Recursively scrubs PII from a JSON object/array.
 * @param {any} obj - Input object or array.
 * @returns {any} Scrubbed object.
 */
export function sanitizeObject(obj) {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }
    
    if (typeof obj === 'object') {
        const cleaned = {};
        for (const [key, val] of Object.entries(obj)) {
            // Sensitive key names matched directly
            const lowerKey = key.toLowerCase();
            if (['email', 'eposta', 'phone', 'telefon', 'fullname', 'adsoyad', 'address', 'adres', 'tc', 'tckn'].includes(lowerKey)) {
                cleaned[key] = typeof val === 'string' ? sanitizeString(val) : '[MASKED]';
            } else {
                cleaned[key] = sanitizeObject(val);
            }
        }
        return cleaned;
    }
    
    return obj;
}

/**
 * Hono middleware to execute KVKK sanitization on telemetry data.
 */
export async function kvkkMiddleware(c, next) {
    // 1. Resolve and mask IP
    const rawIp = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || '127.0.0.1';
    const clientIp = rawIp.split(',')[0].trim();
    c.set('maskedIp', maskIp(clientIp));

    // 2. Intercept and rewrite request query/body details if needed
    // Let's hook into the context to allow router routes to pull sanitized query params and payload
    c.set('sanitizeQuery', (queryString) => {
        if (!queryString) return '';
        const params = new URLSearchParams(queryString);
        for (const [key, value] of params.entries()) {
            params.set(key, sanitizeString(value));
        }
        return params.toString();
    });

    await next();
}
