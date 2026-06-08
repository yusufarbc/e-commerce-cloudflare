import { config, currentEnv } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';

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

        const extension = file.name.split('.').pop() || 'webp';
        const key = `products/${crypto.randomUUID()}.${extension}`;
        
        const buffer = await file.arrayBuffer();
        await env.IMAGES_BUCKET.put(key, buffer, {
            httpMetadata: { contentType: file.type || 'image/webp' }
        });

        res.json({
            status: 'success',
            key: key,
            url: `${config.cdnUrl}/${key}`
        });
    });
}
