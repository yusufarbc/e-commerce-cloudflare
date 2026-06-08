import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ChevronDown, ChevronRight, Phone, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../context/SettingsContext';

/**
 * Enhanced Header component with mobile hamburger menu, mega menu dropdown for categories.
 * Refactored to use custom hooks for data fetching (follows DIP)
 */
export function Header() {
    const { t } = useTranslation();
    const { toggleSidebar, cartCount } = useCart();
    const { settings, loading } = useSettings();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Fetch all categories and build hierarchy
    const { categories: allCategories } = useCategories(false); // Get ALL categories

    // Build parent-child hierarchy
    // Backend now returns hierarchical data (Parents with altKategoriler included)
    // So we don't need to manually build hierarchy from a flat list.
    const categories = allCategories.sort((a, b) => (a.sira || 0) - (b.sira || 0));

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/magaza?search=${encodeURIComponent(searchQuery)}`);
            setMobileMenuOpen(false);
        }
    };

    const handleCategoryClick = (cat) => {
        navigate(`/magaza?kategori=${cat.slug}`);
        setActiveDropdown(null);
        setMobileMenuOpen(false);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 font-sans shadow-md">
                {/* 2. Secondary Utility Bar */}
                <div className="bg-white border-b border-gray-100 hidden md:block">
                    <div className="container mx-auto px-4 h-10 flex items-center justify-between text-[11px] font-bold text-gray-500 uppercase tracking-tighter">
                        <div className="flex items-center gap-4">
                            {/* Free Shipping Banner Removed */}
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/sss" className="hover:text-action-red transition-colors">Sıkça Sorulan Sorular</Link>
                            <Link to="/iletisim" className="hover:text-action-red transition-colors">İletişim</Link>
                            <a href="tel:+908500000000" className="flex items-center gap-1 hover:text-action-red transition-colors">
                                <Phone size={14} />
                                0850 000 00 00
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. Main Header Bar */}
                <nav className="bg-white border-b border-gray-100">
                    <div className="container mx-auto px-4 h-20 md:h-24 flex items-center justify-between gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-corporate-black hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo (Left) */}
                        <Link to="/" className="flex-shrink-0">
                            <img
                                src="/images/logo-yellow.svg"
                                alt="E-Market"
                                className="h-12 md:h-16 w-auto object-contain"
                            />
                        </Link>

                        {/* Search Bar (Center) */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Aramak istediğin ürünü yaz, kolayca bul!"
                                className="w-full bg-slate-50 border border-slate-200 text-corporate-black placeholder-gray-400 px-6 py-3.5 rounded-lg focus:border-indigo-600 focus:bg-white focus:outline-none shadow-sm transition-all"
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 p-1 hover:scale-110 transition-transform">
                                <Search size={24} />
                            </button>
                        </form>

                        {/* Right Actions (Desktop) */}
                        <div className="flex items-center gap-4">
                            <button
                                className="flex items-center gap-1.5 md:gap-3 bg-action-red text-white px-3 md:px-5 py-2 md:py-2.5 rounded-lg hover:bg-red-700 transition-all shadow-md transform hover:scale-105 active:scale-95 group relative overflow-hidden"
                                onClick={toggleSidebar}
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <ShoppingCart size={20} className="relative z-10 flex-shrink-0" />
                                <div className="text-left leading-none relative z-10 flex flex-col justify-center">
                                    <span className="text-[9px] md:text-[10px] font-bold opacity-80 mb-0.5 hidden md:block">Sepetim</span>
                                    <span className="text-xs md:text-sm font-black whitespace-nowrap">{cartCount} Ürün</span>
                                </div>
                            </button>
                        </div>

                        {/* Mobile Search Icon Only */}
                        <button className="md:hidden p-2 text-corporate-black" onClick={() => navigate('/search')}>
                            <Search size={24} />
                        </button>
                    </div>
                </nav>

                {/* 4. Category Navbar (Desktop) */}
                <div className="hidden md:block bg-corporate-black py-0 border-t border-white/5">
                    <div className="container mx-auto px-4 relative">
                        <div className="flex items-center justify-between gap-1 h-14 whitespace-nowrap text-[13px] font-black uppercase tracking-tight text-white/90">
                            {/* "TÜM ÜRÜNLER" Button Added Here */}
                            <button
                                className="px-4 h-full cursor-pointer hover:bg-white/10 transition-all flex items-center gap-1.5"
                                onClick={() => navigate('/magaza')}
                            >
                                <span>TÜM ÜRÜNLER</span>
                            </button>

                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="group/cat h-full flex items-center"
                                    onMouseEnter={() => setActiveDropdown(cat.id)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button
                                        className={`px-4 h-full cursor-pointer hover:bg-white/10 transition-all flex items-center gap-1.5 ${activeDropdown === cat.id ? 'bg-white/10 text-indigo-600' : ''}`}
                                        onClick={() => handleCategoryClick(cat)}
                                    >
                                        <span>{cat.ad}</span>
                                        {cat.altKategoriler && cat.altKategoriler.length > 0 && (
                                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {/* Dropdown Menu (Full Width Mega Menu Style) */}
                                    {cat.altKategoriler && cat.altKategoriler.length > 0 && activeDropdown === cat.id && (
                                        <div className="absolute top-full left-0 bg-white text-corporate-black shadow-2xl rounded-b-xl p-10 w-full border-t-4 border-indigo-600 animate-in fade-in slide-in-from-top-4 duration-500 z-50">
                                            <div className="grid grid-cols-4 gap-8">
                                                {cat.altKategoriler.map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleCategoryClick(sub)}
                                                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-all text-left group/item border border-transparent hover:border-gray-100"
                                                    >
                                                        {sub.resim && (
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 bg-white">
                                                                <img src={sub.resim} alt={sub.ad} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="font-black text-sm group-hover/item:text-action-red transition-colors">{sub.ad}</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase">Ürünleri İncele</div>
                                                        </div>
                                                        <ChevronRight size={16} className="text-gray-300 group-hover/item:translate-x-1 transition-transform" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div className="absolute top-20 left-0 right-0 bg-white shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top duration-300">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="p-4 border-b">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Ürün ara..."
                                    className="w-full bg-gray-100 text-corporate-black placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-corporate-black p-1">
                                    <Search size={20} />
                                </button>
                            </div>
                        </form>

                        {/* Mobile Categories */}
                        <div className="py-2">
                            {categories.map((cat) => (
                                <div key={cat.id} className="border-b border-gray-100">
                                    <button
                                        className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-corporate-black hover:bg-gray-50 transition-colors"
                                        onClick={() => setActiveDropdown(activeDropdown === cat.id ? null : cat.id)}
                                    >
                                        <span>{cat.ad}</span>
                                        {cat.altKategoriler && cat.altKategoriler.length > 0 && (
                                            <ChevronDown size={20} className={`transition-transform ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {/* Subcategories */}
                                    {activeDropdown === cat.id && cat.altKategoriler && cat.altKategoriler.length > 0 && (
                                        <div className="bg-gray-50 px-4 py-2">
                                            {cat.altKategoriler.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => handleCategoryClick(sub)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:text-action-red transition-colors flex items-center gap-2"
                                                >
                                                    <ChevronRight size={14} />
                                                    {sub.ad}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handleCategoryClick(cat)}
                                                className="w-full px-4 py-2 text-left text-sm font-bold text-action-red"
                                            >
                                                Tümünü Gör →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
