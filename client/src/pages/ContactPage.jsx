import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings } from '../context/SettingsContext';

export function ContactPage() {
    const { settings } = useSettings();
    const siteTitle = settings.siteAdi || 'E-Market';
    const email = settings.iletisimEmail || 'bilgi@e-market.com';
    const rawNum = settings.whatsappNumarasi || '';
    const cleanNum = rawNum.replace(/[^0-9]/g, '') || '908500000000';
    const phone = settings.telefon || '0850 000 00 00';
    const address = settings.adres || 'Karaköy, İstanbul';
    const instagram = settings.instagramUrl || 'https://www.instagram.com/emarketltd/';
    const facebook = settings.facebookUrl || 'https://www.facebook.com/emarketltd/';
    const waText = encodeURIComponent('Merhaba, yardım almak istiyorum.');

    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title="İletişim"
                description={`${siteTitle} ile iletişime geçin. Telefon, e-posta ve WhatsApp üzerinden 7/24 destek.`}
                keywords={`${siteTitle.toLowerCase()} iletişim, müşteri hizmetleri, destek`}
            />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">İletişim</h1>
                    <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                        Size nasıl yardımcı olabiliriz? Bize ulaşın, en kısa sürede yanıt verelim.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Contact Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {/* Phone */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                    <Phone size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">Telefon</h3>
                                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-gray-600 hover:text-indigo-600 transition-colors block text-lg font-medium">
                                        {phone}
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                    <Mail size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">E-posta</h3>
                                    <a href={`mailto:${email}`} className="text-gray-600 hover:text-indigo-600 transition-colors block text-lg font-medium">
                                        {email}
                                    </a>
                                    <p className="text-sm text-gray-500 mt-1">24 saat içinde yanıt veriyoruz</p>
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                    <MapPin size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">Adres</h3>
                                    <p className="text-gray-600 font-medium">{address}</p>
                                    <p className="text-sm text-gray-500 mt-1">Türkiye</p>
                                </div>
                            </div>
                        </div>

                        {/* Hours */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                    <Clock size={24} className="text-corporate-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-corporate-black mb-1 text-lg">Çalışma Saatleri</h3>
                                    <p className="text-gray-600 font-medium">Pzt - Cmt: 09:00 - 18:00</p>
                                    <p className="text-sm text-gray-500 mt-1 text-red-500">Pazar: Kapalı</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp CTA */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl max-w-2xl mx-auto transform hover:scale-[1.02] transition-all duration-300 mb-12">
                        <h2 className="text-2xl md:text-3xl font-black mb-4">Hızlı Destek mi Lazım?</h2>
                        <p className="text-green-50 mb-8 text-lg">
                            WhatsApp hattımız üzerinden müşteri temsilcilerimizle anında iletişime geçebilirsiniz.
                        </p>
                        <a
                            href={`https://wa.me/${cleanNum}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-white text-green-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-green-50 transition-all shadow-lg hover:shadow-white/20"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp'tan Yaz
                        </a>
                    </div>

                    {/* Social Media Links */}
                    <div className="text-center">
                        <h3 className="text-lg font-bold text-corporate-black mb-6 uppercase tracking-widest">Bizi Sosyal Medyada Takip Edin</h3>
                        <div className="flex justify-center gap-6">
                            <a
                                href={facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 group"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a
                                href={instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-pink-600 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all transform hover:scale-110 group"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
