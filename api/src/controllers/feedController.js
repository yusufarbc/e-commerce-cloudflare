import { config } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Google Shopping Feed Controller
 * Generates XML feed for Google Merchant Center
 */
export class FeedController {
    /**
     * @param {import('../repositories/productRepository.js').ProductRepository} productRepository
     * @param {import('../repositories/settingsRepository.js').SettingsRepository} settingsRepository
     */
    constructor(productRepository, settingsRepository) {
        this.productRepository = productRepository;
        this.settingsRepository = settingsRepository;
    }

    /**
     * Escapes special XML characters to prevent parsing errors.
     * @private
     */
    _escapeXml(unsafe) {
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
     * @private
     */
    _mapToGoogleCategory(kategori) {
        const categoryMappings = {
            'elektronik': '222',        // Electronics
            'giyim-aksesuar': '166',    // Apparel & Accessories
            'ev-yasam': '536',          // Home & Garden
            'spor-outdoor': '988',      // Sporting Goods
        };

        if (kategori?.slug && categoryMappings[kategori.slug]) {
            return categoryMappings[kategori.slug];
        }

        return '536'; // Default: Home & Garden
    }

    /**
     * Generates Google Shopping XML Feed.
     * Endpoint: GET /api/v1/feeds/google
     */
    getGoogleShoppingFeed = asyncHandler(async (req, res, next) => {
        // Fetch active settings for shipping calculation & token verification
        const settings = await this.settingsRepository.getSettings();

        // Security check: Verify token
        const token = req.query.token;
        const secretToken = settings?.googleMerchantToken || config.googleMerchantToken;

        if (secretToken && token !== secretToken) {
            return res.status(401).send('Unauthorized: Invalid or missing feed token');
        }

        // Fetch active products with stock > 0 via productRepository
        const urunler = await this.productRepository.findAll({
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

            // Calculate dynamic single-item shipping fee
            const policy = settings?.kargoPolitikaTuru || 'SABIT_UCRET';
            const sabitUcret = settings?.kargoSabitUcret !== undefined ? Number(settings.kargoSabitUcret) : 0;
            const ucretsizKargoAltLimit = settings?.ucretsizKargoAltLimit !== undefined ? Number(settings.ucretsizKargoAltLimit) : 5000.00;
            const weightMultiplier = settings?.kargoAgirlikCarpani > 0 ? Number(settings.kargoAgirlikCarpani) : 15.00;
            let itemShippingFee = 0;

            const productPrice = Number(price);
            const productWeight = Number(urun.agirlik || 1);

            if (policy === 'UCRETSIZ') {
                itemShippingFee = 0;
            } else if (policy === 'SABIT_UCRET') {
                itemShippingFee = sabitUcret;
            } else if (policy === 'SEPET_LIMITI') {
                if (productPrice >= ucretsizKargoAltLimit) {
                    itemShippingFee = 0;
                } else {
                    itemShippingFee = sabitUcret;
                }
            } else if (policy === 'AGIRLIK_KADEMELI') {
                let priceList = settings && settings.kargoFiyatListesi ? settings.kargoFiyatListesi : null;
                if (typeof priceList === 'string') {
                    try {
                        priceList = JSON.parse(priceList);
                    } catch (e) {
                        priceList = null;
                    }
                }

                if (Array.isArray(priceList) && priceList.length > 0) {
                    const sortedList = [...priceList].sort((a, b) => a.maxWeight - b.maxWeight);
                    const matchingTier = sortedList.find(tier => productWeight <= tier.maxWeight);

                    if (matchingTier) {
                        itemShippingFee = Number(matchingTier.price);
                    } else {
                        const lastTier = sortedList[sortedList.length - 1];
                        const extraWeight = Math.ceil(productWeight - lastTier.maxWeight);
                        itemShippingFee = Number(lastTier.price) + (extraWeight * weightMultiplier);
                    }
                } else {
                    // Fallback
                    if (productWeight <= 1) itemShippingFee = 65.00;
                    else if (productWeight <= 2) itemShippingFee = 85.00;
                    else if (productWeight <= 3) itemShippingFee = 105.00;
                    else if (productWeight <= 4) itemShippingFee = 125.00;
                    else if (productWeight <= 5) itemShippingFee = 145.00;
                    else if (productWeight <= 10) itemShippingFee = 200.00;
                    else if (productWeight <= 20) itemShippingFee = 350.00;
                    else if (productWeight <= 35) itemShippingFee = 550.00;
                    else if (productWeight <= 50) itemShippingFee = 800.00;
                    else if (productWeight <= 75) itemShippingFee = 1200.00;
                    else if (productWeight <= 100) itemShippingFee = 1600.00;
                    else itemShippingFee = 1600.00 + (Math.ceil(productWeight - 100) * weightMultiplier);
                }
            } else {
                itemShippingFee = sabitUcret;
            }

            const shippingFeeStr = Number(itemShippingFee).toFixed(2);

            xml += `
    <item>
      <g:id>${this._escapeXml(urun.id)}</g:id>
      <g:title>${this._escapeXml(urun.ad)}</g:title>
      <g:description>${this._escapeXml(urun.aciklama || urun.ad)}</g:description>
      <g:link>${baseUrl}/product/${this._escapeXml(urun.id)}</g:link>
      <g:image_link>${this._escapeXml(imageUrl || '')}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:shipping_weight>${Number(urun.agirlik || 1).toFixed(2)} kg</g:shipping_weight>
      <g:price>${originalPrice} TRY</g:price>
      ${salePrice}
      <g:brand>${this._escapeXml(urun.marka?.ad || 'E-Market')}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>${this._mapToGoogleCategory(urun.kategori)}</g:google_product_category>
      <g:product_type>${this._escapeXml(urun.kategori?.ad || 'Genel')}</g:product_type>
      <g:shipping>
        <g:country>TR</g:country>
        <g:service>Kargo</g:service>
        <g:price>${shippingFeeStr} TRY</g:price>
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
    });

    /**
     * Returns feed statistics for admin monitoring.
     * Endpoint: GET /api/v1/feeds/google/stats
     */
    getFeedStats = asyncHandler(async (req, res, next) => {
        // We can use productRepository.model.count
        const totalProducts = await this.productRepository.model.count({ where: { aktif: true } });
        const inStockProducts = await this.productRepository.model.count({
            where: { aktif: true, stokAdedi: { gt: 0 } }
        });

        res.json({
            totalActiveProducts: totalProducts,
            productsInFeed: inStockProducts,
            feedUrl: '/api/v1/feeds/google',
            lastUpdated: new Date().toISOString()
        });
    });
}
