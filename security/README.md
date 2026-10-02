# Security configuration

Configuration consumed by the DevSecOps pipeline
(`.github/workflows/devsecops-pipeline.yml`). See
[docs/devsecops_pipeline.md](../docs/devsecops_pipeline.md) for the full design.

| Path | Tool | Purpose |
| --- | --- | --- |
| `opengrep/` | Opengrep (`--taint-intrafile`) | Cloudflare Workers taint rules: request, queue, R2-notification and cron data reaching D1 SQL, R2 keys or `fetch` URLs |
| `policy/wrangler.rego` | Conftest (OPA) | Deployment policy for `api/wrangler.toml`: no secrets in `vars`, preview D1/R2 never live, no wildcard CORS |
| `zap/rules.tsv` | OWASP ZAP baseline | Rule overrides for the post-deploy DAST scan; every override needs a reason |

Root-level files follow tool conventions: `.gitleaks.toml` and
`.gitleaksignore` (Gitleaks) and `.semgrepignore` (Semgrep).

Run the custom rules locally:

```bash
opengrep scan --config security/opengrep --taint-intrafile --error api/src
```
