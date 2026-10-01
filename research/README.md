# Serverless Event Kaynaklarında SAST Kör Noktaları

Bu dizin, serverless uygulamalarda HTTP dışı olay kaynaklarının statik analiz
araçları tarafından ne ölçüde tanındığını inceleyen makale çalışmasını ana
uygulama kodundan ayırmak için oluşturulmuştur.

## Araştırma odağı

Temel soru: CodeQL, Semgrep ve benzeri güvenlik araçları; HTTP isteği, Queue,
R2, cron ve webhook kaynaklarından gelen güvenilmeyen verinin aynı tehlikeli
hedefe ulaştığı ikiz vakalarda benzer tespit başarımı gösteriyor mu?

Planlanan deneyler:

1. Varsayılan araçların precision, recall ve F1 ölçümü.
2. HTTP ve event kaynaklı ikiz vakaların eşleştirilmiş karşılaştırması.
3. Platforma duyarlı özel kuralların held-out sette değerlendirilmesi.
4. Güvenlik kontrollerinin CI çalışma süresine ek yükünün ölçülmesi.

## Dizin düzeni

- `corpus/`: Dört kollu ikiz vakalar (`cases/`), organik held-out vakalar
  (`organic/`) ve `ground_truth.csv`.
- `oracles/`: Çalıştırılabilir exploit oracle'ları (vitest): her açıklı vaka
  istismar edilebilir, her düzeltilmiş ikiz aynı girdiye dayanır.
- `rules/`: Özel Semgrep ve Rego kuralları.
- `protocol/`: Ön kayıt (`preregistration.md`, `protocol-v1`), araştırma planı,
  pilot notları, sürüm sabitlemeleri.
- `analysis/`: Ground truth doğrulama, SARIF normalizasyonu, puanlama ve
  istatistik (yalnızca Python standart kütüphanesi).
- `results/`: Üretilen tablolar, şekiller ve özet sonuçlar.
- `paper/`: Makale metni.
- `literature/`: Literatür taraması, okuma listesi ve kaynakça.

## İlkeler

- Geliştirme ve held-out kümeleri birbirinden ayrılır.
- Araçlar ve GitHub Actions bağımlılıkları kesin sürümlere sabitlenir.
- Ham tarama çıktıları ile türetilmiş sonuçlar ayrılır.
- Gerçek secret değerleri korpusa veya sonuçlara alınmaz.
- Her bulgu, ground truth kaydı ve yeniden üretim komutuyla ilişkilendirilir.

İlk C001 ikiz vakası `files/` taslağından korpusa kopyalanmıştır. Taslaklar
(`files/`, kökteki `security-experiment.yml`) içerik doğrulamasından sonra
kaldırıldı.

`corpus/organic/` altındaki snapshot, demo uygulamanın eski düz metin JWT
sırrını içerir. Bu değer artık uygulamada kullanılmıyor ve geçersiz kabul
edilir; gerçek bir secret değildir.

## Çalıştırma

Yerel kontroller (`research/` dizininde):

```powershell
python -m analysis.groundtruth                       # şema + sink eşdeğerliği
python -m unittest discover -s analysis/tests -t .   # analiz testleri
cd oracles; npm ci; npm test                         # exploit oracle'ları
python -m analysis.score --artifact <indirilen-artifact>   # puanlama (dev set)
```

Deney GitHub Actions üzerinden elle başlatılır:

```powershell
gh workflow run security-research.yml -f profile=default -f repetition=01
gh run watch
```

E3 için `profile=default+custom`, yalnızca E4 baseline ölçümü için
`profile=baseline` kullanılır. Final E4 ölçümünde her profil ayrı run olarak
30 kez çalıştırılmalı; `repetition` alanı `01`–`30` aralığında tutulmalıdır.

Araç kapsamı `protocol/tooling.md`, sabitlenen sürümler ise
`protocol/tool-versions.yml` içinde kayıtlıdır.

Araştırmanın aşamaları, eksikleri ve tamamlanma ölçütleri
`protocol/research-plan.md` dosyasında takip edilir.
