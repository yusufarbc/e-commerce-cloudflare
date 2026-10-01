`yusufarbc/e-commerce-cloudflare` projesinin mimarisi (TypeScript, Hono, React, Prisma, Cloudflare Workers, Pages, D1, R2) dikkate alındığında; **VS Code (Yerel) $\rightarrow$ GitHub Actions (CI Kapıları) $\rightarrow$ Cloudflare (CD & Dağıtım)** hattında kurulacak en dengeli, ücretsiz ve üretim standartlarına uygun DevSecOps mimarisi şu adımlarla hayata geçirilir.

---

### 1. Boru Hattında Konumlandırılacak Araç Seti

| Katman | Araç | Lisans / Maliyet | Projedeki Görevi | Uygulamadaki yeri |
| --- | --- | --- | --- | --- |
| **Yerel (VS Code)** | Husky + Gitleaks + ESLint (`eslint-plugin-security`) | Açık kaynak | `dev.db`, API anahtarı ve JWT sırlarının commit edilmesini yerelde engelleme | `.husky/pre-commit`, `client/.eslintrc.cjs`, `admin/eslint.config.js` |
| **CI güvenliği** | actionlint + zizmor | Açık kaynak | Workflow'lardaki enjeksiyon, pinlenmemiş action ve PPE açıkları | `pipeline-hygiene` job'u |
| **Gizli anahtar** | Gitleaks | Açık kaynak | Tüm git geçmişinde sır sızıntısı | `secrets-and-dependencies` job'u, `.gitleaks.toml`, `.gitleaksignore` |
| **Bağımlılık (SCA)** | OSV-Scanner + npm audit | Açık kaynak | Dört `package-lock.json` (kök, api, client, admin) | `secrets-and-dependencies` job'u |
| **SAST** | Semgrep CE | Açık kaynak | Hono route'larında enjeksiyon, CORS ve OWASP Top 10 kalıpları | `code-and-config-security` job'u |
| **SAST** | GitHub CodeQL | Açık kaynak projelerde ücretsiz | Derin taint analizi | `codeql` job'u, `.github/codeql/codeql-config.yml` |
| **Altyapı (IaC / config)** | Trivy (misconfig) | Açık kaynak | Yapılandırma dosyalarındaki güvensiz ayarlar | `code-and-config-security` job'u |
| **Dağıtım (CD)** | Wrangler CLI | Açık kaynak | Kapılardan geçen kodu Workers ve Pages'e aktarma | `deploy-backend`, `deploy-frontend` job'ları |

> Opengrep, Checkov, Conftest ve TruffleHog ürün pipeline'ında yok; bunlar
> araştırma ölçüm hattında (`security-research.yml`) çalışır. Ürün kapısında
> Opengrep Semgrep CE ile aynı kuralları çalıştırır ve ek koruma sağlamaz;
> Checkov'un `wrangler.toml` desteği ise pilotta doğrulanacak.

---

### 2. Aşama: VS Code (Geliştirici Ortamı ve Shift-Left)

Geliştiricinin zafiyetli kodu repoya göndermesini en baştan engellemek için yerel Git hook'ları devreye alınır:

1. **Husky ve Gitleaks ile Pre-commit Kurulumu:**
```bash
npm install --save-dev husky eslint-plugin-security
npx husky init

```


2. **`.husky/pre-commit` Dosyasına Eklenecek Kontroller:**
```bash
# 1. Commit edilmemesi gereken veritabanı dosyalarını kontrol et
if git diff --cached --name-only | grep -E 'dev\.db$|.*\.sqlite$'; then
  echo "HATA: Yerel SQLite/Prisma veritabanı dosyaları commit edilemez!"
  exit 1
fi

# 2. Gitleaks yerel sır taraması
gitleaks protect --staged --verbose

```


3. **ESLint Güvenlik Eklentisi:**
`eslint.config.js` veya `.eslintrc.json` içerisine `eslint-plugin-security` eklenerek güvensiz regex, dinamik kod çalıştırma ve nesne enjeksiyonları IDE seviyesinde uyarılır.



---

### 3. Aşama: GitHub Actions (CI Güvenlik Kapıları)

Projenin kök dizininde `.github/workflows/devsecops-pipeline.yml` dosyası oluşturularak fail-closed (bulgu durumunda dağıtımı durduran) bir kapı kurgulanır. Çatallanmış PR'larda Poisoned Pipeline Execution (PPE / MITRE T1677) riskini engellemek için `pull_request_target` yerine standart `pull_request` tetikleyicisi kullanılır.

Uygulanan dosya: [`.github/workflows/devsecops-pipeline.yml`](.github/workflows/devsecops-pipeline.yml).

```
pipeline-hygiene ─┐
secrets-and-dependencies ─┤
code-and-config-security ─┼─► build-and-test ─► deploy-backend ─► deploy-frontend
codeql ─┘                                  (yalnızca push → test, environment: staging)
```

Bu plandaki örnek YAML'dan farkları:

| Konu | Plan | Uygulama | Gerekçe |
| --- | --- | --- | --- |
| Action sürümleri | `@v4`, `trivy-action@master` | Tamamı commit SHA ile pinli | Değişken tag'ler tedarik zinciri riski (zizmor `unpinned-uses`) |
| Araç kurulumu | `gitleaks-action`, `zizmor-action`, `pip install semgrep` | Sürümü sabit Docker imajı veya checksum'ı doğrulanan binary | Gitleaks action'ı organizasyonlarda lisans istiyor; tekrar üretilebilirlik |
| Build | Kökte `npm run build` | `npm run ci:all`, Prisma validate/generate, `npm test` (api), client/admin lint ve build | Repo bir monorepo; kökte build script'i yok |
| Deploy dalı | `main` push | `test` push, `staging` environment | Mevcut staging akışı korundu |
| Araştırma korpusu | — | Semgrep `--exclude research`, Trivy `skip-dirs`, Gitleaks allowlist, CodeQL `paths-ignore` | Korpus bilerek açıklı kod içerir; ölçüm `security-research.yml` ile yapılır |
| Checkout | Varsayılan | `persist-credentials: false` | Token'ın artifact veya log'a sızmaması |


---

### 4. Aşama: Cloudflare Entegrasyonu ve Dağıtım Hijyeni

Pipeline'ın son aşamasında Cloudflare ortamının güvenliği için üç operasyonel kural uygulanır:

* **Sınırlandırılmış API Belirteci (Least Privilege):** Dağıtım için Global API Key kullanılmaz. Cloudflare Dashboard'dan yalnızca projenin ihtiyaç duyduğu izinlerle sınırlı bir `API Token` üretilir:
* `Account.Workers Scripts: Edit`
* `Account.D1: Edit`
* `Account.Workers R2 Storage: Edit`
* `Account.Cloudflare Pages: Edit`
* `Zone.Workers Routes: Edit` (yalnızca uygulamanın zone'u için)

  KV kullanılmadığı için `Workers KV Storage` yetkisi verilmez.


* **Cloudflare Dashboard Otomatik Dağıtımının Kapatılması:**
Cloudflare Pages panelindeki *"Automatic Git Deployments"* özelliği kapatılmalıdır. Açık bırakılırsa, kod GitHub'a push edildiği an Cloudflare doğrudan derleme başlatır ve GitHub Actions'taki güvenlik kapıları baypas edilir. Dağıtım kontrolü yalnızca CI/CD hattındaki Wrangler adımları üzerinden yönetilmelidir.


* **Önizleme Ortamı İzolasyonu (Preview Deployments):**
Her çekme isteğinde (PR) otomatik oluşturulan geçici `pr-*.pages.dev` ve preview worker adresleri canlı D1 ve R2 veritabanına bağlanmamalıdır. `wrangler.toml` içinde preview ortamı için izole test D1 bağlamları tanımlanmalı, genel internete açık kalmaması adına Cloudflare Access (ZTNA) arkasına alınmalıdır.



**Durum (2026-10-01):** Deploy yeni Cloudflare hesabına (`yusufarbc`) taşınıyor.

- [ ] En az yetkili API token: yeni hesapta oluşturulup GitHub `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secret'larına yazılacak.
- [ ] Otomatik Git deploy: Pages projeleri Wrangler ile *Direct Upload* olarak oluşturulacak; Git entegrasyonu olmadığı için kapılar baypas edilemez.
- [ ] Önizleme izolasyonu: `api/wrangler.toml` içinde `preview_bucket_name` canlı bucket'la aynı ve D1 için `preview_database_id` yok. Yeni hesapta ayrı preview D1/R2 tanımlanacak.
- [ ] GitHub `staging` environment'ı ve koruma kuralları.

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

Testbed deponuzdaki GitHub Actions iş akışında bu araçların tamamı çalışmalı; ancak istatistiksel hipotez testinde (McNemar) sadece leke analizi yapabilen SAST araçlarının ikiz çıktıları karşılaştırılmalıdır.



Yapılanlar
devsecops-pipeline.yml planın katmanlarını izliyor:

Hijyen: actionlint ve zizmor, checksum'lı ve sabit sürümlü. Orta ve üstü bulguda pipeline duruyor.
Sır ve SCA: Gitleaks (tüm geçmiş), OSV-Scanner ve dört proje için npm audit --audit-level=high.
SAST ve config: Semgrep CE (--error), Trivy misconfig (HIGH/CRITICAL) ve ayrı bir CodeQL job'u.
Build ve test: needs ile tüm kapılara bağlı. Prisma validate/generate, vitest, client ve admin lint'i, iki build.
CD: Yalnızca test branch'ine push'ta, staging environment'ı ile çalışıyor. API Worker'ı, ardından iki Pages projesi deploy ediliyor.
Bunlar dışında:

Tetikleyici pull_request. pull_request_target kullanılmadı.
Workflow izinleri contents: read. Yalnızca CodeQL'e ek olarak security-events: write verildi.
Action'lar commit SHA'sına sabitlendi. download-artifact SHA'sını gh api ile doğruladım.
Araç sürümleri, araştırma workflow'undakiyle aynı.
Yerel katman: Husky eklendi (kökte prepare script'i). .husky/pre-commit dev.db ve .sqlite dosyalarını engelliyor, gitleaks kuruluysa onu çalıştırıyor. eslint-plugin-security, client (.eslintrc.cjs) ve admin (eslint.config.js) projelerine eklendi.

Kaldırılan: deploy.yml. Yeni pipeline aynı staging deploy'unu yaptığı için iki kez deploy olurdu.

Dikkat
İlk çalıştırma büyük ihtimalle kırmızı olur. Pipeline plandaki gibi fail-closed. api/wrangler.toml içinde 14 ve 74. satırlarda düz yazılı ADMIN_JWT_SECRET var ve Gitleaks ya da Semgrep bunu yakalayabilir. Sırrı wrangler secret put ile taşımanızı öneririm. Bu, yaptığım bir değişiklik değil, repodaki mevcut durum.
Plan main push'unda deploy diyor, ama repoda staging test branch'inden çıkıyor. Mevcut davranışı korudum. main için production deploy istiyorsanız söyleyin, job'u eklerim.
workflow-security.yml ve araştırma workflow'u dokunulmadan duruyor. Hijyen işi artık ana pipeline'da da var.
Bu repo ayarları kodla yapılamıyor, elle yapmanız gerekiyor:
GitHub'da staging environment'ını oluşturmak.
Cloudflare Pages'te "Automatic Git Deployments"ı kapatmak.
API token'ı en az yetkiyle sınırlamak.
Preview ortamlarını canlı D1 ve R2'den ayırıp Cloudflare Access arkasına almak.
Plandaki DAST (ZAP) opsiyonel olduğu için eklemedim