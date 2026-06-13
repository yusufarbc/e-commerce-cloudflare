import { Shield } from 'lucide-react';
import React from 'react';

/**
 * KVKK Aydınlatma Metni
 */
export function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                <Shield className="text-brand-primary" size={32} />
                KVKK Aydınlatma Metni
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm">

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">1. Veri Sorumlusu</h2>
                    <p>
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz; veri sorumlusu olarak <strong>E-Market Teknoloji ve Ticaret Limited Şirketi</strong> tarafından aşağıda belirtilen kapsamda işlenmektedir.
                    </p>
                    <div className="mt-2 bg-gray-50 p-4 rounded border border-gray-200 text-sm">
                        <p><strong>Adres:</strong> Karaköy Mah. Rıhtım Cd. No: 15 Beyoğlu / İstanbul</p>
                        <p><strong>MERSİS No:</strong> 0123456789012345</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">2. Kişisel Verilerin İşlenme Amacı</h2>
                    <p>Kişisel verileriniz (ad, soyad, adres, iletişim), 6698 sayılı KVKK uyarınca yalnızca aşağıdaki amaçlarla işlenmektedir:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Siparişlerinizin oluşturulması, ürünlerin tarafınıza teslim edilmesi.</li>
                        <li>Fatura düzenlenmesi ve yasal muhasebe süreçlerinin yürütülmesi.</li>
                        <li>Kargo ve lojistik süreçlerinin yönetilmesi.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">3. Pazarlama ve Ticari İletiler</h2>
                    <p>
                        Sitemiz üzerinden reklam, kampanya veya tanıtım amaçlı ticari elektronik ileti gönderilmemektedir. Verileriniz pazarlama amacıyla işlenmez veya üçüncü şahıslarla paylaşılmaz.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">4. Çerez (Cookie) Bilgilendirmesi</h2>
                    <p>
                        Şirketimiz, web sitesinin işlevselliğini sağlamak amacıyla yalnızca <strong>zorunlu teknik çerezler</strong> kullanmaktadır. Herhangi bir reklam, pazarlama, takip veya hedefleme amaçlı üçüncü taraf çerezler kullanılmaz.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">5. Veri Sahibinin Hakları</h2>
                    <p>KVKK’nın 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme haklarına sahiptir.</p>
                </section>

            </div>
        </div>
    );
}
