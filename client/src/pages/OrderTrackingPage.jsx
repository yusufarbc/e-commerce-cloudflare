import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/axios';
import { CheckCircle, Clock, Package, AlertCircle, Phone, XCircle } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';

import { useTranslation } from 'react-i18next';

export function OrderTrackingPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [returnType, setReturnType] = useState("KUSURLU_URUN");
    const [returnReason, setReturnReason] = useState("");

    const submitReturnRequest = async () => {
        try {
            setLoading(true);
            await api.post(`/api/v1/returns/request`, {
                token,
                iadeTipi: returnType,
                sebepAciklamasi: returnReason
            });
            alert('İade talebiniz alındı! Değerlendirildikten sonra size dönüş yapılacaktır.');
            setIsReturnModalOpen(false);
            // Refresh
            const response = await api.get(`/api/v1/orders/track?token=${token}`);
            if (response.data.status === 'success') setOrder(response.data.data);
        } catch (err) {
            alert(err.response?.data?.errorMessage || 'Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token) {
                setError('Takip kodu bulunamadı.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/v1/orders/track?token=${token}`);
                if (response.data.status === 'success') {
                    setOrder(response.data.data);
                } else {
                    setError('Sipariş bulunamadı.');
                }
            } catch (err) {
                setError('Sipariş bilgileri alınırken bir hata oluştu veya takip kodu geçersiz.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [token]);

    const handleCancelClick = () => {
        setIsCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        try {
            setLoading(true);
            await api.post(`/api/v1/orders/cancel`, { token, reason: cancelReason });
            // Refresh order
            const response = await api.get(`/api/v1/orders/track?token=${token}`);
            if (response.data.status === 'success') {
                setOrder(response.data.data);
                setIsCancelModalOpen(false);
                setCancelReason("");
            }
        } catch (err) {
            alert(err.response?.data?.errorMessage || t('orders.cancelError'));
        } finally {
            setLoading(false);
        }
    };

    const whatsappLink = order ? `https://wa.me/908500000000?text=Merhaba, Sipariş No: ${order.siparisNumarasi} hakkında destek almak istiyorum.` : '#';

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <a href="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                        {t('status.backToHome')}
                    </a>
                </div>
            );
        }

        return (
            <div className="max-w-3xl mx-auto px-4 py-10 relative">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">{t('header.trackOrder')}</h1>
                                <p className="text-primary-100 mt-1">Sipariş No: #{order.siparisNumarasi}</p>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm flex gap-2">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white hover:text-green-200 transition" title={t('orders.whatsappSupport')}>
                                    <Phone size={20} />
                                </a>
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="p-6 border-b bg-gray-50">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">{t('orders.status')}:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.durum === 'TAMAMLANDI' ? 'bg-green-100 text-green-700' :
                                order.iadeTalebi ? 'bg-orange-100 text-orange-700' :
                                    order.durum === 'BEKLEMEDE' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {order.iadeTalebi ? (
                                    <>
                                        <span className="block sm:inline">{order.iadeTalebi.durum.replace(/_/g, ' ')}</span>
                                    </>
                                ) : (
                                    order.durum === 'TAMAMLANDI' ? 'Tamamlandı' :
                                        order.durum === 'HAZIRLANIYOR' ? 'Hazırlanıyor' :
                                            order.durum === 'KARGOLANDI' ? 'Kargoya Verildi' :
                                                order.durum === 'TESLIM_EDILDI' ? 'Teslim Edildi' :
                                                    order.durum === 'IPTAL_EDILDI' ? 'İptal Edildi' :
                                                        order.durum === 'BEKLEMEDE' ? 'Ödeme Bekleniyor' : order.durum
                                )}
                            </span>

                            {(order.durum === 'BEKLEMEDE' || order.durum === 'HAZIRLANIYOR') && (
                                <button
                                    onClick={handleCancelClick}
                                    className="ml-auto sm:ml-4 flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition"
                                >
                                    <XCircle size={14} /> {t('orders.cancelOrder')}
                                </button>
                            )}

                            {order.durum === 'TESLIM_EDILDI' && !order.iadeTalebi && (
                                <button
                                    onClick={() => setIsReturnModalOpen(true)}
                                    className="ml-auto sm:ml-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition"
                                >
                                    <Package size={14} /> İade Talep Et
                                </button>
                            )}

                            {order.iadeTalebi && (
                                <div className="ml-auto sm:ml-4 flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                                    <span className="text-sm font-semibold">İade Durumu: {order.iadeTalebi.durum.replace('_', ' ')}</span>
                                    {order.iadeTalebi.manuelIadeKodu && (
                                        <span className="font-bold ml-2">Kod: {order.iadeTalebi.manuelIadeKodu} - {order.iadeTalebi.kargoFirmasi}</span>
                                    )}
                                </div>
                            )}

                            {(['KARGOLANDI', 'TESLIM_EDILDI', 'TAMAMLANDI'].includes(order.durum)) && (
                                <div className="ml-auto sm:ml-4 flex items-center gap-1 text-gray-500 text-xs sm:text-sm bg-gray-100 px-3 py-1 rounded-full border border-gray-200" title="Sipariş kargoya verildiği için bu aşamada iptal edilemez. Lütfen bizimle iletişime geçin.">
                                    <AlertCircle size={14} />
                                    <span className="hidden sm:inline">Kargolandığı için iptal edilemez</span>
                                    <span className="sm:hidden">İptal Edilemez</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Sipariş Detayları</h2>

                        <div className="space-y-4">
                            {(order.kalemler || []).map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-2 rounded text-gray-400">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.urunAd}</p>
                                            <p className="text-sm text-gray-500">{item.adet} Adet x ₺{Number(item.birimFiyat).toFixed(2)}</p>
                                            {item.secilenRenk && (
                                                <p className="text-xs text-gray-500">{item.urun?.varyantBasligi || 'Renk'}: {item.secilenRenk}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-800">₺{(Number(item.birimFiyat) * item.adet).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 border-t pt-4 space-y-2">
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Ara Toplam</span>
                                <span>₺{(Number(order.toplamTutar) - Number(order.kargoUcreti)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-600">
                                <span>Kargo Ücreti</span>
                                <span>₺{Number(order.kargoUcreti || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t pt-2 mt-2">
                                <span>Toplam Tutar</span>
                                <span>₺{Number(order.toplamTutar).toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-8 bg-primary-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-primary-900 mb-2">Teslimat Adresi</h3>
                            <p className="text-primary-800">{order.teslimatAdresi?.ilce || ''}, {order.teslimatAdresi?.sehir || ''}</p>
                            <p className="text-sm text-primary-600 mt-1">* Güvenlik nedeniyle tam adres gizlenmiştir.</p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 text-center border-t">
                        <a href="/" className="text-primary-600 hover:text-primary-800 font-medium hover:underline">
                            {t('cart.continueShopping')}
                        </a>
                    </div>
                </div>

                {/* Cancel Order Modal */}
                {isCancelModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                        {t('orders.cancelOrder')}
                                    </h3>
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-500 transition-colors"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-orange-800">
                                            İade / İptal Kısıtlaması
                                        </p>
                                        <p className="text-xs text-orange-700 mt-1">
                                            Siparişiniz özel yapım veya iade edilemeyen ürün(ler) içeriyor olabilir (Örn: Özel renk karıştırılmış boyalar). İptal talebiniz onaylanırken bu ürünler değerlendirmeye alınacaktır.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 font-medium">
                                    {t('orders.cancelConfirm')}
                                </p>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('orders.cancelReason')} (İsteğe bağlı)
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px] resize-none text-sm"
                                        placeholder="Lütfen iptal nedeninizi kısaca belirtin..."
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                    >
                                        Vazgeç
                                    </button>
                                    <button
                                        onClick={confirmCancel}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                                    >
                                        Siparişi İptal Et
                                    </button>
                                </div>
                            </div>
                            <div className="bg-red-50 p-4 border-t border-red-100 flex items-center gap-2 text-sm text-red-700">
                                <span className='font-semibold'>⚠️ Dikkat:</span> Bu işlem geri alınamaz.
                            </div>
                        </div>
                    </div>
                )}
                {/* Return Request Modal */}
                {isReturnModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">İade Talebi Oluştur</h3>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">İade Nedeni</label>
                                    <select
                                        className="w-full border rounded-lg p-2"
                                        value={returnType}
                                        onChange={(e) => setReturnType(e.target.value)}
                                    >
                                        <option value="KUSURLU_URUN">Kusurlu / Hasarlı Ürün</option>
                                        <option value="KEYFI_IADE">Keyfi İade / Vazgeçtim</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Detaylı Açıklama</label>
                                    <textarea
                                        className="w-full border rounded-lg p-2 min-h-[100px]"
                                        placeholder="Lütfen iade sebebinizi detaylandırın..."
                                        value={returnReason}
                                        onChange={(e) => setReturnReason(e.target.value)}
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fotoğraf (Opsiyonel)</label>
                                    <p className="text-xs text-gray-500 mb-2">Hasarlı ürün fotoğraflarını Whatsapp hattımızdan veya bilgi@e-market.com adresinden sipariş numaranızla iletmeniz süreci hızlandıracaktır.</p>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsReturnModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Vazgeç
                                    </button>
                                    <button
                                        onClick={submitReturnRequest}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Talebi Gönder
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-0 flex flex-col justify-between">
            {renderContent()}
            <FeaturesSection />
        </div>
    );
};


