# Workflow Güvenlik Başlangıç Durumu

Kontrol tarihi: 2026-09-28

Araçlar: actionlint 1.7.12, zizmor 1.30.1

Araçlar `gh release download` ile geçici dizine indirilmiş ve GitHub release
SHA-256 değerleriyle doğrulanmıştır.

İlk zizmor çalıştırması 17 görünür bulgu raporladı: 12 high, 4 medium ve 1
low. Bulguların ana kümeleri şunlardı:

- `backup.yml` ve `deploy.yml` içinde commit SHA yerine major tag ile kullanılan
  action referansları.
- Checkout adımlarında `persist-credentials: false` kullanılmaması.
- `backup.yml` içinde sürümü sabitlenmemiş global Wrangler kurulumu.
- İlk oluşturulan `security-research.yml` sürümünde `repetition` girdisinin
  doğrudan shell scriptine genişletilmesi.

Son madde aynı çalışma sırasında düzeltildi: workflow girdileri önce job
environment değişkenlerine aktarılıyor ve shell yalnızca bu değişkenleri
okuyor. Eski deploy/backup workflow bulguları makale hattının kurulmasından
ayrı bir hardening işi olarak tutulmuştur.

Düzeltme sonrasında actionlint çıkış kodu `0` oldu ve yeni araştırma
workflow'larında zizmor bulgusu kalmadı. Repo genelinde kalan görünür bulgular
11 high, 4 medium ve 1 low olmak üzere 16 adettir; tamamı mevcut
`backup.yml`/`deploy.yml` dosyalarındadır.
