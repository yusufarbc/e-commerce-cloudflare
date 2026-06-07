# ⛅ Cloudflare Serverless E-Commerce Deployment Guide

This guide describes the step-by-step process to deploy the **E-Market** monorepo project fully serverless onto the Cloudflare ecosystem (Workers, Pages, D1 Database, R2 Storage).

---

## 📋 Prerequisites

Before starting, ensure that the following requirements are met:
1. A **Cloudflare Account** (Free or Paid plan).
2. **Node.js** (v18+) and **NPM** installed locally.
3. A **Custom Domain** configured and active on Cloudflare (required for email routing and asset CDN).
4. Cloudflare **Email Routing** enabled for your domain.

---

## ⚡ Method 1: Automatic Deployment (Recommended)

You can deploy the entire stack with a single interactive script that automates the whole wizard:

```bash
npm run deploy
```

**This wizard automatically performs the following steps:**
1. Checks your Cloudflare authentication (triggers `wrangler login` if not logged in).
2. Creates your D1 SQL Database and R2 Image Bucket.
3. Applies database schemas and migrations to the remote D1 instance.
4. Updates your `server/api/wrangler.toml` file with the newly generated D1 database UUID.
5. Deploys the Workers Hono API and retrieves the production Worker URL.
6. Sets up proxy redirects (`_redirects` file) in client and admin frontend projects to prevent CORS issues.
7. Builds both frontend applications and deploys them to Cloudflare Pages.

---

## 🛠️ Method 2: Step-by-Step Manual Deployment

If you prefer to run commands manually, follow these steps in order:

### Step 1: Install Dependencies and Authenticate Wrangler

Install all required node packages recursively and authenticate the wrangler CLI:

```bash
# Install all sub-project dependencies concurrently
npm run install:all

# Login to your Cloudflare account
npx wrangler login
```

### Step 2: Create D1 Database

1. Create a production D1 Database instance:
   ```bash
   npx wrangler d1 create ecommerce-d1
   ```
2. Copy the generated `database_id` UUID from the CLI output and paste it inside [server/api/wrangler.toml](file:///c:/Users/yusuf/Github/e-commerce-cloudflare/server/api/wrangler.toml):
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "ecommerce-d1"
   database_id = "YOUR_CLOUDFLARE_D1_DATABASE_UUID"
   ```
3. Apply schema migrations to your remote production D1 database:
   ```bash
   npx wrangler d1 migrations apply DB --remote --cwd server/api
   ```

### Step 3: Create R2 Storage Bucket

Create an R2 storage bucket for housing product assets, images, and logos:

```bash
npx wrangler r2 bucket create ecommerce-r2
```

> [!IMPORTANT]
> To allow direct client-side canvas uploads and media loading, go to the Cloudflare Dashboard, navigate to R2 settings, configure **CORS** headers to allow your storefront and admin Pages URLs, and set up a **Custom Domain** or **Public URL** for CDN access.

### Step 4: Deploy Workers API and Configure Secrets

1. Deploy the backend Hono API Workers bundle:
   ```bash
   cd server/api
   npx wrangler deploy
   ```
   *The command will output your live API endpoint, e.g., `https://ecommerce-api.username.workers.dev`.*

2. Define required production secrets and environment variables on the deployed worker:
   ```bash
   # Secure admin session token secret
   npx wrangler secret put ADMIN_JWT_SECRET
   
   # Admin dashboard credentials (defaults: admin@e-market.com / admin12345)
   npx wrangler secret put ADMIN_EMAIL
   npx wrangler secret put ADMIN_PASSWORD
   
   # Param POS Credentials (if checkout payment integration is active)
   npx wrangler secret put PARAM_CLIENT_CODE
   npx wrangler secret put PARAM_CLIENT_USERNAME
   npx wrangler secret put PARAM_CLIENT_PASSWORD
   npx wrangler secret put PARAM_GUID
   ```

3. **Email Routing Sending Permissions:**
   For transactional emails to deliver successfully, go to Cloudflare Dashboard > **Email Routing** and verify the sender address configured in your environment settings (e.g., `siparis@yourdomain.com`).

### Step 5: Configure Proxy Redirects and Deploy Frontends

1. **Create `_redirects` files:**
   Write redirect proxy rules inside `client/public/_redirects` and `admin/public/_redirects` to route `/api/*` requests to your live Worker URL to prevent browser CORS block:
   ```text
   /api/* https://ecommerce-api.username.workers.dev/api/:splat 200
   ```
2. **Build frontend applications:**
   ```bash
   # Build storefront client app
   npm run build --prefix client
   
   # Build admin dashboard app
   npm run build --prefix admin
   ```
3. **Deploy build outputs to Cloudflare Pages:**
   ```bash
   # Deploy storefront
   npx wrangler pages deploy client/dist --project-name e-market-client
   
   # Deploy admin panel
   npx wrangler pages deploy admin/dist --project-name e-market-admin
   ```

---

## 🔍 Post-Deployment Verification

After successful deployment, verify the following details:
1. **Database Seeding:** Run system seeds to populate default settings and color charts to the production database.
2. **Admin Dashboard Login:** Navigate to your deployed admin Pages URL and authenticate using your admin credentials.
3. **Image Uploads:** Create a test product and upload an image to confirm canvas compression and direct R2 upload flows.
4. **Checkout Integration:** Add a product to the cart, fill in shipping info, and proceed to checkout to verify Param POS gateway connection.
