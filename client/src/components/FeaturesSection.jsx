import React from 'react';
import { Truck, ShieldCheck, CreditCard, Percent } from 'lucide-react';

export function FeaturesSection() {
    return (
        <section className="bg-white pt-16 pb-4">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Hızlı Kargo */}
                    <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-brand-yellow/50 hover:-translate-y-2">

                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-yellow to-yellow-600 flex items-center justify-center mb-6 shadow-lg shadow-brand-yellow/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <Truck size={36} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-corporate-black group-hover:text-brand-yellow transition-colors">Hızlı Kargo</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Saat 12:00'e kadar verilen siparişler aynı gün kargoda.</p>
                        </div>
                    </div>

                    {/* Güvenli Ödeme */}
                    <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-brand-yellow/50 hover:-translate-y-2">

                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <ShieldCheck size={36} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-corporate-black group-hover:text-brand-yellow transition-colors">Güvenli Ödeme</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">256-bit SSL sertifikası ile güvenli alışveriş.</p>
                        </div>
                    </div>

                    {/* Taksit İmkanı */}
                    <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-brand-yellow/50 hover:-translate-y-2">

                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <CreditCard size={36} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-corporate-black group-hover:text-brand-yellow transition-colors">Taksit İmkanı</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Tüm banka kartlarına taksit seçenekleri.</p>
                        </div>
                    </div>

                    {/* Toptan Fiyat */}
                    <div className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-brand-yellow/50 hover:-translate-y-2">

                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-action-red to-red-600 flex items-center justify-center mb-6 shadow-lg shadow-action-red/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <Percent size={36} className="text-white" />
                            </div>
                            <h3 className="text-xl font-black mb-3 text-corporate-black group-hover:text-brand-yellow transition-colors">Toptan Fiyat</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Proje bazlı alımlarda özel iskonto.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
