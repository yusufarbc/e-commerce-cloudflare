import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { initConfig } from './config.js';
import { getPrisma } from './prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { rateLimit } from './middlewares/rateLimit.js';

// Sub-routers
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import returnRoutes from './routes/returnRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import feedRoutes from './routes/feedRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';
import { feedController } from './container.js';
import { adapt } from './utils/honoAdapter.js';

// Hono App Instance
const app = new Hono();

/**
 * Global Middlewares
 */
app.use('*', cors({
    // Only echo origins listed in CORS_ORIGIN (comma-separated); credentials are allowed,
    // so reflecting arbitrary origins would expose admin sessions cross-site.
    origin: (origin, c) => {
        const allowed = (c.env.CORS_ORIGIN || '').split(',').map((o) => o.trim()).filter(Boolean);
        return allowed.includes(origin) ? origin : null;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

// Security headers (HSTS, nosniff, X-Frame-Options, Referrer-Policy, ...). The API is
// public and its GTM proxy script is loaded cross-origin by the storefront, so CORP
// must allow cross-origin embedding.
app.use('*', secureHeaders({ crossOriginResourcePolicy: 'cross-origin' }));

// Rate limits (Workers Rate Limiting bindings in wrangler.toml). Registered after CORS so
// 429 responses still carry CORS headers; stricter budget for order/payment/return flows.
app.use('/api/*', rateLimit('API_RATE_LIMITER', 'api'));
for (const path of ['/api/v1/orders/*', '/api/v1/payment/*', '/api/v1/returns/*']) {
    app.use(path, rateLimit('SENSITIVE_RATE_LIMITER', 'sensitive'));
}

// Initialize database and configurations dynamically per isolate invocation
app.use('*', async (c, next) => {
    initConfig(c.env);
    getPrisma(c.env);
    await next();
});

/**
 * Public Customer API Routes
 */
app.get('/api/v1/health', (c) => {
    return c.json({ status: 'UP', timestamp: new Date() });
});

// Mount modular public sub-routers
app.route('/api/v1/products', productRoutes);
app.route('/api/v1/categories', categoryRoutes);
app.route('/api/v1/brands', brandRoutes);
app.route('/api/v1/orders', orderRoutes);
app.route('/api/v1/returns', returnRoutes);
// Mount payment routes under a provider-agnostic path (Dependency Inversion Principle:
// the router does not depend on which concrete payment provider is active at runtime).
app.route('/api/v1/payment', paymentRoutes);
app.route('/api/v1/settings', settingsRoutes);
app.route('/api/v1/feeds', feedRoutes);

// Mount sitemaps (SEO) at both root and api/v1 paths
app.route('/', seoRoutes);
app.route('/api/v1', seoRoutes);

// Mount modular protected admin sub-router
app.route('/api/v1/admin', adminRoutes);

// Mount metrics telemetry routes
app.route('/api/v1/metrics', metricsRoutes);

// Direct Merchant Center Catalog Feed mapping
app.get('/api/v1/catalog/google-feed', adapt(feedController.getGoogleShoppingFeed));

/**
 * Global Error Handler
 */
app.onError(errorHandler);

// Export Hono App for Fetch, and custom Scheduled handler for Cloudflare Cron Triggers
export default {
    fetch: app.fetch,
    async scheduled(event, env, ctx) {
        console.log('[Cron Trigger] Active: executing scheduled task for cron: %s', event.cron);
        try {
            const clientUrl = env.CLIENT_URL || 'https://ecommerceflaredev.web.tr';
            const sitemapUrl = `${clientUrl}/sitemap.xml`;
            // Trigger a warm-up call to the sitemap endpoint to build cache
            const apiFetchUrl = `${env.API_URL || 'http://localhost:8787'}/sitemap.xml`;
            const response = await fetch(apiFetchUrl);
            if (response.ok) {
                console.log('[Cron Trigger] Sitemap cache warmed successfully: %s', sitemapUrl);
            } else {
                console.warn('[Cron Trigger] Sitemap warm up returned status: %s', response.status);
            }
        } catch (error) {
            console.error('[Cron Trigger] Failed to run sitemap cron updates:', error);
        }
    }
};
