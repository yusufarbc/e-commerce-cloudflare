# Security Policy

We take the security of E-Market seriously. If you believe you have found a
security vulnerability, please report it privately.

**Please do not report security vulnerabilities through public GitHub issues.**

---

## 🛡️ Supported Versions

Security fixes are applied to the `production` branch, which is what the live
demo runs.

| Version | Supported |
| :--- | :--- |
| `production` branch (latest) | ✅ |
| Older commits and forks | ❌ |

---

## 📥 Reporting a Vulnerability

Use **GitHub Private Vulnerability Reporting**: open the repository's
**Security** tab, choose **Advisories**, and click **Report a vulnerability**.
The report is visible only to the maintainers.

Please include:

- a clear description of the vulnerability, the affected component (API,
  storefront, admin, pipeline) and the potential impact;
- step-by-step instructions or a proof of concept to reproduce it;
- the environment you tested against (`staging` or `production` demo, or a
  local setup with its Node.js and Wrangler versions).

Test against the demo environments only with your own data, keep automated
scanning at a low request rate (the API enforces per-IP rate limits), and do
not access or modify other users' orders.

---

## ⚡ Response Timeline

This is a community-maintained open-source project, so timelines are best
effort:

- **Acknowledgement:** within 3 business days.
- **Assessment:** within 7 business days, with a severity estimate.
- **Fix:** we aim to ship a fix through the pipeline within 30 days of
  confirmation, sooner for critical issues.
- **Disclosure:** after the fix is deployed we publish a GitHub Security
  Advisory and credit the reporter unless anonymity is requested.

---

## 🔒 Security Controls

Every change passes a fail-closed DevSecOps pipeline (secret scanning, SCA,
SAST, IaC policy, SBOM and post-deploy DAST) before it reaches Cloudflare. See
[docs/devsecops_pipeline.md](docs/devsecops_pipeline.md) (Turkish).
