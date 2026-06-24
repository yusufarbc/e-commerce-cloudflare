import { z } from 'zod';

/**
 * İstek Validasyon Middleware'i (Zod ve Hono Uyumlu).
 * Gelen isteğin body kısmını verilen şemaya göre doğrular.
 * 
 * @param {import('zod').ZodSchema} schema - Doğrulama şeması.
 * @returns {Function} Hono middleware fonksiyonu.
 */
export const validateRequest = (schema) => async (c, next) => {
    try {
        const body = await c.req.json();
        const parsed = schema.parse(body);
        c.set('parsedBody', parsed); // Body verisini context'e kaydet (c.get('parsedBody'))
        await next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Doğrulama Hatası:', JSON.stringify(error.issues, null, 2));
            return c.json({
                status: 'failure',
                errorMessage: 'Doğrulama Hatası (Validation Error)',
                errors: error.issues
            }, 400);
        }
        throw error;
    }
};
