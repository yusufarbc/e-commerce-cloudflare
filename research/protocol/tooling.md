# Araç Kapsamı

## Ölçüm hattına dahil

| Kategori | Araç | Deneydeki rol | Çıktı |
|---|---|---|---|
| SAST | CodeQL `security-extended` | E1–E2 ana araç | SARIF |
| SAST | Semgrep CE | E1–E3 ana araç | SARIF |
| SAST | Opengrep | Aynı kurallarla motor karşılaştırması | SARIF |
| SCA | OSV-Scanner | Repo bağımlılık başlangıç durumu | SARIF |
| SCA | `npm audit` | OSV/Trivy karşılaştırması | JSON |
| SCA/config/secret | Trivy | Repo vuln ve korpus secret/config taramaları | SARIF |
| Secret | Gitleaks | Ana secret tarayıcısı | SARIF |
| Config | Checkov | Varsayılan `wrangler` kapsaması testi | SARIF |
| Config | Conftest/OPA | E3 özel `wrangler.toml` politikaları | JSON |

Özel kurallar (`rules/edge/`) iki konfigürasyonla ölçülür: `semgrep-custom`
(Semgrep CE, fonksiyon içi) ve `opengrep-custom-intrafile` (Opengrep
`--taint-intrafile`). Semgrep ve Opengrep pattern motor karşılaştırması yalnızca
`rules/pinned/engine-parity.yml` ile yapılır. Platforma duyarlı E3 sonucu
`rules/edge/` ile ayrı raporlanır; böylece özel kural başarımı varsayılan araç
başarımıyla karışmaz.

## CI doğrulamasında kullanılacak

- `actionlint`: Workflow sözdizimi ve ifade hataları.
- `zizmor`: GitHub Actions güvenlik hataları.
- OpenSSF Scorecard: depo düzeyinde pratik öneri; deney metriği değildir.

## Ana deney dışında

- ESLint security eklentisi proje lint'ine yardımcıdır fakat taint analizi
  yapmadığı için ana E1–E3 karşılaştırmasına alınmaz.
- TruffleHog, Gitleaks için ikincil doğrulama aracıdır; ana tabloda yer almaz.
- OWASP ZAP yalnızca HTTP yüzeyini görebildiği için event-source deneyinin ana
  metriği değildir.
- Nuclei, Syft/CycloneDX ve Harden-Runner bu makalenin araştırma sorularını
  doğrudan ölçmediği için kapsam dışıdır.

## Karşılaştırma sınırları

SAST araçları yalnızca `corpus/` üzerinde değerlendirilir. SCA araçları
bağımlılık manifestlerine ihtiyaç duyduğu için tüm repoyu tarar ve korpus
recall hesabına katılmaz. Gitleaks, Checkov, Conftest ve Trivy'nin
secret/config taraması yalnızca korpusu tarar; korpus genişledikçe kendi
ground-truth sınıflarıyla puanlanır. Geçici scanner kural checkout'u SCA
adımlarından önce kaldırılır.
