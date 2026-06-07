
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.urun.findFirst({
    where: { ad: { contains: 'Kum', mode: 'insensitive' } },
    orderBy: { guncellenmeTarihi: 'desc' }
  });
  console.log('Product Found:', JSON.stringify(product, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
