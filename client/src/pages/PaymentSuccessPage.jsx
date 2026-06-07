import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';
import { FeaturesSection } from '../components/FeaturesSection';

import { useTranslation } from 'react-i18next';

export function PaymentSuccessPage() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const orderNumber = searchParams.get('orderNumber');

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-400px)] flex flex-col justify-between">
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                        <CheckCircle size={40} className="text-[var(--color-secondary)]" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-4 text-[var(--color-secondary)]">{t('status.success')}</h1>
                <p className="text-[var(--color-neutral)] mb-8 text-lg">
                    {t('status.paymentSuccessful')} <br />
                    <span className="font-semibold text-[var(--color-secondary)]">{t('status.orderNumber')}: #{orderNumber}</span>
                </p>

                <div className="flex flex-col gap-4 justify-center items-center sm:flex-row">
                    {searchParams.get('trackingToken') && (
                        <button
                            onClick={() => navigate(`/siparis-takip?token=${searchParams.get('trackingToken')}`)}
                            className="btn btn-secondary px-8 py-3 w-full sm:w-auto"
                        >
                            {t('header.trackOrder')}
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/')}
                        className="btn btn-primary px-8 py-3 w-full sm:w-auto font-bold"
                    >
                        {t('cart.continueShopping')}
                    </button>
                </div>
            </div>
            <FeaturesSection />
        </div>
    );
}
