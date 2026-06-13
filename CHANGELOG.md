# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Google Services integration documentation (sGTM, GA4, GSC, GMC, Consent Mode v2)
- Google Drive automated backup documentation
- Payment gateway configuration guide (Param POS, iyzico, PayTR)
- KVKK & GDPR compliance documentation
- Pull request template for open-source contributions
- English translations of GitHub issue templates

### Changed
- Cleaned up `.gitignore` — added `.wrangler/`, backup artifact patterns, and `skills-lock.json`
- Removed `api/scratch/` debug scripts from version control

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
