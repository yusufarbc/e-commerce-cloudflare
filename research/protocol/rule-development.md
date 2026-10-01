# Özel Kural Geliştirme (M4)

Kurallar: `research/rules/edge/` — `cloudflare-d1-sqli.yml` (CWE-89),
`cloudflare-r2-path.yml` (CWE-22), `cloudflare-ssrf.yml` (CWE-918).
Geliştirme yalnızca dev setinde yapıldı (`python -m analysis.dev_scan`, yalnız
`split=dev` dosyalarını tarar). Held-out dosyalar `rules-frozen-v1` öncesinde
taranmadı.

## Kapsam

- **Kaynaklar:** Hono istek verisi (`c.req.query/param/json/text/header`;
  webhook'lar da Hono route'u); Queue ve R2 bildirimleri için yalnızca
  `for (const msg of batch.messages)` döngüsündeki `msg.body`; cron için dış
  feed'den gelen `(await fetch(...)).json()`.
- **Sink'ler:** D1 `.prepare(query)`; R2 `bucket.get/put/delete/head(key)`
  (nesne adı bucket/r2/storage/assets/images içermeli); global `fetch(url)`.
- **Sanitizer'lar:** `if (!target.startsWith(prefix)) return …` (R2),
  `if (!ALLOWED.has(new URL(u).hostname)) return …` (fetch).
- **Bilerek dışarıda:** Express kaynakları (varsayılan kuralların alanı;
  bu paket Workers'a özgü kaynakları hedefler).

## Pilotlarda görülen sorunlar ve düzeltmeler

| Sorun (dev) | Düzeltme |
| --- | --- |
| `$MESSAGE.body` Express `req.body`'yi de eşliyordu | Kaynak `batch.messages` döngüsüyle sınırlandı |
| Cron feed'i kaynak değildi | `(await fetch(...)).json()` kaynak oldu |
| Yalnızca CWE-89 vardı | CWE-22 ve CWE-918 kuralları eklendi |
| Feed isteğinin kendisi SSRF sink'i sayıldı (C009 fixed FP) | Sink, kaynak ifadesinin içini hariç tutar |

## Dev sonuçları (10 çift, Opengrep 1.30.0)

| Motor modu | ctrl | express | hono | event | FP (fixed) |
| --- | --- | --- | --- | --- | --- |
| `--taint-intrafile` (fonksiyonlar arası, dosya içi) | 0/10 | 0/10 | 10/10 | 10/10 | 0/40 |
| Fonksiyon içi (Semgrep CE ile aynı motor sınırı) | 0/10 | 0/10 | 4/10 | 4/10 | 0/40 |

Fark yalnızca motordan gelir: SSRF ve path traversal vakalarında sink bir
yardımcı fonksiyonun içindedir ve fonksiyon içi taint analizi çağrı sınırını
geçemez. Deney workflow'u bu yüzden iki konfigürasyonu ayrı raporlar:
`semgrep-custom` (Semgrep CE) ve `opengrep-custom-intrafile`.

## CodeQL modelleri

CodeQL models-as-data, kaynak ve sink'i bir paket API'si üzerinden tanımlar.
D1/R2 binding'leri (`env.DB`, `env.IMAGES_BUCKET`) ve modül biçimindeki
`queue`/`scheduled` handler'ları bir paket import'u değildir; bu yüzden bu
çalışmada CodeQL için özel model yazılmadı. QL ile özel sorgu yazmak gelecek
çalışma olarak bırakıldı (geçerlilik tehditlerinde belirtilir).
