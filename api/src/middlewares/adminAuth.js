import { verify } from 'hono/jwt';
import { config } from '../config.js';

/**
 * Admin JWT Authentication Middleware
 * Verifies the bearer token in Authorization header.
 */
export const adminAuth = async (c, next) => {
    // An empty key would let anyone mint tokens signed with "", so refuse instead.
    if (!config.adminJwtSecret) {
        return c.json({ status: 'error', errorMessage: 'Yönetici girişi yapılandırılmamış.' }, 503);
    }

    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ status: 'error', errorMessage: 'Yetkisiz erişim! Oturum bulunamadı.' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, config.adminJwtSecret, 'HS256');
        c.set('adminUser', payload);
        await next();
    } catch (e) {
        return c.json({ status: 'error', errorMessage: 'Oturum süresi dolmuş veya geçersiz token!' }, 401);
    }
};
