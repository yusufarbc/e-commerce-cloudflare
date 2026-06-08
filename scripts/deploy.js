import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * Executes a terminal command synchronously and returns the output.
 * @param {string} command - Command to run.
 * @param {string} cwd - Current working directory.
 * @returns {Object} Execution result wrapper.
 */
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
    console.log('\x1b[35m⚡ E-MARKET CLOUDFLARE SERVERLESS DEPLOY WIZARD ⚡\x1b[0m');
    console.log('\x1b[35m========================================================\x1b[0m\n');

    // 1. Authentication Check
    console.log('1. Checking Cloudflare authentication status...');
    const authCheck = runCommand('npx wrangler whoami');
    if (!authCheck.success || authCheck.output.includes('You are not authenticated')) {
        console.log('\n\x1b[33m[!] You are not authenticated with Cloudflare. Opening login page in your browser...\x1b[0m');
        runCommand('npx wrangler login');
        
        // Recheck authentication status
        const secondAuthCheck = runCommand('npx wrangler whoami');
        if (!secondAuthCheck.success || secondAuthCheck.output.includes('You are not authenticated')) {
            console.log('\x1b[31m[❌] Login failed. Please run "npx wrangler login" manually in your terminal and try again.\x1b[0m');
            rl.close();
            return;
        }
    }
    console.log('\x1b[32m[✓] Authentication successful.\x1b[0m');

    // 2. D1 Database Creation
    const createDbAnswer = await askQuestion('\n2. Do you want to create a D1 Database? (y/n): ');
    let dbId = '';
    if (createDbAnswer.toLowerCase() === 'y') {
        const dbName = 'ecommerce-d1';
        console.log(`Creating D1 database: ${dbName}...`);
        const dbResult = runCommand(`npx wrangler d1 create ${dbName}`);
        
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
                    tomlContent = tomlContent.replace(/database_id = ".*"/, `database_id = "${dbId}"`);
                    fs.writeFileSync(tomlPath, tomlContent, 'utf8');
                    console.log('\x1b[32m[✓] Updated wrangler.toml with new database_id.\x1b[0m');
                }
            } else {
                console.log('\x1b[33m[!] Database created but UUID could not be resolved from output. Please write it manually in wrangler.toml.\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Failed to create D1 Database. If it already exists, you can proceed manually.\x1b[0m');
        }
    }

    // 3. R2 Bucket Creation
    const createR2Answer = await askQuestion('\n3. Do you want to create an R2 Object Storage Bucket for images? (y/n): ');
    if (createR2Answer.toLowerCase() === 'y') {
        console.log('Creating R2 bucket: ecommerce-r2...');
        const r2Result = runCommand('npx wrangler r2 bucket create ecommerce-r2');
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
        const migrateResult = runCommand('npx wrangler d1 migrations apply DB --remote --cwd api');
        if (migrateResult.success) {
            console.log('\x1b[32m[✓] Database migrations applied successfully.\x1b[0m');
        } else {
            console.log('\x1b[31m[❌] Error applying database migrations.\x1b[0m');
        }
    }

    // 5. Workers API Deployment
    const deployApiAnswer = await askQuestion('\n5. Do you want to deploy the Workers API (Hono) to Cloudflare? (y/n): ');
    let apiEndpoint = '';
    if (deployApiAnswer.toLowerCase() === 'y') {
        console.log('Deploying Workers API...');
        const deployResult = runCommand('npx wrangler deploy --cwd api');
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
        apiEndpoint = await askQuestion('\n[?] Please enter your Workers API base URL (e.g. https://ecommerce-api.user.workers.dev): ');
    }

    // 6. Write _redirects Files (Prevents CORS via Pages Proxy Yönlendirme)
    console.log('\n6. Generating _redirects proxy rules...');
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

    // 7. Pages Build & Deploy
    const deployPagesAnswer = await askQuestion('\n7. Do you want to build and deploy storefront and admin panels to Cloudflare Pages? (y/n): ');
    if (deployPagesAnswer.toLowerCase() === 'y') {
        // Client Build
        console.log('Building storefront client app...');
        const clientBuild = runCommand('npm.cmd run build --prefix client');
        
        // Admin Build
        console.log('Building admin dashboard app...');
        const adminBuild = runCommand('npm.cmd run build --prefix admin');

        if (clientBuild.success) {
            console.log('Deploying Storefront to Cloudflare Pages...');
            const clientDeploy = runCommand('npx wrangler pages deploy client/dist --project-name e-market-client');
            if (clientDeploy.success) {
                console.log('\x1b[32m[✓] Storefront deployed successfully!\x1b[0m');
            }
        } else {
            console.log('\x1b[31m[❌] Skipping Storefront deployment due to build error.\x1b[0m');
        }

        if (adminBuild.success) {
            console.log('Deploying Admin Dashboard to Cloudflare Pages...');
            const adminDeploy = runCommand('npx wrangler pages deploy admin/dist --project-name e-market-admin');
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
    console.log('\x1b[36m- Storefront Pages: https://e-market-client.pages.dev\x1b[0m');
    console.log('\x1b[36m- Admin Pages: https://e-market-admin.pages.dev\x1b[0m');
    console.log('\x1b[35m========================================================\x1b[0m\n');

    rl.close();
}

main().catch(console.error);
