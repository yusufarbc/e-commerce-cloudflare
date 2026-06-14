import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Phone, Mail, MapPin, Shield, CreditCard, Headphones, ChevronRight, MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

// Social media SVG icons
const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

// Payment method icons
const VisaIcon = () => (
    <svg viewBox="0 0 48 48" fill="currentColor" className="h-8">
        <path fill="#1565C0" d="M45,35c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V13c0-2.209,1.791-4,4-4h34c2.209,0,4,1.791,4,4V35z" />
        <path fill="#FFF" d="M15.186 19l-2.626 7.832c0 0-.667-3.313-.733-3.729-1.495-3.411-3.701-3.221-3.701-3.221L10.726 30v-.002h3.161L18.258 19H15.186zM17.689 30h3.021l1.973-11h-3.043L17.689 30zM38.008 19h-3.021l-4.71 11h2.852l.588-1.571h3.596L37.619 30h2.613L38.008 19zM34.513 26.328l1.563-4.157.818 4.157H34.513zM26.369 22.206c0-.606.498-1.057 1.926-1.057.928 0 1.991.463 1.991.463l.463-2.542c0 0-1.463-.463-2.853-.463-3.159 0-4.389 1.39-4.389 3.233 0 3.541 4.389 2.935 4.389 4.389 0 .606-.729 1.057-1.852 1.057-1.463 0-2.621-.695-2.621-.695l-.463 2.542c0 0 1.158.695 3.084.695 1.926 0 4.852-1.158 4.852-3.696C30.896 22.9 26.369 23.506 26.369 22.206z" />
    </svg>
);

const MastercardIcon = () => (
    <svg viewBox="0 0 48 48" className="h-8">
        <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z" />
        <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z" />
        <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z" />
    </svg>
);

const TroyIcon = () => (
    <svg viewBox="0 0 239.83 132.38" className="h-5" style={{ minWidth: 'auto' }}>
        <path fill="#ffffff" d="m239.31,119.91c0,6.6-5.35,11.94-11.94,11.94H12.48c-6.6,0-11.95-5.34-11.95-11.94V12.47C.53,5.88,5.88.53,12.48.53h214.9c6.59,0,11.94,5.35,11.94,11.94v107.44Z" />
        <path fill="#4c565c" d="m208.53,39.77c-2.89,0-6.09,1.6-7.35,4.51l-13.52,30.98-4.87-30.98c-.57-2.91-2.53-4.51-5.65-4.51h-17.13l14.65,51.46c.26.99.32,2.08.12,3.23-.77,4.29-4.87,7.78-9.17,7.78h-9.59c-2.43,0-4.03,1.5-4.83,4.92l-2.13,12.75h16.89c8.82,0,19.16-4.43,26.07-16.66l33.82-63.48h-17.31Z" />
        <path fill="#4c565c" d="m42.28,24.4c5.06,0,7.5,2.02,6.61,7.09l-1.47,8.26h11.62l-2.56,14.51h-11.62l-3.17,17.98c-1.1,6.25,5.1,7.08,8.66,7.08.7,0,1.29-.02,1.72-.04l-2.85,16.18c-.87.1-1.79.21-3.69.21-8.82,0-25.51-2.36-22.23-20.97l3.58-20.44h-8.46l2.55-14.51h8.39l2.7-15.35h10.21Z" />
        <path fill="#2bb8c9" d="m139.93,40.42l-2.99,16.92c3.69,1.88,6.2,5.7,6.2,10.11,0,5.82-4.35,10.58-9.97,11.27l-2.98,16.92c.53.03,1.06.05,1.6.05,15.6,0,28.23-12.65,28.23-28.24,0-12.74-8.46-23.53-20.09-27.03" />
        <path fill="#2bb8c9" d="m126.64,77.56c-3.68-1.87-6.2-5.7-6.2-10.11,0-5.78,4.37-10.58,9.98-11.25l2.98-16.91c-.54-.03-1.07-.05-1.61-.05-15.58,0-28.22,12.65-28.22,28.22,0,12.75,8.47,23.55,20.1,27.04l2.98-16.93Z" />
        <path fill="#4c565c" d="m65.79,39.77h9.99c5.06,0,7.49,2.02,6.6,7.09l-1.1,6.14c3.72-7.56,11.78-13.78,20.07-13.78,1.09,0,2.13.21,2.13.21l-3.23,18.3s-1.45-.34-3.71-.34c-4.41,0-11.86,1.4-16.01,9.69-.99,2.04-1.75,4.52-2.28,7.52l-3.62,20.56h-18.6l9.76-55.38Z" />
        <path fill="#4c565c" d="m225.84,97.73c0,1.65-.59,3.06-1.75,4.22-1.16,1.17-2.57,1.75-4.22,1.75s-3.05-.59-4.22-1.75c-1.17-1.16-1.75-2.57-1.75-4.22s.59-3.05,1.75-4.22c1.17-1.16,2.57-1.75,4.22-1.75s3.06.59,4.22,1.75c1.17,1.17,1.75,2.57,1.75,4.22m-.94,0c0-1.41-.49-2.61-1.48-3.6-.98-.99-2.17-1.49-3.55-1.49s-2.56.5-3.55,1.49c-.98.99-1.46,2.19-1.46,3.6s.48,2.61,1.46,3.6c.98.99,2.16,1.49,3.55,1.49s2.57-.5,3.55-1.49c.99-.99,1.48-2.19,1.48-3.6m-2.52,3.26h-1.06l-1.5-2.67h-.99v2.67h-.91v-6.54h2.22c.58,0,1.06.19,1.47.56.4.38.6.84.6,1.39,0,.91-.47,1.51-1.41,1.8l1.57,2.78Zm-1.1-4.58c0-.33-.12-.61-.35-.83-.23-.22-.53-.33-.89-.33h-1.22v2.3h1.22c.36,0,.66-.11.89-.32.23-.22.35-.48.35-.82" />
    </svg>
);

export function Footer() {
    const { settings } = useSettings();
    const siteTitle = settings.siteAdi || 'E-Market';
    const email = settings.iletisimEmail || 'bilgi@e-market.com';
    const instagram = settings.instagramUrl || 'https://www.instagram.com/emarketltd/';
    const facebook = settings.facebookUrl || 'https://www.facebook.com/emarketltd/';
    const rawNum = settings.whatsappNumarasi || '';
    const cleanNum = rawNum.replace(/[^0-9]/g, '') || '908500000000';
    const waText = encodeURIComponent(`Merhaba, ${siteTitle} üzerinden size ulaşıyorum.`);

    return (
        <footer className="bg-corporate-black text-white pt-16 pb-8 border-t-2 border-indigo-600/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                    {/* 1. Sütun: E-Market (Kimlik) */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block group">
                            <img
                                src="/images/logo-dark.svg"
                                alt={siteTitle}
                                className="h-20 w-auto object-contain hover:opacity-90 transition-opacity duration-300"
                            />
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Güvenilir ve hızlı alışverişin adresi. En kaliteli ürünler, en uygun fiyatlarla burada.
                        </p>
                        <div className="space-y-4 pt-2">
                            <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-300 hover:text-indigo-600 transition-colors bg-white/5 p-4 rounded-lg border border-white/10 hover:border-indigo-600/30">
                                <Mail size={22} />
                                <span className="text-base font-medium">{email}</span>
                            </a>
                            <div className="flex gap-3">
                                <a
                                    href={instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all hover:scale-110"
                                    aria-label="Instagram"
                                >
                                    <InstagramIcon />
                                </a>
                                <a
                                    href={facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all hover:scale-110"
                                    aria-label="Facebook"
                                >
                                    <FacebookIcon />
                                </a>
                                <a
                                    href={`https://wa.me/${cleanNum}?text=${waText}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all hover:scale-110"
                                    aria-label="WhatsApp"
                                >
                                    <WhatsAppIcon />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 2. Sütun: Alışveriş */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
                            Alışveriş
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Öne Çıkanlar', href: '/magaza?ozellik=one-cikan' },
                                { name: 'Yeni Ürünler', href: '/magaza?ozellik=yeni' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Sütun: Müşteri */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
                            Müşteri
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Kargo ve Teslimat', href: '/kargo-bilgileri' },
                                { name: 'İade ve Değişim Şartları', href: '/iade-degisim' },
                                { name: 'Sıkça Sorulan Sorular', href: '/sss' },
                                { name: 'İletişim', href: '/iletisim' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Sütun: Kurumsal */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-brand-primary rounded-full"></span>
                            Kurumsal
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: 'Hakkımızda', href: '/hakkimizda' },
                                { name: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
                                { name: 'KVKK Aydınlatma Metni', href: '/gizlilik-ve-kvkk' },
                                { name: 'Ön Bilgilendirme Formu', href: '/on-bilgilendirme' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-sm group"
                                    >
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-600 transition-colors" />
                                        <span>{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-xs text-gray-500 leading-relaxed">
                            &copy; {new Date().getFullYear()} {siteTitle}. Tüm Hakları Saklıdır.
                        </p>
                        <p className="text-[11px] text-gray-700 mt-0.5">
                            {siteTitle} Teknoloji ve Ticaret Limited Şirketi | MERSİS: 0123456789012345
                        </p>
                    </div>

                    <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <VisaIcon />
                        <MastercardIcon />
                        <TroyIcon />
                        <div className="h-4 w-px bg-white/20 mx-1" />
                        <span className="text-white font-black tracking-widest text-[10px] uppercase bg-white/10 px-2.5 py-1 rounded-sm border border-white/10">iyzico</span>
                        <span className="text-white font-black tracking-widest text-[10px] uppercase bg-white/10 px-2.5 py-1 rounded-sm border border-white/10">PayTR</span>
                        <span className="text-white font-black tracking-widest text-[10px] uppercase bg-white/10 px-2.5 py-1 rounded-sm border border-white/10">Param</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
