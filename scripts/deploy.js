import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import crypto from 'crypto';

// Parse command line arguments
const args = process.argv.slice(2);
const isNonInteractive = args.includes('--non-interactive') || args.includes('-y');
let envArg = '';
const envIndex = args.findIndex(arg => arg.startsWith('--env=') || arg === '--env');
if (envIndex !== -1) {
    if (args[envIndex].startsWith('--env=')) {
        envArg = args[envIndex].split('=')[1];
    } else if (args[envIndex + 1]) {
        envArg = args[envIndex + 1];
    }
}

const rl = isNonInteractive ? null : readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => {
    if (isNonInteractive) {
        resolve('y'); // Automatically answer yes in non-interactive mode
        return;
    }
    rl.question(query, resolve);
});

/**
 * Executes a terminal command synchronously and returns the output.
 * @param {string} command - Command to run.
 * @param {string} cwd - Current working directory.
 * @param {string} [input] - Stdin input for the command.
 * @returns {Object} Execution result wrapper.
 */
function runCommand(command, cwd = process.cwd(), input = null) {
    console.log(`\n\x1b[36mRunning: ${command} (in ${cwd})\x1b[0m`);
    try {
        const execOptions = { cwd, stdio: 'pipe', encoding: 'utf-8' };
        if (input !== null) {
            execOptions.input = input;
        }
        const output = execSync(command, execOptions);
        return { success: true, output };
    } catch (error) {
        console.error(`\x1b[31mError running command: ${command}\x1b[0m`);
        console.error(error.stderr || error.message);
        return { success: false, error: error.stderr || error.message };
    }
}

/**
 * Generates the D1 database SQL seed script.
 * @returns {string} SQL queries.
 */
function generateSqlSeed() {
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
            renkSecenekleri: ['Siyah', 'Beyaz', 'Mavi'],
            iadeImkaniVar: true,
            agirlik: 0.5,
            aciklama: 'Yüksek ses kaliteli, aktif gürültü engelleyici (ANC) özellikli ve 40 saate varan pil ömrü sunan kablosuz kulaklık.',
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
            renkSecenekleri: ['Siyah', 'Gri'],
            iadeImkaniVar: true,
            agirlik: 0.2,
            aciklama: 'Adım sayar, dahili GPS, detaylı nabız ölçer ve uyku takibi özellikli akıllı saat.',
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
            renkSecenekleri: ['Siyah', 'Beyaz', 'Gri', 'Krem'],
            iadeImkaniVar: true,
            agirlik: 0.3,
            aciklama: '%100 organik pamuklu yumuşak kumaştan üretilen oversize basic t-shirt.',
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
            renkSecenekleri: ['Siyah', 'Kahverengi'],
            iadeImkaniVar: true,
            agirlik: 0.15,
            aciklama: 'Birinci sınıf hakiki deriden el işçiliği ile üretilen şık deri cüzdan.',
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
            renkSecenekleri: ['Beyaz', 'Krem', 'Bej'],
            iadeImkaniVar: true,
            agirlik: 0.6,
            aciklama: 'Özel tasarım 2\'li seramik kahve kupası seti.',
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
            renkSecenekleri: ['Siyah', 'Sarı'],
            iadeImkaniVar: true,
            agirlik: 1.2,
            aciklama: 'Mat metal gövdesi ve ayarlanabilir başlığı ile modern masa lambası.',
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
            renkSecenekleri: ['Siyah', 'Antrasit', 'Mavi'],
            iadeImkaniVar: true,
            agirlik: 0.4,
            aciklama: 'Çift duvar vakum yalıtımlı paslanmaz çelik sızdırmaz matara.',
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
            renkSecenekleri: ['Pembe', 'Mor', 'Mavi'],
            iadeImkaniVar: true,
            agirlik: 0.95,
            aciklama: '6 mm kalınlığında çevre dostu TPE kaymaz yoga matı.',
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

    let sql = "";
    // Cleanup tables
    sql += "DELETE FROM siparis_gecmisi;\n";
    sql += "DELETE FROM iade_talepleri;\n";
    sql += "DELETE FROM siparis_kalemleri;\n";
    sql += "DELETE FROM siparisler;\n";
    sql += "DELETE FROM urun_resimleri;\n";
    sql += "DELETE FROM urunler;\n";
    sql += "DELETE FROM renk_kartelasi;\n";
    sql += "DELETE FROM kategoriler;\n";
    sql += "DELETE FROM markalar;\n";
    sql += "DELETE FROM sistem_ayarlari;\n";

    // Categories
    const catMap = {};
    categoriesData.forEach((cat, index) => {
        const id = `cat-uuid-${index + 1}`;
        catMap[cat.slug] = id;
        sql += `INSERT INTO kategoriler (id, ad, slug, sira, aktif, olusturulmaTarihi, guncellenmeTarihi) VALUES ('${id}', '${cat.ad}', '${cat.slug}', ${cat.sira}, 1, datetime('now'), datetime('now'));\n`;
    });

    // Brands
    const brandMap = {};
    brandsData.forEach((br, index) => {
        const id = `brand-uuid-${index + 1}`;
        brandMap[br.slug] = id;
        sql += `INSERT INTO markalar (id, ad, slug, aktif, sira, olusturulmaTarihi, guncellenmeTarihi) VALUES ('${id}', '${br.ad}', '${br.slug}', 1, ${br.sira}, datetime('now'), datetime('now'));\n`;
    });

    // Products
    productsData.forEach((prod, index) => {
        const id = `prod-uuid-${index + 1}`;
        const renkJson = JSON.stringify(prod.renkSecenekleri);
        const indirimliFiyatVal = prod.indirimliFiyat === null ? 'NULL' : prod.indirimliFiyat;
        const catId = catMap[prod.categorySlug] ? `'${catMap[prod.categorySlug]}'` : 'NULL';
        const brandId = brandMap[prod.brandSlug] ? `'${brandMap[prod.brandSlug]}'` : 'NULL';
        sql += `INSERT INTO urunler (id, slug, ad, fiyat, indirimliFiyat, renkSecenekleri, kartelaIcCephe, kartelaDisCephe, iadeImkaniVar, desi, aciklama, resimUrl, aktif, oneCikan, firsatUrunu, yeniUrun, cokSatanlar, goruntulemeSayisi, satisAdedi, stokAdedi, varyant_basligi, kategoriId, markaId, olusturulmaTarihi, guncellenmeTarihi) VALUES ('${id}', '${prod.slug}', '${prod.ad}', ${prod.fiyat}, ${indirimliFiyatVal}, '${renkJson}', 0, 0, ${prod.iadeImkaniVar ? 1 : 0}, ${prod.agirlik}, '${prod.aciklama}', '${prod.resimUrl}', ${prod.aktif ? 1 : 0}, ${prod.oneCikan ? 1 : 0}, ${prod.firsatUrunu ? 1 : 0}, ${prod.yeniUrun ? 1 : 0}, ${prod.cokSatanlar ? 1 : 0}, 0, 0, ${prod.stokAdedi}, NULL, ${catId}, ${brandId}, datetime('now'), datetime('now'));\n`;
    });

    // System Settings
    sql += `INSERT INTO sistem_ayarlari (id, kargoDesiCarpani, ambarEsikDesi, ucretsizKargoAltLimit, kargoFiyatListesi, maintenanceMode, updatedAt) VALUES ('global-settings', 15.00, 0, 2500.00, NULL, 0, datetime('now'));\n`;

    return sql;
}

async function main() {
    console.log('\x1b[35m========================================================\x1b[0m');
    console.log('\x1b[35m⚡ E-MARKET CLOUDFLARE SERVERLESS DEPLOY WIZARD ⚡\x1b[0m');
    console.log('\x1b[35m========================================================\x1b[0m\n');

    // Staging-only deployment
    const targetEnv = 'staging';
    console.log(`Target Environment: \x1b[35m${targetEnv}\x1b[0m`);
    const envFlag = ` --env staging`;

    // 1. Authentication Check
    console.log('\n1. Checking Cloudflare authentication status...');
    const authCheck = runCommand('npx wrangler whoami');
    if (!authCheck.success || authCheck.output.includes('You are not authenticated')) {
        if (isNonInteractive) {
            console.error('\x1b[31m[❌] Not authenticated in non-interactive mode. Cannot proceed.\x1b[0m');
            process.exit(1);
        }
        console.log('\n\x1b[33m[!] You are not authenticated with Cloudflare. Opening login page in your browser...\x1b[0m');
        runCommand('npx wrangler login');
        
        // Recheck authentication status
        const secondAuthCheck = runCommand('npx wrangler whoami');
        if (!secondAuthCheck.success || secondAuthCheck.output.includes('You are not authenticated')) {
            console.log('\x1b[31m[❌] Login failed. Please run "npx wrangler login" manually in your terminal.\x1b[0m');
            process.exit(1);
        }
    }
    console.log('\x1b[32m[✓] Authentication successful.\x1b[0m');

    // 2. D1 Database Creation
    let dbId = '';
    const createDbAnswer = await askQuestion('\n2. Do you want to create a D1 Database? (y/n): ');
    if (createDbAnswer.toLowerCase() === 'y') {
        console.log('Creating D1 staging database if not exists...');
        const dbResult = runCommand('npx wrangler d1 create ecommerce-d1-staging');
        
        if (dbResult.success) {
            // Extract UUID from output
            const match = dbResult.output.match(/database_id = "([a-f0-9-]+)"/);
            if (match && match[1]) {
                dbId = match[1];
                console.log(`\x1b[32m[✓] Database created successfully. ID: ${dbId}\x1b[0m`);
                
                // Update wrangler.toml with the newly generated D1 database_id
                const tomlPath = path.join(process.cwd(), 'api', 'wrangler.toml');
                if (fs.existsSync(tomlPath)) {
                    let tomlContent = fs.readFileSync(tomlPath, 'utf8');
                    const regex = new RegExp(`(database_name = "ecommerce-d1-staging"\\s+database_id = ")[a-f0-9-]+"`);
                    tomlContent = tomlContent.replace(regex, `$1${dbId}"`);
                    fs.writeFileSync(tomlPath, tomlContent, 'utf8');
                    console.log('\x1b[32m[✓] Updated wrangler.toml with new database_id.\x1b[0m');
                }
            } else {
                console.log('\x1b[33m[!] Database created but UUID could not be resolved from output. Please write it manually in wrangler.toml.\x1b[0m');
            }
        } else {
            console.log('\x1b[33m[!] D1 Database already exists or creation skipped.\x1b[0m');
        }
    }

    // 3. R2 Bucket Creation
    const createR2Answer = await askQuestion('\n3. Do you want to create an R2 Object Storage Bucket for images? (y/n): ');
    if (createR2Answer.toLowerCase() === 'y') {
        const bucketName = 'ecommerce-r2-staging';
        console.log(`Creating R2 bucket: ${bucketName}...`);
        const r2Result = runCommand(`npx wrangler r2 bucket create ${bucketName}${envFlag}`);
        if (r2Result.success) {
            console.log('\x1b[32m[✓] R2 Bucket created successfully.\x1b[0m');
        } else {
            console.log('\x1b[33m[!] R2 Bucket could not be created or already exists.\x1b[0m');
        }
    }

    // 4. Remote Migrations
    const migrateAnswer = await askQuestion('\n4. Do you want to apply database migrations to remote D1? (y/n): ');
    if (migrateAnswer.toLowerCase() === 'y') {
        console.log('Applying migrations to remote database (D1)...');
        const migrateResult = runCommand(`npx wrangler d1 migrations apply DB --remote --cwd api${envFlag}`);
        if (migrateResult.success) {
            console.log('\x1b[32m[✓] Database migrations applied successfully.\x1b[0m');
        } else {
            console.log('\x1b[31m[❌] Error applying database migrations.\x1b[0m');
        }
    }

    // 5. Remote Database Seeding
    const seedAnswer = await askQuestion('\n5. Do you want to seed the remote D1 Database? (y/n): ');
    if (seedAnswer.toLowerCase() === 'y') {
        console.log('Generating database seeds...');
        const sqlContent = generateSqlSeed();
        const tempSqlPath = path.join(process.cwd(), 'api', 'temp-remote-seed.sql');
        fs.writeFileSync(tempSqlPath, sqlContent, 'utf8');

        console.log('Executing database seeds on D1 remote instance...');
        const seedResult = runCommand(`npx wrangler d1 execute ecommerce-d1-staging --remote --file=temp-remote-seed.sql --cwd api${envFlag}`);
        
        // Cleanup temp file
        if (fs.existsSync(tempSqlPath)) {
            fs.unlinkSync(tempSqlPath);
        }

        if (seedResult.success) {
            console.log('\x1b[32m[✓] Remote database seeded successfully.\x1b[0m');
        } else {
            console.log('\x1b[31m[❌] Failed to seed remote D1 database.\x1b[0m');
        }
    }

    // 6. Workers API Deployment
    const deployApiAnswer = await askQuestion('\n6. Do you want to deploy the Workers API (Hono) to Cloudflare? (y/n): ');
    let apiEndpoint = '';
    if (deployApiAnswer.toLowerCase() === 'y') {
        console.log('Deploying Workers API...');
        const deployResult = runCommand(`npx wrangler deploy --cwd api${envFlag}`);
        if (deployResult.success) {
            // Match Workers url format e.g. https://ecommerce-api.username.workers.dev
            const match = deployResult.output.match(/https:\/\/[a-z0-9-.]+\.workers\.dev/);
            if (match) {
                apiEndpoint = match[0];
                console.log(`\x1b[32m[✓] Workers API deployed successfully! URL: ${apiEndpoint}\x1b[0m`);
            } else {
                console.log('\x1b[32m[✓] Workers API deployed successfully! Check your Cloudflare dashboard for the URL.\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Failed to deploy Workers API.\x1b[0m');
        }
    }

    if (!apiEndpoint) {
        if (isNonInteractive) {
            apiEndpoint = 'https://api.ecommerceflaredev.web.tr';
        } else {
            apiEndpoint = await askQuestion('\n[?] Please enter your Workers API base URL (e.g. https://ecommerce-api.user.workers.dev): ');
        }
    }

    // 7. Workers Secrets Configuration
    const secretsAnswer = await askQuestion('\n7. Do you want to configure secure Admin credentials & JWT secret on Workers? (y/n): ');
    if (secretsAnswer.toLowerCase() === 'y') {
        let adminEmail = 'admin@e-market.com';
        let adminPassword = 'admin12345';
        let adminJwtSecret = crypto.randomBytes(32).toString('hex');

        if (!isNonInteractive) {
            const emailInput = await askQuestion(`Enter Admin Email [default: ${adminEmail}]: `);
            if (emailInput.trim()) adminEmail = emailInput.trim();

            const passwordInput = await askQuestion(`Enter Admin Password [default: ${adminPassword}]: `);
            if (passwordInput.trim()) adminPassword = passwordInput.trim();

            const jwtInput = await askQuestion('Enter JWT Secret [default: auto-generate]: ');
            if (jwtInput.trim()) adminJwtSecret = jwtInput.trim();
        }

        console.log('Setting Cloudflare Worker secrets...');
        
        runCommand(`npx wrangler secret put ADMIN_EMAIL${envFlag}`, 'api', adminEmail);
        runCommand(`npx wrangler secret put ADMIN_PASSWORD${envFlag}`, 'api', adminPassword);
        runCommand(`npx wrangler secret put ADMIN_JWT_SECRET${envFlag}`, 'api', adminJwtSecret);

        console.log('\x1b[32m[✓] Cloudflare Worker secrets configured successfully.\x1b[0m');
    }

    // 8. Write _redirects Files (Prevents CORS via Pages Proxy)
    console.log('\n8. Generating _redirects proxy rules...');
    const redirectContent = `/api/* ${apiEndpoint}/api/:splat 200\n`;
    
    // Client public
    const clientPublicDir = path.join(process.cwd(), 'client', 'public');
    if (!fs.existsSync(clientPublicDir)) fs.mkdirSync(clientPublicDir, { recursive: true });
    fs.writeFileSync(path.join(clientPublicDir, '_redirects'), redirectContent, 'utf8');

    // Admin public
    const adminPublicDir = path.join(process.cwd(), 'admin', 'public');
    if (!fs.existsSync(adminPublicDir)) fs.mkdirSync(adminPublicDir, { recursive: true });
    fs.writeFileSync(path.join(adminPublicDir, '_redirects'), redirectContent, 'utf8');
    
    console.log('\x1b[32m[✓] _redirects files generated in client/public and admin/public.\x1b[0m');

    // 9. Pages Build & Deploy
    const deployPagesAnswer = await askQuestion('\n9. Do you want to build and deploy storefront and admin panels to Cloudflare Pages? (y/n): ');
    if (deployPagesAnswer.toLowerCase() === 'y') {
        const isWindows = process.platform === 'win32';
        const npmCmd = isWindows ? 'npm.cmd' : 'npm';
        const pagesBranch = 'test';

        // Client Build
        console.log('Building storefront client app...');
        const clientBuild = runCommand(`${npmCmd} run build --prefix client`);
        
        // Admin Build
        console.log('Building admin dashboard app...');
        const adminBuild = runCommand(`${npmCmd} run build --prefix admin`);

        const prjSuffix = '-staging';

        if (clientBuild.success) {
            console.log('Deploying Storefront to Cloudflare Pages...');
            const clientDeploy = runCommand(`npx wrangler pages deploy client/dist --project-name e-market-client${prjSuffix} --branch=${pagesBranch}`);
            if (clientDeploy.success) {
                console.log('\x1b[32m[✓] Storefront deployed successfully!\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Skipping Storefront deployment due to build error.\x1b[0m');
        }

        if (adminBuild.success) {
            console.log('Deploying Admin Dashboard to Cloudflare Pages...');
            const adminDeploy = runCommand(`npx wrangler pages deploy admin/dist --project-name e-market-admin${prjSuffix} --branch=${pagesBranch}`);
            if (adminDeploy.success) {
                console.log('\x1b[32m[✓] Admin Dashboard deployed successfully!\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Skipping Admin Dashboard deployment due to build error.\x1b[0m');
        }
    }

    console.log('\n\x1b[35m========================================================\x1b[0m');
    console.log('\x1b[32m🎉 DEPLOYMENT WIZARD COMPLETE! 🎉\x1b[0m');
    console.log(`\x1b[36m- API Worker Endpoint: ${apiEndpoint}\x1b[0m`);
    console.log(`\x1b[36m- Storefront: https://ecommerceflaredev.web.tr\x1b[0m`);
    console.log(`\x1b[36m- Admin Panel: https://admin.ecommerceflaredev.web.tr\x1b[0m`);
    console.log(`\x1b[36m- API: https://api.ecommerceflaredev.web.tr\x1b[0m`);
    console.log('\x1b[35m========================================================\x1b[0m\n');

    if (rl) rl.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
