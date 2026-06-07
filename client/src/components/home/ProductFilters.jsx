import { X } from 'lucide-react';

export function ProductFilters({
    showFilters,
    setShowFilters,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    applyPriceFilter,
    clearPriceFilter,
    minPriceParam,
    maxPriceParam,
    brands,
    selectedMarkaId,
    applyBrandFilter,
    sortBy,
    applySorting
}) {
    return (
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-black/50 md:relative md:bg-transparent' : 'hidden md:block'
            } md:w-64 md:flex-shrink-0`}>
            <div className={`${showFilters ? 'absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto' : ''
                } md:sticky md:top-24`}>
                {/* Mobile Close Button */}
                {showFilters && (
                    <div className="md:hidden flex items-center justify-between p-4 border-b">
                        <h3 className="font-bold text-lg">Filtreler</h3>
                        <button onClick={() => setShowFilters(false)} className="p-2">
                            <X size={24} />
                        </button>
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
                    {/* Price Filter */}
                    <div>
                        <h3 className="font-bold text-corporate-black mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-brand-yellow rounded-full"></span>
                            Fiyat Aralığı
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block uppercase">Min Fiyat (₺)</label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-yellow transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-600 mb-1 block uppercase">Max Fiyat (₺)</label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="10000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-yellow transition-colors"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={applyPriceFilter}
                                    className="flex-1 bg-brand-yellow text-corporate-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
                                >
                                    Uygula
                                </button>
                                {(minPriceParam || maxPriceParam) && (
                                    <button
                                        onClick={clearPriceFilter}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                            {(minPriceParam || maxPriceParam) && (
                                <div className="text-xs text-gray-500 pt-2">
                                    Filtreleniyor: {minPriceParam || '0'} ₺ - {maxPriceParam || '∞'} ₺
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-corporate-black mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-brand-yellow rounded-full"></span>
                            Marka
                        </h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={!selectedMarkaId}
                                    onChange={() => applyBrandFilter('')}
                                    className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow"
                                />
                                <span className="text-sm font-medium">Tüm Markalar</span>
                            </label>
                            {brands.map(brand => (
                                <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={selectedMarkaId === brand.id}
                                        onChange={() => applyBrandFilter(brand.id)}
                                        className="w-4 h-4 text-brand-yellow focus:ring-brand-yellow"
                                    />
                                    <span className="text-sm">{brand.ad}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="font-bold text-corporate-black mb-4 flex items-center gap-2">
                            <span className="w-1 h-5 bg-brand-yellow rounded-full"></span>
                            Sıralama
                        </h3>
                        <select
                            value={sortBy}
                            onChange={(e) => applySorting(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-yellow transition-colors font-medium text-sm"
                        >
                            <option value="newest">En Yeni</option>
                            <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                            <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                            <option value="name-asc">İsim (A-Z)</option>
                            <option value="name-desc">İsim (Z-A)</option>
                        </select>
                    </div>
                </div>
            </div>
        </aside>
    );
}
