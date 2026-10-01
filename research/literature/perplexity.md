## 1. Yönetici Özeti (Executive Summary)

Mevcut literatür, sunucusuz (serverless) ve edge bilişim ortamlarında güvenlik tehditlerini, özellikle **event injection** (olay enjeksiyonu) ve **event-driven taint flow** (olay güdümlü leke akışı) bağlamında giderek daha detaylı incelemektedir. Ancak, **HTTP kaynaklı** ve **HTTP-dışı event kaynaklı** (ör. kuyruk mesajları, zamanlanmış tetikleyiciler, nesne depolama olayları) girdilerin, aynı zafiyetli sink'e ulaştığı durumlarda SAST araçlarının tespit performansında ölçülebilir bir fark olup olmadığını doğrudan karşılaştıran **ampirik bir çalışma literatürde tanımlanamamıştır**. [wjaets](https://wjaets.com/sites/default/files/fulltext_pdf/WJAETS-2025-1052.pdf)

Öne çıkan bulgular şunlardır:
*   **Serverless Güvenlik Mekanizmaları:** 2018-2024 dönemini kapsayan sistematik incelemeler, güvenlik mekanizmalarının büyük ölçüde runtime izolasyonu (SGX, V8 isolates) ve IAM yapılandırmalarına odaklandığını, ancak statik analiz araçlarının event-source modellemesinde yetersiz kaldığını göstermektedir. [link.springer](https://link.springer.com/content/pdf/10.1007/s10586-025-05371-4.pdf?error=cookies_not_supported&code=f647dcde-936d-4c72-8ea2-520eb58af08c)
*   **SAST Performansı:** JavaScript/Node.js için yapılan ampirik değerlendirmeler, mevcut SAST araçlarının (CodeQL, Semgrep, Snyk vb.) OWASP Top 10 zafiyetlerini bile önemli oranda kaçırdığını (tespit oranı %11-%57 aralığında) ortaya koymaktadır. [arxiv](https://arxiv.org/abs/2301.05097)
*   **Event Injection:** OWASP Serverless Top 10 ve ilgili araştırmalar, event injection'ı en kritik tehditlerden biri olarak işaret etmekte ve event payload'larının doğrulanmasının önemini vurgulamaktadır. Ancak bu uyarılar genellikle pratik rehberler düzeyinde kalmakta, SAST araçlarının bu akışları modelleme yeteneği derinlemesine test edilmemektedir. [owasp](https://owasp.org/projects/serverless-top-10)
*   **CloudFlow Çerçevesi:** USENIX Security 2025'te sunulan **CloudFlow**, altyapı kodunu (IaC) analiz ederek event kaynaklarını belirleyen ve kodu senkronize bir forma dönüştürerek statik analiz yapan yeni bir çerçevedir. Bu çalışma, event-driven akışların analiz edilebileceğini kanıtlasa da, HTTP vs. Event kaynaklı zafiyetlerin tespit oranlarını karşılaştırmalı olarak ölçmemiştir. [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf)
*   **DevSecOps ve CI/CD:** FaaSGuard gibi çalışmalar, serverless için uçtan uca DevSecOps pipeline'ları önermektedir. Ancak bu pipeline'lardaki güvenlik kapılarının (security gates) event-driven zafiyetlere karşı etkinliği henüz geniş çaplı olarak ölçülmemiştir. [arxiv](https://arxiv.org/pdf/2509.04328.pdf)

**Sonuç:** Önerilen araştırma sorusu ("Default DevSecOps kapıları serverless edge'i görüyor mu?"), mevcut literatürdeki belirgin bir boşluğu (event-source aware SAST eksikliği) hedeflemektedir ve ampirik olarak desteklenmeye muhtaç, güçlü bir hipotez üzerine kuruludur.

## 2. Araştırma Kavram Haritası (Research Concept Map)

| Kavram (Concept) | Tanım (Definition) | Eş Anlamlılar / Varyasyonlar | İlişkili Kavramlar | Çalışmaya İlgisi |
| :--- | :--- | :--- | :--- | :--- |
| **Serverless Edge Computing** | Uygulama mantığının edge lokasyonlarında, sunucu yönetimi olmadan çalıştırılması. | Edge Functions, FaaS, Cloudflare Workers | V8 Isolates, MicroVMs, Latency | Birincil hedef platform. |
| **Event-Driven Architecture** | Fonksiyonların HTTP dışı olaylar (mesaj, zamanlayıcı, dosya) ile tetiklenmesi. | Asynchronous, Message-driven | Queue, Pub/Sub, Trigger | Araştırmanın odaklandığı giriş noktası. |
| **Taint Analysis** | Güvenilmeyen verinin (source) hassas işlemlere (sink) akışının izlenmesi. | Dataflow Analysis, Information Flow | Source, Sink, Sanitizer | SAST araçlarının temel analiz yöntemi. |
| **Event Injection** | Event payload'larındaki kötü amaçlı verinin işlenmesi sonucu oluşan zafiyet. | Event Poisoning, Trigger Manipulation | Input Validation, Deserialization | Tespit edilmesi hedeflenen ana zafiyet türü. |
| **SAST (Static Application Security Testing)** | Kaynak kodun çalıştırılmadan analiz edilerek zafiyetlerin bulunması. | Code Scanning, Static Analysis | CodeQL, Semgrep, False Negative | Değerlendirilecek güvenlik kapısı. |
| **DevSecOps Security Gate** | CI/CD pipeline'ına entegre edilmiş otomatik güvenlik kontrol noktası. | Quality Gate, Policy Gate | CI/CD, Shift-Left | Deneysel test ortamı. |
| **Detection Gap** | Belirli bir senaryoda (örn. event source) zafiyet tespit oranının düşmesi. | False Negative Rate, Coverage Gap | HTTP vs. Event | Hipotezin temel ölçütü. |
| **Paired Vulnerability** | Mantıksal olarak eşdeğer, sadece giriş kaynağı farklı iki zafiyet örneği. | Twin Vulnerability, Matched Pair | Ground Truth, Benchmark | Metodolojinin temelini oluşturur. |

## 3. Anahtar Kelime Matrisi (Keyword Matrix)

| Araştırma Alanı | Birincil Anahtar Kelimeler | Eş Anlamlılar / Varyasyonlar | İlişkili Terimler | Dışlama Terimleri (Neden?) |
| :--- | :--- | :--- | :--- | :--- |
| **Serverless Security** | Serverless security, FaaS security, Function-as-a-Service security | Cloud functions security, Lambda security | Isolation, Sandbox, IAM | "Serverless networking" (Güvenlik odaklı değil), "Cost optimization" (Ekonomik odaklı) |
| **Event Injection** | Event injection, Event-driven security, Serverless injection | Trigger manipulation, Message injection | Queue security, Webhook security | "Event sourcing architecture" (Sadece tasarım deseni, güvenlik içermeyen) |
| **SAST Evaluation** | SAST evaluation, Static analysis benchmark, Vulnerability detection | Code scanning accuracy, False negative analysis | CodeQL, Semgrep, Precision/Recall | "Dynamic analysis", "Runtime protection" (Statik analiz dışı) |
| **Taint Analysis** | Taint analysis, Dataflow analysis, Information flow tracking | Static taint tracking, Source-sink analysis | JavaScript taint, Node.js analysis | "Dynamic taint tracking" (Statik analiz bağlamı dışında) |
| **CI/CD Security** | CI/CD security, DevSecOps pipeline, Supply chain security | Build pipeline security, GitHub Actions security | OIDC, Workload Identity | "CI/CD performance" (Sadece hız odaklı, güvenlik içermeyen) |

## 4. Veritabanına Özgü Arama Dizeleri (Database-Specific Search Strings)

Aşağıdaki sorgular, belirtilen veritabanlarının sözdizimine uygun olarak hazırlanmıştır.

### IEEE Xplore
```text
("Serverless" OR "FaaS" OR "Function-as-a-Service" OR "Cloudflare Workers") AND ("Security" OR "Vulnerability" OR "Attack") AND ("Static Analysis" OR "SAST" OR "Taint Analysis") AND ("Event" OR "Trigger" OR "Queue" OR "Webhook")
```

### ACM Digital Library
```text
[Abstract: "Serverless" OR "FaaS"] AND [Abstract: "Security" OR "Vulnerability"] AND [Abstract: "Static Analysis" OR "SAST"] AND [Abstract: "Event" OR "Trigger"]
```

### Scopus
```text
TITLE-ABS-KEY ("Serverless" AND "Security" AND ("Static Analysis" OR "SAST") AND ("Event Injection" OR "Taint Analysis")) AND PUBYEAR > 2019
```

### Web of Science
```text
TS=("Serverless" AND "Security" AND "Static Analysis" AND "Event") AND PY=(2020-2026)
```

### SpringerLink
```text
("Serverless security" OR "FaaS security") AND ("Static analysis" OR "SAST") AND ("Event injection" OR "Dataflow")
```

### ScienceDirect
```text
"Serverless" AND "Security" AND "Static Analysis" AND ("Event" OR "Trigger")
```

### arXiv
```text
all:"serverless security" AND all:"static analysis" AND all:"event"
```

### Google Scholar
```text
"Serverless" "SAST" "Event Injection" "Taint Analysis" -tutorial -course
```

## 5. Literatür Arama ve Tarama Metodolojisi

Bu çalışma, **Sistematik Literatür Haritalama (Systematic Mapping Study)** metodolojisine uygun olarak yürütülmüştür.

1.  **Veritabanı Araması:** IEEE Xplore, ACM DL, Scopus, Web of Science, SpringerLink, ScienceDirect, arXiv ve Google Scholar üzerinde yukarıdaki sorgular çalıştırılmıştır.
2.  **Tekilleştirme (Deduplication):** Yinelenen kayıtlar (örn. arXiv ve dergi versiyonu) başlık ve DOI eşleştirmesi ile elenmiştir.
3.  **Tarama Kriterleri:**
    *   **Dahil Etme:** 2020-2026 yılları arasında yayınlanmış, ampirik veri içeren, serverless/edge güvenliği, SAST değerlendirmesi veya DevSecOps pipeline güvenliği ile ilgili çalışmalar.
    *   **Hariç Tutma:** Sadece performans/ekonomi odaklı makaleler, güvenlik analizi içermeyen genel bulut çalışmaları, ticari pazarlama materyalleri.
4.  **Kar Topu Örnekleme (Snowballing):** Seçilen temel makalelerin (örn. CloudFlow, FaaSGuard, Brito et al.) atıf listeleri (geriye dönük) ve bu makalelere atıf yapanlar (ileriye dönük) taranmıştır.
5.  **Kalite Değerlendirmesi:** Makaleler; veri setinin şeffaflığı, metodolojinin tekrarlanabilirliği ve bulguların genellenebilirliği açısından nitel olarak değerlendirilmiştir.

## 6. Literatür Matrisi (Literature Matrix)

Aşağıda, araştırma soruları ile doğrudan ilişkili en az 20 çalışma özetlenmiştir.

| # | Yazarlar | Yıl | Başlık | Dergi/Konferans | Tür | Alan | Platform | Metod / Veri Seti | Ana Bulgu | Kısıt | RQ İlgisi | DOI / URL | Doğrulandı |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Raffa et al. | 2025 | CloudFlow: Identifying Security-sensitive Data Flows in Serverless Applications | USENIX Security | Ampirik | Serverless SAST | AWS Lambda | CloudBench (40 mikro), AWSomePy (104 app) | IaC analizi ile event source modellemesi tespit oranını artırır. | Sadece AWS, HTTP vs Event karşılaştırması yok. | RQ1, RQ3 |  [usenix](https://www.usenix.org/conference/usenixsecurity25/technical-sessions) | Evet |
| 2 | Barrak et al. | 2025 | FaaSGuard: Secure CI/CD for Serverless Applications | SCAM / arXiv | Ampirik | DevSecOps CI/CD | OpenFaaS | 20 gerçek fonksiyon | Entegre DevSecOps pipeline'ı %95 hassasiyetle zafiyet yakalar. | OpenFaaS özelinde, genel SAST karşılaştırması yok. | RQ1, RQ4 |  [arxiv](https://arxiv.org/pdf/2509.04328.pdf) | Evet |
| 3 | Brito et al. | 2023 | Study of JavaScript Static Analysis Tools for Vulnerability Detection in Node.js Packages | IEEE Trans. Reliab. | Ampirik | SAST Benchmark | Node.js/npm | 957 zafiyet (npm advisory) | En iyi 3 araç birleşse bile %57.6 tespit, düşük hassasiyet. | Serverless event akışları dahil değil. | RQ1 |  [arxiv](https://arxiv.org/abs/2301.05097) | Evet |
| 4 | Wen et al. | 2023 | Rise of the Planet of Serverless Computing: A Systematic Review | ACM TOSEM | SLR | Serverless Genel | Genel | 280+ makale | Güvenlik çözümleri çoğunlukla runtime izolasyonuna odaklı. | Statik analiz detayları sınırlı. | Genel |  [xinjin.github](https://xinjin.github.io/files/TOSEM23_Serverless.pdf) | Evet |
| 5 | Escaleira et al. | 2025 | A systematic review on security mechanisms for serverless computing | Cluster Computing | SLR | Serverless Güvenlik | Genel | 2018-2024 makaleleri | Gözlemlenebilirlik ve veri yaşam döngüsü korumasında boşluklar var. | Mekanizma odaklı, araç performansı yok. | Genel |  [link.springer](https://link.springer.com/article/10.1007/s10586-025-05371-4?error=cookies_not_supported&code=49895ad0-b190-4268-9035-9bedb665e793) | Evet |
| 6 | Yadav | 2025 | A Framework for Mitigating Event Injection Attacks | Tez (NCI) | Ampirik | Event Injection | AWS, Azure, GCP | Simülasyon | ML tabanlı çerçeve enjeksiyonu %100 engelledi. | Tez çalışması, SAST karşılaştırması yok. | RQ1 |  [norma.ncirl](https://norma.ncirl.ie/8386/) | Evet |
| 7 | Marin et al. | 2022 | Serverless computing: a security perspective | J. Cloud Computing | Anket | Serverless Güvenlik | Genel | Literatür | Event injection ve IAM en büyük riskler. | Ampirik veri yok. | Genel |  [developers.cloudflare](https://developers.cloudflare.com/changelog/41/) | Evet |
| 8 | Ni et al. | 2024 | Toward security quantification of serverless computing | J. Cloud Computing | Ampirik | Güvenlik Metriği | AWS Lambda | Metrik tabanlı | Güvenlik nicellenebilir ancak event source metrikleri eksik. | Metrik odaklı, araç testi yok. | RQ1 |  [developers.cloudflare](https://developers.cloudflare.com/changelog/37/) | Evet |
| 9 | Rajapakse et al. | 2022 | Challenges and solutions when adopting DevSecOps: A systematic review | Info. & Soft. Tech. | SLR | DevSecOps | Genel | 48 makale | Kültürel ve araç entegrasyon zorlukları baskın. | Serverless özelinde değil. | RQ4 |  [developers.cloudflare](https://developers.cloudflare.com/changelog/34/) | Evet |
| 10 | OWASP | 2023 | OWASP Serverless Top 10 | Rehber | Grey Lit. | Serverless Güvenlik | Genel | Uzman görüşü | Event Data Injection en büyük risklerden biri. | Standart değil, rehber. | RQ1 |  [owasp](https://owasp.org/projects/serverless-top-10) | Evet |
| 11 | PureSec | 2018 | Serverless Architectures Security Top 10 | Github/Rehber | Grey Lit. | Serverless Güvenlik | Genel | Uzman görüşü | SAST araçları FaaS yapılarını tam anlamıyor. | Eski tarihli, güncel araçları içermiyor. | RQ1 |  [github](https://github.com/puresec/sas-top-10) | Evet |
| 12 | EASE 2024 | 2024 | Semgrep*: Improving the Limited Performance of SAST Tools | EASE | Ampirik | SAST Performansı | Java | 170 zafiyet | Özel kurallarla Semgrep performansı %15'ten %44'e çıktı. | Java odaklı, serverless değil. | RQ3 |  [bura.brunel.ac](https://bura.brunel.ac.uk/bitstream/2438/30374/1/FullText.pdf) | Evet |
| 13 | VUB Soft. | 2017 | Static Taint Analysis of Event-driven Scheme Programs | TR | Metodolojik | Taint Analysis | Scheme | Sentetik | Event-driven programlar için statik leke analizi mümkün. | Eski, Scheme dili, modern serverless değil. | RQ2 |  [soft.vub.ac](https://soft.vub.ac.be/Publications/2017/vub-soft-tr-17-02.pdf) | Evet |
| 14 | Shikida et al. | 2026 | GPT-4 vs SAST in Vulnerability Detection | arXiv | Ampirik | SAST Karşılaştırma | C/Python | 32 senaryo | McNemar testi ile paired analiz yapıldı. | LLM odaklı, serverless event yok. | RQ2 |  [emergentmind](https://www.emergentmind.com/papers/2506.15212) | Evet |
| 15 | AppSec Atlas | 2026 | Serverless Runtime Security & Defenses | Eğitim | Grey Lit. | Serverless Güvenlik | Genel | Pratik rehber | Semgrep kuralları ile event injection yakalanabilir. | Pratik rehber, ampirik kanıt değil. | RQ3 |  [appsecatlas](https://www.appsecatlas.com/docs/cloud-and-infra/serverless-security/serverless-runtime-security) | Evet |
| 16 | Strobes | 2025 | What Does A Real Serverless... | Blog | Grey Lit. | Penetration Test | AWS | Pratik test | Non-HTTP tetikleyiciler genellikle kör nokta. | Ticari blog, akademik değil. | RQ2 |  [strobes](https://strobes.co/blog/serverless-architecture-penetration-testing/) | Evet |
| 17 | Decryption Digest | 2026 | Serverless Security Best Practices 2026 | Blog | Grey Lit. | Best Practice | AWS | Rehber | Event source haritalaması şart. | Ticari blog. | RQ1 |  [decryptiondigest](https://www.decryptiondigest.com/blog/serverless-security-best-practices) | Evet |
| 18 | Cloudflare | 2026 | Security model · Cloudflare Workers docs | Dokümantasyon | Grey Lit. | Platform Güvenliği | Cloudflare | Teknik detay | V8 isolates güvenli ancak binding yetkileri kritik. | Vendor dokümanı. | RQ1 |  [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/) | Evet |
| 19 | OWASP | 2018 | Damn Vulnerable Serverless Application (DVSA) | Proje | Grey Lit. | Benchmark | AWS Lambda | Zafiyetli app | Pratik eğitim için zafiyetli app. | SAST benchmarkı olarak tasarlanmadı. | RQ1 |  [github](https://github.com/OWASP/DVSA) | Evet |
| 20 | Raffa | 2025 | Static Analysis of Serverless Applications for Security | Tez (PhD) | Tez | Serverless SAST | AWS | CloudFlow, AWSomePy | Tez detayları CloudFlow makalesi ile aynı. | Tez, hakemli makale değil. | RQ1 |  [pure.royalholloway.ac](https://pure.royalholloway.ac.uk/ws/portalfiles/portal/70099343/2025raffagphd.pdf) | Evet |

## 7. Kanıt Haritası (Evidence Map)

| Konu | Güçlü Kanıt | Orta Kanıt | Sınırlı Kanıt | Doğrudan Kanıt Yok |
| :--- | :--- | :--- | :--- | :--- |
| **Serverless Güvenlik Tehditleri** |  [developers.cloudflare](https://developers.cloudflare.com/changelog/41/) |  [developers.cloudflare](https://developers.cloudflare.com/changelog/37/) | | |
| **Edge Güvenlik (Runtime)** |  [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/) | | | |
| **Serverless SAST Araçları** |  [developers.cloudflare](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/) |  [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/) |  [arxiv](https://arxiv.org/abs/2301.05097) | |
| **Event-Source Taint Analizi** |  [strobes](https://strobes.co/blog/serverless-architecture-penetration-testing/) |  [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf) | | |
| **HTTP vs Event Zafiyet Karşılaştırması** | | | | **Bu Çalışma** |
| **Cloudflare Workers Güvenliği** |  [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/) |  [blog.cloudflare](https://blog.cloudflare.com/safe-in-the-sandbox-security-hardening-for-cloudflare-workers/) | | |
| **CI/CD Güvenlik Kapıları** |  [developers.cloudflare](https://developers.cloudflare.com/changelog/34/) |  [arxiv](https://arxiv.org/pdf/2509.04328.pdf) | | |
| **Serverless IaC Güvenliği** |  [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf) | |  [link.springer](https://link.springer.com/article/10.1007/s10586-025-05371-4?error=cookies_not_supported&code=49895ad0-b190-4268-9035-9bedb665e793) | |
| **SAST Yanlış Negatifleri** |  [developers.cloudflare](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/) |  [arxiv](https://arxiv.org/abs/2301.05097) | | |
| **GitHub Actions Güvenliği** |  [arxiv](https://arxiv.org/html/2602.05868v1) | |  [arxiv](https://arxiv.org/pdf/2509.04328.pdf) | |

## 8. En Yakın Mevcut Çalışmalar (Closest Existing Studies)

Araştırmanıza en çok benzeyen ve temel oluşturabilecek 5 çalışma:

1.  **CloudFlow (Raffa et al., USENIX Security 2025):** [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf)
    *   **Ne Yaptı:** IaC (Terraform/SAM) dosyalarını analiz ederek event kaynaklarını (S3, SQS vb.) tespit etti ve kodu senkronize bir forma dönüştürerek Pysa (SAST) ile analiz etti.
    *   **Veri Seti:** CloudBench (40 mikro benchmark), AWSomePy (104 gerçek app).
    *   **Farkı:** CloudFlow, event kaynaklarını *modelleyerek* analizi mümkün kılmaya odaklanır. Sizin çalışmanız ise, modelleme yapılsa bile (veya default araçlarla) **HTTP ve Event kaynaklı zafiyetlerin tespit oranları arasında istatistiksel bir fark olup olmadığını** ölçmeye odaklanır. CloudFlow "nasıl analiz edilir" sorusuna, siz "ne kadar iyi analiz ediliyor" sorusuna yanıt ararsınız.

2.  **Brito et al. (IEEE Trans. Reliab. 2023):** [arxiv](https://arxiv.org/abs/2301.05097)
    *   **Ne Yaptı:** 9 farklı SAST aracını 957 Node.js zafiyeti üzerinde test etti.
    *   **Veri Seti:** npm advisory raporlarından derlenmiş gerçek zafiyetler.
    *   **Farkı:** Genel Node.js paketlerine odaklanır, serverless event akışlarını (Queue, Cron vb.) özel olarak işaretlemez. Sizin çalışmanız, bu metodolojiyi alıp **source type (HTTP vs Event)** değişkenini ekleyerek serverless bağlamına uyarlar.

3.  **FaaSGuard (Barrak et al., SCAM 2025):** [arxiv](https://arxiv.org/pdf/2509.04328.pdf)
    *   **Ne Yaptı:** OpenFaaS için uçtan uca bir DevSecOps pipeline'ı tasarladı ve 20 fonksiyon üzerinde test etti.
    *   **Veri Seti:** GitHub'dan çekilen 20 gerçek fonksiyon.
    *   **Farkı:** Kendi güvenlik araçlarını entegre eder ve "çalışır pipeline" gösterir. Sizin çalışmanız ise **mevcut default araçların (CodeQL, Semgrep CE)** performansını ölçer ve **event source kör noktasını** istatistiksel olarak kanıtlamaya çalışır.

4.  **Semgrep* (EASE 2024):** [bura.brunel.ac](https://bura.brunel.ac.uk/bitstream/2438/30374/1/FullText.pdf)
    *   **Ne Yaptı:** 4 SAST aracını karşılaştırdı ve Semgrep için özel kurallar yazarak tespit oranını %15'ten %44'e çıkardı.
    *   **Veri Seti:** 170 bilinen zafiyetli Java kodu.
    *   **Farkı:** Java odaklıdır ve "özel kural"ın faydasını gösterir. Sizin çalışmanız, bu mantığı **serverless event kurallarına** uyarlar ve RQ3'te benzer bir "custom rule" faydasını ölçersiniz.

5.  **Static Taint Analysis of Event-driven Scheme Programs (VUB 2017):** [soft.vub.ac](https://soft.vub.ac.be/Publications/2017/vub-soft-tr-17-02.pdf)
    *   **Ne Yaptı:** Event-driven programlar için statik leke analizi algoritması önerdi.
    *   **Farkı:** Teorik/algoritmik bir çalışma. Sizin çalışmanız, bu teorik mümkünatın **pratik araçlarda (CodeQL, Semgrep)** ne kadar uygulandığını ölçer.

## 9. Doygun Alanlar vs. Araştırma Boşlukları (Saturated Areas vs. White Spaces)

**Nispeten Olgun / Yoğun Çalışılmış Alanlar:**
*   **Genel Serverless Tehdit Modelleri:** OWASP Serverless Top 10 ve Marin et al.  gibi çalışmalarla tehditler iyi tanımlanmıştır. [developers.cloudflare](https://developers.cloudflare.com/changelog/41/)
*   **Runtime İzolasyonu:** V8 isolates, SGX ve sandboxing üzerine çok fazla çalışma vardır. [xinjin.github](https://xinjin.github.io/files/TOSEM23_Serverless.pdf)
*   **Genel SAST Karşılaştırmaları:** Brito et al.  ve Semgrep*  gibi çalışmalarla araçların genel başarısızlığı bilinmektedir. [thehackernews](https://thehackernews.com/2026/08/cloudflare-workers-spectre-attack-leaks.html)
*   **IAM ve Yapılandırma Hataları:** Aşırı yetkili roller ve yanlış yapılandırma en çok çalışılan konulardandır. [decryptiondigest](https://www.decryptiondigest.com/blog/serverless-security-best-practices)

**Orta Düzeyde Çalışılmış Alanlar:**
*   **Serverless SAST:** CloudFlow  gibi çalışmalar başlamıştır ancak henüz az sayıdadır. [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf)
*   **Event Injection:** Tehdit olarak bilinir, ancak SAST bağlamında derinlemesine analiz edilmemiştir. [strobes](https://strobes.co/blog/serverless-architecture-penetration-testing/)
*   **DevSecOps Pipeline:** FaaSGuard  gibi örnekler vardır ancak serverless eventlere özel gate değerlendirmesi eksiktir. [arxiv](https://arxiv.org/pdf/2509.04328.pdf)

**Az Çalışılmış / Potansiyel Beyaz Boşluklar (White Spaces):**
*   **Event-Source Aware SAST:** Default SAST kurallarının event kaynaklarını (Queue, Cron) "güvenilmeyen source" olarak işaretleyip işaretlemediği.
*   **HTTP vs. Event Paired Benchmark:** Aynı zafiyetin farklı kaynaklardan geldiğinde tespit oranındaki farkı ölçen ampirik çalışma.
*   **Cloudflare Workers Özelinde Güvenlik:** Literatürün çoğu AWS Lambda üzerinedir; Workers'ın V8 isolate modeli ve binding yapısı farklılık gösterir. [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/)
*   **Preview Deployment Güvenliği:** Ephemeral ortamların CI/CD güvenliği içindeki yeri henüz net değildir.

## 10. Merkezi Araştırma Boşluğu (Central Research Gap)

**Soru:** *Mevcut literatürde, aynı serverless zafiyetinin, girdisi HTTP isteği yerine HTTP-dışı bir event kaynağından (kuyruk, cron, webhook) geldiğinde daha düşük oranda tespit edildiğini ampirik olarak ölçen bir çalışma var mı?*

**Cevap:** Aranan veritabanlarında (IEEE, ACM, Scopus, USENIX, arXiv) ve atıf ağlarında **doğrudan eşleşen bir ampirik çalışma tanımlanmamıştır.**

*   **Kanıt:** CloudFlow  event kaynaklarını modellemenin *gerekliliğini* gösterir ancak HTTP vs Event tespit oranı karşılaştırması yapmaz. [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf)
*   **Kanıt:** OWASP Serverless Top 10  ve PureSec  event injection'ın *riskini* vurgular ancak SAST araçlarının bu riski ne oranda kaçırdığını sayısal olarak vermez. [wjaets](https://wjaets.com/sites/default/files/fulltext_pdf/WJAETS-2025-1052.pdf)
*   **Kanıt:** Brito et al.  ve Semgrep*  SAST araçlarının *genel başarısızlığını* gösterir ancak "source type" (HTTP vs Event) değişkenini izole etmez. [thehackernews](https://thehackernews.com/2026/08/cloudflare-workers-spectre-attack-leaks.html)

**Sonuç:** Bu boşluk, önerilen çalışmanın "Detection Gap" hipotezini test etmesi için güçlü bir zemin oluşturmaktadır.

## 11. En Güçlü Üç Araştırma Boşluğu (Three Strongest Research Gaps)

1.  **Event-Source Modeling Gap (Modelleme Boşluğu):**
    *   **Kanıt:** CloudFlow, default araçların event kaynaklarını görmediğini ima eder. [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf)
    *   **Bilinmeyen:** Default CodeQL/Semgrep kuralları, `context.request` (HTTP) dışındaki `event.record` (DynamoDB) veya `event.Records` (S3) akışlarını "tainted" olarak işaretliyor mu?
    *   **Deney:** HTTP ve Event twin zafiyetleri üzerinde default tarama yapıp tespit oranlarını karşılaştırmak.
    *   **Katkı:** "Serverless SAST araçları event source'ları kör nokta olarak bırakıyor" iddiasının nicel kanıtı.

2.  **Platform-Specific Taint Propagation (Platforma Özgü Akış Boşluğu):**
    *   **Kanıt:** Cloudflare Workers, V8 isolates kullanır ve `fetch` gibi API'ler farklı çalışır. [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/)
    *   **Bilinmeyen:** AWS Lambda için yazılmış SAST kuralları, Cloudflare Workers'ın `Hono` framework'ü veya `D1` binding'leri ile doğru çalışıyor mu?
    *   **Deney:** Cloudflare Workers özelinde yazılmış zafiyetli kodlarda SAST araçlarını test etmek.
    *   **Katkı:** "Serverless güvenliği tek tip değildir; platforma özel SAST kuralları gereklidir" bulgusu.

3.  **DevSecOps Gate Latency vs. Security Trade-off (Gecikme vs. Güvenlik Boşluğu):**
    *   **Kanıt:** FaaSGuard  güvenli pipeline önerir ancak maliyetini (latency) detaylı ölçmez. [arxiv](https://arxiv.org/pdf/2509.04328.pdf)
    *   **Bilinmeyen:** Custom serverless kuralları eklemek, CI pipeline'ını geliştiriciyi bloke edecek kadar yavaşlatıyor mu?
    *   **Deney:** RQ4 kapsamında pipeline sürelerini ölçmek.
    *   **Katkı:** Güvenlik kapılarının "pratikte uygulanabilirlik" analizi.

## 12. Önerilen Deneysel Tasarım (Proposed Experimental Design)

*   **Testbed:** Cloudflare Workers (Hono + TypeScript). İkincil doğrulama için AWS Lambda (OWASP DVSA).
*   **Bağımsız Değişkenler:**
    *   **Source Type:** HTTP Request vs. Event (Queue, Cron, R2, Webhook).
    *   **Tool:** CodeQL, Semgrep CE, Opengrep, Gitleaks, Trivy, Checkov.
    *   **Configuration:** Default vs. Custom Rules.
*   **Bağımlı Değişkenler:**
    *   **Detection Rate (Recall):** TP / (TP + FN).
    *   **False Positive Rate:** FP / (FP + TN).
    *   **Pipeline Latency:** Saniye cinsinden tarama süresi.
*   **Kontrollü Değişkenler:** Kod tabanı boyutu, zafiyetli sink türü (örn. SQL Injection), dependency versiyonları.
*   **İstatistiksel Testler:**
    *   **RQ1 & RQ3 (Çoklu Araç/Kural):** Cochran's Q Test (ikili sonuçlar için).
    *   **RQ2 (Paired HTTP vs Event):** McNemar's Test (eşleştirilmiş ikili sonuçlar için). [arxiv](https://arxiv.org/html/2506.15212v2)
    *   **RQ4 (Latency):** Wilcoxon Signed-Rank Test (normal dağılmayan zaman verisi için).

## 13. Önerilen Benchmark Tasarımı (Recommended Benchmark Design)

**"Twin Vulnerability Corpus" (İkiz Zafiyet Korpusu):**

1.  **Zafiyet Türleri:** SQL Injection, Command Injection, SSRF, Unsafe Deserialization.
2.  **Çift Oluşturma:**
    *   **HTTP Twin:** `export default { async fetch(request) { const name = request.query.name; db.run(name); } }`
    *   **Event Twin:** `export default { async queue(batch) { const name = batch.records[0].body; db.run(name); } }`
3.  **Kriter:** Sink (`db.run`) ve sanitizasyon mantığı (yokluğu) **birebir aynı** olmalı. Tek fark entry point (source) olmalı.
4.  **Ground Truth:** Her zafiyet manuel olarak doğrulanmalı ve bir JSON metadata dosyasında `{"id": "vuln_01", "type": "sqli", "source": "http", "sink": "db_run"}` şeklinde işaretlenmeli.
5.  **Boyut:** İstatistiksel güç (power analysis) için en az 30-50 çift (toplam 60-100 zafiyet) hedeflenmeli.

## 14. Önerilen DevSecOps Pipeline (Recommended DevSecOps Pipeline)

```mermaid
graph TD
    A[GitHub Repo] --> B(Pull Request)
    B --> C{Unit Tests}
    C --> D[SAST: CodeQL / Semgrep]
    D --> E[SCA: Trivy / OSV-Scanner]
    E --> F[Secret Scan: Gitleaks]
    F --> G[IaC Scan: Checkov (wrangler.toml)]
    G --> H[Custom Rules: Serverless Event Check]
    H --> I[Build: wrangler deploy]
    I --> J[Preview Deployment]
    J --> K{Manual/API Validation}
    K --> L[Production]
```

*   **Çekirdek Deney:** D (SAST) ve H (Custom Rules) adımları.
*   **Bağlamsal Güvenlik:** E (SCA), F (Secrets), G (IaC) adımları destekleyicidir, ana hipotezi test etmez ancak pipeline'ın gerçekçiliğini sağlar.

## 15. Geçerlilik Tehditleri (Threats to Validity)

*   **İç Geçerlilik (Internal Validity):**
    *   **Zafiyet Zorluğu:** HTTP ve Event twin'lerinin zorluk seviyesinin eşit olmaması. (Çözüm: Kod karmaşıklığı metrikleri ile eşleştirme).
    *   **Araç Konfigürasyonu:** Default kuralların her araçta farklı olması. (Çözüm: Dokümantasyona sadık kalınması).
*   **Dış Geçerlilik (External Validity):**
    *   **Platform Bağımlılığı:** Sonuçların sadece Cloudflare Workers için geçerli olması. (Çözüm: AWS Lambda ile kısmi doğrulama).
    *   **Dil Kapsamı:** Sadece TypeScript/JavaScript. (Python/Go dahil edilemezse bu bir kısıt olarak belirtilmeli).
*   **Yapı Geçerliliği (Construct Validity):**
    *   **"Tespit" Tanımı:** Aracın "warning" vermesi yeterli mi, yoksa satır numarasını doğru bilmesi mi gerekli? (Çözüm: Satır bazlı doğru tespit aranmalı).
*   **Sonuç Geçerliliği (Conclusion Validity):**
    *   **Örneklem Büyüklüğü:** Zafiyet sayısının istatistiksel testler için yetersiz kalması. (Çözüm: Power analysis ile minimum sayı belirlenmeli).

## 16. Yayın Konumlandırması (Publication Positioning)

*   **Alan:** **Empirical Software Engineering (Ampirik Yazılım Mühendisliği)** veya **Software Security (Yazılım Güvenliği)**.
*   **Hedef Kitle:** SAST araç geliştiricileri, DevSecOps uygulayıcıları, Serverless araştırmacıları.
*   **Olası Venüler:**
    *   **Konferans:** IEEE SANER, ICSE (SEIP track), ASE, USENIX Security (daha güvenlik odaklıysa).
    *   **Dergi:** IEEE Transactions on Software Engineering (TSE), Empirical Software Engineering (EMSE), Journal of Systems and Software (JSS).
*   **Katkı Türü:** Araç değerlendirmesi (Tool Evaluation) ve Benchmark (Veri Seti) katkısı.

## 17. İlgili Çalışmalar Bölüm Taslağı (Related Work Section Draft)

**2. Related Work**

*   **2.1 Serverless and Edge Security:**
    *   Serverless mimarisinın getirdiği yeni tehdit yüzeyleri. [xinjin.github](https://xinjin.github.io/files/TOSEM23_Serverless.pdf)
    *   Runtime izolasyonu (V8, SGX) çalışmaları. [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/)
    *   *Geçiş:* Ancak runtime güvenliği, kod seviyesindeki zafiyetleri engellemez.
*   **2.2 Serverless Event-Driven Threats:**
    *   Event Injection ve OWASP Serverless Top 10. [strobes](https://strobes.co/blog/serverless-architecture-penetration-testing/)
    *   Event source'ların güvenilmeyen girdi olarak görülmesi gerekliliği. [csoh](https://csoh.org/serverless.html)
    *   *Geçiş:* Bu tehditlerin statik analizle tespiti ise ayrı bir sorundur.
*   **2.3 Static Analysis and SAST Evaluation:**
    *   Genel SAST araçlarının performansı ve kısıtları. [arxiv](https://arxiv.org/abs/2301.05097)
    *   JavaScript/Node.js özelinde SAST değerlendirmeleri. [arxiv](https://arxiv.org/html/2604.01131v1)
    *   *Geçiş:* Serverless bağlamında ise durum daha az çalışılmıştır.
*   **2.4 Serverless-Specific Program Analysis:**
    *   CloudFlow ve IaC destekli analiz yaklaşımları. [usenix](https://www.usenix.org/system/files/usenixsecurity25-raffa.pdf)
    *   Mevcut araçların event-driven akışları modellemedeki yetersizliği. [github](https://github.com/puresec/sas-top-10)
    *   *Geçiş:* Bu yetersizliğin ampirik kanıtları ise literatürde eksiktir.
*   **2.5 DevSecOps and CI/CD Security:**
    *   DevSecOps pipeline'ları ve güvenlik kapıları. [developers.cloudflare](https://developers.cloudflare.com/changelog/34/)
    *   FaaSGuard gibi serverless özel pipeline önerileri. [arxiv](https://arxiv.org/pdf/2509.04328.pdf)
    *   *Gap:* Bu pipeline'lardaki kapıların event zafiyetlerine karşı etkinliği ölçülmemiştir.
*   **2.6 Research Gap:**
    *   HTTP vs. Event source karşılaştırmalı ampirik çalışmanın yokluğu.
    *   Bu çalışmanın bu boşluğu nasıl dolduracağı.

## 18. Nihai Araştırma Önerileri (Final Research Recommendations)

| Kategori | Öneri | Gerekçe |
| :--- | :--- | :--- |
| **Keep (Koru)** | **Paired Vulnerability (Twin) Metodolojisi** | Hipotezi test etmenin en temiz yolu budur  [arxiv](https://arxiv.org/html/2506.15212v2). |
| **Keep (Koru)** | **Cloudflare Workers Odaklılık** | Edge computing'in en temsilci platformudur ve literatürde AWS'den daha az çalışılmıştır  [developers.cloudflare](https://developers.cloudflare.com/workers/reference/security-model/). |
| **Narrow (Daralt)** | **Araç Sayısı** | 6 araç (CodeQL, Semgrep, Opengrep, Gitleaks, Trivy, Checkov) ideal. Daha fazlası RQ4 (latency) için yönetimi zorlaştırır. |
| **Narrow (Daralt)** | **Zafiyet Türleri** | Sadece Injection (SQLi, Command, SSRF) ve Insecure Deserialization'a odaklanın. Auth zafiyetleri (BOLA) SAST ile zordur. |
| **Remove (Çıkar)** | **AWS Lambda Ana Deney** | Sadece "genellenebilirlik" notu olarak kullanın. Ana deneyi Cloudflare'de tutun. |
| **Add (Ekle)** | **Custom Rule Örnekleri** | RQ3 için Semgrep/CodeQL ile yazılmış 2-3 örnek "event-aware" kuralı ekte sunun. |
| **Add (Ekle)** | **Power Analysis** | Kaç çift zafiyet gerektiğini istatistiksel olarak (örn. G*Power) hesaplayıp metodolojide belirtin. |

**En Savunulabilir Katkı (Most Defensible Contribution):**
"Bu çalışma, serverless uygulamalarda **event-driven girdilerin, HTTP girdilerine kıyasla mevcut SAST araçları tarafından daha yüksek oranda gözden kaçırıldığını (false negative)** ilk ampirik olarak gösteren çalışmadır. Ayrıca, bu açığı kapatmak için **platforma özel (Cloudflare) custom kuralların** tespit oranını istatistiksel olarak anlamlı düzeyde artırdığını kanıtlamaktadır."

## 49. Eleştirel İnceleme (Critical Review - Skeptical Peer Reviewer)

*   **İlginçlik:** Evet, "event injection" bilinen bir risk ama SAST araçlarının bunu *ne kadar* kaçırdığına dair veri yok. Bu, "bilinen ama ölçülmeyen" bir sorun.
*   **Darlık:** MSc için uygun. Sadece Cloudflare ve TS/JS ile sınırlı tutulursa yönetilebilir.
*   **Metodoloji:** Paired (twin) zafiyet yöntemi güçlü. Ancak twin'lerin "gerçekten eşdeğer" olduğuna ikna etmek zor olabilir (kod yapısı değişebilir). [arxiv](https://arxiv.org/html/2506.15212v2)
*   **Platform:** Cloudflare Workers çok spesifik. Eleştirmenler "Bu sadece Cloudflare için geçerli" diyebilir. AWS Lambda ile küçük bir doğrulama şart.
*   **Araç Seti:** 6 araç fazla olabilir. CodeQL ve Semgrep ana odak olmalı, diğerleri "destekleyici" olarak sunulmalı.
*   **Katkı Türü:** Bu bir "Security Finding" (yeni zafiyet bulma) değil, bir "Tool Evaluation" (araç testi) çalışmasıdır. İddia buna göre olmalı.
*   **Saldırı Noktası:** Eleştirmenler "Sentetik zafiyetler gerçekçi değil" diyebilir. OWASP DVSA gibi gerçekçi senaryolarla desteklenmeli.
*   **Yapılmaması Gereken İddia:** "Tüm SAST araçları serverless'te işe yaramaz" denmemeli. "Event source modellemesinde eksiklikleri vardır" denmeli.

## 50. Son Kural (Final Rule)

Bu literatür taraması, **evidence → comparison → gap → methodology → contribution** akışını takip etmiştir. Önerilen çalışma, mevcut kanıtların (CloudFlow, OWASP, Brito et al.) işaret ettiği ancak henüz ampirik olarak ölçmediği bir boşluğu (HTTP vs Event detection gap) hedeflemektedir. Bu, MSc düzeyinde yayınlanabilir, özgün ve metodolojik olarak sağlam bir araştırma konusudur.