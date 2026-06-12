import { Hono } from 'hono';
import { kvkkMiddleware, sanitizeString, sanitizeObject } from '../middlewares/kvkkMiddleware.js';

const router = new Hono();

// Apply KVKK middleware globally to all metric routes
router.use('*', kvkkMiddleware);

/**
 * Proxy GTM container file
 * GET /api/v1/metrics/gtm.js?id=GTM-XXXX
 */
router.get('/gtm.js', async (c) => {
    const id = c.req.query('id');
    if (!id) {
        return c.text('Missing container id', 400);
    }

    try {
        const targetUrl = `https://www.googletagmanager.com/gtm.js?id=${id}`;
        
        // Fetch original container from Google
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': c.req.header('User-Agent') || ''
            }
        });

        if (!response.ok) {
            return c.text('Error retrieving GTM container', response.status);
        }

        let scriptText = await response.text();

        // Rewrite calls to google-analytics.com/g/collect to point to our proxy
        const originUrl = c.req.url;
        const urlObj = new URL(originUrl);
        const proxyCollectUrl = `${urlObj.origin}/api/v1/metrics/collect`;
        
        scriptText = scriptText.replace(
            /www\.google-analytics\.com\/g\/collect/g,
            proxyCollectUrl.replace(/^https?:\/\//, '')
        );

        return c.text(scriptText, 200, {
            'Content-Type': 'application/javascript; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
        });
    } catch (err) {
        return c.text(`Proxy failure: ${err.message}`, 500);
    }
});

/**
 * Proxy GA4 Telemetry hits
 * GET/POST /api/v1/metrics/collect
 */
const proxyCollect = async (c) => {
    const method = c.req.method;
    const rawQueryString = new URL(c.req.url).search;
    
    // Clean query string
    const sanitizeQuery = c.get('sanitizeQuery');
    const cleanQuery = sanitizeQuery ? sanitizeQuery(rawQueryString) : rawQueryString;
    
    // Read and clean body if POST
    let cleanBody = null;
    if (method === 'POST') {
        try {
            const contentType = c.req.header('Content-Type') || '';
            if (contentType.includes('application/json')) {
                const json = await c.req.json();
                cleanBody = JSON.stringify(sanitizeObject(json));
            } else {
                const text = await c.req.text();
                cleanBody = sanitizeString(text);
            }
        } catch (e) {
            // Body read error, fallback to empty
        }
    }

    const maskedIp = c.get('maskedIp');
    
    // Build target Google Analytics endpoint with query
    // Inject uip parameter for IP override inside GA4 Measurement Protocol
    const targetUrl = new URL('https://www.google-analytics.com/g/collect');
    targetUrl.search = cleanQuery;
    targetUrl.searchParams.set('uip', maskedIp); // Force Google to record anonymized IP

    try {
        const headers = {
            'User-Agent': c.req.header('User-Agent') || '',
            'Content-Type': c.req.header('Content-Type') || 'text/plain',
            'X-Forwarded-For': maskedIp,
            'X-Real-IP': maskedIp
        };

        const response = await fetch(targetUrl.toString(), {
            method,
            headers,
            body: cleanBody
        });

        // Set response headers
        c.header('Cache-Control', 'no-store, no-cache, must-revalidate');
        c.header('Access-Control-Allow-Origin', '*');

        if (response.status === 204 || response.status === 200) {
            return c.body(null, 204);
        }

        const resBody = await response.text();
        return c.text(resBody, response.status);
    } catch (err) {
        return c.text(`Collector proxy error: ${err.message}`, 500);
    }
};

router.get('/collect', proxyCollect);
router.post('/collect', proxyCollect);

export default router;
