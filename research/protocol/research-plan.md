# Araştırma ve Uygulama Planı

Son güncelleme: 2026-09-30

## Çalışma başlığı

*Same Sink, Different Source: Framework- and Event-Source Coverage of Default
SAST Gates on Cloudflare Workers*

**Ana mesaj (2026-10-02, yazar kararı):** Varsayılan SAST kapıları Cloudflare
Workers çerçevesini (Hono, Workers handler'ları) ve onun event kaynaklarını
(Queue, Cron, R2 bildirimleri, webhook) birlikte modellemiyor. Pilot ve ön
koşularda varsayılan araçlar hiçbir Hono veya event kolunu yakalamadı; bu
nedenle körlük event'e özgü değil, çerçeve ve kaynak modelinin birlikte
eksikliği olarak raporlanır. Event'e özgü katkı, Hono'yu tanıyan özel
kurallarla (H3) ayrıca incelenir.

- Ölçek: dergi (hedef Software: Practice and Experience; yedek Turk J Elec Eng
  & Comp Sci).
- Çerçeve: kaynak modeli kapsamı. Ana değişken kaynak türüdür. SAST (CodeQL,
  Semgrep CE, Opengrep) merkezdedir. Secret, SCA ve config kapıları yalnızca
  RQ1 ve RQ4 bağlamında kullanılır; RQ2'ye dahil edilmeleri kategori hatası
  olur.
- Yazar künyesi: birinci yazar Yusuf Talha Arabacı, Karabük Üniversitesi adresi
  (YL mezuniyet şartı).

## Araştırma soruları ve hipotezler

- **RQ1:** Varsayılan kapıların korpustaki precision, recall ve F1 değerleri
  nedir?
- **RQ2:** Aynı sink için tespit oranı kaynak türüne göre değişiyor mu?
  - **H2a (event-source blindness):** Event kolunda recall, modellenmiş HTTP
    (Express) koluna göre daha düşüktür.
  - **H2b (framework blindness):** Hono HTTP kolunda recall, Express koluna göre
    daha düşüktür.
  - Birincil metrik: çift düzeyinde tespit farkı (Hono − event). Ayrıntılar,
    kalibrasyon kolu (`ctrl`) ve sink modeli hipotezi (H1)
    `protocol/preregistration.md` içinde.
- **RQ3:** Platforma duyarlı özel kurallar, held-out sette recall'u precision'ı
  bozmadan artırıyor mu?
- **RQ4:** Kapıların CI süresine ek yükü nedir?

## Mevcut durum

- [x] Araştırma dizini, C001 HTTP/Queue–D1 SQLi ikizleri.
- [x] Araçlar deney workflow'una bağlandı; action'lar SHA ile, imajlar digest
  ile sabitlendi.
- [x] Her araç için exit code ve sürüm `tools.csv`'ye, süre milisaniye olarak
  `timings.csv`'ye yazılıyor.
- [x] `default` profili bir kez koştu (run 36448405979).
- [x] Organik vakalar `research/organic-snapshot-v1` etiketiyle donduruldu ve
  `corpus/organic/` altına O001–O005 olarak alındı; uygulamada düzeltildi.
- [x] Ürün pipeline'ı (`devsecops-pipeline.yml`) korpusu taramıyor.
- [x] Üç profil pilot-03'te koştu (`protocol/pilot-notes.md`).
- [x] C001 dört kola taşındı: `ctrl` (Express + better-sqlite3), `express`,
  `hono`, `event`.
- [x] Analiz iskeleti (`analysis/`: groundtruth, normalize, match, stats,
  score) ve 17 birim testi; `research-checks.yml` CI'da çalıştırıyor.
- [x] Preregistration v1.0 donduruldu (`protocol-v1`, 2026-10-02); H2a birincil
  karşılaştırması `express` – `event`. Danışman incelemesi sürüyor; öneriler
  sapma kaydına işlenecek.
- [x] Dört kollu C001 ile pilot-04 tamamlandı (`protocol/pilot-notes.md`).
- [ ] Held-out için ikinci yazar bulunmadı; yedek yol preregistration §5'te.
- [x] M1 dev seti: C001–C007 (7 hücre × 4 kol × vuln/fixed = 56 dosya);
  platform sink eşdeğerliği `analysis.groundtruth` ile zorunlu.
- [x] Exploit oracle'ları: `research/oracles`, 56 test (her vuln istismar
  edilebilir, her fixed dayanıklı); `research-checks.yml` CI'da çalıştırıyor.
- [x] Dizin yapısı sadeleştirildi: `research/serverless-sast-study/*` →
  `research/*` (yazarın düzeni).
- [x] Held-out dış kaynak (preregistration §5 yedek yolu), ilk 4 çift: X001
  (DVSA fiş anahtarı → D1), X002 (DVSA feedback + SecBench.js kodlanmış
  traversal → R2), X003 (CloudBench HTTP → kuyruk → consumer → fetch), X004
  (CloudBench/DVSA cron ile ikinci derece SQLi). Kod kopyalanmadı, desen
  uyarlandı; kaynak ve lisans `ground_truth.csv` notlarında. Oracle'lar: 88 test.
- [x] SQL/SSRF genişletmesi (e1-01'e göre güç önceliği): yeni hücreler dev
  (C008 SQL×R2, C009 SSRF×cron, C010 SSRF×R2), mevcut hücrelerin ek
  varyantları §5 gereği held-out (C011–C019, yazar tarafından yazıldı, ayrı
  raporlanır). Toplam SQL 10, SSRF 10 çift; oracle'lar 184 test.
- [ ] Korpusu 40–60 çifte genişletme (kalan: path traversal ve yeni event
  kaynakları; ikinci yazar bulunursa onun held-out vakaları).

## Aşamalar ve takvim

| Aşama | Hafta | Tarih |
| --- | --- | --- |
| M0 Protokol dondurma | 1 | 5–11 Eki 2026 |
| M1 Korpus | 1–4 | 5 Eki – 1 Kas |
| M2–M3 Pilot + analiz hattı | 4–6 | 26 Eki – 15 Kas |
| M4 E1/E2 + özel kurallar (E3) | 6–8 | 9–29 Kas |
| M5–M6 E4 + AWS genellenebilirlik | 8–10 | 23 Kas – 13 Ara |
| Literatür tamamlama | 1–10 | paralel |
| M7 Yazım + gönderim | 10–14 | 7 Ara – 10 Oca 2027 |

### M0 — Protokolü dondur

`protocol/preregistration.md` yazılır ve `protocol-v1` etiketiyle dondurulur
(isteğe bağlı OSF ön kaydı).

- **Kollar:** `http_express` (pozitif kontrol), `http_hono`, `event`
  (`queue`, `cron`, `r2`, `webhook`). Express kolunda da kaçırılan çift
  "bilgilendirici değil" olarak işaretlenir.
- **Puanlama:** doğru dosya, sink ±3 satır, doğru CWE ailesi = TP. Duyarlılık
  analizi ±0 ve ±5 ile yapılır. Temiz ikizdeki bulgu FP sayılır. Semgrep'te
  pattern ve taint kuralları ayrı raporlanır.
- **İstatistik:**
  - RQ1: Wilson güven aralığı; Cochran's Q, ardından Holm düzeltmeli ikili exact
    McNemar.
  - RQ2: araç × kol başına exact McNemar; eşleştirilmiş OR = b/c; Newcombe
    güven aralığı; GLMM `detected ~ arm*tool + complexity + (1|pair) + (1|cwe)`.
  - RQ3: held-out kümede default ile custom karşılaştırması exact McNemar ile;
    ΔFPR temiz ikizlerde.
  - RQ4: koşular bağımsız, bu yüzden Mann–Whitney U + Cliff's δ + medyan/IQR +
    BCa bootstrap.
  - Chi-square kullanılmaz.
- **Dev/held-out:** CWE × kaynak hücreleri vakalar yazılmadan önce yarı yarıya
  bölünür; held-out listesinin hash'i commit edilir.
- **Güç:** McNemar'da yalnızca uyumsuz çiftler bilgi taşır. Pilottan sonra çift
  sayısı sabitlenir; hedef 40–60 çift.
- **E4:** profil sırası rastgele (seed kaydedilir). Başarısız runner koşusu
  dışlanır ve yeniden koşulur; dışlanan koşu sayısı raporlanır.

**Tamamlanma ölçütü:** `protocol-v1` etiketi var.

### M1 — Korpus

- Yapı: `corpus/cases/Cxxx-<cwe>-<slug>/{ctrl_express_<lib>,http_express,http_hono,event_<type>}_{vuln,fixed}.js`.
  Her çiftte 8 dosya olur (C001 tamamlandı).
- Sink ve iş mantığı bayt düzeyinde aynıdır; ikizler yalnızca adapter
  satırında farklılaşır. Adım sayısı eşitlenemezse `complexity` kovaryatı olur.
- `ground_truth.csv` yeni sütunları: `arm`, `complexity`, `ts_types` (event
  kaynağı `source_type` sütununda). Şema kontrolü:
  `python -m analysis.groundtruth`.
- CWE × kaynak hedefi:

  | CWE | Sink | Event kaynakları |
  | --- | --- | --- |
  | 89 SQLi | `env.DB.prepare` | queue, cron, webhook |
  | 22/73 Path | R2 `get/put(key)` | r2, queue |
  | 918 SSRF | `fetch(url)` | queue, webhook |
  | ~~78/94 Code~~ | Kapsam dışı: Workers'ta `exec` yok, `eval`/`new Function` çalışma zamanında engelli (istismar edilemez) | — |
  | 79 XSS | HTML response | queue→KV→render, webhook |
  | 639/862 Authz | admin mutasyonu | webhook (imzasız) |
  | 347 İmza | webhook HMAC atlanması | webhook |

- Her hücrede 2–3 varyant ve 5–8 inter-procedural vaka olur (Semgrep CE ile
  Opengrep motor farkı için).
- Exploit oracle'ları `oracles/` altında Miniflare/vitest ile yazılır: her vuln
  dosyası istismar edilebilir, her fixed dosya dayanıklı olmalı.
- Held-out vakaların bir kısmını ikinci bir kişi yazar; Cohen's κ raporlanır.

**Tamamlanma ölçütü:** şema kontrolü ve oracle testleri geçiyor.

### M2–M3 — Pilot ve analiz hattı

- 3 profil × 1 koşu. Pilot kapısı: kararlı çıktı üretmeyen araç kapsamdan
  çıkarılır ve bu karar kayda geçer.
- `analysis/` yalnızca Python standart kütüphanesiyle: `groundtruth.py`,
  `normalize.py`, `match.py`, `stats.py`, `score.py` (yapıldı); kalanlar
  `make_tables.py`, `fetch.ps1`, Cochran's Q ve GLMM.
- `unittest` (yapıldı): doğru eşleşme, ±3 sınırı, fixed dosyada FP, yanlış CWE,
  yinelenen bulgu, SARIF ayrıştırma, McNemar/Wilson.

**Tamamlanma ölçütü:** temiz checkout ve indirilmiş artifact'lerle tüm tablolar
tek komutla üretiliyor.

### M4 — E1/E2 ve özel kurallar (E3)

- E1 ve E2 `default` profiliyle tek koşu (tespit deterministik).
- Özel kurallar yalnızca dev setinde geliştirilir: `rules/edge/`
  (Semgrep/Opengrep), `rules/codeql-models/` (CodeQL `sourceModel`, kaynaklar
  `wrangler.toml` bildirimlerinden türetilir), `rules/conftest/`.
- `rules-frozen-v1` etiketi atılır, **ardından** held-out koşusu yapılır.
  Held-out sonuçları ayrı artifact ve ayrı tablodadır.
- Kaçırma taksonomisi: kaynak modellenmemiş / sink modellenmemiş / dataflow
  kopuyor / kural yok.

### M5–M6 — E4 ve genellenebilirlik

- 3 profil × 30 koşu; `analysis/dispatch_e4.ps1` rastgele sırayla tetikler.
  Kurulum ve tarama süresi ayrı raporlanır.
- AWS kolu: pinned SHA ile OWASP DVSA (yalnızca SAST, E1–E2 çekirdeği) ve küçük
  bir Lambda TS ikiz seti. CodeQL AWS Lambda'yı modellediği için bu set
  "modellenmiş serverless" kontrolüdür.
- Opsiyonel: 2–3 açık kaynak Hono/Workers projesinde organik bulgular;
  gerekirse responsible disclosure.

### Literatür tamamlama (paralel)

- Tam metin: FaaSGuard, Semgrep*, Brito vd., CloudFlow, SymFlow; kapalı
  erişimliler (Austin 2012, Nunes 2018, Antunes & Vieira).
- Birincil kaynaktan doğrulanacaklar: `refs.bib` içinde bellekten yazılmış
  girdiler (SLSA, OWASP Serverless Top 10, DVSA, MITRE T1677), Checkov'un
  Wrangler desteği, CodeQL 2.26–2.27 sürüm notları (Hono/Workers desteği).
- IEEE Xplore, ACM DL, Scopus ve TR Dizin sorguları; gönderimden önce tekrar.

### M7 — Yazım ve gönderim

- `paper/` altında Wiley SPE LaTeX şablonu.
- Yazım sırası: Methodology → Results → Threats → Intro/Related Work →
  Discussion.
- Replication package: GitHub release + Zenodo DOI (kod MIT, veri CC-BY). Ham
  SARIF Git'e commit edilmez.
- Danışman okuması → arXiv (cs.SE/cs.CR) → SPE.

## Karar kapıları

- **Pilot kapısı:** kararlı çıktı üretmeyen araç ana deneyden önce çıkarılır.
- **Korpus kapısı:** eşleşmeyen ikizler ve Express kolunda da kaçırılan çiftler
  RQ2 istatistiğine alınmaz (ayrıca raporlanır).
- **Held-out kapısı:** `rules-frozen-v1` etiketinden önce held-out sonuçlarına
  bakılmaz.
- **Yayın kapısı:** ikinci bir kişi tabloları temiz ortamda yeniden üretemeden
  tablolar final kabul edilmez.

## Açık işler

- Held-out vakaları yazacak ikinci kişi.
- CodeQL default setup'ın kapatılması (ürün pipeline'ındaki CodeQL job'u ile
  çakışır), Cloudflare Pages otomatik Git deploy'unun kapatılması, GitHub
  `staging` environment'ı.
- Kapalı erişimli makalelerin PDF'leri; hedef derginin danışmanla
  netleştirilmesi; enstitüye kabul mektubunun yeterliliğinin sorulması.
