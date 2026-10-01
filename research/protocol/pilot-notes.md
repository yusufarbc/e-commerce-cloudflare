# Pilot Notları

## pilot-03 (2026-09-30)

Commit `edbfea4`, run'lar: `36718802879` (baseline), `36718807719` (default),
`36718811970` (default+custom). Üç koşu da tamamlandı ve her araç için exit
code, sürüm ve milisaniye süre kaydedildi.

### C001 tespitleri (default+custom)

| Araç / kural seti | http_vuln | queue_vuln | fixed ikizler |
| --- | --- | --- | --- |
| CodeQL `security-extended` 2.27.1 | — | — | — |
| Semgrep 1.178.0, pinned semgrep-rules JS/TS | — | — | — |
| Semgrep engine-parity (pattern) | satır 7 | satır 6 | — |
| Opengrep 1.30.0 engine-parity (pattern) | satır 7 | satır 6 | — |
| Semgrep custom `rules/edge` (taint) | satır 7 | satır 6 | — |

- Varsayılan CodeQL ve varsayılan Semgrep kuralları Hono HTTP ikizini de
  kaçırdı. Bu, literatürde öngörülen **taban etkisinin** ilk gözlemidir;
  Express pozitif kontrol kolu olmadan RQ2 yorumlanamaz.
- Araçlar bulguyu çok satırlı ifadenin başlangıç satırında (`await c.env.DB`)
  raporluyor; ground truth'taki `sink_line` ise `.prepare(` satırı. ±3
  toleransı içinde, ancak M0'da sink satırının "ifadenin başlangıcı mı,
  çağrı satırı mı" olduğu tanımlanmalı.
- Tek çift üzerinden hiçbir istatistiksel yorum yapılmaz.

### Ölçüm hattı sorunları

- `checkov.sarif` parse edilemedi (banner stdout'a yazıldı). Düzeltildi:
  `--output-file-path`.
- Conftest varsayılan `main` namespace'ine baktığı için `wrangler.security`
  politikası hiç çalışmadı. Düzeltildi: `--all-namespaces`. Kural içeriği
  değiştirilmedi (organik vakalar held-out).
- Gitleaks ve Trivy korpusta 0 bulgu verdi. Organik O001'deki düşük entropili
  `ADMIN_JWT_SECRET` varsayılan kurallarla yakalanmıyor; bu RQ1 verisidir,
  hata değildir.
- OSV-Scanner ve `npm audit` (api) exit 1: o commit'teki `vitest@3` açığı
  (bulgu, çökme değil). Sonraki commit'te giderildi.
- Runner image koşular arasında farklı (`ubuntu24-20260927.320.1` ve
  `ubuntu24-20260920.314.x`). E4'te image sürümü kovaryat olarak kaydedilmeli
  veya aynı image'lı koşular karşılaştırılmalı.

### Süreler (default, ms)

baseline 18615 · CodeQL 54387 · Semgrep 22449 · Opengrep 2158 ·
OSV 13025 · npm audit 1921 · Gitleaks 2213 · Trivy 21894 · Checkov 25794
