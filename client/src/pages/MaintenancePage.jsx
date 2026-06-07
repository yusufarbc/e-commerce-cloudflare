import React from 'react';
import { Settings, Hammer, AlertTriangle } from 'lucide-react';

export function MaintenancePage() {
    return (
        <div className="min-h-screen bg-corporate-black flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 transform -rotate-12">
                    <Hammer size={120} className="text-white" />
                </div>
                <div className="absolute bottom-10 right-10 transform rotate-12">
                    <Settings size={120} className="text-white" />
                </div>
            </div>

            <div className="z-10 max-w-2xl w-full bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
                <div className="w-24 h-24 bg-brand-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-yellow/20 animate-pulse">
                    <Settings size={48} className="text-corporate-black animate-spin-slow" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                    BAKIM <span className="text-brand-yellow">MODU</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                    Sizlere daha iyi hizmet verebilmek için altyapımızda planlı bir güncelleme yapıyoruz.
                    Çok kısa bir süre sonra yenilenmiş yüzümüzle karşınızda olacağız.
                </p>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-yellow-500">
                    <AlertTriangle size={20} />
                    <span className="font-bold text-sm">Tahmini Süre: 15-30 Dakika</span>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-400">Acil durumlar için bize ulaşın:</p>
                    <a
                        href="mailto:bilgi@e-market.com"
                        className="text-brand-yellow font-bold hover:text-white transition-colors text-lg"
                    >
                        bilgi@e-market.com
                    </a>
                </div>
            </div>

            <div className="absolute bottom-8 text-xs text-gray-600 font-medium">
                &copy; {new Date().getFullYear()} E-Market. Tüm hakları saklıdır.
            </div>
        </div>
    );
}
