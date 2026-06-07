import React from 'react';
import { Shield, Truck, Award, Users } from 'lucide-react';
import SEO from '../components/SEO';

export function AboutPage() {
    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title="Hakkımızda"
                description="E-Market - Profesyonel e-ticaret tedarikçiniz. Kalite, güven ve müşteri memnuniyeti odaklı hizmetimizle yanınızdayız."
                keywords="e-market hakkında, e-ticaret mağazası, kurumsal, alışveriş"
            />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">Hakkımızda</h1>
                    <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full" />
                </div>

                <div className="space-y-8">
                    {/* Intro Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
                                Profesyonel hırdavat ve inşaat malzemeleri sektöründe güvenilir tedarikçiniz.
                                Kalite, hız ve müşteri memnuniyeti odaklı hizmet anlayışımızla yanınızdayız.
                            </p>
                            <p className="text-base text-gray-500">
                                <strong>e-market.com</strong>, Türkiye genelinde hizmet veren <strong>E-Market Teknoloji ve Ticaret Limited Şirketi</strong>'nin dijital satış kanalıdır.
                                Siparişleriniz, E-Market güvencesiyle paketlenmekte ve faturalandırılmaktadır.
                            </p>
                        </div>
                    </div>

                    {/* Mission & Vision */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-l-8 border-brand-yellow hover:translate-y-[-4px] transition-transform duration-300">
                            <h2 className="text-2xl font-bold text-corporate-black mb-4 flex items-center gap-2">
                                <Award className="text-brand-yellow" /> Misyonumuz
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Türkiye genelindeki tüm kullanıcılara
                                en kaliteli ürünleri en uygun fiyatlarla, hızlı ve güvenilir
                                bir şekilde ulaştırmak. Müşteri memnuniyetini her şeyin önünde tutarak,
                                sektörde lider bir e-ticaret platformu olmak.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 border-l-8 border-action-red hover:translate-y-[-4px] transition-transform duration-300">
                            <h2 className="text-2xl font-bold text-corporate-black mb-4 flex items-center gap-2">
                                <Shield className="text-action-red" /> Vizyonumuz
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                Türkiye'nin en güvenilir ve tercih edilen online alışveriş
                                platformu olmak. Teknoloji ve kalite odaklı yaklaşımımızla, müşterilerimize
                                7/24 kesintisiz hizmet sunarak, sektörde dijital dönüşümün öncüsü olmak.
                            </p>
                        </div>
                    </div>

                    {/* Values */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                        <h2 className="text-2xl font-bold text-corporate-black mb-8 text-center">Değerlerimiz</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center group">
                                <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-yellow transition-colors duration-300">
                                    <Shield size={32} className="text-brand-yellow group-hover:text-corporate-black transition-colors duration-300" />
                                </div>
                                <h3 className="font-bold text-corporate-black mb-2">Güven</h3>
                                <p className="text-sm text-gray-500">
                                    %100 orijinal ürünler ve şeffaf hizmet.
                                </p>
                            </div>
                            <div className="text-center group">
                                <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-yellow transition-colors duration-300">
                                    <Award size={32} className="text-brand-yellow group-hover:text-corporate-black transition-colors duration-300" />
                                </div>
                                <h3 className="font-bold text-corporate-black mb-2">Kalite</h3>
                                <p className="text-sm text-gray-500">
                                    Sadece en iyi markalarla çalışıyoruz.
                                </p>
                            </div>
                            <div className="text-center group">
                                <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-yellow transition-colors duration-300">
                                    <Truck size={32} className="text-brand-yellow group-hover:text-corporate-black transition-colors duration-300" />
                                </div>
                                <h3 className="font-bold text-corporate-black mb-2">Hız</h3>
                                <p className="text-sm text-gray-500">
                                    Hızlı kargo ve zamanında teslimat.
                                </p>
                            </div>
                            <div className="text-center group">
                                <div className="w-16 h-16 bg-brand-yellow/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-yellow transition-colors duration-300">
                                    <Users size={32} className="text-brand-yellow group-hover:text-corporate-black transition-colors duration-300" />
                                </div>
                                <h3 className="font-bold text-corporate-black mb-2">Müşteri Odaklılık</h3>
                                <p className="text-sm text-gray-500">
                                    7/24 destek ile her zaman yanınızdayız.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
                        <h2 className="text-2xl font-bold text-corporate-black mb-8">Neden Bizi Seçmelisiniz?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: 'Geniş Ürün Yelpazesi', desc: 'Binlerce kategoride aradığınız her şey tek platformda.' },
                                { title: 'Güvenli Alışveriş', desc: '256-bit SSL ve 3D Secure ile tam koruma.' },
                                { title: 'Kolay İade', desc: '14 gün içinde koşulsuz iade hakkı.' },
                                { title: 'Toplu Sipariş', desc: 'Projeleriniz için özel fiyat avantajları.' },
                                { title: 'Profesyonel Destek', desc: 'Alanında uzman ekibimizle teknik destek.' }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-8 h-8 bg-black text-brand-yellow rounded-full flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                                    <div>
                                        <h3 className="font-bold text-corporate-black mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact CTA */}
                    <div className="bg-corporate-black text-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
                        <h2 className="text-2xl font-bold mb-4">Sorularınız mı var?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Size yardımcı olmak için buradayız. Ürünler, siparişler veya projeleriniz hakkında bizimle iletişime geçin.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a href="/iletisim" className="bg-brand-yellow text-corporate-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
                                İletişim Sayfası
                            </a>
                            <a href="https://wa.me/908500000000?text=Merhaba%2C%20e-market.com%20%C3%BCzerinden%20size%20ula%C5%9F%C4%B1yorum." target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
                                WhatsApp Destek
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
