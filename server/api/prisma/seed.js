import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Sistem Ayarlari Seed
    const settings = await prisma.sistemAyarlari.upsert({
        where: { id: 'global-settings' },
        update: {},
        create: {
            id: 'global-settings',
            kargoAgirlikCarpani: 15.00,
            ucretsizKargoAltLimit: 5000.00,
            maintenanceMode: false
        }
    });
    console.log('System settings seeded:', settings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
