import { verify } from 'hono/jwt';
import { config } from '../config.js';

/**
 * Admin JWT Authentication Middleware
 * Verifies the bearer token in Authorization header.
 */
export const adminAuth = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ status: 'error', errorMessage: 'Yetkisiz erişim! Oturum bulunamadı.' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, config.adminJwtSecret);
        c.set('adminUser', payload);
        await next();
    } catch (e) {
        return c.json({ status: 'error', errorMessage: 'Oturum süresi dolmuş veya geçersiz token!' }, 401);
    }
};
