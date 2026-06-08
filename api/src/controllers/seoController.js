import { config } from '../config.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * SEO Controller - Dynamic sitemap generation
 * Full product and category URLs for search engine indexing
 */
export class SeoController {
  /**
   * @param {import('../repositories/productRepository.js').ProductRepository} productRepository
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Generate dynamic sitemap.xml
   * Includes all active products and categories
   */
  getSitemap = asyncHandler(async (req, res, next) => {
    const baseUrl = config.clientUrl || 'https://e-market.com';
    const today = new Date().toISOString().split('T')[0];

    // Fetch active products through productRepository
    const products = await this.productRepository.findAll({
      where: { aktif: true },
      select: { slug: true, guncellenmeTarihi: true }
    });

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/checkout</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/siparis-takip</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;

    // Product URLs
    for (const product of products) {
      if (!product.slug) continue;
      xml += `  <url>
    <loc>${baseUrl}/urun/${product.slug}</loc>
    <lastmod>${product.guncellenmeTarihi?.toISOString().split('T')[0] || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
    }

    xml += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  });
}
