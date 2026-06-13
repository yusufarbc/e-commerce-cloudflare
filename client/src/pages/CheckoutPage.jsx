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
    );
}
