-- CreateTable
CREATE TABLE "urunler" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "fiyat" REAL NOT NULL,
    "indirimliFiyat" REAL,
    "renkSecenekleri" TEXT NOT NULL DEFAULT '[]',
    "kartelaIcCephe" BOOLEAN NOT NULL DEFAULT false,
    "kartelaDisCephe" BOOLEAN NOT NULL DEFAULT false,
    "iadeImkaniVar" BOOLEAN NOT NULL DEFAULT true,
    "desi" REAL NOT NULL DEFAULT 1,
    "aciklama" TEXT,
    "resimUrl" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "oneCikan" BOOLEAN NOT NULL DEFAULT false,
    "firsatUrunu" BOOLEAN NOT NULL DEFAULT false,
    "yeniUrun" BOOLEAN NOT NULL DEFAULT false,
    "cokSatanlar" BOOLEAN NOT NULL DEFAULT false,
    "goruntulemeSayisi" INTEGER NOT NULL DEFAULT 0,
    "satisAdedi" INTEGER NOT NULL DEFAULT 0,
    "stokAdedi" INTEGER NOT NULL DEFAULT 0,
    "varyant_basligi" TEXT,
    "kategoriId" TEXT,
    "markaId" TEXT,
    "olusturulmaTarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" DATETIME NOT NULL,
    CONSTRAINT "urunler_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "kategoriler" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "urunler_markaId_fkey" FOREIGN KEY ("markaId") REFERENCES "markalar" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "urun_resimleri" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "urunId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "urun_resimleri_urunId_fkey" FOREIGN KEY ("urunId") REFERENCES "urunler" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "renk_kartelasi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "section" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex" TEXT NOT NULL,
    "rgb" TEXT NOT NULL,
    "sourceFile" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "olusturulmaTarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "markalar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "olusturulmaTarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "kategoriler" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resim" TEXT,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "ustKategoriId" TEXT,
    "olusturulmaTarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" DATETIME NOT NULL,
    CONSTRAINT "kategoriler_ustKategoriId_fkey" FOREIGN KEY ("ustKategoriId") REFERENCES "kategoriler" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "siparisler" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siparisNumarasi" TEXT NOT NULL,
    "takipTokeni" TEXT,
    "toplamTutar" REAL NOT NULL,
    "kargoUcreti" REAL NOT NULL DEFAULT 0,
    "kargoTakipNo" TEXT,
    "kargoFirmasi" TEXT,
    "durum" TEXT NOT NULL DEFAULT 'BEKLEMEDE',
    "faturaDurumu" TEXT NOT NULL DEFAULT 'DUZENLENMEDI',
    "faturaNo" TEXT,
    "faturaTarihi" DATETIME,
    "eposta" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "soyad" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "adres" TEXT NOT NULL,
    "sehir" TEXT NOT NULL,
    "ilce" TEXT NOT NULL,
    "postaKodu" TEXT NOT NULL,
    "ulke" TEXT NOT NULL DEFAULT 'Türkiye',
    "kurumsalMi" BOOLEAN NOT NULL DEFAULT false,
    "sirketAdi" TEXT,
    "vergiDairesi" TEXT,
    "vergiNumarasi" TEXT,
    "odemeId" TEXT,
    "odemeTokeni" TEXT,
    "odemeDurumu" TEXT DEFAULT 'INIT',
    "teslimTarihi" DATETIME,
    "olusturulmaTarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "iade_talepleri" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siparisId" TEXT NOT NULL,
    "iadeTipi" TEXT NOT NULL,
    "sebepAciklamasi" TEXT NOT NULL,
    "fotografUrls" TEXT NOT NULL DEFAULT '[]',
    "resimUrl" TEXT,
    "manuelIadeKodu" TEXT,
    "kargoFirmasi" TEXT,
    "adminNotu" TEXT,
    "durum" TEXT NOT NULL DEFAULT 'ONAY_BEKLENIYOR',
    "olusturulmaTarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenmeTarihi" DATETIME NOT NULL,
    CONSTRAINT "iade_talepleri_siparisId_fkey" FOREIGN KEY ("siparisId") REFERENCES "siparisler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "siparis_kalemleri" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siparisId" TEXT NOT NULL,
    "urunId" TEXT,
    "secilenRenk" TEXT,
    "secilenBoyut" TEXT,
    "iadeyeUygunMuSnapshot" BOOLEAN NOT NULL DEFAULT true,
    "adet" INTEGER NOT NULL,
    "fiyat" REAL NOT NULL,
    "urunAdSnapshot" TEXT NOT NULL,
    "urunFiyatSnapshot" REAL NOT NULL,
    "toplamFiyat" REAL NOT NULL,
    CONSTRAINT "siparis_kalemleri_siparisId_fkey" FOREIGN KEY ("siparisId") REFERENCES "siparisler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "siparis_kalemleri_urunId_fkey" FOREIGN KEY ("urunId") REFERENCES "urunler" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "siparis_gecmisi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siparisId" TEXT NOT NULL,
    "eskiDurum" TEXT,
    "yeniDurum" TEXT NOT NULL,
    "not" TEXT,
    "islemYapan" TEXT NOT NULL DEFAULT 'SYSTEM',
    "tarih" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "siparis_gecmisi_siparisId_fkey" FOREIGN KEY ("siparisId") REFERENCES "siparisler" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sistem_ayarlari" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'global-settings',
    "kargoDesiCarpani" REAL NOT NULL DEFAULT 0,
    "ambarEsikDesi" INTEGER NOT NULL DEFAULT 0,
    "ucretsizKargoAltLimit" REAL DEFAULT 0,
    "kargoFiyatListesi" TEXT,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "urunler_slug_key" ON "urunler"("slug");

-- CreateIndex
CREATE INDEX "urunler_ad_idx" ON "urunler"("ad");

-- CreateIndex
CREATE INDEX "urunler_oneCikan_firsatUrunu_yeniUrun_cokSatanlar_idx" ON "urunler"("oneCikan", "firsatUrunu", "yeniUrun", "cokSatanlar");

-- CreateIndex
CREATE INDEX "urunler_satisAdedi_idx" ON "urunler"("satisAdedi");

-- CreateIndex
CREATE INDEX "urunler_goruntulemeSayisi_idx" ON "urunler"("goruntulemeSayisi");

-- CreateIndex
CREATE UNIQUE INDEX "renk_kartelasi_code_key" ON "renk_kartelasi"("code");

-- CreateIndex
CREATE INDEX "renk_kartelasi_section_sira_idx" ON "renk_kartelasi"("section", "sira");

-- CreateIndex
CREATE INDEX "renk_kartelasi_name_idx" ON "renk_kartelasi"("name");

-- CreateIndex
CREATE UNIQUE INDEX "markalar_ad_key" ON "markalar"("ad");

-- CreateIndex
CREATE UNIQUE INDEX "markalar_slug_key" ON "markalar"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "kategoriler_slug_key" ON "kategoriler"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "siparisler_siparisNumarasi_key" ON "siparisler"("siparisNumarasi");

-- CreateIndex
CREATE UNIQUE INDEX "siparisler_takipTokeni_key" ON "siparisler"("takipTokeni");

-- CreateIndex
CREATE UNIQUE INDEX "siparisler_odemeId_key" ON "siparisler"("odemeId");

-- CreateIndex
CREATE UNIQUE INDEX "siparisler_odemeTokeni_key" ON "siparisler"("odemeTokeni");

-- CreateIndex
CREATE INDEX "siparisler_eposta_idx" ON "siparisler"("eposta");

-- CreateIndex
CREATE INDEX "siparisler_siparisNumarasi_idx" ON "siparisler"("siparisNumarasi");

-- CreateIndex
CREATE INDEX "siparisler_takipTokeni_idx" ON "siparisler"("takipTokeni");

-- CreateIndex
CREATE UNIQUE INDEX "iade_talepleri_siparisId_key" ON "iade_talepleri"("siparisId");

