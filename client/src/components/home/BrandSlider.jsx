import { useNavigate } from 'react-router-dom';

export function BrandSlider({ brands, selectedBrandId, onSelectBrand }) {
    const navigate = useNavigate();

    return (
        <section className="container mx-auto px-4 mb-8 relative">
            {/* Left Arrow */}
            <button
                onClick={() => {
                    const container = document.getElementById('brand-carousel');
                    container.scrollBy({ left: -200, behavior: 'smooth' });
                }}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white shadow-xl rounded-full text-corporate-black hover:bg-brand-yellow hover:scale-110 transition-all duration-300"
                aria-label="Scroll Left"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Arrow */}
            <button
                onClick={() => {
                    const container = document.getElementById('brand-carousel');
                    container.scrollBy({ left: 200, behavior: 'smooth' });
                }}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center bg-white shadow-xl rounded-full text-corporate-black hover:bg-brand-yellow hover:scale-110 transition-all duration-300"
                aria-label="Scroll Right"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div
                id="brand-carousel"
                className="flex items-center justify-start gap-8 md:gap-16 overflow-x-auto py-6 scrollbar-hide scroll-smooth"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                {/* Brand Logos */}
                {brands.map((brand) => (
                    <button
                        key={brand.id}
                        className="flex flex-col items-center gap-4 flex-shrink-0 group focus:outline-none"
                        onClick={() => onSelectBrand(selectedBrandId === brand.id ? null : brand.id)}
                    >
                        <div className={`w-20 h-20 md:w-30 md:h-30 rounded-full bg-white shadow-2xl flex items-center justify-center p-2 border-[3px] transition-all duration-700 overflow-hidden ${selectedBrandId === brand.id
                            ? 'border-indigo-600 ring-8 ring-brand-yellow/20 scale-110'
                            : 'border-transparent group-hover:border-indigo-600/30 group-hover:scale-105'
                            }`}
                        >
                            {brand.logoUrl ? (
                                <img src={brand.logoUrl} alt={brand.ad} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="font-black text-3xl text-corporate-black opacity-10 uppercase">{brand.ad[0]}</div>
                            )}
                        </div>
                        <span className={`text-[12px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${selectedBrandId === brand.id ? 'text-indigo-600 scale-110' : 'text-gray-400 group-hover:text-corporate-black'}`}>
                            {brand.ad}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
