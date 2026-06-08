import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Check } from 'lucide-react';

/**
 * Enhanced ProductCard Component.
 * Features: Discount badge, stock status, wishlist button, quick add animation, hover effects.
 */
export function ProductCard({ product }) {
    const { t } = useTranslation();
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Calculate discount percentage
    const discountPercentage = product.indirimliFiyat
        ? Math.round((1 - product.indirimliFiyat / product.fiyat) * 100)
        : 0;

    // Product is available only when active and stock count is greater than zero.
    const stockCount = Number(product.stokAdedi ?? 0);
    const isActive = product.aktif !== false;
    const inStock = isActive && stockCount > 0;

    // Helper to strip HTML
    const stripHtml = (html) => {
        if (!html) return '';
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const plainDescription = stripHtml(product.aciklama).substring(0, 80) + (product.aciklama?.length > 80 ? '...' : '');

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product);
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className={`group bg-white shadow-sm rounded-xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl hover:border-indigo-600/50 transition-all duration-300 hover:-translate-y-1 ${!inStock ? 'opacity-70 grayscale-[30%]' : ''}`}>
            <Link to={product.slug ? `/urun/${product.slug}` : `/product/${product.id}`} className="block relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {/* Image Wrap */}
                <div className="w-full h-full bg-white flex items-center justify-center p-4 pb-2">
                    {product.resimUrl ? (
                        <img
                            src={product.resimUrl}
                            alt={product.ad}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-200">
                            <Eye size={48} />
                        </div>
                    )}
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                    {discountPercentage > 0 && (
                        <div className="bg-brand-yellow text-white px-2 py-0.5 rounded-sm shadow-xl flex flex-col items-center leading-none">
                            <span className="text-[9px] font-black tracking-tighter uppercase">FIRSAT</span>
                            <span className="text-xs font-black tracking-tighter">%{discountPercentage} İndirim</span>
                        </div>
                    )}
                    {!inStock && (
                        <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            TÜKENDİ
                        </span>
                    )}

                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isWishlisted
                        ? 'bg-action-red text-white scale-110'
                        : 'bg-white/90 text-gray-600 opacity-0 group-hover:opacity-100 hover:bg-action-red hover:text-white'
                        }`}
                    aria-label="Favorilere Ekle"
                >
                    <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <div className="p-4 flex flex-col flex-grow">
                {/* Brand */}
                {product.marka && (
                    <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-1 block">
                        {product.marka.ad}
                    </span>
                )}

                <Link to={product.slug ? `/urun/${product.slug}` : `/product/${product.id}`}>
                    <h3 className="text-gray-800 font-semibold text-sm mb-3 line-clamp-2 leading-snug hover:text-action-red transition-colors min-h-[36px]">
                        {product.ad}
                    </h3>
                </Link>

                {/* Description - REMOVED as per request */}
                {/* <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                    {plainDescription}
                </p> */}

                {/* Price & Add to Cart */}
                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        {product.indirimliFiyat ? (
                            <>
                                <span className="text-[11px] text-gray-400 line-through leading-none">
                                    ₺{Number(product.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-base font-black text-corporate-black tracking-tight leading-tight">
                                    ₺{Number(product.indirimliFiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-black text-corporate-black leading-tight">
                                ₺{Number(product.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!inStock || isAdding}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-bold text-[11px] tracking-wide transition-all duration-300 transform shrink-0 ${
                            isAdding
                            ? 'bg-green-600 text-white scale-95 shadow-md'
                            : inStock
                                ? 'bg-[#dc2a12] text-white hover:bg-corporate-black hover:text-indigo-600 shadow-sm hover:shadow-md active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        aria-label="Sepete Ekle"
                    >
                        {isAdding ? (
                            <>
                                <Check size={14} />
                                <span className="hidden sm:inline">Eklendi</span>
                            </>
                        ) : inStock ? (
                            <>
                                <ShoppingCart size={14} />
                                <span className="hidden sm:inline">Sepete Ekle</span>
                            </>
                        ) : (
                            <span>Tükendi</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Skeleton loader for ProductCard during loading states.
 */
export function ProductCardSkeleton() {
    return (
        <div className="bg-white shadow-sm rounded-xl overflow-hidden flex flex-col h-full border border-gray-100 animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300" />
            <div className="p-4 flex flex-col gap-3">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="flex justify-between items-center mt-auto pt-2">
                    <div className="h-6 bg-gray-200 rounded w-20" />
                    <div className="h-10 bg-gray-200 rounded-full w-24" />
                </div>
            </div>
        </div>
    );
}
