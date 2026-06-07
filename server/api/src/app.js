import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sign, verify } from 'hono/jwt';
import { config, initConfig } from './config.js';
import prismaProxy, { getPrisma } from './prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { adapt } from './utils/honoAdapter.js';

// Express Controllers (Adapted dynamically)
import {
    productController,
    categoryController,
    orderController,
    paymentController,
    brandController
} from './container.js';

import { settingsController } from './controllers/settingsController.js';
import { ReturnController } from './controllers/returnController.js';
import { seoController } from './controllers/seoController.js';
import { getGoogleShoppingFeed, getFeedStats } from './controllers/feedController.js';

const returnController = new ReturnController();

// Hono App Instance
const app = new Hono();

/**
 * Global Middlewares
 */
app.use('*', cors({
    origin: (origin) => {
        // Allow all or configure specifically
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

// Sitemap
app.get('/sitemap.xml', adapt(seoController.getSitemap));
app.get('/api/v1/sitemap.xml', adapt(seoController.getSitemap));

// Feeds
app.get('/api/v1/feeds/google', adapt(getGoogleShoppingFeed));
app.get('/api/v1/feeds/google/stats', adapt(getFeedStats));

// Catalog
app.get('/api/v1/products', adapt(productController.getProducts));
app.get('/api/v1/products/slug/:slug', adapt(productController.getProductBySlug));
app.get('/api/v1/products/:id', adapt(productController.getProduct));
app.get('/api/v1/categories', adapt(categoryController.getCategories));
app.get('/api/v1/brands', adapt(brandController.getBrands));
app.get('/api/v1/brands/slug/:slug', adapt(brandController.getBrandBySlug));
app.get('/api/v1/brands/:id', adapt(brandController.getBrand));
app.get('/api/v1/settings', adapt(settingsController.getSettings));

// Orders
app.post('/api/v1/orders/checkout', adapt(orderController.createCheckoutSession));
app.get('/api/v1/orders/track', adapt(orderController.trackOrder));
app.post('/api/v1/orders/cancel', adapt(orderController.cancelOrder));

// Returns
app.post('/api/v1/returns/request', adapt(returnController.createReturnRequest));
app.get('/api/v1/returns/status', adapt(returnController.getReturnStatus));

// Payments (Param POS callbacks and installments)
app.post('/api/v1/payment/param/success', adapt(paymentController.handleParamSuccess));
app.post('/api/v1/payment/param/error', adapt(paymentController.handleParamError));
app.post('/api/v1/payment/param/initiate', adapt(paymentController.initiatePayment));
app.get('/api/v1/payment/param/installments', adapt(paymentController.getInstallments));

/**
 * Admin Panel Authentication & Protected API Routes
 */

// Admin Login
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

// Admin JWT Authentication Middleware
const adminAuth = async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ status: 'error', errorMessage: 'Yetkisiz erişim! Oturum bulunamadı.' }, 401);
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = await verify(token, config.adminJwtSecret);
        c.set('adminUser', payload);
        await next();
    } catch (e) {
        return c.json({ status: 'error', errorMessage: 'Oturum süresi dolmuş veya geçersiz token!' }, 401);
    }
};

// Protected Admin API Endpoints
app.use('/api/v1/admin/*', adminAuth);

// Admin R2 Image Upload
app.post('/api/v1/admin/upload', async (c) => {
    try {
        const body = await c.req.parseBody();
        const file = body.file;

        if (!file || !(file instanceof File)) {
            return c.json({ status: 'error', errorMessage: 'Dosya yüklenemedi.' }, 400);
        }

        const extension = file.name.split('.').pop() || 'webp';
        const key = `products/${crypto.randomUUID()}.${extension}`;
        
        const buffer = await file.arrayBuffer();
        await c.env.IMAGES_BUCKET.put(key, buffer, {
            httpMetadata: { contentType: file.type || 'image/webp' }
        });

        return c.json({
            status: 'success',
            key: key,
            url: `${config.cdnUrl}/${key}`
        });
    } catch (e) {
        console.error('[Admin Upload] Error:', e);
        return c.json({ status: 'error', errorMessage: 'Görsel sunucuya yüklenirken hata oluştu.' }, 500);
    }
});

// Admin Products CRUD
app.get('/api/v1/admin/products', async (c) => {
    const products = await prismaProxy.urun.findMany({
        include: { kategori: true, marka: true },
        orderBy: { olusturulmaTarihi: 'desc' }
    });
    
    // Parse color options from JSON strings to real arrays
    const formatted = products.map(p => {
        let renkSecenekleri = [];
        try {
            renkSecenekleri = typeof p.renkSecenekleri === 'string' ? JSON.parse(p.renkSecenekleri) : p.renkSecenekleri;
        } catch (e) {
            renkSecenekleri = [];
        }
        return { ...p, renkSecenekleri };
    });

    return c.json({ status: 'success', data: formatted });
});

app.post('/api/v1/admin/products', async (c) => {
    const body = await c.req.json();
    const slug = body.ad.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const product = await prismaProxy.urun.create({
        data: {
            ad: body.ad,
            slug: slug,
            fiyat: parseFloat(body.fiyat),
            indirimliFiyat: body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null,
            renkSecenekleri: Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]",
            kartelaIcCephe: !!body.kartelaIcCephe,
            kartelaDisCephe: !!body.kartelaDisCephe,
            iadeImkaniVar: body.iadeImkaniVar !== false,
            agirlik: parseFloat(body.agirlik || 1),
            aciklama: body.aciklama || '',
            resimUrl: body.resimUrl || null,
            aktif: body.aktif !== false,
            oneCikan: !!body.oneCikan,
            firsatUrunu: !!body.firsatUrunu,
            yeniUrun: !!body.yeniUrun,
            cokSatanlar: !!body.cokSatanlar,
            stokAdedi: parseInt(body.stokAdedi || 0, 10),
            varyantBasligi: body.varyantBasligi || null,
            kategoriId: body.kategoriId || null,
            markaId: body.markaId || null
        }
    });

    return c.json({ status: 'success', data: product });
});

app.put('/api/v1/admin/products/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const data = {};
    if (body.ad !== undefined) {
        data.ad = body.ad;
        data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (body.fiyat !== undefined) data.fiyat = parseFloat(body.fiyat);
    if (body.indirimliFiyat !== undefined) data.indirimliFiyat = body.indirimliFiyat ? parseFloat(body.indirimliFiyat) : null;
    if (body.renkSecenekleri !== undefined) data.renkSecenekleri = Array.isArray(body.renkSecenekleri) ? JSON.stringify(body.renkSecenekleri) : "[]";
    if (body.kartelaIcCephe !== undefined) data.kartelaIcCephe = !!body.kartelaIcCephe;
    if (body.kartelaDisCephe !== undefined) data.kartelaDisCephe = !!body.kartelaDisCephe;
    if (body.iadeImkaniVar !== undefined) data.iadeImkaniVar = body.iadeImkaniVar !== false;
    if (body.agirlik !== undefined) data.agirlik = parseFloat(body.agirlik);
    if (body.aciklama !== undefined) data.aciklama = body.aciklama;
    if (body.resimUrl !== undefined) data.resimUrl = body.resimUrl;
    if (body.aktif !== undefined) data.aktif = body.aktif !== false;
    if (body.oneCikan !== undefined) data.oneCikan = !!body.oneCikan;
    if (body.firsatUrunu !== undefined) data.firsatUrunu = !!body.firsatUrunu;
    if (body.yeniUrun !== undefined) data.yeniUrun = !!body.yeniUrun;
    if (body.cokSatanlar !== undefined) data.cokSatanlar = !!body.cokSatanlar;
    if (body.stokAdedi !== undefined) data.stokAdedi = parseInt(body.stokAdedi, 10);
    if (body.varyantBasligi !== undefined) data.varyantBasligi = body.varyantBasligi;
    if (body.kategoriId !== undefined) data.kategoriId = body.kategoriId || null;
    if (body.markaId !== undefined) data.markaId = body.markaId || null;

    const product = await prismaProxy.urun.update({
        where: { id },
        data
    });

    return c.json({ status: 'success', data: product });
});

app.delete('/api/v1/admin/products/:id', async (c) => {
    const id = c.req.param('id');
    await prismaProxy.urun.delete({ where: { id } });
    return c.json({ status: 'success', message: 'Ürün silindi.' });
});

// Admin Categories CRUD
app.get('/api/v1/admin/categories', async (c) => {
    const categories = await prismaProxy.kategori.findMany({
        orderBy: { sira: 'asc' }
    });
    return c.json({ status: 'success', data: categories });
});

app.post('/api/v1/admin/categories', async (c) => {
    const body = await c.req.json();
    const slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const cat = await prismaProxy.kategori.create({
        data: {
            ad: body.ad,
            slug: slug,
            resim: body.resim || null,
            sira: parseInt(body.sira || 0, 10),
            aktif: body.aktif !== false
        }
    });
    return c.json({ status: 'success', data: cat });
});

app.put('/api/v1/admin/categories/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = {};
    if (body.ad !== undefined) {
        data.ad = body.ad;
        data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (body.resim !== undefined) data.resim = body.resim;
    if (body.sira !== undefined) data.sira = parseInt(body.sira, 10);
    if (body.aktif !== undefined) data.aktif = body.aktif !== false;

    const cat = await prismaProxy.kategori.update({
        where: { id },
        data
    });
    return c.json({ status: 'success', data: cat });
});

app.delete('/api/v1/admin/categories/:id', async (c) => {
    const id = c.req.param('id');
    await prismaProxy.kategori.delete({ where: { id } });
    return c.json({ status: 'success', message: 'Kategori silindi.' });
});

// Admin Brands CRUD
app.get('/api/v1/admin/brands', async (c) => {
    const brands = await prismaProxy.marka.findMany({
        orderBy: { sira: 'asc' }
    });
    return c.json({ status: 'success', data: brands });
});

app.post('/api/v1/admin/brands', async (c) => {
    const body = await c.req.json();
    const slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const marka = await prismaProxy.marka.create({
        data: {
            ad: body.ad,
            slug: slug,
            logoUrl: body.logoUrl || null,
            sira: parseInt(body.sira || 0, 10),
            aktif: body.aktif !== false
        }
    });
    return c.json({ status: 'success', data: marka });
});

app.put('/api/v1/admin/brands/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = {};
    if (body.ad !== undefined) {
        data.ad = body.ad;
        data.slug = body.ad.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (body.logoUrl !== undefined) data.logoUrl = body.logoUrl;
    if (body.sira !== undefined) data.sira = parseInt(body.sira, 10);
    if (body.aktif !== undefined) data.aktif = body.aktif !== false;

    const marka = await prismaProxy.marka.update({
        where: { id },
        data
    });
    return c.json({ status: 'success', data: marka });
});

app.delete('/api/v1/admin/brands/:id', async (c) => {
    const id = c.req.param('id');
    await prismaProxy.marka.delete({ where: { id } });
    return c.json({ status: 'success', message: 'Marka silindi.' });
});

// Admin Orders CRUD & Management
app.get('/api/v1/admin/orders', async (c) => {
    const orders = await prismaProxy.siparis.findMany({
        include: { kalemler: true },
        orderBy: { olusturulmaTarihi: 'desc' }
    });
    return c.json({ status: 'success', data: orders });
});

app.get('/api/v1/admin/orders/:id', async (c) => {
    const id = c.req.param('id');
    const order = await prismaProxy.siparis.findUnique({
        where: { id },
        include: { kalemler: true, gecmis: true, iadeTalebi: true }
    });
    return c.json({ status: 'success', data: order });
});

app.put('/api/v1/admin/orders/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const currentOrder = await prismaProxy.siparis.findUnique({
        where: { id }
    });

    if (!currentOrder) {
        return c.json({ status: 'error', errorMessage: 'Sipariş bulunamadı.' }, 404);
    }

    const data = {};
    if (body.durum) data.durum = body.durum;
    if (body.kargoTakipNo !== undefined) data.kargoTakipNo = body.kargoTakipNo;
    if (body.kargoFirmasi !== undefined) data.kargoFirmasi = body.kargoFirmasi;
    if (body.faturaNo !== undefined) data.faturaNo = body.faturaNo;
    if (body.faturaDurumu !== undefined) data.faturaDurumu = body.faturaDurumu;
    if (body.durum === 'TESLIM_EDILDI' && !currentOrder.teslimTarihi) {
        data.teslimTarihi = new Date();
    }

    // Update the order details
    const updatedOrder = await prismaProxy.siparis.update({
        where: { id },
        data
    });

    // Record history entry if state changed
    if (body.durum && body.durum !== currentOrder.durum) {
        await prismaProxy.siparisGecmisi.create({
            data: {
                siparisId: id,
                eskiDurum: currentOrder.durum,
                yeniDurum: body.durum,
                not: body.not || `Sipariş durumu ${body.durum} olarak güncellendi.`,
                islemYapan: 'ADMIN'
            }
        });

        // Email notifications on status change (e.g. KARGOLANDI)
        // Feel free to implement custom email service notifications here if needed!
    }

    return c.json({ status: 'success', data: updatedOrder });
});

// Admin Returns CRUD & Management
app.get('/api/v1/admin/returns', async (c) => {
    const returns = await prismaProxy.iadeTalebi.findMany({
        include: { siparis: true },
        orderBy: { olusturulmaTarihi: 'desc' }
    });

    const formatted = returns.map(r => {
        let fotografUrls = [];
        try {
            fotografUrls = typeof r.fotografUrls === 'string' ? JSON.parse(r.fotografUrls) : r.fotografUrls;
        } catch (e) {
            fotografUrls = [];
        }
        return { ...r, fotografUrls };
    });

    return c.json({ status: 'success', data: formatted });
});

app.put('/api/v1/admin/returns/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json(); // { durum: 'ONAYLANDI'/'REDDEDILDI', adminNotu, manuelIadeKodu }

    const iade = await prismaProxy.iadeTalebi.findUnique({
        where: { id },
        include: { siparis: true }
    });

    if (!iade) {
        return c.json({ status: 'error', errorMessage: 'İade talebi bulunamadı.' }, 404);
    }

    const data = {};
    if (body.durum) data.durum = body.durum;
    if (body.adminNotu !== undefined) data.adminNotu = body.adminNotu;
    if (body.manuelIadeKodu !== undefined) data.manuelIadeKodu = body.manuelIadeKodu;

    const updatedReturn = await prismaProxy.iadeTalebi.update({
        where: { id },
        data
    });

    // Update order status if approved or rejected
    let targetOrderStatus = 'IADE_TALEP_EDILDI';
    if (body.durum === 'ONAYLANDI') {
        targetOrderStatus = 'IADE_EDILDI';
    } else if (body.durum === 'REDDEDILDI') {
        targetOrderStatus = 'TESLIM_EDILDI'; // Rollback status
    }

    await prismaProxy.siparis.update({
        where: { id: iade.siparisId },
        data: { durum: targetOrderStatus }
    });

    await prismaProxy.siparisGecmisi.create({
        data: {
            siparisId: iade.siparisId,
            eskiDurum: iade.siparis.durum,
            yeniDurum: targetOrderStatus,
            not: `İade talebi ${body.durum} olarak güncellendi. Admin Notu: ${body.adminNotu || '-'}`,
            islemYapan: 'ADMIN'
        }
    });

    return c.json({ status: 'success', data: updatedReturn });
});

// Admin System Settings CRUD
app.get('/api/v1/admin/settings', async (c) => {
    let settings = await prismaProxy.sistemAyarlari.findUnique({
        where: { id: 'global-settings' }
    });

    if (!settings) {
        settings = await prismaProxy.sistemAyarlari.create({
            data: {
                id: 'global-settings',
                kargoAgirlikCarpani: 15.00,
                ucretsizKargoAltLimit: 5000.00,
                maintenanceMode: false
            }
        });
    }

    return c.json({ status: 'success', data: settings });
});

app.put('/api/v1/admin/settings', async (c) => {
    const body = await c.req.json();

    const data = {};
    if (body.kargoAgirlikCarpani !== undefined) data.kargoAgirlikCarpani = parseFloat(body.kargoAgirlikCarpani);
    if (body.ambarEsikAgirlik !== undefined) data.ambarEsikAgirlik = parseInt(body.ambarEsikAgirlik, 10);
    if (body.ucretsizKargoAltLimit !== undefined) data.ucretsizKargoAltLimit = parseFloat(body.ucretsizKargoAltLimit);
    if (body.kargoFiyatListesi !== undefined) data.kargoFiyatListesi = typeof body.kargoFiyatListesi === 'object' ? JSON.stringify(body.kargoFiyatListesi) : body.kargoFiyatListesi;
    if (body.maintenanceMode !== undefined) data.maintenanceMode = !!body.maintenanceMode;

    const settings = await prismaProxy.sistemAyarlari.update({
        where: { id: 'global-settings' },
        data
    });

    return c.json({ status: 'success', data: settings });
});

/**
 * Global Error Handler
 */
app.onError(errorHandler);

export default app;
