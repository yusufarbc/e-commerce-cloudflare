import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoriesData = [
  { ad: 'Elektronik', slug: 'elektronik', sira: 1 },
  { ad: 'Giyim & Aksesuar', slug: 'giyim-aksesuar', sira: 2 },
  { ad: 'Ev & Yaşam', slug: 'ev-yasam', sira: 3 },
  { ad: 'Spor & Outdoor', slug: 'spor-outdoor', sira: 4 }
];

const brandsData = [
  { ad: 'TechBrand', slug: 'techbrand', sira: 1 },
  { ad: 'StyleCo', slug: 'styleco', sira: 2 },
  { ad: 'HomeDecor', slug: 'homedecor', sira: 3 },
  { ad: 'FitLife', slug: 'fitlife', sira: 4 }
];

const productsData = [
  {
    ad: 'Kablosuz ANC Kulaklık',
    slug: 'kablosuz-anc-kulaklik',
    fiyat: 2499.00,
    indirimliFiyat: 1999.00,
    renkSecenekleri: JSON.stringify(['Siyah', 'Beyaz', 'Mavi']),
    iadeImkaniVar: true,
    agirlik: 0.5,
    aciklama: '<p>Yüksek ses kaliteli, aktif gürültü engelleyici (ANC) özellikli ve 40 saate varan pil ömrü sunan kablosuz kulaklık. Ergonomik tasarımıyla gün boyu konforlu kullanım sağlar.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: true,
    yeniUrun: true,
    cokSatanlar: false,
    firsatUrunu: true,
    stokAdedi: 150,
    categorySlug: 'elektronik',
    brandSlug: 'techbrand'
  },
  {
    ad: 'Akıllı GPS Saat',
    slug: 'akilli-gps-saat',
    fiyat: 4999.00,
    indirimliFiyat: null,
    renkSecenekleri: JSON.stringify(['Siyah', 'Gri']),
    iadeImkaniVar: true,
    agirlik: 0.2,
    aciklama: '<p>Adım sayar, dahili GPS, detaylı nabız ölçer ve uyku takibi özellikli, 50 metreye kadar suya dayanıklı yeni nesil akıllı saat. Spor aktivitelerinizi detaylı analiz eder.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: false,
    yeniUrun: false,
    cokSatanlar: true,
    firsatUrunu: false,
    stokAdedi: 80,
    categorySlug: 'elektronik',
    brandSlug: 'techbrand'
  },
  {
    ad: 'Pamuklu Oversize T-Shirt',
    slug: 'pamuklu-oversize-t-shirt',
    fiyat: 499.00,
    indirimliFiyat: 399.00,
    renkSecenekleri: JSON.stringify(['Siyah', 'Beyaz', 'Gri', 'Krem']),
    iadeImkaniVar: true,
    agirlik: 0.3,
    aciklama: '<p>%100 organik pamuklu yumuşak kumaştan üretilen, unisex kullanıma uygun, dökümlü ve rahat kesim oversize basic t-shirt. Günlük stilinizin vazgeçilmezi olacak.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: false,
    yeniUrun: true,
    cokSatanlar: false,
    firsatUrunu: true,
    stokAdedi: 300,
    categorySlug: 'giyim-aksesuar',
    brandSlug: 'styleco'
  },
  {
    ad: 'Klasik Deri Cüzdan',
    slug: 'klasik-deri-cuzdan',
    fiyat: 899.00,
    indirimliFiyat: null,
    renkSecenekleri: JSON.stringify(['Siyah', 'Kahverengi']),
    iadeImkaniVar: true,
    agirlik: 0.15,
    aciklama: '<p>Birinci sınıf hakiki deriden el işçiliği ile üretilen, çok sayıda kart bölmesi, şeffaf kimlik alanı ve kağıt para gözü bulunan şık ve zamansız cüzdan tasarımı.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1627124765135-56c678394236?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: false,
    yeniUrun: false,
    cokSatanlar: true,
    firsatUrunu: false,
    stokAdedi: 120,
    categorySlug: 'giyim-aksesuar',
    brandSlug: 'styleco'
  },
  {
    ad: 'Seramik Kahve Kupası Seti',
    slug: 'seramik-kahve-kupasi-seti',
    fiyat: 349.00,
    indirimliFiyat: 299.00,
    renkSecenekleri: JSON.stringify(['Beyaz', 'Krem', 'Bej']),
    iadeImkaniVar: true,
    agirlik: 0.6,
    aciklama: '<p>Özel tasarım 2\'li seramik kahve kupası seti. Ergonomik kulp tasarımı ve mat dış yüzeyi ile kahve keyfinizi katlar. Bulaşık makinesinde ve mikrodalga fırında kullanılabilir.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: false,
    yeniUrun: false,
    cokSatanlar: false,
    firsatUrunu: true,
    stokAdedi: 95,
    categorySlug: 'ev-yasam',
    brandSlug: 'homedecor'
  },
  {
    ad: 'Modern Metal Masa Lambası',
    slug: 'modern-metal-masa-lambasi',
    fiyat: 1249.00,
    indirimliFiyat: 999.00,
    renkSecenekleri: JSON.stringify(['Siyah', 'Sarı']),
    iadeImkaniVar: true,
    agirlik: 1.2,
    aciklama: '<p>Mat metal gövdesi ve ayarlanabilir başlığı ile modern ve minimalist çalışma masası lambası. Göz yormayan LED ışık teknolojisiyle verimli bir çalışma ortamı sağlar.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: true,
    yeniUrun: false,
    cokSatanlar: false,
    firsatUrunu: true,
    stokAdedi: 50,
    categorySlug: 'ev-yasam',
    brandSlug: 'homedecor'
  },
  {
    ad: 'Çelik Termos Matara',
    slug: 'celik-termos-matara',
    fiyat: 799.00,
    indirimliFiyat: null,
    renkSecenekleri: JSON.stringify(['Siyah', 'Antrasit', 'Mavi']),
    iadeImkaniVar: true,
    agirlik: 0.4,
    aciklama: '<p>Çift duvar vakum yalıtımlı paslanmaz çelik gövdesiyle içeceklerinizi 12 saate kadar sıcak, 24 saate kadar buz gibi soğuk tutan sızdırmaz sporcu matarası.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: false,
    yeniUrun: false,
    cokSatanlar: true,
    firsatUrunu: false,
    stokAdedi: 200,
    categorySlug: 'spor-outdoor',
    brandSlug: 'fitlife'
  },
  {
    ad: 'Kaymaz Yoga Matı',
    slug: 'kaymaz-yoga-mati',
    fiyat: 649.00,
    indirimliFiyat: 549.00,
    renkSecenekleri: JSON.stringify(['Pembe', 'Mor', 'Mavi']),
    iadeImkaniVar: true,
    agirlik: 0.95,
    aciklama: '<p>6 mm kalınlığında, çevre dostu TPE malzemeden üretilen, yüksek yoğunluklu yapısıyla eklemleri destekleyen ve mükemmel zemin tutuşu sağlayan profesyonel spor ve yoga matı.</p>',
    resimUrl: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&auto=format&fit=crop&q=80',
    aktif: true,
    oneCikan: true,
    yeniUrun: true,
    cokSatanlar: false,
    firsatUrunu: true,
    stokAdedi: 110,
    categorySlug: 'spor-outdoor',
    brandSlug: 'fitlife'
  }
];

async function main() {
  console.log('Starting DB cleanup...');
  await prisma.siparisGecmisi.deleteMany({});
  await prisma.iadeTalebi.deleteMany({});
  await prisma.siparisKalemi.deleteMany({});
  await prisma.siparis.deleteMany({});
  await prisma.urunResim.deleteMany({});
  await prisma.urun.deleteMany({});
  await prisma.renkKartelasi.deleteMany({});
  await prisma.kategori.deleteMany({});
  await prisma.marka.deleteMany({});
  console.log('Cleanup completed successfully.');

  console.log('Seeding categories...');
  const categoriesMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.kategori.create({
      data: {
        ad: cat.ad,
        slug: cat.slug,
        sira: cat.sira,
        aktif: true
      }
    });
    categoriesMap[cat.slug] = created.id;
  }
  console.log('Seeding brands...');
  const brandsMap = {};
  for (const br of brandsData) {
    const created = await prisma.marka.create({
      data: {
        ad: br.ad,
        slug: br.slug,
        sira: br.sira,
        aktif: true
      }
    });
    brandsMap[br.slug] = created.id;
  }

  console.log('Seeding products...');
  for (const prod of productsData) {
    await prisma.urun.create({
      data: {
        ad: prod.ad,
        slug: prod.slug,
        fiyat: prod.fiyat,
        indirimliFiyat: prod.indirimliFiyat,
        renkSecenekleri: prod.renkSecenekleri,
        iadeImkaniVar: prod.iadeImkaniVar,
        agirlik: prod.agirlik,
        aciklama: prod.aciklama,
        resimUrl: prod.resimUrl,
        aktif: prod.aktif,
        oneCikan: prod.oneCikan,
        yeniUrun: prod.yeniUrun,
        cokSatanlar: prod.cokSatanlar,
        firsatUrunu: prod.firsatUrunu,
        stokAdedi: prod.stokAdedi,
        kategoriId: categoriesMap[prod.categorySlug] || null,
        markaId: brandsMap[prod.brandSlug] || null
      }
    });
  }

  console.log('Seeding system settings...');
  const settings = await prisma.sistemAyarlari.upsert({
    where: { id: 'global-settings' },
    update: {},
    create: {
      id: 'global-settings',
      kargoAgirlikCarpani: 15.00,
      ucretsizKargoAltLimit: 2500.00,
      maintenanceMode: false
    }
  });

  console.log('Seed completed successfully!', settings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
