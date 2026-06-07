import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailurePage } from './pages/PaymentFailurePage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { AboutPage } from './pages/AboutPage';
import { LegalPage } from './pages/LegalPage';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { CartSidebar } from './components/CartSidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { SettingsProvider } from './context/SettingsContext';

import { Shop } from './pages/Shop';
import { WhatsAppButton } from './components/WhatsAppButton';

function App() {
    return (
        <ErrorBoundary>
            <HelmetProvider>
                <BrowserRouter>
                    <ScrollToTop />
                    <SettingsProvider>
                        <ToastProvider>
                            <CartProvider>
                                <div className="min-h-screen bg-white flex flex-col">
                                    <Header />
                                    <main className="pt-20 md:pt-48 flex-1 min-h-0">
                                        <Routes>
                                            <Route path="/" element={<HomePage />} />
                                            <Route path="/magaza" element={<Shop />} />
                                            <Route path="/product/:id" element={<ProductDetailPage />} />
                                            <Route path="/urun/:slug" element={<ProductDetailPage />} />
                                            <Route path="/checkout" element={<CheckoutPage />} />
                                            <Route path="/siparis-takip" element={<OrderTrackingPage />} />
                                            <Route path="/odeme" element={<CheckoutPage />} />
                                            <Route path="/payment/success" element={<PaymentSuccessPage />} />
                                            <Route path="/payment/failure" element={<PaymentFailurePage />} />
                                            <Route path="/iletisim" element={<ContactPage />} />
                                            <Route path="/sss" element={<FAQPage />} />
                                            <Route path="/hakkimizda" element={<AboutPage />} />

                                            {/* Legal & Info Pages */}
                                            <Route path="/iade-degisim" element={<LegalPage title="İade ve Değişim" contentKey="iade-degisim" />} />
                                            <Route path="/kargo-bilgileri" element={<LegalPage title="Kargo Bilgileri" contentKey="kargo-bilgileri" />} />
                                            <Route path="/mesafeli-satis-sozlesmesi" element={<LegalPage title="Mesafeli Satış Sözleşmesi" contentKey="mesafeli-satis-sozlesmesi" />} />
                                            <Route path="/on-bilgilendirme" element={<LegalPage title="Ön Bilgilendirme Formu" contentKey="on-bilgilendirme" />} />
                                            <Route path="/gizlilik-ve-kvkk" element={<LegalPage title="Gizlilik Politikası ve KVKK Aydınlatma Metni" contentKey="gizlilik-ve-kvkk" />} />


                                        </Routes>
                                    </main>
                                    <Footer />
                                    <WhatsAppButton />
                                    <CartSidebar />
                                </div>
                            </CartProvider>
                        </ToastProvider>
                    </SettingsProvider>
                </BrowserRouter>
            </HelmetProvider>
        </ErrorBoundary>
    );
}

export default App;

