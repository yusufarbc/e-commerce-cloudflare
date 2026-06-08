
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Keys of prisma client:', Object.keys(prisma).filter(k => !k.startsWith('_')));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
