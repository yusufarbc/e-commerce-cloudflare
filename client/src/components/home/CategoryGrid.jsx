import { ChevronRight, Hammer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CategoryGrid({ activeCategory }) {
    const navigate = useNavigate();

    if (!activeCategory) return null;

    return (
        <section className="container mx-auto px-4 mt-8 mb-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <span
                    className="cursor-pointer hover:text-brand-yellow transition-colors font-medium text-gray-600 hover:underline"
                    onClick={() => navigate('/')}
                >
                    Anasayfa
                </span>
                <ChevronRight size={16} className="text-gray-400" />
                <span className="font-bold text-corporate-black">{activeCategory.ad}</span>
            </nav>

            <h2 className="text-3xl md:text-4xl font-black text-corporate-black mb-10 flex items-center gap-4">
                <span className="w-2 h-12 bg-brand-yellow rounded-full"></span>
                {activeCategory.ad} Kategorileri
            </h2>

            {activeCategory.altKategoriler && activeCategory.altKategoriler.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {activeCategory.altKategoriler.map(sub => (
                        <div
                            key={sub.id}
                            onClick={() => navigate(`/magaza?kategori=${sub.slug}`)}
                            className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 group hover:-translate-y-2"
                        >
                            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                                {sub.resim ? (
                                    <img src={sub.resim} alt={sub.ad} className="w-full h-full object-cover p-6 transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Hammer size={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-corporate-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-5 text-center bg-white">
                                <h3 className="font-black text-base text-corporate-black group-hover:text-brand-yellow transition-colors duration-300 line-clamp-2">{sub.ad}</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase mt-2 tracking-wider">Ürünleri İncele →</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 italic">Alt kategori bulunamadı.</p>
            )}
        </section>
    );
}
