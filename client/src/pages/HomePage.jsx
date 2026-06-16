import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBrands } from '../services/apiService';
import SEO from '../components/SEO';
import { generateWebsiteSchema, combineSchemas, generateOrganizationSchema } from '../utils/structuredData';
import { FeaturesSection } from '../components/FeaturesSection';

// Sub Components
import { HeroSection } from '../components/home/HeroSection';
import { BrandSlider } from '../components/home/BrandSlider';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { useCategories } from '../hooks/useCategories';

export function HomePage() {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);

    // Fetch brands
    useEffect(() => {
        fetchBrands().then(setBrands).catch(console.error);
    }, []);

    // Navigation Helpers
    const handleCategorySelect = (category) => {
        navigate(`/magaza?kategori=${category.slug}`);
    };

    const handleBrandSelect = (brandId) => {
        navigate(`/magaza?markaId=${brandId}`);
    };

    const handleExploreClick = () => {
        navigate('/magaza');
    };

    // SEO
    const seoTitle = 'E-Market - Online Alışveriş Platformu';
    const seoDescription = 'E-Market - Binlerce ürünü en uygun fiyatlarla, hızlı teslimat ve güvenli ödeme seçenekleriyle kapınıza getiren e-ticaret platformu.';
    const structuredData = combineSchemas(generateWebsiteSchema(), generateOrganizationSchema());

    // We can fetch categories here to pass to CategoryGrid if needed, 
    // or let CategoryGrid use the hook itself if updated.
    // Assuming CategoryGrid takes `onCategoryClick` or similar based on previous file,
    // but looking at previous file, CategoryGrid took `activeCategory`.
    // Wait, the previous HomePage logic had `if (activeCategory) <CategoryGrid ... />`.
    // But `activeCategory` came from `useProductFilter`.
    // The new HomePage is just top-level categories.
    // Let's modify CategoryGrid usage to show top categories or pass necessary props.
    // Actually, `CategoryGrid` likely needs to be updated or we pass it the root categories.

    // We'll use the useCategories hook here to get data if CategoryGrid needs it.
    const { categories } = useCategories();


    return (
        <div className="bg-white min-h-screen">
            <SEO
                title={seoTitle}
                description={seoDescription}
                structuredData={structuredData}
                canonical="https://ecommerceflaredev.web.tr/"
            />

            {/* Hero Section */}
            <HeroSection scrollToProducts={handleExploreClick} />

            {/* Brand Slider */}
            <BrandSlider
                brands={brands}
                selectedBrandId={null}
                onSelectBrand={handleBrandSelect}
            />

            {/* Featured Products */}
            <FeaturedProducts />

            {/* Features Section */}
            <FeaturesSection />
        </div>
    );
}
