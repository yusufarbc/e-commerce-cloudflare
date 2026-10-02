-- Brings the database in line with prisma/schema.prisma. The schema had drifted from the
-- migrations: GET /api/v1/settings failed with "no such column" and order status history
-- could not be written ("no such table: islem_gecmisi"). Existing rows are preserved.
--
-- The unique index on siparisler.odemeTokeni stays: SQLite treats NULLs as distinct, so it
-- does not conflict with orders that have no payment token yet.

-- AlterTable: sistem_ayarlari
ALTER TABLE "sistem_ayarlari" ADD COLUMN "kargoPolitikaTuru" TEXT NOT NULL DEFAULT 'SABIT_UCRET';
ALTER TABLE "sistem_ayarlari" ADD COLUMN "kargoSabitUcret" REAL NOT NULL DEFAULT 0;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "gtmContainerId" TEXT;
ALTER TABLE "sistem_ayarlari" ADD COLUMN "ga4MeasurementId" TEXT;

-- The order history table is called islem_gecmisi in the Prisma schema.
ALTER TABLE "siparis_gecmisi" RENAME TO "islem_gecmisi";
