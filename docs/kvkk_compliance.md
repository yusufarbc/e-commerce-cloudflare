# KVKK & GDPR Compliance Guide

E-Market is designed from the ground up for Turkish data privacy law (**KVKK** — Kişisel Verilerin Korunması Kanunu, Law No. 6698) and is architecturally aligned with **GDPR** (EU General Data Protection Regulation). This document explains the compliance measures built into the platform and what you need to configure before going live.

> [!IMPORTANT]
> This document is for technical guidance only and does not constitute legal advice. Consult a qualified Turkish data protection lawyer (avukat) for a formal KVKK compliance assessment of your deployment.

---

## KVKK Key Principles

KVKK, modeled closely on GDPR, establishes the following requirements relevant to e-commerce operations:

| Requirement | E-Market Implementation |
| :--- | :--- |
| **Lawful basis for processing** | Consent collected via CMP before any analytics tracking |
| **Data minimization** | IP masking, PII scrubbing at the edge |
| **Purpose limitation** | Analytics data used only for stated purposes |
| **Storage limitation** | Database backups encrypted and access-controlled |
| **Right to erasure** | Admin panel soft-delete for customer records |
| **Right to access** | Customer order history available via storefront |
| **Data breach notification** | Handled via KVKK Kurulu notification within 72 hours |

---

## 1. Edge-Level Privacy Protections

These are active by default in the Cloudflare Worker and require no configuration.

### IP Address Masking

Before any analytics event is forwarded to Google Analytics 4, the client's IP address is anonymized:

```javascript
// api/src/routes/metricsRoutes.js
const rawIp = c.req.header('cf-connecting-ip') || '';
// Remove last octet: 192.168.1.123 → 192.168.1.0
const maskedIp = rawIp.replace(/\.\d+$/, '.0');
```

This prevents the full IP address (which is classified as personal data under KVKK) from being transmitted to third-party analytics services.

### PII Scrubbing

All analytics event payloads are scanned and cleaned before forwarding:

```javascript
// api/src/utils/piiScrubber.js
const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const PHONE_PATTERN = /(\+?90|0)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/g;
const TC_ID_PATTERN = /\b\d{11}\b/g; // Turkish National ID (TC Kimlik No)

function scrubPII(payload) {
  const str = JSON.stringify(payload);
  return JSON.parse(
    str
      .replace(EMAIL_PATTERN, '[email]')
      .replace(PHONE_PATTERN, '[phone]')
      .replace(TC_ID_PATTERN, '[tc-id]')
  );
}
```

The scrubber removes:
- Email addresses
- Turkish phone numbers (GSM and landline formats)
- Turkish National ID numbers (TC Kimlik Numarası)

---

## 2. Cookie Consent Management (CMP)

### Legal Requirement

Under KVKK and Turkey's secondary legislation on electronic communications, **any cookie that is not strictly necessary** for the service to function requires the user's explicit, informed, and freely given consent before being set.

This includes:
- Analytics cookies (GA4, GTM)
- Marketing/advertising cookies (Google Ads, Facebook Pixel)
- Preference cookies (language, currency)

### Google Consent Mode v2 Integration

E-Market integrates with **Google Consent Mode v2** to ensure that analytics tags respect user consent choices. See the [Google Services Integration Guide](google_services.md) for the full technical implementation.

**Key behavior:**
- **Before consent is given**: GTM sends anonymous, cookieless pings only. No user-identifying data is stored.
- **After "Accept"**: Full GA4 measurement with behavioral data.
- **After "Reject"**: GA4 uses **Behavioral Modeling** to estimate metrics without personal data. Your reports remain statistically useful without violating the law.

### CMP Options

| Option | Notes |
| :--- | :--- |
| **Cookiebot** (cookiebot.com) | KVKK-ready, auto-scans cookies, pre-built Consent Mode v2 integration |
| **Iubenda** (iubenda.com) | Has Turkish-language policy templates |
| **Custom CMP** | Build your own using the pattern in [Google Services docs](google_services.md#6-kvkk-compliant-consent-mode-v2) |

The CMP widget must be displayed on the **first page load** before any analytics code fires. The `consent default` GTM command (set to `denied`) ensures this ordering is enforced.

---

## 3. Data Stored in D1 Database

### What Is Stored

The D1 database contains:

| Table | Personal Data | Retention |
| :--- | :--- | :--- |
| `siparisler` (Orders) | Name, email, shipping address, phone | Until fulfillment + legal retention period |
| `iadeler` (Returns) | Same as orders | Until return processed + legal period |
| Customer session (JWT) | Email (in signed token) | 24-hour token expiry |

### What Is NOT Stored

- Payment card numbers (handled entirely by gateway — Param, iyzico, or PayTR)
- Passwords (admin-only auth, no customer accounts in v1)
- Raw IP addresses (masked before any storage)

### Right to Erasure (KVKK Art. 7)

When a customer requests deletion of their data:

1. Locate the order records in the Admin Dashboard
2. Delete or anonymize the personal fields (name, email, phone, address)
3. Retain the order totals and product IDs for accounting/legal purposes (Turkish Commercial Law requires 10-year financial record retention)

---

## 4. KVKK Aydınlatma Metni (Privacy Notice)

KVKK requires a **Aydınlatma Metni** (Data Subject Information Notice) to be clearly accessible on your storefront. This document must include:

1. **Data Controller Identity** — your company name, address, and KEP (registered e-mail) address
2. **Purpose of Processing** — e.g., order fulfillment, shipping, customer service
3. **Legal Basis** — contractual necessity (Art. 5/2-c), legal obligation (Art. 5/2-ç), or consent (Art. 5/1)
4. **Data Recipients** — Cloudflare (hosting), payment gateways, email provider (Brevo), Google (analytics — only if consent given)
5. **Retention Periods** — per table/purpose
6. **Data Subject Rights** — right to access, correct, erase, object, restrict, and portability

> [!NOTE]
> The KVKK Aydınlatma Metni must be written in **Turkish** as the storefront targets Turkish users. Include a link in the footer of every page and at the checkout form.

---

## 5. Data Processor Agreements (Veri İşleyen Sözleşmesi)

As the operator of this e-commerce system, you are the **Veri Sorumlusu** (Data Controller). Your service providers are **Veri İşleyenler** (Data Processors). You must have a Data Processing Agreement (DPA) with each:

| Processor | DPA Location |
| :--- | :--- |
| **Cloudflare** | [cloudflare.com/gdpr/](https://www.cloudflare.com/gdpr/) |
| **Google** (Analytics/Workspace) | [cloud.google.com/terms/data-processing-addendum](https://cloud.google.com/terms/data-processing-addendum) |
| **Brevo** (Email) | [brevo.com/legal/termsofuse/](https://www.brevo.com/legal/termsofuse/) |
| **iyzico** / **Param** / **PayTR** | Request directly from the gateway's legal/compliance team |

---

## 6. International Data Transfers

KVKK Art. 9 restricts transfers of personal data to countries without "adequate protection" unless:
- Explicit consent is obtained, or
- A data transfer contract is in place

**Cloudflare**: Uses European data centers when configured. Enable **Regional Services** in Cloudflare to restrict processing to Turkey/EU only. See Cloudflare's [Data Localization Suite](https://www.cloudflare.com/data-localization/).

**Google Analytics**: GA4 data is processed in Google's data centers (primarily US/EU). The `consent default: denied` approach means no personal data leaves Turkey until the user consents.

---

## 7. Security Measures

KVKK Art. 12 requires appropriate technical and administrative security measures:

| Measure | Status |
| :--- | :--- |
| HTTPS (TLS) for all traffic | ✅ Enforced by Cloudflare |
| JWT authentication for admin | ✅ Implemented (24-hour expiry) |
| Encrypted database backups | ✅ GPG symmetric encryption |
| SAST security scanning in CI | ✅ Semgrep (ReDoS, injection) |
| Dependency vulnerability scanning | ✅ Dependabot + GitHub CodeQL |
| No plaintext secrets in code | ✅ All secrets via Wrangler secrets / GitHub Secrets |

---

## 8. KVKK Breach Notification

If a personal data breach occurs:

1. **Contain** the breach (revoke compromised tokens, isolate affected systems)
2. **Assess** the scope — what data was accessed, how many individuals affected
3. **Notify KVKK Kurulu** within **72 hours** via the official reporting system at [kvkk.gov.tr](https://www.kvkk.gov.tr)
4. **Notify affected individuals** if the breach poses a high risk to their rights
5. Document the breach in an internal incident register

---

## Related Documentation

- [Google Services Integration](google_services.md) — Consent Mode v2 implementation
- [Google Drive Backup](google_drive_backup.md) — encrypted backup security
- [Payment Gateway Guide](payment_gateways.md) — PCI-DSS compliance via gateways
