import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard, ProductCardSkeleton } from '../ProductCard';
import api from '../../lib/axios';
import { Star, ChevronRight } from 'lucide-react';

/**
 * FeaturedProducts - Displays featured products (oneCikan) on the homepage.
 * No filters, just a clean product grid with a "see all" link.
 */
export function FeaturedProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await api.get('/api/v1/products?oneCikan=true&limit=8');
                setProducts(response.data.slice(0, 8)); // Limit to 8 products
            } catch (error) {
                console.error('Failed to fetch featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    // Don't render section if no featured products
    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 bg-bg-soft">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-brand-yellow rounded-xl flex items-center justify-center">
                            <Star className="text-corporate-black" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-corporate-black">
                                Öne Çıkan Ürünler
                            </h2>
                            <p className="text-gray-500 text-sm">En beğenilen ürünlerimiz</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/magaza')}
                        className="hidden md:flex items-center gap-2 text-corporate-black font-bold hover:text-brand-yellow transition-colors group"
                    >
                        Tümünü Gör
                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Mobile "See All" Button */}
                <div className="mt-8 text-center md:hidden">
                    <button
                        onClick={() => navigate('/magaza')}
                        className="inline-flex items-center gap-2 bg-brand-yellow text-corporate-black px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors"
                    >
                        Tümünü Gör
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
