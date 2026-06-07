import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const arg = process.argv.slice(2).join(' ').trim();
const searchTerm = arg || null;

async function main() {
  const where = searchTerm
    ? { ad: { contains: searchTerm, mode: 'insensitive' } }
    : undefined;

  const products = await prisma.urun.findMany({
    where,
    take: 20,
    orderBy: { guncellenmeTarihi: 'desc' },
    select: {
      id: true,
      ad: true,
      markaId: true,
      kategoriId: true,
      guncellenmeTarihi: true,
      marka: { select: { id: true, ad: true } },
      kategori: { select: { id: true, ad: true } }
    }
  });

  if (products.length === 0) {
    console.log('No products found for the given filter.');
    return;
  }

  const mapped = products.map((p) => ({
    id: p.id,
    ad: p.ad,
    markaId: p.markaId,
    markaAdi: p.marka?.ad || null,
    kategoriId: p.kategoriId,
    kategoriAdi: p.kategori?.ad || null,
    updatedAt: p.guncellenmeTarihi
  }));

  const missingMarka = mapped.filter((p) => p.markaId && !p.markaAdi).length;
  const missingKategori = mapped.filter((p) => p.kategoriId && !p.kategoriAdi).length;
  const noMarkaId = mapped.filter((p) => !p.markaId).length;
  const noKategoriId = mapped.filter((p) => !p.kategoriId).length;

  console.log('\n=== Product Relation Integrity Report ===');
  console.log(`Filter: ${searchTerm || '(latest 20 products)'}`);
  console.log(`Total checked: ${mapped.length}`);
  console.log(`No markaId: ${noMarkaId}`);
  console.log(`No kategoriId: ${noKategoriId}`);
  console.log(`Has markaId but marka not resolved: ${missingMarka}`);
  console.log(`Has kategoriId but kategori not resolved: ${missingKategori}`);

  console.log('\n=== Sample Rows ===');
  console.table(
    mapped.map((p) => ({
      ad: p.ad,
      markaAdi: p.markaAdi || '(null)',
      kategoriAdi: p.kategoriAdi || '(null)',
      markaId: p.markaId || '(null)',
      kategoriId: p.kategoriId || '(null)'
    }))
  );
}

main()
  .catch((e) => {
    console.error('check-product-relations failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
