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

## pilot-04 (2026-10-02)

Commit `c55934d` (staging), run'lar: `36911777303` (baseline),
`36911783660` (default), `36911788922` (default+custom). Tüm araçlar exit
code 0 ile çalıştı. Conftest exit 1 (politika ihlali bulundu); namespace
düzeltmesinden sonra politika artık değerlendiriliyor. Checkov SARIF'i
okunabilir. OSV-Scanner ve npm audit temiz.

### Dört kollu C001 (yalnızca dev seti, `analysis.score`)

| Konfigürasyon | ctrl | express | hono | event (queue) |
| --- | --- | --- | --- | --- |
| CodeQL 2.27.1 `security-extended` | TP | FN | FN | FN |
| Semgrep 1.178.0 varsayılan kurallar | TP | TP | FN | FN |
| Semgrep `rules/edge` (taint, özel) | FN | FN | TP | TP |
| Semgrep / Opengrep pattern (parity) | TP | TP | TP | TP |
| Gitleaks, Trivy, Checkov | FN | FN | FN | FN |

Fixed ikizlerde FP yok. CodeQL `js/missing-rate-limiting` (CWE-307/400/770)
ctrl ikizlerinde raporlandı; SQL ailesinde olmadığı için puanlamaya girmedi.

Gözlemler (tek çift; istatistik yok):
- **Kalibrasyon kolu işe yaradı.** CodeQL `ctrl`'ü yakaladı, `express`'i
  kaçırdı: kaynak aynı (Express), fark yalnızca sink (better-sqlite3 → D1).
  Bu, D1 sink'inin CodeQL'de modellenmediğini gösteren ilk veri (H1). `ctrl`
  olmasaydı CodeQL'in tüm kolları kaçırması "event körlüğü" sanılabilirdi.
- **Semgrep varsayılan kurallarda çerçeve etkisi görünüyor:** Express kaynağı
  yakalandı, Hono ve queue kaçırıldı (H2b).
- **Birincil karşılaştırma için karar gerekiyor:** Preregistration'da H2a'nın
  birincil karşılaştırması `hono` – `event`. Bu çiftte Semgrep varsayılan
  kuralları ve CodeQL iki kolu da kaçırdı; çift H2a için bilgi taşımıyor.
  Seçenekler §10'a not edildi.
- Özel taint kuralı Express `req.query` özelliğini kaynak saymıyor (yalnızca
  Hono ve event kaynakları için yazıldı); `express` kolundaki FN beklenen.
- Pattern kuralları kaynaktan bağımsız tüm kolları yakaladı (tavan etkisi);
  bu yüzden preregistration'da ayrı raporlanıyor.
