# Automated Google Drive Database Backup

E-Market includes a fully automated, encrypted nightly backup pipeline that exports the Cloudflare D1 database, compresses and encrypts the dump, and uploads it securely to Google Drive. The entire pipeline runs on GitHub Actions with zero external npm dependencies.

---

## Architecture

```mermaid
sequenceDiagram
    participant GH as GitHub Actions (Cron 00:00 UTC)
    participant CF as Cloudflare D1 API
    participant GPG as GPG (Encrypt)
    participant Drive as Google Drive

    GH->>CF: wrangler d1 export --remote
    CF-->>GH: d1-backup.sql (plaintext SQL dump)
    GH->>GH: gzip → d1-backup.sql.gz
    GH->>GPG: gpg --symmetric (passphrase from secret)
    GPG-->>GH: d1-backup.sql.gz.gpg (encrypted)
    GH->>Drive: uploadToDrive.js (Service Account OAuth2 JWT)
    Drive-->>GH: File ID confirmed
```

---

## Step 1: Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a project** → **New Project**
3. Name it (e.g., `e-market-backups`) and click **Create**
4. Note the **Project ID** for the next steps

---

## Step 2: Enable the Google Drive API

1. In your GCP project, go to **APIs & Services** → **Library**
2. Search for `Google Drive API` and click **Enable**

---

## Step 3: Create a Service Account

A Service Account is a non-human Google identity used by the backup script to authenticate with the Drive API — no user login required.

1. Go to **IAM & Admin** → **Service Accounts** → **Create Service Account**
2. Name it `e-market-backup-agent` and click **Create and Continue**
3. Skip role assignment (the Drive folder permission is set separately) → **Done**
4. Click on the new service account → **Keys** tab → **Add Key** → **Create New Key** → **JSON**
5. The JSON key file downloads automatically. **Store this file securely — it cannot be re-downloaded.**

The JSON key file looks like this:

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

## Step 4: Prepare Your Google Drive Folder

1. Open [drive.google.com](https://drive.google.com)
2. Create a new folder named `E-Market DB Backups` (or similar)
3. Right-click the folder → **Share**
4. In the "Add people" field, enter the service account's **`client_email`** address (e.g. `e-market-backup-agent@e-market-backups.iam.gserviceaccount.com`)
5. Set permission to **Editor** and click **Send**

**Get the Folder ID:**
Open the folder in your browser. The URL will look like:
```
https://drive.google.com/drive/folders/1aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567
```
The long string after `/folders/` is your **Folder ID**.

---

## Step 5: Configure GitHub Secrets

In your GitHub repository go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret** and add each of the following:

| Secret Name | Value |
| :--- | :--- |
| `CLOUDFLARE_API_TOKEN` | A Cloudflare API token with **D1 Edit** permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID (found in the Workers dashboard) |
| `BACKUP_ENCRYPTION_PASSPHRASE` | A strong random passphrase (e.g. 32+ character random string) used to encrypt the backup with GPG |
| `GDRIVE_SERVICE_ACCOUNT` | The **full contents** of the service account JSON key file (paste as-is) |
| `GDRIVE_FOLDER_ID` | The Google Drive Folder ID from Step 4 |

> [!CAUTION]
> Never commit the JSON key file or passphrase to the repository. Always use GitHub Secrets.

---

## Step 6: How the Backup Workflow Runs

The workflow file is at [`.github/workflows/backup.yml`](../.github/workflows/backup.yml).

It runs automatically every night at **00:00 UTC** and can also be triggered manually from the **Actions** tab.

**Pipeline stages:**

1. **Export** — Wrangler exports the production D1 database as a plain SQL dump:
   ```bash
   npx wrangler d1 export ecommerce-d1 --remote --output=d1-backup.sql
   ```

2. **Compress** — The SQL file is gzip-compressed to reduce size:
   ```bash
   gzip d1-backup.sql   # → d1-backup.sql.gz
   ```

3. **Encrypt** — The compressed file is symmetrically encrypted with GPG using your passphrase:
   ```bash
   gpg --symmetric --batch --yes \
     --passphrase "$BACKUP_ENCRYPTION_PASSPHRASE" \
     -o d1-backup.sql.gz.gpg d1-backup.sql.gz
   ```
   The result is `d1-backup.sql.gz.gpg` — the file is **unreadable without the passphrase**.

4. **Upload** — The encrypted file is uploaded to Google Drive via a zero-dependency Node.js script (`scripts/uploadToDrive.js`) that authenticates using the Service Account JWT:
   ```bash
   node scripts/uploadToDrive.js d1-backup.sql.gz.gpg
   ```

---

## Step 7: Restoring a Backup

To decrypt and restore a backup file:

```bash
# 1. Decrypt the backup
gpg --decrypt \
    --batch \
    --passphrase "YOUR_PASSPHRASE" \
    -o d1-backup.sql.gz \
    d1-backup.sql.gz.gpg

# 2. Decompress
gunzip d1-backup.sql.gz   # → d1-backup.sql

# 3. Restore to a local D1 instance (for inspection)
npx wrangler d1 execute ecommerce-d1 --local --file=d1-backup.sql

# 4. Restore to remote production D1 (use with extreme caution!)
npx wrangler d1 execute ecommerce-d1 --remote --file=d1-backup.sql
```

> [!WARNING]
> Restoring to the **remote** production database overwrites live data. Always verify the backup contents locally first before applying remotely.

---

## Backup Retention

The backup workflow does not automatically delete old files from Google Drive. Google Drive's storage quota applies. Recommended practices:

- **Manual rotation**: Delete backups older than 90 days monthly.
- **Automated rotation**: Use Google Drive's native **Storage management** feature or a scheduled Apps Script to auto-delete files older than N days.

---

## Related Documentation

- [Google Services Integration](google_services.md)
- [CI/CD Pipeline](cicd_pipeline.md)
- [KVKK Compliance](kvkk_compliance.md)
