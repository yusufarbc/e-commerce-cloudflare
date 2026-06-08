import { FileText } from 'lucide-react';
import React from 'react';

/**
 * Mesafeli Satış Sözleşmesi
 * 2026 Uyumlu
 */
export function DistanceSalesAgreement() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                <FileText className="text-brand-yellow" size={32} />
                Mesafeli Satış Sözleşmesi
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm">

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 1 - Taraflar</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold border-b pb-2 mb-2">SATICI</h3>
                            <p><strong>Unvan:</strong> E-Market Teknoloji ve Ticaret Limited Şirketi</p>
                            <p><strong>MERSİS:</strong> 0123456789012345</p>
                            <p><strong>Adres:</strong> Karaköy Mah. Rıhtım Cd. No: 15 Beyoğlu / İstanbul</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-bold border-b pb-2 mb-2">ALICI</h3>
                            <p>e-market.com üzerinden sipariş veren kullanıcı.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 2 - Konu</h2>
                    <p>İşbu sözleşmenin konusu, Alıcının Satıcıya ait internet sitesi üzerinden siparişini verdiği ürünlerin satışı ve teslimi ile ilgili hak ve yükümlülüklerin belirlenmesidir.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 3 - Teslimat ve Hasar Sorumluluğu</h2>
                    <p>Ürünlerin doğası gereği, teslimat sırasında paket dıştan kontrol edilmelidir. Eğer paket hasarlı ise, kargo görevlisine <strong>"Hasar Tespit Tutanağı"</strong> tutturulmalıdır.</p>
                    <p className="mt-2 text-red-600 font-medium">Tutanak tutulmadan teslim alınan ve sonrasında hasarlı olduğu iddia edilen ürünler için SATICI’nın iade veya değişim yükümlülüğü bulunmamaktadır.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 4 - Cayma Hakkı İstisnaları</h2>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <p className="font-bold text-red-800 mb-2">Mevzuat gereği aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li>Alıcının istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan, üzerinde değişiklik veya ilaveler yapılarak kişiye özel hale getirilen ürünler.</li>
                            <li>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan; iadesi sağlık ve hijyen açısından uygun olmayan (kozmetik, kişisel bakım, kulaklık vb.) veya niteliği itibarıyla geri gönderilmeye elverişli olmayan ürünler.</li>
                        </ul>
                    </div>
                </section>
                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">Madde 5 - Yürürlük</h2>
                    <p>ALICI, site üzerinden verdiği siparişe ait ödemeyi gerçekleştirdiğinde işbu sözleşmenin tüm şartlarını kabul etmiş sayılır.</p>
                </section>
            </div>
        </div>
    );
}
