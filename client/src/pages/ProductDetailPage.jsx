import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Heart, Share2, Check, XCircle, ChevronLeft, ChevronRight, Minus, Plus, Package, Truck, Shield, AlertCircle } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useCart } from '../context/CartContext';
import { useProduct, useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import SEO from '../components/SEO';
import { generateProductSchema, generateBreadcrumbSchema, combineSchemas } from '../utils/structuredData';
import { formatPrice, calculateDiscountPercentage } from '../utils/formatters';
import DOMPurify from 'dompurify';
import { trackViewItem, trackAddToCart } from '../utils/analytics';

const COLOR_HEX_MAP = {
    beyaz: '#f8fafc',
    siyah: '#111827',
    gri: '#9ca3af',
    antrasit: '#4b5563',
    kirmizi: '#dc2626',
    bordo: '#7f1d1d',
    mavi: '#2563eb',
    lacivert: '#1e3a8a',
    yesil: '#16a34a',
    haki: '#4d7c0f',
    sari: '#facc15',
    turuncu: '#f97316',
    kahverengi: '#7c2d12',
    pembe: '#ec4899',
    mor: '#7e22ce',
    krem: '#fef3c7',
    bej: '#d6c7a1'
};

const resolveColorHex = (name) => {
    if (!name) return '#e5e7eb';
    const lower = String(name).toLocaleLowerCase('tr-TR');
    const key = Object.keys(COLOR_HEX_MAP).find((k) => lower.includes(k));
    return key ? COLOR_HEX_MAP[key] : '#d1d5db';
};

const decodeHtmlEntities = (input) => {
    if (!input || typeof input !== 'string') return '';
    const entities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&nbsp;': ' '
    };
    return input.replace(/&[a-z0-9#]+;/gi, (match) => entities[match] || match);
};

const stripHtml = (html) => {
    if (!html) return '';
    let text = html;
    let previousText;
    do {
        previousText = text;
        text = text.replace(/<[^>]*>/g, '');
    } while (text !== previousText);
    return text;
};

export function ProductDetailPage() {
    const { id, slug } = useParams();
    const productIdOrSlug = id || slug;
    const navigate = useNavigate();
    const { addToCart } = useCart();

    // Use custom hooks for data fetching
    const { product, loading, error } = useProduct(productIdOrSlug);
    const { products: relatedProducts } = useProducts(
        product?.kategoriId ? { kategoriId: product.kategoriId } : null
    );

    // UI state
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        if (product) {
            trackViewItem(product);
        }
    }, [product]);

    // Reset state when product ID/Slug changes
    useEffect(() => {
        setSelectedImageIndex(0);
        setQuantity(1);
        const paletteOptions = Array.isArray(product?.renkKartelasi) ? product.renkKartelasi : [];
        const colorOptions = Array.isArray(product?.renkSecenekleri) ? product.renkSecenekleri : [];
        setSelectedColor(paletteOptions[0]?.name || colorOptions[0] || '');
    }, [productIdOrSlug]);

    useEffect(() => {
        const paletteOptions = Array.isArray(product?.renkKartelasi) ? product.renkKartelasi : [];
        const colorOptions = Array.isArray(product?.renkSecenekleri) ? product.renkSecenekleri : [];
        const availableColors = paletteOptions.length > 0 ? paletteOptions.map((item) => item.name) : colorOptions;
        if (!availableColors.length) {
            setSelectedColor('');
            return;
        }

        if (!availableColors.includes(selectedColor)) {
            setSelectedColor(availableColors[0]);
        }
    }, [product, selectedColor]);

    // Build image array (main + additional images)
    const getImages = () => {
        if (!product) return [];
        const images = [];
        if (product.resimUrl) images.push(product.resimUrl);
        if (product.resimler && product.resimler.length > 0) {
            product.resimler.forEach(r => {
                if (r.url && !images.includes(r.url)) images.push(r.url);
            });
        }
        return images.length > 0 ? images : [null];
    };

    const images = getImages();

    const handleAddToCart = () => {
        if (!inStock) {
            return;
        }

        const paletteOptions = Array.isArray(product?.renkKartelasi) ? product.renkKartelasi : [];
        const colorOptions = Array.isArray(product?.renkSecenekleri) ? product.renkSecenekleri : [];
        const availableColors = paletteOptions.length > 0 ? paletteOptions.map((item) => item.name) : colorOptions;
        if (availableColors.length > 0 && !selectedColor) {
            alert('Lutfen bir renk seciniz.');
            return;
        }

        setIsAdding(true);
        const cartProduct = {
            ...product,
            selectedColor: selectedColor || null
        };
        for (let i = 0; i < quantity; i++) {
            addToCart(cartProduct);
        }
        trackAddToCart(product, quantity, selectedColor || null);
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.ad,
                    text: `${product.ad} - E-Market`,
                    url: window.location.href
                });
            } catch {
                // Share cancelled by user
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link kopyalandı!');
        }
    };

    const stockCount = Number(product?.stokAdedi ?? 0);
    const isActive = product?.aktif !== false;
    const inStock = isActive && stockCount > 0;
    const discountPercentage = product
        ? calculateDiscountPercentage(product.fiyat, product.indirimliFiyat)
        : 0;

    // Filter related products (exclude current product)
    const filteredRelated = relatedProducts.filter(p => p.id !== product?.id).slice(0, 4);

    // SEO data
    const breadcrumbs = product ? [
        { name: 'Anasayfa', url: '/' },
        ...(product.kategori ? [{ name: product.kategori.ad, url: `/?search=${product.kategori.ad}` }] : []),
        { name: product.ad }
    ] : [];

    const structuredData = product ? combineSchemas(
        generateProductSchema(product),
        generateBreadcrumbSchema(breadcrumbs)
    ) : null;

    const rawDescription = product?.aciklama || '';
    const decodedDescription = decodeHtmlEntities(rawDescription);
    const plainDescription = stripHtml(decodedDescription).trim();
    const seoDescription = plainDescription.substring(0, 160) || product?.ad || '';

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-gray-200 rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-32" />
                        <div className="h-24 bg-gray-200 rounded" />
                        <div className="h-14 bg-gray-200 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (error || !product) return (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">{error || 'Ürün bulunamadı'}</h2>
            <button
                onClick={() => navigate('/')}
                className="mt-4 text-action-red hover:underline flex items-center justify-center gap-2 mx-auto"
            >
                <ArrowLeft size={16} /> Ürünlere Geri Dön
            </button>
        </div>
    );

    return (
        <div className="bg-white min-h-screen pb-20">
            <SEO
                title={product.ad}
                description={seoDescription}
                keywords={`${product.ad}, ${product.kategori?.ad || ''}, ${product.marka?.ad || ''}`}
                ogType="product"
                ogImage={product.resimUrl}
                canonical={`https://e-market.com/urun/${product.slug || product.id}`}
                structuredData={structuredData}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-corporate-black transition-colors">Anasayfa</Link>
                    <ChevronRight size={14} />
                    {product.kategori && (
                        <>
                            <Link to={`/?search=${product.kategori.ad}`} className="hover:text-corporate-black transition-colors">
                                {product.kategori.ad}
                            </Link>
                            <ChevronRight size={14} />
                        </>
                    )}
                    <span className="text-corporate-black font-medium truncate max-w-[200px]">{product.ad}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                    {/* Image Gallery */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden aspect-square lg:aspect-[4/5] max-h-[550px] group">
                            {images[selectedImageIndex] ? (
                                <>
                                    <img
                                        src={images[selectedImageIndex]}
                                        alt={product.ad}
                                        className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            const fallback = e.target.parentElement.querySelector('.image-fallback');
                                            if (fallback) fallback.style.display = 'flex';
                                        }}
                                    />
                                    <div className="image-fallback w-full h-full hidden items-center justify-center bg-gray-100">
                                        <Package size={120} className="text-gray-300" />
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <Package size={120} className="text-gray-300" />
                                </div>
                            )}

                            {/* Top-left badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                {discountPercentage > 0 && (
                                    <div className="bg-brand-primary text-white px-4 py-2 rounded-sm shadow-xl flex flex-col items-center leading-none">
                                        <span className="text-[10px] font-black uppercase tracking-widest">İNDİRİM</span>
                                        <span className="text-lg font-black tracking-tighter">%{discountPercentage} İndirim</span>
                                    </div>
                                )}
                                {product.iadeImkaniVar === false && (
                                    <div className="bg-black/85 text-white px-3 py-2 rounded-sm shadow-xl text-[11px] font-bold uppercase tracking-wide">
                                        İade imkanı yoktur
                                    </div>
                                )}
                            </div>

                            {/* Navigation Arrows (if multiple images) */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isWishlisted ? 'bg-action-red text-white' : 'bg-white text-gray-600 hover:bg-action-red hover:text-white'
                                        }`}
                                >
                                    <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="w-10 h-10 rounded-full bg-white text-gray-600 flex items-center justify-center shadow-lg hover:bg-corporate-black hover:text-white transition-all"
                                >
                                    <Share2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                            ? 'border-indigo-600 shadow-lg'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {img ? (
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <Package size={24} className="text-gray-300" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Meta Info */}
                    <div className="lg:col-span-6 flex flex-col justify-center">
                        {/* Brand */}
                        {product.marka && (
                            <span className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">
                                {product.marka.ad}
                            </span>
                        )}

                        <h1 className="text-2xl md:text-3xl font-bold text-corporate-black mb-4 leading-tight">
                            {product.ad}
                        </h1>

                        {/* Price */}
                        <div className="flex flex-col gap-1 mb-6">
                            {product.indirimliFiyat ? (
                                <>
                                    <div className="flex items-end gap-3">
                                        <span className="text-3xl md:text-4xl font-black text-corporate-black tracking-tighter">
                                            ₺{Number(product.indirimliFiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </span>
                                        <div className="bg-action-red/10 text-action-red text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest mb-1">
                                            Özel Fiyat
                                        </div>
                                    </div>
                                    <span className="text-lg text-gray-400 line-through opacity-60 font-medium">
                                        ₺{Number(product.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl md:text-4xl font-black text-corporate-black tracking-tighter">
                                    ₺{Number(product.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${inStock ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                {inStock ? <Check size={16} strokeWidth={3} /> : <XCircle size={16} strokeWidth={3} />}
                                {inStock ? 'Stokta Mevcut' : 'Tükendi'}
                            </div>
                            {inStock && stockCount < 10 && (
                                <span className="text-xs font-bold text-action-red animate-pulse uppercase tracking-wider">
                                    Son {stockCount} adet kaldı!
                                </span>
                            )}
                        </div>

                        {/* Purchase Actions (Moved from below) */}
                        <div className="py-6 border-y border-gray-100 mb-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Quantity Selector */}
                                <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden bg-gray-50/50 h-14">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-12 h-full flex items-center justify-center hover:bg-white hover:text-action-red transition-all"
                                        disabled={!inStock || quantity <= 1}
                                    >
                                        <Minus size={18} strokeWidth={2} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg text-corporate-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => q + 1)}
                                        className="w-12 h-full flex items-center justify-center hover:bg-white hover:text-green-600 transition-all"
                                        disabled={!inStock}
                                    >
                                        <Plus size={18} strokeWidth={2} />
                                    </button>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!inStock || isAdding}
                                    className={`flex-1 flex items-center justify-center gap-3 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg active:scale-95 h-14 ${isAdding
                                        ? 'bg-green-600 text-white'
                                        : inStock
                                            ? 'bg-action-red text-white hover:bg-corporate-black shadow-action-red/10'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isAdding ? (
                                        <>
                                            <Check size={22} strokeWidth={3} />
                                            Sepete Eklendi
                                        </>
                                    ) : inStock ? (
                                        <>
                                            <ShoppingCart size={22} strokeWidth={2} />
                                            Sepete Ekle
                                        </>
                                    ) : (
                                        <>
                                            <XCircle size={22} strokeWidth={2} />
                                            Tükendi
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Quick Trust Badges (Compact) */}
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 mb-6">
                            <div className="flex items-center justify-center gap-2">
                                <Truck size={20} className="text-gray-600" />
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Hızlı Kargo</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 border-x border-gray-200">
                                <Shield size={20} className="text-gray-600" />
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Güvenli Ödeme</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <Package size={20} className="text-gray-600" />
                                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Kolay İade</span>
                            </div>
                        </div>

                        {/* Bulk Order Info (Compact) */}
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl">
                            <p className="text-blue-900 text-[11px] font-medium leading-relaxed">
                                <strong>Toplu Sipariş?</strong> Projeleriniz ve toplu alımlarınız için <a href="mailto:satis@e-market.com" className="underline font-bold hover:text-blue-700">satis@e-market.com</a> üzerinden iletişime geçebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Full Width Attribute Sections (Color Palette) */}
                <div className="space-y-12 py-12 border-t border-gray-100">
                    {Array.isArray(product.renkKartelasi) && product.renkKartelasi.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-corporate-black flex items-center gap-3">
                                    {product.varyantBasligi || 'Renk Kartelası'}
                                    <span className="text-sm font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                                        {product.renkKartelasi.length} Seçenek
                                    </span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 gap-x-4 gap-y-8">
                                {product.renkKartelasi
                                    .map((color) => (
                                        <button
                                            type="button"
                                            key={color.id || color.code || color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`group relative flex flex-col items-center transition-all duration-300 ${selectedColor === color.name ? 'scale-110 z-10' : 'hover:scale-105'
                                                }`}
                                            title={color.name}
                                        >
                                            <div className={`w-full aspect-square rounded-2xl border-4 transition-all duration-300 shadow-sm ${selectedColor === color.name
                                                ? 'border-corporate-black shadow-xl ring-4 ring-corporate-black/5'
                                                : 'border-transparent group-hover:border-gray-200'
                                                }`}
                                                style={{ backgroundColor: color.hex || resolveColorHex(color.name) }}
                                            />
                                            <div className="w-full text-center mt-3">
                                                <span className={`text-[11px] font-bold leading-tight line-clamp-2 w-full uppercase tracking-tight ${selectedColor === color.name ? 'text-corporate-black' : 'text-gray-500'
                                                    }`}>
                                                    {color.name}
                                                </span>
                                            </div>
                                            {selectedColor === color.name && (
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-corporate-black text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {(!Array.isArray(product.renkKartelasi) || product.renkKartelasi.length === 0) && Array.isArray(product.renkSecenekleri) && product.renkSecenekleri.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-corporate-black flex items-center gap-3">
                                    {product.varyantBasligi || 'Renk Seçimi'}
                                    <span className="text-sm font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                                        {product.renkSecenekleri.length} Seçenek
                                    </span>
                                </h2>
                            </div>
                            <div className={product.varyantBasligi ? "flex flex-wrap gap-3" : "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 xl:grid-cols-10 gap-x-4 gap-y-8"}>
                                {product.renkSecenekleri
                                    .map((color) => (
                                        <button
                                            type="button"
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={product.varyantBasligi 
                                                ? `px-6 py-4 rounded-2xl border-[3px] font-black text-sm transition-all duration-300 ${
                                                    selectedColor === color 
                                                    ? 'border-corporate-black bg-corporate-black text-white shadow-xl' 
                                                    : 'border-gray-100 text-gray-500 hover:border-gray-300 bg-gray-50/50'
                                                }`
                                                : `group relative flex flex-col items-center transition-all duration-300 ${selectedColor === color ? 'scale-110 z-10' : 'hover:scale-105'}`
                                            }
                                            title={color}
                                        >
                                            {!product.varyantBasligi && (
                                                <>
                                                    <div className={`w-full aspect-square rounded-2xl border-4 transition-all duration-300 shadow-sm ${selectedColor === color
                                                        ? 'border-corporate-black shadow-xl ring-4 ring-corporate-black/5'
                                                        : 'border-transparent group-hover:border-gray-200'
                                                        }`}
                                                        style={{ backgroundColor: resolveColorHex(color) }}
                                                    />
                                                    <div className="w-full text-center mt-3">
                                                        <span className={`text-[11px] font-bold leading-tight line-clamp-2 w-full uppercase tracking-tight ${selectedColor === color ? 'text-corporate-black' : 'text-gray-500'
                                                            }`}>
                                                            {color}
                                                        </span>
                                                    </div>
                                                    {selectedColor === color && (
                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-corporate-black text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300">
                                                            <Check size={14} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {product.varyantBasligi && color}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                </div>



                {/* Product Description */}
                <div className="mt-16">
                    <h2 className="text-2xl font-black text-corporate-black mb-8">Açıklama</h2>
                    <div className="prose prose-lg max-w-none">
                        {product.aciklama ? (
                            <div dangerouslySetInnerHTML={{ __html: product.aciklama }} />
                        ) : (
                            <p className="text-gray-500">Bu ürün için açıklama bulunmuyor.</p>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-black text-corporate-black mb-8">Benzer Ürünler</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredRelated.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <FeaturesSection />
        </div>
    );
}
