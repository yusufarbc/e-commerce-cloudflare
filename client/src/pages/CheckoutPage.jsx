import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import turkeyData from '../data/turkiye.json';
import { useTranslation } from 'react-i18next';
import { MapPin, CreditCard, CheckCircle, ChevronRight, Truck, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';
import { useSettings } from '../context/SettingsContext';
import { calculateShippingFee } from '../utils/shippingCalculator';
import { trackBeginCheckout } from '../utils/analytics';

// Step indicator component
function StepIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: 'Adres Bilgileri', icon: MapPin },
        { id: 2, label: 'Sipariş Özeti', icon: CreditCard },
        { id: 3, label: 'Ödeme', icon: CheckCircle },
    ];

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep >= step.id
                            ? 'bg-brand-primary border-indigo-600 text-corporate-black'
                            : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            <step.icon size={20} />
                        </div>
                        <span className={`ml-2 font-medium text-sm hidden sm:block ${currentStep >= step.id ? 'text-corporate-black' : 'text-gray-400'
                            }`}>
                            {step.label}
                        </span>
                        {index < steps.length - 1 && (
                            <div className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded transition-all duration-300 ${currentStep > step.id ? 'bg-brand-primary' : 'bg-gray-200'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CheckoutPage() {
    const { t } = useTranslation();
    const { cartItems, cartTotal, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        zipCode: '',
        isCorporate: false,
        companyName: '',
        taxOffice: '',
        taxNumber: ''
    });
    const [cardInfo, setCardInfo] = useState({
        cardHolderName: '',
        cardNumber: '',
        cardExpMonth: '',
        cardExpYear: '',
        cardCvc: ''
    });
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [errors, setErrors] = useState({});
    const [agreements, setAgreements] = useState({
        salesAgreement: false
    });
    const { settings, loading: settingsLoading } = useSettings();
    const [showModal, setShowModal] = useState(null);
    const [installments, setInstallments] = useState([]);
    const [selectedInstallment, setSelectedInstallment] = useState(1);
    const [installmentsLoading, setInstallmentsLoading] = useState(false);
    const [showTestCards, setShowTestCards] = useState(false);

    const isTestEnv = import.meta.env.DEV || 
                      window.location.hostname.includes('test') || 
                      window.location.hostname.includes('localhost') || 
                      window.location.hostname.includes('staging');

    const handleSelectTestCard = async (cardNumber) => {
        const formattedCardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber;
        setCardInfo({
            cardHolderName: 'TEST USER',
            cardNumber: formattedCardNumber,
            cardExpMonth: '12',
            cardExpYear: '28',
            cardCvc: '123'
        });
        setShowTestCards(false);

        // Fetch installments for the chosen test card
        const bin = cardNumber.replace(/\s/g, '').slice(0, 6);
        setInstallmentsLoading(true);
        try {
            const response = await api.get(`/api/v1/payment/param/installments?bin=${bin}&amount=${displayTotal}`);
            if (response.data.status === 'success' && response.data.installments) {
                setInstallments(response.data.installments);
            } else {
                setInstallments([]);
            }
        } catch (err) {
            console.error('Failed to fetch installments for test card:', err);
            setInstallments([]);
        } finally {
            setInstallmentsLoading(false);
        }
    };

    useEffect(() => {
        if (cartItems && cartItems.length > 0) {
            trackBeginCheckout(cartItems, cartTotal);
        }
    }, []);

    // Removed local useEffect for settings fetching

    const validateStep1 = () => {
        const newErrors = {};

        if (!formData.fullName || formData.fullName.length < 2) {
            newErrors.fullName = 'Ad Soyad en az 2 karakter olmalıdır.';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz.';
        }
        const rawPhone = formData.phone.replace(/\D/g, '');
        if (rawPhone.length < 11 || !rawPhone.startsWith('05')) {
            newErrors.phone = 'Telefon numarası eksik veya hatalı (05XX...)';
        }
        if (!formData.address || formData.address.length < 10) {
            newErrors.address = 'Adres en az 10 karakter olmalıdır.';
        }
        if (!formData.city) newErrors.city = 'İl seçiniz.';
        if (!formData.district) newErrors.district = 'İlçe seçiniz.';
        if (!formData.zipCode || formData.zipCode.length < 3) {
            newErrors.zipCode = 'Posta kodu giriniz.';
        }

        if (formData.isCorporate) {
            if (!formData.companyName) newErrors.companyName = 'Şirket ünvanı zorunludur.';
            if (!formData.taxOffice) newErrors.taxOffice = 'Vergi dairesi zorunludur.';
            if (!formData.taxNumber) newErrors.taxNumber = 'Vergi numarası zorunludur.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateStep2 = () => {
        const newErrors = {};
        if (!agreements.salesAgreement) {
            newErrors.salesAgreement = 'Lütfen satış sözleşmesini onaylayınız.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        if (value.length > 0 && value[0] !== '0') {
            value = '0' + value;
        }

        let formatted = value;
        if (value.length > 4) formatted = `${value.slice(0, 4)} ${value.slice(4)}`;
        if (value.length > 7) formatted = `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7)}`;
        if (value.length > 9) formatted = `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7, 9)} ${value.slice(9)}`;

        setFormData({ ...formData, phone: formatted });
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setFormData({ ...formData, city: selectedCity, district: '' });
        if (selectedCity && turkeyData[selectedCity]) {
            setDistricts(turkeyData[selectedCity]);
        } else {
            setDistricts([]);
        }
    };

    const handleCardChange = async (e) => {
        let { name, value } = e.target;

        if (name === 'cardNumber') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.match(/.{1,4}/g)?.join(' ') || value;

            // Fetch installments when 6+ digits entered
            const rawDigits = value.replace(/\s/g, '');
            if (rawDigits.length >= 6) {
                const bin = rawDigits.slice(0, 6);
                // Only fetch if BIN changed
                if (cardInfo.cardNumber.replace(/\s/g, '').slice(0, 6) !== bin) {
                    setInstallmentsLoading(true);
                    try {
                        const response = await api.get(`/api/v1/payment/param/installments?bin=${bin}&amount=${displayTotal}`);
                        if (response.data.status === 'success' && response.data.installments) {
                            setInstallments(response.data.installments);
                        } else {
                            setInstallments([]);
                        }
                    } catch (err) {
                        console.error('Failed to fetch installments:', err);
                        setInstallments([]);
                    } finally {
                        setInstallmentsLoading(false);
                    }
                }
            } else {
                setInstallments([]);
                setSelectedInstallment(1);
            }
        } else if (name === 'cardCvc') {
            value = value.replace(/\D/g, '').slice(0, 3);
        } else if (name === 'cardExpMonth' || name === 'cardExpYear') {
            value = value.replace(/\D/g, '').slice(0, 2);
        }

        setCardInfo({ ...cardInfo, [name]: value });
    };

    const validateStep3 = () => {
        const newErrors = {};
        if (currentStep === 3) { // Only validate if on payment step
            if (!cardInfo.cardHolderName) newErrors.cardHolderName = 'Kart sahibi adı zorunludur.';
            if (!cardInfo.cardNumber || cardInfo.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Geçerli bir kart numarası giriniz.';
            if (!cardInfo.cardExpMonth || Number(cardInfo.cardExpMonth) < 1 || Number(cardInfo.cardExpMonth) > 12) newErrors.cardExpMonth = 'Ay geçersiz.';
            if (!cardInfo.cardExpYear || cardInfo.cardExpYear.length < 2) newErrors.cardExpYear = 'Yıl geçersiz.';
            if (!cardInfo.cardCvc || cardInfo.cardCvc.length < 3) newErrors.cardCvc = 'CVV eksik.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async (e) => {
        // e is optional here as it might be called from button onClick without event or form submit
        if (e) e.preventDefault();

        // Block if weight error
        if (weightError) {
            alert('Sipariş ağırlığı kargo limitlerini aşıyor (100kg+). Lütfen satis@e-market.com ile iletişime geçiniz.');
            return;
        }

        if (!agreements.salesAgreement) {
            alert('Lütfen Ön Bilgilendirme Koşullarını ve Mesafeli Satış Sözleşmesini onaylayın.');
            return;
        }

        if (!validateStep3()) return;

        setLoading(true);

        try {
            // 1. Create Order
            const orderResponse = await api.post('/api/v1/orders/checkout', {
                items: cartItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.fiyat,
                    selectedColor: item.selectedColor || undefined
                })),
                guestInfo: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone.replace(/\s/g, ''),
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    zipCode: formData.zipCode
                },
                invoiceInfo: {
                    isCorporate: formData.isCorporate,
                    companyName: formData.companyName,
                    taxOffice: formData.taxOffice,
                    taxNumber: formData.taxNumber
                }
            });

            if (orderResponse.data.status !== 'pending_payment') {
                throw new Error(orderResponse.data.errorMessage || 'Sipariş oluşturulamadı.');
            }

            const { orderId } = orderResponse.data;

            // 2. Initiate Param Payment
            const paymentResponse = await api.post('/api/v1/payment/param/initiate', {
                orderId,
                cardInfo: {
                    cardNumber: cardInfo.cardNumber.replace(/\s/g, ''),
                    cardExpMonth: cardInfo.cardExpMonth,
                    cardExpYear: cardInfo.cardExpYear,
                    cardCvc: cardInfo.cardCvc,
                    cardHolderName: cardInfo.cardHolderName
                },
                buyerInfo: {
                    ip: '127.0.0.1' // Browser handles actual IP usually, or backend detects it
                }
            });

            if (paymentResponse.data.status === 'success' && paymentResponse.data.ucdHtml) {
                // Render Param 3D Secure Form
                document.open();
                document.write(paymentResponse.data.ucdHtml);
                document.close();
            } else {
                throw new Error(paymentResponse.data.errorMessage || 'Ödeme başlatılamadı.');
            }

        } catch (error) {
            console.error('Checkout error:', error.response ? error.response.data : error);
            alert('Ödeme hatası: ' + (error.response?.data?.errorMessage || error.message || 'Bilinmeyen hata.'));
        } finally {
            setLoading(false); // Keep loading false if error
        }
    };

    const handleLegalClick = (e, url) => {
        e.preventDefault();
        setShowModal(url);
    };

    // Shipping Calculation
    // Using calculateShippingFee from utils which now supports tiered weight logic
    const subTotal = cartItems.reduce((acc, item) => acc + (Number(item.fiyat) * item.quantity), 0);
    const totalWeight = cartItems.reduce((acc, item) => acc + (Number(item.agirlik || 1) * item.quantity), 0);

    // Note: Settings are fetched via hook useSettings in parent or context context/SettingsContext
    // Assuming 'settings' is available in scope (from useSettings hook)
    const { shippingFee, isFreeShipping, weightError } = calculateShippingFee({
        cartTotal: subTotal,
        totalWeight: totalWeight,
        settings: settings || {}
    });

    // If weight error, displayTotal is subTotal (shipping handled separately or blocked)
    const displayTotal = subTotal + (shippingFee || 0);

    if (cartItems.length === 0) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-16 text-center">
                <CreditCard size={64} className="mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Sepetiniz Boş</h2>
                <p className="text-gray-500 mb-6">Ödeme yapabilmek için sepetinize ürün ekleyin.</p>
                <a href="/" className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors">
                    <ArrowLeft size={18} />
                    Alışverişe Devam Et
                </a>
            </div>
        );
    }

    return (
        <div className="bg-bg-soft min-h-screen relative">
            <div className="py-8 max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-corporate-black mb-2">Güvenli Ödeme</h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Lock size={14} />
                        <span>256-bit SSL ile korunan güvenli ödeme</span>
                    </div>
                </div>

                <StepIndicator currentStep={currentStep} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

                            {/* Step 1: Address Info */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-corporate-black flex items-center gap-2">
                                        <MapPin size={24} className="text-indigo-600" />
                                        Teslimat Bilgileri
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad *</label>
                                            <input
                                                type="text" name="fullName" value={formData.fullName}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta *</label>
                                            <input
                                                type="email" name="email" value={formData.email}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon *</label>
                                            <input
                                                type="tel" name="phone" value={formData.phone}
                                                placeholder="05XX XXX XX XX"
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handlePhoneChange}
                                            />
                                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Adres *</label>
                                            <textarea
                                                name="address" value={formData.address} rows={3}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">İl *</label>
                                            <select
                                                name="city" value={formData.city}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleCityChange}
                                            >
                                                <option value="">İl Seçiniz</option>
                                                {Object.keys(turkeyData).sort().map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">İlçe *</label>
                                            <select
                                                name="district" value={formData.district}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.district ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                                disabled={!formData.city}
                                            >
                                                <option value="">İlçe Seçiniz</option>
                                                {districts.map(dist => (
                                                    <option key={dist} value={dist}>{dist}</option>
                                                ))}
                                            </select>
                                            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu *</label>
                                            <input
                                                type="text" name="zipCode" value={formData.zipCode}
                                                className={`w-full border-2 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.zipCode ? 'border-red-500' : 'border-gray-200'}`}
                                                onChange={handleInputChange}
                                            />
                                            {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                                        </div>
                                    </div>

                                    {/* Corporate Invoice */}
                                    <div className="border-t pt-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isCorporate}
                                                onChange={(e) => setFormData({ ...formData, isCorporate: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="font-medium">Kurumsal Fatura İstiyorum</span>
                                        </label>

                                        {formData.isCorporate && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-xl">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Ünvanı *</label>
                                                    <input
                                                        type="text" name="companyName" value={formData.companyName}
                                                        className={`w-full border-2 p-3 rounded-xl ${errors.companyName ? 'border-red-500' : 'border-gray-200'}`}
                                                        onChange={handleInputChange}
                                                    />
                                                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Dairesi *</label>
                                                    <input
                                                        type="text" name="taxOffice" value={formData.taxOffice}
                                                        className={`w-full border-2 p-3 rounded-xl ${errors.taxOffice ? 'border-red-500' : 'border-gray-200'}`}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vergi No *</label>
                                                    <input
                                                        type="text" name="taxNumber" value={formData.taxNumber}
                                                        className={`w-full border-2 p-3 rounded-xl ${errors.taxNumber ? 'border-red-500' : 'border-gray-200'}`}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Order Summary & Agreements */}
                            {currentStep === 2 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h2 className="text-xl font-bold text-corporate-black flex items-center gap-2">
                                        <CreditCard size={24} className="text-indigo-600" />
                                        Sipariş Onayı
                                    </h2>

                                    {/* Delivery Address Summary */}
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Teslimat Adresi</h3>
                                                <p className="font-medium">{formData.fullName}</p>
                                                <p className="text-gray-600 text-sm">{formData.address}</p>
                                                <p className="text-gray-600 text-sm">{formData.district} / {formData.city} - {formData.zipCode}</p>
                                                <p className="text-gray-600 text-sm">{formData.phone}</p>
                                            </div>
                                            <button onClick={prevStep} className="text-sm text-action-red font-medium hover:underline">
                                                Düzenle
                                            </button>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-3">Sepetinizdeki Ürünler</h3>
                                        <div className="space-y-3">
                                            {cartItems.map(item => (
                                                <div key={item.cartKey || item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.resimUrl ? (
                                                            <img src={item.resimUrl} alt={item.ad} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">{item.ad}</p>
                                                        <p className="text-gray-500 text-xs">Adet: {item.quantity}</p>
                                                        {item.selectedColor && (
                                                            <p className="text-gray-500 text-xs">{item.varyantBasligi || 'Renk'}: {item.selectedColor}</p>
                                                        )}
                                                    </div>
                                                    <p className="font-bold text-sm">
                                                        ₺{(Number(item.indirimliFiyat || item.fiyat) * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Agreements */}
                                    <div className="border-t pt-6 space-y-4">
                                        <p className="text-sm text-gray-600">
                                            Sipariş vererek{' '}
                                            <button onClick={(e) => handleLegalClick(e, '/legal/kvkk.html')} className="text-action-red font-medium hover:underline">
                                                KVKK Aydınlatma Metni
                                            </button>'ni okuduğunuzu ve verilerinizin işlenmesini kabul etmiş sayılırsınız.
                                        </p>

                                        <label className={`flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${agreements.salesAgreement ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                            } ${errors.salesAgreement ? 'border-red-500' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={agreements.salesAgreement}
                                                onChange={(e) => {
                                                    setAgreements({ ...agreements, salesAgreement: e.target.checked });
                                                    if (e.target.checked && errors.salesAgreement) {
                                                        setErrors({ ...errors, salesAgreement: null });
                                                    }
                                                }}
                                                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm">
                                                <button onClick={(e) => handleLegalClick(e, '/legal/on-bilgilendirme.html')} className="text-action-red font-medium hover:underline">
                                                    Ön Bilgilendirme Formu
                                                </button> ve{' '}
                                                <button onClick={(e) => handleLegalClick(e, '/legal/mesafeli-satis.html')} className="text-action-red font-medium hover:underline">
                                                    Mesafeli Satış Sözleşmesi
                                                </button>'ni okudum ve onaylıyorum. *
                                            </span>
                                        </label>
                                        {errors.salesAgreement && <p className="text-red-500 text-xs">{errors.salesAgreement}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment Info */}
                            {currentStep === 3 && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-corporate-black flex items-center gap-2">
                                            <CreditCard size={24} className="text-indigo-600" />
                                            Ödeme Bilgileri
                                        </h2>
                                        {isTestEnv && (
                                            <button 
                                                type="button"
                                                onClick={() => setShowTestCards(true)}
                                                className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors"
                                            >
                                                🧪 Test Kartları
                                            </button>
                                        )}
                                    </div>

                                    {loading ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                            <h2 className="text-xl font-bold text-corporate-black mb-2">Ödeme Başlatılıyor...</h2>
                                            <p className="text-gray-500">Lütfen bekleyin, banka ekranına yönlendiriliyorsunuz.</p>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-200">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                                                <input
                                                    type="text"
                                                    name="cardHolderName"
                                                    value={cardInfo.cardHolderName}
                                                    onChange={handleCardChange}
                                                    placeholder="Ad Soyad"
                                                    className={`w-full border-2 p-3 rounded-xl uppercase ${errors.cardHolderName ? 'border-red-500' : 'border-gray-200'}`}
                                                />
                                                {errors.cardHolderName && <p className="text-red-500 text-xs mt-1">{errors.cardHolderName}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        value={cardInfo.cardNumber}
                                                        onChange={handleCardChange}
                                                        placeholder="0000 0000 0000 0000"
                                                        className={`w-full border-2 p-3 rounded-xl pl-10 ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'}`}
                                                        maxLength={19}
                                                    />
                                                    <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={20} />
                                                </div>
                                                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
                                                    <div className="flex gap-1.5 items-center">
                                                        <input
                                                            type="text"
                                                            name="cardExpMonth"
                                                            value={cardInfo.cardExpMonth}
                                                            onChange={handleCardChange}
                                                            placeholder="AA"
                                                            className={`w-full border-2 p-2.5 md:p-3 rounded-xl text-center ${errors.cardExpMonth ? 'border-red-500' : 'border-gray-200'}`}
                                                            maxLength={2}
                                                        />
                                                        <span className="text-xl text-gray-400 flex-shrink-0">/</span>
                                                        <input
                                                            type="text"
                                                            name="cardExpYear"
                                                            value={cardInfo.cardExpYear}
                                                            onChange={handleCardChange}
                                                            placeholder="YY"
                                                            className={`w-full border-2 p-2.5 md:p-3 rounded-xl text-center ${errors.cardExpYear ? 'border-red-500' : 'border-gray-200'}`}
                                                            maxLength={2}
                                                        />
                                                    </div>
                                                    {(errors.cardExpMonth || errors.cardExpYear) && (
                                                        <p className="text-red-500 text-xs mt-1">Geçerli bir tarih giriniz</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV / CVC</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="cardCvc"
                                                            value={cardInfo.cardCvc}
                                                            onChange={handleCardChange}
                                                            placeholder="000"
                                                            className={`w-full border-2 p-2.5 md:p-3 rounded-xl pl-10 ${errors.cardCvc ? 'border-red-500' : 'border-gray-200'}`}
                                                            maxLength={3}
                                                        />
                                                        <Lock className="absolute left-3 top-2.5 md:top-3.5 text-gray-400" size={18} />
                                                    </div>
                                                    {errors.cardCvc && <p className="text-red-500 text-xs mt-1">{errors.cardCvc}</p>}
                                                </div>
                                            </div>

                                            {/* Installment Selection */}
                                            {cardInfo.cardNumber.replace(/\s/g, '').length >= 6 && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Taksit Seçenekleri</label>
                                                    {installmentsLoading ? (
                                                        <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-xl text-sm text-gray-500">
                                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                            Taksit seçenekleri yükleniyor...
                                                        </div>
                                                    ) : installments.length > 0 ? (
                                                        <select
                                                            value={selectedInstallment}
                                                            onChange={(e) => setSelectedInstallment(Number(e.target.value))}
                                                            className="w-full border-2 p-3 rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        >
                                                            <option value={1}>Tek Çekim - ₺{displayTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</option>
                                                            {installments.map((inst, idx) => (
                                                                <option key={idx} value={inst.taksit || inst.Taksit}>
                                                                    {inst.taksit || inst.Taksit} Taksit - Aylık ₺{(displayTotal / (inst.taksit || inst.Taksit)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
                                                            Bu kart için sadece tek çekim seçeneği mevcuttur.
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-700 mt-4">
                                                <Lock className="flex-shrink-0 mt-0.5" size={16} />
                                                <p>Ödeme bilgileriniz 256-bit SSL sertifikası ile korunmaktadır. Kart bilgileriniz sistemimizde saklanmaz.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            {currentStep < 3 && (
                                <div className="flex justify-between mt-8 pt-6 border-t">
                                    {currentStep > 1 ? (
                                        <button
                                            onClick={prevStep}
                                            className="flex items-center gap-2 px-6 py-3 text-gray-600 font-medium hover:text-corporate-black transition-colors"
                                        >
                                            <ArrowLeft size={18} />
                                            Geri
                                        </button>
                                    ) : (
                                        <div />
                                    )}

                                    <button
                                        onClick={nextStep}
                                        disabled={loading}
                                        className="flex items-center gap-2 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {currentStep === 2 ? 'Ödemeye Geç' : 'Devam Et'}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}

                            {/* Payment Button (Step 3) */}
                            {currentStep === 3 && (
                                <div className="mt-8 pt-6 border-t space-y-4">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || weightError}
                                        className="w-full bg-action-red text-white px-8 py-4 rounded-xl font-black text-lg hover:bg-red-700 transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Ödeme İşleniyor...
                                            </span>
                                        ) : (
                                            `₺${displayTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} Öde`
                                        )}
                                    </button>
                                    <button
                                        onClick={prevStep}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-600 font-medium hover:text-corporate-black transition-colors disabled:opacity-50"
                                    >
                                        <ArrowLeft size={18} />
                                        Geri Dön
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-32">
                            <h3 className="font-bold text-lg mb-4">Sipariş Özeti</h3>

                            {/* Cart Items Mini */}
                            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
                                {cartItems.map(item => (
                                    <div key={item.cartKey || item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600 truncate mr-2">
                                            {item.ad} x{item.quantity}
                                            {item.selectedColor ? ` (${item.selectedColor})` : ''}
                                        </span>
                                        <span className="font-medium flex-shrink-0">
                                            ₺{(Number(item.indirimliFiyat || item.fiyat) * item.quantity).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Ara Toplam</span>
                                    <span>₺{cartTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Kargo</span>
                                    {weightError ? (
                                        <div className="text-right">
                                            <span className="block text-action-red font-bold text-sm">Limit Aşıldı</span>
                                            <a href="mailto:satis@e-market.com" className="text-xs underline text-blue-600">
                                                satis@e-market.com
                                            </a>
                                        </div>
                                    ) : (
                                        <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                                            {shippingFee === 0 ? 'Ücretsiz' : `₺${shippingFee.toFixed(2)}`}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Toplam</span>
                                    <span className="text-action-red">₺{displayTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                {weightError && (
                                    <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs">
                                        Bu sipariş kargo limitlerini aşmaktadır (100kg+). Lütfen toplu alım için iletişime geçiniz.
                                    </div>
                                )}
                            </div>



                            {/* Trust Badges */}
                            <div className="mt-6 pt-4 border-t space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <ShieldCheck size={18} className="text-green-600" />
                                    <span>Güvenli Ödeme</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Truck size={18} className="text-blue-600" />
                                    <span>Hızlı Teslimat</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FeaturesSection />

            {/* Legal Modal */}
            {
                showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col animate-in zoom-in duration-300">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="text-lg font-bold">Sözleşme Metni</h3>
                                <button onClick={() => setShowModal(null)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-2xl text-gray-500">
                                    ×
                                </button>
                            </div>
                            <div className="flex-1 p-4 overflow-hidden">
                                <iframe src={showModal} className="w-full h-full border-0 rounded-xl" title="Legal Document" />
                            </div>
                            <div className="p-4 border-t flex justify-end">
                                <button onClick={() => setShowModal(null)} className="bg-corporate-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800">
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Test Cards Modal */}
            {showTestCards && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-5 border-b flex items-center justify-between">
                            <h3 className="text-lg font-extrabold text-corporate-black flex items-center gap-2">
                                🧪 iyzico / Param Test Kartları
                            </h3>
                            <button 
                                onClick={() => setShowTestCards(false)}
                                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-xl text-gray-500 transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        {/* Body */}
                        <div className="p-6 overflow-y-auto space-y-5 text-sm">
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Test ortamında ödeme senaryolarını test etmek için aşağıdaki kartlardan birine tıklayarak ödeme formunu otomatik doldurabilirsiniz.
                            </p>
                            
                            <div>
                                <h4 className="font-bold text-green-600 mb-2 flex items-center gap-1">✓ Başarılı Ödeme Kartları</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { num: '5526080000000006', bank: 'Akbank (Kredi Kartı)' },
                                        { num: '5890040000000016', bank: 'Akbank (Banka Kartı)' },
                                        { num: '4543590000000006', bank: 'İş Bankası (Kredi Kartı)' },
                                        { num: '6501700194147183', bank: 'Vakıfbank (Troy Kredi)' },
                                        { num: '5451030000000000', bank: 'Yapı Kredi (Kredi Kartı)' }
                                    ].map(card => (
                                        <button
                                            key={card.num}
                                            type="button"
                                            onClick={() => handleSelectTestCard(card.num)}
                                            className="flex items-center justify-between p-3 bg-green-50/40 hover:bg-green-50 border border-green-200 rounded-xl transition-all text-left font-semibold text-xs text-corporate-black hover:border-green-400"
                                        >
                                            <span>{card.bank}</span>
                                            <span className="font-mono text-indigo-600">{card.num.match(/.{1,4}/g).join(' ')}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-red-600 mb-2 flex items-center gap-1">✗ Hata Simülasyon Kartları</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {[
                                        { num: '4111111111111129', err: 'Yetersiz Bakiye (Not sufficient funds)' },
                                        { num: '4125111111111115', err: 'Süresi Geçmiş Kart (Expired card)' },
                                        { num: '4124111111111116', err: 'Geçersiz CVC (Invalid CVC)' },
                                        { num: '4151111111111112', err: '3D Secure Başlatma Hatası' }
                                    ].map(card => (
                                        <button
                                            key={card.num}
                                            type="button"
                                            onClick={() => handleSelectTestCard(card.num)}
                                            className="flex items-center justify-between p-3 bg-red-50/20 hover:bg-red-50/50 border border-red-100 rounded-xl transition-all text-left font-semibold text-xs text-corporate-black hover:border-red-300"
                                        >
                                            <span className="truncate max-w-[220px]" title={card.err}>{card.err}</span>
                                            <span className="font-mono text-gray-600">{card.num.match(/.{1,4}/g).join(' ')}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
