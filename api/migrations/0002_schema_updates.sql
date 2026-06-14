-- AlterTable: urunler
ALTER TABLE "urunler" ADD COLUMN "kisaAciklama" TEXT;
ALTER TABLE "urunler" ADD COLUMN "boyutSecenekleri" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "urunler" DROP COLUMN "kartelaIcCephe";
ALTER TABLE "urunler" DROP COLUMN "kartelaDisCephe";

-- Drop deprecated table if it exists
DROP TABLE IF EXISTS "renk_kartelasi";

-- AlterTable: sistem_ayarlari
ALTER TABLE "sistem_ayarlari" ADD COLUMN "siteAdi" TEXT NOT NULL DEFAULT 'E-Market';
ALTER TABLE "sistem_ayarlari" ADD COLUMN "iletisimEmail" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "whatsappNumarasi" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "telefon" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "adres" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "facebookUrl" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "twitterUrl" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "youtubeUrl" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "hakkindaMetni" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "metaPixelId" TEXT;
