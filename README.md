# e-commerce-cloudflare

Cloudflare, geleneksel sunucu mimarilerinden (PENR gibi) farklı olarak, her şeyi "uç noktada" (edge) ve sunucusuz (serverless) çalıştıran devasa bir platformdur. Kurmakta olduğun yapı için bu ekosistemi tek bir tabloda ve özetle şöyle toplayabiliriz:

---

## Cloudflare Modern Uygulama Ekosistemi

### 🏗️ Temel Servisler (Core Stack)

* **Cloudflare Pages (Frontend):** React uygulamalarını barındırır. GitHub/GitLab ile tam entegredir; her "push" işleminde otomatik deploy olur. Dünyanın en hızlı CDN ağını kullanır.
* **Cloudflare Workers (Backend):** JavaScript/TypeScript fonksiyonlarıdır. Geleneksel sunucu (Node.js) yerine V8 Isolate kullanır; bu sayede "cold start" (ilk açılış gecikmesi) yaşatmaz.
* **Cloudflare D1 (Database):** SQL tabanlı (SQLite) sunucusuz veritabanıdır. JSON veya ilişkisel verilerini tutmak için idealdir.
* **Cloudflare R2 (Storage):** Obje depolama servisidir. Ürün görsellerini ve dosyaları burada saklarsın. Diğer bulut sağlayıcıların aksine, veriyi dışarı çekerken (egress) ücret almaz.



---

### 📧 Email Çözümleri (İletişim)

Cloudflare üzerinde mail trafiğini yönetmek için üç ana yolun var:

1.  **Email Routing:** Sınırsız sayıda `islem@alanadin.com` gibi adres oluşturup bunları kişisel mailine yönlendirebilirsin. (Tamamen Ücretsiz)
2.  **Workers Send Email:** Alan adın Cloudflare üzerindeyse, doğrudan Workers içinden kod yazarak mail gönderebilirsin.
3.  **Third Party API (Önerilen):** E-ticaret gibi "mailin ulaşmama lüksü olmayan" işlerde, Workers içinden **Resend** veya **Postmark** gibi servislerin API'sine `fetch` isteği atarak mail göndermek en güvenli yoldur.



---

### 🔒 Güvenlik ve Yönetim (Admin Panel Çözümü)

Uygulamanın siber güvenlik katmanını ve admin girişini kod yazmadan halletmeni sağlar:

* **Cloudflare Access (Zero Trust):** Admin panelini (`/admin`) korumaya alır. Sadece senin belirlediğin e-postalar, tek kullanımlık şifre (OTP) ile içeri girebilir. Login ekranı kodlamana gerek kalmaz.
* **Turnstile:** Siteni botlardan koruyan, kullanıcıyı yormayan modern (CAPTCHA alternatifi) doğrulama servisidir.

---

### 💰 Hızlı Maliyet & Limit Özeti (Ücretsiz Planlar)

| Özellik | Ücretsiz Plan Kapasitesi | Senaryo |
| :--- | :--- | :--- |
| **Bant Genişliği** | **Sınırsız** | Video/Resim yükü için bedava. |
| **Workers** | Günde 100.000 İstek | API çağrıları için fazlasıyla yeterli. |
| **D1 (Database)** | 5M Okuma / 1M Yazma (Aylık) | Küçük/Orta ölçekli e-ticaret için bedava. |
| **R2 (Storage)** | 10 GB Depolama | Binlerce ürün resmi için yeterli. |
| **Zero Trust** | 50 Kullanıcıya kadar bedava | Sadece sen ve ekibin gireceği için bedava. |

---

### Neden Bu Yapı?

Geleneksel bir VPS (Sanal Sunucu) kiraladığında; işletim sistemi güncelleme, firewall ayarları, SSH güvenliği ve veritabanı yedeği gibi "angarya" işlerle uğraşman gerekir. Cloudflare'de ise bu katmanların tamamı platform tarafından yönetilir. Sen sadece kodunu yazarsın, geri kalan her şeyi Cloudflare dünya genelindeki 300'den fazla veri merkezinde senin yerine halleder.

Bu yapıya geçerken ilk olarak hangi parçayı (Frontend mi yoksa API mi) Cloudflare üzerine taşımayı planlıyorsun?
