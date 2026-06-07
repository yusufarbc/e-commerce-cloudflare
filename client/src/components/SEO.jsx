import { Helmet } from 'react-helmet-async';

/**
 * SEO Component
 * Manages meta tags, Open Graph, Twitter Cards, and structured data
 * Implements Single Responsibility Principle - only handles SEO-related head tags
 * 
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.ogType - Open Graph type (website, product, article, etc.)
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.canonical - Canonical URL
 * @param {Object} props.structuredData - JSON-LD structured data object
 * @param {boolean} props.noindex - Whether to prevent indexing (defaults to false -> index, follow)
 */
export const SEO = ({
    title,
    description,
    keywords,
    ogType = 'website',
    ogImage,
    canonical,
    structuredData,
    noindex = false
}) => {
    const siteTitle = 'E-Market';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteUrl = 'https://e-market.com';
    const defaultDescription = 'E-Market - En uygun fiyatlarla binlerce ürün kapınızda. Hızlı kargo ve güvenli ödeme.';
    const defaultKeywords = 'e-ticaret, online alışveriş, uygun fiyatlı ürünler, hızlı teslimat, güvenli ödeme';
    const defaultImage = `${siteUrl}/images/og-image.png`;

    const metaDescription = description || defaultDescription;
    const metaKeywords = keywords || defaultKeywords;
    const metaImage = ogImage || defaultImage;
    const metaUrl = canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl);

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />

            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Robots */}
            <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

            {/* Open Graph Tags */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content="tr_TR" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Structured Data (JSON-LD) */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
