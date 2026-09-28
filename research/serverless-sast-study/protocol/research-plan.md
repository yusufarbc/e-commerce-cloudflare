# Araştırma ve Uygulama Planı

Son güncelleme: 2026-09-28

## Amaç

HTTP dışı serverless event kaynaklarının SAST araçlarında sistematik bir
tespit boşluğu oluşturup oluşturmadığını ölçmek; platforma duyarlı kuralların
bu boşluğu ne ölçüde kapattığını ve CI maliyetini belirlemek.

## Araştırma soruları

- **RQ1:** Varsayılan araçların serverless korpusundaki precision, recall ve
  F1 değerleri nedir?
- **RQ2:** Aynı sink için event kaynaklı vakaların yakalanma oranı HTTP
  kaynaklı ikizlerinden farklı mıdır?
- **RQ3:** Cloudflare/Workers bilgisi içeren özel kurallar held-out sette
  recall'u precision'ı bozmadan artırır mı?
- **RQ4:** Varsayılan ve özel güvenlik kontrollerinin CI çalışma süresine ek
  yükü nedir?

## Mevcut durum

- [x] Ayrı araştırma dizini ve veri yerleşimi oluşturuldu.
- [x] C001 HTTP/Queue–D1 SQL injection ikizleri eklendi.
- [x] CodeQL, Semgrep, Opengrep, OSV-Scanner, npm audit, Trivy, Gitleaks,
  Checkov ve Conftest workflow'a bağlandı.
- [x] Action ve araç sürümleri sabitlendi.
- [x] actionlint ve zizmor kontrolleri eklendi.
- [x] İlk özel D1 taint kuralı 2 TP / 0 FP ile yerel Opengrep üzerinde
  doğrulandı.
- [ ] Workflow GitHub runner üzerinde henüz çalıştırılmadı.
- [ ] Korpus istatistiksel analiz için yeterli büyüklükte değil.
- [ ] Held-out ve dış kaynaklı vakalar henüz tamamlanmadı.
- [ ] SARIF normalizasyonu ve istatistik betikleri henüz yazılmadı.

## Aşamalar

### M0 — Protokolü dondurma

- CWE kapsamını ve source türlerini kesinleştir.
- Birincil metriği RQ2 event-vs-HTTP recall farkı olarak kaydet.
- TP eşleştirme kuralını sabitle: doğru dosya, sink ±3 satır ve doğru CWE
  ailesi.
- Dev/held-out ayrımını vakalar yazılmadan önce kaydet.
- McNemar testi, etki büyüklüğü, güven aralığı ve çoklu test düzeltmesini
  önceden belirle.
- E4 için koşum sırasını rastgeleleştirme ve başarısız runner koşularını dışlama
  kuralını yaz.

**Tamamlanma ölçütü:** Protokol dosyaları değişmez bir Git etiketiyle
işaretlenmiş olmalı.

### M1 — Korpusu tamamlama

Planlanan asgari vaka aileleri:

| Pair | CWE | HTTP ikizi | Event kaynağı | Önerilen split |
|---|---|---|---|---|
| C001 | CWE-89 | Query parametresi | Queue body | Dev, tamamlandı |
| C002 | CWE-22 | Route/path parametresi | R2 object key | Held-out |
| C003 | CWE-918 | Request URL alanı | Queue içindeki URL | Dev |
| C004 | CWE-347/862 | HTTP ödeme isteği | Webhook | Held-out |
| C005 | CWE-89/78 | HTTP girdisi | Cron'un çektiği veri | Held-out |
| C006 | CWE-16/798 | API config | `wrangler.toml` | Dev + held-out |

Her pair için HTTP-vuln, HTTP-fixed, event-vuln ve event-fixed olmak üzere dört
dosya bulunmalı. Anlamlı McNemar analizi için yalnızca altı pair ile
yetinilmemeli; pilot bulgudan sonra güç analizi yapılarak her source/CWE
katmanında yeterli sayıya çıkılmalı.

- Organik `O001`–`O003` vakalarını yeni ground truth'a kontrollü biçimde aktar.
- Held-out vakaların en az bir bölümünü kural yazarından farklı biri hazırlasın.
- Fixed örneklerin davranışsal eşdeğerliğini test et.
- Korpusun hiçbir parçasını deploy workflow'una dahil etme.

**Tamamlanma ölçütü:** Tüm kayıtlar schema kontrolünden geçmeli; dosya, satır,
CWE, source, split ve origin alanlarında eksik olmamalı.

### M2 — Pilot araç koşusu

- Değişiklikleri ayrı bir araştırma dalında commit/push et.
- `baseline`, `default` ve `default+custom` profillerini birer kez çalıştır.
- Her aracın gerçekten rapor ürettiğini ve SARIF'in parse edilebildiğini kontrol
  et.
- CodeQL path filtresi, OSV v2 komutu, Checkov SARIF çıktısı ve Conftest TOML
  ayrıştırmasını runner üzerinde doğrula.
- Docker imajlarını final deneyden önce tag yerine digest ile sabitle.
- Başarısız araç çağrılarını bulgudan ayırmak için her rapora exit code ve araç
  sürümü ekle.

**Tamamlanma ölçütü:** Her beklenen araç için boş olsa bile geçerli bir çıktı,
log ve süre kaydı bulunmalı.

### M3 — Analiz hattı

- SARIF ve JSON raporlarını ortak bir finding tablosuna dönüştür.
- Yol, satır ve CWE adlarını normalize et; araç-kural–CWE eşleme tablosu oluştur.
- `ground_truth.csv` ile deterministik eşleştirme yap.
- TP, FP, FN, precision, recall ve F1 üret.
- HTTP/event ikizlerinden McNemar tablosu ve odds ratio üret.
- Sonuç tablolarını ve şekilleri ham raporlardan tek komutla yeniden üret.
- Unit testlerde en az: doğru eşleşme, ±3 sınırı, fixed dosyada FP, yanlış CWE
  ve yinelenen bulgu vakalarını kapsa.

**Tamamlanma ölçütü:** Temiz checkout ve indirilmiş artifact'lerle tüm tablolar
tek komutla yeniden üretilebilmeli.

### M4 — Özel kurallar ve held-out değerlendirmesi

- Özel Semgrep ve Rego kurallarını yalnızca dev sette geliştir.
- Held-out sonuçlarını kurallar dondurulana kadar açma.
- Varsayılan ve varsayılan+özel sonuçları aynı vakalarda karşılaştır.
- Recall artışı yanında yeni false positive'leri ve kural çalışma süresini
  raporla.

**Tamamlanma ölçütü:** Held-out sonuçları ayrı artifact ve ayrı tablo olarak
üretilmeli; dev sonuçlarıyla karışmamalı.

### M5 — E4 performans deneyi

- Üç profili 30'ar kez çalıştır.
- Koşum sırasını gün ve saat etkisini azaltacak şekilde rastgeleleştir.
- Runner image, commit ve araç sürümü aynı kalmalı.
- Medyan, IQR, yüzde overhead ve Cliff's delta raporla.
- Kurulum süresi ile gerçek tarama süresini mümkünse ayrı ölç.

**Tamamlanma ölçütü:** Her profil için 30 geçerli koşum veya önceden belirlenen
yeniden-koşma kuralıyla belgelenmiş eşdeğer örneklem bulunmalı.

### M6 — Genellenebilirlik

- E1 ve E2'nin çekirdek kısmını AWS Lambda/DVSA üzerinde tekrarla.
- Cloudflare'e özgü kural sonuçlarını serverless-genel sonuçlardan ayır.
- Platformlar arası birebir eşlenemeyen source/sink türlerini açıkça işaretle.

**Tamamlanma ölçütü:** En az bir Cloudflare dışı korpus için aynı normalize
metrik tablosu üretilmeli.

### M7 — Makale ve artifact paketi

- Yöntem, etik, geçerlilik tehditleri ve responsible disclosure metinlerini
  yaz.
- Araç lisanslarını ve korpus dağıtım izinlerini kontrol et.
- Ham çıktıları Git'e commit etme; release artifact veya arşiv kullan.
- README'ye yeniden üretim komutları, beklenen süre ve donanım/runner bilgisini
  ekle.
- Anonim değerlendirme gerekiyorsa repo ve artifact içindeki kimlik bilgilerini
  temizle.

**Tamamlanma ölçütü:** Makaledeki her tablo/şekil bir artifact dosyasına ve
üretim komutuna izlenebilir olmalı.

## Hemen yapılacaklar

1. Araştırma branch'i aç, mevcut iskeleti commit et ve workflow'ları push et.
2. Üç profille tek koşumluk M2 pilotunu tamamla.
3. Pilot hatalarını gider; container digest ve çıktı şemalarını dondur.
4. C002–C006'yı yazmadan önce split ve örnek büyüklüğü kararını kaydet.
5. Korpusu genişletirken paralel olarak SARIF normalizasyon betiğini geliştir.

## Karar kapıları

- **Pilot kapısı:** Araçlardan biri kararlı çıktı üretemiyorsa kapsamdan çıkarma
  kararı ana deneyden önce verilir.
- **Korpus kapısı:** Eşleşmeyen HTTP/event ikizleri istatistiğe alınmaz.
- **Held-out kapısı:** Özel kurallar dondurulmadan held-out sonuçlarına bakılmaz.
- **Yayın kapısı:** Sonuçlar ikinci bir kişi tarafından temiz ortamda yeniden
  üretilemeden makale tabloları final kabul edilmez.
