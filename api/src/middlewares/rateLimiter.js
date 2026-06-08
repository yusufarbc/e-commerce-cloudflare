import rateLimit from 'express-rate-limit';

/**
 * Genel API oran sınırlayıcısı
 * 15 dakika içinde aynı IP'den maksimum 1000 istek (Gevşetildi)
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 1000, // Her IP için limit (Arttırıldı)
    standardHeaders: true, // `RateLimit-*` başlıklarını yanıtla (draft-6)
    legacyHeaders: false, // `X-RateLimit-*` başlıklarını devre dışı bırak
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin.'
    }
});

/**
 * Hassas rotalar için daha sıkı sınırlayıcı (örn. login, register)
 * 15 dakika içinde aynı IP'den maksimum 100 istek
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // Arttırıldı

    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'Çok fazla başarısız deneme, lütfen bir süre bekleyin.'
    }
});
