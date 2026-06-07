import prisma from '../prisma.js';
import { config } from '../config.js';

/**
 * SEO Controller - Dynamic sitemap generation
 * Full product and category URLs for search engine indexing
 */
class SeoController {
  /**
   * Generate dynamic sitemap.xml
   * Includes all active products and categories
   */
  getSitemap = async (req, res, next) => {
    try {
      const baseUrl = config.clientUrl || 'https://e-market.com';
      const today = new Date().toISOString().split('T')[0];

      // Fetch active products directly from Prisma.
      // Query-based category URLs are intentionally excluded from sitemap
      // to avoid canonical/alternate index coverage issues.
      const [products] = await Promise.all([
        prisma.urun.findMany({
          where: { aktif: true },
          select: { slug: true, guncellenmeTarihi: true }
        }),
      ]);

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
    } catch (error) {
      next(error);
    }
  };
}

export const seoController = new SeoController();
