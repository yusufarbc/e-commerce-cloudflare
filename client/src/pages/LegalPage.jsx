import React from 'react';
import SEO from '../components/SEO';
import { RefundPolicy } from '../components/legal/RefundPolicy';
import { ShippingInfo } from '../components/legal/ShippingInfo';
import { DistanceSalesAgreement } from '../components/legal/DistanceSalesAgreement';
import { PreliminaryInfoForm } from '../components/legal/PreliminaryInfoForm';
import { PrivacyPolicy } from '../components/legal/PrivacyPolicy';

export function LegalPage({ title, contentKey }) {
    const getContent = () => {
        switch (contentKey) {
            case 'iade-degisim':
                return <RefundPolicy />;
            case 'kargo-bilgileri':
                return <ShippingInfo />;
            case 'mesafeli-satis-sozlesmesi':
                return <DistanceSalesAgreement />;
            case 'on-bilgilendirme':
                return <PreliminaryInfoForm />;
            case 'gizlilik-ve-kvkk':
                return <PrivacyPolicy />;
            default:
                return (
                    <div className="text-center py-12">
                        <p className="text-gray-500">İçerik güncelleniyor...</p>
                        <button onClick={() => window.location.href = '/iletisim'} className="mt-4 text-action-red hover:underline">
                            Bizimle İletişime Geçin
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title={`${title} - E-Market`}
                description={`${title} hakkında bilgi.`}
            />
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">{title}</h1>
                    <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full" />
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 animate-in fade-in duration-500">
                    <div className="prose prose-lg max-w-none prose-headings:text-corporate-black prose-a:text-brand-yellow hover:prose-a:text-yellow-600 transition-colors">
                        {getContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LegalPage;
