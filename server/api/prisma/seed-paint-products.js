import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    ad: 'Elegans Yarı Mat',
    variants: ['15 lt', '12,5 lt', '7,5 lt', '2,5 lt']
  },
  {
    ad: 'Elegans Extra yarı Mat',
    variants: ['15 lt', '7,5 lt', '2,5 lt']
  },
  {
    ad: 'Elegans Extra Mat',
    variants: ['12,5 lt', '7,5 lt', '2,5 lt']
  },
  {
    ad: 'Primera Mat Silikonlu',
    variants: ['15 lt', '7,5 lt', '2,5 lt']
  },
  {
    ad: 'Exelans Macro',
    variants: ['15 lt', '7,5 lt', '2,5 lt']
  },
  {
    ad: 'A1 Silikonlu Düz',
    variants: ['15 lt', '7,5 lt', '2,5 lt']
  }
];

const slugify = (value) => {
  return value
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

async function main() {
  for (const item of products) {
    const slug = slugify(item.ad);

    const existingProduct = await prisma.urun.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      console.log(`Skipped existing product: ${item.ad}`);
      continue;
    }

    const product = await prisma.urun.create({
      data: {
        ad: item.ad,
        slug,
        fiyat: new Prisma.Decimal(0),
        indirimliFiyat: null,
        renkSecenekleri: [],
        iadeImkaniVar: false,
        agirlik: new Prisma.Decimal(1),
        aciklama: null,
        resimUrl: null,
        aktif: false,
        stokAdedi: 0
      }
    });

    console.log(`Seeded paint product shell: ${item.ad}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
