# ⚡ E-Market: Serverless E-Commerce Platform on Cloudflare

E-Market is a modern, high-performance, fully serverless e-commerce framework designed to deploy and run entirely within the **Cloudflare Ecosystem**. 

Unlike traditional monoliths or containerized setups, E-Market leverages lightweight V8 isolates (**Cloudflare Workers**), serverless SQL databases (**Cloudflare D1**), free-egress object storage (**Cloudflare R2**), and static assets served from Workers at the edge to deliver sub-millisecond response times, absolute privacy compliance, and near-zero running costs.

This project is open-source, fully responsive, and works as a Progressive Web App (PWA) out-of-the-box. It is also a reference implementation of a fail-closed DevSecOps pipeline built entirely from free tools.

---

## 📐 System Architecture

Below is the serverless architecture diagram showing how the client storefront, admin dashboard, Hono API, databases, telemetry proxies, and third-party integrations interact:

```mermaid
graph TD
    classDef cfPages fill:#deff36,stroke:#191919,stroke-width:2px,color:#191919
    classDef cfWorkers fill:#f6821f,stroke:#fff,stroke-width:1px,color:#fff
    classDef external fill:#1e1e24,stroke:#555,stroke-width:1px,color:#ccc

    Storefront["Storefront\nReact PWA - Workers static assets"]:::cfPages
    Access["Cloudflare Access\nZero Trust sign-in"]:::cfWorkers
    Admin["Admin Dashboard\nReact SPA + proxy Worker"]:::cfPages
    API["Workers API & sGTM\nHono - Cloudflare Workers"]:::cfWorkers
    D1[("D1 Database\nCloudflare SQLite")]:::cfWorkers
    R2["R2 Object Storage\nCloudflare Assets"]:::cfWorkers
    Email["Email Sending\nCloudflare Email Routing"]:::cfWorkers
    Gateways["Switchable Gateway\nPayTR / iyzico / Param"]:::external
    GA4["Google Analytics 4\nEdge Sanitized"]:::external

    Storefront -->|HTTPS REST| API
    Access -->|Signed JWT| Admin
    Admin -->|Service binding, Access JWT verified| API
    API -->|Prisma D1 Adapter| D1
    API -->|R2 Binding PUT| R2
    API -->|Send Email Binding| Email
    API -->|REST / SOAP via Fetch| Gateways
    Storefront -->|Telemetry Hits| API
    API -->|KVKK Masked IP/PII| GA4
```

---

## 🛠️ Core Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Storefront** | React, Vite, PWA, Tailwind CSS | Fully responsive storefront, SEO-optimized, with PWA offline-capability and multilingual support. |
| **Admin Panel** | React, Vite, CSS, Lucide | Premium, light/dark mode switchable dashboard with interactive charts and direct R2 image uploads. |
| **API Backend** | Hono Framework | Ultra-fast REST API designed for V8 isolates, providing zero cold start. |
| **Database** | Cloudflare D1 & Prisma ORM | Serverless SQL database using Prisma with `@prisma/adapter-d1`. |
| **Asset Storage** | Cloudflare R2 | S3-compatible object storage for product images with zero egress fees. |
| **Edge Telemetry** | Server-Side GTM & KVKK Filter | Proxy-loads GTM scripts and routes GA4 analytics events through Worker middleware to mask IPs and scrub PII. |
| **Gateways** | PayTR / iyzico / Param | Decoupled payment provider interface switchable via a single configuration. |

---

## 📁 Repository Structure

```text
e-commerce-cloudflare/
├── client/              # React storefront (Workers static assets, PWA)
├── admin/               # React admin dashboard + proxy Worker (behind Cloudflare Access)
├── api/                 # Hono REST API Worker
│   ├── migrations/      # D1 SQL migrations (applied by the pipeline)
│   ├── prisma/          # Prisma schema and seed data (seed.sql)
│   └── src/             # Routes, controllers, services, repositories, middlewares
├── security/            # Opengrep rules, Conftest policy, ZAP overrides
├── docs/                # Guides (Turkish)
├── scripts/             # Gitleaks installer, Google Drive backup uploader
├── .github/             # DevSecOps pipeline, backup workflow, Dependabot, templates
└── package.json         # Monorepo scripts
```

---

## 🚀 Local Development Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) 22 or higher (required by Wrangler 4)
- [NPM](https://www.npmjs.com/)
- Cloudflare Wrangler CLI (installed automatically)

### 1. Install Dependencies
Install all node modules recursively across the monorepo:
```bash
npm run install:all
```

### 2. Set Up the Local D1 Database
Generate the Prisma client and apply the migrations to a local D1 instance:
```bash
(cd api && npx prisma generate)
npm run db:migrate
```

### 3. Seed Database
Load the sample categories, brands, products and store settings (`api/prisma/seed.sql`):
```bash
npm run db:seed
```

### 4. Install the Pre-commit Secret Scanner
The pre-commit hook refuses commits when Gitleaks is missing. Install the version CI uses (checksum-verified, into the gitignored `.tools/`):
```bash
sh scripts/install-gitleaks.sh
```

### 5. Start Development Servers
Run all applications (Storefront, Admin, and Workers API) concurrently:
```bash
npm run dev
```

Your local endpoints will be available at:
- **Workers API:** `http://localhost:8787`
- **Storefront:** `http://localhost:3000`
- **Admin Panel:** `http://localhost:5173`

Admin API routes are protected by Cloudflare Access and return `503` locally
unless `ACCESS_TEAM_DOMAIN` / `ACCESS_AUD` are set (see `api/.dev.vars.example`).

---

## 🌐 Environments

Deployed by the CI/CD pipeline after all security gates pass:

| | Staging (`staging` branch) | Production (`production` branch) |
| --- | --- | --- |
| Storefront | [staging.ecommerceflaredev.web.tr](https://staging.ecommerceflaredev.web.tr) | [ecommerceflaredev.web.tr](https://ecommerceflaredev.web.tr) |
| Admin Panel | [staging-admin.ecommerceflaredev.web.tr](https://staging-admin.ecommerceflaredev.web.tr) | [admin.ecommerceflaredev.web.tr](https://admin.ecommerceflaredev.web.tr) |
| API | [staging-api.ecommerceflaredev.web.tr](https://staging-api.ecommerceflaredev.web.tr/api/v1/health) | [api.ecommerceflaredev.web.tr](https://api.ecommerceflaredev.web.tr/api/v1/health) |

### 🔐 Admin access
The admin panel has no username/password. Sign-in is handled by **Cloudflare
Access** (one-time PIN to an allowed e-mail address); the API verifies the
signed Access token on every admin request. Access is granted by the
repository owner.

---

## 💳 Payment Gateway Configurations

E-Market includes ready-to-use integrations for Turkey's leading payment gateways (Param POS, iyzico, PayTR). The provider is selected per environment with the `PAYMENT_PROVIDER` var in `api/wrangler.toml`:

```toml
[env.staging.vars]
PAYMENT_PROVIDER = "iyzico"   # param | iyzico | paytr
IYZICO_BASE_URL = "https://sandbox-api.iyzipay.com"
```

Credentials are never stored in `vars`; set them as secrets
(`npx wrangler secret put IYZICO_API_KEY --env staging`) or, for local
development, in `api/.dev.vars`. The pipeline's Conftest policy blocks a deploy
if a secret-like key appears in `vars`. See
[Payment Gateways](docs/payment_gateways.md) for every variable and the 3D
Secure flow.

---

## 🧪 Test Kartları (Staging Ortamı)

Staging ortamında ödeme testi yapmak için kullanabileceğiniz kart numaraları:

### ✅ Başarılı Ödeme Kartları
| Kart Numarası | Banka / Açıklama |
|:---|:---|
| `5526 0800 0000 0006` | Akbank (Kredi Kartı) |
| `5890 0400 0000 0016` | Akbank (Banka Kartı) |
| `4543 5900 0000 0006` | İş Bankası (Kredi Kartı) |
| `6501 7001 9414 7183` | Vakıfbank (Troy Kredi) |
| `5451 0300 0000 0000` | Yapı Kredi (Kredi Kartı) |

### ✗ Hata Simülasyon Kartları
| Kart Numarası | Hata |
|:---|:---|
| `4111 1111 1111 1129` | Yetersiz Bakiye |
| `4125 1111 1111 1115` | Süresi Geçmiş Kart |
| `4124 1111 1111 1116` | Geçersiz CVC |
| `4151 1111 1111 1112` | 3D Secure Başlatma Hatası |

**Tüm kartlar için:** Son Kullanma Tarihi: `12/26`, CVC: `123`

---

## 🛡️ Edge Telemetry & KVKK Compliance

E-Market enforces data privacy natively at the edge. 

- **Proxy Routing:** Client-side telemetry is loaded from `/api/v1/metrics/gtm.js` and events are sent to `/api/v1/metrics/collect`.
- **IP Masking:** The last IPv4 octet (`203.0.113.42` → `203.0.113.0`) or the IPv6 interface identifier is removed before anything is forwarded to analytics.
- **PII Scrubbing:** E-mail addresses and phone numbers are masked in free text, and values under personal-data keys (name, address, e-mail, phone, national ID) are replaced whole.
- **Consent:** Add a consent management platform before going live; see [Google Services](docs/google_services.md#6-kvkk-uyumlu-consent-mode-v2).

---

## 💾 Automated Database Backups to Google Drive

E-Market includes a backup workflow (`.github/workflows/backup.yml`) that exports the production D1 database, compresses it (`gzip`) and encrypts it with GPG (AES-256). The encrypted file is uploaded to a Google Drive folder by a dependency-free Node.js utility (`scripts/uploadToDrive.js`). In the demo it runs on demand; uncomment the `schedule` block for nightly backups.

### Configuration
To configure the backup pipeline, add the following Repository Secrets to your GitHub repository:
- `CLOUDFLARE_API_TOKEN`: A Cloudflare token with edit permissions for your D1 Database.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.
- `BACKUP_ENCRYPTION_PASSPHRASE`: A strong passphrase used to encrypt your backup file symmetrically using GPG.
- `GDRIVE_SERVICE_ACCOUNT`: The full JSON key contents of your Google Cloud Service Account.
- `GDRIVE_FOLDER_ID`: (Optional) The folder ID of your target Google Drive folder.

*Note: Remember to share the target Google Drive backup folder with your service account email address (with Editor role) to grant permission.*

---

## 🚦 Branches, CI/CD and Deployment

`staging` and `production` are the only long-lived branches. Changes go
feature branch → PR to `staging` → PR `staging` → `production`; both branches
are protected (PR required, no force-push or deletion, gate checks required).

Every PR and push runs the fail-closed DevSecOps pipeline: workflow linting
(actionlint, zizmor), secret scanning (Gitleaks), dependency scanning
(OSV-Scanner, npm audit), SAST (Semgrep CE with pinned rules, Opengrep with
custom Cloudflare Workers taint rules, CodeQL), config scanning (Trivy) and a
Conftest policy for `wrangler.toml`, then Prisma validation, API tests, lint,
builds and CycloneDX SBOMs. A push to `staging` or `production` additionally
applies D1 migrations, deploys the API, storefront and admin Workers to that
environment (production waits for reviewer approval), and runs an OWASP ZAP
baseline DAST scan against the deployed storefront and API. At runtime the API
enforces per-IP rate limits through the Workers Rate Limiting binding. Every
tool in the chain is free.

There is no manual deploy script: deployments happen only through the
pipeline. See [CI/CD Pipeline](docs/cicd_pipeline.md),
[Cloudflare Deployment Guide](docs/cloudflare_deployment_guide.md) and
[DevSecOps Pipeline Design](docs/devsecops_pipeline.md).

---

## 📚 Documentation

Detailed guides for every aspect of E-Market are available in the [`docs/`](docs/) directory:

The guides are written in Turkish.

| Guide | Description |
| :--- | :--- |
| [CI/CD Pipeline](docs/cicd_pipeline.md) | GitHub Actions workflow stages, job dependencies, and secrets setup |
| [DevSecOps Pipeline Design](docs/devsecops_pipeline.md) | Tool-by-tool design, supply-chain hardening, runtime protection, WAF runbook |
| [Cloudflare Deployment Guide](docs/cloudflare_deployment_guide.md) | One-time Cloudflare setup: zone, D1/R2 per environment, Cloudflare Access, API token |
| [Google Services Integration](docs/google_services.md) | sGTM proxy on Workers, GA4, Search Console, Merchant Center, Consent Mode v2 |
| [Google Drive Backup](docs/google_drive_backup.md) | Automated encrypted D1 database backup pipeline to Google Drive |
| [Payment Gateways](docs/payment_gateways.md) | Param POS, iyzico, and PayTR configuration and 3D Secure flows |
| [KVKK & GDPR Compliance](docs/kvkk_compliance.md) | Edge IP masking, PII scrubbing, consent management, and data inventory |

---

## 🤝 Contributing

We welcome contributions to E-Market! Please refer to our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) for standards.

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for more information.
