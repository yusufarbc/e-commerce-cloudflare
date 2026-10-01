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

## e1-01 — ilk E1/E2 ön koşusu (2026-10-02, yalnızca dev seti)

Run `36924977367`, commit `22a48fe`, profil `default+custom`. Dev seti: 7 çift
(C001–C007) × 4 kol. Held-out (X…, O…) puanlanmadı. Tüm araçlar exit 0
(Conftest exit 1 = politika ihlali, held-out organik vaka; incelenmedi).

### Kol bazında recall (n = 7 çift; Wilson %95)

| Konfigürasyon | ctrl | express | hono | event | FP (fixed) |
| --- | --- | --- | --- | --- | --- |
| CodeQL | 7/7 [0.65, 1.00] | 2/7 [0.08, 0.64] | 0/7 [0.00, 0.35] | 0/7 [0.00, 0.35] | 4/28 |
| Semgrep varsayılan | 3/7 | 3/7 | 0/7 | 0/7 | 0/28 |
| Semgrep özel (`rules/edge`) | 1/7 | 1/7 | 3/7 | 2/7 | 0/28 |
| Semgrep / Opengrep pattern | 3/7 | 3/7 | 3/7 | 3/7 | 0/28 |

### Eşleştirilmiş karşılaştırmalar (exact McNemar; b = yalnız ilk kol, c = yalnız ikinci)

| Konfigürasyon | H1 ctrl–express | H2b express–hono | H2a express–event (birincil) | hono–event (ikincil) |
| --- | --- | --- | --- | --- |
| CodeQL | b=5 c=0, p=0.062 | b=2 c=0, p=0.50 | b=2 c=0, p=0.50 | b=0 c=0 |
| Semgrep varsayılan | b=0 c=0 | b=3 c=0, p=0.25 | b=3 c=0, p=0.25 | b=0 c=0 |
| Semgrep özel | b=0 c=0 | b=0 c=2, p=0.50 | b=1 c=2, p=1.00 | b=1 c=0 |

Bu koşu ön koşudur; korpus örneklem hedefinin altındadır, hiçbir sonuç
anlamlı değildir ve makaleye sonuç olarak girmez.

### Gözlemler

- **Kalibrasyon tuttu (H0):** CodeQL `ctrl` kolunu 7/7 yakaladı; araç bu üç CWE'yi
  prensipte biliyor.
- **Sink modeli en güçlü sinyal (H1):** CodeQL D1 (`.prepare`) ve R2 (`.get`)
  sink'lerini hiç yakalamadı; Express kaynağıyla yalnızca global `fetch`
  (SSRF) sink'ini yakaladı. b=5, c=0, p=0.062.
- **Varsayılan araçlar Workers kaynağını hiç tanımıyor:** CodeQL ve varsayılan
  Semgrep kuralları `hono` ve `event` kollarının hiçbirini yakalamadı. Bu
  yüzden ikincil karşılaştırma (hono–event) bilgi taşımıyor ve birincil
  H2a farkı (express–event) çerçeve etkisinden (H2b) ayrılamıyor: varsayılan
  araçlarda gözlenen körlük, event'e özgü değil, Workers/Hono çerçevesinin
  modellenmemesi düzeyinde. Bu, makalenin çerçevesi için önemli bir bulgu
  adayı; event'e özgü etkiyi ayırmak için Hono'yu modelleyen kurallar (H3)
  gerekiyor.
- **Güç:** Exact McNemar'da p < 0.05 için en az 6 uyumsuz çift gerekir.
  Uyumsuzluk yalnızca SQL (Semgrep) ve SSRF (CodeQL) hücrelerinde çıktı;
  path traversal hücreleri varsayılan araçlarda bilgi taşımadı (yalnız `ctrl`).
  Genişletme önceliği: SQL ve SSRF hücrelerinde varyant sayısını artırmak
  (her biri ≥ 10 çift).
- **CodeQL FP:** SSRF fixed ikizlerindeki `ALLOWED_HOSTS.has(new URL(url).hostname)`
  allowlist'i sanitizer sayılmadı (`js/request-forgery`, 4/28). Precision
  için gerçek bir bulgu.
- **Özel kural (dev bulgusu, M4 için):** `$MESSAGE.body` kaynak deseni Express
  `req.body`'yi de eşledi (C004 ctrl/express TP); cron'un `fetch` ile çektiği
  feed kaynak olarak modellenmemiş (C004 event FN); kural yalnızca CWE-89'u
  kapsıyor.

## e1-02 — dev seti 10 çift (2026-10-02)

Run `36926793067`, profil `default+custom`. Dev: C001–C010. Held-out puanlanmadı.

| Konfigürasyon | ctrl | express | hono | event | FP (fixed) |
| --- | --- | --- | --- | --- | --- |
| CodeQL | 10/10 | 4/10 | 0/10 | 0/10 | 8/40 |
| Semgrep varsayılan | 4/10 | 4/10 | 0/10 | 0/10 | 0/40 |
| Semgrep özel (`rules/edge`) | 2/10 | 2/10 | 4/10 | 3/10 | 0/40 |
| Semgrep / Opengrep pattern | 4/10 | 4/10 | 4/10 | 4/10 | 0/40 |

| Konfigürasyon | H1 ctrl–express | H2b express–hono | H2a express–event | hono–event |
| --- | --- | --- | --- | --- |
| CodeQL | b=6 c=0, p=0.031 (Holm ×3 → 0.094) | b=4 c=0, p=0.125 | b=4 c=0, p=0.125 | b=0 c=0 |
| Semgrep varsayılan | b=0 c=0 | b=4 c=0, p=0.125 | b=4 c=0, p=0.125 | b=0 c=0 |
| Semgrep özel | b=0 c=0 | b=0 c=2, p=0.50 | b=1 c=2, p=1.00 | b=1 c=0 |

- Örüntü e1-01 ile aynı: kalibrasyon 10/10; CodeQL D1/R2 sink'lerini hiç
  yakalamıyor, yalnız SSRF'te Express kolunu buluyor; varsayılan araçlar
  hiçbir Hono veya event kolunu yakalamıyor.
- CodeQL FP: SSRF fixed ikizlerinin tamamında (ctrl ve express, 8/40)
  host allowlist'i sanitizer sayılmadı.
- Özel kural C008'de dört kolu da yakaladı (`$MESSAGE.body` hem
  `msg.body.object.key`'i hem Express `req.body`'yi eşliyor); M4'te
  ayrıştırılacak.
- Ön koşu; makaleye sonuç olarak girmez. Son RQ2 analizi dev + held-out
  (SQL 10, SSRF 10 çift) ile, kurallar dondurulduktan sonra yapılır.
