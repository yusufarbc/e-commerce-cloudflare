import { config, currentEnv } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

/**
 * Identifies WebP, JPEG and PNG by their magic bytes.
 * @param {Uint8Array} head - First bytes of the file.
 * @returns {{extension: string, contentType: string}|null}
 */
export function detectImageType(head) {
    const ascii = (start, end) => String.fromCharCode(...head.subarray(start, end));
    if (head.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
        return { extension: 'webp', contentType: 'image/webp' };
    }
    if (head.length >= 3 && head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
        return { extension: 'jpg', contentType: 'image/jpeg' };
    }
    if (head.length >= 8 && head[0] === 0x89 && ascii(1, 4) === 'PNG' && head[4] === 0x0d && head[5] === 0x0a && head[6] === 0x1a && head[7] === 0x0a) {
        return { extension: 'png', contentType: 'image/png' };
    }
    return null;
}

/**
 * Controller for handling direct image uploads to Cloudflare R2 bucket.
 */
export class UploadController {
    /**
     * Upload image file to R2 bucket.
     */
    uploadImage = asyncHandler(async (req, res, next) => {
        const file = req.body.file;

        if (!file || typeof file.arrayBuffer !== 'function') {
            return res.status(400).json({ status: 'error', errorMessage: 'Dosya yüklenemedi veya geçersiz.' });
        }

        const env = currentEnv;
        if (!env || !env.IMAGES_BUCKET) {
            return res.status(500).json({ status: 'error', errorMessage: 'Görsel depolama servisi yapılandırılmamış.' });
        }

        if (file.size > MAX_UPLOAD_BYTES) {
            return res.status(413).json({ status: 'error', errorMessage: 'Görsel en fazla 5 MB olabilir.' });
        }

        // Type and extension come from the file's bytes, not from the client-supplied name or
        // MIME type, so an SVG or HTML file cannot be stored and served as active content.
        const buffer = await file.arrayBuffer();
        const detected = detectImageType(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 16)));
        if (!detected) {
            return res.status(415).json({ status: 'error', errorMessage: 'Yalnız WebP, JPEG veya PNG görseller yüklenebilir.' });
        }

        const key = `products/${crypto.randomUUID()}.${detected.extension}`;
        await env.IMAGES_BUCKET.put(key, buffer, {
            httpMetadata: { contentType: detected.contentType }
        });

        res.json({
            status: 'success',
            key: key,
            url: `${config.cdnUrl}/${key}`
        });
    });
}
