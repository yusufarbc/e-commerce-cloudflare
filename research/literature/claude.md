# Varsayılan DevSecOps Kapıları Serverless Edge'i Görüyor mu? Olay Kaynaklı Güvenlik Açıkları İçin Sistematik Literatür Taraması ve Boşluk Analizi

Taranan veri tabanlarında ve atıf ağında şu soruyu doğrudan ölçen hakemli bir çalışma tespit edilmedi: Aynı serverless güvenlik açığı, kirli (tainted) girdisi HTTP isteğinden ve HTTP dışı bir olay kaynağından (kuyruk, zamanlanmış tetikleyici, nesne depolama olayı, webhook) geldiğinde SAST araçlarınca farklı oranlarda tespit ediliyor mu? Bunu eşleştirilmiş tasarımla ölçen bir çalışma yok. Buna karşın hipotezin mekanizmasına dair dolaylı kanıt güçlüdür. CloudFlow (USENIX Security 2025), genel amaçlı araçların olay nesnelerini kaynak olarak modellemediğini göstermiş ve bu eksikliği özel modellerle kapatmıştır.\[1\] Resmî CodeQL ve Semgrep belgelerinde de Hono ya da Cloudflare Workers için yerleşik bir kaynak modeli veya kural seti bulunamamıştır.\[2\]\[3\]

## TL;DR

- **Merkezî boşluk gerçek, ancak dar ve dikkatli ifade edilmeli.** Varsayılan CI kapılarını ikiz tasarımla karşılaştıran bir çalışma tespit edilmedi. İkiz tasarımda açık ve sink aynıdır, yalnızca kaynak değişir. PureSec'in endüstri kılavuzu bu hipotezi veriye dayanmadan ileri sürüyor. CloudFlow ve SymFlow olay kaynaklarını taint kaynağı olarak modelleyen *özel* araçlar geliştiriyor, ancak varsayılan kapıları kaynak türüne göre karşılaştırmıyor.
- **Cloudflare Workers + Hono bağlamındaki en büyük tehdit taban etkisidir.** CodeQL'in desteklenen çerçeveler listesinde AWS Lambda ve Vercel var, Hono ve Cloudflare Workers yok. Bu nedenle HTTP ikizi de düşük oranda tespit edilebilir ve RQ2 karşılaştırması bilgi taşımayabilir. Tasarıma pozitif kontrol kolu (ör. Express) eklenmelidir.
- **Önerilen konumlandırma bir "kaynak modeli kapsamı" çalışmasıdır.** Tasarım üç kollu ve eşleştirilmiş olmalıdır: modellenmiş HTTP, Hono HTTP ve olay kaynağı. Analizde araç başına kesin McNemar, araçlar arası Cochran's Q ve GLMM kullanılmalıdır. RQ3 için wrangler.jsonc'ten türetilen kaynak modelleri held-out kümede test edilmelidir. CI/CD kimlik güvenliği destekleyici bağlam olarak kalmalıdır.

## Key Findings

1. **Taranan literatürde doğrudan emsal yok.** En yakın çalışmalar şunlardır:
   - CloudFlow (Raffa vd., USENIX Security 2025): 40 mikro-benchmark ve 104 gerçek uygulama; Python, AWS ve Pysa.\[1\]
   - Aynı ekibin SANER 2024 öncülü.\[4\]
   - SymFlow (Wang vd., LCTES 2026).\[5\]
2. **Mekanizma dolaylı olarak kanıtlanmış.** CloudFlow yazarlarına göre genel amaçlı araçlar "analyse only the source code, which does not contain any event-related information". CloudFlow bu sorunu tüm handler olay nesnelerini kaynak olarak işaretleyerek çözer.\[1\]
3. **Resmî araç belgeleri hipotezi dolaylı olarak destekliyor (gri literatür).**
   - CodeQL'in JS/TS çerçeve listesinde Hono ve Workers yok.\[2\]
   - CodeQL'de varsayılan tehdit modeli "remote".\[6\]
   - Semgrep CE yalnızca "single-function taint analysis" yapıyor.\[3\]
   - Hono veya Cloudflare için resmî bir Semgrep kural seti yok.\[3\]
4. **Genel SAST başarımı zaten düşük.** Bu, RQ1 için güçlü bir öncüldür.
   - Li vd. (ESEC/FSE 2023): Gerçek Java açıklarının %12,7'si tespit edildi.\[7\]
   - Brito vd. (IEEE TR 2023): 957 Node.js açığında en iyi üç aracın birleşimi %57,6 recall'a ulaştı, precision ise %0,11'de kaldı.\[8\]
   - Bennett vd. (EASE 2024): Tekil araçlar %11,2–%26,5 oranında tespit yaptı. Özel kurallarla Semgrep %44,7'ye çıktı.\[9\] Bu, RQ3 için doğrudan emsaldir.
5. **Cloudflare Workers akademik literatürü neredeyse yalnızca izolasyon ve yan kanal (V8 isolate, Spectre) üzerine.**\[10\]\[11\] Binding, D1, R2, Queues veya Cron düzeyinde uygulama güvenliği analizi yapan bir çalışma tespit edilmedi.

---

## 1. Başlık ve Konumlandırma

Konumlandırma genel olarak destekleniyor, ancak iki düzeltme gerekli.

- **"Edge" vurgusu kanıt tabanından geniş.** Serverless statik analiz literatürü (Obetz vd. 2019/2020, Raffa vd. 2024/2025, SymFlow 2026) neredeyse tamamen AWS Lambda ve Python odaklı. Asıl ölçülen değişken *kaynak türü* olduğu için başlık bunu öne çıkarmalıdır.
- **"Default DevSecOps Gates" ifadesi fazla geniş.** Gitleaks, Trivy, OSV-Scanner ve Checkov taint kaynağı modellemesi yapmaz. Hipotez yalnızca CodeQL ve Semgrep CE/Opengrep için anlamlıdır.

**Alternatif başlıklar:**
1. "Same Sink, Different Source: A Paired Empirical Study of Taint-Source Coverage in Default SAST Gates for Event-Driven Serverless Edge Applications" (önerilen)
2. "Beyond the HTTP Request: Measuring Event-Source Blind Spots of CI Security Gates on Cloudflare Workers"
3. "Twin Vulnerabilities, Unequal Detection? Event-Source Modeling Gaps in Default and Platform-Aware SAST for Serverless Edge Applications"

---

## 2. Çekirdek Hipotezin Kanıt Durumu

| Bileşen | Kanıt düzeyi | Dayanak |
|---|---|---|
| Genel amaçlı araçlar olay nesnelerini ve olayla tetiklenen kodu kendiliğinden modellemez | **(1) Gösterilmiş** (Python/AWS/Pysa) | CloudFlow |
| Olay semantiği olmadan çağrı grafiği ve dataflow sağlıklı kurulamaz\[12\] | **(1) Gösterilmiş** (formel) | Obetz vd. HotCloud 2019; ESOCC 2020 |\[13\]\[14\]
| SAST kaynak/sink kuralları FaaS yapılarını hesaba katmadığı için FN üretir\[15\] | **(2) Yalnızca hipotez** | PureSec SAS Top 10 (veri yok) |
| CodeQL/Semgrep varsayılanları Hono/Workers handler parametrelerini kaynak saymaz\[2\]\[3\] | **(3) Dolaylı** (belge incelemesi) | CodeQL çerçeve listesi; Semgrep JS belgeleri |
| Eksik taint spesifikasyonu FN nedenidir | **(3) Dolaylı** (Java) | IRIS: CodeQL 27 açık, IRIS 55 açık\[16\] |
| Eşdeğer açıklar olay kaynağında *anlamlı derecede daha düşük* oranda tespit edilir | **(4) Değerlendirilmemiş** | Tespit edilmedi |
| Platform-farkında kurallar held-out açıklarda boşluğu kapatır | **(4)** serverless için; genel SAST için **(3) dolaylı** | Bennett vd. 2024 |

**Sonuç:** Hipotez ne doğrulanmış ne de çürütülmüştür. Mekanizma dolaylı olarak desteklenir; etkinin büyüklüğü ve yönü bilinmemektedir.

---

## 3. Arama Stratejisi ve Veri Tabanına Özgü Sözdizimi

### 3.1 Aile başına çekirdek Boolean ifadeleri (Scopus biçimi; `TITLE-ABS-KEY(...) AND PUBYEAR > 2017` ile sarılır)

| # | Aile | Çekirdek ifade |
|---|---|---|
| F1 | Serverless×Security | ("serverless" OR "function-as-a-service" OR "FaaS") AND (security OR vulnerab* OR attack* OR "threat model*") |
| F2 | Serverless×Static Analysis | ("serverless" OR "FaaS" OR "AWS Lambda") AND ("static analysis" OR "taint analysis" OR "call graph" OR "program analysis") |
| F3 | Serverless×Event Injection | ("serverless" OR "FaaS") AND ("event injection" OR "event spoofing" OR "trigger abuse" OR "event poisoning") |
| F4 | Event Source×Taint | ("event source*" OR "event-driven" OR "message queue*" OR webhook* OR asynchronous) AND ("taint analysis" OR "taint source*" OR "source-sink" OR "information flow") |
| F5 | Serverless×DevSecOps | ("serverless" OR "FaaS") AND ("DevSecOps" OR "shift-left" OR "security pipeline*") |
| F6 | Serverless×CI/CD Security | ("serverless" OR "FaaS") AND ("CI/CD" OR "continuous integration" OR "continuous deployment") AND security |
| F7 | Edge×CI/CD Security | ("edge computing" OR "edge function*" OR "serverless edge") AND ("CI/CD" OR "continuous deployment" OR "DevSecOps") AND security |
| F8 | Cloudflare Workers×Security | ("Cloudflare Workers" OR "V8 isolate*" OR "Deno Deploy" OR "Lambda@Edge" OR "Vercel Edge") AND (security OR isolation OR "side channel" OR vulnerab*) |
| F9 | JS/TS×SAST | ("JavaScript" OR "TypeScript" OR "Node.js" OR "npm") AND ("static analysis" OR "SAST" OR "taint analysis") AND vulnerab* |
| F10 | SAST×False Negatives | ("static application security testing" OR "SAST" OR "static analy* tool*") AND ("false negative*" OR "missed vulnerabilit*" OR recall) |
| F11 | SAST×Benchmark | ("SAST" OR "static application security testing") AND (benchmark* OR "Juliet" OR "OWASP Benchmark" OR "SARD" OR "ground truth") |
| F12 | IaC×Serverless | ("infrastructure as code" OR "Terraform" OR "CloudFormation" OR "AWS SAM") AND ("serverless" OR "FaaS") AND (security OR misconfiguration*) |
| F13 | PaC×Serverless | ("policy as code" OR "policy-as-code" OR "Open Policy Agent" OR "Rego") AND ("serverless" OR cloud OR deployment) AND security |
| F14 | GitHub Actions×Supply Chain | ("GitHub Actions" OR "GitHub workflow*" OR "CI workflow*") AND ("supply chain" OR "code injection" OR "pull_request_target" OR security) |
| F15 | GitHub Actions×OIDC | ("GitHub Actions" OR "CI/CD" OR pipeline*) AND ("OpenID Connect" OR "OIDC" OR "workload identity federation" OR "short-lived credential*") |
| F16 | Preview Deployment×Security | ("preview deployment*" OR "ephemeral environment*" OR "review app*" OR "staging environment*") AND (security OR isolation OR exposure) |
| F17 | Serverless×Vuln. Detection | ("serverless" OR "FaaS" OR "AWS Lambda") AND ("vulnerability detection" OR "code injection" OR "information leakage") |
| F18 | EDA×Security Analysis | ("event-driven architecture*" OR "event-based system*" OR "publish/subscribe" OR "message broker*") AND ("security analysis" OR "static analysis" OR vulnerab*) |
| F19 | Serverless×Dataflow | ("serverless" OR "FaaS") AND ("data flow analysis" OR "dataflow analysis" OR "information flow" OR "inter-service") |
| F20 | DevSecOps×Gate Evaluation | ("DevSecOps" OR "security gate*" OR "security tool* integration") AND (evaluation OR empirical OR "execution time" OR overhead OR latency) |

### 3.2 Veri tabanı dönüşüm kuralları

| Veri tabanı | Sarmalayıcı | Uyarlama |
|---|---|---|
| IEEE Xplore | Command Search, `("All Metadata":...)` | Joker sayısı sınırlı; açık varyant yazılır |
| ACM DL | `Abstract:(...) AND Abstract:(...)` | Her blok ayrı `Abstract:` alanında |
| Scopus | `TITLE-ABS-KEY(...) AND PUBYEAR > 2017` | Olduğu gibi |
| Web of Science | `TS=(...)`, `PY=(2018-2026)` | Olduğu gibi |
| SpringerLink | Serbest Boolean | Joker kaldırılır; tırnak korunur |
| ScienceDirect | "Title, abstract, keywords" | Joker yok; alan başına ≤8 Boolean bağlaç, bloklar ikiye bölünür |
| arXiv | `abs:"..." AND (abs:... OR abs:...)` | Joker yok; dışlama için `ANDNOT` |
| Google Scholar | Kısa sorgu veya `allintitle:` | İç içe parantez güvenilir değil; ilk 200–300 sonuç taranır ve bu sınır raporlanır |

---

## 4. Kavram Haritası

| Kavram | Tanım | Eş anlamlılar | Yakın kavramlar | İlgi |
|---|---|---|---|---|
| Serverless Edge Computing | Fonksiyonların dağıtık edge düğümlerinde, isolate tabanlı sandbox'larda çalışması | edge functions, edge runtime | V8 isolate, Lambda@Edge | Hedef platform |
| FaaS | Olayla tetiklenen, kısa ömürlü, durumsuz fonksiyon modeli\[17\] | serverless functions | BaaS, trigger | Genel alan |
| Event-driven Architecture | Asenkron olaylarla etkileşen mimari | message-driven, pub/sub | queue, broker | Kaynak çeşitliliği |
| Event Injection | Güvenilmeyen olay verisinin doğrulanmadan sink'e ulaşması | event spoofing | injection | Tehdit sınıfı |
| Event Source | Fonksiyonu tetikleyen ve veri taşıyan platform bileşeni | trigger, binding input | Queues, Cron, R2 notification, webhook | Bağımsız değişken |
| Taint Source | Güvenilmeyen kabul edilen değer üreten nokta | RemoteFlowSource, ThreatModelFlowSource | threat model | Hipotezin çekirdeği |
| Taint Analysis | Kaynaktan sink'e sanitizer'sız yol arayan analiz\[18\] | source-sink analysis | sanitizer, barrier | Tespit mekanizması |
| Dataflow Analysis | Değerlerin program noktaları arasında yayılımı | information flow (statik) | call graph | Olay zincirleri |
| SAST | Çalıştırmadan kaynak kod güvenlik analizi | static application security testing | CodeQL, Semgrep, Opengrep | RQ1–RQ3 |
| DevSecOps | Güvenliğin DevOps döngüsüne otomatik entegrasyonu | shift-left | continuous security | Bağlam |
| Security Gate | Koşul sağlanmazsa pipeline'ı bloke eden kontrol | quality/policy gate | fail-closed | Ölçüm birimi |
| IaC | Altyapının dosyalarla tanımlanması | infrastructure as code | wrangler.jsonc, serverless.yml | Kaynak türetme |
| Policy-as-Code | Politikaların kod olarak değerlendirilmesi | PaC | OPA, Rego, Checkov | RQ3 yapılandırma kuralları |
| SCA | Bağımlılık açıklarının tespiti | dependency scanning | OSV-Scanner, Trivy | Tamamlayıcı |
| Software Supply Chain Security | Kod, bağımlılık, build ve dağıtım bütünlüğü | SSC security | SLSA, Sigstore, SBOM | Bağlam |
| CI/CD Security | Pipeline ve iş akışı güvenliği | pipeline security | PPE, workflow injection | Destekleyici |
| Zero Trust | Örtük ağ güveninin reddi | ZTA, ZTNA | mTLS, authz | Tamamlayıcı |
| Preview Deployment | PR başına geçici dağıtım | ephemeral environment | staging | Güven sınırı |
| Platform-specific vulnerability | Platform API/binding semantiğinden doğan açık | platform-dependent flaw | confused deputy | Kapsam |
| False Negative | Gerçek açığın raporlanmaması | miss | recall | Bağımlı değişken |
| Detection Gap | Koşullar arası tespit oranı farkı | blind spot | ΔRecall | Ana sonuç |

**Zincir 1 (SAST):**
1. Event injection
2. Güvenilmeyen olay kaynağı (Queue mesajı, Cron, R2 olayı, webhook)
3. *Taint source modeling*: Araç bu parametreyi kaynak sayıyor mu?
4. İnterprosedürel *dataflow analysis*
5. Sonuç: TP veya FN

En zayıf halka 3. adımdır. RQ2 bu adımı yalıtır.

**Zincir 2 (Dağıtım):**
1. GitHub Actions
2. Kimlik bilgisi (statik Cloudflare API token veya kısa ömürlü kimlik)
3. Wrangler
4. Workers ve binding'ler
5. Dağıtılmış uygulama

---

## 5. Anahtar Kelime Matrisi

| Alan | Birincil | Varyantlar | İlgili | Dışlama (gerekçe) |
|---|---|---|---|---|
| A Edge/runtime | serverless edge, V8 isolate | edge functions | Spectre, microVM | "IoT offloading", "MEC scheduling" (kaynak tahsisi, uygulama güvenliği değil) |
| B Serverless güvenliği | serverless security, event injection | FaaS vulnerability | IAM, least privilege | "cold start", "pricing" (performans/ekonomi) |
| C CI/CD | GitHub Actions security | workflow injection, PPE | SLSA, SBOM | "build failure prediction" (güvenlik dışı) |
| D Gates | DevSecOps, security gate | shift-left | SAST in CI | Tek başına "DevOps culture" (değerlendirme yok) |
| E SAST | taint analysis, CodeQL, Semgrep | source-sink | call graph | "code style linting", "binary analysis" (kaynak kod dışı) |
| F Benchmark | SAST benchmark, ground truth | Juliet, SecBench.js | mutation | "LLM code generation benchmark" (tespit değilse) |
| G Olay kaynakları | event-source modeling, taint source | async dataflow | webhook, queue | "event camera", "complex event processing performance" (terim çakışması) |
| H IaC/PaC | IaC security, OPA/Rego | misconfiguration | wrangler.toml | "IaC defect prediction" (güvenlik dışıysa) |
| I SCA/sırlar | SCA, secret scanning | typosquatting | OSV, Gitleaks | "license compliance" |
| J ZT/API | API security, BOLA | ZTNA, mTLS | OpenAPI | "network ZT hardware" |
| K CI kimliği | OIDC, workload identity | short-lived credentials | environment protection | "SSO usability" (CI bağlamı yoksa) |
| L Yöntem | McNemar, Cochran's Q | paired proportions | GLMM, Holm | Klinik uygulama örnekleri (yalnızca yöntem kaynağı) |

---

## 6. Sistematik Haritalama Metodolojisi

**Protokol:** Kitchenham–Charters tarzı SMS ile Wohlin tarzı snowballing kullanılır. Bu kaynakların bibliyografik ayrıntıları bu taramada doğrulanmamıştır. Protokol OSF veya Zenodo'da ön kayda alınmalıdır.

**Aşamalar:**
1. Arama: F1–F20 aileleri, 8 veri tabanı, 2018–2026 aralığı.
2. Tekilleştirme: Önce DOI, ardından başlık, yıl ve ilk yazar üzerinden bulanık eşleşme yapılır. arXiv ve hakemli sürümler birleştirilir; hakemli sürüm birincil kayıt olur (ör. FaaSGuard arXiv/SCAM 2025; Brito arXiv/IEEE TR).
3. Başlık taraması: İki bağımsız değerlendirici, kapsayıcı yaklaşım.
4. Özet taraması: İlk %20'de Cohen's κ hesaplanır; κ < 0,6 ise ölçütler yeniden kalibre edilir.
5. Tam metin taraması: Dışlama gerekçeleri E1–E8 olarak kodlanır.
6. Geriye ve ileriye snowballing: Doygunluğa kadar sürdürülür (ACM "cited by", Semantic Scholar).
7. Kalite değerlendirmesi: Q1–Q8, nitel.
8. Veri çıkarımı: Platform, dil, araç/sürüm/konfigürasyon, kaynak ve sink türleri, ground truth, FN ölçümü, istatistik, artefakt.
9. Tematik sentez ve boşluk matrisi.

**Dâhil etme:** Ampirik, deneysel, benchmark, araç değerlendirmesi, SLR/survey ve doğrudan ilgili taksonomi çalışmaları. Konu olarak statik analiz, CI/CD, serverless veya DevSecOps güvenliği ya da ilgili bulut/edge güvenliği kapsanır.

**Dışlama:**
- Salt performans veya maliyet çalışmaları
- Güvenlikle ilgisiz bulut çalışmaları
- Vendor pazarlama içerikleri
- DevSecOps'tan yalnızca geçerken bahseden çalışmalar
- Serverless veya güvenlikle ilgisi olmayan edge çalışmaları
- Mükerrer kayıtlar
- Doğrulanamayan atıflar

**Sınırda kalan kararlar:**
- *Skyler (ASPLOS 2026):* Maliyet odaklı olduğu için dışlanır. JS serverless statik analizinin fizibilitesini gösterdiği için arka plan olarak anılır.
- *Denial-of-wallet çalışmaları:* B alanında tutulabilir, ancak RQ'larla ilişkisi zayıftır.
- *Cloudflare Spectre çalışmaları:* Platform tehdit modelini tanımladığı için bağlam olarak dâhil edilir.
- *LLM tabanlı tespit çalışmaları:* Dışlanır. Taint spesifikasyonu eksikliğini ölçen IRIS ise mekanizma kanıtı olarak dâhil edilir.

---

## 7. Doğrulanmış Literatür Matrisi

**D.** sütunu: **E** = yayıncı veya birincil kaynakta doğrulandı; **K** = ikincil kaynak veya atıf listesinde görüldü; **Ö** = ön baskı. Scopus ve WoS indeks durumu doğrulanmadı; sütunda yayıncı verilmiştir. RQ ilgisi: Y (yüksek), O (orta), D (düşük).

| # | Yazarlar | Yıl | Başlık | Venue | Yayıncı | Tür | Alan | Platform | Yöntem/Veri | Ana bulgu | Kısıt | RQ1 | RQ2 | RQ3 | RQ4 | DOI/URL | D. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Raffa, Blasco, O'Keeffe, Dash | 2025 | CloudFlow: Identifying Security-sensitive Data Flows in Serverless Applications | USENIX Security '25, 1073–1090 | USENIX | Tool Eval./Benchmark | B,E,G | AWS, Python | IaC→olay/izin/giriş; senkron temsil + Pysa; 40 CloudBench, 104 AWSomePy | 37/40 geçti; 11 doğrulanmış açık | Varsayılan araç ve ikiz yok | O | Y | Y | D | usenix.org/conference/usenixsecurity25/presentation/raffa; 10.5281/zenodo.15613797 | E |
| 2 | Raffa, Blasco, O'Keeffe, Dash | 2024 | Towards Inter-service Data Flow Analysis of Serverless Applications | SANER 2024, 654–658 | IEEE\[19\] | Tool/Benchmark | E,G | AWS, Python | Mikro-benchmark; altyapı + uygulama kodu | Platform servisleri statik analize dâhil edilebilir | Kısa bildiri | O | O | O | D | 10.1109/SANER60148.2024.00072 | E |
| 3 | Wang, Zhong, Liang, Li, Guo, Chen | 2026 | SymFlow: Event-Chain-Aware Symbolic Execution for Serverless Sensitive Data Flow Detection | LCTES 2026, 57–69 | ACM | Tool Eval. | E,G | AWS | Sembolik yürütme; CloudBench + 104 AWSomePy | CloudFlow'a göre +%36,6 akış, +%14,4 precision, +%73,6 zincir kapsamı | CI kapısı yok | D | O | O | D | 10.1145/3814943.3816168 | K |
| 4 | Barrak, Ksontini, Atike, Jaafar | 2025 | FaaSGuard: Secure CI/CD for Serverless Applications – An OpenFaaS Case Study | SCAM 2025 (arXiv:2509.04328) | IEEE | Empirical/Tool | C,D | OpenFaaS, Python | Fail-closed pipeline; 20 depo (85.097 satır, 154 Dockerfile, 63 Terraform)\[20\]\[21\] | Uçtan uca serverless DevSecOps | Olay ayrıştırması yok | Y | D | O | O | ieeexplore.ieee.org/document/11190185 | E |
| 5 | Bennett, Hall, Winter, Counsell | 2024 | Semgrep*: Improving the Limited Performance of Static Application Security Testing (SAST) Tools | EASE 2024, 614–623 | ACM | Tool Eval. | E,F | Üretim kodu | 4 araç; eksik kalıp analizi; yeni kurallar | %11,2–26,5 → Semgrep* %44,7 (+%181)\[9\] | Precision yok | Y | D | Y | D | 10.1145/3661167.3661262 | E |
| 6 | Brito vd. | 2023 | Study of JavaScript Static Analysis Tools for Vulnerability Detection in Node.js Packages | IEEE Trans. Reliability 72(4), 1324–1339 | IEEE | Benchmark | E,F | Node.js | 957 açık, 9 araç, VulcaN; süre\[8\]\[22\]\[23\] | Birleşim %57,6 recall, %0,11 precision\[8\] | Paket düzeyi | Y | D | O | O | ieeexplore.ieee.org/document/10168679 | E |
| 7 | Li, Chen, Fan, Feng, Liu, Liu, Liu, Chen | 2023 | Comparison and Evaluation on Static Application Security Testing (SAST) Tools for Java | ESEC/FSE 2023, 921–933 | ACM | Tool Eval. | E,F | Java | 161 araçtan 7'si; sentetik + gerçek | Gerçek açıkların %12,7'si; birleşimde %70,9 kaçırıldı | Java | Y | D | D | O | 10.1145/3611643.3616262 | E |
| 8 | Bhuiyan, Parthasarathy, Vasilakis, Pradel, Staicu | 2023 | SecBench.js: An Executable Security Benchmark Suite for Server-Side JavaScript | ICSE 2023, 1059–1070 | IEEE/ACM | Benchmark | F | Node.js | 600 açık, exploit oracle | Sink tabanlı ground truth; 20 sıfır-gün | Olay yok | O | D | O | D | 10.1109/ICSE48619.2023.00096 | E |
| 9 | Madsen, Tip, Lhoták | 2015 | Static Analysis of Event-Driven Node.js JavaScript Applications | OOPSLA 2015, 505–519 | ACM | Foundational | E,G | Node.js | Event-based call graph | Olay dinleyicilerinin statik temsili | Güvenlik yok | D | O | O | D | 10.1145/2858965.2814272 | E |
| 10 | Obetz, Patterson, Milanova | 2019 | Static Call Graph Construction in AWS Lambda Serverless Applications | HotCloud '19 | USENIX | Foundational | E,G | AWS | Servis çağrı grafiği | Olay/servis kenarları gerekli | Workshop | D | O | O | D | usenix.org/system/files/hotcloud19-paper-obetz.pdf | E |
| 11 | Obetz, Das, Castiglia, Patterson, Milanova | 2020 | Formalizing Event-Driven Behavior of Serverless Applications | ESOCC 2020, LNCS 12054 | Springer | Formal | G | AWS | Operasyonel semantik | Semantik olmadan dataflow sağlıksız\[12\] | Ampirik değil | D | O | O | D | 10.1007/978-3-030-44769-4_2 | E |
| 12 | Koishybayev vd. | 2022 | Characterizing the Security of Github CI Workflows | USENIX Security '22, 2747–2763 | USENIX | Empirical | C,K | GitHub Actions | 4 güvenlik özelliği | Mutable Action'lar, geniş izinler | Serverless yok | O | D | D | D | usenix.org/conference/usenixsecurity22/presentation/koishybayev | E |
| 13 | Muralee vd. | 2023 | ARGUS: A Framework for Staged Static Taint Analysis of GitHub Workflows and Actions | USENIX Security '23, 6983–7000 | USENIX | Tool/Empirical | C,E | GitHub Actions | 2.778.483 iş akışı, 31.725 Action | 4.307 iş akışı ve 80 Action'da enjeksiyon | Uygulama SAST'ı değil | O | O | O | D | usenix.org/conference/usenixsecurity23/presentation/muralee | E |
| 14 | Rajapakse, Zahedi, Babar, Shen | 2022 | Challenges and solutions when adopting DevSecOps: A systematic review | IST 141, 106700 | Elsevier | SLR | D | Genel | 54 çalışma | 21 zorluk, 31 çözüm\[24\] | Nicel değil | O | D | D | O | 10.1016/j.infsof.2021.106700 | E |
| 15 | Marin, Perino, Di Pietro | 2022 | Serverless computing: a security perspective | J. Cloud Computing 11:69 | Springer | Survey | A,B | Genel | Mimari güvenlik analizi | Zayıflıklar, karşı önlemler\[25\] | Ampirik değil | D | D | D | D | 10.1186/s13677-022-00347-w | E |
| 16 | Ni, Mondal, Kabir, Tan, Dai | 2024 | Toward security quantification of serverless computing | J. Cloud Computing 13:140 | Springer | Threat Model | B | Genel | ADTree + Risk Matrix + PoS | Risk nicelleştirme | Kod düzeyi yok | D | D | D | D | 10.1186/s13677-024-00703-y | E |
| 17 | Wen, Chen, Jin, Liu | 2023 | Rise of the Planet of Serverless Computing: A Systematic Review | ACM TOSEM 32(5) | ACM | SLR | A,B | Genel | 164 makale, 17 yön | Araştırma haritası | Güvenlik alt başlık | D | D | D | D | 10.1145/3579643 | E |
| 18 | Raffa, Blasco, O'Keeffe, Dash | 2023 | AWSomePy: A Dataset and Characterization of Serverless Applications | SESAME '23 | ACM | Dataset | F | AWS, Python | Gerçek uygulamalar | CloudFlow/SymFlow korpusu | Python | O | O | O | D | 10.1145/3592533.3592811 | E |
| 19 | Sankaran, Datta, Bates | 2020 | Workflow Integration Alleviates Identity and Access Management in Serverless Computing | ACSAC 2020 | ACM | Tool/Model | B,K | Serverless | will.iam | İş akışı farkında IAM | Statik değil | D | D | D | D | 10.1145/3427228.3427665 | E |
| 20 | Esposito, Falaschi, Falessi | 2024 | An Extensive Comparison of Static Application Security Testing Tools | EASE 2024 (arXiv:2403.09219) | ACM/arXiv | Tool Eval. | F | Java | 1,5 M test yürütmesi | "SASTTs exhibit high Precision while falling short in Recall" | Sentetik | Y | D | D | D | arxiv.org/abs/2403.09219 | K |
| 21 | Li, Dutta, Naik vd. | 2024 | IRIS: LLM-assisted static analysis for detecting security vulnerabilities | arXiv:2405.17238 (v3, 6 Nis 2025) | arXiv | Tool Eval. | E | Java | Taint spesifikasyonu; CWE-Bench-Java (120 elle doğrulanmış açık) | CodeQL 27, IRIS (GPT-4) 55 (+28) | Java | O | O | Y | D | arxiv.org/abs/2405.17238 | Ö |
| 22 | (yazarlar doğrulanmadı; Wonderless yöntemine dayalı) | 2025 | OpenLambdaVerse | arXiv:2508.01492 | arXiv | Dataset | F | AWS/SF | Serverless Framework kullanan ve AWS Lambda fonksiyonu içeren GitHub depoları; tetikleyici dağılımı | http %83,78; zamanlanmış %8,03; sqs/s3/sns depoların %2–4'ünde\[26\] (oranlar özette yok, doğrulanmadı) | Güvenlik yok | D | O | D | D | arxiv.org/abs/2508.01492 | Ö |
| 23 | Schwarzl, Xiao, Pedersen, Ainsworth, Topham (ikincil kaynaktan; doğrulanmalı) | 2026 | Remote-Timer-as-a-Service: Efficient Microarchitectural Leakage in the Cloud with Remote Timers | arXiv:2608.17043 (17 Ağu 2026) | arXiv | Security Research | A | Workers | Uzaktan Spectre | Co-located Worker'dan sızıntı; Cloudflare Eylül 2025'ten beri her isolate heap'ini MPK ile donanım sınırına aldı; Cloudflare'e göre MPK "does not eliminate Spectre risk entirely" | Ön baskı | D | D | D | D | arxiv.org/html/2608.17043 | Ö |

**Gri literatür (hakemli çalışmalarla eşdeğer değildir):**
- G1: PureSec SAS Top 10.
- G2: OWASP Serverless Top 10. Yalnızca atıflarda "OWASP Foundation, 2018" olarak görüldü.
- G3: OWASP DVSA. Birincil kaynaktan doğrulanamadı.
- G4: CodeQL belgeleri (çerçeve listesi, threat models, 2.18.0 ve 2.25.4 değişiklik kayıtları).
- G5: Semgrep JavaScript belgeleri.
- G6: Cloudflare Workers security model ve "A revisit of remote Spectre attacks on Cloudflare Workers".

---

## 8. Kalite Değerlendirmesi (nitel; toplam puan yok)

| Çalışma | Q1 Ampirik | Q2 Veri | Q3 Tekrarlanabilir | Q4 Konfig. | Q5 Ground truth | Q6 FN | Q7 Kısıt | Q8 İlgi |
|---|---|---|---|---|---|---|---|---|
| CloudFlow | Evet | Evet | Güçlü (artefakt değerlendirmesi, Zenodo) | Evet (Pysa) | Mikro-benchmark + elle doğrulama | Evet (2 FN, 1 FP) | Evet | Çok yüksek |
| SANER 2024 | Evet | Evet | Orta–güçlü | Evet | Mikro-benchmark | Kısmi | Kısmi | Çok yüksek |
| SymFlow | Evet | Evet | Doğrulanmadı | Kısmi | CloudBench | Dolaylı | Belirsiz | Çok yüksek |
| FaaSGuard | Evet | Evet (sabit commit) | Orta | Evet | Belirsiz | Belirsiz | Kısmi | Yüksek |
| Semgrep* | Evet | Evet | Orta | Evet | Bilinen üretim açıkları | Evet (%61,2 kaçırma)\[9\] | Evet | Düşük |
| Brito vd. | Evet | Evet | Güçlü (VulcaN) | Evet | Advisory + anotasyon | Evet | Evet | Orta |
| Li vd. | Evet | Evet | Orta | Evet | Sentetik + gerçek | Evet | Evet | Düşük |
| SecBench.js | Evet | Evet | Güçlü | N/A | Exploit oracle | N/A | Evet | Orta |
| ARGUS | Evet | Evet | Güçlü | Evet | Elle doğrulama | Kısmi | Evet | Orta |

---

## 9. Mutlaka Okunması Gerekenler (rol bazlı)

- **Closest empirical precedent: CloudFlow (2025).** IaC'den olayları çıkarır, uygulamayı senkron temsile dönüştürür ve olay nesnelerini kaynak sayar.\[1\] Hipotezin mekanizmasını hakemli düzeyde belgeler. Yapılandırmadan kaynak türetme yaklaşımı RQ3 için şablon oluşturur. *Boşluk:* Varsayılan kapılar, HTTP/olay ikizi, JS/TS ve edge kapsanmıyor.
- **Event-driven security: SANER 2024 ve SymFlow (2026).** Bağımsız bir grup, olay zincirlerinin statik analiz için zor olduğunu doğruluyor (SymFlow'da +%73,6 kapsam).\[27\]\[28\] *Boşluk:* İstatistiksel karşılaştırma ve CI gecikmesi yok.
- **Foundational: Obetz vd. (2019/2020).** Olay kaynağının dataflow'u neden kestiğine dair kuramsal temeli sunar.\[12\]\[13\] *Boşluk:* Tespit oranı ölçülmüyor.
- **Foundational (JS): Madsen, Tip, Lhoták (2015).** Event-based call graph kavramını getirir.\[29\] Workers'ın `fetch`/`queue`/`scheduled` handler modeli için kavramsal öncüldür. *Boşluk:* Taint analizi yok.
- **SAST methodology (JS): Brito vd. (2023).** JS'de varsayılan SAST'ın hem düşük recall hem çok düşük precision verdiğini gösterir;\[8\] RQ1 beklentisini kalibre eder. *Boşluk:* Uygulama giriş noktaları yok.
- **SAST methodology: Semgrep* (2024).** RQ3'ün en yakın emsalidir. *Boşluk:* Kuralların aynı açıklarda hem yazılıp hem test edilmesi (overfitting) riski var; held-out küme bu riski giderir.
- **Benchmark methodology: Li vd. (2023) ve SecBench.js (2023).** Li vd. sentetik ve gerçek dünya sonuçları arasındaki farkı gösterir; SecBench.js exploit oracle yöntemini sunar.\[7\]\[30\] Birlikte, sentetik korpusun gerçek dünya çapasıyla desteklenmesi gerektiğini ortaya koyarlar.
- **CI/CD security: Koishybayev vd. (2022) ve ARGUS (2023).** ARGUS webhook olay verisini taint kaynağı olarak modeller; bu, "olay = kaynak" fikrinin CI katmanındaki emsalidir.\[31\] *Boşluk:* Uygulama kodu yok.
- **DevSecOps foundation: Rajapakse vd. (2022).** Araç kaynaklı zorlukların baskın olduğunu gösterir;\[24\] RQ4'ün gerekçesini sağlar.
- **Serverless security foundation: Marin vd. (2022).** Tehdit modeli çerçevesi sunar; ampirik değildir.\[25\]
- **Serverless DevSecOps: FaaSGuard (2025).** Serverless'a özgü CI kapısının en yakın hakemli örneğidir.\[20\]\[21\] *Boşluk:* Kaynak türü ayrıştırması yok.
- **Edge-specific security: Remote-Timer-as-a-Service (ön baskı) ve Cloudflare güvenlik modeli.** Isolate modelinin microVM'den farklı olduğunu belgeler.\[32\]\[33\] Uygulama katmanı analizi içermemeleri boşluğu teyit eder.

---

## 10. Merkezî Boşluk Analizi

**Soru:** Aynı serverless açığının HTTP girdisiyle ve HTTP dışı olay girdisiyle farklı oranlarda tespit edildiğini ampirik olarak ölçen hakemli bir çalışma var mı?

**Kanıt:**
- **Kuyruk:** CloudFlow'un örnek zinciri HTTP POST → SQS → S3 → DynamoDB Stream → `os.system` şeklindedir.\[1\] Bu zincir kaynakları karşılaştırmak için değil, zincirin izlenebilirliğini göstermek için kullanılır.
- **Nesne depolama ve zamanlanmış olaylar:** CloudBench S3, DynamoDB, SQS ve SNS içerir. Tüm handler olayları kaynak kabul edilir; kaynak türüne göre ayrıştırılmış recall raporlanmaz.\[1\]
- **Webhook:** ARGUS olay verisini taint kaynağı olarak modeller, ancak CI katmanında çalışır.\[31\]
- **Tetikleyici dağılımı:** OpenLambdaVerse'e göre HTTP tetikleyiciler %83,78 ile baskındır.\[26\] Bu, araçların HTTP'ye öncelik vermesinin yapısal açıklamasıdır; bir tespit ölçümü değildir.
- **Varsayılan modeller:** CodeQL çerçeve listesi AWS Lambda ve Vercel'i içerir, Hono ve Workers'ı içermez.\[2\] CodeQL 2.25.4 (2026-05-12) sürüm notuna göre Vercel handler'ları yalnızca `VercelRequest`/`VercelResponse` tipleriyle tanınır.\[34\] Bu, çerçevelerin tek tek modellendiğini gösterir. Queue ve scheduled parametreleri için belgelenmiş bir model bulunamadı.
- **Endüstri iddiası:** PureSec kural setlerinin "evolve" etmesi gerektiğini söyler, ancak veri sunmaz.\[15\]

**Sınıflandırma:** Doğrudan eşleşen çalışma **taranan literatürde tespit edilmedi**. Konu mekanizma düzeyinde **dolaylı olarak incelenmiştir**. Bu, böyle bir çalışmanın var olmadığı anlamına gelmez. Savunma öncesinde 2025–2026 çalışmaları ileri snowballing ile yeniden taranmalıdır.

**Konumlandırmayı değiştiren uyarı:** Hono HTTP de modellenmemişse her iki kol da ~%0 tespit oranına yakın çıkar. Bu durumda McNemar testinin anlamsız çıkması "fark yok" değil, **taban etkisi** demektir. Bu yüzden Express veya düz Node `http` ile kurulan bir pozitif kontrol kolu zorunludur.

---

## 11. Boşluk Karşılaştırma Tablosu

| Çalışma | Ne inceliyor | Ne incelemiyor | Farkı |
|---|---|---|---|
| CloudFlow | Özel IaC-farkında taint; serverless SAST ✔; çoklu servis ✔ | HTTP/olay karşılaştırması ✘; varsayılan konfig. ✘; edge ✘; Cloudflare ✘; JS/TS ✘; ikiz ✘; istatistik ✘; CI gecikmesi ✘; çoklu araç ✘ | *Varsayılan* kapıları kaynağa göre ayrıştırır |
| SymFlow | Olay zinciri sembolik yürütme | Varsayılan kapılar ✘; held-out ✘; CI ✘ | Tespit aracı değil, kapı değerlendirmesi |
| SANER 2024 | Mikro-benchmark | Çoklu araç ✘; istatistik ✘ | İkiz tasarım + istatistiksel test |
| FaaSGuard | Serverless DevSecOps; CI ✔ | Kaynak türü ✘; edge ✘; JS/TS ✘; held-out ✘ | Kör noktayı nedensel olarak yalıtır |
| Semgrep* | Varsayılan/özel kural ✔; çoklu araç ✔ | Serverless ✘; olay ✘; held-out belirsiz | Serverless olaylara ve held-out kümeye taşır |
| Brito vd. | JS SAST ✔; çoklu araç ✔; süre ✔ | Giriş noktaları ✘; olay ✘ | Uygulama düzeyinde çalışır |
| Li vd. | Çoklu araç ✔; performans ✔ | JS ✘; serverless ✘ | Kaynağı manipüle eder |
| ARGUS | Olay verisi taint'i (CI) | Uygulama kodu ✘ | Aynı fikri uygulama katmanına taşır |

---

## 12. En Güçlü Üç Boşluk

**Boşluk 1: Varsayılan kapılarda olay kaynağı tespit farkının eşleştirilmiş ölçümü.**
- *Kanıt:* CloudFlow, PureSec ve araç belgeleri.
- *Bilinmeyen:* Etkinin yönü ve büyüklüğü; araç ve CWE ile etkileşimi.
- *Neden cevapsız:* Hiçbir çalışma kaynağı manipüle etmiyor.
- *Deney:* Üç kollu ikiz korpus; araç başına kesin McNemar ve GLMM.
- *Katkı:* İlk nedensel "kaynak modeli kapsamı" ölçümü ve açık bir benchmark.
- *Tehditler:* Taban etkisi; sentetik temsil; hızlı değişen araç sürümleri (Vercel desteği 2026-05'te eklendi).\[34\]

**Boşluk 2: wrangler.jsonc'ten türetilen kaynak modellerinin held-out değerlendirmesi.**
- *Kanıt:* CloudFlow (serverless.yml'den kaynak türetme);\[1\] Bennett vd.; CodeQL `sourceModel` veri uzantıları (beta).\[35\]
- *Bilinmeyen:* Queues consumer, Cron, R2 notification ve service binding modellerinin genellenip genellenmediği ve FP maliyeti.
- *Deney:* Geliştirme kümesinde kurallar yazılıp dondurulur. Farklı bir yazarın hazırladığı held-out kümede McNemar uygulanır; temiz ikizlerde ΔFPR ölçülür.
- *Katkı:* Yeniden kullanılabilir bir model paketi.
- *Tehdit:* Yazarın korpus bilgisinin kurallara sızması.

**Boşluk 3: Edge dağıtım pipeline'ında kapı maliyeti.**
- *Kanıt:* Brito vd. ve Li vd. araç sürelerini ölçtü; FaaSGuard bir pipeline kurdu; Rajapakse vd. gecikmeyi bir zorluk olarak belirtti.
- *Bilinmeyen:* Workers ve GitHub Actions ortamında gecikme, CPU, bellek ve blok oranı.
- *Deney:* Her konfigürasyon için n ≥ 30 tekrar; Wilcoxon, Cliff's δ, bootstrap güven aralığı.
- *Katkı:* "Tespit kazancı başına saniye" metriği.
- *Tehditler:* Runner gürültüsü; önbellek etkisi.

Ayrı bir "CI/CD kimlik" boşluğu *önerilmemiştir*. Koishybayev vd. ve ARGUS bu alanı yoğun biçimde inceliyor.

---

## 13. Olgunluk Durumu

| Durum | Alanlar | Gerekçe |
|---|---|---|
| Olgun | Genel DevSecOps benimseme; genel SAST karşılaştırmaları; genel GitHub Actions güvenliği | Rajapakse vd.; Li vd., Brito vd.; Koishybayev vd., ARGUS ve atıf ağı |
| Olgun–orta | Genel serverless taksonomileri | Marin vd., Ni vd., Wen vd. |
| Orta | Serverless statik açık tespiti; JS SAST | CloudFlow/SANER/SymFlow (Python/AWS, ağırlıkla tek grup); SecBench.js |\[1\]\[28\]\[36\]
| Az çalışılmış | Olay kaynağı farkında SAST; platforma özgü taint kaynağı modellemesi | Yalnızca özel araçlar var |
| Tespit edilmedi | Edge (isolate) uygulama SAST'ı; Workers binding/D1/R2/Queues analizi; eşleştirilmiş HTTP/olay benchmark'ı; edge dağıtım kapıları; önizleme dağıtımı kapıları | Akademik çalışma bulunamadı |

---

## 14. Araştırma Tasarımı Önerisi

- **Savunulabilirlik: Yüksek.** Workers modülü `fetch`, `queue` ve `scheduled` handler'larını aynı dosyada barındırır.\[37\] Böylece ikizler aynı iş mantığı içinde yalnızca giriş noktası değiştirilerek kurulabilir; bu, iç geçerlilik için idealdir.
- **Tekrarlanabilirlik: Yüksek.** SAST dağıtım gerektirmez. Oracle'lar Miniflare/Wrangler ile yerel olarak çalıştırılabilir.
- **Temsil gücü: Orta.** Workers ekosisteminde tetikleyici dağılımı bilinmiyor; bu bir sınırlılık olarak raporlanmalıdır.
- **MSc kapsamı:**
  - 5–8 CWE: CWE-89 (D1), CWE-22/73 (R2 anahtarı), CWE-918, CWE-78/94, CWE-639, CWE-79
  - 4 olay kaynağı
  - 3 araç: CodeQL, Semgrep CE, Opengrep
  - ~60–120 ikiz çift
- **Dergi ölçeği:** AWS Lambda (TS/Node), ikinci bir edge platformu (Vercel Edge veya Deno Deploy) ve gerçek açık madenciliği eklenir.
- **AWS Lambda:** İkincil doğrulama kolu olmalıdır. CodeQL AWS Lambda'yı modellediği için "modellenmiş serverless" pozitif kontrolü işlevi görür\[2\] ve bulgunun Cloudflare'e mi yoksa genel olarak serverless'a mı özgü olduğunu ayırır. Güvenlik modelleri (microVM ile isolate; IAM ile binding) eşdeğer varsayılmamalıdır.
- **OWASP DVSA:** Dış geçerlilik kontrolü olarak kullanılmalıdır. Sürümü doğrulanmadığı ve eşleştirmeye uygun olmadığı için ana korpus yapılmamalıdır.

---

## 15. Deney Değişkenleri

| Tür | Değişkenler |
|---|---|
| Bağımsız | Kaynak (HTTP-Express / HTTP-Hono / Queue / Cron / R2 bildirimi / webhook); araç; konfigürasyon (varsayılan / genişletilmiş / özel); CWE; platform; akış karmaşıklığı (intra/inter) |
| Bağımlı | Çift düzeyinde tespit (0/1); recall; precision; FPR (temiz ikizlerde); FNR; F1; tarama süresi; pipeline süresi; CPU; tepe bellek; blok oranı |
| Kontrol | Sink API; iş mantığı; kaynaktan sink'e adım sayısı; lockfile; Node/TS/Wrangler sürümleri; LOC (±%5); runner tipi; araç ve kural sürümü (commit hash); zaman aşımı; tekrar sayısı |

Semgrep CE'nin tek-fonksiyon sınırı nedeniyle akış karmaşıklığı kaynak türüyle *çaprazlanmalıdır*.\[3\] Aksi hâlde kaynak etkisi ile interprosedürel etki birbirine karışır.

---

## 16. İkiz Tasarımın Eleştirisi

```
HTTP:  app.post("/x", async c => handle(await c.req.json(), c.env))
Queue: async queue(batch, env) { for (const m of batch.messages) await handle(m.body, env) }
Cron:  async scheduled(ctl, env) { await handle(await (await fetch(env.FEED)).json(), env) }
R2:    R2 event notification → queue tüketicisi → obj key/içerik → handle
handle(d, env) → env.DB.prepare("SELECT ... " + d.id).all()   // aynı sink
```

**Eşdeğerlik güvenceleri:**
1. `handle()` ve sink, paylaşılan modülde bayt düzeyinde aynıdır. İkizler yalnızca adapter satırında farklılaşır.
2. Kaynaktan `handle()` çağrısına kadar olan adımlar (property erişimi, `await`, döngü) eşitlenir veya kovaryat olarak kodlanır.
3. Her ikiz, Miniflare üzerinde exploit oracle ile dinamik olarak doğrulanır.
4. FPR ölçümü için her çiftin sanitizer içeren temiz bir ikizi bulunur.
5. Pozitif kontrol: Aynı sink HTTP-Express kolunda tespit edilmiyorsa çift "bilgilendirici değil" olarak işaretlenir.

**İç geçerlilik tehditleri:**
- **Taban etkisi.**
- **Tavan etkisi:** Semgrep'in sözdizimsel kalıpları sink'i kaynaktan bağımsız olarak eşleyebilir. Bu nedenle taint tabanlı ve kalıp tabanlı kurallar ayrı raporlanmalıdır.
- **TS tip anotasyonları:** CodeQL Vercel handler'larını tiplerden tanır.\[34\] Tip varlığı kontrol değişkeni olarak ele alınmalıdır.
- **Sürüm kayması.**
- **Tasarımcı yanlılığı:** İkizler bağımsız bir kişi tarafından denetlenir ve κ raporlanır.

---

## 17. Ground-Truth Korpusu

| Korpus | Güçlü yan | Zayıf yan | Rol |
|---|---|---|---|
| Elle tohumlanmış ikizler | Nedensel yalıtım | Temsil gücü (Li vd.: sentetik ile gerçek arasında fark) | Birincil |
| Mutasyon ikizleri | Ölçek | Yapay kalıplar | Genişletme |
| OWASP DVSA | Serverless'a özgü | AWS; eşleştirme yok; doğrulanmadı | Dış geçerlilik |
| CloudBench | Hakemli, açık | Python | Tasarım ilhamı |
| SecBench.js | Exploit oracle | Paket düzeyi | Oracle yöntemi |
| OWASP Benchmark / Juliet | Standart | Java/C | Uygun değil |
| Gerçek Workers açıkları | Temsil gücü | Sistematik kaynak tespit edilmedi | Vaka analizi |

Sentetik ikizler nedensel bir soru için yayımlanabilir niteliktedir. Bunun için üç koşul gerekir: dinamik oracle doğrulaması, iki anotatör ile κ hesabı ve sonuçların "kontrollü koşulda kaynak modeli kapsamı" olarak ifade edilmesi.

---

## 18. İstatistiksel Analiz

SAST değerlendirmelerinde McNemar veya Cochran's Q kullanan doğrulanmış bir emsal tespit edilmedi. Aşağıdaki seçimler popülerliğe değil, veri yapısına dayanır.

- **RQ1 (çoklu araç, ikili sonuç):**
  - Tespit oranları için Wilson veya Clopper–Pearson güven aralığı.
  - Araçlar arasında **Cochran's Q**; ardından ikili **kesin McNemar** ve **Holm** düzeltmesi.
  - Tamamlayıcılık için UpSet grafiği ve birleşim recall'u.
- **RQ2 (ikizler):**
  - Araç ve kaynak başına **kesin McNemar**. Yalnızca uyumsuz çiftler (b, c) bilgi taşır; b+c < 25 ise kesin test zorunludur.
  - Etki büyüklüğü: eşleştirilmiş OR = b/c ve Newcombe güven aralıklı oran farkı.
  - **GLMM:** `detected ~ source * tool + complexity + (1|pair) + (1|CWE)`.
  - Çoklu kaynak karşılaştırmalarında Holm veya BH düzeltmesi.
- **RQ3:** Held-out kümede varsayılan ve özel kurallar için kesin McNemar; temiz ikizlerde de McNemar. Geliştirme ve held-out kümeleri bağımsız olduğundan aralarındaki fark **Fisher's exact** ile test edilir.
- **RQ4:** Aynı commit üzerinde eşleştirilmiş koşular için **Wilcoxon signed-rank**; bağımsız koşular için **Mann–Whitney U**. Cliff's δ veya A₁₂, medyan ve BCa **bootstrap** güven aralığı raporlanır.
- **Güvenilirlik:** Cohen's κ veya Fleiss' κ.
- **Chi-square:** Eşleştirilmiş veride kullanılmamalıdır.

---

## 19. Metrik Tanımları

Birim (açık örneği, araç, konfigürasyon) üçlüsüdür. Bulgu, beklenen CWE ailesi ve önceden sabitlenmiş ±k satırlık tolerans içindeki sink satırıyla eşleşiyorsa TP sayılır.

- **TP:** Vulnerable örnekte eşleşen bulgu.
- **FN:** Vulnerable örnekte eşleşen bulgu yok.
- **FP:** Temiz ikizde bulgu var. İlgisiz bulgular ayrı raporlanır.
- **TN:** Temiz ikizde bulgu yok.
- Precision = TP/(TP+FP)
- Recall = Detection Rate = TP/(TP+FN)
- F1 = 2PR/(P+R)
- FPR = FP/(FP+TN)
- FNR = FN/(TP+FN) = 1 − Recall
- Coverage = en az bir TP üretilen (CWE × kaynak) hücrelerinin oranı
- Detection Gap(s) = Recall(HTTP-modellenmiş) − Recall(s), eşleştirilmiş çiftlerde
- Pipeline Overhead = T(kapılı) − T(baz). T duvar saati süresidir; kuyruk süresi hariç tutulur ve ayrıca raporlanır.
- Relative Latency Increase = (T(kapılı) − T(baz))/T(baz) × %100

**"FPRR":** Taranan literatürde standart bir metrik olarak görülmedi ve anlamı belirsizdir (reduction rate mi, rate ratio mı?). Bunun yerine **ΔFPR = FPR(custom) − FPR(default)** ve gerekirse **FPR oranı** kullanılmalı, tanım açıkça verilmelidir.

---

## 20. DevSecOps Pipeline Modeli

| Aşama | Güven sınırı / yüzey | Kontrol | Olası bypass |
|---|---|---|---|
| PR (fork) | **Ana sınır:** güvenilmeyen kod | `pull_request` (salt okunur, sır yok) | `pull_request_target` ile head checkout (PPE); PR başlığı/gövdesi üzerinden injection (ARGUS) |
| Unit tests | PR kodu yürütülür | Sırsız ortam | Exfiltration |
| SAST | Kural tedariki | Sürüm pinleme; SARIF | Eksik kaynak modeli (*katkının yeri*) |
| SCA / Secrets | Lockfile, git geçmişi | OSV-Scanner/Trivy; Gitleaks (tam geçmiş) | Dinamik import; kodlanmış sırlar |
| IaC/PaC | wrangler.jsonc | OPA/Rego ile binding ve route politikaları | Checkov'un Wrangler desteği doğrulanmadı |
| Custom rules | Kaynak modelleri | CodeQL `sourceModel`; Semgrep/Opengrep | Modelin genellenmemesi |
| Build | Bağımlılıklar | `npm ci`; SHA ile pinlenmiş Action'lar | Mutable tag (Koishybayev vd.) |
| Preview | **İkinci sınır** | Ayrı, dar kapsamlı token; ayrı D1/R2 | Üretim binding'lerine erişim |
| API validation | Çalışan uygulama | DAST, şema, authz testleri | HTTP dışı tetikleyiciler DAST'ın dışında kalır (PureSec iddiası) |
| Production | **Üçüncü sınır** | Environment protection, onay, korumalı dal | Yönetici bypass'ı; ortak token |

**Kimlik bilgisi akışı:** GitHub secret veya OIDC → iş akışı → Wrangler → Cloudflare API → Worker ve binding'ler. Cloudflare API token'larının GitHub OIDC ile doğrudan federasyonu bu taramada doğrulanmadı. Bu durum, OIDC ile statik token karşılaştırmasının Workers için uygulanabilir olup olmadığını belirler.

---

## 21. CI/CD Güvenliği: Çekirdek mi, Bağlam mı?

| Konu | Literatür | Sınıf |
|---|---|---|
| pull_request_target, güvenilmeyen PR, workflow injection | Güçlü (Koishybayev vd.; ARGUS) | Destekleyici bağlam |
| Üçüncü taraf Action, pinleme | Güçlü | Destekleyici |
| GITHUB_TOKEN izinleri | Orta (Granite ön baskısı; Cosseter S&P 2026 yalnızca atıf listesinde görüldü) | Destekleyici |
| OIDC/WIF ile statik token karşılaştırması | Hakemli ampirik çalışma tespit edilmedi | Destekleyici |
| Önizleme izolasyonu | Tespit edilmedi | Gelecek çalışma |
| MITRE ATT&CK T1677 | Doğrulanmadı | Kullanmadan önce teyit edilmeli |

**Karar:** CI/CD güvenliği çekirdek katkı değildir. "Tehdit modeli ve kapsam dışı" bölümünde ele alınmalıdır.

---

## 22. Cloudflare Workers: Kanıt Düzeyleri

| Konu | (1) Akademik | (2) Resmî belge | (3) Güvenlik araştırması | (4) İfşa |
|---|---|---|---|---|
| V8 isolate / çok kiracılık | New Kids (arXiv 2026): isolate'ler, namespaces/seccomp\[10\] | Kiracılar "V8 isolates — not processes nor VMs" ile izole edilir; "cordons"\[38\] | Remote-Timer-as-a-Service (arXiv 2026)\[32\] | Cloudflare blogu (19 Ağu 2026): V8 Sandbox, DyPrIs, MPK; üretim ortamında "up to 12 bit/s with a 99% accuracy" sızıntı (The Hacker News'e göre 2021'deki "2 bits per minute" saldırısının 360 katı); üç yılda aktif istismar göstergesi bulunmadı |
| Binding'ler, Cron, Wrangler, API token | Tespit edilmedi | Var (bu taramada ayrıntılı incelenmedi) | Tespit edilmedi | Tespit edilmedi |
| Hono/Workers için SAST desteği | Tespit edilmedi | N/A | CodeQL ve Semgrep belgelerinde yok | N/A |

İzolasyon bulguları RQ'larla doğrudan ilgili değildir; yalnızca tehdit modeli bağlamını oluşturur.

---

## 23. Tekrarlanabilirlik

```
/corpus/{cwe}/{pair-id}/{http-express,http-hono,queue,cron,r2,webhook,clean}/
/corpus/metadata.csv   /oracles/ (Miniflare exploit testleri)
/rules/{codeql-models,semgrep,opengrep,rego}/{dev,heldout}/
/tools/Dockerfile (digest-pinned)   /.github/workflows/ (SHA-pinned)
/results/{raw-sarif,labels}/   /analysis/ (renv/uv lock)
```

- **Sürüm kilidi:** `versions.lock` dosyası CodeQL CLI ve query pack sürümlerini, Semgrep/Opengrep sürümlerini ve kural commit hash'lerini içerir. CodeQL modelleri hızla değiştiği için bu kritik önemdedir.
- **Ölçüm kaydı:** Sabit seed kullanılır; tekrar sayısı ve runner tipi kaydedilir.
- **Held-out koruması:** Held-out kümesi kural dondurma commit'inden sonra açılır. Önceden hash taahhüdü yapılır.
- **Arşivleme ve lisans:** Zenodo DOI alınır. CloudFlow (10.5281/zenodo.15613797) ve SecBench.js (10.5281/zenodo.7554330) emsal olarak alınabilir.\[39\]\[40\] Kod için MIT/Apache, veri için CC-BY lisansı önerilir.
- **Rozetler:** ACM/USENIX "Available / Functional / Reproduced" rozetleri hedeflenir. CloudFlow, USENIX Security '25 artefakt değerlendirmesinden geçmiştir.\[41\]
- **Raporlama:** Zaman aşımına uğrayan taramalar ayrıca raporlanır. SARIF→TP/FP eşleme betiği yayımlanır.

---

## Recommendations

1. Başlığı "kaynak modeli kapsamı" çerçevesine taşıyın; 1 numaralı alternatif başlığı kullanın.
2. Üç kollu tasarım zorunludur. Pozitif kontrol olmadan RQ2 yorumlanamaz.
3. Hipotezi ikiye bölün:
   - **H2a:** Olay kaynakları, modellenmiş HTTP'ye göre daha düşük oranda tespit edilir.
   - **H2b:** Hono HTTP, modellenmiş HTTP'ye göre daha düşük oranda tespit edilir (çerçeve etkisi).
4. RQ3 için CloudFlow yaklaşımını wrangler.jsonc'e uyarlayın. CodeQL `sourceModel` ve Semgrep/Opengrep kurallarını dondurun, ardından held-out kümede test edin.
5. Gitleaks, Trivy, OSV-Scanner ve Checkov'u yalnızca RQ4 ve bağlam için kullanın. Bu araçları RQ2'ye dâhil etmek kategori hatası olur.
6. Tez öncesinde şunları birincil kaynaklardan doğrulayın: DVSA sürümü, OWASP Serverless Top 10, MITRE T1677, Checkov/KICS'in Wrangler desteği, Cloudflare GitHub OIDC desteği.

## Caveats

- Tarama sınırlı bir arama bütçesiyle web araması ve atıf izleme üzerinden yapıldı. Sorgular veri tabanlarında sistematik olarak çalıştırılmadı. "Tespit edilmedi" ifadeleri bu sınırlılıkla okunmalıdır.
- SymFlow ve bazı arXiv çalışmalarında yazar listesi veya hakem durumu tam doğrulanmadı; tabloda buna göre işaretlendi.
- CodeQL ve Semgrep bulguları gri literatüre dayanır. Bir çerçevenin listede olmaması, kısmi bir modelin var olmadığını kesin olarak kanıtlamaz; bu bir pilot deneyle test edilmelidir. CodeQL 2.26.2–2.27.1 sürüm notları incelenmedi.
- Spectre sızıntı hızı (12 bit/s, %99 doğruluk) birincil kaynak olan Cloudflare blogunda ("A revisit of remote Spectre attacks on Cloudflare Workers", 19 Ağu 2026) yer alır. Ön baskının yazar künyesi ise ikincil bir kaynaktan alınmıştır ve arXiv sayfasından doğrulanmalıdır.
- Kullanıcının e-posta hesabında konuyla ilgili bir yazışma bulunamadı.

## Sources

1. <https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf>
2. [Supported languages and frameworks — CodeQL](https://codeql.github.com/docs/codeql-overview/supported-languages-and-frameworks/)
3. <https://semgrep.dev/docs/languages/javascript>
4. [Towards Inter-service Data Flow Analysis of Serverless Applications - Royal Holloway Research Portal](https://pure.royalholloway.ac.uk/en/publications/towards-inter-service-data-flow-analysis-of-serverless-applicatio/)
5. [LCTES 2026 – Preliminary Table of Contents](https://www.conference-publishing.com/toc/PLDIWS26LCTES/noabs)
6. [Customizing library models for Java and Kotlin — CodeQL](https://codeql.github.com/docs/codeql-language-guides/customizing-library-models-for-java-and-kotlin/)
7. [\[Remote\] Comparison and Evaluation on Static Application Security Testing (SAST) Tools for Java (ESEC/FSE 2023 - Research Papers) - ESEC/FSE 2023](https://2023.esec-fse.org/details/fse-2023-research-papers/21/-Remote-Comparison-and-Evaluation-on-Static-Application-Security-Testing-SAST-Tool)
8. [Study of JavaScript Static Analysis Tools for Vulnerability Detection in Node.js Packages | IEEE Journals & Magazine | IEEE Xplore](https://ieeexplore.ieee.org/document/10168679/)
9. [Semgrep∗ : Improving the Limited Performance of Static Application Security Testing (SAST) Tools - Lancaster EPrints](https://eprints.lancs.ac.uk/id/eprint/230340/)
10. [New Kids: An Architecture and Performance Investigation of Second-Generation Serverless Platforms](https://arxiv.org/pdf/2604.15916)
11. [A revisit of remote Spectre attacks on Cloudflare Workers | Cloudflare Blog](https://blog.cloudflare.com/revisiting-spectre-attacks-on-workers/)
12. [\[1912.03584\] Formalizing Event-Driven Behavior of Serverless Applications](https://ar5iv.labs.arxiv.org/html/1912.03584)
13. [\[PDF\] Static Call Graph Construction in AWS Lambda Serverless Applications | Semantic Scholar](https://www.semanticscholar.org/paper/Static-Call-Graph-Construction-in-AWS-Lambda-Obetz-Patterson/10d30ef0f615b2a2be13d90d7a04f86705d99be8)
14. [Formalizing Event-Driven Behavior of Serverless Applications](https://arxiv.org/pdf/1912.03584)
15. [GitHub - puresec/sas-top-10: Serverless Architectures Security Top 10 Guide · GitHub](https://github.com/puresec/sas-top-10)
16. [iris: llm-assisted static analysis for detecting security ...](https://arxiv.org/pdf/2405.17238)
17. [Multi-Event Triggers for Serverless Computing](https://arxiv.org/html/2505.21199v2)
18. [Why SAST false positives are inevitable | OpenText Community](https://community.opentext.com/cybersec/b/cybersecurity-blog/posts/why-sast-false-positives-are-inevitable)
19. [SAGA: Detecting Security Vulnerabilities Using Static Aspect Analysis](https://arxiv.org/pdf/2601.15154)
20. [FaaSGuard: Secure CI/CD for Serverless Applications – An OpenFaaS Case Study](https://arxiv.org/pdf/2509.04328)
21. [FaaSGuard: Secure CI/CD for Serverless Applications – An OpenFaaS Case Study | IEEE Conference Publication | IEEE Xplore](https://ieeexplore.ieee.org/document/11190185/)
22. [(PDF) Study of JavaScript Static Analysis Tools for Vulnerability Detection in Node.js Packages](https://www.researchgate.net/publication/372017111_Study_of_JavaScript_Static_Analysis_Tools_for_Vulnerability_Detection_in_Nodejs_Packages)
23. [Study of JavaScript Static Analysis Tools for Vulnerability ...](https://arxiv.org/pdf/2301.05097)
24. [Challenges and solutions when adopting DevSecOps: : A systematic review: Information and Software Technology: Vol 141, No C](https://dl.acm.org/doi/abs/10.1016/j.infsof.2021.106700)
25. [Serverless computing: a security perspective | Zenodo](https://zenodo.org/records/10079577)
26. [OpenLambdaVerse: A Dataset and Analysis of Open-Source Serverless Applications](https://arxiv.org/pdf/2508.01492)
27. [Towards Inter-Service Data Flow Analysis of Serverless Applications | IEEE Conference Publication | IEEE Xplore](https://ieeexplore.ieee.org/document/10589827/;jsessionid=A95147F5E8896ACAADFCCE6B839EC81F)
28. [SymFlow: Event-Chain-Aware Symbolic Execution for Serverless Sensitive Data Flow Detection | Proceedings of the 27th ACM SIGPLAN/SIGBED International Conference on Languages, Compilers, and Tools for Embedded Systems](https://doi.org/10.1145/3814943.3816168)
29. [Static Analysis of Event-Driven Node.js JavaScript Applications (SPLASH 2015 - OOPSLA) - SPLASH 2015](https://2015.splashcon.org/details/oopsla2015/2/Static-Analysis-of-Event-Driven-Node-js-JavaScript-Applications)
30. [SECBENCH.JS: An Executable Security Benchmark Suite for Server-Side JavaScript](https://software-lab.org/publications/icse2023_SecBenchJS.pdf)
31. [GitHub - purs3lab/Argus · GitHub](https://github.com/purs3lab/Argus)
32. [Remote-Timer-as-a-Service: Efficient Microarchitectural Leakage in the Cloud with Remote Timers](https://arxiv.org/html/2608.17043)
33. [Mitigating Spectre and Other Security Threats: The Cloudflare Workers Security Model](https://blog.cloudflare.com/mitigating-spectre-and-other-security-threats-the-cloudflare-workers-security-model/)
34. [CodeQL 2.25.4 adds Swift 6.3.1 support, improvements to C# and Java, and more - GitHub Changelog](https://github.blog/changelog/2026-05-12-codeql-2-25-4-adds-swift-6-3-1-support-improvements-to-c-and-java-and-more/)
35. [Customizing Library Models for JavaScript — CodeQL](https://codeql.github.com/docs/codeql-language-guides/customizing-library-models-for-javascript/)
36. [SecBench.js: An Executable Security Benchmark Suite for Server-Side JavaScript | Proceedings of the 45th International Conference on Software Engineering](https://dl.acm.org/doi/10.1109/ICSE48619.2023.00096)
37. [Cloudflare Workers - Hono](https://hono.dev/docs/getting-started/cloudflare-workers)
38. [cloudflare-docs/src/content/docs/workers/reference/security-model.mdx at production · cloudflare/cloudflare-docs](https://github.com/cloudflare/cloudflare-docs/blob/production/src/content/docs/workers/reference/security-model.mdx)
39. [CloudFlow Framework and CloudBench Suite | Zenodo](https://zenodo.org/records/15613797)
40. [SecBench.js: An Executable Security Benchmark Suite for Server-Side JavaScript (Paper Artifact) | Zenodo](https://zenodo.org/records/7554330)
41. [GitHub - giusepperaffa/cloudflow: Framework to identify security-sensitive data flows in serverless applications](https://github.com/giusepperaffa/cloudflow)
