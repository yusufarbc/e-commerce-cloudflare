# Kural Doğrulaması

Kontrol tarihi: 2026-09-28

Motor: Opengrep 1.30.0

Binary SHA-256: `b5cf4f8fe9f44e030aab2d579d96bd395c139db1f1ba66633676ff4d5ebc7c39`

Hem `rules/edge` hem `rules/pinned` paketleri C001 korpusu üzerinde exit code
0 ile çalıştı. Her paket iki bulgu üretti:

- `cases/C001-d1-sqli/http_vuln.js`
- `cases/C001-d1-sqli/queue_vuln.js`

Düzeltilmiş ikizlerde bulgu oluşmadı. Böylece ilk örnekte beklenen 2 TP, 0 FP
sonucu elde edildi. Semgrep 1.178.0 doğrulaması GitHub runner'da ayrıca
çalışacaktır; yerel Docker daemon kapalı olduğu için konteyner testi bu
oturumda yapılamadı.
