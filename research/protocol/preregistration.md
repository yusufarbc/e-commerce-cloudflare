# Ön Kayıt (Preregistration)

Durum: **v1.0, donduruldu** — 2026-10-02, `protocol-v1` etiketi. Yazar kararıyla
donduruldu; danışman incelemesi sürüyor. Bundan sonraki her değişiklik (danışman
önerileri dahil) §10'daki sapma kaydına tarih ve gerekçeyle yazılır.

## 1. Amaç ve kapsam

Varsayılan SAST kapılarının (CodeQL, Semgrep CE, Opengrep) serverless edge
uygulamalarında güvenilmeyen girdiyi **kaynak türüne göre** ne ölçüde
tanıdığını ölçmek. Sink ve iş mantığı sabit tutulur, yalnızca kaynak değişir.

Kapsam: JavaScript, tek dosyalık (ve az sayıda dosyalar arası) vakalar,
Cloudflare Workers + Hono, D1, R2, Queues, Cron, webhook. Gitleaks, Trivy,
Checkov, OSV-Scanner ve npm audit taint analizi yapmaz. Bu araçlar RQ2'ye
alınmaz, yalnızca RQ1 (genel durum) ve RQ4 (süre) için raporlanır.

## 2. Hipotezler

| Kod | Hipotez | Karşılaştırma |
| --- | --- | --- |
| H0 (kalibrasyon) | Araç, modellenmiş kaynak ve modellenmiş sink içeren kolu yakalar | `ctrl` kolunda recall > 0 |
| H1 (sink modeli) | D1 sink'i, modellenmiş SQL sink'ine göre daha az yakalanır | `ctrl` – `express` |
| H2b (çerçeve körlüğü) | Hono kaynağı, Express kaynağına göre daha az yakalanır | `express` – `hono` |
| H2a (event-source körlüğü) | Event kaynağı, modellenmiş HTTP kaynağına göre daha az yakalanır | `express` – `event` (birincil), `hono` – `event` (ikincil) |
| H3 (özel kurallar) | Platforma duyarlı kurallar held-out sette recall'u artırır, FPR'yi anlamlı artırmaz | default ile custom, held-out |

**Birincil sonuç:** H2a, `express` – `event` çift düzeyinde tespit farkı; her araç
ayrı test edilir. İki kol aynı platform sink'ini kullanır, yalnızca kaynak (ve
onu taşıyan çerçeve) değişir. Varsayılan araçların modellediği HTTP kaynağı
Express olduğu için bu karşılaştırma varsayılan araçlarda bilgi taşır; pilot-04'te
`hono` kolu da kaçırıldığında `hono` – `event` çifti bilgi taşımadı.

**İkincil sonuç:** `hono` – `event`, kaynak etkisini Workers çerçevesi içinde
yalıtır; özellikle Hono'yu modelleyen özel kurallarda (H3) yorumlanır.

Karşılaştırmalar araç sonuçları görülmeden bu şekilde sabitlenir; referans kol
araca göre değiştirilmez.

## 3. Kollar (arms)

Her enjekte edilmiş çift (`pair_id`) dört kolu ve her kolun `vuln` ile `fixed`
ikizini içerir. Bu kural `analysis/groundtruth.py` içinde zorunlu tutulur.

| Kol | Kaynak | Sink | Rolü |
| --- | --- | --- | --- |
| `ctrl` | Express `req.query/body` | Aracın modellediği eşdeğer kütüphane (ör. `better-sqlite3 .prepare`) | Kalibrasyon: araç bu CWE'yi prensipte yakalıyor mu? |
| `express` | Express | Platform sink'i (ör. D1 `.prepare`) | Sink modelini yalıtır |
| `hono` | Hono `c.req.*` | Platform sink'i | Çerçeve etkisini yalıtır |
| `event` | `queue` / `cron` / `r2` / `webhook` | Platform sink'i | Kaynak türü etkisi |

Eşdeğerlik kuralları:
- Sink satırı, platform kolları arasında bayt düzeyinde aynıdır.
- Kaynaktan sink'e kadar olan adımlar (destructure, `await`, döngü) mümkün
  olduğunca eşitlenir; eşitlenemeyen fark `complexity` ve `notes` alanlarında
  kodlanır.
- `ctrl` kolunda yalnızca sink kütüphanesi değişir; metot adı ve sorgu aynıdır.

**Bilgilendirici olmayan çift:** Bir araç `ctrl` kolunu kaçırıyorsa, o araç ve
CWE için H1, H2a ve H2b hesaplanmaz; ayrı tabloda raporlanır.

## 4. Puanlama

- **sink_line:** `// SINK` işaretli satır, yani tehlikeli çağrının bulunduğu
  satır. Pilot-03'te araçlar çok satırlı ifadenin başlangıç satırını raporladı
  (sink_line − 1); bu durum tolerans içinde kalır.
- **TP:** Aynı dosyada, `|line − sink_line| ≤ 3` ve aynı CWE ailesinde bulgu.
- **FN:** Vuln dosyada böyle bir bulgu yok.
- **FP:** Fixed dosyada aynı CWE ailesinde bulgu, ya da hiç CWE taşımayan bir
  bulgu.
- **TN:** Fixed dosyada böyle bir bulgu yok.
- Bir vaka için birden fazla eşleşen bulgu tek TP sayılır.
- CWE aileleri `analysis/match.py` içindeki `CWE_FAMILIES` listesiyle
  sabitlenir. Kural→CWE eşlemesi araç meta verisinden okunur; meta verisi
  olmayan araçlar için `analysis/cwe_map.csv` kullanılır.
- **Duyarlılık analizi:** tolerans 0 ve 5 ile tekrarlanır.
- Semgrep/Opengrep'te pattern (sözdizimsel) ve taint kuralları ayrı
  konfigürasyon olarak raporlanır.
- Okunamayan bir rapor "bulgu yok" sayılmaz; araç hatası olarak kaydedilir ve
  puanlanmaz.

## 5. Bölme (dev / held-out)

- Organik vakalar (O001–O005) held-out'tur.
- Enjekte vakalarda her (CWE × event kaynağı) hücresinin ilk varyantı dev'e,
  kalan varyantları held-out'a gider. Böylece held-out, kural yazarının görmediği
  taşıma desenlerini içerir.
- Held-out vakaların en az üçte biri, kuralları yazmayan ikinci bir kişi
  tarafından yazılır (hedef). İkinci kişi M1 bitişine kadar bulunamazsa:
  held-out = organik vakalar + dış kaynaklı vakalar (`origin=external`;
  SecBench.js, CloudBench gibi yayımlanmış benchmark'lardan Workers'a
  uyarlanmış, kaynak ve lisansı `notes` alanında belirtilmiş). Yazarın
  kendisinin yazdığı held-out vakalar ayrı raporlanır ve bu durum geçerlilik
  tehditlerinde açıkça belirtilir.
- Kural yazarı (yazar) held-out vaka dosyalarını `rules-frozen-v1` etiketinden
  önce açmaz; dosyalar eklendikçe yalnızca özetleri kaydedilir.
- Held-out vakalar yazıldıkça dosya listesinin SHA-256 özeti
  `protocol/heldout.sha256` dosyasına commit edilir.
- `analysis.score` held-out satırlarını yalnızca `--heldout` bayrağıyla puanlar.
  Bu bayrak `rules-frozen-v1` etiketinden önce kullanılmaz.

## 6. Örneklem büyüklüğü

- Hedef 40–60 enjekte çift, yani çift başına 8 dosya.
- Exact McNemar yalnızca uyumsuz çiftlerden güç alır. Pilotta uyumsuzluk oranı
  ölçülür; %80 güç için gereken uyumsuz çift sayısı hesaplanıp buraya yazılır.
  Uyumsuz çift sayısı 6'nın altındaysa hiçbir p < 0,05 mümkün değildir; bu durum
  raporda belirtilir ve yalnızca etki büyüklüğü ile güven aralığı yorumlanır.

## 7. İstatistiksel analiz

- **RQ1:** Araç × kol bazında recall, precision, F1, FPR; Wilson %95 güven
  aralığı. Araçlar arası fark için Cochran's Q, ardından Holm düzeltmeli ikili
  exact McNemar.
- **RQ2:** Araç başına kol çiftleri için exact McNemar (iki yönlü),
  eşleştirilmiş OR = b/c, Newcombe (yöntem 10) %95 güven aralıklı oran farkı.
  Aynı araç içindeki üç karşılaştırmaya (H1, H2b, H2a) Holm düzeltmesi
  uygulanır. Destekleyici model: lojistik GLMM
  `detected ~ arm * tool + complexity + (1|pair_id) + (1|cwe)`. Model yakınsamazsa
  yalnızca McNemar raporlanır.
- **RQ3:** Held-out sette default ve custom kurallar için exact McNemar; fixed
  ikizlerde ΔFPR.
- **RQ4:** Koşular bağımsız: Mann–Whitney U, Cliff's δ, medyan ve IQR, BCa
  bootstrap %95 güven aralığı (10 000 örnek). Overhead% medyanlar üzerinden.
- Chi-square kullanılmaz. Tüm testlerde α = 0,05.

## 8. E4 (performans) protokolü

- Üç profil (`baseline`, `default`, `default+custom`) × 30 koşu.
- Sıra, seed'i kaydedilen rastgele permütasyonla belirlenir.
- Aynı commit ve aynı araç sürümleri kullanılır. Runner image sürümü
  `run.json`'a yazılır ve kovaryat olarak raporlanır. Pilot-03'te image iki
  koşu arasında değişti.
- Başarısız koşu (runner hatası, ağ hatası) dışlanır ve aynı sıra noktasında
  yeniden koşulur. Dışlanan koşu sayısı raporlanır. Bir aracın bulgu nedeniyle
  sıfırdan farklı exit kodu başarısızlık sayılmaz.

## 9. Araçlar ve sürümler

`protocol/tool-versions.yml` dosyasında sabitlenmiştir. Final koşudan önce bu
dosyanın commit SHA'sı buraya yazılır.

## 10. Sapma kaydı

| Tarih | Değişiklik | Gerekçe |
| --- | --- | --- |
| 2026-10-01 (dondurma öncesi) | `ctrl` kalibrasyon kolu eklendi | Pilot-03'te CodeQL ve varsayılan Semgrep Hono ikizini de kaçırdı; D1 sink'i modellenmemiş olabileceğinden Express+D1 kolu tek başına pozitif kontrol olamaz |
| 2026-10-01 (dondurma öncesi) | C001 queue ikizi HTTP ikizleriyle aynı `SELECT` sink'ine eşitlendi | Önceki `UPDATE` iki değişkenli sink eşdeğerlik kuralını ihlal ediyordu (dev seti) |
| 2026-10-02 (dondurma öncesi) | H2a birincil karşılaştırması `express` – `event` oldu; `hono` – `event` ikincil | Pilot-04'te `hono` ve `event` kollarını varsayılan araçlar birlikte kaçırdı. Değerlendirilen seçenekler: (a) `express` – `event` (aynı sink, varsayılan araçlarda bilgilendirici), (b) `hono` – `event`'i yalnızca özel kurallarda test etmek (birincil testi varsayılan araçlardan çıkarır), (c) araç başına yakalanan en yakın HTTP kolunu referans almak (sonuca bağlı seçim, çoklu yol riski). (a) seçildi. |
| 2026-10-02 (dondurma öncesi) | İkinci kişi bulunamazsa held-out için yedek yol tanımlandı | Bağımsız held-out yazarı henüz yok; dış kaynaklı vakalar ve şeffaf raporlama ile döngüsellik riski sınırlandırılır |
| 2026-10-02 (dondurma sonrası, yorum) | Ana mesaj: "Workers çerçevesi ve event kaynakları birlikte modellenmemiş"; başlık buna göre güncellendi | Hipotezler, karşılaştırmalar ve testler değişmedi. Birincil H2a (`express` – `event`) aynı sink'te hem çerçeve hem kaynak farkını ölçtüğü için bu çerçevenin doğrudan testidir; H2b (çerçeve) ve ikincil `hono` – `event` (event'e özgü) ayrıştırma için raporlanır. Karar, ön koşularda varsayılan araçların `hono` ve `event` kollarının hiçbirini yakalamamasına dayanır. |
