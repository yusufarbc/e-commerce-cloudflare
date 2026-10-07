# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

---

## [1.3.0] — 2026-10-07

### Changed
- Order numbers have 10 digits from a CSPRNG instead of 6 from `Math.random()` (fewer collisions on the unique column, not guessable)
- Stock is taken out when a payment is confirmed and put back when a paid order is cancelled and refunded

### Fixed
- Checkout accepted inactive or out-of-stock products and silently dropped unknown product ids; these now return 400 with a message the storefront shows
- Updating only the admin note of a return request reset the order status to `IADE_TALEP_EDILDI`
- Public product detail (`/products/:id`, by slug) returned inactive products; they now return 404
- Admin product create/update accepted negative, zero or non-numeric prices, stock and weight; these now return 400

### Security
- `GET /api/v1/settings` returned `googleMerchantToken`, the secret that protects the product feed; the public endpoint now leaves it out (the admin endpoint still returns it)
- Admin image uploads take their type and extension from the file's magic bytes (WebP, JPEG, PNG only, at most 5 MB) instead of the client-supplied name and MIME type, so SVG or HTML cannot be stored on the CDN
- The product description was rendered with `dangerouslySetInnerHTML` without sanitizing (stored XSS on the storefront, where card data is entered); it now goes through DOMPurify
- The Google Shopping feed token is compared in constant time, and the feed response is `Cache-Control: private` because its URL carries the token

---

## [1.2.0] — 2026-10-07

### Added
- Optional Resend e-mail provider (`EMAIL_PROVIDER = "resend"`)
- Migration `0005_schema_sync.sql` and a test that compares the migrations with the Prisma schema

### Changed
- Major dependency upgrades: Prisma 5 → 7 (the generated client is no longer committed; `predev`/`pretest` run `prisma generate`), Tailwind CSS 3 → 4, React 18 → 19, ESLint 8 → 10 (flat config), vitest 4 → 5, i18next 25 → 26, react-i18next 16 → 17, concurrently 8 → 10
- `npm audit` for the API needs `overrides` for two transitive dependencies of the Prisma CLI (`deepmerge-ts`, `mysql2`); remove them when Prisma ships fixed versions
- The root `package.json` overrides `shell-quote` (pinned to 1.9.0 by `concurrently`, GHSA-pqg4-j6r4-53mv); remove the override when `concurrently` ships a fixed version

### Fixed
- `GET /api/v1/settings` returned 500 and order status history could not be written, because the D1 schema had drifted from the Prisma schema
- E-mails sent through the Cloudflare binding were rejected (`invalid message-id`); the messages now carry `Date` and `Message-ID`
- WhatsApp and Facebook share icons on the product page were invisible (invalid `w-4.5` classes that Tailwind 3 ignored)
- Cancelling a paid order never refunded it (the payment reference was stored in `odemeTokeni`, the refund read `odemeId`); a paid order is now cancelled only after the gateway confirms the refund
- iyzico refunds called `/payment/refund` with a payment id, which that endpoint does not accept; they now use `/payment/cancel`. PayTR refunds sent `refund_amount=0.00` instead of `return_amount` with the charged amount. Param falls back from a void to a refund with the amount

### Security
- Param POS callbacks were accepted on `mdStatus=1` alone, so a forged POST to `/api/v1/payment/callback/param/success` marked any order as paid. The callback hash (`islemHash`) is now verified and the payment is completed server-to-server with `TP_WMD_Pay`
- The iyzico callback took the order number from the browser-submitted `conversationId`, so a payment for a cheap order could be applied to an expensive one. The order number and amount now come from iyzico's `3dsecure/auth` response (`basketId`, `paidPrice`)
- With PayTR not configured, notifications were checked against an HMAC with an empty key and salt, which anyone can compute; an unconfigured provider now rejects every notification. Signatures are compared in constant time
- Paid amounts are compared with the order total, and an order moves from `BEKLEMEDE` to paid in one conditional update. Replayed or concurrent callbacks no longer re-send e-mails or revive cancelled orders; a verified payment that cannot be applied is refunded

---

## [1.1.0] — 2026-10-02

### Added
- Fail-closed DevSecOps pipeline (`.github/workflows/devsecops-pipeline.yml`): actionlint and zizmor, Gitleaks over the full history, OSV-Scanner and npm audit, Semgrep CE with pinned community rules, Opengrep with Cloudflare Workers taint rules (`security/opengrep/`), CodeQL, Trivy, a Conftest policy for `wrangler.toml` (`security/policy/`), CycloneDX SBOMs, and a post-deploy OWASP ZAP baseline scan
- Two environments, `staging` and `production`, each deployed from its own branch; production deployments require reviewer approval
- Cloudflare Access for the admin dashboard; the API verifies the Access JWT
- Per-IP rate limiting with the Workers Rate Limiting binding
- Security headers on the API (`secureHeaders`) and on the storefront and admin (`public/_headers`)
- Server-side validation of the checkout body (zod schema)
- Required local Gitleaks pre-commit hook with a checksum-verified installer (`scripts/install-gitleaks.sh`)
- Guides for Google services, Google Drive backups, payment gateways and KVKK/GDPR (Turkish)

### Changed
- Storefront and admin moved from Cloudflare Pages to Workers static assets
- Canonical URLs, structured data, sitemap links and contact addresses use the project domain `ecommerceflaredev.web.tr`
- Backup workflow runs on Node.js 22 with a pinned Wrangler and passes the GPG passphrase on stdin
- Local seeding uses Wrangler and `prisma/seed.sql` against the local D1 database
- Documentation moved under `docs/` and translated to Turkish; security tool configuration moved under `security/`

### Removed
- Password-based admin login and its secrets
- Unused `soap` dependency, legacy Express rate limiter, unused components and utilities, the committed `prisma/dev.db` and `prisma/seed.js`
- Research corpus and experiment workflows (moved to a separate repository)

### Security
- Plaintext JWT secret, default admin password, reflected CORS origin and an unauthenticated debug endpoint removed
- GTM proxy builds its URL from a fixed host and an allowlisted container id (SSRF)
- Customer data escaped in e-mail HTML, the sitemap, the Param SOAP body and the PayTR form; CR/LF stripped from e-mail headers
- Storefront product cards strip HTML with `DOMParser` instead of `innerHTML` (DOM XSS)
- Analytics proxy masks values under personal-data keys (name, address) completely

---

## [1.0.0] — 2026-06-13

### Added

#### 🏗️ Architecture
- Fully serverless monorepo architecture on the **Cloudflare Ecosystem** (Workers, D1, R2, Pages)
- Hono-based REST API with zero cold-start on V8 isolates
- Prisma ORM with `@prisma/adapter-d1` for serverless SQLite (Cloudflare D1)
- R2 object storage for product images with zero egress fees
- Automated CI/CD pipeline via GitHub Actions (test → staging, main → production)
- Cloudflare Cron Trigger for nightly sitemap cache warming

#### 🛍️ Storefront (`client/`)
- React + Vite storefront with Tailwind CSS
- Progressive Web App (PWA) with offline capability
- Product listing, detail, cart, checkout, and order tracking pages
- Turkish language UI targeting Turkey market (TRY currency, KVKK-compliant)

#### 🖥️ Admin Dashboard (`admin/`)
- React + Vite SPA with light/dark mode
- Full product, category, and brand management (CRUD with R2 image uploads)
- Order management with status tracking and return processing
- Interactive statistics dashboard with charts
- JWT-authenticated session management (24-hour token validity)

#### 🔌 Backend API (`api/`)
- Modular route architecture (products, categories, brands, orders, returns, settings, feeds, metrics)
- Three-gateway payment integration: **Param POS** (SOAP), **iyzico** (REST), **PayTR** (HMAC)
- Switchable payment provider via single `PAYMENT_PROVIDER` environment variable
- Server-Side GTM proxy (`/api/v1/metrics/gtm.js`) for first-party analytics
- GA4 event collection endpoint (`/api/v1/metrics/collect`) with KVKK edge filtering
  - IP masking (last octet zeroed before forwarding)
  - PII scrubbing (email/phone regex removal)
- Dynamic Google Merchant Center XML feed (`/api/v1/catalog/google-feed`)
- Dynamic XML sitemap generation (`/sitemap.xml`) with product and category URLs
- JSON-LD structured data support for rich search results
- Brevo (formerly Sendinblue) transactional email integration for order notifications
- Two staging/production environments via `wrangler.toml` `[env.*]` blocks

#### 🔒 Security & Compliance
- KVKK-compliant edge telemetry with IP masking and PII scrubbing
- Semgrep SAST scanning in CI (ReDoS, Format String, Shell Injection checks)
- CodeQL static analysis via GitHub Advanced Security
- Dependabot for automated dependency updates
- Symmetric GPG-encrypted nightly database backups to Google Drive

#### 📚 Documentation
- Comprehensive README with architecture diagram, quickstart, and deployment guide
- CI/CD pipeline documentation with Mermaid flow diagram
- Cloudflare deployment guide

[Unreleased]: https://github.com/yusufarbc/e-commerce-cloudflare/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yusufarbc/e-commerce-cloudflare/releases/tag/v1.0.0
