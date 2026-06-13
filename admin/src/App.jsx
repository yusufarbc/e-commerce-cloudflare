import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Tag, 
  ShoppingBag, 
  CornerDownLeft, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  TrendingUp, 
  ShoppingBag as OrdersIcon, 
  Eye, 
  X,
  Lock,
  Sun,
  Moon
} from 'lucide-react';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8787';
  }
  if (hostname.includes('test') || hostname.includes('staging')) {
    return 'https://e-commerce-cloudflare-staging.yusuftalhaarabaci-91d.workers.dev';
  }
  return 'https://e-commerce-cloudflare.yusuftalhaarabaci-91d.workers.dev';
};

const API_URL = getApiUrl();
const config = { cdnUrl: '' };

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('admin_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  // Data States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [settings, setSettings] = useState({
    kargoAgirlikCarpani: 15.00,
    ucretsizKargoAltLimit: 5000.00,
    maintenanceMode: false
  });
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeProducts: 0,
    pendingReturns: 0
  });

  // Loading States
  const [loading, setLoading] = useState(false);

  // Modals & Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    ad: '', fiyat: '', indirimliFiyat: '', renkSecenekleri: [],
    kartelaIcCephe: false, kartelaDisCephe: false, agirlik: 1,
    aciklama: '', resimUrl: '', stokAdedi: 0, varyantBasligi: '',
    kategoriId: '', markaId: '', aktif: true, oneCikan: false,
    firsatUrunu: false, yeniUrun: false, cokSatanlar: false
  });
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ ad: '', resim: '', sira: 0, aktif: true });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandForm, setBrandForm] = useState({ ad: '', logoUrl: '', sira: 0, aktif: true });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusForm, setOrderStatusForm] = useState({
    durum: '', kargoTakipNo: '', kargoFirmasi: '', faturaNo: '', faturaDurumu: 'DUZENLENMEDI', adminNotu: ''
  });

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [returnStatusForm, setReturnStatusForm] = useState({ durum: 'ONAYLANDI', adminNotu: '', manuelIadeKodu: '' });

  const calculateStats = (ords, prods, rets) => {
    const totalSales = ords
      .filter(o => o.durum === 'TESLIM_EDILDI' || o.durum === 'TAMAMLANDI')
      .reduce((sum, o) => sum + parseFloat(o.toplamTutar || 0), 0);
    const activeProducts = prods.filter(p => p.aktif).length;
    const pendingReturns = rets.filter(r => r.durum === 'ONAY_BEKLENIYOR').length;

    setStats({
      totalSales,
      totalOrders: ords.length,
      activeProducts,
      pendingReturns
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [prodRes, catRes, brandRes, orderRes, returnRes, settingsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/admin/products`, { headers }),
        fetch(`${API_URL}/api/v1/admin/categories`, { headers }),
        fetch(`${API_URL}/api/v1/admin/brands`, { headers }),
        fetch(`${API_URL}/api/v1/admin/orders`, { headers }),
        fetch(`${API_URL}/api/v1/admin/returns`, { headers }),
        fetch(`${API_URL}/api/v1/admin/settings`, { headers })
      ]);

      const prods = await prodRes.json();
      const cats = await catRes.json();
      const brandsData = await brandRes.json();
      const ords = await orderRes.json();
      const rets = await returnRes.json();
      const setts = await settingsRes.json();

      if (prods.status === 'success') setProducts(prods.data);
      if (cats.status === 'success') setCategories(cats.data);
      if (brandsData.status === 'success') setBrands(brandsData.data);
      if (ords.status === 'success') {
        setOrders(ords.data);
        calculateStats(ords.data, prods.data || [], rets.data || []);
      }
      if (rets.status === 'success') setReturns(rets.data);
      if (setts.status === 'success') setSettings(setts.data);

    } catch (e) {
      console.error('Veri yükleme hatası:', e);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all dashboard data when token is present
  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.status === 'success') {
        localStorage.setItem('admin_token', data.token);
        setToken(data.token);
      } else {
        setLoginError(data.errorMessage || 'Giriş başarısız!');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Sunucu bağlantı hatası!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken('');
    setActiveTab('dashboard');
  };

  // Client-Side Canvas WebP Resizer & Direct R2 Upload
  const handleImageResizeAndUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      // Cover crop calculations
      const scale = Math.max(800 / img.width, 800 / img.height);
      const x = (800 - img.width * scale) / 2;
      const y = (800 - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      canvas.toBlob(async (blob) => {
        const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
        const formData = new FormData();
        formData.append('file', webpFile);

        try {
          const res = await fetch(`${API_URL}/api/v1/admin/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });
          const data = await res.json();
          if (data.status === 'success') {
            if (type === 'product') setProductForm(prev => ({ ...prev, resimUrl: data.key }));
            if (type === 'category') setCategoryForm(prev => ({ ...prev, resim: data.key }));
            if (type === 'brand') setBrandForm(prev => ({ ...prev, logoUrl: data.key }));
          } else {
            alert('Görsel yüklenemedi: ' + data.errorMessage);
          }
        } catch (err) {
          console.error(err);
          alert('Görsel sunucuya yüklenirken bağlantı hatası oluştu!');
        } finally {
          setLoading(false);
        }
      }, 'image/webp', 0.85);
    };
  };

  // Product CRUD
  const saveProduct = async (e) => {
    e.preventDefault();
    const url = editingProduct 
      ? `${API_URL}/api/v1/admin/products/${editingProduct.id}` 
      : `${API_URL}/api/v1/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setShowProductModal(false);
        setEditingProduct(null);
        fetchData();
      } else {
        alert('Kaydetme hatası: ' + data.errorMessage);
      }
    } catch (err) {
      console.error(err);
      alert('İstek gönderilirken hata oluştu.');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Silme hatası.');
    }
  };

  // Category CRUD
  const saveCategory = async (e) => {
    e.preventDefault();
    const url = editingCategory 
      ? `${API_URL}/api/v1/admin/categories/${editingCategory.id}` 
      : `${API_URL}/api/v1/admin/categories`;
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(categoryForm)
      });
      if ((await res.json()).status === 'success') {
        setShowCategoryModal(false);
        setEditingCategory(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Kategori kaydedilemedi.');
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm('Kategoriyi silmek istediğinizden emin misiniz?')) return;
    try {
      await fetch(`${API_URL}/api/v1/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Kategori silinemedi.');
    }
  };

  // Brand CRUD
  const saveBrand = async (e) => {
    e.preventDefault();
    const url = editingBrand 
      ? `${API_URL}/api/v1/admin/brands/${editingBrand.id}` 
      : `${API_URL}/api/v1/admin/brands`;
    const method = editingBrand ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(brandForm)
      });
      if ((await res.json()).status === 'success') {
        setShowBrandModal(false);
        setEditingBrand(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Marka kaydedilemedi.');
    }
  };

  const deleteBrand = async (id) => {
    if (!confirm('Markayı silmek istediğinizden emin misiniz?')) return;
    try {
      await fetch(`${API_URL}/api/v1/admin/brands/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Marka silinemedi.');
    }
  };

  // Order Detail & Update
  const viewOrder = async (order) => {
    setSelectedOrder(order);
    setOrderStatusForm({
      durum: order.durum,
      kargoTakipNo: order.kargoTakipNo || '',
      kargoFirmasi: order.kargoFirmasi || '',
      faturaNo: order.faturaNo || '',
      faturaDurumu: order.faturaDurumu || 'DUZENLENMEDI',
      adminNotu: ''
    });
    setShowOrderModal(true);
  };

  const saveOrderStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderStatusForm)
      });
      if ((await res.json()).status === 'success') {
        setShowOrderModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Sipariş güncellenemedi.');
    }
  };

  // Return Detail & Update
  const viewReturn = (ret) => {
    setSelectedReturn(ret);
    setReturnStatusForm({
      durum: 'ONAYLANDI',
      adminNotu: ret.adminNotu || '',
      manuelIadeKodu: ret.manuelIadeKodu || ''
    });
    setShowReturnModal(true);
  };

  const saveReturnStatus = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/returns/${selectedReturn.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(returnStatusForm)
      });
      if ((await res.json()).status === 'success') {
        setShowReturnModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('İade talebi güncellenemedi.');
    }
  };

  // Settings Save
  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if ((await res.json()).status === 'success') {
        alert('Sistem ayarları başarıyla güncellendi.');
        fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Ayarlar kaydedilemedi.');
    }
  };

  // Login View
  if (!token) {
    return (
      <div className="login-container">
        <button 
          onClick={toggleTheme}
          className="btn btn-secondary" 
          style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
        </button>
        <div className="card login-card">
          <div className="login-header">
            <div className="login-logo">E</div>
            <h2>E-Market Yönetim Paneli</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '8px' }}>
              Sunucusuz altyapı ile güvenli yönetim
            </p>
          </div>
          {loginError && (
            <div style={{ background: 'var(--status-error-bg)', color: 'var(--status-error)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', textAlign: 'center', fontWeight: 600 }}>
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">E-Posta Adresi</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="admin@e-market.com" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Şifre</label>
              <input 
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginTop: '10px' }}>
              <Lock size={16} /> Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Main View
  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">E</div>
          <span className="sidebar-title">E-Market Admin</span>
        </div>
        <nav className="nav-menu">
          <li className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('dashboard')}>
              <LayoutDashboard size={18} /> Kontrol Paneli
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('products')}>
              <Package size={18} /> Ürün Yönetimi
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('categories')}>
              <Layers size={18} /> Kategoriler
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'brands' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('brands')}>
              <Tag size={18} /> Markalar
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('orders')}>
              <ShoppingBag size={18} /> Siparişler
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'returns' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('returns')}>
              <CornerDownLeft size={18} /> İade Talepleri
            </button>
          </li>
          <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <button onClick={() => setActiveTab('settings')}>
              <SettingsIcon size={18} /> Sistem Ayarları
            </button>
          </li>
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-secondary" onClick={toggleTheme} style={{ width: '100%', gap: '8px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}</span>
          </button>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ width: '100%', gap: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={16} /> Oturumu Kapat
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        {loading && (
          <div style={{ position: 'fixed', top: 20, right: 20, background: 'var(--color-primary)', color: '#000', padding: '10px 20px', borderRadius: '30px', fontWeight: 'bold', fontSize: '13px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '12px', height: '12px', border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
            İşlem Yapılıyor...
          </div>
        )}

        {/* Tab 1: Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="content-header">
              <h1 className="content-title">Genel Durum</h1>
            </div>
            
            <div className="dashboard-grid">
              <div className="card">
                <div className="kpi-title">Toplam Ciro</div>
                <div className="kpi-value">₺{stats.totalSales.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                <div className="kpi-trend up"><TrendingUp size={14} /> Teslim Edilen Siparişler</div>
              </div>
              <div className="card">
                <div className="kpi-title">Toplam Sipariş</div>
                <div className="kpi-value">{stats.totalOrders}</div>
                <div className="kpi-trend"><OrdersIcon size={14} /> Toplam Alışveriş</div>
              </div>
              <div className="card">
                <div className="kpi-title">Aktif Ürün Sayısı</div>
                <div className="kpi-value">{stats.activeProducts}</div>
                <div className="kpi-trend"><Package size={14} /> Satıştaki Benzersiz Ürün</div>
              </div>
              <div className="card">
                <div className="kpi-title">Bekleyen İade Talebi</div>
                <div className="kpi-value">{stats.pendingReturns}</div>
                <div className="kpi-trend down"><CornerDownLeft size={14} /> Onay Bekleyen İadeler</div>
              </div>
            </div>

            <div className="card">
              <h2 className="mb-4">Son Siparişler</h2>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sipariş No</th>
                      <th>Müşteri</th>
                      <th>Tarih</th>
                      <th>Tutar</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 'bold' }}>#{order.siparisNumarasi}</td>
                        <td>{order.ad} {order.soyad}</td>
                        <td>{new Date(order.olusturulmaTarihi).toLocaleDateString('tr-TR')}</td>
                        <td>₺{order.toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                        <td>
                          <span className={`badge badge-${order.durum === 'BEKLEMEDE' ? 'pending' : order.durum === 'TESLIM_EDILDI' || order.durum === 'TAMAMLANDI' ? 'success' : order.durum === 'KARGOLANDI' ? 'shipped' : 'error'}`}>
                            {order.durum}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewOrder(order)}>
                            <Eye size={12} /> Detay
                          </button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ textAlignment: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          Kayıtlı sipariş bulunmamaktadır.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeTab === 'products' && (
          <div>
            <div className="content-header">
              <h1 className="content-title">Ürün Kataloğu</h1>
              <button className="btn btn-primary" onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  ad: '', fiyat: '', indirimliFiyat: '', renkSecenekleri: [],
                  kartelaIcCephe: false, kartelaDisCephe: false, agirlik: 1,
                  aciklama: '', resimUrl: '', stokAdedi: 0, varyantBasligi: '',
                  kategoriId: categories[0]?.id || '', markaId: brands[0]?.id || '', aktif: true, oneCikan: false,
                  firsatUrunu: false, yeniUrun: false, cokSatanlar: false
                });
                setShowProductModal(true);
              }}>
                <Plus size={16} /> Yeni Ürün Ekle
              </button>
            </div>

            <div className="card">
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Görsel</th>
                      <th>Ürün Adı</th>
                      <th>Marka</th>
                      <th>Kategori</th>
                      <th>Fiyat</th>
                      <th>Stok</th>
                      <th>Durum</th>
                      <th style={{ width: '120px' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(prod => {
                      const imageCdnUrl = prod.resimUrl && !prod.resimUrl.startsWith('http') 
                        ? `${settings.cdnUrl || config.cdnUrl}/${prod.resimUrl}` 
                        : prod.resimUrl;
                      
                      return (
                        <tr key={prod.id}>
                          <td>
                            <img 
                              src={imageCdnUrl || 'https://via.placeholder.com/50x50?text=Yok'} 
                              alt="" 
                              style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', padding: '2px' }}
                            />
                          </td>
                          <td style={{ fontWeight: '600' }}>{prod.ad}</td>
                          <td>{prod.marka?.ad || '-'}</td>
                          <td>{prod.kategori?.ad || '-'}</td>
                          <td>
                            {prod.indirimliFiyat ? (
                              <div>
                                <span style={{ textDecoration: 'line-through', color: 'var(--color-text-dimmed)', fontSize: '12px', marginRight: '6px' }}>₺{prod.fiyat}</span>
                                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>₺{prod.indirimliFiyat}</span>
                              </div>
                            ) : (
                              <span>₺{prod.fiyat}</span>
                            )}
                          </td>
                          <td>{prod.stokAdedi}</td>
                          <td>
                            <span className={`badge ${prod.aktif ? 'badge-success' : 'badge-error'}`}>
                              {prod.aktif ? 'Aktif' : 'Gizli'}
                            </span>
                          </td>
                          <td>
                            <div className="flex-gap">
                              <button className="btn btn-secondary btn-sm" onClick={() => {
                                setEditingProduct(prod);
                                setProductForm({
                                  ad: prod.ad, fiyat: prod.fiyat, indirimliFiyat: prod.indirimliFiyat || '',
                                  renkSecenekleri: prod.renkSecenekleri || [],
                                  kartelaIcCephe: prod.kartelaIcCephe, kartelaDisCephe: prod.kartelaDisCephe,
                                  agirlik: prod.agirlik, aciklama: prod.aciklama || '', resimUrl: prod.resimUrl || '',
                                  stokAdedi: prod.stokAdedi, varyantBasligi: prod.varyantBasligi || '',
                                  kategoriId: prod.kategoriId || '', markaId: prod.markaId || '',
                                  aktif: prod.aktif, oneCikan: prod.oneCikan, firsatUrunu: prod.firsatUrunu,
                                  yeniUrun: prod.yeniUrun, cokSatanlar: prod.cokSatanlar
                                });
                                setShowProductModal(true);
                              }}>
                                <Edit2 size={12} />
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(prod.id)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Categories */}
        {activeTab === 'categories' && (
          <div>
            <div className="content-header">
              <h1 className="content-title">Kategoriler</h1>
              <button className="btn btn-primary" onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ ad: '', resim: '', sira: 0, aktif: true });
                setShowCategoryModal(true);
              }}>
                <Plus size={16} /> Yeni Kategori Ekle
              </button>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sıra</th>
                      <th>Kategori Adı</th>
                      <th>Durum</th>
                      <th style={{ width: '120px' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id}>
                        <td>{cat.sira}</td>
                        <td style={{ fontWeight: '600' }}>{cat.ad}</td>
                        <td>
                          <span className={`badge ${cat.aktif ? 'badge-success' : 'badge-error'}`}>
                            {cat.aktif ? 'Aktif' : 'Gizli'}
                          </span>
                        </td>
                        <td>
                          <div className="flex-gap">
                            <button className="btn btn-secondary btn-sm" onClick={() => {
                              setEditingCategory(cat);
                              setCategoryForm({ ad: cat.ad, resim: cat.resim || '', sira: cat.sira, aktif: cat.aktif });
                              setShowCategoryModal(true);
                            }}>
                              <Edit2 size={12} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(cat.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Brands */}
        {activeTab === 'brands' && (
          <div>
            <div className="content-header">
              <h1 className="content-title">Markalar</h1>
              <button className="btn btn-primary" onClick={() => {
                setEditingBrand(null);
                setBrandForm({ ad: '', logoUrl: '', sira: 0, aktif: true });
                setShowBrandModal(true);
              }}>
                <Plus size={16} /> Yeni Marka Ekle
              </button>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sıra</th>
                      <th>Marka Adı</th>
                      <th>Durum</th>
                      <th style={{ width: '120px' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map(brand => (
                      <tr key={brand.id}>
                        <td>{brand.sira}</td>
                        <td style={{ fontWeight: '600' }}>{brand.ad}</td>
                        <td>
                          <span className={`badge ${brand.aktif ? 'badge-success' : 'badge-error'}`}>
                            {brand.aktif ? 'Aktif' : 'Gizli'}
                          </span>
                        </td>
                        <td>
                          <div className="flex-gap">
                            <button className="btn btn-secondary btn-sm" onClick={() => {
                              setEditingBrand(brand);
                              setBrandForm({ ad: brand.ad, logoUrl: brand.logoUrl || '', sira: brand.sira, aktif: brand.aktif });
                              setShowBrandModal(true);
                            }}>
                              <Edit2 size={12} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteBrand(brand.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Orders */}
        {activeTab === 'orders' && (
          <div>
            <div className="content-header">
              <h1 className="content-title">Sipariş Yönetimi</h1>
            </div>

            <div className="card">
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Sipariş No</th>
                      <th>Müşteri</th>
                      <th>Tarih</th>
                      <th>Tutar</th>
                      <th>Kargo</th>
                      <th>Fatura</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 'bold' }}>#{order.siparisNumarasi}</td>
                        <td>{order.ad} {order.soyad}</td>
                        <td>{new Date(order.olusturulmaTarihi).toLocaleDateString('tr-TR')}</td>
                        <td>₺{order.toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                        <td>{order.kargoFirmasi || '-'}</td>
                        <td>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: order.faturaDurumu === 'ODENDI' ? 'var(--status-success)' : 'var(--color-text-dimmed)' }}>
                            {order.faturaDurumu}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${order.durum === 'BEKLEMEDE' ? 'pending' : order.durum === 'TESLIM_EDILDI' || order.durum === 'TAMAMLANDI' ? 'success' : order.durum === 'KARGOLANDI' ? 'shipped' : 'error'}`}>
                            {order.durum}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewOrder(order)}>
                            <Eye size={12} /> İncele
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Returns */}
        {activeTab === 'returns' && (
          <div>
            <div className="content-header">
              <h1 className="content-title">İade Talepleri</h1>
            </div>

            <div className="card">
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Sipariş No</th>
                      <th>Müşteri</th>
                      <th>İade Tipi</th>
                      <th>Açıklama</th>
                      <th>Durum</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returns.map(ret => (
                      <tr key={ret.id}>
                        <td>{new Date(ret.olusturulmaTarihi).toLocaleDateString('tr-TR')}</td>
                        <td style={{ fontWeight: 'bold' }}>#{ret.siparis?.siparisNumarasi || '-'}</td>
                        <td>{ret.siparis?.ad} {ret.siparis?.soyad}</td>
                        <td style={{ fontSize: '12px', fontWeight: 'bold' }}>{ret.talepTipi}</td>
                        <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ret.aciklama}
                        </td>
                        <td>
                          <span className={`badge badge-${ret.durum === 'ONAY_BEKLENIYOR' ? 'pending' : ret.durum === 'ONAYLANDI' ? 'success' : 'error'}`}>
                            {ret.durum}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => viewReturn(ret)}>
                            <Eye size={12} /> Detay
                          </button>
                        </td>
                      </tr>
                    ))}
                    {returns.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                          Kayıtlı iade talebi bulunmamaktadır.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Settings */}
        {activeTab === 'settings' && (
          <div>
            <div className="content-header">
              <h1 className="content-title">Sistem Ayarları</h1>
            </div>

            <div className="card" style={{ maxWidth: '600px' }}>
              <form onSubmit={saveSettings}>
                <div className="form-group">
                  <label className="form-label">Kargo Ağırlık/Desi Çarpanı (₺)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={settings.kargoAgirlikCarpani}
                    onChange={e => setSettings({ ...settings, kargoAgirlikCarpani: parseFloat(e.target.value) })}
                    required
                  />
                  <small style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    Desi fiyatlandırması hesaplanırken kullanılacak standart çarpan değeri.
                  </small>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Ücretsiz Kargo Alt Limiti (₺)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={settings.ucretsizKargoAltLimit || 0}
                    onChange={e => setSettings({ ...settings, ucretsizKargoAltLimit: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Kademeli Kargo Fiyat Listesi (JSON Format)</label>
                  <textarea 
                    className="form-control" 
                    style={{ minHeight: '120px', fontFamily: 'monospace' }}
                    value={typeof settings.kargoFiyatListesi === 'object' ? JSON.stringify(settings.kargoFiyatListesi, null, 2) : settings.kargoFiyatListesi || '[]'}
                    onChange={e => setSettings({ ...settings, kargoFiyatListesi: e.target.value })}
                  />
                  <small style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                    Örn: [{`{"maxWeight": 1, "price": 50}`}]
                  </small>
                </div>

                <div className="form-group" style={{ margin: '30px 0' }}>
                  <label className="form-check">
                    <input 
                      type="checkbox" 
                      checked={settings.maintenanceMode}
                      onChange={e => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                    <span><strong>Bakım Modu (Sitenin tamamını bakıma al)</strong></span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  Ayarları Kaydet
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowProductModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveProduct} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div className="modal-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Ürün Adı *</label>
                    <input 
                      type="text" className="form-control" value={productForm.ad}
                      onChange={e => setProductForm({ ...productForm, ad: e.target.value })} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stok Adedi *</label>
                    <input 
                      type="number" className="form-control" value={productForm.stokAdedi}
                      onChange={e => setProductForm({ ...productForm, stokAdedi: parseInt(e.target.value, 10) })} required
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Fiyat (₺) *</label>
                    <input 
                      type="number" step="0.01" className="form-control" value={productForm.fiyat}
                      onChange={e => setProductForm({ ...productForm, fiyat: e.target.value })} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">İndirimli Fiyat (₺)</label>
                    <input 
                      type="number" step="0.01" className="form-control" value={productForm.indirimliFiyat}
                      onChange={e => setProductForm({ ...productForm, indirimliFiyat: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Kategori *</label>
                    <select 
                      className="form-control" value={productForm.kategoriId}
                      onChange={e => setProductForm({ ...productForm, kategoriId: e.target.value })} required
                    >
                      <option value="">Seçiniz</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.ad}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Marka *</label>
                    <select 
                      className="form-control" value={productForm.markaId}
                      onChange={e => setProductForm({ ...productForm, markaId: e.target.value })} required
                    >
                      <option value="">Seçiniz</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.ad}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Ağırlık (Kg/Desi) *</label>
                    <input 
                      type="number" step="0.1" className="form-control" value={productForm.agirlik}
                      onChange={e => setProductForm({ ...productForm, agirlik: parseFloat(e.target.value) })} required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Varyant Başlığı</label>
                    <input 
                      type="text" className="form-control" placeholder="Örn: Renk Seçimi" value={productForm.varyantBasligi}
                      onChange={e => setProductForm({ ...productForm, varyantBasligi: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ürün Görseli (R2 Yükleyici - WebP Sıkıştırma)</label>
                  <div className="image-upload-box">
                    <input 
                      type="file" accept="image/*" style={{ display: 'none' }} id="prod-img"
                      onChange={e => handleImageResizeAndUpload(e, 'product')}
                    />
                    <label htmlFor="prod-img" style={{ cursor: 'pointer', display: 'block' }}>
                      <Upload size={32} style={{ color: 'var(--color-primary)', marginBottom: '8px' }} />
                      <p style={{ fontWeight: 'bold', fontSize: '13px' }}>Görsel Seçmek İçin Tıklayın</p>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '4px' }}>
                        Seçilen görsel otomatik olarak 800x800 WebP formatına dönüştürülecektir.
                      </p>
                    </label>
                  </div>
                  {productForm.resimUrl && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={productForm.resimUrl.startsWith('http') ? productForm.resimUrl : `${settings.cdnUrl || config.cdnUrl}/${productForm.resimUrl}`} 
                        alt="Önizleme" className="image-preview" 
                      />
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>{productForm.resimUrl}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Varyant Seçenekleri (Virgül veya yeni satır ile ayırın)</label>
                  <textarea 
                    className="form-control" 
                    placeholder="Gri, Mavi, Sarı"
                    value={Array.isArray(productForm.renkSecenekleri) ? productForm.renkSecenekleri.join(', ') : ''}
                    onChange={e => setProductForm({ ...productForm, renkSecenekleri: e.target.value.split(/[,\n]/).map(s => s.trim()).filter(Boolean) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ürün Açıklaması</label>
                  <textarea 
                    className="form-control" value={productForm.aciklama}
                    onChange={e => setProductForm({ ...productForm, aciklama: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                  <label className="form-check">
                    <input type="checkbox" checked={productForm.aktif} onChange={e => setProductForm({ ...productForm, aktif: e.target.checked })} />
                    <span>Ürün Satışta (Aktif)</span>
                  </label>
                  <label className="form-check">
                    <input type="checkbox" checked={productForm.oneCikan} onChange={e => setProductForm({ ...productForm, oneCikan: e.target.checked })} />
                    <span>Öne Çıkan Ürün</span>
                  </label>
                  <label className="form-check">
                    <input type="checkbox" checked={productForm.firsatUrunu} onChange={e => setProductForm({ ...productForm, firsatUrunu: e.target.checked })} />
                    <span>Fırsat Ürünü</span>
                  </label>
                  <label className="form-check">
                    <input type="checkbox" checked={productForm.yeniUrun} onChange={e => setProductForm({ ...productForm, yeniUrun: e.target.checked })} />
                    <span>Yeni Ürün</span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowCategoryModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Kategori Adı *</label>
                  <input 
                    type="text" className="form-control" value={categoryForm.ad}
                    onChange={e => setCategoryForm({ ...categoryForm, ad: e.target.value })} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Görüntüleme Sırası</label>
                  <input 
                    type="number" className="form-control" value={categoryForm.sira}
                    onChange={e => setCategoryForm({ ...categoryForm, sira: parseInt(e.target.value, 10) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Kategori Resmi</label>
                  <input 
                    type="file" accept="image/*" onChange={e => handleImageResizeAndUpload(e, 'category')}
                  />
                  {categoryForm.resim && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={categoryForm.resim.startsWith('http') ? categoryForm.resim : `${settings.cdnUrl || config.cdnUrl}/${categoryForm.resim}`} 
                        alt="" className="image-preview" 
                      />
                    </div>
                  )}
                </div>
                <label className="form-check" style={{ marginTop: '15px' }}>
                  <input type="checkbox" checked={categoryForm.aktif} onChange={e => setCategoryForm({ ...categoryForm, aktif: e.target.checked })} />
                  <span>Kategori Aktif</span>
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Create/Edit Modal */}
      {showBrandModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{editingBrand ? 'Markayı Düzenle' : 'Yeni Marka Ekle'}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowBrandModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveBrand}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Marka Adı *</label>
                  <input 
                    type="text" className="form-control" value={brandForm.ad}
                    onChange={e => setBrandForm({ ...brandForm, ad: e.target.value })} required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Görüntüleme Sırası</label>
                  <input 
                    type="number" className="form-control" value={brandForm.sira}
                    onChange={e => setBrandForm({ ...brandForm, sira: parseInt(e.target.value, 10) })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Marka Logosu</label>
                  <input 
                    type="file" accept="image/*" onChange={e => handleImageResizeAndUpload(e, 'brand')}
                  />
                  {brandForm.logoUrl && (
                    <div style={{ marginTop: '10px' }}>
                      <img 
                        src={brandForm.logoUrl.startsWith('http') ? brandForm.logoUrl : `${settings.cdnUrl || config.cdnUrl}/${brandForm.logoUrl}`} 
                        alt="" className="image-preview" 
                      />
                    </div>
                  )}
                </div>
                <label className="form-check" style={{ marginTop: '15px' }}>
                  <input type="checkbox" checked={brandForm.aktif} onChange={e => setBrandForm({ ...brandForm, aktif: e.target.checked })} />
                  <span>Marka Aktif</span>
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBrandModal(false)}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>Sipariş Detayı - #{selectedOrder.siparisNumarasi}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowOrderModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveOrderStatus}>
              <div className="modal-body" style={{ fontSize: '13px' }}>
                <div className="grid-2 mb-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)' }}>Müşteri Bilgileri</p>
                    <p style={{ fontWeight: 'bold', fontSize: '15px', marginTop: '4px' }}>{selectedOrder.ad} {selectedOrder.soyad}</p>
                    <p>{selectedOrder.eposta}</p>
                    <p>{selectedOrder.telefon}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-text-muted)' }}>Teslimat Adresi</p>
                    <p style={{ marginTop: '4px' }}>{selectedOrder.adres}</p>
                    <p>{selectedOrder.ilce} / {selectedOrder.sehir} - {selectedOrder.postaKodu}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Sipariş Kalemleri</p>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '10px' }}>
                    {selectedOrder.kalemler?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
                        <div>
                          <span>{item.urunAdSnapshot || item.urun?.ad || '-'}</span>
                          {item.secilenRenk && <span style={{ color: 'var(--color-primary)', marginLeft: '8px', fontSize: '11px' }}>({item.secilenRenk})</span>}
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                          {item.adet} adet x ₺{item.urunFiyatSnapshot.toFixed(2)}
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontWeight: 'bold', fontSize: '14px' }}>
                      <span>Toplam Tutar:</span>
                      <span style={{ color: 'var(--color-primary)' }}>₺{selectedOrder.toplamTutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-4">Sipariş Yönetimi</h4>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Sipariş Durumu</label>
                      <select 
                        className="form-control" value={orderStatusForm.durum}
                        onChange={e => setOrderStatusForm({ ...orderStatusForm, durum: e.target.value })}
                      >
                        <option value="BEKLEMEDE">BEKLEMEDE</option>
                        <option value="HAZIRLANIYOR">HAZIRLANIYOR</option>
                        <option value="KARGOLANDI">KARGOLANDI</option>
                        <option value="TESLIM_EDILDI">TESLIM_EDILDI</option>
                        <option value="TAMAMLANDI">TAMAMLANDI</option>
                        <option value="IPTAL_EDILDI">IPTAL_EDILDI</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Kargo Firması</label>
                      <input 
                        type="text" className="form-control" placeholder="Örn: Yurtici" value={orderStatusForm.kargoFirmasi}
                        onChange={e => setOrderStatusForm({ ...orderStatusForm, kargoFirmasi: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Kargo Takip No</label>
                      <input 
                        type="text" className="form-control" value={orderStatusForm.kargoTakipNo}
                        onChange={e => setOrderStatusForm({ ...orderStatusForm, kargoTakipNo: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fatura No</label>
                      <input 
                        type="text" className="form-control" value={orderStatusForm.faturaNo}
                        onChange={e => setOrderStatusForm({ ...orderStatusForm, faturaNo: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Güncelleme Notu (Müşteri ve geçmişe eklenecek)</label>
                    <input 
                      type="text" className="form-control" placeholder="Sipariş hazırlanmaya başlandı." value={orderStatusForm.adminNotu}
                      onChange={e => setOrderStatusForm({ ...orderStatusForm, adminNotu: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderModal(false)}>Kapat</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Detail Modal */}
      {showReturnModal && selectedReturn && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>İade Talebi İnceleme - #{selectedReturn.siparis?.siparisNumarasi}</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReturnModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={saveReturnStatus}>
              <div className="modal-body" style={{ fontSize: '13px' }}>
                <div className="mb-4">
                  <p style={{ color: 'var(--color-text-muted)' }}>Müşteri Açıklaması:</p>
                  <p style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-glass)', marginTop: '6px', fontSize: '14px', fontStyle: 'italic' }}>
                    "{selectedReturn.aciklama}"
                  </p>
                </div>

                <div className="mb-4">
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>Yüklenen Fotoğraflar:</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {Array.isArray(selectedReturn.fotografUrls) && selectedReturn.fotografUrls.map((url, i) => {
                      const finalUrl = url.startsWith('http') ? url : `${settings.cdnUrl || config.cdnUrl}/${url}`;
                      return (
                        <a key={i} href={finalUrl} target="_blank" rel="noreferrer">
                          <img src={finalUrl} alt="Kanıt" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-glass)' }} />
                        </a>
                      );
                    })}
                    {(!Array.isArray(selectedReturn.fotografUrls) || selectedReturn.fotografUrls.length === 0) && (
                      <span style={{ color: 'var(--color-text-dimmed)' }}>Görsel yüklenmemiş.</span>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-4">Talebi Karara Bağla</h4>
                  <div className="form-group">
                    <label className="form-label">Karar Durumu</label>
                    <select 
                      className="form-control" value={returnStatusForm.durum}
                      onChange={e => setReturnStatusForm({ ...returnStatusForm, durum: e.target.value })}
                    >
                      <option value="ONAYLANDI">ONAYLA (Ödeme iade edilecek)</option>
                      <option value="REDDEDILDI">REDDET (Talebi geri çevir)</option>
                      <option value="MUSTERI_GONDERIMI_BEKLENIYOR">Müşteri Gönderimi Bekleniyor</option>
                      <option value="IADE_TAMAMLANDI">İade İşlemi Tamamlandı</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">İade Kargo Kodu (Varsa)</label>
                    <input 
                      type="text" className="form-control" placeholder="Örn: 928374827" value={returnStatusForm.manuelIadeKodu}
                      onChange={e => setReturnStatusForm({ ...returnStatusForm, manuelIadeKodu: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Yönetici İnceleme Notu</label>
                    <textarea 
                      className="form-control" value={returnStatusForm.adminNotu}
                      onChange={e => setReturnStatusForm({ ...returnStatusForm, adminNotu: e.target.value })}
                      placeholder="İade talebiniz incelenerek onaylanmıştır..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>Kapat</button>
                <button type="submit" className="btn btn-primary">Değerlendir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
