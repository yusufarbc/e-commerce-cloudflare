# Ödeme Sağlayıcıları Yapılandırma Rehberi

E-Market, Türkiye'nin önde gelen üç ödeme sağlayıcısını tek ve bağımsız bir
arayüz üzerinden destekler. Sağlayıcı değiştirmek için tek bir ortam
değişkenini değiştirmek yeterlidir; kod değişikliği gerekmez.

---

## Desteklenen sağlayıcılar

| Sağlayıcı | Protokol | 3D Secure | Test ortamı |
| :--- | :--- | :--- | :--- |
| **Param POS** | HTTPS üzerinden SOAP/XML | ✅ | ✅ |
| **iyzico** | REST/JSON | ✅ | ✅ (sandbox) |
| **PayTR** | HMAC imzalı doğrudan POST | ✅ | ✅ (mağaza panelinden test modu) |

---

## Sağlayıcı seçimi

Sağlayıcı, `api/wrangler.toml` içinde ortam bazında `PAYMENT_PROVIDER`
değişkeniyle seçilir:

```toml
[env.staging.vars]
PAYMENT_PROVIDER = "iyzico"   # param | iyzico | paytr
```

API'nin ödeme servisi (`api/src/services/paymentService.js`) bu değeri her
istekte okur ve işlemi ilgili sağlayıcı servisine yönlendirir (Strategy
deseni). Değişiklik bir sonraki deploy ile devreye girer.

**Sırlar `vars` içine yazılmaz.** API anahtarları, parolalar ve merchant
key'ler `wrangler secret put <AD> --env <ortam>` ile verilir. CI'daki Conftest
politikası `vars` içinde sır benzeri bir anahtar görürse deploy'u durdurur.
Yerel geliştirmede bu değerler `api/.dev.vars` dosyasına yazılır (gitignore'da;
şablon: `api/.dev.vars.example`).

Geri dönüş (callback) adresleri `API_URL` değişkeninden türetilir
(ör. `https://staging-api.ecommerceflaredev.web.tr`).

---

## Ödeme akışı

Üç sağlayıcı da aynı akışı izler:

```text
Vitrin                      Worker API                    Sağlayıcı / Banka
  |-- POST /api/v1/orders/checkout -->|                          |
  |<-- { orderId } (sipariş bekliyor) |                          |
  |-- POST /api/v1/payment/initiate ->|                          |
  |                                   |-- 3D Secure başlatma --->|
  |                                   |<-- 3D Secure HTML -------|
  |<-- { ucdHtml } -------------------|                          |
  |-- HTML sayfaya yazılır, tarayıcı bankanın 3D sayfasına gider |
  |-- Kullanıcı SMS şifresini bankanın sayfasında girer -------->|
  |                                   |<-- POST /api/v1/payment/callback/<sağlayıcı>
  |                                   |-- sonucu doğrular, siparişi günceller
  |<-- vitrindeki sonuç sayfasına yönlendirme                    |
```

Sipariş gövdesi API'de zod şemasıyla doğrulanır
(`api/src/validators/orderValidator.js`). Kart bilgisi yalnızca ödeme
başlatma isteğinde sağlayıcıya iletilir ve veritabanına yazılmaz. Sağlayıcıya
giden XML ve HTML içindeki müşteri verileri `escapeMarkup` ile kaçışlanır.

| Sağlayıcı | Callback yolu |
| --- | --- |
| Param POS | `/api/v1/payment/callback/param/success`, `/api/v1/payment/callback/param/error` |
| iyzico | `/api/v1/payment/callback/iyzico` |
| PayTR | `/api/v1/payment/callback/paytr` |

Taksit seçenekleri `GET /api/v1/payment/installments` ile alınır (destekleyen
sağlayıcılarda).

---

## 1. Param POS (SOAP)

Param POS yaygın kullanılan bir Türk ödeme altyapısıdır. E-Market, Param'ın
SOAP/XML web servisiyle harici bir SOAP kütüphanesi kullanmadan doğrudan
`fetch` ile konuşur (`api/src/services/paramService.js`).

| Değişken | Tür | Açıklama |
| --- | --- | --- |
| `PAYMENT_PROVIDER` | var | `param` |
| `PARAM_BASE_URL` | var | Test: `https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl`, canlı: `https://posws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl` |
| `PARAM_CLIENT_CODE` | secret | Müşteri kodu |
| `PARAM_CLIENT_USERNAME` | secret | Kullanıcı adı |
| `PARAM_CLIENT_PASSWORD` | secret | Parola |
| `PARAM_GUID` | secret | Üye işyeri GUID'i |

3D Secure başlatma `TP_WMD_UCD` çağrısıyla yapılır. Param, sonucu başarı veya
hata callback'ine POST eder.

**Kimlik bilgileri:** Üye işyeri hesabı için [Param](https://www.param.com.tr)
ile iletişime geçin. Test ortamı bilgileri başvuru sürecinde verilir.

---

## 2. iyzico (REST)

iyzico, REST API sunan yaygın bir Türk ödeme kuruluşudur
(`api/src/services/iyzicoService.js`).

| Değişken | Tür | Açıklama |
| --- | --- | --- |
| `PAYMENT_PROVIDER` | var | `iyzico` |
| `IYZICO_BASE_URL` | var | Sandbox: `https://sandbox-api.iyzipay.com`, canlı: `https://api.iyzipay.com` |
| `IYZICO_API_KEY` | secret | API anahtarı |
| `IYZICO_SECRET_KEY` | secret | Gizli anahtar |

iyzico 3D Secure başlatma çağrısı bir HTML içeriği döner; vitrin bunu sayfaya
yazar. iyzico sonucu `/api/v1/payment/callback/iyzico` adresine POST eder ve
API ödemeyi iyzico'da doğrular.

**Kimlik bilgileri:** [iyzico.com](https://www.iyzico.com) → Üye İşyeri Paneli
→ API Anahtarları. Sandbox bilgileri kayıttan hemen sonra verilir.

---

## 3. PayTR (HMAC imzalı doğrudan POST)

PayTR, HMAC imzalı token sistemiyle çalışır
(`api/src/services/paytrService.js`).

| Değişken | Tür | Açıklama |
| --- | --- | --- |
| `PAYMENT_PROVIDER` | var | `paytr` |
| `PAYTR_BASE_URL` | var | `https://www.paytr.com` |
| `PAYTR_MERCHANT_ID` | secret | Mağaza numarası |
| `PAYTR_MERCHANT_KEY` | secret | Mağaza parolası (HMAC anahtarı) |
| `PAYTR_MERCHANT_SALT` | secret | Mağaza gizli anahtarı (salt) |

> [!NOTE]
> PayTR ayrı bir sandbox ortamı sunmaz. Mağaza panelinden test modunu açıp
> PayTR'nin test kartlarıyla canlı entegrasyon üzerinde deneme yapın.

API, sipariş bilgileri ve mağaza bilgilerinden PayTR'nin istediği
`paytr_token` değerini HMAC-SHA256 ile üretir ve tarayıcıyı PayTR'nin
`/odeme` adresine otomatik gönderilen bir formla yönlendirir. Sonuç
`/api/v1/payment/callback/paytr` adresine gelir.

**Kimlik bilgileri:** [paytr.com](https://www.paytr.com) üzerinden mağaza
başvurusu yapın. Onaydan sonra bilgiler mağaza panelinde yer alır.

---

## Yerel geliştirme

Yerelde yalnızca test/sandbox bilgilerini kullanın; canlı bilgileri asla
yerelde kullanmayın. `api/.dev.vars` örneği:

```env
IYZICO_API_KEY=sandbox-anahtariniz
IYZICO_SECRET_KEY=sandbox-gizli-anahtariniz
```

> [!IMPORTANT]
> `api/.dev.vars` gitignore'dadır ve asla commit edilmemelidir. Pre-commit
> hook'undaki Gitleaks taraması ve CI'daki Gitleaks kapısı yanlışlıkla eklenen
> sırları yakalar.

---

## Yeni sağlayıcı ekleme

Ödeme servisi **Strategy deseni** ile yazılmıştır. Yeni bir sağlayıcı (ör.
`stripe`) eklemek için:

1. `api/src/services/stripeService.js` dosyasını, `paymentService.js`
   içindeki `IPaymentProvider` sözleşmesine uyacak şekilde oluşturun:
   - `startPaymentProcess(order, basketItems, buyer)` → en az
     `{ status, ucdHtml }`
   - `verifyCallback(callbackData)` → `{ status, paymentId, siparisNumarasi, ... }`
   - `cancelPayment(paymentId, reason)` → `{ status, message }`
   - `getInstallmentOptions(bin, amount)` → desteklenmiyorsa boş dizi
2. Servisi `api/src/container.js` içinde oluşturup `PaymentService`'e verin
   ve `paymentService.js` içindeki sağlayıcı seçimine yeni bir dal ekleyin.
3. Callback yolunu `api/src/routes/paymentRoutes.js` dosyasına ekleyin.
4. Ortamda `PAYMENT_PROVIDER = "stripe"` yapın.

---

## İlgili dokümanlar

- [KVKK Uyumu](kvkk_compliance.md): kişisel verilerin uçta nasıl işlendiği
- [Cloudflare Deploy Rehberi](cloudflare_deployment_guide.md): ortamlar ve sırlar
