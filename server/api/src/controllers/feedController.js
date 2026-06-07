import prisma from '../prisma.js';
import { config } from '../config.js';

/**
 * Google Shopping Feed Controller
 * Generates XML feed for Google Merchant Center
 */

/**
 * Escapes special XML characters to prevent parsing errors.
 * @param {string} unsafe - Raw string that may contain special characters.
 * @returns {string} XML-safe escaped string.
 */
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe).replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

/**
 * Maps internal category to Google Product Category taxonomy.
 * @see https://www.google.com/basepages/producttype/taxonomy-with-ids.tr-TR.txt
 * @param {Object} kategori - Category object from database.
 * @returns {string} Google Product Category ID or default.
 */
function mapToGoogleCategory(kategori) {
    // Default mapping for hardware store
    // 2047 = Hardware > Tools
    // 115 = Hardware
    // 2878 = Hardware > Building Materials
    const categoryMappings = {
        'el-aletleri': '1167',      // Tools > Hand Tools
        'elektrikli-aletler': '1169', // Tools > Power Tools
        'boya': '2918',             // Hardware > Paint & Painting Supplies
        'hirdavat': '115',          // Hardware
        'insaat': '2878',           // Hardware > Building Materials
        'bahce': '2918',            // Hardware > Garden
    };

    if (kategori?.slug && categoryMappings[kategori.slug]) {
        return categoryMappings[kategori.slug];
    }

    return '115'; // Default: Hardware
}

/**
 * Generates Google Shopping XML Feed.
 * Endpoint: GET /api/v1/feeds/google
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export const getGoogleShoppingFeed = async (req, res) => {
    try {
        // Security check: Verify token
        const token = req.query.token;
        const secretToken = config.googleMerchantToken;

        if (secretToken && token !== secretToken) {
            return res.status(401).send('Unauthorized: Invalid or missing feed token');
        }

        // Fetch active products with stock > 0
        const urunler = await prisma.urun.findMany({
            where: {
                aktif: true,
                stokAdedi: { gt: 0 }
            },
            include: {
                kategori: true,
                marka: true,
                resimler: {
                    orderBy: { sira: 'asc' },
                    take: 1 // Only need first image
                }
            }
        });

        const baseUrl = config.clientUrl || 'https://e-market.com';
        const cdnUrl = config.cdnUrl || 'https://cdn.e-market.com';

        // XML Header
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>E-Market Ürün Kataloğu</title>
    <link>${baseUrl}</link>
    <description>E-Market Ürün Kataloğu - Sunucusuz Hızlı Alışveriş</description>`;

        // Generate item entries
        for (const urun of urunler) {
            // Get image URL with CDN prefix
            let imageUrl = urun.resimUrl;
            if (urun.resimler && urun.resimler.length > 0) {
                imageUrl = urun.resimler[0].url;
            }
            if (imageUrl && !imageUrl.startsWith('http')) {
                imageUrl = `${cdnUrl}/${imageUrl.replace(/^\//, '')}`;
            }

            // Calculate effective price
            const price = urun.indirimliFiyat
                ? Number(urun.indirimliFiyat).toFixed(2)
                : Number(urun.fiyat).toFixed(2);

            // Sale price if discounted
            const salePrice = urun.indirimliFiyat
                ? `<g:sale_price>${Number(urun.indirimliFiyat).toFixed(2)} TRY</g:sale_price>`
                : '';

            // Original price for sale items
            const originalPrice = urun.indirimliFiyat
                ? Number(urun.fiyat).toFixed(2)
                : price;

            xml += `
    <item>
      <g:id>${escapeXml(urun.id)}</g:id>
      <g:title>${escapeXml(urun.ad)}</g:title>
      <g:description>${escapeXml(urun.aciklama || urun.ad)}</g:description>
      <g:link>${baseUrl}/product/${escapeXml(urun.id)}</g:link>
      <g:image_link>${escapeXml(imageUrl || '')}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:shipping_weight>${Number(urun.agirlik || 1).toFixed(2)} kg</g:shipping_weight>
      <g:price>${originalPrice} TRY</g:price>
      ${salePrice}
      <g:brand>${escapeXml(urun.marka?.ad || 'E-Market')}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${mapToGoogleCategory(urun.kategori)}</g:google_product_category>
      <g:product_type>${escapeXml(urun.kategori?.ad || 'Genel')}</g:product_type>
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Kargo</g:service>
        <g:price>0 TRY</g:price>
      </g:shipping>
    </item>`;
        }

        xml += `
  </channel>
</rss>`;

        // Set proper content type for XML
        res.set('Content-Type', 'application/xml; charset=utf-8');
        res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
        res.status(200).send(xml);

    } catch (error) {
        console.error('Google Shopping Feed Error:', error);
        res.status(500).send('<?xml version="1.0"?><error>Feed generation failed</error>');
    }
};

/**
 * Returns feed statistics for admin monitoring.
 * Endpoint: GET /api/v1/feeds/google/stats
 */
export const getFeedStats = async (req, res) => {
    try {
        const totalProducts = await prisma.urun.count({ where: { aktif: true } });
        const inStockProducts = await prisma.urun.count({
            where: { aktif: true, stokAdedi: { gt: 0 } }
        });

        res.json({
            totalActiveProducts: totalProducts,
            productsInFeed: inStockProducts,
            feedUrl: '/api/v1/feeds/google',
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Stats unavailable' });
    }
};
