/**
 * İstek Validasyon Middleware'i (Zod ve Hono Uyumlu).
 * Gelen isteğin body kısmını verilen şemaya göre doğrular ve doğrulanmış veriyi
 * `parsedBody` olarak context'e koyar (honoAdapter bunu controller'a iletir).
 *
 * @param {import('zod').ZodSchema} schema - Doğrulama şeması.
 * @returns {Function} Hono middleware fonksiyonu.
 */
export const validateRequest = (schema) => async (c, next) => {
    let body;
    try {
        body = await c.req.json();
    } catch {
        return c.json({ status: 'failure', errorMessage: 'Geçersiz JSON gövdesi.' }, 400);
    }

    const result = schema.safeParse(body);
    if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
        // Only field paths are logged: values may contain personal data (KVKK).
        console.warn('Doğrulama hatası: %s', errors.map((e) => e.path).join(', '));
        return c.json({
            status: 'failure',
            errorMessage: errors[0]?.message || 'Doğrulama hatası.',
            errors,
        }, 400);
    }

    c.set('parsedBody', result.data);
    await next();
};

