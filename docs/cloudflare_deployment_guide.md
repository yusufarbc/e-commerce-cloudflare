# ⛅ Cloudflare Deploy Rehberi

E-Market tamamen Cloudflare Workers üzerinde çalışır: API bir Worker'dır,
vitrin ve admin paneli de static assets kullanan Worker'lardır. Deploy yalnızca
CI/CD hattıyla yapılır ([CI/CD Hattı](cicd_pipeline.md)). Bu rehber Cloudflare
tarafındaki tek seferlik kurulumu anlatır (örneğin bir fork için).

## Ortam başına mimari

| Bileşen | Worker adı (staging / production) | Özel alan adı (staging / production) | Binding'ler |
| --- | --- | --- | --- |
| API | `e-commerce-cloudflare-staging` / `-production` | `staging-api.` / `api.` | D1 `DB`, R2 `IMAGES_BUCKET`, `EMAIL`, rate limit, cron |
| Vitrin | `ecommerce-storefront-staging` / `-production` | `staging.` / kök alan adı | static assets (SPA) |
| Admin | `ecommerce-admin-staging` / `-production` | `staging-admin.` / `admin.` | static assets + `API` service binding |

Yapılandırma `api/wrangler.toml`, `client/wrangler.jsonc` ve
`admin/wrangler.jsonc` dosyalarındadır. Her ortamın kendi D1 veritabanı ve R2
bucket'ı vardır. `wrangler dev` ve `preview_*` binding'leri ayrı bir preview
D1/R2 kullanır; böylece önizlemeler canlı veriye hiç dokunmaz. Bu kural CI'da
Conftest politikasıyla (`security/policy/wrangler.rego`) denetlenir.

## Tek seferlik kurulum

### 1. Zone

Alan adını Cloudflare hesabına ekleyin ve kayıt firmasındaki nameserver'ları
zone için gösterilen iki Cloudflare nameserver'ına yönlendirin. Zone
**Active** olana kadar bekleyin. Workers özel alan adları, DNS kayıtlarını ve
sertifikaları ilk deploy'da otomatik oluşturur.

### 2. D1 ve R2

```bash
npx wrangler d1 create <proje>-d1-staging
npx wrangler d1 create <proje>-d1-production
npx wrangler d1 create <proje>-d1-preview
npx wrangler r2 bucket create <proje>-r2-staging
npx wrangler r2 bucket create <proje>-r2-production
npx wrangler r2 bucket create <proje>-r2-preview
```

Veritabanı kimliklerini ve bucket adlarını `api/wrangler.toml` dosyasına yazın
(üst düzey = preview, `[env.staging]`, `[env.production]`). Kaynak
oluştururken Wrangler'ı Wrangler yapılandırması **olmayan** bir dizinden ya
da `api/` içinden çalıştırın; böylece komutlar yanlış projeyi almaz.

Migration'lar her API deploy'undan önce pipeline tarafından uygulanır. Bir
ortama örnek veri yüklemek için:

```bash
cd api
npm run seed:remote -- --env staging
```

`prisma/seed.sql` `DELETE` komutlarıyla başlar; gerçek veri içeren bir ortamda
çalıştırmayın.

### 3. Admin paneli için Cloudflare Access

Admin panelinde şifreyle giriş yoktur. Yöneticilerin kimliğini Cloudflare
Access doğrular, API de Access token'ını doğrular.

1. **Zero Trust → Access → Applications → Add an application → Self-hosted**
   seçin ve `admin.<alan-adı>` ile `staging-admin.<alan-adı>` adreslerini
   ekleyin.
2. Yönetici e-posta adresleri için bir **Allow** politikası ekleyin (one-time
   PIN, kimlik sağlayıcısı olmadan çalışır).
3. Önerilir: **Settings → Cookies** altında **HTTP Only** ve **Binding
   cookie** açık olsun.
4. `api/wrangler.toml` içinde iki ortam için şunları tanımlayın:
   - `ACCESS_TEAM_DOMAIN` = `<takım>.cloudflareaccess.com`
   - `ACCESS_AUD` = uygulamanın Audience etiketi (Access giriş yönlendirme
     URL'sinde `kid=` olarak da görünür)

Parçalar nasıl birleşir: admin Worker'ı SPA'yı sunar ve `/api/*` isteklerini
`API` service binding'i üzerinden API'ye iletir. Böylece admin çağrıları aynı
origin'den gelir ve Access'in `Cf-Access-Jwt-Assertion` başlığını taşır.
API'deki `adminAuth` middleware'i bu JWT'yi (RS256, issuer, audience, süre)
`https://<takım>.cloudflareaccess.com/cdn-cgi/access/certs` adresindeki
anahtarlarla doğrular. API alan adına geçerli bir assertion olmadan gelen
istekler 401 alır. `ACCESS_*` değerleri eksikse admin yolları 503 döner.
Access'in atlatılamaması için admin Worker'ında `workers_dev` ve preview
URL'leri kapalıdır.

### 4. GitHub

1. Bir **Account API token** oluşturun (Manage Account → Account API Tokens).
   Yetkiler: Workers Scripts Edit, D1 Edit, Workers R2 Storage Edit, Account
   Settings Read, ayrıca alan adıyla sınırlı Zone Workers Routes Edit ve Zone
   Read.
2. Repo secret'ları: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
3. `staging` ve `production` dallarını oluşturun ve PR ile pipeline kapı
   check'lerini zorunlu kılan bir ruleset ile koruyun.
4. `staging` ve `production` GitHub ortamlarını oluşturun. Her ortam yalnızca
   kendi dalından deploy kabul etsin; `production` için zorunlu reviewer
   tanımlayın.

Bundan sonra `staging`'e push staging'e deploy eder; `staging`'i PR ile
`production`'a taşımak production'a deploy eder.

### 5. Zone güvenlik ayarları

WAF, ücretsiz rate limiting kuralı, Bot Fight Mode ve TLS/HSTS ayarları
Wrangler ile yönetilemez; panelden bir kez yapılır. Adımlar
[devsecops_pipeline.md](devsecops_pipeline.md) bölüm 5.3'tedir.

## E-posta

Sipariş onayı, iptal ve yeni sipariş bildirimleri `api/src/services/emailService.js`
ile gönderilir. Sağlayıcı ortam bazında `EMAIL_PROVIDER` ile seçilir:

| `EMAIL_PROVIDER` | Gönderim yolu | Gerekenler |
| --- | --- | --- |
| `cloudflare` (varsayılan) | Workers `send_email` binding'i (`EMAIL`) | Zone'da **Email Routing** açık olmalı ve doğrulanmış bir hedef adres bulunmalı |
| `resend` | [Resend](https://resend.com) REST API | Gönderen alan adı Resend'de doğrulanmış olmalı; API anahtarı secret olarak verilir |

Resend'e geçmek için:

```bash
cd api
npx wrangler secret put RESEND_API_KEY --env production
```

ardından `api/wrangler.toml` içinde ilgili ortamda `EMAIL_PROVIDER = "resend"`
yapın. Gönderen ve yanıt adresi her iki sağlayıcıda da `SMTP_SENDER` ve
`SMTP_REPLY_TO` değişkenlerinden gelir. Gönderim hatası loglanır, ama sipariş
akışını hiçbir zaman durdurmaz.
