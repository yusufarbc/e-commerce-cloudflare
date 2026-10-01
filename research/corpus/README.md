# Deney Korpusu

Her çift (`pair_id`) aynı CWE ve aynı sink ile dört kolda yazılır; her kolun
açıklı (`vuln`) ve düzeltilmiş (`fixed`) ikizi vardır:

| Kol | Dosya öneki | Kaynak | Sink |
| --- | --- | --- | --- |
| `ctrl` | `ctrl_express_<lib>_` | Express | Aracın modellediği kütüphane |
| `express` | `http_express_` | Express | Platform (D1, R2, fetch…) |
| `hono` | `http_hono_` | Hono | Platform |
| `event` | `event_<queue\|cron\|r2\|webhook>_` | Event | Platform |

Kural gerekçesi ve hipotezler: `protocol/preregistration.md`. Şema kontrolü:
`python -m analysis.groundtruth` (dizin: `research`). Exploit oracle'ları:
`research/oracles` (`npm test`).

Bir bulgu, `ground_truth.csv` içindeki dosya ve sink satırının ±3 satırı içinde
raporlanır ve doğru CWE ailesiyle eşleşirse true positive kabul edilir.
Düzeltilmiş dosyalardaki eşleşmeler false positive olarak sayılır.

Bu kod deney içindir ve deploy edilmemelidir.

Vaka önekleri: `C…` enjekte (yazar), `X…` dış kaynaklı held-out (OWASP DVSA,
CloudBench, SecBench.js desenlerinden uyarlanmış; kaynak kodu kopyalanmadı,
kaynak ve lisans `notes` sütununda), `O…` organik held-out (demo uygulamanın
düzeltme öncesi hâli).
