import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.kategori.findMany();
  console.log('Categories count:', categories.length, categories);
  
  const brands = await prisma.marka.findMany();
  console.log('Brands count:', brands.length, brands);

  const colors = await prisma.renkKartelasi.findMany();
  console.log('RenkKartelasi count:', colors.length);

  const products = await prisma.urun.findMany({
    include: {
      kategori: true,
      marka: true
    }
  });
  console.log('Products:', products.map(p => ({ id: p.id, ad: p.ad, kategori: p.kategori?.ad, marka: p.marka?.ad })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
