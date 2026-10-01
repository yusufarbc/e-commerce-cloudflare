# DevSecOps Boru Hattı

`yusufarbc/e-commerce-cloudflare` hem açık kaynak bir e-ticaret demo ortamı hem de bir DevSecOps referans uygulamasıdır. Mimari: Hono API (Cloudflare Workers, D1, R2, Queues, Cron), React vitrin ve admin paneli (Workers static assets), admin girişi Cloudflare Access ile.

Hat üç katmandan oluşur: **Yerel (VS Code) → GitHub Actions (CI kapıları) → Cloudflare (CD ve çalışma zamanı)**. Tüm araçlar ücretsizdir. Her kapı fail-closed çalışır: bulgu varsa dağıtım durur.

---

### 1. Araç seti

| Katman | Araç | Projedeki görevi | Uygulamadaki yeri |
| --- | --- | --- | --- |
| **Yerel** | Husky + Gitleaks (zorunlu) + ESLint (`eslint-plugin-security`) | `dev.db` ve sırların commit edilmesini yerelde engelleme | `.husky/pre-commit`, `scripts/install-gitleaks.sh` |
| **CI güvenliği** | actionlint + zizmor | Workflow enjeksiyonu, pinlenmemiş action, PPE | `pipeline-hygiene` |
| **Gizli anahtar** | Gitleaks | Tüm git geçmişinde sır sızıntısı | `secrets-and-dependencies`, `.gitleaks.toml`, `.gitleaksignore` |
| **SCA** | OSV-Scanner + npm audit | Dört `package-lock.json` (kök, api, client, admin) | `secrets-and-dependencies` |
| **SAST** | Semgrep CE | Commit'e sabitlenmiş `semgrep-rules` JS/TS güvenlik kuralları | `code-and-config-security` |
| **SAST (platform)** | Opengrep + özel Workers kuralları | D1, R2 ve `fetch` sink'lerine giden taint akışları (`--taint-intrafile`) | `code-and-config-security`, `research/rules/edge` |
| **SAST** | GitHub CodeQL | Derin taint analizi | `codeql`, `.github/codeql/codeql-config.yml` |
| **IaC / config** | Trivy (misconfig) | Yapılandırma dosyalarındaki güvensiz ayarlar | `code-and-config-security` |
| **Politika** | Conftest (OPA) | `wrangler.toml` dağıtım politikası | `code-and-config-security`, `policy/wrangler.rego` |
| **SBOM** | `npm sbom` (CycloneDX 1.5) | Dört paketin bileşen envanteri, 90 gün artifact | `build-and-test` → `sbom-cyclonedx` |
| **CD** | Wrangler | Kapılardan geçen kodu Workers'a aktarma | `deploy-backend`, `deploy-frontend` |
| **DAST** | OWASP ZAP baseline | Dağıtılan ortamda vitrin ve API'nin pasif taraması; High risk bulguda hata | `dast`, `.zap/rules.tsv` |
| **Çalışma zamanı** | Workers Rate Limiting + Cloudflare WAF | İstemci başına istek sınırı; zone düzeyinde WAF | `api/src/middlewares/rateLimit.js`, bölüm 5 |

TruffleHog ve Checkov yalnızca araştırma ölçüm hattında (`security-research.yml`) çalışır.

---

### 2. Yerel katman (shift-left)

`npm install` kökte Husky'yi kurar (`prepare` script'i). `.husky/pre-commit` iki kontrol yapar:

1. `dev.db` ve `.sqlite` dosyaları commit edilemez.
2. Staged değişiklikler Gitleaks ile taranır. **Bu adım zorunludur.** Gitleaks yoksa commit reddedilir.

Gitleaks'i CI ile aynı sürümde kurmak için:

```bash
sh scripts/install-gitleaks.sh   # .tools/gitleaks (gitignored), SHA-256 doğrulamalı
```

Script Linux, macOS ve Windows (Git Bash) üzerinde çalışır. PATH'te kurulu bir `gitleaks` varsa hook onu da kabul eder.

ESLint tarafında `eslint-plugin-security`, client ve admin projelerinde güvensiz regex, dinamik kod çalıştırma ve nesne enjeksiyonu için IDE'de uyarı verir.

---

### 3. GitHub Actions (CI kapıları ve CD)

Dosya: [`.github/workflows/devsecops-pipeline.yml`](.github/workflows/devsecops-pipeline.yml).

```
pipeline-hygiene ─────────┐
secrets-and-dependencies ─┤
code-and-config-security ─┼─► build-and-test ─► deploy-backend ─► deploy-frontend ─► dast (storefront, api)
codeql ───────────────────┘      (+ SBOM)        (yalnızca staging/production push'u)
```

| Dal | Ortam | Alan adları | Onay |
| --- | --- | --- | --- |
| `staging` | `staging` | `staging.`, `staging-api.`, `staging-admin.ecommerceflaredev.web.tr` | Yok |
| `production` | `production` | `ecommerceflaredev.web.tr`, `api.`, `admin.` | Zorunlu reviewer |

PR'lar tüm kapılardan ve build'den geçer ama deploy etmez. Her iki dal `protect-production-staging` ruleset'iyle korunur (PR zorunlu, beş kapı zorunlu check). Her ortam yalnızca kendi dalından deploy alır (environment branch policy). Production'da reviewer onayı API deploy'unda ve frontend deploy'unda ayrı ayrı istenir.

**Tedarik zinciri sertleştirmesi**

- Action'ların tamamı commit SHA'sına sabitlidir.
- Docker imajları (Gitleaks, OSV-Scanner, Conftest, ZAP) digest ile sabitlidir.
- İndirilen binary'ler (actionlint, zizmor, Opengrep) SHA-256 ile doğrulanır.
- Semgrep kuralları canlı registry (`p/...`) yerine `semgrep/semgrep-rules` deposunun belirli bir commit'inden alınır. Kural seti yalnızca `security/` dizinlerindeki, `audit` dışı kurallardır. `html-in-template-string` kuralı dışarıda bırakılır: her etiketli template literal'ı işaretler ve `escapeMarkup()` çağrılarını göremez.
- Checkout'larda `persist-credentials: false` vardır. Workflow izinleri `contents: read` ile başlar.
- Tetikleyici `pull_request`'tir; `pull_request_target` kullanılmaz (PPE / MITRE T1677).

**Kapıların ayrıntısı**

- **Opengrep özel kuralları:** Araştırmada geliştirilen (`rules-frozen-v1`) Workers kuralları `api/src` üzerinde `--taint-intrafile --error` ile çalışır. İlk koşuda GTM proxy'sinde (`metricsRoutes.js`) URL'e eklenen kullanıcı girdisini yakaladı. Girdi artık allowlist regex'i ve `URLSearchParams` ile ekleniyor.
- **Conftest (`policy/wrangler.rego`)** şunları reddeder:
  - `vars` içinde sır benzeri anahtarlar (`SECRET`, `TOKEN`, `PASSWORD`, `API_KEY`, ...); bunlar `wrangler secret put` ile verilmelidir;
  - canlı D1/R2 kaynağına bağlanan preview binding'leri;
  - staging veya production'da `*` içeren `CORS_ORIGIN`.
- **SBOM:** `npm sbom --sbom-format cyclonedx` dört paket için çalışır. Sonuç `sbom-cyclonedx` artifact'i olarak 90 gün saklanır.
- **DAST:** Deploy'dan sonra ZAP baseline (pasif tarama, spider 2 dakika) iki hedefe gider: vitrin ve `API/api/v1/products`. Rapor (HTML, JSON, Markdown) artifact olarak yüklenir ve özeti job summary'ye yazılır. High risk (`riskcode 3`) uyarısı job'u kırmızıya çevirir. Admin paneli Access arkasında olduğu için taranmaz. Kural istisnaları gerekçesiyle birlikte `.zap/rules.tsv` dosyasına yazılır.

> DAST deploy'dan sonra çalışır. Bu yüzden staging'deki bir High bulgu staging'i geri almaz, ama staging → production PR'ı açılmadan önce görünür olur. Production'da aynı tarama yayından hemen sonra koşar.

---

### 4. Cloudflare dağıtım hijyeni

- **En az yetkili API token:** Global API Key kullanılmaz. Token yalnızca Workers Scripts, D1 ve Workers R2 Storage (Edit), Account Settings (Read), ayrıca `ecommerceflaredev.web.tr` zone'u için Workers Routes (Edit) ve Zone (Read) yetkilerini taşır. Token GitHub'da `CLOUDFLARE_API_TOKEN` olarak saklanır.
- **Git entegrasyonu yok:** Vitrin ve admin, Workers static assets olarak yalnızca Wrangler ile deploy edilir. Cloudflare tarafında Git'ten otomatik build yoktur, bu yüzden kapılar baypas edilemez.
- **Preview izolasyonu:** `api/wrangler.toml` içinde her ortamın preview D1/R2 kaynağı canlı kaynaktan ayrıdır. Conftest bu kuralı CI'da zorlar.
- **Sırlar:** `ACCESS_*` dışındaki tüm hassas değerler (`PARAM_*`, `GOOGLE_MERCHANT_TOKEN` vb.) `wrangler secret put --env <ortam>` ile verilir. `vars` içinde sır bulunmaz; Gitleaks ve Conftest bunu denetler.
- **Admin erişimi:** Admin paneli ve `/api/v1/admin/*` Cloudflare Access ile korunur. API, Access JWT'sini JWKS üzerinden doğrular.

---

### 5. Çalışma zamanı korumaları

#### 5.1 Rate limiting (kodda, Wrangler ile)

`api/wrangler.toml` her ortam için iki [Workers Rate Limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) binding'i tanımlar. `api/src/middlewares/rateLimit.js` anahtar olarak `CF-Connecting-IP` kullanır:

| Binding | Kapsam | Sınır |
| --- | --- | --- |
| `API_RATE_LIMITER` | Tüm `/api/*` | IP başına 300 istek / 60 sn |
| `SENSITIVE_RATE_LIMITER` | `/api/v1/orders/*`, `/payment/*`, `/returns/*` | IP başına 30 istek / 60 sn |

Sınır aşılınca `429` ve `Retry-After: 60` döner. Bu davranış `app.security.test.js` ile test edilir.

#### 5.2 WAF ve zone ayarları (Dashboard, elle)

Wrangler zone düzeyindeki WAF kurallarını yönetemez. Bu ayarlar `ecommerceflaredev.web.tr` zone'unda Dashboard'dan bir kez yapılır (Free plan):

1. **Security → WAF → Managed rules:** *Cloudflare Free Managed Ruleset* açık olmalı (Free planda varsayılan olarak açıktır).
2. **Security → WAF → Custom rules → Create rule** (Free planda 5 kural hakkı var):
   - *Block non-API methods:* `(http.host in {"api.ecommerceflaredev.web.tr" "staging-api.ecommerceflaredev.web.tr"} and not http.request.method in {"GET" "POST" "PUT" "DELETE" "OPTIONS"})` → **Block**.
   - *Block scanners on sensitive paths:* `(http.request.uri.path contains "/.env" or http.request.uri.path contains "/.git" or http.request.uri.path contains "wp-")` → **Block**.
3. **Security → WAF → Rate limiting rules** (Free planda 1 kural): `(http.host eq "api.ecommerceflaredev.web.tr" and starts_with(http.request.uri.path, "/api/v1/payment"))`, eşik 20 istek / 10 sn, eylem **Block** (10 sn). Bu kural istekleri Worker'a ulaşmadan durdurur. Worker içindeki limit ikinci savunma hattı olarak kalır.
4. **Security → Bots:** *Bot Fight Mode* açık. (Not: Bot Fight Mode API istemcilerini de etkileyebilir. Sorun çıkarsa API host'u için bir custom rule ile *Skip* tanımlanır.)
5. **Security → Settings:** *Security Level* = Medium, *Browser Integrity Check* açık.
6. **SSL/TLS:** Mod *Full (strict)*. *Edge Certificates* altında *Always Use HTTPS*, *Automatic HTTPS Rewrites*, *Minimum TLS Version* = 1.2 ve *HSTS* açık (max-age 6 ay, includeSubDomains; preload'u ancak tüm alt alanların HTTPS olduğundan emin olunca açın).

ZAP raporları bu ayarların etkisini (HSTS ve güvenlik başlıkları) her deploy'da gösterir.

---

## Araştırma açısından konumlandırma

Gerçekçi bir DevSecOps boru hattında bu araçların **hepsi yer alır ve pipeline testbed'inde birlikte çalıştırılır**. Ancak akademik makalede bu araçların **üstlendiği roller ve dahil edildikleri araştırma soruları (RQ) birbirinden farklıdır**.

Hepsini tek bir kefeye koyup aynı soruyla test etmek akademik olarak bir **kategori hatası** (*category mistake*) yaratır. Araçların makale kurgusundaki yeri ve iş bölümü şu şekildedir:

### 1. Neden Çekirdek Deneyde (RQ2) Yalnızca SAST Vardır?

Makalenin temel hipotezi (RQ2), *"Zafiyetli alıcı (sink) sabitken, girdi HTTP yerine bir olay kaynağından (kuyruk, cron, depolama) geldiğinde veri akış takibi (taint analysis) kopuyor mu?"* sorusudur.

SAST dışındaki araçların çalışma prensipleri veri akışını izlemeye uygun değildir:

* **SCA (Trivy, OSV-Scanner, npm audit):** Kaynak kodun veri akışına bakmaz; `package.json` içindeki bağımlılıkların bilinen CVE listeleriyle eşleşip eşleşmediğini denetler. Girdi ister HTTP olsun ister kuyruk mesajı, SCA her iki durumda da aynı sonucu verir.
* **Gizli Anahtar Taraması (Gitleaks, TruffleHog):** Kod içerisine gömülmüş statik API anahtarlarını, token'ları ve yüksek entropili dizgileri arar; fonksiyon parametrelerinin nereye aktığıyla ilgilenmez.
* **IaC Taraması (Checkov, OPA/Rego):** Uygulama mantığını değil, `wrangler.jsonc` veya Terraform gibi altyapı manifestolarındaki yetki ve yapılandırma hatalarını inceler.
* **DAST (OWASP ZAP):** Çalışan uygulamaya dışarıdan HTTP/REST istekleri göndererek kara kutu testi yapar. DAST araçları mimari gereği arka planda çalışan bir Cloudflare Queue kuyruk mesajını, zamanlanmış Cron tetikleyicisini veya dahili R2 depolama olayını dışarıdan doğrudan tetikleyemez (olay kanallarına kördür).

Bu nedenle, girdi kaynağının değişimini ölçen nedensel deneyde (RQ2) yalnızca leke analizi yapabilen SAST araçları (CodeQL, Semgrep CE, Opengrep) bağımsız değişkenle sınanır.

---

### 2. DAST, SCA, Secret ve IaC Makalenin Neresinde Yer Alır?

Bu araçlar dışlanmaz; makalenin farklı araştırma sorularında ve mimari katmanlarında kullanılır:

* **RQ1 (Genel Kapsama ve Mevcut Durum):** Pipeline'daki varsayılan kontrollerin genel başarımı ölçülürken **tüm araçlar devrededir**. Projeye gömülü `ADMIN_JWT_SECRET` (Gitleaks), tescilli `wrangler.jsonc` aşırı yetkileri (Checkov), zafiyetli npm kütüphaneleri (OSV-Scanner) ve kod açıkları (SAST) birlikte raporlanır.
* **RQ4 (Performans ve Maliyet Ölçümü):** Geliştirici deneyimi ve CI/CD gecikmesi ölçülürken **tam teşekküllü pipeline** koşturulur. "Tüm bu güvenlik kapıları (Gitleaks + OSV-Scanner + CodeQL + Semgrep + Checkov) iş akışına eklendiğinde derleme süresi ne kadar uzuyor?" sorusu (Overhead %) bu araçların toplamı üzerinden hesaplanır.
* **DAST (Opsiyonel / Önizleme Katmanı):** Dinamik önizleme ortamı (*preview deployment*) ayağa kalktığında, OWASP ZAP API Scan yalnızca HTTP uç noktalarının temel sözleşme doğrulaması için çalıştırılabilir; ancak asenkron olayları tetikleyemeyeceği makalede bir kısıt (*limitation*) olarak not düşülür.

---

### 3. Araçların Görev Dağılımı ve Katman Matrisi

| Güvenlik Katmanı | Kullanılan Araçlar | İncelenen Zafiyet / Risk | Dahil Olduğu Soru |
| --- | --- | --- | --- |
| **SAST (Çekirdek Analiz)** | CodeQL, Semgrep CE, Opengrep | SQLi, Command Injection, SSRF, Deserialization | **RQ1, RQ2, RQ3, RQ4** |
| **SCA (Bağımlılık)** | OSV-Scanner, npm audit | Bilinen paket açıkları (CVE'ler) | **RQ1, RQ4** |
| **Secret Scanning** | Gitleaks, TruffleHog | Hardcoded JWT sırları, API token sızıntıları | **RQ1, RQ4** |
| **IaC / Config** | Checkov, OPA / Conftest | `wrangler.jsonc` aşırı yetkili D1/R2 bağlamları | **RQ1, RQ3, RQ4** |
| **DAST (Dinamik)** | OWASP ZAP | Dışa açık HTTP API arayüz testleri | **RQ1 (Opsiyonel / Önizleme)** |

---

### 4. Akademik Metodoloji Açısından Doğru Konumlandırma

Makaleyi yazarken savunmayı şu net ayrımla kurmak gerekir:

* **Çekirdek Araştırma Katkısı (Core Contribution):** Uç bilişim olay akışlarının ve platform bağlamlarının statik leke analizi (SAST) motorları tarafından yakalanma boşlukları (RQ2 ve RQ3).
* **Destekleyici Güvenlik Mimarisi (Supporting Pipeline):** SCA, Secret Scanning, IaC ve DAST kapılarının oluşturduğu tam kapsamlı DevSecOps boru hattı. Bu katman, çalışmanın soyut bir kod analizinden ibaret kalmayıp endüstri standardı gerçek bir CI/CD teslim zincirinde test edildiğini ve toplam süre maliyetini (RQ4) kanıtlar.

