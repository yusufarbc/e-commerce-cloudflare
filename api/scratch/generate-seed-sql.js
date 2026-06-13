import fs from 'fs';
import { randomUUID } from 'crypto';

const categories = [
  { id: randomUUID(), ad: 'Elektronik', slug: 'elektronik', sira: 1 },
  { id: randomUUID(), ad: 'Giyim & Aksesuar', slug: 'giyim-aksesuar', sira: 2 },
  { id: randomUUID(), ad: 'Ev & Yaşam', slug: 'ev-yasam', sira: 3 },
  { id: randomUUID(), ad: 'Spor & Outdoor', slug: 'spor-outdoor', sira: 4 }
];

const brands = [
  { id: randomUUID(), ad: 'TechBrand', slug: 'techbrand', sira: 1 },
  { id: randomUUID(), ad: 'StyleCo', slug: 'styleco', sira: 2 },
  { id: randomUUID(), ad: 'HomeDecor', slug: 'homedecor', sira: 3 },
  { id: randomUUID(), ad: 'FitLife', slug: 'fitlife', sira: 4 }
];

const categoryMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));
const brandMap = Object.fromEntries(brands.map(b => [b.slug, b.id]));

const products = [
  {
    id: randomUUID(),
    ad: 'Kablosuz ANC Kulaklık',
    slug: 'kablosuz-anc-kulaklik',
    fiyat: 2499.00,
    indirimliFiyat: 1999.00,
    renkSecenekleri: JSON.stringify(['Siyah', 'Beyaz', 'Mavi']),
    iadeImkaniVar: 1,
    desi: 0.5,
    aciklama: '<p>Yüksek ses kaliteli, aktif gürültü engelleyici (ANC) özellikli ve 40 saate varan pil ömrü sunan kablosuz kulaklık. Ergonomik tasarımıyla gün boyu konforlu kullanım sağlar.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 1,
    yeniUrun: 1,
    cokSatanlar: 0,
    firsatUrunu: 1,
    stokAdedi: 150,
    kategoriId: categoryMap['elektronik'],
    markaId: brandMap['techbrand']
  },
  {
    id: randomUUID(),
    ad: 'Akıllı GPS Saat',
    slug: 'akilli-gps-saat',
    fiyat: 4999.00,
    indirimliFiyat: null,
    renkSecenekleri: JSON.stringify(['Siyah', 'Gri']),
    iadeImkaniVar: 1,
    desi: 0.2,
    aciklama: '<p>Adım sayar, dahili GPS, detaylı nabız ölçer ve uyku takibi özellikli, 50 metreye kadar suya dayanıklı yeni nesil akıllı saat. Spor aktivitelerinizi detaylı analiz eder.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 0,
    yeniUrun: 0,
    cokSatanlar: 1,
    firsatUrunu: 0,
    stokAdedi: 80,
    kategoriId: categoryMap['elektronik'],
    markaId: brandMap['techbrand']
  },
  {
    id: randomUUID(),
    ad: 'Pamuklu Oversize T-Shirt',
    slug: 'pamuklu-oversize-t-shirt',
    fiyat: 499.00,
    indirimliFiyat: 399.00,
    renkSecenekleri: JSON.stringify(['Siyah', 'Beyaz', 'Gri', 'Krem']),
    iadeImkaniVar: 1,
    desi: 0.3,
    aciklama: '<p>%100 organik pamuklu yumuşak kumaştan üretilen, unisex kullanıma uygun, dökümlü ve rahat kesim oversize basic t-shirt. Günlük stilinizin vazgeçilmezi olacak.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 0,
    yeniUrun: 1,
    cokSatanlar: 0,
    firsatUrunu: 1,
    stokAdedi: 300,
    kategoriId: categoryMap['giyim-aksesuar'],
    markaId: brandMap['styleco']
  },
  {
    id: randomUUID(),
    ad: 'Klasik Deri Cüzdan',
    slug: 'klasik-deri-cuzdan',
    fiyat: 899.00,
    indirimliFiyat: null,
    renkSecenekleri: JSON.stringify(['Siyah', 'Kahverengi']),
    iadeImkaniVar: 1,
    desi: 0.15,
    aciklama: '<p>Birinci sınıf hakiki deriden el işçiliği ile üretilen, çok sayıda kart bölmesi, şeffaf kimlik alanı ve kağıt para gözü bulunan şık ve zamansız cüzdan tasarımı.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1627124765135-56c678394236?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 0,
    yeniUrun: 0,
    cokSatanlar: 1,
    firsatUrunu: 0,
    stokAdedi: 120,
    kategoriId: categoryMap['giyim-aksesuar'],
    markaId: brandMap['styleco']
  },
  {
    id: randomUUID(),
    ad: 'Seramik Kahve Kupası Seti',
    slug: 'seramik-kahve-kupasi-seti',
    fiyat: 349.00,
    indirimliFiyat: 299.00,
    renkSecenekleri: JSON.stringify(['Beyaz', 'Krem', 'Bej']),
    iadeImkaniVar: 1,
    desi: 0.6,
    aciklama: '<p>Özel tasarım 2\'li seramik kahve kupası seti. Ergonomik kulp tasarımı ve mat dış yüzeyi ile kahve keyfinizi katlar. Bulaşık makinesinde ve mikrodalga fırında kullanılabilir.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 0,
    yeniUrun: 0,
    cokSatanlar: 0,
    firsatUrunu: 1,
    stokAdedi: 95,
    kategoriId: categoryMap['ev-yasam'],
    markaId: brandMap['homedecor']
  },
  {
    id: randomUUID(),
    ad: 'Modern Metal Masa Lambası',
    slug: 'modern-metal-masa-lambasi',
    fiyat: 1249.00,
    indirimliFiyat: 999.00,
    renkSecenekleri: JSON.stringify(['Siyah', 'Sarı']),
    iadeImkaniVar: 1,
    desi: 1.2,
    aciklama: '<p>Mat metal gövdesi ve ayarlanabilir başlığı ile modern ve minimalist çalışma masası lambası. Göz yormayan LED ışık teknolojisiyle verimli bir çalışma ortamı sağlar.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 1,
    yeniUrun: 0,
    cokSatanlar: 0,
    firsatUrunu: 1,
    stokAdedi: 50,
    kategoriId: categoryMap['ev-yasam'],
    markaId: brandMap['homedecor']
  },
  {
    id: randomUUID(),
    ad: 'Çelik Termos Matara',
    slug: 'celik-termos-matara',
    fiyat: 799.00,
    indirimliFiyat: null,
    renkSecenekleri: JSON.stringify(['Siyah', 'Antrasit', 'Mavi']),
    iadeImkaniVar: 1,
    desi: 0.4,
    aciklama: '<p>Çift duvar vakum yalıtımlı paslanmaz çelik gövdesiyle içeceklerinizi 12 saate kadar sıcak, 24 saate kadar buz gibi soğuk tutan sızdırmaz sporcu matarası.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 0,
    yeniUrun: 0,
    cokSatanlar: 1,
    firsatUrunu: 0,
    stokAdedi: 200,
    kategoriId: categoryMap['spor-outdoor'],
    markaId: brandMap['fitlife']
  },
  {
    id: randomUUID(),
    ad: 'Kaymaz Yoga Matı',
    slug: 'kaymaz-yoga-mati',
    fiyat: 649.00,
    indirimliFiyat: 549.00,
    renkSecenekleri: JSON.stringify(['Pembe', 'Mor', 'Mavi']),
    iadeImkaniVar: 1,
    desi: 0.95,
    aciklama: '<p>6 mm kalınlığında, çevre dostu TPE malzemeden üretilen, yüksek yoğunluklu yapısıyla eklemleri destekleyen ve mükemmel zemin tutuşu sağlayan profesyonel spor ve yoga matı.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80',
    aktif: 1,
    oneCikan: 1,
    yeniUrun: 1,
    cokSatanlar: 0,
    firsatUrunu: 1,
    stokAdedi: 110,
    kategoriId: categoryMap['spor-outdoor'],
    markaId: brandMap['fitlife']
  }
];

let sql = `
-- Database Cleanup
DELETE FROM siparis_gecmisi;
DELETE FROM iade_talepleri;
DELETE FROM siparis_kalemleri;
DELETE FROM siparisler;
DELETE FROM urun_resimleri;
DELETE FROM urunler;
DELETE FROM renk_kartelasi;
DELETE FROM kategoriler;
DELETE FROM markalar;
DELETE FROM sistem_ayarlari;

-- Seed System Settings
INSERT INTO sistem_ayarlari (id, kargoDesiCarpani, ambarEsikDesi, ucretsizKargoAltLimit, kargoFiyatListesi, maintenanceMode, updatedAt)
VALUES ('global-settings', 15.00, 0, 2500.00, '[]', 0, CURRENT_TIMESTAMP);
`;

for (const cat of categories) {
  sql += `INSERT INTO kategoriler (id, ad, slug, resim, sira, aktif, olusturulmaTarihi, guncellenmeTarihi) VALUES ('${cat.id}', '${cat.ad.replace(/'/g, "''")}', '${cat.slug}', NULL, ${cat.sira}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
}

for (const br of brands) {
  sql += `INSERT INTO markalar (id, ad, slug, logoUrl, aktif, sira, olusturulmaTarihi, guncellenmeTarihi) VALUES ('${br.id}', '${br.ad.replace(/'/g, "''")}', '${br.slug}', NULL, 1, ${br.sira}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
}

for (const p of products) {
  const desc = p.aciklama ? `'${p.aciklama.replace(/'/g, "''")}'` : 'NULL';
  const img = p.resimUrl ? `'${p.resimUrl}'` : 'NULL';
  const disc = p.indirimliFiyat !== null ? p.indirimliFiyat : 'NULL';
  
  sql += `INSERT INTO urunler (id, slug, ad, fiyat, indirimliFiyat, renkSecenekleri, kartelaIcCephe, kartelaDisCephe, iadeImkaniVar, desi, aciklama, resimUrl, aktif, oneCikan, firsatUrunu, yeniUrun, cokSatanlar, goruntulemeSayisi, satisAdedi, stokAdedi, kategoriId, markaId, olusturulmaTarihi, guncellenmeTarihi) VALUES ('${p.id}', '${p.slug}', '${p.ad.replace(/'/g, "''")}', ${p.fiyat}, ${disc}, '${p.renkSecenekleri}', 0, 0, 1, ${p.desi}, ${desc}, ${img}, 1, ${p.oneCikan}, ${p.firsatUrunu}, ${p.yeniUrun}, ${p.cokSatanlar}, 0, 0, ${p.stokAdedi}, '${p.kategoriId}', '${p.markaId}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n`;
}

fs.writeFileSync('prisma/seed.sql', sql, 'utf8');
console.log('Seed SQL generated successfully!');
