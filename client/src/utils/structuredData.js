/**
 * Structured Data (Schema.org JSON-LD) Utilities
 * Generates structured data for better SEO and rich results in search engines
 */

import DOMPurify from 'dompurify';

const SITE_URL = 'https://e-market.com';
const SITE_NAME = 'E-Market';
const LOGO_URL = `${SITE_URL}/images/logo-light.svg`;

/**
 * Sanitize product descriptions for safe use in JSON-LD.
 * Strips all HTML tags and removes any remaining angle brackets.
 *
 * @param {string | undefined | null} description
 * @returns {string | undefined}
 */
const sanitizeDescription = (description) => {
    if (!description || typeof description !== 'string') {
        return undefined;
    }

    // Remove all HTML tags and attributes
    const withoutHtml = DOMPurify.sanitize(description, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    });

    // As a defensive-in-depth step, strip any remaining angle brackets
    const withoutAngles = withoutHtml.replace(/[<>]/g, '');

    return withoutAngles;
};

/**
 * Generate Organization schema
 * @returns {Object} JSON-LD organization schema
 */
export const generateOrganizationSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+90-542-182-68-55',
        contactType: 'Customer Service',
        areaServed: 'TR',
        availableLanguage: 'Turkish'
    },
    sameAs: [
        // Add social media profiles here
    ]
});

/**
 * Generate WebSite schema with search action
 * @returns {Object} JSON-LD website schema
 */
export const generateWebsiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL
});

/**
 * Generate Product schema
 * @param {Object} product - Product object
 * @returns {Object} JSON-LD product schema
 */
export const generateProductSchema = (product) => {
    const sanitizedDescription = sanitizeDescription(product.aciklama);
    const price = Number(product.indirimliFiyat || product.fiyat);
    const stockCount = Number(product.stokAdedi ?? product.stok ?? 0);
    const isActive = product.aktif !== false;
    const availability = isActive && stockCount > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.ad,
        description: sanitizedDescription || product.ad,
        image: product.resimUrl || product.resimler?.[0]?.url,
        brand: product.marka ? {
            '@type': 'Brand',
            name: product.marka.ad
        } : undefined,
        offers: {
            '@type': 'Offer',
            url: `${SITE_URL}/${product.slug ? 'urun/' + product.slug : 'product/' + product.id}`,
            priceCurrency: 'TRY',
            price: price.toFixed(2),
            availability,
            seller: {
                '@type': 'Organization',
                name: SITE_NAME
            }
        },
        category: product.kategori?.ad
    };
};

/**
 * Generate BreadcrumbList schema
 * @param {Array} breadcrumbs - Array of breadcrumb items [{name, url}]
 * @returns {Object} JSON-LD breadcrumb schema
 */
export const generateBreadcrumbSchema = (breadcrumbs) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${SITE_URL}${item.url}` : undefined
    }))
});

/**
 * Generate ItemList schema for product listings
 * @param {Array} products - Array of products
 * @param {string} listName - Name of the list (e.g., "Search Results", "Category: Electronics")
 * @returns {Object} JSON-LD item list schema
 */
export const generateProductListSchema = (products, listName) => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
            '@type': 'Product',
            name: product.ad,
            url: `${SITE_URL}/${product.slug ? 'urun/' + product.slug : 'product/' + product.id}`,
            image: product.resimUrl,
            offers: {
                '@type': 'Offer',
                priceCurrency: 'TRY',
                price: Number(product.indirimliFiyat || product.fiyat).toFixed(2)
            }
        }
    }))
});

/**
 * Generate Order schema (for order confirmation/tracking pages)
 * @param {Object} order - Order object
 * @returns {Object} JSON-LD order schema
 */
export const generateOrderSchema = (order) => ({
    '@context': 'https://schema.org',
    '@type': 'Order',
    orderNumber: order.siparisNo,
    orderStatus: getOrderStatusUrl(order.durum),
    orderDate: order.createdAt,
    seller: {
        '@type': 'Organization',
        name: SITE_NAME
    },
    customer: {
        '@type': 'Person',
        name: order.misafirBilgi?.ad
    },
    orderedItem: order.siparisKalemleri?.map(item => ({
        '@type': 'OrderItem',
        orderItemNumber: item.id,
        orderQuantity: item.miktar,
        orderedItem: {
            '@type': 'Product',
            name: item.urun?.ad
        }
    })),
    price: Number(order.toplamTutar).toFixed(2),
    priceCurrency: 'TRY'
});

/**
 * Helper: Map order status to schema.org order status URLs
 */
const getOrderStatusUrl = (status) => {
    const statusMap = {
        'PENDING': 'https://schema.org/OrderProcessing',
        'PREPARING': 'https://schema.org/OrderProcessing',
        'SHIPPED': 'https://schema.org/OrderInTransit',
        'DELIVERED': 'https://schema.org/OrderDelivered',
        'CANCELLED': 'https://schema.org/OrderCancelled'
    };
    return statusMap[status] || 'https://schema.org/OrderProblem';
};

/**
 * Combine multiple schemas into a single JSON-LD graph
 * @param {Array} schemas - Array of schema objects
 * @returns {Object} Combined JSON-LD graph
 */
export const combineSchemas = (...schemas) => ({
    '@context': 'https://schema.org',
    '@graph': schemas
});
