# 🚀 CI/CD Hattı

Tüm build ve deploy işlemleri, fail-closed çalışan tek bir GitHub Actions
workflow'undan geçer:
[`.github/workflows/devsecops-pipeline.yml`](../.github/workflows/devsecops-pipeline.yml).
Tasarım ve her aracın rolü [`devsecops_pipeline.md`](devsecops_pipeline.md)
dosyasında anlatılır.

Başka bir deploy yolu yoktur: yerel deploy betiği ve Cloudflare Git
entegrasyonu bulunmaz. Kod Cloudflare'e ancak tüm kapılar yeşil olduğunda
ulaşır.

## Dallar ve ortamlar

| Dal | Ortam | Vitrin | Admin | API |
| --- | --- | --- | --- | --- |
| `staging` | staging | staging.ecommerceflaredev.web.tr | staging-admin.ecommerceflaredev.web.tr | staging-api.ecommerceflaredev.web.tr |
| `production` (varsayılan) | production | ecommerceflaredev.web.tr | admin.ecommerceflaredev.web.tr | api.ecommerceflaredev.web.tr |

Akış: özellik dalı → `staging`'e PR → merge staging'e deploy eder →
`staging` → `production` PR'ı → merge production'a deploy eder. Dependabot da
PR'larını `staging`'e açar.

İki dal da `protect-production-staging` ruleset'iyle korunur: silme ve
force-push yasaktır, değişiklik yalnızca PR ile yapılır ve aşağıdaki beş kapı
check'i geçmelidir. Her GitHub ortamı yalnızca kendi dalından deploy kabul
eder. `production` ortamı reviewer onayı ister: production yayını API
deploy'undan önce ve frontend deploy'undan önce olmak üzere iki kez onay
bekler.

## Akış

```mermaid
graph LR
    H[Pipeline hijyeni<br/>actionlint + zizmor] --> B
    S[Sırlar ve bağımlılıklar<br/>Gitleaks, OSV-Scanner, npm audit] --> B
    C[SAST ve config<br/>Semgrep CE, Opengrep, Trivy, Conftest] --> B
    Q[SAST<br/>CodeQL] --> B
    B[Build ve test<br/>Prisma, vitest, lint, build, SBOM] --> DA[API deploy<br/>D1 migration + Worker]
    DA --> DF[Frontend deploy<br/>vitrin + admin Worker'ları]
    DF --> Z[DAST<br/>OWASP ZAP baseline]
```

Dört kapı job'u paralel çalışır. `Build and test` hepsine bağlıdır. Deploy ve
DAST job'ları yalnızca `staging` veya `production` dalına yapılan **push**'ta
çalışır. Pull request'ler tüm kapılardan ve build'den geçer, ama hiçbir zaman
deploy etmez.

## Job'lar

| Job | Ne yapar | Ne zaman başarısız olur |
| --- | --- | --- |
| Pipeline hygiene | actionlint, zizmor (sabit sürümlü, checksum'ı doğrulanan binary'ler) | orta ve üstü herhangi bir zizmor bulgusu |
| Secrets and dependencies | Tüm geçmişte Gitleaks, OSV-Scanner, kök/api/client/admin için `npm audit --audit-level=high` | herhangi bir sızıntı, herhangi bir OSV bulgusu, high/critical audit bulgusu |
| SAST and config | Trivy misconfig; `api/wrangler.toml` için Conftest `security/policy/wrangler.rego`; bir commit'e sabitlenmiş `semgrep/semgrep-rules` JS/TS güvenlik kurallarıyla Semgrep CE; `api/src` üzerinde `security/opengrep/` Workers kurallarıyla Opengrep (`--taint-intrafile`) | HIGH/CRITICAL misconfig, herhangi bir politika ihlali, herhangi bir Semgrep veya Opengrep bulgusu |
| SAST (CodeQL) | CodeQL `javascript-typescript` | analiz hatası |
| Build and test | `npm run ci:all`, kök/api/client/admin için CycloneDX SBOM'ları (`npm sbom`, `sbom-cyclonedx` artifact'i), `prisma validate/generate`, `npm test` (api), ortamın `VITE_API_URL` değeriyle client/admin lint ve build | herhangi bir adım |
| Deploy API | `wrangler d1 migrations apply DB --remote`, `wrangler deploy --env <ortam>` | herhangi bir adım |
| Deploy frontends | `client/` ve `admin/` içinde `wrangler deploy --env <ortam>` (Workers static assets) | herhangi bir adım |
| DAST | Az önce deploy edilen ortamın vitrinine ve `/api/v1/products` adresine OWASP ZAP baseline (pasif, 2 dakikalık spider). Rapor (HTML/JSON/Markdown) `zap-<hedef>` artifact'i olarak yüklenir ve özeti job summary'ye yazılır. Admin paneli Cloudflare Access arkasında olduğu için taranmaz. Gerekçeli kural istisnaları `security/zap/rules.tsv` dosyasına yazılır. | herhangi bir High risk uyarısı |

## Sürümler

Tüm action'lar commit SHA'larına sabitlenmiştir. Docker imajları (Gitleaks,
OSV-Scanner, Conftest, ZAP) digest ile sabitlenir, indirilen binary'ler
(actionlint, zizmor, Opengrep) SHA-256 ile doğrulanır ve Semgrep kuralları
canlı registry yerine sabit bir `semgrep-rules` commit'inden alınır. Node.js
22.23.3 ve Wrangler 4.145.0 workflow `env` bölümünde tanımlıdır.

## Çalışma zamanı koruması

API Worker'ı, Workers Rate Limiting binding'i ile IP başına sınır uygular
(`api/src/middlewares/rateLimit.js`, binding'ler `api/wrangler.toml` içinde):
`/api/*` için dakikada 300, sipariş, ödeme ve iade yolları için dakikada 30
istek. Sınır aşılınca `429` ve `Retry-After` döner. Zone düzeyindeki WAF,
ücretsiz rate limiting kuralı, Bot Fight Mode ve TLS/HSTS ayarları Cloudflare
panelinden yapılır; adımlar [devsecops_pipeline.md](devsecops_pipeline.md)
bölüm 5.3'tedir. Güvenlik başlıkları API'de Hono `secureHeaders`, vitrin ve
admin'de `public/_headers` dosyasından gelir.

## Yerel hook

`.husky/pre-commit` yerel veritabanı dosyalarını engeller ve staged
değişiklikleri Gitleaks ile tarar. Gitleaks zorunludur; sabit sürümü
`sh scripts/install-gitleaks.sh` ile kurun (gitignore'daki `.tools/` dizinine
iner).

## Sırlar

| Secret | Amaç |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | En az yetkili hesap API token'ı: Workers Scripts, D1, Workers R2 Storage (Edit), Account Settings (Read), `ecommerceflaredev.web.tr` için Zone Workers Routes (Edit) ve Zone (Read) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare hesap kimliği |

Uygulamanın kendisi deploy sırasında sır gerektirmez; admin erişimi
Cloudflare Access ile sağlanır (bkz. deploy rehberi).

## Diğer workflow'lar

| Workflow | Tetikleyici | Amaç |
| --- | --- | --- |
| `backup.yml` | elle | Production D1 veritabanının şifreli olarak Google Drive'a aktarılması |
