# Ara Sonuçlar

## rq3-01 (2026-10-02)

- Run `36928954718`, commit `1d78d2f` (= `rules-frozen-v1`), profil `default+custom`.
- Korpus: 23 enjekte/dış kaynaklı çift (dev 10, held-out 13) + 5 organik vaka.
- Held-out seti ilk kez bu koşuda puanlandı (`analysis.score --heldout`),
  kurallar `rules-frozen-v1` ile dondurulduktan sonra.
- **Ara sonuç:** korpus hedefin (40–60 çift) altında; held-out'un 9 çifti
  (C011–C019) yazar tarafından yazıldı ve ayrıca raporlanacak.

### RQ2 — tüm çiftler (n = 23), exact McNemar, araç içi Holm (×3)

| Araç | H1 ctrl–express | H2b express–hono | H2a express–event (birincil) | hono–event (ikincil) |
| --- | --- | --- | --- | --- |
| CodeQL | b=13 c=0, p=0.0002, Holm 0.0007; fark +0.57 [0.32, 0.74] | b=10 c=0, p=0.0020, Holm 0.0039; +0.43 [0.21, 0.63] | b=10 c=0, p=0.0020, Holm 0.0039; +0.43 [0.21, 0.63] | b=0 c=0 |
| Semgrep varsayılan | b=0 c=0 | b=10 c=0, p=0.0020, Holm 0.0059 | b=10 c=0, p=0.0020, Holm 0.0059 | b=0 c=0 |

Kol bazında recall (n = 23): CodeQL ctrl 23, express 10, hono 0, event 0;
Semgrep varsayılan ctrl 10, express 10, hono 0, event 0.

Yorum: varsayılan araçlar Workers çerçevesini ve event kaynaklarını birlikte
modellemiyor (hono ve event kollarında 0/23). CodeQL ayrıca D1 ve R2
sink'lerini modellemiyor (H1). Hono–event farkı varsayılan araçlarda
ölçülemiyor (iki kol da 0), bu yüzden event'e özgü etki RQ3'te özel
kurallarla incelenir.

### RQ3 — held-out (13 çift; 52 vuln vaka, 52 fixed ikiz)

| Konfigürasyon | ctrl | express | hono | event | FP (fixed) |
| --- | --- | --- | --- | --- | --- |
| CodeQL | 13/13 | 6/13 | 0/13 | 0/13 | 12/52 |
| Semgrep varsayılan | 6/13 | 6/13 | 0/13 | 0/13 | 0/52 |
| Semgrep özel (CE, fonksiyon içi) | 0/13 | 0/13 | 6/13 | 5/13 | 0/52 |
| Opengrep özel (`--taint-intrafile`) | 0/13 | 0/13 | 13/13 | 12/13 | 0/52 |

Önceden kayıtlı test (held-out vuln vakaları, tüm kollar, exact McNemar):

| Karşılaştırma | yalnız varsayılan | yalnız özel | p | recall | FPR |
| --- | --- | --- | --- | --- | --- |
| Semgrep varsayılan → Semgrep özel | 12 | 11 | 1.00 | 12/52 → 11/52 | 0/52 → 0/52 |
| Semgrep varsayılan → Opengrep özel | 12 | 25 | 0.047 | 12/52 → 25/52 | 0/52 → 0/52 |
| CodeQL → Opengrep özel | 19 | 25 | 0.45 | 19/52 → 25/52 | 12/52 → 0/52 |

Keşifsel (önceden kayıtlı değil): yalnız platform kolları (hono + event,
26 vaka) — varsayılan araçlar 0/26, Opengrep özel 25/26, Semgrep CE özel 11/26.

- Özel kural paketi dev'de görülmeyen taşıma desenlerine genelleşti; tek
  kaçırma X004/event (cron'un veritabanından okuduğu kayıtlı veri — bu kaynak
  modellenmedi; ikinci derece akış).
- Semgrep CE ile Opengrep arasındaki fark motordan gelir: SSRF/path
  vakalarında sink yardımcı fonksiyondadır.
- Tüm kollar birlikte alındığında Semgrep varsayılan ve özel kurallar
  birbirini tamamlar (varsayılan Express kollarını, özel Workers kollarını
  yakalar); pratik öneri ikisini birlikte çalıştırmaktır.
- Dış kaynaklı alt küme (X001–X004): Opengrep özel hono 4/4, event 3/4.

### Organik vakalar (O001–O005)

CodeQL, Semgrep (varsayılan ve özel), Opengrep, Gitleaks, Trivy ve Checkov
beş organik açığın hiçbirini yakalamadı. Conftest özel politikası
(`rules/conftest/wrangler.rego`) O001'i (düz metin `ADMIN_JWT_SECRET`) ve
ayrıca `GOOGLE_MERCHANT_TOKEN = "test-token"` yer tutucusunu raporladı
(Conftest çıktısı SARIF değil; elle değerlendirildi). Demo uygulamanın
gerçek açıklarını varsayılan kapıların geçirmesi, giriş bölümündeki
motivasyon örneğini destekler.
