# ⛅ Cloudflare Deployment Guide

E-Market runs entirely on Cloudflare Workers: the API is a Worker, and the
storefront and admin panel are Workers with static assets. Deployments are
done only by the CI/CD pipeline ([CI/CD Pipeline](cicd_pipeline.md)). This
guide covers the one-time setup of the Cloudflare side, for example for a fork.

## Architecture per environment

| Component | Worker name (staging / production) | Custom domain (staging / production) | Bindings |
| --- | --- | --- | --- |
| API | `e-commerce-cloudflare-staging` / `-production` | `staging-api.` / `api.` | D1 `DB`, R2 `IMAGES_BUCKET`, `EMAIL`, cron |
| Storefront | `ecommerce-storefront-staging` / `-production` | `staging.` / apex | static assets (SPA) |
| Admin | `ecommerce-admin-staging` / `-production` | `staging-admin.` / `admin.` | static assets + service binding `API` |

Configuration lives in `api/wrangler.toml`, `client/wrangler.jsonc` and
`admin/wrangler.jsonc`. Each environment has its own D1 database and R2
bucket; `wrangler dev` and `preview_*` bindings use a separate preview D1/R2,
so previews never touch live data.

## One-time setup

### 1. Zone

Add the domain to the Cloudflare account and point the registrar's nameservers
to the two Cloudflare nameservers shown for the zone. Wait until the zone is
**Active**. Workers custom domains create their DNS records and certificates
automatically on the first deploy.

### 2. D1 and R2

```bash
npx wrangler d1 create <project>-d1-staging
npx wrangler d1 create <project>-d1-production
npx wrangler d1 create <project>-d1-preview
npx wrangler r2 bucket create <project>-r2-staging
npx wrangler r2 bucket create <project>-r2-production
npx wrangler r2 bucket create <project>-r2-preview
```

Put the database IDs and bucket names into `api/wrangler.toml` (top level =
preview, `[env.staging]`, `[env.production]`). Run Wrangler from a directory
**without** a Wrangler config when creating resources, or from `api/`, so
commands never pick up the wrong project.

Migrations are applied by the pipeline before each API deploy. Sample data can
be loaded into an environment with:

```bash
cd api
npm run seed:remote -- --env staging
```

`prisma/seed.sql` starts with `DELETE` statements; do not run it against an
environment with real data.

### 3. Cloudflare Access for the admin panel

The admin panel has no password login. Cloudflare Access authenticates admins
and the API verifies the Access token.

1. **Zero Trust → Access → Applications → Add an application → Self-hosted**
   with the hostnames `admin.<domain>` and `staging-admin.<domain>`.
2. Add an **Allow** policy for the admin e-mail addresses (one-time PIN works
   without an identity provider).
3. Recommended: **Settings → Cookies → HTTP Only** and **Binding cookie** on.
4. Set in `api/wrangler.toml` for both environments:
   - `ACCESS_TEAM_DOMAIN` = `<team>.cloudflareaccess.com`
   - `ACCESS_AUD` = the application's Audience tag (also visible as `kid=` in
     the Access login redirect URL)

How it fits together: the admin Worker serves the SPA and forwards `/api/*` to
the API through the `API` service binding, so admin calls are same-origin and
carry Access's `Cf-Access-Jwt-Assertion` header. The API's `adminAuth`
middleware verifies that JWT (RS256, issuer, audience, expiry) against
`https://<team>.cloudflareaccess.com/cdn-cgi/access/certs`. Requests to the
API hostname without a valid assertion get 401; if the `ACCESS_*` values are
missing the admin routes return 503. `workers_dev` and preview URLs are off
for the admin Worker so Access cannot be bypassed.

### 4. GitHub

1. Create an **Account API token** (Manage Account → Account API Tokens) with:
   Workers Scripts Edit, D1 Edit, Workers R2 Storage Edit, Account Settings
   Read, and Zone Workers Routes Edit + Zone Read limited to the domain.
2. Repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
3. Branches `staging` and `production`, protected by a ruleset that requires
   PRs and the pipeline's gate checks.

Pushing to `staging` then deploys staging; promoting `staging` to `production`
via PR deploys production.

## Prerequisites for e-mail

The `EMAIL` (`send_email`) binding needs **Email Routing** enabled on the zone
with a verified destination address before order notifications can be sent.
