import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SEO from '../components/SEO';
import { useState } from 'react';

const faqs = [
    {
        category: "Sipariş ve Teslimat",
        questions: [
            {
                q: "Siparişimi ne zaman teslim alırım?",
                a: "Siparişleriniz saat 14:00'e kadar verildiğinde aynı gün kargoya teslim edilir. Büyükşehirlere 1-3 iş günü, diğer illere 2-5 iş günü içinde teslimat yapılmaktadır."
            },
            {
                q: "Kargo ücreti ne kadardır?",
                a: "Kargo ücreti ürünlerin toplam ağırlığına (kg) göre hesaplanır ve sepet sayfasında gösterilir. Tüm siparişlerde kargo ücreti alıcıya aittir."
            },
            {
                q: "Siparişimi nasıl takip edebilirim?",
                a: "Siparişiniz kargoya verildiğinde e-posta adresinize kargo takip numarası gönderilir. Ayrıca 'Sipariş Takip' sayfamızdan sipariş numaranız veya e-posta adresiniz ile siparişinizi takip edebilirsiniz."
            },
            {
                q: "Yurtdışına teslimat yapıyor musunuz?",
                a: "Hayır, şu anda sadece Türkiye içi teslimat yapmaktayız. Yurtdışı satışımız bulunmamaktadır."
            }
        ]
    },
    {
        category: "Ödeme",
        questions: [
            {
                q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
                a: "Visa, Mastercard, Troy kartları ile güvenli online ödeme yapabilirsiniz. Ödeme işlemleri Param POS altyapısı ile güvenle gerçekleştirilmektedir."
            },
            {
                q: "3D Secure ile ödeme yapmam gerekli mi?",
                a: "Evet, güvenliğiniz için tüm online ödemeler 3D Secure doğrulama ile yapılmaktadır."
            },
            {
                q: "Taksit yapabilir miyim?",
                a: "Kredi kartınıza ve siparişinizin tutarına bağlı olarak taksit imkanı sunulmaktadır. Taksit seçenekleri ödeme sayfasında görüntülenir."
            }
        ]
    },
    {
        category: "İade ve Değişim",
        questions: [
            {
                q: "İade hakkım ne kadar sürelidir?",
                a: "Tüketicinin Korunması Hakkında Kanun gereğince, ürünü teslim aldığınız tarihten itibaren 14 gün içinde iade hakkınızı kullanabilirsiniz."
            },
            {
                q: "İade işlemi nasıl yapılır?",
                a: "İade talebinizi bilgi@e-market.com adresine e-posta ile bildirin. Talebiniz onaylandıktan sonra iade kargo kodunuzu alacaksınız. Ürünü orijinal ambalajında, kullanılmamış ve hasarsız olarak kargolayın."
            },
            {
                q: "İade kargo ücreti kime aittir?",
                a: "Cayma hakkı kapsamında iade edilecek ürünlerin kargo ücreti alıcıya aittir. Kusurlu veya yanlış gönderilen ürünlerde kargo ücreti firmamız tarafından karşılanır."
            },
            {
                q: "Param iadem ne zaman yapılır?",
                a: "Ürün tarafımıza ulaştıktan sonra 10 iş günü içinde ödemeniz iade edilir. İade, ödeme yaptığınız yöntem ile yapılır (kredi kartı, banka kartı)."
            }
        ]
    },
    {
        category: "Ürünler ve Stok",
        questions: [
            {
                q: "Ürünlerim orijinal mi?",
                a: "Tüm ürünlerimiz yetkili distribütörlerden temin edilmekte olup %100 orijinaldir. Garanti belgeli ürünlerimiz mevcuttur."
            },
            {
                q: "Stokta olmayan ürünü sipariş edebilir miyim?",
                a: "Stokta olmayan ürünler için bilgi@e-market.com adresinden bizimle iletişime geçebilirsiniz. Ürünün tedarik edilebilirliğini kontrol edip size dönüş yaparız."
            },
            {
                q: "Toplu sipariş için indirim var mı?",
                a: "Toplu alımlarınız için özel fiyat teklifleri sunuyoruz. Detaylı bilgi için bilgi@e-market.com adresinden bize ulaşabilirsiniz."
            }
        ]
    },
    {
        category: "Güvenlik",
        questions: [
            {
                q: "Alışveriş yapmak için üye olmam gerekli mi?",
                a: "Sistemimizde üyelik sistemi bulunmamaktadır. Tüm alışverişlerinizi güvenli bir şekilde misafir kullanıcı olarak gerçekleştirebilirsiniz. Sipariş takibini sipariş numarası ve e-posta adresine gelen sipariş takip linki ile takip yapabilirsiniz."
            },
            {
                q: "Kişisel bilgilerim güvende mi?",
                a: "Tüm kişisel bilgileriniz SSL sertifikası ile şifrelenmektedir. KVKK kapsamında verileriniz korunmakta ve üçüncü şahıslarla paylaşılmamaktadır."
            }
        ]
    }
];

function FAQItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
                <span className="font-semibold text-corporate-black">{question}</span>
                {isOpen ? (
                    <ChevronUp size={20} className="text-indigo-600 flex-shrink-0" />
                ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}

export function FAQPage() {
    return (
        <div className="bg-bg-soft min-h-screen py-10">
            <SEO
                title="Sıkça Sorulan Sorular"
                description="E-Market hakkında merak ettikleriniz. Sipariş, teslimat, ödeme, iade ile ilgili tüm sorularınızın yanıtları."
                keywords="e-market sss, sipariş takibi, iade, kargo, ödeme"
            />

            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">Sıkça Sorulan Sorular</h1>
                    <div className="w-24 h-1 bg-brand-primary mx-auto rounded-full" />
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                        Merak ettiklerinizin yanıtlarını burada bulabilirsiniz. Aradığınız cevabı bulamadıysanız bizimle iletişime geçin.
                    </p>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-12">
                    {faqs.map((category, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-bold text-corporate-black mb-6 pb-3 border-b-4 border-indigo-600 inline-block">
                                {category.category}
                            </h2>
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                {category.questions.map((faq, qIdx) => (
                                    <FAQItem key={qIdx} question={faq.q} answer={faq.a} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 p-8 bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 rounded-xl border-2 border-indigo-600">
                    <h3 className="text-2xl font-bold text-corporate-black mb-3">Sorunuzu bulamadınız mı?</h3>
                    <p className="text-gray-600 mb-6">
                        Size yardımcı olmaktan mutluluk duyarız. Müşteri hizmetlerimiz ile iletişime geçin.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        {/* İletişim Formu butonu kaldırıldı */}
                        <a
                            href="https://wa.me/908500000000?text=Merhaba, bir sorum var"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-all hover:scale-105"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            WhatsApp İletişim
                        </a>
                        <a
                            href="mailto:bilgi@e-market.com"
                            className="inline-flex items-center gap-2 bg-corporate-black text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all hover:scale-105"
                        >
                            E-posta Gönder
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
