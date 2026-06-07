import React from 'react';

export const ShippingInfo = () => {
    return (
        <div className="space-y-4 text-gray-700">
            <p className="mb-4"><strong>Son Güncelleme:</strong> 11 Ocak 2026</p>

            <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">1. Kargo Kapsamı</h2>
            <p className="mb-4">
                E-Market olarak <span className="bg-brand-yellow/30 px-1 rounded">Türkiye genelinde</span> tüm illere kargo ile teslimat yapıyoruz.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r">
                <strong>📍 Not:</strong> Yurtdışına teslimat hizmetimiz bulunmamaktadır.
            </div>

            <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">2. Kargo Ücretleri</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse mb-4">
                    <thead>
                        <tr className="bg-corporate-black text-white">
                            <th className="p-3 text-left border border-gray-300">Sipariş Tutarı</th>
                            <th className="p-3 text-left border border-gray-300">Kargo Ücreti</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white">
                            <td className="p-3 border border-gray-300">Tüm Siparişler</td>
                            <td className="p-3 border border-gray-300">Ağırlık bazlı (kg) hesaplanır</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="mb-4">
                <strong>Ağırlık Hesaplama:</strong> Kargo ücreti, ürünlerin toplam ağırlığına (kg) göre hesaplanır. Sepet sayfasında hesaplanan kargo ücreti görüntülenir.
            </p>

            <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">3. Teslimat Süresi</h2>
            <ul className="list-disc pl-5 mb-4 space-y-1">
                <li><strong>Büyükşehirler:</strong> 1-3 iş günü</li>
                <li><strong>Diğer İller:</strong> 2-5 iş günü</li>
                <li><strong>Aynı Gün Kargo:</strong> Saat 14:00'e kadar verilen siparişler aynı gün kargoya verilir</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r">
                <strong>⏰ Önemli:</strong> Resmi tatil günlerinde ve hafta sonlarında kargo çıkışı yapılmamaktadır. Bu günlerde verilen siparişler takip eden ilk iş gününde kargoya verilir.
            </div>

            <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">4. Kargo Firmaları</h2>
            <p className="mb-2">Siparişleriniz aşağıdaki anlaşmalı kargo firmalarından biriyle gönderilir:</p>
            <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Aras Kargo</li>
                <li>Yurtiçi Kargo</li>
                <li>MNG Kargo</li>
            </ul>

            <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">5. Kargo Takip</h2>
            <p className="mb-4">
                Siparişiniz kargoya verildiğinde, kayıtlı e-posta adresinize kargo takip numarası gönderilir. Ayrıca sipariş takip sayfamızdan da kargo durumunuzu takip edebilirsiniz.
            </p>

            <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">6. Teslimat Koşulları</h2>
            <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Teslimat, sipariş sırasında belirtilen adrese yapılır</li>
                <li>Teslimat sırasında kimlik gösterilmesi istenebilir</li>
                <li>Paket teslim alınırken hasar kontrolü yapılmalıdır</li>
                <li>Hasarlı paketler kargo görevlisinin tutanak tutması şartıyla teslim alınabilir</li>
            </ul>

            <h2 className="text-xl font-bold text-corporate-black mt-6 mb-3">7. Hasarlı Teslimat</h2>
            <p className="mb-2">Kargo tesliminde ürününüz hasarlı ise:</p>
            <ol className="list-decimal pl-5 mb-4 space-y-1">
                <li>Kargo görevlisine <strong>tutanak</strong> tutturun</li>
                <li>Hasarlı ürünün fotoğrafını çekin</li>
                <li>24 saat içinde <strong>bilgi@e-market.com</strong> adresine bildirimde bulunun</li>
            </ol>
        </div>
    );
};
