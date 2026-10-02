# KVKK ve GDPR Uyum Rehberi

E-Market, 6698 sayılı Kişisel Verilerin Korunması Kanunu'na (**KVKK**) göre
tasarlanmıştır ve mimari olarak AB Genel Veri Koruma Tüzüğü (**GDPR**) ile de
uyumludur. Bu doküman platforma yerleşik uyum önlemlerini ve yayına almadan
önce yapılandırmanız gerekenleri anlatır.

> [!IMPORTANT]
> Bu doküman yalnızca teknik rehberlik içindir ve hukuki görüş değildir.
> Kurulumunuzun resmi KVKK uyum değerlendirmesi için veri koruma alanında
> uzman bir avukata danışın.

---

## KVKK'nın temel ilkeleri

KVKK, GDPR'a çok benzer biçimde e-ticaret için şu gereklilikleri getirir:

| Gereklilik | E-Market'teki karşılığı |
| :--- | :--- |
| **İşlemenin hukuki dayanağı** | Analitik izlemeden önce CMP ile açık rıza alınır |
| **Veri minimizasyonu** | Uçta (Worker'da) IP maskeleme ve kişisel veri temizleme |
| **Amaçla sınırlılık** | Analitik veriler yalnızca belirtilen amaçlarla kullanılır |
| **Saklama sınırlaması** | Veritabanı yedekleri şifreli ve erişimi kısıtlıdır |
| **Silme hakkı** | Kişisel alanlar admin panelinden silinir veya anonimleştirilir |
| **Erişim hakkı** | Müşteri siparişini takip bağlantısıyla görüntüler |
| **İhlal bildirimi** | Kişisel Verileri Koruma Kurulu'na 72 saat içinde bildirim |

---

## 1. Uç düzeyde gizlilik korumaları

Bu korumalar Cloudflare Worker'ında varsayılan olarak açıktır ve yapılandırma
gerektirmez. Kod: `api/src/middlewares/kvkkMiddleware.js`; tüm
`/api/v1/metrics/*` yollarında (GTM ve GA4 proxy'si) çalışır.

### IP adresi maskeleme

Bir analitik olayı Google Analytics 4'e iletilmeden önce istemcinin IP adresi
anonimleştirilir ve GA4'e `uip` parametresiyle yalnızca maskeli adres gider:

- IPv4: son oktet sıfırlanır (`203.0.113.42` → `203.0.113.0`).
- IPv6: arayüz kimliğini taşıyan son 64 bit atılır
  (`2001:db8:85a3:8d3:1319:8a2e:370:7348` → `2001:db8:85a3:8d3::`).

Böylece KVKK'ya göre kişisel veri sayılan tam IP adresi üçüncü taraf analitik
servislerine aktarılmaz.

### Kişisel veri temizleme

Analitik isteklerin sorgu dizgesi ve gövdesi iletilmeden önce temizlenir:

- Serbest metindeki e-posta adresleri `[MASKED_EMAIL]`, Türk cep telefonu
  numaraları `[MASKED_PHONE]` ile değiştirilir.
- Anahtar adı kişisel veri belirten alanların (`email`, `eposta`, `phone`,
  `telefon`, `fullname`, `adsoyad`, `address`, `adres`, `tc`, `tckn`) değeri,
  biçiminden bağımsız olarak tamamen `[MASKED]` yapılır. Ad veya adres gibi
  e-posta/telefon kalıbına uymayan veriler de böylece dışarı çıkmaz.

Bu davranış `kvkkMiddleware.test.js` ile test edilir.

---

## 2. Çerez rıza yönetimi (CMP)

### Yasal gereklilik

KVKK ve elektronik haberleşmeye ilişkin ikincil mevzuat uyarınca, hizmetin
çalışması için **zorunlu olmayan her çerez**, yerleştirilmeden önce
kullanıcının açık, bilgilendirilmiş ve özgür iradesiyle verdiği rızayı
gerektirir. Buna şunlar dahildir:

- Analitik çerezleri (GA4, GTM)
- Pazarlama ve reklam çerezleri (Google Ads, Facebook Pixel)
- Tercih çerezleri (dil, para birimi)

### Google Consent Mode v2 entegrasyonu

E-Market, analitik etiketlerinin kullanıcının rıza tercihine uyması için
**Google Consent Mode v2** ile entegre çalışır. Teknik ayrıntılar için
[Google Servisleri Entegrasyon Rehberi](google_services.md)'ne bakın.

**Temel davranış:**

- **Rıza verilmeden önce:** GTM yalnızca anonim, çerezsiz ping'ler gönderir;
  kullanıcıyı tanımlayan veri saklanmaz.
- **"Kabul et" sonrası:** Davranış verisiyle tam GA4 ölçümü yapılır.
- **"Reddet" sonrası:** GA4, kişisel veri olmadan metrikleri tahmin etmek
  için **davranışsal modelleme** kullanır; raporlar yasayı ihlal etmeden
  istatistiksel olarak kullanılabilir kalır.

### CMP seçenekleri

| Seçenek | Notlar |
| :--- | :--- |
| **Cookiebot** (cookiebot.com) | KVKK'ya hazır, çerezleri otomatik tarar, hazır Consent Mode v2 entegrasyonu |
| **Iubenda** (iubenda.com) | Türkçe politika şablonları sunar |
| **Özel CMP** | [Google servisleri dokümanındaki](google_services.md#6-kvkk-uyumlu-consent-mode-v2) kalıpla kendiniz geliştirin |

CMP penceresi, herhangi bir analitik kodu çalışmadan önce **ilk sayfa
yüklemesinde** gösterilmelidir. `denied` olarak ayarlanan `consent default`
GTM komutu bu sıralamayı garanti eder.

---

## 3. D1 veritabanında saklanan veriler

### Saklananlar

| Tablo | Kişisel veri | Saklama |
| :--- | :--- | :--- |
| `siparisler` | Ad, soyad, e-posta, telefon, teslimat adresi | Sipariş tamamlanana kadar + yasal saklama süresi |
| `iade_talepleri` | Siparişe bağlı iade bilgileri ve gerekçe | İade sonuçlanana kadar + yasal saklama süresi |
| `islem_gecmisi` | Sipariş durum değişiklikleri | Siparişle birlikte |

Müşteri hesabı yoktur. Müşteri siparişine, sipariş sırasında üretilen rastgele
bir takip token'ı (`crypto.randomUUID()`) içeren bağlantıyla erişir.

### Saklanmayanlar

- Kart numaraları: Kart bilgisi yalnızca ödeme isteği sırasında ödeme
  sağlayıcısına (Param, iyzico veya PayTR) iletilir ve veritabanına yazılmaz.
- Parolalar: Müşteri hesabı yoktur; admin girişi Cloudflare Access ile yapılır.
- Ham IP adresleri: Analitiğe yalnızca maskeli IP gider.

### Silme hakkı (KVKK md. 7)

Bir müşteri verilerinin silinmesini istediğinde:

1. Admin panelinde ilgili sipariş kayıtlarını bulun.
2. Kişisel alanları (ad, e-posta, telefon, adres) silin veya anonimleştirin.
3. Muhasebe ve yasal yükümlülükler için sipariş tutarlarını ve ürün
   kimliklerini saklayın (Türk Ticaret Kanunu ve Vergi Usul Kanunu ticari
   defter ve belgelerin 10 yıl saklanmasını öngörür).

---

## 4. KVKK Aydınlatma Metni

KVKK, vitrinde açıkça erişilebilir bir **Aydınlatma Metni** bulunmasını
zorunlu kılar. Vitrindeki taslak metin `client/public/legal/kvkk.html`
dosyasındadır. Metin şunları içermelidir:

1. **Veri sorumlusunun kimliği:** şirket unvanı, adresi ve KEP adresi
2. **İşleme amaçları:** ör. sipariş, kargo, müşteri hizmetleri
3. **Hukuki sebepler:** sözleşmenin ifası (md. 5/2-c), hukuki yükümlülük
   (md. 5/2-ç) veya açık rıza (md. 5/1)
4. **Aktarılan taraflar:** Cloudflare (barındırma ve e-posta gönderimi), ödeme
   sağlayıcıları, Google (analitik; yalnızca rıza varsa)
5. **Saklama süreleri:** tablo ve amaç bazında
6. **İlgili kişinin hakları:** erişim, düzeltme, silme, itiraz, kısıtlama ve
   taşınabilirlik

> [!NOTE]
> Bağlantıyı her sayfanın alt bilgisine ve ödeme formuna ekleyin.

---

## 5. Veri işleyen sözleşmeleri

Bu e-ticaret sistemini işleten olarak **veri sorumlusu** sizsiniz; hizmet
sağlayıcılarınız **veri işleyendir**. Her biriyle bir veri işleme sözleşmesi
(DPA) yapmanız gerekir:

| Veri işleyen | DPA |
| :--- | :--- |
| **Cloudflare** | [cloudflare.com/gdpr/](https://www.cloudflare.com/gdpr/) |
| **Google** (Analytics/Workspace) | [cloud.google.com/terms/data-processing-addendum](https://cloud.google.com/terms/data-processing-addendum) |
| **iyzico** / **Param** / **PayTR** | Doğrudan sağlayıcının hukuk/uyum ekibinden isteyin |

---

## 6. Yurt dışına veri aktarımı

KVKK md. 9, kişisel verilerin yurt dışına aktarımını kanunda belirtilen
şartlara bağlar (yeterlilik kararı, uygun güvenceler veya istisnai haller).
Aktarım yapılan her hizmet için hangi şartın sağlandığını kayıt altına alın.

**Cloudflare:** İşlemeyi belirli bölgelerle sınırlamak için Cloudflare'in
[Data Localization Suite](https://www.cloudflare.com/data-localization/)
özelliklerine (ör. Regional Services) bakın.

**Google Analytics:** GA4 verileri Google'ın veri merkezlerinde (ağırlıklı
olarak ABD/AB) işlenir. `consent default: denied` yaklaşımında kullanıcı rıza
verene kadar kişisel veri gönderilmez.

---

## 7. Güvenlik önlemleri

KVKK md. 12 uygun teknik ve idari güvenlik önlemlerini zorunlu kılar:

| Önlem | Durum |
| :--- | :--- |
| Tüm trafikte HTTPS (TLS) ve HSTS | ✅ Cloudflare ve güvenlik başlıklarıyla |
| Admin kimlik doğrulaması | ✅ Cloudflare Access; API, Access JWT'sini doğrular |
| İstek sınırlama | ✅ Workers Rate Limiting (IP başına) |
| Şifreli veritabanı yedekleri | ✅ GPG ile AES-256 simetrik şifreleme |
| CI'da güvenlik taramaları | ✅ Gitleaks, OSV-Scanner, Semgrep, Opengrep, CodeQL, Trivy, Conftest, OWASP ZAP |
| Bağımlılık güncellemeleri | ✅ Dependabot |
| Kodda düz metin sır yok | ✅ Sırlar Wrangler secret'ları ve GitHub Secrets ile; Gitleaks ve Conftest denetler |

Ayrıntılar: [DevSecOps hattı](devsecops_pipeline.md).

---

## 8. Veri ihlali bildirimi

Bir kişisel veri ihlali olursa:

1. İhlali **sınırlayın** (ele geçirilen token'ları iptal edin, etkilenen
   sistemleri izole edin).
2. Kapsamı **değerlendirin**: hangi verilere erişildi, kaç kişi etkilendi.
3. **Kurul'a 72 saat içinde** [kvkk.gov.tr](https://www.kvkk.gov.tr)
   üzerindeki resmi bildirim sistemiyle bildirin.
4. İhlal ilgili kişilerin haklarını ciddi biçimde etkiliyorsa **ilgili
   kişileri bilgilendirin**.
5. İhlali kurum içi olay kaydına işleyin.

---

## İlgili dokümanlar

- [Google Servisleri Entegrasyonu](google_services.md): Consent Mode v2 uygulaması
- [Google Drive Yedeği](google_drive_backup.md): şifreli yedek güvenliği
- [Ödeme Sağlayıcıları Rehberi](payment_gateways.md): kart verisinin sağlayıcıda kalması
