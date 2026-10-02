# Google Drive'a Otomatik Veritabanı Yedeği

E-Market, Cloudflare D1 veritabanını dışa aktaran, dökümü sıkıştırıp şifreleyen
ve Google Drive'a yükleyen bir yedekleme hattı içerir. Hat GitHub Actions
üzerinde çalışır; yükleme betiği harici npm bağımlılığı kullanmaz.

> [!NOTE]
> Demo ortamında gece zamanlaması kapalıdır; yedek **Actions** sekmesinden elle
> başlatılır. Otomatik yedek için `.github/workflows/backup.yml` dosyasındaki
> `schedule` bloğunun yorumunu kaldırın.

---

## Mimari

```mermaid
sequenceDiagram
    participant GH as GitHub Actions
    participant CF as Cloudflare D1 API
    participant GPG as GPG (şifreleme)
    participant Drive as Google Drive

    GH->>CF: wrangler d1 export --remote
    CF-->>GH: d1-backup.sql (düz SQL dökümü)
    GH->>GH: gzip → d1-backup.sql.gz
    GH->>GPG: gpg --symmetric (parola secret'tan, stdin ile)
    GPG-->>GH: d1-backup.sql.gz.gpg (şifreli)
    GH->>Drive: uploadToDrive.js (Service Account OAuth2 JWT)
    Drive-->>GH: Dosya kimliği onaylandı
```

---

## 1. Adım: Google Cloud projesi oluşturun

1. [console.cloud.google.com](https://console.cloud.google.com) adresine gidin.
2. **Select a project** → **New Project** seçin.
3. Projeye bir ad verin (ör. `e-market-backups`) ve **Create**'e tıklayın.
4. Sonraki adımlar için **Project ID** değerini not edin.

---

## 2. Adım: Google Drive API'yi etkinleştirin

1. GCP projesinde **APIs & Services** → **Library** bölümüne gidin.
2. `Google Drive API` araması yapın ve **Enable**'a tıklayın.

---

## 3. Adım: Service Account oluşturun

Service Account, yedekleme betiğinin Drive API'de kimlik doğrulamak için
kullandığı insan dışı bir Google kimliğidir; kullanıcı girişi gerekmez.

1. **IAM & Admin** → **Service Accounts** → **Create Service Account** seçin.
2. Adını `e-market-backup-agent` yapın ve **Create and Continue**'ya tıklayın.
3. Rol atamasını atlayın (Drive klasör izni ayrıca verilir) → **Done**.
4. Yeni service account'a tıklayın → **Keys** sekmesi → **Add Key** →
   **Create New Key** → **JSON**.
5. JSON anahtar dosyası otomatik iner. **Dosyayı güvenli saklayın; tekrar
   indirilemez.**

JSON anahtar dosyası şuna benzer:

```json
{
  "type": "service_account",
  "project_id": "e-market-backups",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n",
  "client_email": "e-market-backup-agent@e-market-backups.iam.gserviceaccount.com",
  "client_id": "123456789...",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

---

## 4. Adım: Google Drive klasörünü hazırlayın

1. [drive.google.com](https://drive.google.com) adresini açın.
2. `E-Market DB Backups` (veya benzeri) adında yeni bir klasör oluşturun.
3. Klasöre sağ tıklayın → **Share**.
4. "Add people" alanına service account'un **`client_email`** adresini yazın
   (ör. `e-market-backup-agent@e-market-backups.iam.gserviceaccount.com`).
5. İzni **Editor** yapın ve **Send**'e tıklayın.

**Klasör kimliğini alın:** Klasörü tarayıcıda açın. URL şuna benzer:

```text
https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567
```

`/folders/` sonrasındaki uzun dizi **Folder ID** değeridir.

---

## 5. Adım: GitHub secret'larını tanımlayın

GitHub reposunda **Settings** → **Secrets and variables** → **Actions** →
**New repository secret** yolunu izleyin ve şunları ekleyin:

| Secret adı | Değer |
| :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | **D1 Edit** yetkisi olan bir Cloudflare API token'ı (deploy token'ı bu yetkiyi zaten içerir) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare hesap kimliği |
| `BACKUP_ENCRYPTION_PASSPHRASE` | Yedeği GPG ile şifrelemek için güçlü, rastgele bir parola (32+ karakter) |
| `GDRIVE_SERVICE_ACCOUNT` | Service account JSON anahtar dosyasının **tüm içeriği** (olduğu gibi yapıştırın) |
| `GDRIVE_FOLDER_ID` | 4. adımdaki Google Drive klasör kimliği |

> [!CAUTION]
> JSON anahtar dosyasını veya parolayı asla repoya commit etmeyin. Her zaman
> GitHub Secrets kullanın.

---

## 6. Adım: Yedekleme workflow'u nasıl çalışır

Workflow dosyası:
[`.github/workflows/backup.yml`](../.github/workflows/backup.yml).

**Aşamalar:**

1. **Dışa aktarma:** Wrangler production D1 veritabanını düz SQL dökümü
   olarak dışa aktarır:
   ```bash
   npx wrangler@4.145.0 d1 export ecommerceflaredev-d1-production --remote --output=d1-backup.sql
   ```
2. **Sıkıştırma:** SQL dosyası gzip ile sıkıştırılır (`d1-backup.sql.gz`).
3. **Şifreleme:** Sıkıştırılmış dosya parolayla, AES-256 ile simetrik olarak
   şifrelenir. Parola komut satırında değil stdin üzerinden verilir:
   ```bash
   printf '%s' "$BACKUP_ENCRYPTION_PASSPHRASE" | gpg --batch --yes --pinentry-mode loopback \
     --passphrase-fd 0 --symmetric --cipher-algo AES256 \
     --output d1-backup.sql.gz.gpg d1-backup.sql.gz
   ```
   Sonuç `d1-backup.sql.gz.gpg` dosyasıdır; **parola olmadan okunamaz.**
4. **Yükleme:** Şifreli dosya, service account JWT'siyle kimlik doğrulayan
   bağımlılıksız bir Node.js betiğiyle (`scripts/uploadToDrive.js`) Google
   Drive'a yüklenir:
   ```bash
   node scripts/uploadToDrive.js d1-backup.sql.gz.gpg
   ```

---

## 7. Adım: Yedeği geri yükleme

```bash
# 1. Şifreyi çözün (parola istenir)
gpg --decrypt -o d1-backup.sql.gz d1-backup.sql.gz.gpg

# 2. Açın
gunzip d1-backup.sql.gz   # → d1-backup.sql

# 3. İncelemek için yerel D1'e yükleyin (api/ dizininde)
npx wrangler@4.145.0 d1 execute DB --local --file=d1-backup.sql

# 4. Uzak production D1'e geri yükleyin (çok dikkatli kullanın!)
npx wrangler@4.145.0 d1 execute DB --env production --remote --file=d1-backup.sql
```

> [!WARNING]
> **Uzak** production veritabanına geri yükleme canlı verinin üzerine yazar.
> Uzak ortama uygulamadan önce yedeğin içeriğini her zaman yerelde doğrulayın.

---

## Saklama süresi

Workflow eski dosyaları Google Drive'dan otomatik silmez; Google Drive kotası
geçerlidir. Önerilen uygulamalar:

- **Elle döndürme:** 90 günden eski yedekleri ayda bir silin.
- **Otomatik döndürme:** Google Drive'ın **Storage management** özelliğini
  veya N günden eski dosyaları silen zamanlanmış bir Apps Script kullanın.

---

## İlgili dokümanlar

- [Google Servisleri Entegrasyonu](google_services.md)
- [CI/CD Hattı](cicd_pipeline.md)
- [KVKK Uyumu](kvkk_compliance.md)
