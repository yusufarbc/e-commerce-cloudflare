# 🚀 CI/CD Pipeline

All builds and deployments run through one fail-closed GitHub Actions workflow:
[`.github/workflows/devsecops-pipeline.yml`](../.github/workflows/devsecops-pipeline.yml).
The design and the role of each tool are described in
[`DEVSECOPS_PIPELINE.MD`](../DEVSECOPS_PIPELINE.MD).

There is no other deploy path: no local deploy script and no Cloudflare Git
integration, so code reaches Cloudflare only after every gate is green.

## Branches and environments

| Branch | Environment | Storefront | Admin | API |
| --- | --- | --- | --- | --- |
| `staging` | staging | staging.ecommerceflaredev.web.tr | staging-admin.ecommerceflaredev.web.tr | staging-api.ecommerceflaredev.web.tr |
| `production` (default) | production | ecommerceflaredev.web.tr | admin.ecommerceflaredev.web.tr | api.ecommerceflaredev.web.tr |

Flow: feature branch → PR to `staging` → merge deploys staging → PR
`staging` → `production` → merge deploys production. Dependabot also opens its
PRs against `staging`.

Both branches are protected by the `protect-production-staging` ruleset: no
deletion, no force-push, changes only via PR, and the five gate checks below
must pass.

## Flow

```mermaid
graph LR
    H[Pipeline hygiene<br/>actionlint + zizmor] --> B
    S[Secrets & dependencies<br/>Gitleaks, OSV-Scanner, npm audit] --> B
    C[SAST & config<br/>Semgrep CE, Trivy] --> B
    Q[SAST<br/>CodeQL] --> B
    B[Build and test<br/>Prisma, vitest, lint, build] --> DA[Deploy API<br/>D1 migrations + Worker]
    DA --> DF[Deploy frontends<br/>storefront + admin Workers]
```

The four gate jobs run in parallel; `Build and test` needs all of them, and the
deploy jobs run only on a **push** to `staging` or `production`. Pull requests
run every gate and the build, never a deploy.

## Jobs

| Job | What it does | Fails on |
| --- | --- | --- |
| Pipeline hygiene | actionlint, zizmor (pinned binaries, checksum-verified) | any medium+ zizmor finding |
| Secrets and dependencies | Gitleaks over full history, OSV-Scanner, `npm audit --audit-level=high` in root/api/client/admin | any leak, any OSV finding, high/critical audit |
| SAST and config | Semgrep CE (`p/javascript`, `p/typescript`, `p/owasp-top-ten`), Trivy misconfig | any Semgrep finding, HIGH/CRITICAL misconfig |
| SAST (CodeQL) | CodeQL `javascript-typescript` | analysis failure |
| Build and test | `npm run ci:all`, `prisma validate/generate`, `npm test` (api), lint and build of client/admin with the environment's `VITE_API_URL` | any step |
| Deploy API | `wrangler d1 migrations apply DB --remote`, `wrangler deploy --env <env>` | any step |
| Deploy frontends | `wrangler deploy --env <env>` in `client/` and `admin/` (Workers static assets) | any step |

The research corpus under `research/` is intentionally vulnerable and is
excluded from Semgrep, Trivy, Gitleaks and CodeQL here; it is measured by
`security-research.yml` instead.

## Versions

All actions are pinned to commit SHAs; Docker images and binaries are pinned by
version and checksum or digest. Node.js 22.23.3 and Wrangler 4.145.0 are set
in the workflow `env`.

## Secrets

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Account API token, least privilege: Workers Scripts, D1, Workers R2 Storage (Edit), Account Settings (Read), Zone Workers Routes (Edit) and Zone (Read) on `ecommerceflaredev.web.tr` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

The application itself has no deploy-time secrets: admin access is handled by
Cloudflare Access (see the deployment guide).

## Other workflows

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `workflow-security.yml` | PRs touching workflows | actionlint and zizmor report |
| `research-checks.yml` | PRs touching `research` | ground-truth schema and analysis tests |
| `security-research.yml` | manual | research measurement pipeline (all scanners, SARIF, timings) |
| `backup.yml` | manual | encrypted export of the production D1 to Google Drive |
