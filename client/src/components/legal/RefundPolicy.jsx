import { RefreshCw, AlertCircle } from 'lucide-react';
import React from 'react';

/**
 * İade ve Değişim Politikası
 */
export function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-black mb-6 flex items-center gap-3">
                <RefreshCw className="text-brand-primary" size={32} />
                İptal ve İade Koşulları
            </h1>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6 text-gray-700 leading-relaxed text-sm">

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">1. İade Süreci</h2>
                    <p>
                        Alıcı, satın aldığı ürünü teslim aldığı tarihten itibaren <strong>14 gün</strong> içinde, ürünün yeniden satılabilir özelliğini kaybetmemiş olması kaydıyla iade edebilir. Ancak sarf malzemelerinin (açılmış paketler) iadesi kabul edilmez.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">2. Hasarlı Ürün ve Kargo Tutanağı</h2>
                    <p className="mb-2">Ürünlerin doğası gereği, teslimat sırasında paket dıştan kontrol edilmelidir. Eğer paket hasarlı ise, kargo görevlisine <strong>"Hasar Tespit Tutanağı"</strong> tutturulmalıdır.</p>
                    <p className="font-bold text-red-600">
                        Tutanağı olmayan, taşıma kaynaklı hasarlı ürünlerin iade sorumluluğu alıcıya aittir.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-corporate-black uppercase mb-2">3. İptal Şartları</h2>
                    <p>
                        Siparişiniz kargoya verilmeden önce "Hesabım" paneli veya iletişim kanallarımız üzerinden iptal edilebilir. Kargoya verilen siparişlerde iade prosedürü uygulanır.
                    </p>
                </section>

                <section className="bg-amber-50 p-6 rounded-xl border border-amber-100 mt-8 shadow-sm">
                    <h2 className="text-lg font-bold text-amber-900 uppercase mb-3 flex items-center gap-2">
                        <AlertCircle size={20} className="text-amber-600" />
                        4. Önemli Bilgilendirme (Kişiye Özel Hazırlanan Ürünler)
                    </h2>
                    <p className="text-amber-800 font-medium text-sm leading-relaxed mb-2">
                        6502 sayılı Tüketicinin Korunması Hakkında Kanun'un "Cayma Hakkının İstisnaları" başlıklı maddesi gereğince; 
                        <strong className="underline decoration-amber-300"> alıcının istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan, üzerinde değişiklik veya ilaveler yapılarak kişiye özel hale getirilen ürünler "kişiye özel üretim" kapsamında değerlendirilmektedir.</strong>
                    </p>
                    <p className="text-amber-700 text-sm italic">
                        Bu sebeple, kişiye özel olarak üretilen, hazırlanan veya kişiselleştirilen ürünlerde cayma hakkı kullanılamaz ve iade kabul edilmemektedir. 
                        Lütfen siparişiniz öncesinde ürün seçeneklerinizi kesinleştiriniz.
                    </p>
                </section>
            </div>
        </div>
    );
}
