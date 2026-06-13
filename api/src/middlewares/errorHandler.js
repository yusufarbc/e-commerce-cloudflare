import { config } from '../config.js';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Global Hata Yakalama Middleware'i (Hono Uyumlu).
 * Uygulama genelinde fırlatılan tüm hataları yakalar ve standart JSON formatında döner.
 */
export const errorHandler = (err, c) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Sunucu Hatası (Internal Server Error)';
    let details = undefined;

    // Zod Validation Errors
    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Geçersiz Veri Girişi';
        details = err.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
        }));
    }

    // Prisma Database Errors
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            statusCode = 409;
            message = 'Benzersizlik kısıtlaması ihlal edildi (Duplicate Entry)';
        } else if (err.code === 'P2025') {
            statusCode = 404;
            message = 'Kayıt bulunamadı';
        }
    }

    console.error('[Hata] %s - %s %s: %s', statusCode, c.req.method, c.req.path, message);
    if (config.nodeEnv === 'development' && !(err instanceof ZodError)) {
        console.error(err.stack);
    }

    return c.json({
        success: false,
        error: message,
        details,
        stack: config.nodeEnv === 'development' ? err.stack : undefined
    }, statusCode);
};
