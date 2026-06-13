import { Info } from 'lucide-react';
import React from 'react';

/**
 * Ön Bilgilendirme Formu
 * 2026 Yönetmeliği Uyumlu
 */
export function PreliminaryInfoForm() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Info className="text-brand-primary" size={32} />
                Ön Bilgilendirme Formu
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm">

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">1. Satıcı Bilgileri</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Unvan:</strong> E-Market Teknoloji ve Ticaret Limited Şirketi</li>
                        <li><strong>Adres:</strong> Karaköy Mah. Rıhtım Cd. No: 15 Beyoğlu / İstanbul</li>
                        <li><strong>Mersis No:</strong> 0123456789012345</li>
                        <li><strong>Telefon:</strong> 0850 000 00 00</li>
                        <li><strong>E-posta:</strong> bilgi@e-market.com</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">2. Ürün ve Fiyat Bilgileri</h2>
                    <p>Sipariş aşamasında ALICI’nın incelediği ürünlerin temel nitelikleri, tüm vergiler dahil toplam satış fiyatı, adet bilgisi ve nakliye giderleri sipariş özeti ekranında açıkça belirtilmiştir. ALICI bu bilgileri görerek onaylamıştır.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">3. Ödeme ve Teslimat</h2>
                    <p>Ödeme, kredi kartı veya banka kartı ile sipariş anında tahsil edilir. Teslimat, anlaşmalı kargo şirketi aracılığıyla ALICI’nın belirttiği adrese yapılır. Kargo ücreti, aksi belirtilmedikçe ALICI'ya aittir ve sipariş toplamına eklenir.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">4. Cayma Hakkı</h2>
                    <p>ALICI, 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma süresi, malın ALICI'ya teslim edildiği gün başlar.</p>
                    <p className="mt-2 text-red-600 font-bold">İstisnalar:</p>
                    <p>Alıcının istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan kişiye özel ürünler, hızlı bozulan veya son kullanma tarihi geçebilecek ürünler, tesliminden sonra koruyucu unsurları açılmış iadesi sağlık/hijyen açısından uygun olmayan ürünler ve doğası gereği iadesi mümkün olmayan mallarda cayma hakkı kullanılamaz.</p>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">5. Şikayet ve İtirazlar</h2>
                    <p>Tüketici, şikayet ve itirazları konusundaki başvurularını, her yıl Gümrük ve Ticaret Bakanlığı tarafından belirlenen parasal sınırlar dahilinde, yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki Tüketici Hakem Heyetine veya Tüketici Mahkemesine yapabilir.</p>
                </section>

            </div>
        </div>
    );
}
