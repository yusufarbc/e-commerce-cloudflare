import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign } from 'hono/jwt';
import { config, initConfig } from './config.js';
import { getPrisma } from './prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';

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

// Hono App Instance
const app = new Hono();

/**
 * Global Middlewares
 */
app.use('*', cors({
    origin: (origin) => {
        return origin;
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

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

app.get('/api/v1/debug-db', async (c) => {
    try {
        const result = await c.env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        const urunler = await c.env.DB.prepare("SELECT * FROM urunler").all();
        const kategoriler = await c.env.DB.prepare("SELECT * FROM kategoriler").all();
        return c.json({ tables: result.results, urunler: urunler.results, kategoriler: kategoriler.results });
    } catch(e) {
        return c.json({ error: e.message, stack: e.stack }, 500);
    }
});

// Admin Login (Public endpoint before jwt check)
app.post('/api/v1/admin/login', async (c) => {
    try {
        const { email, password } = await c.req.json();
        const adminEmail = c.env.ADMIN_EMAIL || 'admin@e-market.com';
        const adminPassword = c.env.ADMIN_PASSWORD || 'admin12345';

        if (email === adminEmail && password === adminPassword) {
            const payload = {
                email: adminEmail,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 Hours validity
            };
            const token = await sign(payload, config.adminJwtSecret);
            return c.json({ status: 'success', token });
        }

        return c.json({ status: 'error', errorMessage: 'E-posta veya şifre hatalı!' }, 401);
    } catch (e) {
        return c.json({ status: 'error', errorMessage: 'Geçersiz giriş verisi!' }, 400);
    }
});

// Mount modular public sub-routers
app.route('/api/v1/products', productRoutes);
app.route('/api/v1/categories', categoryRoutes);
app.route('/api/v1/brands', brandRoutes);
app.route('/api/v1/orders', orderRoutes);
app.route('/api/v1/returns', returnRoutes);
app.route('/api/v1/payment/param', paymentRoutes);
app.route('/api/v1/settings', settingsRoutes);
app.route('/api/v1/feeds', feedRoutes);

// Mount sitemaps (SEO) at both root and api/v1 paths
app.route('/', seoRoutes);
app.route('/api/v1', seoRoutes);

// Mount modular protected admin sub-router
app.route('/api/v1/admin', adminRoutes);

/**
 * Global Error Handler
 */
app.onError(errorHandler);

export default app;
