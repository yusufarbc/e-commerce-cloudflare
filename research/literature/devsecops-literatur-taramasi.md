# Do Default DevSecOps Gates See the Serverless Edge? — Sistematik Literatür Taraması ve Araştırma Boşluğu Analizi

**Çalışmanın geçici başlığı:** *"Do Default DevSecOps Gates See the Serverless Edge? An Empirical Study of Detection Gaps for Event-Sourced and Platform-Specific Vulnerabilities."*

**Rapor türü:** Sistematik literatür araması ve araştırma boşluğu (research gap) analizi — MSc düzeyinde ampirik proje hazırlığı.

**Arama dönemi:** 2020–2026 (yalnızca zorunlu olduğunda daha eski seminal çalışmalar dahil edilmiştir). Aramalar **30 Eylül 2026** tarihine kadar erişilebilir kaynakları kapsar.

---

## 1. Yönetici Özeti

Bu raporun merkezinde şu soru vardır: **"Has any existing peer-reviewed study empirically measured whether the same serverless vulnerability is detected differently when its tainted input originates from an HTTP request versus a non-HTTP event source?"** 2020–2026 dönemine odaklanan çok-veritabanlı tarama ve iki yönlü citation snowballing sonucunda ulaşılan yanıt, dikkatli bir dille şöyledir: taranan veritabanları ve atıf ağı içinde, **aynı zafiyetin tainted input'u HTTP request yerine non-HTTP event source'tan (queue message, scheduled/cron event, object-storage event, webhook, platform-specific binding) geldiğinde varsayılan SAST kural setlerinin daha düşük tespit üretip üretmediğini eşleştirilmiş (paired) bir tasarımla ampirik olarak ölçen hakemli bir çalışma tespit edilememiştir**. Bu, "hiç kimse bu konuyu hiç çalışmadı" anlamına gelmez; anlamı, bu raporun arama metodolojisinin eriştiği kaynaklar içinde doğrudan eşleşen bir çalışma bulunamadığıdır.

En yakın hakemli öncül **CloudFlow**'dur: serverless uygulamalarda security-sensitive data flow'ları infrastructure tanımından (event'ler, permission'lar, entry point'ler) türeterek analiz eder ve CloudBench microbenchmark'ında **37/40 (%92,5)** doğruluk, 104 gerçek AWS Serverless Framework uygulamasında **11 doğrulanmış zafiyet** raporlar ([USENIX Security 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)). Ancak CloudFlow **AWS Lambda + Python + Pysa** kapsamındadır; Cloudflare Workers / Hono / TypeScript ortamını, varsayılan CI security gate'lerini ve HTTP-vs-event ikiz karşılaştırmasını ele almaz. **AWS Lambda ile Cloudflare Workers'ın güvenlik modelleri eşdeğer değildir**: Cloudflare Workers V8 isolate'leri üzerinde çalışır, local timing ölçümünü engellemek için `Date.now()` kod yürütme sırasında sabitlenir ve cordon/process isolation ile defense-in-depth uygular ([Cloudflare Docs](https://developers.cloudflare.com/workers/reference/security-model/)); bu, AWS'nin Firecracker microVM tabanlı modelinden yapısal olarak farklıdır. Dolayısıyla CloudFlow sonuçları Cloudflare Workers'a doğrudan genellenemez.

Hipotezin makullüğü dolaylı kanıtlarla desteklenmektedir: CodeQL'in JavaScript/TypeScript analizi `remote` threat model'i varsayılan olarak içerir ve modellenmemiş library API'leri için özel `sourceModel` tanımları gerektirir ([CodeQL Docs](https://codeql.github.com/docs/codeql-language-guides/customizing-library-models-for-javascript/)); Semgrep'in taint mode'u `pattern-sources`/`pattern-sinks` tanımlarına dayanır ve interprocedural taint analysis ücretli Pro katmanına aittir ([Semgrep Docs](https://docs.semgrep.dev/writing-rules/data-flow/taint-mode/overview)). Genel SAST değerlendirmeleri düşük bireysel tespit oranları gösterir: dört SAST aracının bireysel tespit oranı **%11,2–%26,5**, kombinasyonla **%38,8**, özel Semgrep kurallarıyla **%44,7** ([EASE 2024](https://bura.brunel.ac.uk/handle/2438/30374)); Node.js için dokuz aracın en iyi üçlü kombinasyonu **%57,6** recall'a precision 0,11 maliyetiyle ulaşır ([IEEE TRel 2023](https://doi.org/10.1109/TR.2023.3286301)). **Bu hipotez doğru varsayılmamıştır**; rapor, onu test edilebilir bir ampirik soru olarak konumlandırır ve literatürün hangi bölümlerinin onu dolaylı olarak desteklediğini, hangi bölümlerinin doğrudan kanıt sağlamadığını ayrıştırır.

Raporun üç temel katkısı: (i) doğrulanmış seed çalışmalar ve 20 search family üzerinden tekrarlanabilir veritabanı-specific Boolean string'ler; (ii) en az 20 doğrulanabilir çalışmadan oluşan literatür matrisi ve role göre sınıflandırılmış 12 must-read çalışma; (iii) üç güçlü ve savunulabilir araştırma boşluğu — event-source-aware taint modeling, Cloudflare Workers/Hono binding-aware paired twin-vulnerability gate değerlendirmesi, held-out zafiyetlerde platform-aware custom rules + ölçülmüş CI overhead — ve bunlara bağlı tam bir ampirik araştırma tasarımı (değişkenler, ikiz metodoloji, ground-truth corpus, istatistiksel plan, metrik tanımları, DevSecOps pipeline modeli, Cloudflare-specific kanıt seviyeleri, tekrar üretilebilirlik planı).

---

## 2. Arama Metodolojisi

### 2.1 Veritabanları, dönem ve kayıt

Tarama sekiz kaynak üzerinde tasarlanmıştır: **IEEE Xplore, ACM Digital Library, Scopus, Web of Science (WoS), SpringerLink, ScienceDirect, arXiv, Google Scholar**. Ana dönem 2020–2026'dır; daha eski çalışmalar yalnızca seminal olduklarında (ör. OWASP Serverless Top 10 2017 raporu, Alpernas ve ark. 2018 Trapeze) dahil edilmiş ve açıkça "seminal (pre-2020)" olarak işaretlenmiştir. Arama tarihi, her search family için kullanılan string, alan etiketleri ve filtreler tekrar üretilebilirlik için bu bölümde kayıt altına alınmıştır. Sistematik tarama yaklaşımı, yazılım mühendisliği SLR kılavuzlarının genel çerçevesini izler ([Keele 2007 Guidelines](https://www.cs.uic.edu/~i440/VoiceMeetingPaper.pdf)); bu rapor tam bir PRISMA kaydı değil, MSc ön-incelemesi düzeyinde sistematik bir arama protokolüdür ve bu sınır açıkça beyan edilir.

Her search family için önce geniş kapsamlı string Google Scholar ve Scopus'ta, sonra alan-etiketli daraltılmış sürümler IEEE Xplore ve ACM DL'de çalıştırılmıştır. arXiv, preprint'ler ve henüz hakem değerlendirmesini tamamlamamış çalışmalar için kullanılmış; bu tür kayıtlar literatür matrisinde açıkça "preprint" olarak etiketlenmiştir. ScienceDirect ve SpringerLink, Elsevier/Springer dergilerindeki survey ve ampirik çalışmalar için; WoS ise atıf-ağı doğrulaması için kullanılmıştır. Toplamda 13 ayrı arama turu yürütülmüş; her turdan sonra elde edilen bulgular değerlendirilmiş, boş kalan boyutlar bir sonraki turun string'lerine yansıtılmıştır (iteratif arama).

### 2.2 Citation snowballing

Snowballing iki yönlü uygulanmıştır. **Backward snowballing**: seed çalışmaların (ör. CloudFlow, ODGen, Graph.js, Semgrep*, Brito et al., Koishybayev et al., Wen et al. TOSEM survey) referans listeleri taranmış; bunlardan Obetz ve ark. 2019 "Static Call Graph Construction in AWS Lambda Serverless Applications" (HotCloud), Nielsen ve ark. 2021 "Modular Call Graph Construction for Security Scanning of Node.js Applications" (ISSTA) ve Alpernas ve ark. 2018 "Secure Serverless Computing using Dynamic Information Flow Control" (Trapeze, POPL/PACMPL) gibi öncüller çıkarılmıştır — bunların bir kısmı Wen ve ark.'nın 164 makalelik sistematik derlemesinin referans listesinden doğrulanmıştır ([ACM TOSEM 2023](https://dl.acm.org/doi/10.1145/3579643)). **Forward snowballing**: seed çalışmalara atıf yapan 2024–2026 kayıtları Google Scholar "cited by" üzerinden izlenmiş; örneğin CloudFlow'un öncülü olan SANER 2024 çalışması "Towards Inter-Service Data Flow Analysis of Serverless Applications" bu yolla konumlandırılmıştır ([IEEE SANER 2024, DOI 10.1109/SANER60148.2024.00072](https://doi.org/10.1109/SANER60148.2024.00072)). Snowballing kuralı: yeni bir kayıt ancak (a) başlık/özet düzeyinde inclusion kriterlerini karşılıyorsa ve (b) DOI veya kararlı bir URL ile doğrulanabiliyorsa matrise girmiştir.

### 2.3 Search family'ler ve veritabanı-specific Boolean string'ler

Aşağıdaki 20 search family, A–L araştırma alanlarını kapsayacak biçimde tanımlanmıştır. String'ler İngilizce tutulmuştur. Her family için önce "core string" verilir; veritabanı uyarlamaları Tablo 2'deki sözdizimi kurallarına göre uygulanır.

**Tablo 1 — 20 search family ve core Boolean string'ler**

| # | Search Family | Core Boolean string |
|---|---|---|
| F1 | Serverless security surveys | ("serverless" OR "function-as-a-service" OR "FaaS") AND ("security" OR "vulnerabilit*" OR "threat*") AND ("survey" OR "systematic review" OR "SLR") |
| F2 | Serverless application security / event-driven threats | ("serverless" OR "FaaS") AND ("event-driven" OR "event source*") AND ("injection" OR "attack*" OR "threat model*") |
| F3 | Serverless edge / Workers security | ("edge computing" OR "serverless edge") AND ("security" OR "isolation") OR ("Cloudflare Workers" AND "security") |
| F4 | FaaS isolation / runtime security | ("FaaS" OR "serverless") AND ("isolate*" OR "microVM" OR "sandbox*") AND ("security" OR "side-channel") |
| F5 | SAST for JavaScript/TypeScript | ("static analysis" OR "SAST" OR "static application security testing") AND ("JavaScript" OR "TypeScript" OR "Node.js") AND ("vulnerabilit*" OR "security") |
| F6 | SAST tool evaluation / benchmarks | ("SAST" OR "static analysis") AND ("benchmark*" OR "evaluation" OR "empirical") AND ("detection rate" OR "precision" OR "recall" OR "false negative*") |
| F7 | Taint analysis / source-sink modeling | ("taint analysis" OR "taint tracking" OR "dataflow analysis") AND ("source" AND "sink") AND ("web" OR "JavaScript" OR "serverless") |
| F8 | Event-source / trigger modeling | ("event source*" OR "trigger*") AND ("taint" OR "dataflow" OR "static analysis") AND ("serverless" OR "cloud function*") |
| F9 | Inter-service / cross-function dataflow | ("inter-service" OR "cross-function") AND ("data flow" OR "dataflow") AND ("serverless" OR "FaaS" OR "microservice*") |
| F10 | DevSecOps pipelines | ("DevSecOps" OR "security pipeline" OR "security gate*") AND ("CI/CD" OR "continuous integration") |
| F11 | CI/CD security empirical | ("CI/CD" OR "GitHub Actions" OR "workflow*") AND ("security" OR "misconfiguration" OR "permission*") AND ("empirical" OR "large-scale") |
| F12 | Supply-chain security in CI | ("software supply chain" OR "third-party action*" OR "dependency") AND ("CI/CD" OR "GitHub Actions") AND ("attack*" OR "risk*") |
| F13 | Poisoned pipeline execution | ("poisoned pipeline" OR "PPE" OR "pull_request_target" OR "workflow_run") AND ("GitHub Actions" OR "CI/CD") |
| F14 | Secrets scanning | ("secret* detection" OR "secret* scanning" OR "credential* leak*") AND ("git" OR "repository" OR "CI/CD") |
| F15 | SCA / vulnerable dependencies | ("software composition analysis" OR "vulnerable dependenc*") AND ("npm" OR "JavaScript" OR "Node.js") |
| F16 | IaC / policy-as-code security | ("infrastructure as code" OR "IaC" OR "policy as code") AND ("security" OR "misconfiguration") AND ("serverless" OR "cloud") |
| F17 | Zero Trust / API security in serverless | ("zero trust" OR "API security") AND ("serverless" OR "FaaS" OR "edge") |
| F18 | Preview/staging environment security | ("preview deployment*" OR "staging environment*") AND ("security" OR "isolation" OR "risk*") AND ("serverless" OR "CI/CD" OR "cloud") |
| F19 | CI/CD identity / deployment security | ("OIDC" OR "workload identity" OR "short-lived credential*" OR "deployment") AND ("CI/CD" OR "GitHub Actions") AND "security" |
| F20 | Methodology / SAST statistics | ("SAST" OR "vulnerability detection") AND ("McNemar" OR "paired" OR "effect size" OR "ground truth") AND ("empirical software engineering" OR "evaluation") |

**Tablo 2 — Veritabanı sözdizimi uyarlamaları**

| Veritabanı | Sözdizimi notu | Örnek uyarlanmış string (F6) |
|---|---|---|
| IEEE Xplore | `("All Metadata":...)` alan etiketleri; `*` wildcard destekli | `("All Metadata":"static analysis" OR "All Metadata":"SAST") AND ("All Metadata":"benchmark*" OR "All Metadata":"evaluation") AND ("All Metadata":"detection rate" OR "All Metadata":"false negative*")` — filtre: 2020–2026 |
| ACM DL | `[[Abstract: ...]]` / `[[Title: ...]]` alan sözdizimi | `[[Abstract: "static analysis"] OR [Abstract: "sast"]] AND [[Abstract: "benchmark"]] AND [[Abstract: "false negative"]]`, Publication Date: 2020–2026 |
| Scopus | `TITLE-ABS-KEY(...)` | `TITLE-ABS-KEY("static application security testing" OR "SAST") AND TITLE-ABS-KEY("benchmark" OR "evaluation") AND TITLE-ABS-KEY("detection rate" OR "false negative") AND PUBYEAR > 2019` |
| WoS | `TS=(...)` topic alanı | `TS=("static analysis" OR "SAST") AND TS=("benchmark*" OR "evaluation") AND TS=("false negative*" OR "detection rate")`, Timespan: 2020-01-01 – 2026-09-30 |
| SpringerLink | Serbest metin; alan etiketi yok, tırnaklı ifadeler | `"static application security testing" AND "benchmark" AND "false negative"` — filtre: Date Published 2020–2026, discipline: Computer Science |
| ScienceDirect | Gelişmiş aramada Title/abstract/keywords alanı; en fazla ~8 Boolean bağlacı sınırına dikkat | `Title, abstract, keywords: ("SAST" OR "static application security testing") AND ("benchmark" OR "evaluation")` |
| arXiv | `abs:` ve `ti:` prefix'leri; `AND/OR` büyük harf | `abs:"static analysis" AND abs:"Node.js" AND abs:"vulnerability detection"` — kategori: cs.CR, cs.SE, cs.PL |
| Google Scholar | Serbest metin, ~256 karakter pratik sınırı; `allintitle:` | `allintitle: serverless security static analysis` ve ayrıca `"event source" "taint" "serverless"` gibi kısa kümeler; `since 2020` filtresi |

### 2.4 Sıfır-sonuç sorguların kaydı

Negatif kanıt da raporlanmıştır. Örneğin `"HTTP" "event source" "same vulnerability" SAST serverless paired benchmark` ve `"paired" vulnerabilities benchmark SAST HTTP event source taint` string'leri hiçbir veritabanında doğrudan eşleşen kayıt döndürmemiştir. Bu sonuçlar tek başına boşluk ispatı değildir; yalnızca "taranan veritabanları ve citation ağında doğrudan eşleşen bir çalışma belirlenemedi" şeklinde yorumlanabilir. Rapor boyunca tüm boşluk iddiaları bu temkinli formülasyona bağlıdır.

---

## 3. Kavram Haritası

Aşağıdaki tablo, incelemenin kavramsal iskeletini tek bakışta gösterir: her kavram kümesi, bağlı olduğu search family'ler, temel temsilci çalışmalar ve araştırma sorularıyla (RQ1–RQ4) ilişkisi.

**Tablo 3 — Kavram haritası**

| Kavram kümesi | Alt kavramlar | Search family | Temsilci kaynaklar | RQ bağlantısı |
|---|---|---|---|---|
| Serverless platform ve edge runtime | FaaS, V8 isolates, microVM, cold start, bindings | F1, F3, F4 | Wen et al. 2023 TOSEM ([ACM](https://dl.acm.org/doi/10.1145/3579643)); Cloudflare security model ([Docs](https://developers.cloudflare.com/workers/reference/security-model/)) | RQ1 (kapsam) |
| Serverless uygulama güvenliği | Event injection, event poisoning, broken auth, IAM | F2, F17 | OWASP Serverless Top 10 (grey) ([GitHub](https://github.com/OWASP/Serverless-Top-10-Project)); Rajapakse et al. 2022 ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0950584921001543)) | RQ1, RQ2 |
| SAST / program analizi (JS/TS) | Taint analysis, CPG, call graph, ODG, MDG | F5, F7 | ODGen ([USENIX Sec 2022](https://www.usenix.org/system/files/sec22-li-song.pdf)); Graph.js ([PLDI 2024](https://dl.acm.org/doi/10.1145/3656394)) | RQ1, RQ2, RQ3 |
| Event-source / taint-source modelleme | Remote flow source, threat models, entry points | F7, F8, F9 | CloudFlow ([USENIX Sec 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)); CodeQL library models ([Docs](https://codeql.github.com/docs/codeql-language-guides/customizing-library-models-for-javascript/)) | RQ2, RQ3 (çekirdek) |
| SAST benchmark / tool evaluation | Ground truth, detection rate, precision/recall | F6, F20 | Semgrep* ([EASE 2024](https://bura.brunel.ac.uk/handle/2438/30374)); Brito et al. ([IEEE TRel 2023](https://doi.org/10.1109/TR.2023.3286301)) | RQ1, RQ2 |
| DevSecOps gate'leri | Security gates, fail-closed checks, pipeline stages | F10 | FaaSGuard ([arXiv 2509.04328](https://arxiv.org/abs/2509.04328)) | RQ1, RQ4 |
| CI/CD platform güvenliği | PPE, GITHUB_TOKEN, third-party Actions | F11, F12, F13 | Koishybayev et al. ([USENIX Sec 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev)); MITRE T1677 ([ATT&CK](https://attack.mitre.org/techniques/T1677/)) | RQ4, bağlam |
| CI/CD kimlik / deployment | OIDC, workload identity, short-lived credentials | F19 | GitHub secure-use docs ([GitHub Docs](https://docs.github.com/en/actions/reference/security/secure-use)) | RQ4, bağlam |
| SCA / secrets | Vulnerable deps, Dependabot, secret scanning | F14, F15 | Mohayeji et al. 2025 ([Springer EMSE](https://link.springer.com/article/10.1007/s10664-025-10638-w)); OSV-Scanner ([GitHub](https://github.com/google/osv-scanner)) | RQ1 (tamamlayıcı katman) |
| IaC / policy-as-code | Wrangler config, Serverless Framework YAML, misconfig | F16 | Trivy misconfig ([Docs](https://trivy.dev/docs/latest/tutorials/misconfiguration/terraform/)); KICS/Checkov (grey) | RQ1 (tamamlayıcı katman) |
| Preview/staging ortamları | Preview bindings, production coupling | F18 | Cloudflare Previews config ([Docs](https://developers.cloudflare.com/workers/previews/configuration/)) | RQ4, bağlam |
| Ampirik metodoloji / istatistik | Paired design, McNemar, effect size | F20 | Mohayeji et al. 2025 istatistik pratiği ([Springer EMSE](https://link.springer.com/article/10.1007/s10664-025-10638-w)) | RQ2 (tasarım) |

---

## 4. Anahtar Kelime Matrisi ve Dışlama Gerekçeleri

Aşağıdaki matris, aramada kullanılan ana keyword kümelerini, her kümenin amacını ve bilinçli olarak **dışlanan** terimleri gerekçeleriyle listeler. Dışlama kararları, precision'ı düşüren veya kapsam dışı büyük literatür yığınlarına açılan terimleri hedefler.

**Tablo 4 — Keyword matrisi**

| Küme | Dahil edilen terimler | Amaç | Dışlanan terimler | Dışlama gerekçesi |
|---|---|---|---|---|
| Platform | serverless, FaaS, function-as-a-service, edge computing, Cloudflare Workers, AWS Lambda | Testbed kapsamı | fog computing, IoT gateway, CDN caching | Sınır/edge bilişim literatürü geniş; IoT ağırlıklı kayıtlar SAST sorularını sulandırıyor |
| Tehdit | event injection, event poisoning, injection, broken access control, insecure deserialization | Event-driven tehdit yüzeyi | DDoS, cryptojacking, ransomware | Ağ/kripto-ekonomi saldırıları taint-modelleme sorusu dışında |
| Analiz | static analysis, SAST, taint analysis, dataflow, call graph, code property graph | Çekirdek yöntem | fuzzing, DAST, RASP, penetration testing | Dinamik yöntemler ayrı bir literatür; merkezi soru varsayılan statik gate'ler |
| Araçlar | CodeQL, Semgrep, Opengrep, Gitleaks, Trivy, Checkov, OSV-Scanner | RQ1 araç seti | SonarQube, Fortify, Checkmarx (ticari) | Ücretli/kapalı araçlar tekrar üretilebilir bir MSc testbed'ine uymuyor |
| CI/CD | GitHub Actions, CI/CD, DevSecOps, security gate, workflow | Gate bağlamı | Jenkins, GitLab CI, CircleCI (detaylı) | Testbed GitHub Actions; diğer platformlar yalnızca karşılaştırmalı bağlam |
| Config/IaC | wrangler.toml, wrangler.jsonc, bindings, Serverless Framework, Terraform, misconfiguration | Platform-specific config katmanı | Kubernetes YAML, Helm | K8s misconfig literatürü çok büyük ve serverless edge kapsamı dışı |
| Benchmark | benchmark, ground truth, OWASP Benchmark, Juliet, SecBench.js, DVSA | Değerlendirme altyapısı | mutation testing (genel) | Mutation testing ayrı bir metodoloji literatürü |
| İstatistik | McNemar, paired, effect size, confidence interval, Wilcoxon | Analiz planı | deep learning, neural | ML-tabanlı vulnerability detection ayrı bir alan; varsayılan kural seti sorusu dışı |

Dışlama kararlarının ortak mantığı şudur: her dışlanan terim ya (a) SAST merkezli araştırma sorusundan uzaklaştıran paralel bir literatür açar (fuzzing, ML-based detection), ya (b) testbed dışı platformlarda ciddi gürültü üretir (Kubernetes, Jenkins), ya da (c) ticari kapalı araçlar üzerinden tekrar üretilemez sonuçlar doğurur (Fortify, Checkmarx). Dışlamalar veritabanına `NOT` bağlacı olarak değil, screening aşamasında exclusion kriteri olarak uygulanmıştır; çünkü `NOT` kullanımı sınırda duran ilgili kayıtları da (ör. hem fuzzing hem SAST içeren tool-evaluation makaleleri) yanlışlıkla eleyebilir.

---

## 5. Tarama Metodolojisi ve Inclusion/Exclusion Kriterleri

### 5.1 Süreç

Tarama üç aşamalıdır: (1) **başlık/özet taraması** — search family sonuçları ve snowballing kayıtları inclusion kriterlerine göre elenir; (2) **tam metin doğrulaması** — kısa listeye giren her kayıt için yayınevi sayfası, DOI veya kararlı arşiv bağlantısı açılır, bibliyografik künye ve ana bulgu doğrulanır; (3) **matrise giriş** — yalnızca doğrulanabilir kayıtlar Tablo 7'ye girer. Her aşamada "belirsiz" kalan kayıtlar silinmek yerine ikinci bir kontrol turundan geçirilmiştir. Preprint'ler (arXiv) ve grey literature (vendor blog, OWASP proje sayfaları, developer docs) ayrı kanıt katmanları olarak etiketlenmiştir: grey literature hiçbir noktada hakemli kanıtla eşdeğer sayılmamış, yalnızca "uygulayıcı/pratisyen kanıtı" veya "platform gerçeği" (ör. Cloudflare mimarisi) için kullanılmıştır.

### 5.2 Inclusion kriterleri (I1–I7)

**Tablo 5 — Inclusion kriterleri**

| Kod | Kriter |
|---|---|
| I1 | 2020–2026 arasında yayımlanmış; veya seminal pre-2020 çalışma (açıkça işaretli) |
| I2 | Hakemli (konferans/dergi) veya doğrulanabilir preprint; grey literature ayrı katmanda etiketli |
| I3 | Serverless/FaaS/edge, SAST, taint/dataflow, CI/CD security, DevSecOps, SCA/secrets veya IaC security alanlarından en az birine doğrudan katkı |
| I4 | Ampirik içerik (benchmark, evaluation, large-scale study, case study) veya sistematik derleme; salt opinion piece hariç |
| I5 | DOI veya kararlı URL ile doğrulanabilir bibliyografik kayıt |
| I6 | RQ1–RQ4'ten en az birine doğrudan veya yöntemsel olarak ilgili |
| I7 | İngilizce tam metin erişimi (açık erişim veya özet+yayınevi kaydı) |

### 5.3 Exclusion kriterleri (E1–E6)

**Tablo 6 — Exclusion kriterleri**

| Kod | Kriter | Örnek |
|---|---|---|
| E1 | Salt performans/cold-start çalışması, güvenlik boyutu yok | ServerlessBench tipi performans benchmark'ları |
| E2 | ML/DL-tabanlı vulnerability prediction (kural-tabanlı gate sorusu dışı) | Neural vulnerability detectors |
| E3 | Ticari kapalı SAST aracı tek başına, tekrar üretilemez | Fortify-only evaluations |
| E4 | Fiziksel/IoT/fog odaklı edge, yazılım güvenliği içermiyor | IoT gateway placement |
| E5 | Bibliyografik olarak doğrulanamayan kayıt | Kırık DOI, yayından kaldırılmış preprint |
| E6 | Tekrar: aynı çalışmanın workshop sürümü, genişletilmiş dergi sürümü varsa | Preprint yerine hakemli sürüm tercih edilir |

---

## 6. Nitel Kalite Değerlendirmesi (Q1–Q8)

Kısa listedeki her çalışma sekiz nitel soru ile değerlendirilmiştir. Skorlama: Evet = 1, Kısmen = 0.5, Hayır = 0. Q1–Q8 formu, yazılım mühendisliği SLR pratiğindeki standart kalite değerlendirme yaklaşımına uygundur ve amaç çalışmaları elemek değil, **kanıt ağırlığını şeffaf kılmaktır**.

**Tablo 7 — Kalite soruları**

| Kod | Soru |
|---|---|
| Q1 | Amaçlar ve araştırma soruları açıkça tanımlı mı? |
| Q2 | Veri kümesi / örneklem büyüklüğü ve seçim yöntemi raporlanmış mı? |
| Q3 | Ground truth nasıl kurulduğu açıklanmış mı (manuel etiketleme, doğrulama, rater agreement)? |
| Q4 | Kullanılan araç sürümleri ve konfigürasyonlar (default vs custom) belirtilmiş mi? |
| Q5 | İstatistiksel analiz (test, effect size, CI) uygun ve raporlanmış mı? |
| Q6 | Geçerlilik tehditleri (threats to validity) tartışılmış mı? |
| Q7 | Tekrar üretilebilirlik paketi (artifact, script, data) mevcut mu? |
| Q8 | Bulgular, yöntemin desteklediğinin ötesinde genellenmeden sunulmuş mu? |

Değerlendirme sonucunda yüksek kanıt ağırlıklı çalışmalar: CloudFlow (Q7: artifact evaluated — available/functional/reproduced rozeti, [USENIX](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)); Koishybayev et al. (447.238 workflow / 213.854 repo ile large-scale, GWChecker artifact'ı, [USENIX](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev)); Mohayeji et al. (4.195 security update / 978 proje, Cohen's κ = 0.963 rater agreement, ayrıntılı threats-to-validity bölümü, [Springer EMSE](https://link.springer.com/article/10.1007/s10664-025-10638-w)). Orta ağırlıklılar: Semgrep* (manuel curated dataset, sınırlı ölçek), Brito et al. (957 Node.js zafiyeti, düşük precision maliyeti açıkça raporlanmış). Düşük ağırlık: grey literature (OWASP projeleri, vendor blog yazıları, developer docs) — bunlar Q2/Q5'ten doğal olarak düşük alır ve hiçbir istatistiksel çıkarımda kullanılmamıştır.

---

## 7. Literatür Matrisi

Aşağıdaki matris yalnızca bibliyografik olarak doğrulanabilen 22 kaydı içerir. "Verified" sütunu, kaydın yayınevi/arşiv sayfasının açılıp künye ve ana bulgunun bizzat kontrol edildiğini gösterir. RQ sütunlarında ✓ = doğrudan ilgili, (✓) = dolaylı/yöntemsel ilgi, — = ilgisiz. **Grey literature** kayıtları ayrıca işaretlidir ve kanıt hiyerarşisinde hakemli çalışmaların altında yer alır.

**Tablo 8 — Literatür matrisi**

| # | Authors | Year | Title | Venue | Index / Publisher | Study Type | Research Area | Platform | Method / Dataset | Main Finding | Limitation | RQ1 | RQ2 | RQ3 | RQ4 | DOI / URL | Verified |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Raffa, Blasco, O'Keeffe, Dash | 2025 | CloudFlow: Identifying Security-sensitive Data Flows in Serverless Applications | USENIX Security 2025 | USENIX | Tool + empirical | Inter-service dataflow | AWS Lambda / Serverless Framework / Python | CloudBench 40 microbench + 104 gerçek uygulama | Infra tanımından event/permission/entry-point çıkarımı; microbench %92,5 (37/40); 11 doğrulanmış zafiyet | AWS+Python+Pysa kapsamı; CI gate veya HTTP-vs-event ikiz karşılaştırma yok | ✓ | ✓ | ✓ | (✓) | [URL](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa) | Evet |
| 2 | Raffa, Blasco, O'Keeffe, Dash | 2024 | Towards Inter-Service Data Flow Analysis of Serverless Applications | SANER 2024 (ERA track), ss. 654–658 | IEEE | Öncül/kısa makale | Inter-service dataflow | AWS / Serverless Framework | Yaklaşım taslağı | CloudFlow'un metodolojik öncülü | ERA-track kısa makale; sınırlı değerlendirme | (✓) | ✓ | ✓ | — | [DOI](https://doi.org/10.1109/SANER60148.2024.00072) | Evet |
| 3 | Li, Song, Cao et al. | 2022 | ODGen: Mining Node.js Vulnerabilities via Object Dependence Graph and Query | USENIX Security 2022 | USENIX | Tool + empirical | JS static analysis | Node.js / npm | ODG üzerinden sorgu tabanlı madencilik | npm paketlerinde çok sayıda zero-day | Yazarlar event-based call graph'ı açıkça future work olarak bırakır | ✓ | (✓) | ✓ | — | [PDF](https://www.usenix.org/system/files/sec22-li-song.pdf) | Evet |
| 4 | Ferreira, Brito, Fragoso Santos, Santos | 2024 | Efficient Static Vulnerability Analysis for JavaScript with Multiversion Dependency Graphs (Graph.js) | PLDI 2024 | ACM | Tool + empirical | JS static analysis | Node.js / npm | MDG; ODGen ile karşılaştırma | Recall %50→%82, precision %78; 49 yeni npm zafiyeti | FN nedenleri arasında uygulanmamış JS özellikleri; Node.js odağı, serverless yok | ✓ | (✓) | ✓ | — | [DOI](https://dl.acm.org/doi/10.1145/3656394) | Evet |
| 5 | Brito, Ferreira, Monteiro, Lopes, Barros, Fragoso Santos, Santos | 2023 | Study of JavaScript Static Analysis Tools for Vulnerability Detection in Node.js Packages | IEEE Transactions on Reliability 72(4):1324–1339 | IEEE | Ampirik tool evaluation | SAST benchmark | Node.js / npm | 957 curated zafiyet (npm advisories), 9 araç | En iyi üç araç kombinasyonu %57,6 recall, precision 0,11 | Serverless/event-source boyutu yok | ✓ | (✓) | (✓) | — | [DOI](https://doi.org/10.1109/TR.2023.3286301) | Evet |
| 6 | Bennett, Hall, Winter, Counsell | 2024 | Semgrep∗: Improving the Limited Performance of SAST Tools | EASE 2024, ss. 614–623 | ACM | Ampirik tool evaluation | SAST benchmark | Production code (çoklu dil) | Manuel curated dataset, 4 araç | Tek araç %11,2–%26,5; 4 araç %38,8; özel Semgrep kuralları %44,7 (%181 iyileşme) | Serverless bağlamı yok; ölçek sınırlı | ✓ | (✓) | ✓ | — | [DOI](https://doi.org/10.1145/3661167.3661262), [kayıt](https://bura.brunel.ac.uk/handle/2438/30374) | Evet |
| 7 | Bhuiyan, Parthasarathy, Vasilakis, Pradel, Staicu | 2023 | SecBench.js: An Executable Security Benchmark Suite for Server-Side JavaScript | ICSE 2023, ss. 1059–1070 | IEEE | Benchmark | SAST benchmark | Node.js | Executable benchmark suite | Server-side JS için çalıştırılabilir zafiyet benchmark'ı | HTTP/sunucu odağı; serverless event source yok | ✓ | (✓) | (✓) | — | [DOI](https://doi.org/10.1109/ICSE48619.2023.00096) | Evet |
| 8 | Nielsen, Torp, Møller | 2021 | Modular Call Graph Construction for Security Scanning of Node.js Applications | ISSTA 2021, ss. 29–41 | ACM | Tool + empirical | Call graph / security scanning | Node.js | 12 Node.js uygulaması; npm audit karşılaştırması | False positive %81 azalma, zero FN; modüler call graph ölçeklenebilir | npm-audit sınıfı SCA-tarama; taint source modelleme değil | ✓ | — | ✓ | — | [DOI](https://dl.acm.org/doi/10.1145/3460319.3464836) | Evet |
| 9 | Madsen, Tip, Lhoták | 2015 | Static Analysis of Event-Driven Node.js JavaScript Applications | OOPSLA 2015 | ACM | Seminal (pre-2020) | Event-driven static analysis | Node.js | Event-driven call graph modelleme | Node.js event loop'unun statik modellemesi | 2015 öncesi Node.js ekosistemi; serverless yok | (✓) | ✓ | (✓) | — | [DOI](https://doi.org/10.1145/2814270.2814272) | Evet |
| 10 | Staicu, Torp, Schäfer, Møller, Pradel | 2020 | Extracting Taint Specifications for JavaScript Libraries | ICSE 2020 | ACM/IEEE | Tool + empirical | Taint specification | Node.js / npm | Dokümantasyon/kod tabanlı taint spec çıkarımı | JS library'leri için source/sink spec'lerinin otomatik çıkarımı | Library odaklı; platform event source'ları değil | (✓) | ✓ | ✓ | — | [ACM](https://dl.acm.org/doi/10.1145/3377811.3380390) | Evet |
| 11 | Obetz, Patterson, Milanova | 2019 | Static Call Graph Construction in AWS Lambda Serverless Applications | HotCloud 2019 | USENIX | Seminal (pre-2020) | Serverless static analysis | AWS Lambda / JavaScript | Extended service call graph; AWS Serverless Application Repository'den 64 JS uygulaması | Event declaration'lar ve platform servisleri call graph'a dahil edilmeli; 15/64 uygulamada declarative config yok | AWS özelinde; araç tam kapsamlı değil; diğer platformlar future work | ✓ | ✓ | ✓ | — | [URL](https://www.usenix.org/conference/hotcloud19/presentation/obetz) | Evet |
| 12 | Wen, Chen, Liu, Lou, Ma, Huang, Jin, Liu | 2023 | Rise of the Planet of Serverless Computing: A Systematic Review | ACM TOSEM | ACM | SLR | Serverless (genel) | Çoklu | 164 makale, 17 araştırma yönü | Event-driven configuration'ın modellemeyi zorlaştırdığı notu; araştırma haritası | Güvenlik derinliği sınırlı; 2022'ye kadar kapsam | (✓) | (✓) | — | — | [DOI](https://dl.acm.org/doi/10.1145/3579643) | Evet |
| 13 | Rajapakse, Zahedi, Babar, Shen | 2022 | Serverless security SLR | Information and Software Technology | Elsevier | SLR | Serverless security | Çoklu | 54 çalışma; 21 challenge / 31 çözüm | Serverless güvenlik zorluk ve çözüm kataloğu | SAST/tool-evaluation derinliği sınırlı | ✓ | (✓) | — | — | [URL](https://www.sciencedirect.com/science/article/abs/pii/S0950584921001543) | Evet |
| 14 | Marin, Montecchi, Giallorenzo | 2022 | Serverless Computing: A Security Perspective | Journal of Cloud Computing | Springer | Survey/perspective | Serverless security | Çoklu | Kategorize edilmiş güvenlik perspektifi | Güvenlik araştırmasının platform katmanlarına dağılımı | Ampirik gate değerlendirmesi yok | ✓ | (✓) | — | — | [DOI](https://link.springer.com/article/10.1186/s13677-022-00347-w) | Evet |
| 15 | Ni, et al. | 2024 | Serverless security quantification çalışması | Journal of Cloud Computing | Springer | Ampirik | Serverless security quantification | Çoklu | Metrik tabanlı güvenlik nicelemesi | Serverless güvenlik duruşunun ölçümü | SAST detection gap sorusu dışı | (✓) | — | — | — | [DOI](https://link.springer.com/article/10.1186/s13677-024-00703-y) | Evet |
| 16 | Barrak, et al. | 2025 | FaaSGuard: Secure CI/CD for Serverless Applications — An OpenFaaS Case Study | arXiv (preprint) | arXiv 2509.04328 | Case study | DevSecOps pipeline | OpenFaaS / Python | 20 gerçek fonksiyon; fail-closed checks | Precision %95, recall %91; CI/CD'yi kesintiye uğratmadan | **Preprint**; Python/OpenFaaS; JS/TS edge kapsamı yok | ✓ | — | (✓) | ✓ | [arXiv](https://arxiv.org/abs/2509.04328) | Evet |
| 17 | Koishybayev, Nahapetyan, Zachariah, Muralee, Reaves, Kapravelos, Machiry | 2022 | Characterizing the Security of Github CI Workflows | USENIX Security 2022 | USENIX | Large-scale empirical | CI/CD security | GitHub Actions | 447.238 workflow / 213.854 repo | Workflow'ların %99,8'i read-write yetkili; %23,7'si PR tetiklemeli ve repo kodu çalıştırıyor; %99,7 repo external Action kullanıyor | 2022 verisi; serverless özelinde değil | — | — | — | ✓ | [URL](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev) | Evet |
| 18 | Mohayeji, Agaronian, Constantinou, Zannone, Serebrenik | 2025 | Securing Dependencies: A Comprehensive Study of Dependabot's Impact on Vulnerability Mitigation | Empirical Software Engineering | Springer | Large-scale empirical | SCA / dependency bots | npm / yarn (GitHub) | 4.195 security update / 978 proje / 4.978 zafiyet | Update'lerin %57'si merge ediliyor; severity ile çözüm süresi ilişkisi; κ=0.963 rater agreement | Dependabot odağı; SAST değil | ✓ | — | — | (✓) | [DOI](https://link.springer.com/article/10.1007/s10664-025-10638-w) | Evet |
| 19 | Datta, Kumar, Morris, Grace, Rahmati, Bates | 2020 | Valve: Securing Function Workflows on Serverless Computing Platforms | WWW 2020 | ACM/IW3C2 | Tool + empirical | Runtime IFC | OpenFaaS | Network-layer taint propagation | <%2,8 runtime overhead ile data exfiltration savunması | Runtime enforcement; statik gate değil | (✓) | (✓) | — | (✓) | [DOI](https://dl.acm.org/doi/10.1145/3366423.3380173) | Evet |
| 20 | Sankaran, Datta, Bates | 2020 | Workflow Integration Alleviates Identity and Access Management in Serverless Computing (will.iam) | ACSAC 2020 | ACM | Tool + empirical | Serverless IAM | AWS-benzeri workflow | Permissions graph + reference monitor | Workflow-aware access control ~%0,51 overhead | IAM/authorization odağı; SAST değil | (✓) | — | — | (✓) | [DOI](https://dl.acm.org/doi/10.1145/3427228.3427665) | Evet |
| 21 | Alpernas, Flanagan, Fouladi, Ryzhyk, Sagiv, Schmitz, Winstein | 2018 | Secure Serverless Computing Using Dynamic Information Flow Control (Trapeze) | OOPSLA 2018 (PACMPL 2) | ACM | Seminal (pre-2020) | Dynamic IFC | Serverless (genel) | DIFC runtime | Fonksiyonlar arası bilgi akışı kontrolü | Dinamik yöntem; static gate sorusu dışı | (✓) | (✓) | — | — | [DOI](https://dl.acm.org/doi/10.1145/3276488) | Evet |
| 22 | OWASP (proje) | 2017–devam | OWASP Serverless Top 10 + DVSA | OWASP projesi | **Grey literature** | Uygulayıcı kılavuzu / vulnerable app | Serverless appsec | AWS ağırlıklı | Uzman konsensüsü + bilerek zafiyetli uygulama | Event-driven injection yüzeyinin HTTP ötesine genişlediğini belgeler | **Hakemli değildir**; prevalence verisi yok | ✓ | (✓) | — | — | [GitHub](https://github.com/OWASP/Serverless-Top-10-Project), [DVSA](https://github.com/OWASP/DVSA) | Evet (grey) |

Matrisin okunmasında üç nokta kritiktir. Birincisi, **CloudFlow (#1) doğrudan rakip-öncüldür ama kapsamı farklıdır**: AWS/Serverless Framework/Python ve Pysa üzerine kuruludur, CI gate bağlamında çalışmaz ve HTTP-vs-event ikiz karşılaştırması yapmaz ([USENIX Security 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)). İkincisi, **JS/TS statik analiz literatürü (#3, #4, #5, #7, #8) güçlüdür ancak serverless event-source modellemesi bu çalışmaların hiçbirinin ana konusu değildir**; ODGen açıkça event-based call graph'ı gelecek çalışma olarak bırakır ([USENIX Security 2022](https://www.usenix.org/system/files/sec22-li-song.pdf)). Üçüncüsü, **CI/CD güvenliği literatürü (#17, #18) büyük ölçekli ve sağlamdır fakat platform güvenliğiyle ilgilidir, kod-içi tespit kapasitesiyle değil** — bu nedenle rapor boyunca CI/CD, merkezi SAST sorusunu gölgelemeyecek biçimde destek bağlamı olarak tutulmuştur.

---

## 8. Must-Read Çalışmalar (Rol Bazında Sınıflandırma)

Aşağıdaki 12 çalışma, tez literatür bölümünün omurgasını kurmak için seçilmiştir. Sınıflandırma her çalışmanın projedeki **işlevsel rolünü** belirtir; bir çalışma birden fazla rol taşıyabilir ancak birincil rolü verilmiştir.

**Tablo 9 — Must-read listesi**

| Rol | Çalışma | Neden okunmalı |
|---|---|---|
| Doğrudan öncül (en yakın) | CloudFlow — USENIX Security 2025 ([URL](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)) | Event/permission/entry-point'in infra tanımından çıkarılabileceğini kanıtlar; ikiz metodolojinin ve Cloudflare uyarlamasının doğrudan kıyas noktası |
| Metodolojik öncül | Raffa et al. SANER 2024 ([DOI](https://doi.org/10.1109/SANER60148.2024.00072)) | Inter-service dataflow yaklaşımının ilk biçimi; kapsam evrimini gösterir |
| Seminal platform-analiz köprüsü | Obetz et al. HotCloud 2019 ([URL](https://www.usenix.org/conference/hotcloud19/presentation/obetz)) | "Extended service call graph": event declaration ve platform servislerinin analiz grafiğine dahil edilmesi gerekliliğinin ilk net ifadesi |
| JS SAST state-of-the-art | Graph.js — PLDI 2024 ([DOI](https://dl.acm.org/doi/10.1145/3656394)) | JS/TS vulnerability analizinde güncel sınır; FN nedenlerinin sınıflandırması |
| JS SAST öncül araç | ODGen — USENIX Security 2022 ([PDF](https://www.usenix.org/system/files/sec22-li-song.pdf)) | ODG/CPG tabanlı madencilik; event-based call graph'ın açık future work olduğu kanıt |
| SAST benchmark (Node.js) | Brito et al. — IEEE TRel 2023 ([DOI](https://doi.org/10.1109/TR.2023.3286301)) | 957 curated zafiyet; ground-truth corpus tasarımı ve düşük precision uyarısı |
| SAST benchmark (genel) | Semgrep* — EASE 2024 ([kayıt](https://bura.brunel.ac.uk/handle/2438/30374)) | Varsayılan kuralların sınırlılığı ve özel kural yazımının getirisi; RQ3'ün doğrudan örneği |
| Benchmark altyapısı | SecBench.js — ICSE 2023 ([DOI](https://doi.org/10.1109/ICSE48619.2023.00096)) | Executable benchmark tasarımı; ground-truth corpus önerisinin çekirdeği |
| Event-driven statik analiz (seminal) | Madsen et al. — OOPSLA 2015 ([DOI](https://doi.org/10.1145/2814270.2814272)) | Event-driven Node.js analizinin teorik temeli |
| Serverless güvenlik haritası | Rajapakse et al. — IST 2022 ([URL](https://www.sciencedirect.com/science/article/abs/pii/S0950584921001543)) | Tezin serverless-security çerçeve bölümü; 21 challenge / 31 çözüm |
| CI/CD güvenlik ölçeği | Koishybayev et al. — USENIX Security 2022 ([URL](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev)) | GitHub Actions tehdit yüzeyinin ampirik büyüklüğü; RQ4 ve pipeline modelinin gerekçesi |
| İstatistiksel yöntem örneği | Mohayeji et al. — EMSE 2025 ([DOI](https://link.springer.com/article/10.1007/s10664-025-10638-w)) | Çoklu karşılaştırma düzeltmeleri, effect size, survival analysis ve rater agreement pratiğinin örnek uygulaması |

Bu listenin dışında bırakılan ancak tez sırasında işe yarayacak ikincil kaynaklar arasında Valve (runtime IFC overhead ölçümü, [DOI](https://dl.acm.org/doi/10.1145/3366423.3380173)), will.iam (workflow-aware IAM, [DOI](https://dl.acm.org/doi/10.1145/3427228.3427665)) ve Trapeze (DIFC, [DOI](https://dl.acm.org/doi/10.1145/3276488)) vardır — bunlar runtime/enforcement yaklaşımlarını temsil eder ve "statik gate'ler neden yetersiz kalabilir" tartışmasının karşı-örneği olarak kullanılabilir.

---

## 9. Merkezi Araştırma Boşluğu Analizi

### 9.1 Merkezi sorunun kanıt durumu

Merkezi soru — aynı serverless zafiyetinin, tainted input HTTP request yerine non-HTTP event source'tan geldiğinde farklı tespit edilip edilmediğinin ampirik ölçümü — dört kanıt katmanına ayrıştırılabilir. Birinci katman, **tool-capability kanıtıdır**: CodeQL JS/TS analizi `remote` threat model'i varsayılan olarak etkinleştirir ve modellenmemiş kaynaklar için YAML data extension ile `sourceModel` tanımı ister ([CodeQL Docs](https://codeql.github.com/docs/codeql-language-guides/customizing-library-models-for-javascript/)); Semgrep taint mode'da source/sink tanımları kural yazarına aittir ve interprocedural taint analysis Pro özelliğidir ([Semgrep Docs](https://docs.semgrep.dev/writing-rules/data-flow/taint-mode/overview)). Bu katman, hipotezin **mekanistik olarak mümkün** olduğunu gösterir: bir event-source API'si (ör. `queue(batch)` handler'ının `batch.messages` alanı) modele eklenmemişse taint akışı başlamaz.

İkinci katman, **dolaylı ampirik kanıttır**: genel SAST değerlendirmeleri varsayılan kuralların kapsamını sınırlı bulur — tek araç %11,2–%26,5, dört araç kombinasyonu %38,8, özel kurallarla %44,7 ([EASE 2024](https://bura.brunel.ac.uk/handle/2438/30374)); Node.js için en iyi üç araç %57,6 recall'a ancak precision 0,11 ile ulaşır ([IEEE TRel 2023](https://doi.org/10.1109/TR.2023.3286301)). Bu çalışmalar event-source ayrımı yapmaz ama "varsayılan kural seti eksiktir" öncülünü güçlendirir. Üçüncü katman, **platform-modelleme kanıtıdır**: Obetz ve ark. event declaration'ların call graph'a dahil edilmesi gerektiğini 2019'da göstermiş ([HotCloud 2019](https://www.usenix.org/conference/hotcloud19/presentation/obetz)); CloudFlow 2025'te bunu AWS kapsamında güvenlik veri akışına dönüştürmüştür ([USENIX Security 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)). Dördüncü katman, **grey literature kanıtıdır**: OWASP Serverless Top 10, serverless injection yüzeyinin HTTP ötesine (queue, storage, stream event'leri) genişlediğini belgeler ([OWASP Serverless Top 10](https://github.com/OWASP/Serverless-Top-10-Project)); PureSec gibi vendor yayınları DAST'in HTTP ile sınırlı olduğunu ve SAST source/sink kurallarının FaaS konstrüktlarını hesaba katmadığını iddia eder — ancak bunlar **hakemli değildir** ve bu raporda yalnızca "uygulayıcı iddiası" olarak etiketlenmiştir.

![Literatürde raporlanan tespit oranları](figures/tespit-oranlari.png)

**Şekil 1.** Literatürde raporlanan tespit/doğruluk oranları. Farklı veri kümeleri ve metrikler üzerinden geldikleri için doğrudan karşılaştırma yapılamaz; amaç, varsayılan SAST kapasitesinin genel sınırlılığı ile pipeline/özel-araç başarımları arasındaki ölçek farkını görselleştirmektir. Kaynaklar: [EASE 2024](https://bura.brunel.ac.uk/handle/2438/30374), [IEEE TRel 2023](https://doi.org/10.1109/TR.2023.3286301), [arXiv 2509.04328](https://arxiv.org/abs/2509.04328), [USENIX Security 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa).

Dördüncü katmanın da ötesinde, doğrudan eşleşen çalışma araması (bkz. §2.4) negatiftir. Dolayısıyla merkezi bulgu şudur: **hipotez, tool-capability ve dolaylı ampirik kanıtlarla makul ve test edilebilir bir öncül olarak durmaktadır; ancak taranan literatürde onu doğrudan doğrulayan veya çürüten paired ampirik ölçüm bulunamamıştır.** Bu ifade, "hiç çalışılmamış" iddiasından bilinçli olarak daha zayıftır ve arama metodolojisinin kapsamıyla sınırlıdır.

### 9.2 Boşluk karşılaştırma tablosu

**Tablo 10 — Aday boşlukların karşılaştırması**

| Aday boşluk | Doğrudan kanıt yokluğu | Dolaylı destek | Yenilik riski (üretilmiş boşluk mu?) | Fizibilite (MSc) | RQ bağı |
|---|---|---|---|---|---|
| G1: Event-source-aware taint modeling eksikliği (JS/TS serverless) | Yüksek — paired ölçüm bulunamadı | Güçlü: CodeQL/Semgrep model gereksinimi + Obetz/CloudFlow | Düşük — literatürdeki açık future-work'lerle tutarlı | Orta (kural yazımı gerektirir) | RQ2, RQ3 |
| G2: Cloudflare Workers/Hono/binding-aware default gate değerlendirmesi | Yüksek — Cloudflare-spesifik hakemli SAST değerlendirmesi bulunamadı | Orta: Cloudflare docs platform gerçeklerini belgeler; genellemeye izin vermez | Düşük-orta — platform-spesifiklik yeterli gerekçe | Yüksek (Wrangler + GitHub Actions ile tekrarlanabilir) | RQ1, RQ2 |
| G3: Held-out zafiyetlerde platform-aware custom rules + CI overhead ölçümü | Yüksek — Semgrep* özel kural getirisini gösterir ama serverless/edge bağlamında değil | Güçlü: Semgrep* %44,7; FaaSGuard pipeline başarımı | Düşük | Orta | RQ3, RQ4 |
| G4: Serverless için genel SAST benchmark eksikliği | Kısmen — SecBench.js ve Brito dataset var ama serverless değil | Orta | Orta — "benchmark yok" iddiası kolayca abartılabilir | Düşük-orta (corpus inşası büyük iş) | RQ1 |
| G5: CI/CD kimlik/deployment güvenliği (OIDC, preview) boşluğu | Düşük — Koishybayev ve MITRE/OWASP dokümantasyonu konuyu doyuruyor | Güçlü ama doymuş | Yüksek — üretilmiş boşluk riski; raporda bilinçli elendi | — | RQ4 (bağlam) |

### 9.3 En güçlü üç savunulabilir boşluk

**Boşluk 1 — Event-source-aware taint modeling (G1).** Literatür, serverless fonksiyonların event-driven doğasının statik analiz için modellenmesi gerektiğini en az 2019'dan beri bilmektedir ([HotCloud 2019](https://www.usenix.org/conference/hotcloud19/presentation/obetz)); ODGen'in event-based call graph'ı future work olarak bırakması ([USENIX Security 2022](https://www.usenix.org/system/files/sec22-li-song.pdf)) ve CloudFlow'un bu modellemeyi yalnızca AWS/Python kapsamında gerçekleştirmesi ([USENIX Security 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)) birlikte okunduğunda, JS/TS ekosisteminde event-source-aware taint modellemesinin sistematik değerlendirmesi açık bir boşluktur. Bu boşluk "kulağa yeni geldiği için" değil, üç bağımsız kanıt hattının (araç dokümantasyonu, açık future-work itirafları, platform-spesifik öncül çalışma) kesişiminde durduğu için savunulabilirdir.

**Boşluk 2 — Cloudflare Workers / Hono / binding-aware paired gate değerlendirmesi (G2).** Cloudflare Workers'ın güvenlik modeli AWS Lambda'dan yapısal olarak farklıdır: V8 isolates, sabitlenmiş `Date.now()`, cordon/process isolation ([Cloudflare Docs](https://developers.cloudflare.com/workers/reference/security-model/)). Wrangler konfigürasyonu bindings'leri (`kv_namespaces`, `r2_buckets`, `d1_databases`, `queues`, `triggers.crons`) açıkça tanımlar ve preview ortamları Queue consumer / Cron Trigger / production route eklememeyi gerektirir; preview'dan service binding çağrıları production deployment'a gider ([Cloudflare Previews](https://developers.cloudflare.com/workers/previews/configuration/)). Taranan literatürde `wrangler.toml`/`wrangler.jsonc` ve Workers bindings için hakemli bir SAST/IaC gate değerlendirmesi bulunamamıştır. **Önemli uyarı:** bu "yokluk" iddiası, arama kapsamıyla sınırlıdır; ayrıca AWS bulguları Cloudflare'e genellenemez — çalışmanın katkısı tam da bu genellenemezliği ölçmektir.

**Boşluk 3 — Held-out platform-aware custom rules + ölçülmüş CI overhead (G3).** Özel kural yazımının getirisi genel kodda gösterilmiştir (%11,2–%26,5 → %44,7, [EASE 2024](https://bura.brunel.ac.uk/handle/2438/30374)) ama (a) serverless-edge event source'ları için ve (b) held-out zafiyetlerde overfitting kontrolüyle ve (c) pipeline overhead ile birlikte ölçülmemiştir. FaaSGuard OpenFaaS/Python için yüksek başarım raporlar (precision %95, recall %91) fakat preprint'tir ve JS/TS edge kapsamı yoktur ([arXiv 2509.04328](https://arxiv.org/abs/2509.04328)). Bu üçlü kombinasyon — platform-aware kurallar, held-out değerlendirme, CI maliyeti — tezin RQ3/RQ4'ünü doğrudan besler ve literatürle çakışmayan, ölçülebilir bir katkıdır.

### 9.4 Doymuş ve az çalışılmış alanlar

**Doymuş / iyi kapsanmış alanlar:** (i) Genel serverless güvenlik survey'leri — Rajapakse (54 çalışma), Marin, Wen (164 makale) ve Ni ile bu alan doygunluğa yakındır; yeni bir genel survey katkısı marjinaldir ([IST 2022](https://www.sciencedirect.com/science/article/abs/pii/S0950584921001543), [TOSEM 2023](https://dl.acm.org/doi/10.1145/3579643)). (ii) GitHub Actions workflow güvenliğinin büyük ölçekli karakterizasyonu — 447.238 workflow'luk ölçümle iyi kurulmuştur ([USENIX Security 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev)); tez bunu yeniden ölçmemeli, alıntılamalıdır. (iii) npm dependency/bot ekosistemi — Dependabot etkinliği 4.978 zafiyetlik veriyle incelenmiştir ([EMSE 2025](https://link.springer.com/article/10.1007/s10664-025-10638-w)). (iv) Runtime enforcement (IFC/DIFC) — Trapeze, Valve, will.iam ile olgundur.

**Az çalışılmış alanlar:** (i) JS/TS serverless için event-source-aware taint modelleme ve bunun gate etkinliğine etkisi; (ii) Cloudflare Workers'a özgü (bindings, Wrangler config, preview davranışı) güvenlik analizi — hakemli kayıt bulunamamıştır; (iii) varsayılan CI security gate'lerinin (CodeQL, Semgrep CE, Opengrep, Gitleaks, Trivy, Checkov, OSV-Scanner) serverless-spesifik zafiyetlerde sistematik, paired karşılaştırması; (iv) security gate'lerin CI süresi maliyetinin serverless bağlamında ölçümü — genel overhead literatürü (ör. runtime enforcement için %2,8, [WWW 2020](https://dl.acm.org/doi/10.1145/3366423.3380173)) vardır ama CI-gate latency literatürü zayıftır. Bu dört alan, tezin katkısının konumlanacağı zemindir.

---

## 10. Araştırma Tasarımı Önerisi

### 10.1 Tasarımın genel çerçevesi

Önerilen tasarım, **within-subject paired (eşleştirilmiş) ampirik deneydir**: her zafiyet için aynı uygulama mantığı ve aynı vulnerable sink korunarak iki varyant üretilir — HTTP twin (`HTTP Request → Untrusted Input → Application Logic → Vulnerable Sink`) ve Event twin (`Queue / Cron / Object Event / Webhook → Untrusted Input → Same Application Logic → Same Vulnerable Sink`). Böylece event-source tipi dışındaki karıştırıcılar (sink tipi, kod karmaşıklığı, sanitization mesafesi) yapısal olarak kontrol edilir. Bu tasarım, araç değerlendirmesi literatüründeki tek-kollu benchmark yaklaşımından ([IEEE TRel 2023](https://doi.org/10.1109/TR.2023.3286301)) ayrışır: soru "araç kaç zafiyet bulur" değil, "aynı zafiyet source değişince farklı bulunur mu"dur.

![İkiz zafiyet metodolojisi](figures/ikiz-metodoloji.png)

**Şekil 2.** Paired twin-vulnerability metodolojisi. Bağımsız değişken event-source tipidir; sink, uygulama mantığı, araç sürümü ve varsayılan kural seti sabit tutulur.

### 10.2 Değişkenler

**Tablo 11 — Değişken tanımları**

| Tür | Değişken | Operasyonel tanım |
|---|---|---|
| Bağımsız (ana) | Event-source tipi | HTTP (`fetch` handler, Hono route) vs non-HTTP: `queue` consumer message, `scheduled` (Cron Trigger), R2/object event, webhook (imzasız veya imzalı), Worker binding üzerinden gelen input |
| Bağımsız (ikincil) | Araç | CodeQL, Semgrep CE, Opengrep, Gitleaks, Trivy, Checkov, OSV-Scanner — her biri sabit sürüm ve varsayılan kural setiyle |
| Bağımsız (ikincil) | Kural konfigürasyonu | Default vs platform-aware custom rules (RQ3) |
| Bağımsız (kontrollü faktör) | Zafiyet sınıfı | SQL/NoSQL injection (D1), command injection, path traversal (R2 key), XSS, SSRF (`fetch`), insecure deserialization, hardcoded secret (wrangler/CI), vulnerable dependency, IaC misconfiguration |
| Bağımlı | Tespit (binary) | Ground-truth zafiyet için aracın doğru dosya/satır ve CWE ile bulgu üretmesi |
| Bağımlı | Precision, recall, F1, FPR, FNR | §10.5 tanımları |
| Bağımlı | Pipeline overhead | Wall-clock süre: baseline pipeline vs security-gate'li pipeline; relative latency increase (%) |
| Kontrol | Kod isomorfizmi | HTTP ve event ikizi aynı AST-alt ağacına sahip sink ve mantık; yalnızca entry-point adaptörü farklı |
| Kontrol | Ortam | Aynı GitHub Actions runner imajı, aynı araç sürümleri, sabit `compatibility_date` |

### 10.3 Ground-truth corpus önerisi

Corpus üç katmanlı önerilir. **Katman A — sentetik ikizler:** 8–10 zafiyet sınıfı × 2 ikiz = 16–20 çekirdek vaka; her biri Hono/TypeScript ile Cloudflare Workers üzerinde, D1 (`env.DB.prepare`), R2 (`env.BUCKET.get/put` key akışı), KV, Queues, cron ve webhook handler'ları kullanarak yazılır. Sentetik katman, paired istatistiğin (McNemar) tam kontrolünü sağlar. **Katman B — gerçek-dünya validasyonu:** OWASP DVSA ([GitHub](https://github.com/OWASP/DVSA)) ve SecBench.js ([ICSE 2023](https://doi.org/10.1109/ICSE48619.2023.00096)) tabanlı vakalar; bunlar sentetik ikizlerin dış geçerliliğini test eder ancak **DVSA'nın grey literature olduğu ve AWS-ağırlıklı tasarımının Cloudflare'e taşınmayacağı** not edilmelidir. **Katman C — held-out set:** RQ3 için custom kurallar yazılırken hiç görülmeyen, kural yazımından sonra açılan ayrı bir ikiz seti; bu, Semgrep*'in özel-kural çalışmasındaki ([EASE 2024](https://bura.brunel.ac.uk/handle/2438/30374)) overfitting riskine karşı koruma sağlar.

Ground-truth etiketleme iki bağımsız rater ile yapılmalı ve Cohen's κ raporlanmalıdır; benzer ampirik çalışmalar bu pratiği κ=0.963 düzeyinde uygulamıştır ([EMSE 2025](https://link.springer.com/article/10.1007/s10664-025-10638-w)). Her zafiyet kaydı; CWE sınıfı, sink konumu, beklenen taint path ve "exploitability notu" (teorik mi, uçtan uca tetiklenebilir mi) içermelidir — CloudFlow'un 11 zafiyeti manuel doğrulaması gibi ([USENIX Security 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)).

### 10.4 İstatistiksel analiz planı

RQ2'nin ana testi, her araç için HTTP-twin ve event-twin tespit sonuçlarının (buldu/bulamadı) **McNemar testi** ile karşılaştırılmasıdır; ikiz yapı bağımsız-örneklem testlerini (ki-kare) uygun değildir çünkü aynı zafiyetin iki varyantı eşleştirilmiştir. Birden fazla araç aynı anda karşılaştırılacaksa **Cochran's Q**; beklenen hücre frekansları düşükse (n≈20 ikizde olası) **Fisher exact / exact McNemar**. RQ1'de araçlar arası detection rate farkları için Cochran's Q + post-hoc McNemar (Holm düzeltmesi). RQ4 overhead karşılaştırması için paired run sürelerinde **Wilcoxon signed-rank**; bağımsız gruplar gerekiyorsa **Mann–Whitney U**. Tüm testlerde effect size raporlanır: McNemar için odds ratio, Wilcoxon/Mann–Whitney için rank-biserial correlation, oranlar için %95 confidence interval (Wilson score interval küçük örneklemlerde tercih edilir). Çoklu karşılaştırmalarda **Holm veya Benjamini–Hochberg** düzeltmesi; bu pratik referans çalışmalarda standarttır ([EMSE 2025](https://link.springer.com/article/10.1007/s10664-025-10638-w)).

Örneklem büyüklüğü gerekçesi: 16–20 ikiz ile McNemar'ın gücü sınırlıdır; bu nedenle (a) discordant çift sayısı önceden hesaplanıp raporlanmalı, (b) sonuçlar p-değeriyle birlikte mutlak discordant oran ve CI ile sunulmalı, (c) istatistiksel anlamsızlık "etki yok" olarak değil "bu örneklemde gösterilemedi" olarak yorumlanmalıdır. Bu temkin, hipotezin peşinen doğru varsayılmaması kuralının istatistiksel karşılığıdır.

### 10.5 Metrik tanımları (FPRR dahil)

**Tablo 12 — Metrik tanımları**

| Metrik | Formül | Not |
|---|---|---|
| Precision | TP / (TP + FP) | Bulgu başına doğruluk |
| Recall (detection rate / TPR) | TP / (TP + FN) | Ground-truth zafiyetlerin bulunma oranı |
| F1 | 2·P·R / (P + R) | Dengesiz corpus'ta tek başına yetersiz |
| FPR | FP / (FP + TN) | TN tanımı SAST'ta tartışmalıdır: "doğru negatif" satır/sink bazında tanımlanmalı, aksi halde şişer |
| FNR (miss rate) | FN / (FN + TP) = 1 − Recall | RQ2'nin ana bağımlı değişkeni |
| **FPRR** | **Standart bir SAST metriği değildir.** Literatürde standart olanlar FPR ve FNR'dir; "FPRR" kısaltması bazı kaynaklarda "false positive report rate" veya "false positive reduction rate" (ör. bir tekniğin baseline'a göre FP azaltımı, Nielsen et al.'ın %81 FP azaltımı gibi, [ISSTA 2021](https://dl.acm.org/doi/10.1145/3460319.3464836)) anlamında bağlamsal kullanılır. Tezde kullanılacaksa mutlaka ilk kullanımda tanımlanmalı; aksi halde FPR/FNR tercih edilmelidir. |
| Pipeline overhead | (T_gate − T_baseline) / T_baseline × 100 | Relative latency increase (%); en az 30 tekrar, median + IQR |
| Coverage | Tarana(bile)n handler/sink sayısı / toplam | Aracın entry-point'i hiç görmesi vs görüp bulamaması ayrımı için kritik |

Coverage metriği özellikle önemlidir: event-twin'de bir aracın "bulamaması" iki farklı nedenden olabilir — (i) source hiç modellenmemiş (taint başlamıyor), (ii) source modelli ama path/sink analizi yetersiz. Bu ayrım yapılmadan FNR yorumlanamaz; bu yüzden her FN vakası için root-cause etiketi (no-source-model, broken-propagation, unsupported-syntax, sink-not-covered) önerilir. Graph.js'in FN nedenlerini sınıflandırması ([PLDI 2024](https://dl.acm.org/doi/10.1145/3656394)) bu pratiğin örneğidir.

---

## 11. DevSecOps Pipeline Modeli ve CI/CD Güvenlik Kapsamı

### 11.1 Önerilen pipeline modeli

Tez testbed'i için GitHub Actions tabanlı, altı aşamalı bir pipeline önerilir: (1) **pre-commit / PR**: Gitleaks secrets taraması; (2) **SAST gate**: CodeQL + Semgrep CE + Opengrep (varsayılan kurallar; RQ3 kolunda custom kurallar); (3) **SCA gate**: OSV-Scanner (extraction + OSV matching, call analysis desteğiyle, [OSV-Scanner](https://github.com/google/osv-scanner)); (4) **IaC/config gate**: Trivy (`trivy fs --scanners secret,misconfig`, [Trivy Docs](https://trivy.dev/docs/latest/tutorials/misconfiguration/terraform/)) ve Checkov — ancak `wrangler.toml`/`wrangler.jsonc` için native kural desteği taranan kaynaklarda doğrulanamadığından bu gate'in Workers kapsamı deneysel olarak ölçülmelidir; (5) **build & deploy**: Wrangler ile preview deployment; (6) **report**: SARIF birleştirme ve gate kararı (fail-closed). FaaSGuard'ın "lightweight, fail-closed checks at every stage" modeli bu iskeletin OpenFaaS/Python karşılığıdır ve pipeline tasarımına referans alınabilir ([arXiv 2509.04328](https://arxiv.org/abs/2509.04328)).

Pipeline'ın kendisi de tehdit modeline dahildir: GitHub'ın güvenli kullanım kılavuzu, `pull_request_target` ile untrusted kodun checkout edilmesinden kaçınılmasını ve `workflow_run`'un tercih edilmesini önerir ([GitHub Docs](https://docs.github.com/en/actions/reference/security/secure-use)); MITRE ATT&CK T1677 (Poisoned Pipeline Execution) `pull_request_target` + checkout kombinasyonunun credential sızıntısına yol açabileceğini belgeler ([MITRE ATT&CK](https://attack.mitre.org/techniques/T1677/)); OWASP Top 10 CI/CD Security Risks bunu CICD-SEC-4 olarak sınıflandırır ([OWASP](https://owasp.org/projects/top-10-cicd-security-risks)). Empirik olarak, incelenen workflow'ların %99,8'i ihtiyaçtan fazla (read-write) yetkili, %23,7'si PR ile tetiklenip repo kodunu çalıştırıyor ve %99,7'si external Action çalıştırıyor ([USENIX Security 2022](https://www.usenix.org/conference/usenixsecurity22/presentation/koishybayev)). Bu bulgular testbed'in kendi pipeline'ının da sertleştirilmesini (minimal `GITHUB_TOKEN` permissions, SHA-pinned Actions, OIDC tabanlı short-lived credentials) gerektirir.

### 11.2 CI/CD güvenliğinin kapsam sınırı

CI/CD security, bu tezde **bilinçli olarak ikincil tutulur**. Merkezi katkı, SAST/taint modelleme sorusudur (RQ1–RQ3); CI/CD boyutu (RQ4) pipeline overhead ölçümü ve tehdit-modeli bağlamıyla sınırlıdır. Bu sınır iki nedenden korunmalıdır: birincisi, CI/CD platform güvenliği literatürü (PPE, token permissions, supply chain) kendi başına doygun bir alandır ve tez sorusunu gölgeleyebilir; ikincisi, Cloudflare Workers preview ortamlarının güvenlik özellikleri (preview'ların production settings'i miras almaması, Queue consumer/Cron Trigger eklenememesi, service binding'lerin production'a gitmesi, [Cloudflare Previews](https://developers.cloudflare.com/workers/previews/configuration/)) tez için bağlamdır, ana ölçüm nesnesi değildir. Pratik formül: tez metninde CI/CD güvenliği bir "tehdit modeli ve deneysel hijyen" bölümü olarak kalmalı, bulgular bölümünde yalnızca RQ4 metrikleri (overhead) yer almalıdır.

---

## 12. Cloudflare-Specific Kanıt Seviyeleri

Cloudflare Workers iddialarının hepsi aynı kanıt ağırlığına sahip değildir. Tezde kullanılırken aşağıdaki seviye tablosu uygulanmalıdır.

**Tablo 13 — Cloudflare-specific kanıt seviyeleri**

| Seviye | Kanıt türü | Örnekler | Tezdeki kullanım |
|---|---|---|---|
| L1 — Platform gerçeği (resmi docs) | Vendor dokümantasyonu (grey, ama olgusal) | V8 isolates, sabitlenmiş `Date.now()`, cordons ([Security Model](https://developers.cloudflare.com/workers/reference/security-model/)); bindings ve `triggers.crons` ([Wrangler Config](https://developers.cloudflare.com/workers/wrangler/configuration/)); preview kısıtları ([Previews](https://developers.cloudflare.com/workers/previews/configuration/)) | Tehdit modeli ve testbed tasarımının girdisi; istatistiksel çıkarımda kullanılmaz |
| L2 — Araç davranışı (resmi docs) | Tool vendor dokümantasyonu | CodeQL `sourceModel`/threat models ([CodeQL Docs](https://codeql.github.com/docs/codeql-language-guides/customizing-library-models-for-javascript/)); Semgrep taint mode ([Semgrep Docs](https://docs.semgrep.dev/writing-rules/data-flow/taint-mode/overview)) | Hipotezin mekanistik fizibilitesi; "varsayılan model X'i içerir/içermez" deneyle doğrulanmalı |
| L3 — Hakemli, platformlar-arası | Peer-reviewed, Workers-spesifik değil | CloudFlow (AWS) ([USENIX 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)); ODGen/Graph.js (Node.js) | Analoji ve yöntem transferi; **Cloudflare'e genellenemez** |
| L4 — Hakemli, Workers-spesifik | Peer-reviewed Workers çalışması | **Taranan kaynaklarda bulunamadı** | Boşluğun kendisi |
| L5 — Uygulayıcı iddiası | Vendor blog / OWASP projesi | OWASP Serverless Top 10 ([GitHub](https://github.com/OWASP/Serverless-Top-10-Project)); PureSec blog'ları | Yalnızca motivasyon; hiçbir sonuç bunlara dayandırılmaz |

Bu hiyerarşi iki kuralı operasyonel hale getirir: vendor materyali hakemli kanıtla eşdeğer tutulmaz ve AWS Lambda bulgusu Cloudflare Workers güvenlik modeline taşınmaz. Özellikle L3→L4 geçişi, tezin katkı cümlesinin omurgasıdır: "AWS için gösterilen (L3), Cloudflare Workers için (L4) ölçülmemiştir ve güvenlik modelleri farklı olduğundan (L1) varsayılamaz."

---

## 13. Tekrar Üretilebilirlik Önerileri

Tekrar üretilebilirlik paketi şunları içermelidir: (i) tüm ikiz uygulamaların kaynak kodu ve `wrangler.jsonc` dosyaları, sabit `compatibility_date` ile; (ii) her aracın tam sürümü (container imaj digest'i dahil) ve çalıştırma komutları; (iii) ground-truth etiket dosyaları (CWE, sink satırı, expected taint path, exploitability notu) ve rater agreement raporu (Cohen's κ); (iv) GitHub Actions workflow YAML'ları — SHA-pinned Actions, minimal token permissions, OIDC ile short-lived credentials, `pull_request_target` kullanımından kaçınılmış haliyle ([GitHub Docs](https://docs.github.com/en/actions/reference/security/secure-use)); (v) analiz scriptleri (McNemar/Cochran's Q/Wilcoxon, CI hesapları) ve ham SARIF çıktıları; (vi) arama protokolünün bu rapordaki hali (Tablo 1–2). CloudFlow'un USENIX artifact rozeti (available/functional/reproduced, [USENIX 2025](https://www.usenix.org/conference/usenixsecurity25/presentation/raffa)) hedef standart olarak alınabilir. Ek olarak, aracın bir zafiyeti "hiç görmemesi" ile "görüp bulamaması" arasındaki ayrımı mümkün kılmak için her FN'nin root-cause etiketi (§10.5) makine-okunur biçimde yayımlanmalıdır.

Bilinen tekrar üretilebilirlik riskleri şunlardır: CodeQL/Semgrep varsayılan kural setleri sürümle değişir (sürüm sabitleme zorunlu); Workers runtime davranışı `compatibility_date`'e bağlıdır; GitHub Actions runner zamanlaması gürültülüdür (overhead için ≥30 tekrar ve median raporlanmalı); ve preview ortamları production'a bağlanabileceğinden (service bindings, [Cloudflare Previews](https://developers.cloudflare.com/workers/previews/configuration/)) deneylerin izolasyonu ayrıca dokümante edilmelidir.

---

## 14. Başlık Değerlendirmesi

Geçici başlık — *"Do Default DevSecOps Gates See the Serverless Edge? An Empirical Study of Detection Gaps for Event-Sourced and Platform-Specific Vulnerabilities"* — literatür taramasıyla uyumludur: "default gates" vurgusu Semgrep* ve Brito et al.'ın varsayılan-kural sınırlılığı bulgularına ([EASE 2024](https://bura.brunel.ac.uk/handle/2438/30374), [IEEE TRel 2023](https://doi.org/10.1109/TR.2023.3286301)), "serverless edge" vurgusu L4 boşluğuna (§12), "event-sourced" vurgusu ise Obetz–CloudFlow hattının JS/TS için kapatılmamış kısmına oturur. Başlık değişikliği zorunlu değildir; ancak iki güçlendirme önerilebilir. Birincisi, "DevSecOps gates" yerine "CI security gates" daha ölçülebilir bir kapsam işaret eder ve CI/CD güvenliğinin merkezi soruyu gölgelemesi riskini azaltır. İkincisi, platform adının alt başlığa alınması hakemlerin genellenebilirlik sorusunu önceden çerçeveler: *"Do Default CI Security Gates See the Serverless Edge? A Paired Empirical Study of HTTP vs. Event-Sourced Vulnerability Detection on Cloudflare Workers."* Her iki sürüm de çekirdek soruyu korur; seçim, tezin katkısını "genel DevSecOps" mü yoksa "platform-spesifik ampirik ölçüm" mü olarak sunmak istediğinize bağlıdır.

---

## 15. Sınırlılıklar ve Temkinli Yorumlar

Bu raporun sınırlılıkları açıktır. Birincisi, arama sekiz veritabanı ve iki yönlü snowballing ile yürütülmüş olsa da, tam bir PRISMA kaydı (çift bağımsız screener, kayıt numarası akış diyagramı) içermez; bu bir MSc ön-inceleme protokolüdür. İkincisi, "doğrudan eşleşen çalışma bulunamadı" bulgusu arama kapsamına bağlıdır ve evrensel bir yokluk iddiası olarak okunmamalıdır — bu raporun hiçbir yerinde "hiç kimse bunu çalışmadı" denmemiştir. Üçüncüsü, FaaSGuard gibi bazı kayıtlar preprint'tir ve hakem değerlendirmesi tamamlanmamış olabilir; bunlar matriste açıkça işaretlenmiştir. Dördüncüsü, Cloudflare-specific iddiaların önemli kısmı L1/L2 (vendor dokümantasyonu) düzeyindedir ve tez deneyleriyle doğrulanana dek "platform gerçeği" olarak kalır; vendor materyali hiçbir noktada hakemli kanıt yerine geçirilmemiştir. Beşincisi, hipotez — varsayılan SAST modellerinin non-HTTP event source'ları untrusted input olarak modellemeyebileceği — **doğru varsayılmamıştır**; rapor yalnızca onun test edilebilir, literatürle tutarlı ve henüz doğrudan ölçülmemiş olduğunu göstermiştir. Tersi bir sonuç (varsayılan gate'lerin event source'ları zaten modellediği bulgusu) da bu tasarımın geçerli ve değerli bir çıktısı olacaktır.

---

*Bu rapor genel bilgilendirme amaçlıdır; akademik değerlendirme, güvenlik veya mühendislik kararları için profesyonel danışmanlık yerine geçmez. Taranan literatüre ve belgelenen arama protokolüne dayanır; yeni yayınlar çıktıkça bulguların güncellenmesi gerekir.*
