import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

function runCommand(command, cwd = process.cwd()) {
    console.log(`\n\x1b[36mRunning: ${command} (in ${cwd})\x1b[0m`);
    try {
        const output = execSync(command, { cwd, stdio: 'pipe', encoding: 'utf-8' });
        return { success: true, output };
    } catch (error) {
        console.error(`\x1b[31mError running command: ${command}\x1b[0m`);
        console.error(error.stderr || error.message);
        return { success: false, error: error.stderr || error.message };
    }
}

async function main() {
    console.log('\x1b[35m========================================================\x1b[0m');
    console.log('\x1b[35m⚡ E-MARKET CLOUDFLARE SUNUCUSUZ DEPLOY SİHİRBAZI ⚡\x1b[0m');
    console.log('\x1b[35m========================================================\x1b[0m\n');

    // 1. Kimlik Doğrulama Kontrolü
    console.log('1. Cloudflare kimlik doğrulaması kontrol ediliyor...');
    const authCheck = runCommand('npx wrangler whoami');
    if (!authCheck.success || authCheck.output.includes('You are not authenticated')) {
        console.log('\n\x1b[33m[!] Cloudflare hesabınız açık değil. Lütfen tarayıcıda açılacak sayfadan giriş yapın.\x1b[0m');
        runCommand('npx wrangler login');
        
        // Yeniden kontrol et
        const secondAuthCheck = runCommand('npx wrangler whoami');
        if (!secondAuthCheck.success || secondAuthCheck.output.includes('You are not authenticated')) {
            console.log('\x1b[31m[❌] Giriş başarısız oldu. Lütfen terminalden "npx wrangler login" komutunu el ile çalıştırıp tekrar deneyin.\x1b[0m');
            rl.close();
            return;
        }
    }
    console.log('\x1b[32m[✓] Kimlik doğrulaması başarılı.\x1b[0m');

    // 2. D1 Veritabanı Oluşturma
    const createDbAnswer = await askQuestion('\n2. D1 Veritabanı oluşturulsun mu? (y/n): ');
    let dbId = '';
    if (createDbAnswer.toLowerCase() === 'y') {
        const dbName = 'ecommerce-d1';
        console.log(`D1 Veritabanı oluşturuluyor: ${dbName}...`);
        const dbResult = runCommand(`npx wrangler d1 create ${dbName}`);
        
        if (dbResult.success) {
            // Extract UUID using regex
            const match = dbResult.output.match(/database_id = "([a-f0-9-]+)"/);
            if (match && match[1]) {
                dbId = match[1];
                console.log(`\x1b[32m[✓] Veritabanı başarıyla oluşturuldu. ID: ${dbId}\x1b[0m`);
                
                // Update wrangler.toml
                const tomlPath = path.join(process.cwd(), 'server', 'api', 'wrangler.toml');
                if (fs.existsSync(tomlPath)) {
                    let tomlContent = fs.readFileSync(tomlPath, 'utf8');
                    tomlContent = tomlContent.replace(/database_id = ".*"/, `database_id = "${dbId}"`);
                    fs.writeFileSync(tomlPath, tomlContent, 'utf8');
                    console.log('\x1b[32m[✓] wrangler.toml dosyası yeni database_id ile güncellendi.\x1b[0m');
                }
            } else {
                console.log('\x1b[33m[!] Veritabanı oluşturuldu ancak ID tespit edilemedi. Lütfen elle wrangler.toml dosyasına ekleyin.\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Veritabanı oluşturulamadı. Zaten varsa veya hata oluştuysa manuel devam edebilirsiniz.\x1b[0m');
        }
    }

    // 3. R2 Bucket Oluşturma
    const createR2Answer = await askQuestion('\n3. R2 Görsel Depolama Bucket oluşturulsun mu? (y/n): ');
    if (createR2Answer.toLowerCase() === 'y') {
        console.log('R2 Bucket oluşturuluyor: ecommerce-r2...');
        const r2Result = runCommand('npx wrangler r2 bucket create ecommerce-r2');
        if (r2Result.success) {
            console.log('\x1b[32m[✓] R2 Bucket başarıyla oluşturuldu.\x1b[0m');
        } else {
            console.log('\x1b[33m[!] R2 Bucket oluşturulamadı veya zaten mevcut.\x1b[0m');
        }
    }

    // 4. Veritabanı Göçlerini Uygulama (Migrations Apply)
    const migrateAnswer = await askQuestion('\n4. Veritabanı şeması Cloudflare D1 (Remote) üzerine uygulansın mı? (y/n): ');
    if (migrateAnswer.toLowerCase() === 'y') {
        console.log('Uzak D1 veritabanı şeması güncelleniyor (Remote Migrations Apply)...');
        const migrateResult = runCommand('npx wrangler d1 migrations apply DB --remote --cwd server/api');
        if (migrateResult.success) {
            console.log('\x1b[32m[✓] Veritabanı göçleri başarıyla uygulandı.\x1b[0m');
        } else {
            console.log('\x1b[31m[❌] Veritabanı göçleri uygulanırken hata oluştu.\x1b[0m');
        }
    }

    // 5. Workers API Deploy Etme
    const deployApiAnswer = await askQuestion('\n5. Workers API (Hono) Cloudflare üzerine deploy edilsin mi? (y/n): ');
    let apiEndpoint = '';
    if (deployApiAnswer.toLowerCase() === 'y') {
        console.log('Workers API deploy ediliyor...');
        const deployResult = runCommand('npx wrangler deploy --cwd server/api');
        if (deployResult.success) {
            // Find url from output: https://ecommerce-api.yusufarbc.workers.dev
            const match = deployResult.output.match(/https:\/\/[a-z0-9-.]+\.workers\.dev/);
            if (match) {
                apiEndpoint = match[0];
                console.log(`\x1b[32m[✓] Workers API başarıyla yüklendi! URL: ${apiEndpoint}\x1b[0m`);
            } else {
                console.log('\x1b[32m[✓] Workers API başarıyla yüklendi! Lütfen Cloudflare panelinizden URL\'i kontrol edin.\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] API deploy edilirken hata oluştu.\x1b[0m');
        }
    }

    if (!apiEndpoint) {
        apiEndpoint = await askQuestion('\n[?] Lütfen Workers API (Hono) adresinizi girin (Örn: https://ecommerce-api.kullanici.workers.dev): ');
    }

    // 6. _redirects Dosyalarını Oluşturma (CORS ve Proxy İçin)
    console.log('\n6. _redirects dosyaları proxy kuralları ile oluşturuluyor...');
    const redirectContent = `/api/* ${apiEndpoint}/api/:splat 200\n`;
    
    // Client public
    const clientPublicDir = path.join(process.cwd(), 'client', 'public');
    if (!fs.existsSync(clientPublicDir)) fs.mkdirSync(clientPublicDir, { recursive: true });
    fs.writeFileSync(path.join(clientPublicDir, '_redirects'), redirectContent, 'utf8');

    // Admin public
    const adminPublicDir = path.join(process.cwd(), 'admin', 'public');
    if (!fs.existsSync(adminPublicDir)) fs.mkdirSync(adminPublicDir, { recursive: true });
    fs.writeFileSync(path.join(adminPublicDir, '_redirects'), redirectContent, 'utf8');
    
    console.log('\x1b[32m[✓] _redirects dosyaları client/public ve admin/public klasörlerine eklendi.\x1b[0m');

    // 7. Önyüz Derleme ve Dağıtım (Build & Pages Deploy)
    const deployPagesAnswer = await askQuestion('\n7. Storefront ve Admin panelleri build edilip Cloudflare Pages\'e yüklensin mi? (y/n): ');
    if (deployPagesAnswer.toLowerCase() === 'y') {
        // Client Build
        console.log('Storefront (client) derleniyor...');
        const clientBuild = runCommand('npm.cmd run build --prefix client');
        
        // Admin Build
        console.log('Admin Dashboard derleniyor...');
        const adminBuild = runCommand('npm.cmd run build --prefix admin');

        if (clientBuild.success) {
            console.log('Storefront (client) Cloudflare Pages\'e deploy ediliyor...');
            const clientDeploy = runCommand('npx wrangler pages deploy client/dist --project-name e-market-client');
            if (clientDeploy.success) {
                console.log('\x1b[32m[✓] Storefront başarıyla deploy edildi!\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Storefront build edilemediğinden deploy atlandı.\x1b[0m');
        }

        if (adminBuild.success) {
            console.log('Admin Dashboard Cloudflare Pages\'e deploy ediliyor...');
            const adminDeploy = runCommand('npx wrangler pages deploy admin/dist --project-name e-market-admin');
            if (adminDeploy.success) {
                console.log('\x1b[32m[✓] Admin Dashboard başarıyla deploy edildi!\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Admin Dashboard build edilemediğinden deploy atlandı.\x1b[0m');
        }
    }

    console.log('\n\x1b[35m========================================================\x1b[0m');
    console.log('\x1b[32m🎉 DEPLOYMENT TAMAMLANDI! 🎉\x1b[0m');
    console.log(`\x1b[36m- API Worker Adresi: ${apiEndpoint}\x1b[0m`);
    console.log('\x1b[36m- Storefront Müşteri Sayfası: https://e-market-client.pages.dev\x1b[0m');
    console.log('\x1b[36m- Admin Dashboard Paneli: https://e-market-admin.pages.dev\x1b[0m');
    console.log('\x1b[35m========================================================\x1b[0m\n');

    rl.close();
}

main().catch(console.error);
