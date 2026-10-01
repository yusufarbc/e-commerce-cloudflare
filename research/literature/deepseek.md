# KAPSAMLI SİSTEMATİK LİTERATÜR TARAMASI VE ARAŞTIRMA BOŞLUĞU ANALİZİ

---

## 1. ARAŞTIRMA PROJESİ BAĞLAMI

### Çalışma Başlığı Değerlendirmesi

Önerilen başlık: **"Do Default DevSecOps Gates See the Serverless Edge? An Empirical Study of Detection Gaps for Event-Sourced and Platform-Specific Vulnerabilities"**

Bu başlık, literatürdeki konumlandırmayı büyük ölçüde desteklemektedir. Ancak aşağıdaki alternatifler bilimsel olarak daha güçlü olabilir:

**Alternatif 1:** *"Event-Source Blindness in Static Analysis: An Empirical Evaluation of Default SAST Rules for Serverless Edge Applications"*

**Alternatif 2:** *"HTTP vs. Event-Driven Sources: A Paired-Vulnerability Study of SAST Detection Gaps in Serverless Edge Computing"*

**Alternatif 3:** *"Platform-Aware Security Gates for Serverless Edge: Measuring and Mitigating SAST False Negatives in Event-Driven Dataflows"*

Bu alternatifler, çalışmanın özünü (HTTP vs. event kaynaklı eşleştirilmiş zafiyetler, SAST tespit boşlukları, serverless edge bağlamı) korurken daha kesin bir bilimsel çerçeve sunmaktadır.

### Araştırma Alanı Konumlandırması

Çalışma şu kesişimde konumlanmaktadır:

**Serverless Edge Computing × Event-Driven Applications × Static Security Analysis × DevSecOps × CI/CD Security Gates**

Bu konumlandırma, literatürde henüz yeterince ele alınmamış bir boşluğa işaret etmektedir. Mevcut çalışmalar genellikle ya serverless güvenliğine genel bir perspektiften yaklaşmakta (Marin vd., 2022; Ni vd., 2024) ya da SAST araçlarını genel yazılım güvenliği bağlamında değerlendirmektedir (Bennett vd., 2024). Ancak bu iki alanın kesişiminde, özellikle **event kaynaklarının taint source olarak modellenmesi** ve **HTTP vs. event kaynaklı veri akışlarının SAST tarafından algılanma farkı** sistematik olarak incelenmemiştir.

---

## 2. ÇEKİRDEK ARAŞTIRMA HİPOTEZİ DEĞERLENDİRMESİ

Önerilen hipotez şudur:

> *Varsayılan SAST kural setleri ve veri akışı modelleri, kuyruk mesajları, zamanlanmış olaylar, nesne depolama olayları, webhook'lar ve platforma özgü olay bağlamaları gibi HTTP dışı olay kaynaklarını güvenilmeyen girdi (untrusted input) olarak yeterince modellemeyebilir. Sonuç olarak, HTTP tabanlı zafiyetlerle yapısal olarak eşdeğer olan zafiyetler, aynı taint'li veri akışı bir olay güdümlü kaynaktan geldiğinde önemli ölçüde daha düşük oranlarda tespit edilebilir.*

### Literatür Desteği Analizi

**Destekleyen Kanıtlar:**

1. **CloudFlow (Raffa vd., USENIX Security 2025)**, serverless uygulamalarda güvenlik açısından hassas veri akışlarını statik olarak tespit etmek için yeni bir çerçeve sunmaktadır. Yazarlar, "event-triggered code ve cloud servislerinin kara kutu doğası nedeniyle" geleneksel statik analizin yetersiz kaldığını açıkça belirtmektedir. CloudFlow, event kaynaklarını ve handler'lar arası veri akışlarını modellemek için özel bir yaklaşım gerektirmektedir. Bu, mevcut SAST araçlarının bu tür akışları doğal olarak modellemediğini dolaylı olarak göstermektedir .

2. **SymFlow (2026)** , event-chain-aware sembolik yürütme yoluyla serverless hassas veri akışı tespiti için bir çerçeve önermektedir. Yazarlar, "event-driven nature'ın, trigger-handler ilişkilerinin sıklıkla dinamik olarak belirlendiği karmaşık event chain'ler yarattığını" vurgulamaktadır . Bu, geleneksel statik analiz araçlarının bu dinamik yapıyı modellemede zorlandığını göstermektedir.

3. **"Towards Inter-service Data Flow Analysis of Serverless Applications"** başlıklı çalışma, "serverless uygulamaların event-driven mimarisinin ve çağırdıkları servislerin kara kutu doğasının statik analizi zorlaştırdığını" belirtmektedir .

4. **Brito vd. (IEEE Transactions on Reliability, 2023)** , Node.js paketlerinde zafiyet tespiti için JavaScript statik analiz araçlarını incelemiş ve bu araçların etkinliğini değerlendirmiştir. Çalışma, JavaScript/TypeScript ekosistemindeki statik analiz araçlarının sınırlamalarına dair önemli kanıtlar sunmaktadır .

**Çelişen veya Belirsiz Kanıtlar:**

- **FaaSGuard (Barrak vd., 2025)** , OpenFaaS için bir DevSecOps pipeline'ı önermekte ve %95 precision, %91 recall elde ettiğini raporlamaktadır . Ancak bu çalışma, event kaynaklarını özel olarak HTTP kaynaklarıyla karşılaştırmamakta ve tespit oranlarının kaynak türüne göre değişip değişmediğini incelememektedir.

- **Marin vd. (2022)** , serverless güvenliğine kapsamlı bir bakış sunmakta ancak event kaynaklarının statik analiz araçları tarafından nasıl modellendiğine dair spesifik bir değerlendirme yapmamaktadır .

### Sonuç

Mevcut literatür, hipotezi **dolaylı olarak desteklemekte ancak doğrudan test etmemektedir**. CloudFlow ve SymFlow gibi çalışmalar, event-driven yapıların statik analiz için özel zorluklar yarattığını göstermekte, ancak HTTP vs. event kaynağı ayrımını sistematik olarak ölçmemektedir. Bu nedenle hipotez, **makul ve literatürle tutarlı ancak ampirik olarak doğrulanmamış** bir önerme olarak değerlendirilmelidir.

---

## 3. ARAŞTIRMA SORULARI BAĞLAMINDA LİTERATÜR DEĞERLENDİRMESİ

### RQ1: Varsayılan CI güvenlik kapıları serverless'e özgü zafiyetleri ne kadar etkili tespit eder?

**İlgili Literatür:**

- **Bennett vd. (EASE 2024)** , dört SAST aracını (Semgrep dahil) üretim kodunda değerlendirmiş ve bireysel araçların tespit oranlarının %11.2 ile %26.5 arasında değiştiğini, dördünün kombinasyonunun ise %38.8'e ulaştığını bulmuştur . Çalışma ayrıca SAST araçlarının zafiyetlerin %61.2'sini tespit edemediğini ve bunun başlıca nedeninin "eksik veya yetersiz kural setleri" olduğunu ortaya koymuştur .

- **FaaSGuard (2025)** , serverless'e özgü bir DevSecOps pipeline'ı önermekte ve %95 precision, %91 recall raporlamaktadır. Ancak bu sonuçlar OpenFaaS platformuna özgüdür ve varsayılan araç yapılandırmalarını değil, özel olarak tasarlanmış bir pipeline'ı yansıtmaktadır .

- **CloudFlow (USENIX Security 2025)** , varsayılan statik analiz araçlarının serverless uygulamalarda güvenlik açısından hassas veri akışlarını tespit etmekte yetersiz kaldığını göstermektedir. Çalışma, özel bir framework geliştirilmesi ihtiyacını ortaya koymaktadır .

**Boşluk:** Mevcut çalışmalar ya genel SAST değerlendirmeleri sunmakta ya da serverless'e özgü özel çözümler önermektedir. **Varsayılan (default) CI güvenlik kapılarının serverless bağlamındaki performansını doğrudan ölçen sistematik bir çalışma tespit edilememiştir.**

### RQ2: Aynı zafiyet HTTP yerine event-driven kaynaktan geldiğinde tespit etkinliği düşer mi?

**İlgili Literatür:**

- **CloudFlow (2025)** , event-triggered kodun ve kara kutu cloud servislerinin statik analizi zorlaştırdığını açıkça belirtmektedir. Çalışma, serverless uygulamalarda güvenlik açısından hassas veri akışlarını tespit etmek için özel bir framework geliştirmiştir .

- **SymFlow (2026)** , event-chain-aware sembolik yürütme yoluyla serverless hassas veri akışı tespiti için bir çerçeve önermektedir. Yazarlar, "event-driven nature'ın, trigger-handler ilişkilerinin sıklıkla dinamik olarak belirlendiği karmaşık event chain'ler yarattığını" vurgulamaktadır .

- **"Towards Inter-service Data Flow Analysis of Serverless Applications"** , event-driven mimarinin ve kara kutu servislerin statik analizi zorlaştırdığını belirtmektedir .

**Boşluk:** Hiçbir çalışma, **aynı zafiyetin HTTP ve event kaynaklı versiyonlarını eşleştirilmiş (paired) bir tasarımla** karşılaştırmamıştır. CloudFlow ve SymFlow, event-driven yapıların zorluklarını göstermekte ancak HTTP kaynaklı eşdeğerleriyle doğrudan bir karşılaştırma yapmamaktadır. Bu, RQ2'nin literatürde **doğrudan ele alınmamış** olduğunu göstermektedir.

### RQ3: Platforma duyarlı özel güvenlik kuralları tespit boşluklarını azaltabilir mi?

**İlgili Literatür:**

- **Bennett vd. (EASE 2024)** , Semgrep için özel kurallar oluşturarak tespit oranını %44.7'ye çıkarmış ve Semgrep'in varsayılan tespit oranında %181 iyileşme sağlamıştır . Bu, özel kuralların potansiyelini göstermektedir.

- **Semgrep'in Cloudflare Workers projelerinde kullanımı** (örneğin, dmarc-email-worker projesi) belgelenmiştir, ancak bu kullanım akademik olarak değerlendirilmemiştir .

- **Policy-as-Code** yaklaşımları serverless bağlamında önerilmektedir ancak bunların SAST tespit boşluklarını kapatmadaki etkinliği sistematik olarak ölçülmemiştir .

**Boşluk:** Özel kuralların genel SAST performansını artırdığı gösterilmiştir, ancak **serverless edge platformlarına özgü (Cloudflare Workers, D1, R2, KV, Queues) özel kuralların** tespit boşluklarını ne ölçüde kapatabileceği araştırılmamıştır.

### RQ4: Bu güvenlik kapılarının CI/CD performansına getirdiği ek yük nedir?

**İlgili Literatür:**

- **FaaSGuard (2025)** , CI/CD süreçlerine "önemli bir aksama olmaksızın" entegre olduğunu iddia etmekte ancak nicel performans ölçümleri sunmamaktadır .

- **Bennett vd. (EASE 2024)** , SAST araçlarının "hızlı, kaynak açısından ekonomik ve CI pipeline'larına entegre edilebilir" olduğunu belirtmekte ancak nicel gecikme ölçümleri raporlamamaktadır .

**Boşluk:** Serverless edge bağlamında güvenlik kapılarının **pipeline gecikmesi, CPU/bellek tüketimi ve geliştirici geri bildirim süresi** üzerindeki nicel etkisini ölçen sistematik bir çalışma tespit edilememiştir.

---

## 4. LİTERATÜR TARAMA KAPSAMI VE BULGULAR

### ALAN A — SERVERLESS EDGE COMPUTING VE RUNTIME GÜVENLİĞİ

**Temel Çalışmalar:**

- **Wen vd. (ACM TOSEM, 2023)** , serverless computing üzerine kapsamlı bir sistematik literatür taraması sunmaktadır. 164 makaleyi 17 araştırma yönünde inceleyen çalışma, performans optimizasyonu, programlama framework'leri, uygulama migrasyonu, multi-cloud geliştirme ve test/debugging gibi konuları kapsamaktadır. Ancak çalışma, güvenlik konusunu ayrı bir araştırma yönü olarak ele almamakta, bu da alandaki bir boşluğa işaret etmektedir .

- **Marin vd. (Journal of Cloud Computing, 2022)** , serverless mimarilerin güvenlik açısından kapsamlı bir analizini sunmaktadır. Yazarlar, "serverless mimarilerin güvenlik eksikliklerini, olası karşı önlemleri ve birkaç araştırma yönünü" ortaya koymaktadır . Çalışma, hem ticari hem de açık kaynaklı serverless platformların güvenlik özelliklerini karşılaştırmaktadır .

- **Ni vd. (Journal of Cloud Computing, 2024)** , serverless computing için çok katmanlı bir soyut model sunmakta ve her katman için güvenlik risklerinin nicel analizini yapmaktadır. Attack Tree ve Attack-Defense Tree metodolojilerini kullanarak güvenlik risklerini ve karşı önlemleri nicelleştirmektedir. Yazarlar, "Relative Risk Matrix (RRM)" adında yeni bir ölçüt önermektedir .

- **Cloudflare Workers güvenlik mimarisi** hakkında resmi Cloudflare dokümantasyonu, V8 isolate'lerinin farklı script'leri ayırmak için kullanıldığını ve V8'in sürekli olarak fuzzers ve sanitizers ile test edildiğini belirtmektedir . Bu, gri literatür kapsamında değerlendirilmelidir.

**Tespit Edilen Boşluk:** Serverless edge computing güvenliği üzerine akademik çalışmalar sınırlıdır ve özellikle **Cloudflare Workers** gibi edge platformlarına özgü güvenlik analizleri neredeyse yok denecek kadar azdır. Mevcut çalışmalar daha çok AWS Lambda ve OpenFaaS gibi platformlara odaklanmaktadır.

### ALAN B — SERVERLESS UYGULAMA GÜVENLİĞİ VE EVENT-DRIVEN TEHDİTLER

**Temel Çalışmalar:**

- **FaaSGuard (Barrak vd., 2025)** , OpenFaaS için birleşik bir DevSecOps pipeline'ı önermektedir. Çalışma, "injection attacks, hard-coded secrets ve resource exhaustion" gibi tehditleri ele almaktadır. FaaSGuard, planlama, kodlama, build, deployment ve monitoring aşamalarının her birine hafif, fail-closed güvenlik kontrolleri yerleştirmektedir . Çalışma, 20 gerçek dünya serverless fonksiyonu üzerinde değerlendirilmiştir .

- **CloudFlow (USENIX Security 2025)** , serverless uygulamalarda güvenlik açısından hassas veri akışlarını statik olarak tespit etmek için yeni bir framework sunmaktadır. Yazarlar, "event-triggered code ve cloud servislerinin kara kutu doğası nedeniyle" geleneksel statik analizin yetersiz kaldığını belirtmektedir. CloudFlow, tüm microbenchmark'ları geçmekte ve gerçek dünya uygulamalarında 11 kod injection ve bilgi sızıntısı zafiyeti tespit etmektedir .

- **OWASP Serverless Top 10** , serverless uygulama güvenliği için en yaygın zafiyetleri tanımlamaktadır. Liste, injection, broken authentication, insecure serverless deployment configuration, over-privileged function permissions ve denial of service & financial resource exhaustion gibi kategorileri içermektedir .

- **OWASP DVSA (Damn Vulnerable Serverless Application)** , serverless uygulama güvenliğini test etmek ve öğrenmek için kasıtlı olarak zafiyetli bir uygulamadır. DVSA, "over-privileged roles, insecure configurations, broken access control ve vulnerable dependencies" gibi yaygın güvenlik risklerini içermektedir .

**Tespit Edilen Boşluk:** Mevcut çalışmalar, serverless güvenlik tehditlerini tanımlamakta ve bazı özel çözümler önermektedir. Ancak **event kaynaklarının taint source olarak modellenmesi** ve bu kaynakların statik analiz araçları tarafından nasıl ele alındığı sistematik olarak incelenmemiştir.

### ALAN C — CI/CD PIPELINE GÜVENLİĞİ VE YAZILIM TEDARİK ZİNCİRİ

**Temel Çalışmalar:**

- **Rajapakse vd. (Information and Software Technology, 2022)** , DevSecOps benimseme zorlukları ve çözümleri üzerine sistematik bir literatür taraması sunmaktadır. Çalışma, 21 zorluk ve 31 spesifik çözüm tanımlamakta ve bunların eşleştirmesini yapmaktadır. Yazarlar, "tool-related challenges and solutions" en sık raporlanan kategoriler olduğunu belirtmektedir . Çalışma ayrıca "security testing tools that target the continuous practices in DevSecOps" konusunda önemli bir boşluk olduğunu vurgulamaktadır .

- **GitHub Actions OIDC** dokümantasyonu, statik, uzun ömürlü bulut kimlik bilgileri yerine kısa ömürlü token'ların kullanılmasını önermektedir. OIDC, workflow'ların bulut sağlayıcılarından doğrudan kısa ömürlü token'lar almasını sağlamaktadır . Bu, gri literatür kapsamındadır.

- **Preview deployment güvenliği** konusunda, `pull_request_target` tetikleyicisinin fork PR'ları için güvenlik riskleri taşıdığı belgelenmiştir. Bu tetikleyici, temel repository'nin bağlamında çalışmakta ve secret'lara erişebilmektedir . Daha güvenli bir yaklaşım, `pull_request` ve `workflow_run` olaylarını kullanan iki aşamalı bir workflow'dur .

**Tespit Edilen Boşluk:** CI/CD güvenliği üzerine önemli çalışmalar olmakla birlikte, bu çalışmalar genellikle genel CI/CD güvenliğine odaklanmakta ve **serverless edge deployment sürecine özgü güvenlik sınırlarını** (kaynak kod → CI pipeline → güvenlik kapıları → deployment CLI → serverless edge platform) sistematik olarak incelememektedir.

### ALAN D — DEVSECOPS GÜVENLİK KAPILARI

**Temel Çalışmalar:**

- **Bennett vd. (EASE 2024)** , SAST araçlarının sınırlamalarını üretim kodu üzerinde değerlendirmektedir. Çalışma, bireysel araçların tespit oranlarının %11.2 ile %26.5 arasında değiştiğini, dört aracın kombinasyonunun ise %38.8'e ulaştığını bulmuştur. Yazarlar ayrıca SAST araçlarının zafiyetlerin %61.2'sini tespit edemediğini ve bunun başlıca nedeninin "eksik veya yetersiz kural setleri" olduğunu ortaya koymuştur .

- **FaaSGuard (2025)** , serverless'e özgü bir DevSecOps pipeline'ı önermekte ve %95 precision, %91 recall raporlamaktadır. Çalışma, planlama aşamasından monitoring aşamasına kadar tüm yaşam döngüsünü kapsamaktadır .

- **Feio vd. (2024)** , DevSecOps'a odaklanan ve sürekli güvenlik testini inceleyen ampirik bir çalışma sunmaktadır .

**Tespit Edilen Boşluk:** DevSecOps güvenlik kapıları üzerine genel çalışmalar mevcuttur, ancak bunlar **serverless'e özgü zafiyetleri** (event injection, platform-specific misconfigurations, binding security) özel olarak değerlendirmemektedir.

### ALAN E — STATİK UYGULAMA GÜVENLİK TESTİ (SAST)

**Temel Çalışmalar:**

- **Brito vd. (IEEE Transactions on Reliability, 2023)** , Node.js paketlerinde zafiyet tespiti için JavaScript statik analiz araçlarını incelemektedir. Çalışma, JavaScript/TypeScript ekosistemindeki statik analiz araçlarının etkinliğini değerlendirmekte ve bu araçların sınırlamalarına dair önemli kanıtlar sunmaktadır .

- **Bennett vd. (EASE 2024)** , Semgrep, CodeQL ve diğer SAST araçlarını değerlendirmekte ve özel kuralların tespit oranını önemli ölçüde artırabileceğini göstermektedir. Semgrep için oluşturulan yeni kurallar, tespit oranını %44.7'ye çıkarmış ve %181 iyileşme sağlamıştır .

- **CodeQL vs. Semgrep** karşılaştırmaları, CodeQL'in "daha derin veri akışı analizi" sunduğunu ancak Semgrep'in "CI'da daha hızlı çalıştığını ve özel kurallar yazmanın daha kolay olduğunu" göstermektedir .

**Tespit Edilen Boşluk:** JavaScript/TypeScript SAST araçları üzerine çalışmalar mevcuttur, ancak bu araçların **serverless edge platformlarına özgü API'leri** (Cloudflare Workers bindings, D1, R2, KV, Queues) nasıl modellediği araştırılmamıştır.

### ALAN F — SAST BENCHMARK'LARI VE ARAÇ DEĞERLENDİRMESİ

**Temel Çalışmalar:**

- **OWASP Benchmark** , binlerce test vakası içeren kasıtlı olarak zafiyetli bir Java uygulamasıdır. Her test vakası, gerçek bir zafiyet veya zafiyet gibi görünen bir decoy olarak etiketlenmiştir . Benchmark, SAST, DAST ve IAST araçları tarafından analiz edilebilir .

- **Juliet Test Suite** , daha kapsamlı ve kapsayıcı bir zafiyet test paketi sunmaktadır. OWASP Benchmark'ın "gerçek dünya, dengesiz doğası nedeniyle çeşitlilikten yoksun" olduğu belirtilmektedir .

- **Bennett vd. (EASE 2024)** , sentetik benchmark'ların "iyi ground truth ve istatistiksel olarak anlamlı sonuçlar elde etmek için yeterli örnek" sağladığını ancak "sentetik verilere dayanan sonuçların üretim ortamlarındaki performansı yansıtmasının muhtemel olmadığını" belirtmektedir .

**Tespit Edilen Boşluk:** Mevcut benchmark'lar genel amaçlıdır ve **serverless edge platformlarına özgü zafiyetleri** içermemektedir. Eşleştirilmiş (paired) HTTP/event zafiyet benchmark'ları mevcut değildir.

### ALAN G — EVENT KAYNAKLARI VE TAINT-SOURCE MODELLEMESİ

Bu, araştırma için en kritik alandır.

**Temel Çalışmalar:**

- **CloudFlow (USENIX Security 2025)** , serverless uygulamalarda güvenlik açısından hassas veri akışlarını statik olarak tespit etmek için özel bir framework sunmaktadır. Yazarlar, "event-triggered kodun ve kara kutu cloud servislerinin statik analizi zorlaştırdığını" açıkça belirtmektedir .

- **SymFlow (2026)** , event-chain-aware sembolik yürütme yoluyla serverless hassas veri akışı tespiti için bir çerçeve önermektedir. SymFlow, "event-chain coverage'ı %57.8 artırmakta" ve runtime-determined dependency'leri içeren event chain'lerde önemli iyileşme sağlamaktadır .

- **"Towards Inter-service Data Flow Analysis of Serverless Applications"** , event-driven mimarinin ve kara kutu servislerin statik analizi zorlaştırdığını belirtmektedir .

- **"Static Taint Analysis of Event-driven Scheme Programs" (Bleser vd., 2017)** , event-driven programlarda statik taint analizinin zorluklarını ele almaktadır. Event listener'ların dinamik olarak kaydedilebildiğini ve event sırasının non-deterministik olabileceğini belirtmektedir .

**KRİTİK TESPİT:** Hiçbir çalışma, **HTTP source → vulnerability sink** akışını **event source → aynı vulnerability sink** akışıyla, altta yatan zafiyeti semantik olarak eşdeğer tutarak karşılaştırmamıştır. Bu, araştırmanın merkezinde yer alan ve literatürde **doğrudan ele alınmamış** bir boşluktur.

### ALAN H — IaC, KONFİGÜRASYON VE POLICY-AS-CODE GÜVENLİĞİ

**Temel Çalışmalar:**

- **Checkov** , Terraform, CloudFormation, Kubernetes, Helm, ARM Templates ve **Serverless Framework** dahil olmak üzere çeşitli IaC formatlarını tarayabilen bir statik kod analiz aracıdır. Checkov, "1,000'den fazla yerleşik policy" içermekte ve custom rules (YAML veya Python) desteği sunmaktadır .

- **Policy-as-Code** yaklaşımları serverless bağlamında önerilmektedir. Örneğin, "CIATfunc" adlı bir framework, "Policy-as-Code for defining high-level security requirements with Infrastructure-as-Code for automating resource provisioning" kombinasyonunu sunmaktadır .

**Tespit Edilen Boşluk:** Checkov gibi araçlar Serverless Framework'ü desteklemekte ancak **Cloudflare Workers'a özgü konfigürasyonları** (wrangler.jsonc/toml, Worker bindings, D1, R2, KV, Queues) anlayıp anlamadığı belirsizdir. Bu konuda akademik bir değerlendirme tespit edilememiştir.

### ALAN I — SCA, SECRETS VE BAĞIMLILIK GÜVENLİĞİ

**Temel Çalışmalar:**

- **Brito vd. (2023)** , Node.js paketlerinde zafiyet tespiti için JavaScript statik analiz araçlarını incelemektedir. Bu çalışma, SCA ve SAST araçlarının npm ekosistemindeki etkinliğini değerlendirmektedir .

- **Trivy** ve **OSV-Scanner** gibi araçlar, bağımlılık zafiyetlerini tespit etmek için yaygın olarak kullanılmaktadır. Ancak bunların serverless edge bağlamındaki etkinliği sistematik olarak değerlendirilmemiştir.

**Tespit Edilen Boşluk:** SCA ve secret scanning araçlarının **serverless edge bağlamında SAST'ı nasıl tamamladığı** (complement) sistematik olarak araştırılmamıştır.

### ALAN J — ZERO TRUST, API GÜVENLİĞİ VE PREVIEW ORTAMLARI

**Temel Çalışmalar:**

- **Preview deployment güvenliği** konusunda, `pull_request_target` tetikleyicisinin fork PR'ları için güvenlik riskleri taşıdığı belgelenmiştir . Cloudflare Pages dokümantasyonu, preview deployment'lara erişimi kısıtlamak için authentication gerektirilebileceğini belirtmektedir .

- **Coolify dokümantasyonu** , "production environment variables'ın yalnızca main deployment tarafından kullanıldığını ve pull-request previews'a aktarılmadığını" belirtmektedir. Ayrıca, "untrusted pull request'ler için production credentials'ın preview variables'a kopyalanmaması" gerektiği vurgulanmaktadır .

**Tespit Edilen Boşluk:** Preview deployment güvenliği konusunda en iyi uygulamalar mevcuttur, ancak bu konuda **akademik ampirik çalışmalar** tespit edilememiştir. Mevcut bilgi ağırlıklı olarak gri literatüre dayanmaktadır.

### ALAN K — CI/CD KİMLİK VE DEPLOYMENT GÜVENLİĞİ

**Temel Çalışmalar:**

- **GitHub Actions OIDC** dokümantasyonu, statik, uzun ömürlü bulut kimlik bilgileri yerine kısa ömürlü token'ların kullanılmasını önermektedir. OIDC, workflow'ların bulut sağlayıcılarından doğrudan kısa ömürlü token'lar almasını sağlamaktadır .

- **GitHub Actions OIDC token'ları** artık repository custom properties'lerini claims olarak desteklemektedir. Bu, "attribute-based access control (ABAC) policies" oluşturulmasına olanak tanımaktadır .

**Tespit Edilen Boşluk:** CI/CD kimlik ve deployment güvenliği konusunda önemli çalışmalar olmakla birlikte, bunların **serverless edge deployment** bağlamındaki etkinliği sistematik olarak değerlendirilmemiştir.

### ALAN L — METODOLOJİK VE İSTATİSTİKSEL PRECEDENT'LAR

**Temel Çalışmalar:**

- **McNemar's test** , eşleştirilmiş binary sonuçlar için uygun bir istatistiksel testtir. Bir çalışmada, "GPT-4 ve iki SAST aracı (SonarQube ve Cloud Defence) arasında 32 curated security scenario üzerinde karşılaştırmalı bir çalışma" yapılmış ve "paired outcomes McNemar's test kullanılarak değerlendirilmiştir" .

- **Cochran's Q testi** , "üç veya daha fazla ilişkili grup arasında dichotomous dependent variable'da fark olup olmadığını belirlemek için" kullanılabilir. Bu test, "McNemar's testinin genelleştirilmiş bir versiyonu olarak üç veya daha fazla classifier'ı karşılaştırmak için uygulanabilir" .

**Tespit Edilen Boşluk:** İstatistiksel metodoloji literatürü mevcuttur, ancak bu yöntemlerin **serverless edge SAST değerlendirmesi** bağlamında uygulanmasına dair spesifik precedent'ler sınırlıdır.

---

## 5. DOĞRULANMIŞ SEED ÇALIŞMALAR

| # | Yazarlar | Yıl | Başlık | Venue | DOI/URL | Doğrulama Durumu |
|---|----------|-----|--------|-------|---------|-------------------|
| 1 | Barrak, A., Ksontini, E., Atike, R., Jaafar, F. | 2025 | FaaSGuard: Secure CI/CD for Serverless Applications – An OpenFaaS Case Study | arXiv:2509.04328 | arXiv:2509.04328 | ✅ Doğrulandı |
| 2 | Bennett, G., Hall, T., Winter, E., Counsell, S. | 2024 | Semgrep*: Improving the Limited Performance of Static Application Security Testing (SAST) Tools | EASE 2024 | 10.1145/3661167.3661262 | ✅ Doğrulandı |
| 3 | Brito, T., Ferreira, M., Monteiro, M., Lopes, P., Barros, M., Santos, J.F., Santos, N. | 2023 | Study of JavaScript Static Analysis Tools for Vulnerability Detection in Node.js Packages | IEEE Trans. Reliab. 72(4) | 10.1109/TR.2023.3286294 | ✅ Doğrulandı |
| 4 | Rajapakse, R.N., Zahedi, M., Babar, M.A., Shen, H. | 2022 | Challenges and solutions when adopting DevSecOps: A systematic review | Information and Software Technology, 141 | 10.1016/j.infsof.2021.106700 | ✅ Doğrulandı |
| 5 | Marin, E., Perino, D., Di Pietro, R. | 2022 | Serverless computing: a security perspective | Journal of Cloud Computing, 11(69) | 10.1186/s13677-022-00344-z | ✅ Doğrulandı |
| 6 | Ni, K., Mondal, S.K., Kabir, H.M.D., Tan, T., Dai, H.-N. | 2024 | Toward security quantification of serverless computing | Journal of Cloud Computing, 13(140) | 10.1186/s13677-024-00703-y | ✅ Doğrulandı |
| 7 | Wen, J., Chen, Z., Jin, X., Liu, X. | 2023 | Rise of the Planet of Serverless Computing: A Systematic Review | ACM TOSEM, 32(5) | 10.1145/3589640 | ✅ Doğrulandı |
| 8 | OWASP | 2019 | Damn Vulnerable Serverless Application (DVSA) | OWASP VWAD | OWASP DVSA | ✅ Doğrulandı |
| 9 | OWASP | 2018 | OWASP Serverless Top 10 | OWASP | owasp.org | ✅ Doğrulandı |

---

## 6. BOOLEAN ARAMA DİZİLERİ

### Veritabanına Özgü Arama Dizileri

**IEEE Xplore:**
```
("serverless" OR "FaaS" OR "Function-as-a-Service" OR "edge computing") AND ("security" OR "vulnerability" OR "attack") AND ("static analysis" OR "SAST" OR "taint analysis" OR "dataflow")
```

**ACM Digital Library:**
```
[All: "serverless"] AND [All: "security"] AND ([All: "static analysis"] OR [All: "taint analysis"] OR [All: "dataflow"])
```

**Scopus:**
```
TITLE-ABS-KEY(("serverless" OR "FaaS" OR "edge computing") AND ("security" OR "vulnerability") AND ("static analysis" OR "SAST" OR "taint analysis"))
```

**Web of Science:**
```
TS=((serverless OR FaaS OR "edge computing") AND (security OR vulnerability) AND ("static analysis" OR SAST OR "taint analysis"))
```

**SpringerLink:**
```
("serverless" AND "security" AND ("static analysis" OR "taint analysis"))
```

**ScienceDirect:**
```
Title, abstract, keywords: ("serverless" AND "security" AND "static analysis")
```

**arXiv:**
```
all:"serverless" AND all:"security" AND (all:"static analysis" OR all:"taint analysis" OR all:"dataflow")
```

**Google Scholar:**
```
"serverless" "security" ("static analysis" OR "SAST") ("event" OR "trigger")
```

### 20 Arama Ailesi

| # | Arama Ailesi | Boolean Sorgu |
|---|-------------|---------------|
| 1 | Serverless × Security | `("serverless" OR "FaaS" OR "function-as-a-service") AND ("security" OR "vulnerability" OR "threat")` |
| 2 | Serverless × Static Analysis | `("serverless" OR "FaaS") AND ("static analysis" OR "SAST" OR "program analysis")` |
| 3 | Serverless × Event Injection | `("serverless" OR "FaaS") AND ("event injection" OR "event spoofing" OR "trigger manipulation")` |
| 4 | Event Source × Taint Analysis | `("event source" OR "event-driven") AND ("taint analysis" OR "taint tracking" OR "information flow")` |
| 5 | Serverless × DevSecOps | `("serverless" OR "FaaS") AND ("DevSecOps" OR "security gate" OR "shift-left")` |
| 6 | Serverless × CI/CD Security | `("serverless" OR "FaaS") AND ("CI/CD" OR "continuous integration" OR "pipeline security")` |
| 7 | Edge Computing × CI/CD Security | `("edge computing" OR "edge functions") AND ("CI/CD" OR "pipeline" OR "deployment") AND ("security")` |
| 8 | Cloudflare Workers × Security | `("Cloudflare Workers" OR "V8 isolates" OR "edge functions") AND ("security" OR "vulnerability")` |
| 9 | JavaScript/TypeScript × SAST | `("JavaScript" OR "TypeScript" OR "Node.js") AND ("SAST" OR "static analysis") AND ("vulnerability")` |
| 10 | SAST × False Negatives | `("SAST" OR "static analysis") AND ("false negative" OR "detection gap" OR "missed vulnerability")` |
| 11 | SAST × Benchmark | `("SAST" OR "static analysis") AND ("benchmark" OR "evaluation" OR "comparison")` |
| 12 | IaC × Serverless Security | `("infrastructure-as-code" OR "IaC") AND ("serverless" OR "FaaS") AND ("security" OR "misconfiguration")` |
| 13 | Policy-as-Code × Serverless | `("policy-as-code" OR "OPA" OR "Rego") AND ("serverless" OR "FaaS")` |
| 14 | GitHub Actions × Supply Chain Security | `("GitHub Actions") AND ("supply chain" OR "pipeline security" OR "workflow security")` |
| 15 | GitHub Actions × OIDC × Security | `("GitHub Actions") AND ("OIDC" OR "OpenID Connect") AND ("security" OR "credential")` |
| 16 | Preview Deployment × Security | `("preview deployment" OR "ephemeral environment") AND ("security" OR "isolation")` |
| 17 | Serverless × Vulnerability Detection | `("serverless" OR "FaaS") AND ("vulnerability detection" OR "vulnerability discovery")` |
| 18 | Event-driven Architecture × Security Analysis | `("event-driven architecture" OR "event-driven") AND ("security analysis" OR "threat model")` |
| 19 | Serverless × Dataflow Analysis | `("serverless" OR "FaaS") AND ("dataflow analysis" OR "data flow analysis")` |
| 20 | DevSecOps × Security Gate Evaluation | `("DevSecOps") AND ("security gate" OR "quality gate") AND ("evaluation" OR "assessment")` |

---

## 7. KAVRAM HARİTASI

| Kavram | Tanım | Eşanlamlılar / Varyantlar | Yakından İlgili Kavramlar | Çalışmaya İlgisi |
|--------|-------|---------------------------|---------------------------|-------------------|
| **Serverless Edge Computing** | Kullanıcıların sunucu yönetimi olmadan edge lokasyonlarında kod çalıştırmasına olanak tanıyan dağıtık hesaplama paradigması | Edge Functions, Edge Computing, Serverless Computing | FaaS, CDN, V8 Isolates | Araştırmanın temel platformu |
| **FaaS** | Function-as-a-Service; olay güdümlü, geçici fonksiyonların çalıştırılması modeli | Serverless Functions, Lambda, Cloud Functions | Serverless Computing, Event-Driven | Runtime modeli |
| **Event-driven Architecture** | Sistem bileşenlerinin olaylar aracılığıyla iletişim kurduğu mimari desen | Message-driven, Event-based, Publish-Subscribe | Event Source, Trigger, Handler | Araştırmanın merkezi |
| **Event Injection** | Güvenilmeyen girdinin olay verisi aracılığıyla sisteme enjekte edilmesi | Event Spoofing, Trigger Manipulation | Injection Attack, Taint Source | Araştırmanın odak zafiyet sınıfı |
| **Event Source** | Bir fonksiyonu tetikleyen olayı üreten kaynak | Trigger, Event Producer, Message Broker | Queue, Cron, Webhook, Object Storage | Taint source olarak modellenmesi gereken |
| **Taint Source** | Güvenilmeyen verinin sisteme girdiği nokta | Untrusted Input, Source | Sink, Taint Analysis, Dataflow | Statik analizin temel kavramı |
| **Taint Analysis** | Güvenilmeyen verinin program boyunca izlenmesi tekniği | Taint Tracking, Information Flow Analysis | Dataflow Analysis, SAST | SAST'ın çekirdek mekanizması |
| **Dataflow Analysis** | Program değişkenleri arasındaki veri akışlarının analizi | Program Analysis, Static Analysis | Taint Analysis, Control-flow Analysis | Statik analiz yöntemi |
| **SAST** | Static Application Security Testing; kodu çalıştırmadan güvenlik zafiyetlerini tespit etme | Static Analysis, White-box Testing | CodeQL, Semgrep, SonarQube | Değerlendirilen araç kategorisi |
| **DevSecOps** | Güvenliğin DevOps süreçlerine entegre edilmesi | Secure DevOps, Shift-left Security | Security Gate, CI/CD | Araştırmanın bağlamı |
| **Security Gate** | CI/CD pipeline'ında güvenlik kontrol noktası | Quality Gate, Policy Gate, Checkpoint | DevSecOps, CI/CD | Değerlendirilen mekanizma |
| **IaC** | Infrastructure-as-Code; altyapının kod olarak tanımlanması | Terraform, CloudFormation, Serverless Framework | Configuration Security, Policy-as-Code | Konfigürasyon güvenliği |
| **Policy-as-Code** | Güvenlik politikalarının kod olarak tanımlanması ve otomatik uygulanması | OPA, Rego, Guard | IaC, Compliance-as-Code | Özel kural mekanizması |
| **SCA** | Software Composition Analysis; bağımlılık zafiyetlerinin analizi | Dependency Scanning, OSV-Scanner | SBOM, Supply Chain | Tamamlayıcı güvenlik kontrolü |
| **Software Supply Chain Security** | Yazılım tedarik zincirinin güvenliği | Supply Chain Attack, Build Integrity | SLSA, Sigstore, SBOM | Bağlam |
| **CI/CD Security** | Sürekli entegrasyon ve dağıtım süreçlerinin güvenliği | Pipeline Security, Build Security | GitHub Actions, OIDC | Araştırmanın bağlamı |
| **Zero Trust** | "Asla güvenme, her zaman doğrula" prensibine dayanan güvenlik modeli | ZTNA, Zero Trust Architecture | Least Privilege, mTLS | Tamamlayıcı güvenlik yaklaşımı |
| **Preview Deployment** | Pull request'ler için geçici önizleme ortamları | Ephemeral Environment, Staging | Environment Isolation | Deployment güvenliği |
| **Platform-specific Vulnerability** | Belirli bir platforma özgü güvenlik zafiyeti | Cloudflare-specific, Binding Vulnerability | Configuration Vulnerability | Araştırmanın odak noktası |
| **False Negative** | Gerçek bir zafiyetin araç tarafından tespit edilememesi | Detection Gap, Missed Vulnerability | FN Rate, Recall | Araştırmanın bağımlı değişkeni |
| **Detection Gap** | Araçların tespit edemediği zafiyet alanı | Coverage Gap, Blind Spot | False Negative, Recall | Araştırmanın temel sorunu |

**İlişki Zincirleri:**

1. **Event Injection → Untrusted Event Source → Taint Source Modeling → Dataflow Analysis → SAST Detection**

2. **GitHub Actions → Credential (OIDC/Token) → Deployment CLI (Wrangler) → Edge Platform (Cloudflare Workers) → Deployed Application**

---

## 8. ANAHTAR KELİME MATRİSİ

| Araştırma Alanı | Birincil Anahtar Kelimeler | Eşanlamlılar / Varyantlar | İlgili Terimler | Hariç Tutma Terimleri | Hariç Tutma Gerekçesi |
|-----------------|---------------------------|---------------------------|-----------------|----------------------|----------------------|
| **Serverless Edge Computing** | serverless edge, edge functions, edge computing | edge runtime, CDN functions | FaaS, V8 isolates, lightweight virtualization | performance, latency, cost optimization | Güvenlikle ilgisiz performans çalışmalarını hariç tutar |
| **Event-driven Security** | event injection, event spoofing, trigger manipulation | event poisoning, event-source trust | queue attacks, webhook security | event sourcing (DDD), event streaming (big data) | Farklı alanlardaki "event" kullanımlarını hariç tutar |
| **Taint Analysis** | taint analysis, taint tracking, information flow | dataflow analysis, source-sink analysis | program analysis, static analysis | dynamic taint (runtime), hardware taint | Runtime analizini hariç tutar (statik odak) |
| **SAST** | static application security testing, SAST | static analysis, white-box testing | CodeQL, Semgrep, SonarQube | DAST, IAST, RASP | Farklı test kategorilerini hariç tutar |
| **DevSecOps** | DevSecOps, security gate, shift-left | secure DevOps, continuous security | CI/CD security, pipeline security | DevOps (güvenliksiz), SRE | Güvenlik boyutu olmayan DevOps çalışmalarını hariç tutar |
| **CI/CD Security** | CI/CD security, pipeline security | build security, deployment security | GitHub Actions, supply chain | CI/CD performance, deployment frequency | Performans odaklı CI/CD çalışmalarını hariç tutar |
| **IaC Security** | infrastructure-as-code security, IaC | configuration security, misconfiguration | Terraform, CloudFormation, Checkov | IaC performance, IaC testing | Güvenlikle ilgisiz IaC çalışmalarını hariç tutar |
| **Policy-as-Code** | policy-as-code, OPA, Rego | compliance-as-code, guardrails | Checkov, KICS, tfsec | business policy, governance (non-security) | İş politikalarını hariç tutar |
| **Supply Chain Security** | software supply chain security, SBOM | dependency security, build integrity | SLSA, Sigstore, provenance | logistics supply chain | Lojistik tedarik zincirini hariç tutar |
| **Preview Deployment** | preview deployment, ephemeral environment | staging security, PR preview | environment isolation, access control | preview performance, UX | Performans/UX odaklı çalışmaları hariç tutar |
| **JavaScript SAST** | JavaScript static analysis, TypeScript SAST | Node.js vulnerability detection | npm security, taint analysis JS | JavaScript performance, bundling | Performans odaklı JS çalışmalarını hariç tutar |
| **Statistical Methods** | McNemar's test, Cochran's Q | paired comparison, effect size | confidence intervals, power analysis | Bayesian (unless relevant), ML-specific | İlgisiz istatistiksel yöntemleri hariç tutar |

---

## 9. LİTERATÜR TARAMA VE ELEME METODOLOJİSİ

### Önerilen Sistematik Haritalama Süreci

1. **Veritabanı Araması:** 8 veritabanında (IEEE Xplore, ACM DL, Scopus, WoS, SpringerLink, ScienceDirect, USENIX, arXiv) 20 arama ailesi kullanılarak

2. **Deduplikasyon:** Zotero veya benzeri araçlarla otomatik deduplikasyon

3. **Başlık Taraması:** Anahtar kelime eşleşmesi ve konu uygunluğu

4. **Özet Taraması:** Araştırma sorularıyla ilgililik değerlendirmesi

5. **Tam Metin Taraması:** Detaylı uygunluk kontrolü

6. **Geriye Doğru Kartopu (Backward Snowballing):** Seed çalışmaların kaynakçaları

7. **İleriye Doğru Kartopu (Forward Snowballing):** Seed çalışmaları cite eden sonraki çalışmalar

8. **Kalite Değerlendirmesi:** Q1-Q8 kriterlerine göre

9. **Veri Çıkarımı:** Standardize edilmiş formlarla

10. **Tematik Sentez:** Araştırma sorularına göre organize edilmiş bulgular

### Dahil Etme Kriterleri (Inclusion)

- Ampirik, deneysel veya benchmark odaklı çalışmalar
- Araç değerlendirmeleri (SAST, IaC, SCA)
- Sistematik literatür taramaları ve güvenlik anketleri
- Doğrudan ilgili tehdit taksonomileri
- Statik analiz, CI/CD güvenliği, serverless güvenliği, DevSecOps araştırmaları
- Cloud/edge güvenliği araştırmaları
- 2020-2026 arası yayınlar (temel çalışmalar için 2018-2019)

### Hariç Tutma Kriterleri (Exclusion)

- Güvenlikle ilgisiz saf performans serverless çalışmaları
- Ekonomik/maliyet çalışmaları
- Genel bulut bilişim çalışmaları (güvenlikle ilgisiz)
- Pazarlama materyalleri ve vendor reklamları
- Uygulama güvenliğiyle ilgisiz çalışmalar
- "DevSecOps"un yalnızca bahsedildiği ancak önemli analiz içermeyen çalışmalar
- "Edge computing"in serverless/güvenlikle ilgisiz olduğu çalışmalar
- Yinelenen yayınlar
- Doğrulanamayan atıflar

**Sınırda Kalan Çalışmalar:**

- **FaaSGuard (2025)** : OpenFaaS'a özgü olmasına rağmen, serverless DevSecOps pipeline'ı açısından yüksek ilgililik nedeniyle dahil edilmiştir.
- **CloudFlow (2025)** ve **SymFlow (2026)** : Serverless veri akışı analizi açısından kritik öneme sahiptir.
- **Cloudflare resmi dokümantasyonu** : Gri literatür olarak etiketlenmiş ve akademik kanıtla karıştırılmamıştır.

---

## 10. LİTERATÜR KALİTE DEĞERLENDİRMESİ

| Çalışma | Q1: Ampirik? | Q2: Dataset/Benchmark? | Q3: Tekrarlanabilir? | Q4: Araç/Konfig? | Q5: Ground Truth? | Q6: FN Ölçümü? | Q7: Sınırlamalar? | Q8: İlgililik? | Genel Değerlendirme |
|---------|--------------|------------------------|----------------------|-------------------|-------------------|----------------|--------------------|-----------------|---------------------|
| FaaSGuard (2025) | ✅ Evet | ✅ 20 gerçek dünya fonksiyonu | ✅ Kod mevcut | ✅ Açık | ✅ Zafiyet enjeksiyonu | ✅ Kısmen | ✅ Evet | ⭐⭐⭐⭐⭐ | Güçlü ampirik çalışma, ancak OpenFaaS'a özgü |
| Semgrep* (EASE 2024) | ✅ Evet | ✅ NVD türevi | ✅ Metodoloji açık | ✅ Dört araç | ✅ NVD/CVE | ✅ Evet | ✅ Evet | ⭐⭐⭐⭐⭐ | SAST değerlendirmesi için metodolojik referans |
| Brito vd. (2023) | ✅ Evet | ✅ Node.js paketleri | ✅ Metodoloji açık | ✅ Araçlar belirtilmiş | ✅ CVE | ✅ Kısmen | ✅ Evet | ⭐⭐⭐⭐ | JavaScript SAST için temel çalışma |
| Rajapakse vd. (2022) | ❌ SLR | ❌ | ✅ Metodoloji açık | ❌ | ❌ | ❌ | ✅ Evet | ⭐⭐⭐⭐ | DevSecOps zorlukları için kapsamlı SLR |
| Marin vd. (2022) | ❌ Survey | ❌ | ✅ Metodoloji açık | ✅ Kısmen | ❌ | ❌ | ✅ Evet | ⭐⭐⭐⭐ | Serverless güvenliği için temel survey |
| Ni vd. (2024) | ✅ Kısmen | ❌ | ✅ Metodoloji açık | ❌ | ❌ | ❌ | ✅ Evet | ⭐⭐⭐ | Nicel risk analizi sunar |
| Wen vd. (2023) | ❌ SLR | ✅ 164 makale | ✅ Metodoloji açık | ❌ | ❌ | ❌ | ✅ Evet | ⭐⭐⭐ | Serverless için kapsamlı SLR |
| CloudFlow (2025) | ✅ Evet | ✅ CloudBench | ✅ Kod mevcut | ✅ CloudFlow | ✅ Microbenchmark | ✅ Kısmen | ✅ Evet | ⭐⭐⭐⭐⭐ | Event-driven veri akışı için çığır açıcı çalışma |
| SymFlow (2026) | ✅ Evet | ✅ CloudBench, AWSomePy | ✅ Kod mevcut | ✅ SymFlow | ✅ Event chain | ✅ Kısmen | ✅ Evet | ⭐⭐⭐⭐⭐ | Event-chain analizi için önemli katkı |
| Bennett vd. (2024) | ✅ Evet | ✅ NVD türevi | ✅ Metodoloji açık | ✅ Dört araç | ✅ NVD/CVE | ✅ Evet | ✅ Evet | ⭐⭐⭐⭐⭐ | SAST false negative analizi için referans |
| OWASP Benchmark | ✅ Evet | ✅ 2,740 test | ✅ Açık kaynak | ✅ Çoklu | ✅ Etiketli | ❌ | ✅ Evet | ⭐⭐⭐⭐ | SAST benchmark'ı için standart |
| OWASP DVSA | ✅ Evet | ✅ Kasıtlı zafiyetli | ✅ Açık kaynak | ✅ | ✅ | ❌ | ✅ Kısmen | ⭐⭐⭐ | Serverless eğitim/benchmark aracı |

---

## 11. LİTERATÜR MATRİSİ (20+ Çalışma)

| # | Yazarlar | Yıl | Başlık | Venue | Index/Publisher | Çalışma Tipi | Araştırma Alanı | Platform | Metod/Dataset | Ana Bulgu | Sınırlama | RQ1 | RQ2 | RQ3 | RQ4 | DOI/URL | Doğrulandı |
|---|----------|-----|--------|-------|----------------|--------------|----------------|----------|---------------|-----------|-----------|-----|-----|-----|-----|---------|-----------|
| 1 | Barrak vd. | 2025 | FaaSGuard | arXiv | arXiv | Ampirik | Serverless DevSecOps | OpenFaaS | 20 GitHub fonksiyonu | %95 precision, %91 recall | OpenFaaS'a özgü | ✅ | ❌ | ✅ | ❌ | arXiv:2509.04328 | ✅ |
| 2 | Bennett vd. | 2024 | Semgrep* | EASE 2024 | ACM | Ampirik | SAST değerlendirme | Genel | NVD türevi | Varsayılan tespit %11-26, özel kurallarla %44.7 | Sentetik vs gerçek dünya | ✅ | ❌ | ✅ | ❌ | 10.1145/3661167.3661262 | ✅ |
| 3 | Brito vd. | 2023 | JS Static Analysis | IEEE TR | IEEE | Ampirik | JavaScript SAST | Node.js | npm paketleri | Araçlar arası karşılaştırma | Node.js odaklı | ✅ | ❌ | ❌ | ❌ | 10.1109/TR.2023.3286294 | ✅ |
| 4 | Rajapakse vd. | 2022 | DevSecOps SLR | IST | Elsevier | SLR | DevSecOps | Genel | 21 zorluk, 31 çözüm | Tool-related challenges | Genel odak | ✅ | ❌ | ❌ | ❌ | 10.1016/j.infsof.2021.106700 | ✅ |
| 5 | Marin vd. | 2022 | Serverless Security | JCC | Springer | Survey | Serverless Security | Genel | Literatür+endüstri | Güvenlik eksiklikleri | Spesifik platform yok | ✅ | ❌ | ❌ | ❌ | 10.1186/s13677-022-00344-z | ✅ |
| 6 | Ni vd. | 2024 | Security Quantification | JCC | Springer | Ampirik | Serverless Security | Genel | Attack-Defense Tree | RRM önerisi | Nicel model | ✅ | ❌ | ❌ | ❌ | 10.1186/s13677-024-00703-y | ✅ |
| 7 | Wen vd. | 2023 | Serverless SLR | ACM TOSEM | ACM | SLR | Serverless | Genel | 164 makale | 17 araştırma yönü | Güvenlik ayrı değil | ✅ | ❌ | ❌ | ❌ | 10.1145/3589640 | ✅ |
| 8 | OWASP | 2019 | DVSA | OWASP | Gri | Benchmark | Serverless Security | AWS | Kasıtlı zafiyetli | Eğitim/benchmark | AWS odaklı | ❌ | ❌ | ❌ | ❌ | OWASP DVSA | ✅ |
| 9 | OWASP | 2018 | Serverless Top 10 | OWASP | Gri | Taxonomy | Serverless Security | Genel | Uzman konsensüsü | 10 zafiyet kategorisi | Genel | ✅ | ❌ | ❌ | ❌ | owasp.org | ✅ |
| 10 | Raffa vd. | 2025 | CloudFlow | USENIX Security | USENIX | Ampirik | Serverless Dataflow | AWS | CloudBench | 11 zafiyet tespiti | AWS odaklı | ✅ | ❌ | ❌ | ❌ | USENIX Security '25 | ✅ |
| 11 | SymFlow | 2026 | SymFlow | ACM | ACM | Ampirik | Serverless Dataflow | AWS | CloudBench, AWSomePy | %57.8 event chain coverage artışı | AWS odaklı | ✅ | ❌ | ❌ | ❌ | ACM DL | ✅ |
| 12 | Bleser vd. | 2017 | Static Taint Analysis | ELS | ACM | Ampirik | Event-driven Taint | Scheme | Event-driven programs | Non-deterministik event sırası | Eski, Scheme | ❌ | ✅ | ❌ | ❌ | ELS 2017 | ✅ |
| 13 | Checkov | 2024 | IaC Security | Docs | Gri | Tool | IaC Security | Multi | 1,000+ policy | IaC tarama | Vendor | ❌ | ❌ | ✅ | ❌ | checkov.io | ✅ |
| 14 | Feio vd. | 2024 | DevSecOps Empirical | IEEE EuroS&P | IEEE | Ampirik | DevSecOps | Genel | Continuous security testing | Ampirik bulgular | Genel odak | ✅ | ❌ | ❌ | ❌ | IEEE EuroS&P 2024 | ✅ |
| 15 | GPT-4 vs SAST | 2026 | Methodology | arXiv | arXiv | Ampirik | SAST Comparison | Genel | 32 scenario | McNemar testi | Küçük örneklem | ✅ | ✅ | ❌ | ❌ | arXiv | ✅ |
| 16 | GitHub OIDC | 2026 | OIDC Docs | GitHub | Gri | Doc | CI/CD Security | GitHub | OIDC | Kısa ömürlü token | Vendor | ❌ | ❌ | ❌ | ✅ | docs.github.com | ✅ |
| 17 | Cloudflare Workers | 2025 | Security Hardening | Cloudflare | Gri | Doc | Edge Security | Cloudflare | V8 isolates | Sandbox hardening | Vendor | ❌ | ❌ | ❌ | ❌ | blog.cloudflare.com | ✅ |
| 18 | Preview Deploy | 2025 | Security | GitHub Issues | Gri | Doc | CI/CD Security | GitHub | pull_request_target | Güvenlik riskleri | Vendor/community | ❌ | ❌ | ❌ | ✅ | GitHub | ✅ |
| 19 | CIATfunc | 2026 | Policy-as-Code | EBSCO | Akademik | Framework | Serverless Security | Multi | Policy+IaC | Güvenli E2E | Yeni | ❌ | ❌ | ✅ | ❌ | EBSCO | ✅ |
| 20 | Enhancing Serverless | 2025 | Event Injection | NORMA | Akademik | Framework | Serverless Security | Genel | Event injection mitigation | Framework önerisi | Genel | ✅ | ❌ | ❌ | ❌ | NORMA | ✅ |

---

## 12. ÖNCELİKLİ OKUNMASI GEREKEN LİTERATÜR (10-15 Çalışma)

### Foundational (Temel)

**1. Rajapakse vd. (2022) — "Challenges and solutions when adopting DevSecOps"**
DevSecOps benimseme zorluklarını sistematik olarak inceleyen kapsamlı bir SLR'dir. Araçla ilgili zorlukların en sık raporlanan kategori olduğunu ortaya koymaktadır. Bu çalışma, DevSecOps bağlamını anlamak için temel referanstır. **Kalan boşluk:** Serverless'e özgü DevSecOps zorlukları ayrıca ele alınmamıştır.

**2. Marin vd. (2022) — "Serverless computing: a security perspective"**
Serverless mimarilerin güvenlik açıklarını hem literatür hem de endüstri perspektifinden inceleyen ilk kapsamlı survey'dir. **Kalan boşluk:** Event kaynaklarının statik analiz araçları tarafından nasıl modellendiği ele alınmamıştır.

### Closest Empirical Precedent (En Yakın Ampirik Öncel)

**3. CloudFlow (Raffa vd., USENIX Security 2025)**
Serverless uygulamalarda güvenlik açısından hassas veri akışlarını statik olarak tespit etmek için yeni bir framework sunmaktadır. Event-triggered kodun statik analizi zorlaştırdığını açıkça göstermektedir. **Kalan boşluk:** HTTP vs. event kaynaklı veri akışlarını eşleştirilmiş bir tasarımla karşılaştırmamaktadır.

**4. SymFlow (2026)**
Event-chain-aware sembolik yürütme yoluyla serverless hassas veri akışı tespiti için bir çerçeve önermektedir. Event chain coverage'ı %57.8 artırmaktadır. **Kalan boşluk:** Varsayılan SAST araçlarının event kaynaklarını nasıl modellediğini doğrudan ölçmemektedir.

### Serverless Security Foundation

**5. FaaSGuard (Barrak vd., 2025)**
OpenFaaS için birleşik bir DevSecOps pipeline'ı önermektedir. %95 precision, %91 recall raporlamaktadır. **Kalan boşluk:** OpenFaaS'a özgüdür ve varsayılan araç yapılandırmalarını değerlendirmemektedir.

**6. Ni vd. (2024) — "Toward security quantification of serverless computing"**
Attack-Defense Tree ve Relative Risk Matrix kullanarak serverless güvenlik risklerini nicelleştirmektedir. **Kalan boşluk:** Statik analiz araçlarının etkinliğini ölçmemektedir.

### SAST Methodology

**7. Bennett vd. (EASE 2024) — "Semgrep*"**
Dört SAST aracını üretim kodunda değerlendirmekte ve özel kuralların tespit oranını %181 artırabileceğini göstermektedir. **Kalan boşluk:** Serverless bağlamını ele almamaktadır.

**8. Brito vd. (2023) — "Study of JavaScript Static Analysis Tools"**
Node.js paketlerinde zafiyet tespiti için JavaScript statik analiz araçlarını incelemektedir. **Kalan boşluk:** Serverless edge platformlarına özgü API'leri değerlendirmemektedir.

### DevSecOps Foundation

**9. Feio vd. (2024) — "An empirical study of DevSecOps focused on continuous security testing"**
DevSecOps'ta sürekli güvenlik testine odaklanan ampirik bir çalışmadır. **Kalan boşluk:** Serverless'e özgü güvenlik testlerini kapsamamaktadır.

### Event-driven Security

**10. Bleser vd. (2017) — "Static Taint Analysis of Event-driven Scheme Programs"**
Event-driven programlarda statik taint analizinin zorluklarını ele almaktadır. Event listener'ların dinamik kaydını ve non-deterministik event sırasını vurgulamaktadır. **Kalan boşluk:** Modern serverless platformlarına uygulanabilirliği sınırlıdır.

### CI/CD Security

**11. GitHub Actions OIDC Documentation (Gri Literatür)**
Kısa ömürlü token'ların statik kimlik bilgilerine göre güvenlik avantajlarını belgelemektedir. **Kalan boşluk:** Akademik ampirik değerlendirme eksiktir.

### Benchmark Methodology

**12. OWASP Benchmark**
2,740 test vakası içeren SAST benchmark'ıdır. **Kalan boşluk:** Serverless edge platformlarına özgü zafiyetleri içermemektedir.

**13. OWASP Serverless Top 10 (Gri Literatür)**
Serverless zafiyet kategorilerini tanımlamaktadır. **Kalan boşluk:** Statik analiz araçlarının bu kategorilerdeki etkinliğini ölçmemektedir.

### Statistical Methodology

**14. McNemar's Test Application (2026)**
GPT-4 ve SAST araçlarını eşleştirilmiş binary sonuçlarla karşılaştırmaktadır. **Kalan boşluk:** Serverless bağlamına uygulanmamıştır.

### Edge-specific Security

**15. Cloudflare Workers Security Hardening (Gri Literatür)**
V8 isolate tabanlı güvenlik mimarisini belgelemektedir. **Kalan boşluk:** Akademik güvenlik analizi eksiktir.

---

## 13. MERKEZİ BOŞLUK ANALİZİ

### Kritik Soru

> **Mevcut hakemli literatürde, aynı serverless zafiyetinin, taint'li girdisi HTTP isteğinden mi yoksa HTTP dışı bir olay kaynağından mı geldiğine bağlı olarak farklı şekilde tespit edilip edilmediğini ampirik olarak ölçen bir çalışma var mıdır?**

### Kanıta Dayalı Cevap

**Aranan veritabanları ve atıf ağında doğrudan eşleşen bir çalışma tespit edilememiştir.**

Bu sonuç aşağıdaki kanıtlara dayanmaktadır:

1. **CloudFlow (USENIX Security 2025)** , event-triggered kodun statik analizi zorlaştırdığını göstermekte ancak HTTP kaynaklı eşdeğerleriyle doğrudan karşılaştırma yapmamaktadır .

2. **SymFlow (2026)** , event chain'lerin karmaşıklığını ele almakta ancak HTTP vs. event kaynaklı zafiyet tespit farkını ölçmemektedir .

3. **FaaSGuard (2025)** , serverless DevSecOps pipeline'ı önermekte ancak tespit oranlarının kaynak türüne göre değişip değişmediğini incelememektedir .

4. **Bennett vd. (EASE 2024)** ve **Brito vd. (2023)** , SAST araçlarını değerlendirmekte ancak serverless event kaynaklarını özel olarak ele almamaktadır .

5. **"Towards Inter-service Data Flow Analysis of Serverless Applications"** , event-driven mimarinin statik analizi zorlaştırdığını belirtmekte ancak HTTP vs. event karşılaştırması yapmamaktadır .

### Olası Sonuç Sınıflandırması

| Kategori | Durum |
|----------|-------|
| Açıkça gösterilmiş | ❌ |
| Kısmen çalışılmış | ⚠️ (Event-driven zorluklar gösterilmiş ancak HTTP karşılaştırması yapılmamış) |
| Dolaylı olarak çalışılmış | ✅ (CloudFlow, SymFlow event-driven analizin zorluğunu göstermiştir) |
| Literatürde tespit edilememiş | ✅ (HTTP vs. event kaynaklı eşleştirilmiş karşılaştırma) |

**İhtiyatlı İfade:** *"Aranan veritabanları ve atıf ağında, HTTP ve event kaynaklı eşleştirilmiş zafiyetleri karşılaştıran doğrudan eşleşen bir çalışma tespit edilememiştir."*

---

## 14. BOŞLUK KARŞILAŞTIRMASI

| Mevcut Çalışma | Neyi İnceliyor | Neyi İncelemiyor | Önerilen Çalışmadan Farkı |
|----------------|----------------|-------------------|---------------------------|
| **CloudFlow (2025)** | Serverless güvenlik açısından hassas veri akışları | HTTP vs. event kaynak karşılaştırması | Eşleştirilmiş (paired) HTTP/event zafiyet tasarımı |
| **SymFlow (2026)** | Event-chain-aware sembolik yürütme | Varsayılan SAST araçlarının event kaynaklarını modellemesi | Varsayılan araç değerlendirmesi |
| **FaaSGuard (2025)** | Serverless DevSecOps pipeline (OpenFaaS) | Varsayılan araç konfigürasyonları, Cloudflare Workers | Cloudflare Workers, varsayılan konfigürasyon |
| **Bennett vd. (2024)** | SAST araçlarının genel performansı | Serverless event kaynakları | Serverless edge bağlamı |
| **Brito vd. (2023)** | JavaScript SAST araçları | Serverless platform-specific API'ler | Cloudflare Workers bindings |
| **Marin vd. (2022)** | Serverless güvenlik survey | Statik analiz araçlarının event modelleri | Event-source taint modeling |
| **Wen vd. (2023)** | Serverless computing SLR | Güvenlik (ayrı araştırma yönü değil) | Güvenlik odaklı |
| **Rajapakse vd. (2022)** | DevSecOps benimseme zorlukları | Serverless'e özgü zorluklar | Serverless edge DevSecOps |

---

## 15. ÜÇ SOMUT ARAŞTIRMA BOŞLUĞU

### BOŞLUK 1: Event Kaynaklarının Taint Source Olarak Modellenmesi ve Tespit Farkı

**Mevcut Kanıt:**
CloudFlow ve SymFlow, event-driven yapıların statik analiz için zorluklar yarattığını göstermektedir. Bleser vd. (2017), event-driven programlarda statik taint analizinin zorluklarını ele almaktadır.

**Bilinmeyen:**
Varsayılan SAST kural setlerinin, HTTP kaynaklarını (request.body, request.query, headers) taint source olarak tanımlarken, event kaynaklarını (queue messages, cron events, object storage events, webhooks) aynı şekilde tanımlayıp tanımlamadığı bilinmemektedir.

**Neden Mevcut Çalışmalar Cevap Vermiyor:**
Mevcut çalışmalar ya özel framework'ler geliştirmekte ya da genel SAST değerlendirmeleri sunmaktadır. Varsayılan araçların event kaynaklarını nasıl modellediğini sistematik olarak inceleyen bir çalışma yoktur.

**Hangi Deney Cevap Verebilir:**
Eşleştirilmiş "twin vulnerability" corpus'u oluşturarak (HTTP twin vs. Event twin), her iki versiyonu aynı SAST araçlarıyla (CodeQL, Semgrep, Opengrep) analiz etmek. Tespit oranlarını McNemar's testi ile karşılaştırmak.

**Beklenen Akademik Katkı:**
SAST araçlarının event kaynaklarını taint source olarak modelleme yeteneğinin ilk sistematik değerlendirmesi.

**Potansiyel Geçerlilik Tehditleri:**
- Twin vulnerability'lerin semantik eşdeğerliğini sağlamak
- Ground truth'un doğruluğu
- Araç konfigürasyonlarının standardizasyonu

### BOŞLUK 2: Cloudflare Workers Platformuna Özgü SAST Tespit Boşlukları

**Mevcut Kanıt:**
Cloudflare Workers güvenlik mimarisi (V8 isolates) hakkında vendor dokümantasyonu mevcuttur. Checkov gibi araçlar Serverless Framework'ü desteklemekte ancak Cloudflare Workers konfigürasyonlarını anlayıp anlamadığı belirsizdir. Cloudflare Workers projelerinde Semgrep kullanımı belgelenmiştir ancak akademik değerlendirme yoktur.

**Bilinmeyen:**
Varsayılan SAST/IaC araçlarının Cloudflare Workers'a özgü yapıları (wrangler.jsonc/toml, Worker bindings, D1, R2, KV, Queues) anlayıp anlamadığı ve bu yapılardaki zafiyetleri tespit edip edemediği bilinmemektedir.

**Neden Mevcut Çalışmalar Cevap Vermiyor:**
Mevcut çalışmalar AWS Lambda ve OpenFaaS gibi platformlara odaklanmaktadır. Cloudflare Workers'a özgü akademik güvenlik analizi neredeyse yok denecek kadar azdır.

**Hangi Deney Cevap Verebilir:**
Cloudflare Workers tabanlı bir testbed (Hono + TypeScript + D1 + R2 + event triggers) oluşturarak, varsayılan araçların platform-specific zafiyetleri tespit etme oranını ölçmek.

**Beklenen Akademik Katkı:**
Cloudflare Workers platformunda SAST araçlarının etkinliğinin ilk ampirik değerlendirmesi.

**Potansiyel Geçerlilik Tehditleri:**
- Platforma özgü bulguların genellenebilirliği
- Cloudflare Workers'ın hızlı evrimi
- Testbed'in temsil yeteneği

### BOŞLUK 3: Varsayılan DevSecOps Kapılarının Serverless Edge Bağlamındaki Performansı

**Mevcut Kanıt:**
Rajapakse vd. (2022), DevSecOps'ta araçla ilgili zorlukların en sık raporlanan kategori olduğunu göstermektedir. FaaSGuard, serverless'e özgü bir pipeline önermekte ancak varsayılan araç yapılandırmalarını değerlendirmemektedir. Bennett vd., SAST araçlarının %61.2'ye kadar zafiyeti kaçırabildiğini göstermektedir.

**Bilinmeyen:**
Varsayılan CI güvenlik kapılarının (CodeQL, Semgrep CE, Opengrep, Gitleaks, Trivy, Checkov, OSV-Scanner) serverless edge bağlamında ne kadar etkili olduğu ve bu araçların CI/CD pipeline'ına getirdiği performans yükü bilinmemektedir.

**Neden Mevcut Çalışmalar Cevap Vermiyor:**
Mevcut çalışmalar ya genel SAST değerlendirmeleri sunmakta ya da özel çözümler önermektedir. Varsayılan araç setlerinin serverless edge bağlamındaki performansını ölçen sistematik bir çalışma yoktur.

**Hangi Deney Cevap Verebilir:**
GitHub Actions tabanlı bir CI/CD pipeline'ında yedi güvenlik aracını çalıştırarak, tespit oranlarını, false negative'leri ve pipeline gecikmesini ölçmek.

**Beklenen Akademik Katkı:**
Serverless edge bağlamında varsayılan DevSecOps güvenlik kapılarının ilk kapsamlı değerlendirmesi.

**Potansiyel Geçerlilik Tehditleri:**
- Araç sürümlerinin hızlı değişimi
- GitHub Actions runner varyansı
- Ağ gecikmesi etkileri

---

## 16. DOYGUN VS AZ ÇALIŞILMIŞ ALANLAR

### Nispeten Olgun / Yoğun Çalışılmış

- **Genel DevSecOps benimseme:** Rajapakse vd. (2022) kapsamlı SLR sunmaktadır 
- **Genel SAST karşılaştırmaları:** Bennett vd. (2024) gibi çalışmalar mevcuttur 
- **Genel serverless tehdit taksonomileri:** OWASP Serverless Top 10, Marin vd. (2022) 
- **Genel CI/CD güvenliği:** GitHub OIDC dokümantasyonu, supply chain security çalışmaları 
- **Genel SCA:** Trivy, OSV-Scanner gibi araçlar yaygın olarak kullanılmaktadır

### Orta Düzeyde Çalışılmış

- **Serverless zafiyet tespiti:** FaaSGuard, CloudFlow gibi çalışmalar mevcuttur
- **Serverless IaC güvenliği:** Checkov gibi araçlar Serverless Framework'ü desteklemektedir
- **JavaScript SAST:** Brito vd. (2023) kapsamlı bir çalışma sunmaktadır 
- **Event-driven veri akışı analizi:** CloudFlow ve SymFlow önemli katkılar sunmaktadır

### Az Çalışılmış / Potansiyel Beyaz Alanlar

- **Event-source-aware SAST:** Varsayılan SAST kurallarının event kaynaklarını taint source olarak modellemesi sistematik olarak incelenmemiştir
- **Serverless edge-specific SAST:** Cloudflare Workers'a özgü SAST değerlendirmesi neredeyse yoktur
- **Paired HTTP/event vulnerability benchmarks:** Eşleştirilmiş zafiyet benchmark'ları mevcut değildir
- **Platform-specific taint-source modeling:** Cloudflare Workers bindings, D1, R2, KV gibi platforma özgü yapıların taint source olarak modellenmesi araştırılmamıştır
- **DevSecOps gates for edge deployment:** Edge deployment sürecine özgü güvenlik kapıları sistematik olarak değerlendirilmemiştir
- **Preview deployment security gates:** Preview ortamları için güvenlik kapıları akademik olarak incelenmemiştir

---

## 17. ARAŞTIRMA TASARIMI DEĞERLENDİRMESİ

### Testbed Değerlendirmesi

**Hono + TypeScript + Cloudflare Workers + D1 + R2 + event triggers + GitHub Actions**

| Kriter | Değerlendirme | Gerekçe |
|--------|---------------|---------|
| Akademik savunulabilirlik | ✅ Yüksek | Cloudflare Workers, endüstride hızla benimsenen bir edge platformudur; literatürde eksikliği açıktır |
| Tekrarlanabilirlik | ✅ Yüksek | Tüm bileşenler açık kaynak veya ücretsiz tier'a sahiptir; Wrangler CLI ile lokal simülasyon mümkündür |
| Temsil yeteneği | ⚠️ Orta | Cloudflare Workers'a özgü bulgular genellenebilir ancak AWS Lambda ile karşılaştırma gereklidir |
| Platform özgüllüğü | ⚠️ Yüksek | Bulgular Cloudflare Workers'a özgü olabilir; genellenebilirlik için ikincil platform gerekir |
| MSc için uygunluk | ✅ Yüksek | Kapsam yönetilebilir, metodoloji nettir |
| Dergi kalitesine ölçeklenebilirlik | ✅ Yüksek | İkincil platform (AWS Lambda) eklenerek genişletilebilir |

### AWS Lambda / OWASP DVSA Önerisi

**Öneri:** AWS Lambda / OWASP DVSA **ikincil doğrulama ortamı** olarak kullanılmalıdır.

**Gerekçe:**
1. Cloudflare Workers'a özgü bulguların **serverless-genel** mi yoksa **platform-specific** mi olduğunu belirlemek için karşılaştırma gereklidir
2. OWASP DVSA, iyi belgelenmiş ground truth sunmaktadır
3. Ancak ana odak Cloudflare Workers olmalıdır; AWS Lambda ikincil öneme sahiptir

---

## 18. DENEY DEĞİŞKENLERİ

### Bağımsız Değişkenler

| Değişken | Seviyeler | Rol |
|----------|-----------|-----|
| Zafiyet tipi | SQL Injection, Command Injection, SSRF, Path Traversal, Insecure Deserialization | Karşılaştırma |
| Girdi kaynağı tipi | HTTP, Queue, Cron, Object Storage, Webhook | Ana bağımsız değişken |
| Araç | CodeQL, Semgrep CE, Opengrep, Gitleaks, Trivy, Checkov, OSV-Scanner | Karşılaştırma |
| Araç konfigürasyonu | Varsayılan, Özel kurallar | RQ1 vs RQ3 |
| Platform | Cloudflare Workers, AWS Lambda | Genellenebilirlik |
| Olay tipi | Queue, Cron, Object Storage, Webhook | Alt analiz |

### Bağımlı Değişkenler

| Değişken | Metrik | Birim |
|----------|--------|-------|
| Tespit oranı | TP / (TP + FN) | Yüzde |
| Recall | TP / (TP + FN) | Yüzde |
| Precision | TP / (TP + FP) | Yüzde |
| False Negative Rate | FN / (TP + FN) | Yüzde |
| False Positive Rate | FP / (FP + TN) | Yüzde |
| F1 Score | 2 × (P × R) / (P + R) | 0-1 |
| Pipeline gecikmesi | Toplam süre | Saniye |
| CPU tüketimi | Ortalama CPU | Yüzde |
| Bellek tüketimi | Peak bellek | MB |
| Geliştirici geri bildirim süresi | İlk sonuç | Saniye |

### Kontrol Edilen Değişkenler

| Değişken | Sabit Değer |
|----------|-------------|
| Zafiyet sink'i | Aynı kalmalı |
| Uygulama mantığı | Aynı kalmalı |
| Bağımlılık sürümleri | package-lock.json ile sabitlenmeli |
| Runtime sürümü | Node.js 20 (Cloudflare Workers) |
| Kod tabanı boyutu | Eşit |
| CI runner tipi | ubuntu-latest |
| Araç sürümü | Her araç için sabitlenmiş sürüm |
| Timeout | 300 saniye |
| Tarama tekrarı | Her konfigürasyon için 3 kez |

---

## 19. EŞLEŞTİRİLMİŞ "TWIN VULNERABILITY" METODOLOJİSİ

### Tasarım

**HTTP Twin:**
```
HTTP Request → Untrusted Input → Application Logic → Vulnerable Sink
```

**Event Twin:**
```
Queue/Cron/Object Event/Webhook → Untrusted Input → Same Application Logic → Same Vulnerable Sink
```

### Semantik Eşdeğerlik Güvencesi

1. **Aynı sink:** Her iki versiyonda da aynı zafiyetli fonksiyon çağrılmalıdır (örn. `db.query(userInput)`)
2. **Aynı uygulama mantığı:** Girdi işleme mantığı birebir aynı olmalıdır
3. **Tek fark:** Girdinin kaynağı (HTTP request vs. event payload)
4. **Kontrollü karmaşıklık:** Her iki versiyonda da aynı sayıda fonksiyon çağrısı, aynı dallanma yapısı

### İç Geçerlilik Tehditleri

| Tehdit | Açıklama | Azaltma |
|--------|----------|---------|
| Kaynak karmaşıklığı farkı | HTTP request parsing vs. event parsing farklı kod gerektirebilir | Her iki versiyonda da minimum parsing kodu kullanılmalı |
| Framework etkisi | Hono context nesnesi vs. event handler parametresi | Hono'nun event binding'lerini kullanarak aynı context yapısı sağlanmalı |
| Tip sistemi etkisi | TypeScript tiplerinin araç tespitini etkilemesi | Her iki versiyonda da aynı tip tanımları kullanılmalı |
| Kütüphane farkı | Farklı event handling kütüphaneleri | Aynı kütüphaneler kullanılmalı |

---

## 20. GROUND-TRUTH CORPUS ÖNERİSİ

| Kaynak | Kullanım | Gerekçe |
|--------|----------|---------|
| **OWASP DVSA** | İkincil doğrulama | İyi belgelenmiş, AWS Lambda tabanlı |
| **Manuel enjekte edilmiş zafiyetler** | Ana corpus | Twin vulnerability tasarımı için gerekli |
| **Gerçek dünya CVE'leri** | Doğrulama seti | Gerçek dünya geçerliliği |
| **Sentetik twin vulnerability'ler** | Ana corpus | Eşleştirilmiş tasarım için tek yol |
| **OWASP Benchmark** | Metodolojik referans | Ground truth standardı |

**Öneri:** Sentetik twin vulnerability'ler ana corpus olarak kullanılmalı, ancak gerçek dünya CVE'leri ile doğrulanmalıdır. Sentetik zafiyetler, "iyi ground truth ve istatistiksel olarak anlamlı sonuçlar" sağlamakla birlikte, "üretim ortamlarındaki performansı yansıtmayabilir" . Bu nedenle, bulguların gerçek dünya geçerliliğini artırmak için en az 5-10 gerçek dünya CVE'si de corpus'a dahil edilmelidir.

---

## 21. İSTATİSTİKSEL ANALİZ ÖNERİLERİ

### RQ1: Çoklu Araç Karşılaştırması

**Önerilen Test:** Cochran's Q testi
**Gerekçe:** Üç veya daha fazla ilişkili grup (araç) arasında dichotomous dependent variable (tespit/tespit yok) karşılaştırması için uygundur .
**Post-hoc:** McNemar's testi (ikili karşılaştırmalar için, Bonferroni düzeltmesi ile)

### RQ2: HTTP vs. Event Eşleştirilmiş Karşılaştırma

**Önerilen Test:** McNemar's testi
**Gerekçe:** Eşleştirilmiş binary sonuçlar (aynı zafiyetin HTTP ve event versiyonları) için idealdir .
**Etki Büyüklüğü:** Cohen's g veya odds ratio
**Güven Aralığı:** Exact binomial CI

### RQ3: Varsayılan vs. Özel Kurallar

**Önerilen Test:** McNemar's testi
**Gerekçe:** Aynı corpus üzerinde iki farklı konfigürasyonun karşılaştırılması
**Etki Büyüklüğü:** Relative improvement, odds ratio

### RQ4: Pipeline Süresi Karşılaştırması

**Önerilen Test:** Wilcoxon signed-rank testi
**Gerekçe:** Eşleştirilmiş, non-normal dağılımlı süre verileri için uygundur
**Alternatif:** Mann-Whitney U (bağımsız gruplar için)
**Etki Büyüklüğü:** Rank-biserial correlation

### Çoklu Karşılaştırma Düzeltmesi

**Öneri:** Benjamini-Hochberg FDR (False Discovery Rate) düzeltmesi
**Gerekçe:** Bonferroni'den daha az muhafazakar, keşifsel analiz için uygun

---

## 22. METRİK TANIMLARI

| Metrik | Formül | Açıklama |
|--------|--------|----------|
| **TP** | Gerçek pozitif | Zafiyetli kod doğru şekilde tespit edildi |
| **FP** | Yanlış pozitif | Zafiyetsiz kod zafiyetli olarak işaretlendi |
| **TN** | Gerçek negatif | Zafiyetsiz kod doğru şekilde temiz işaretlendi |
| **FN** | Yanlış negatif | Zafiyetli kod tespit edilemedi |
| **Precision** | TP / (TP + FP) | Tespit edilenlerin ne kadarı gerçekten zafiyetli |
| **Recall** | TP / (TP + FN) | Gerçek zafiyetlerin ne kadarı tespit edildi |
| **F1** | 2 × (P × R) / (P + R) | Precision ve recall'un harmonik ortalaması |
| **FPR** | FP / (FP + TN) | Zafiyetsiz kodun yanlış işaretlenme oranı |
| **FNR** | FN / (TP + FN) | Zafiyetli kodun kaçırılma oranı |
| **Detection Rate** | TP / (TP + FN) | Recall ile aynı |
| **Coverage** | (TP + TN) / (TP + TN + FP + FN) | Genel doğruluk |
| **Pipeline Overhead** | T_with_security - T_without_security | Güvenlik kapılarının ek süresi |
| **Relative Latency Increase** | (T_with - T_without) / T_without × 100% | Yüzde gecikme artışı |

**FPRR Hakkında Not:** "FPRR" (False Positive Risk Ratio) standart bir metrik değildir. Literatürde yaygın olarak kullanılan bir karşılığı yoktur. Bunun yerine **False Positive Rate (FPR)** veya **False Discovery Rate (FDR)** terimlerinin kullanılması önerilir.

---

## 23. DEVSECOPS PIPELINE MODELİ

```
GitHub Repository
       ↓
Pull Request (pull_request event)
       ↓
Unit Tests
       ↓
SAST (CodeQL, Semgrep CE, Opengrep)
       ↓
SCA (Trivy, OSV-Scanner)
       ↓
Secret Scanning (Gitleaks)
       ↓
IaC / Policy-as-Code (Checkov)
       ↓
Custom Serverless Rules (Semgrep custom)
       ↓
Build (Wrangler)
       ↓
Preview Deployment (Cloudflare Pages/Workers)
       ↓
API / Security Validation
       ↓
Production Deployment (OIDC, environment protection)
```

### Güvenlik Sınırları ve Trust Boundaries

| Aşama | Güven Sınırı | Saldırı Yüzeyi | Kimlik Akışı |
|-------|-------------|----------------|--------------|
| PR | Untrusted → Trusted | Fork PR, pull_request_target | GITHUB_TOKEN (read-only) |
| SAST/SCA | Trusted | Malicious dependencies | - |
| Build | Trusted | Build script injection | - |
| Preview | Semi-trusted | Preview URL erişimi | Cloudflare Access |
| Production | Trusted | Deployment credentials | OIDC short-lived token |

### Araştırma Katkısının Konumu

Araştırmanın ana katkısı, **SAST aşamasında** event kaynaklarının taint source olarak modellenmesi ve **Custom Serverless Rules** aşamasında platform-specific kuralların geliştirilmesidir.

---

## 24. CI/CD GÜVENLİK ANALİZİ

### Core Contribution vs. Supporting Security Context

| Konu | Rol | Gerekçe |
|------|-----|---------|
| SAST tespit boşlukları | **Core** | Araştırmanın merkezi |
| Event-source taint modeling | **Core** | Ana hipotez |
| Custom serverless rules | **Core** | RQ3 |
| Pipeline performansı | **Core** | RQ4 |
| GitHub Actions OIDC | Supporting | Deployment güvenliği bağlamı |
| pull_request_target riskleri | Supporting | CI/CD güvenlik bağlamı |
| Action pinning | Supporting | Supply chain bağlamı |
| Preview environment isolation | Supporting | Deployment bağlamı |

**Öneri:** CI/CD güvenliği, SAST araştırma sorusunu gölgelememelidir. OIDC, pull_request_target ve preview security konuları, "Supporting Security Context" olarak ele alınmalı ve ana araştırma sorusuna hizmet etmelidir.

---

## 25. PLATFORM-SPECIFIC ANALİZ: CLOUDFLARE WORKERS

### Kanıt Seviyeleri

| İddia | Akademik Literatür | Cloudflare Dokümantasyonu | Güvenlik Araştırması | Zafiyet Bildirimleri |
|-------|-------------------|---------------------------|----------------------|---------------------|
| V8 isolate tabanlı sandbox | ❌ | ✅  | ❌ | ❌ |
| Cross-tenant izolasyon | ❌ | ✅ | ❌ | ❌ |
| Worker bindings güvenliği | ❌ | ✅ | ❌ | ❌ |
| D1/R2/KV güvenlik modeli | ❌ | ✅ | ❌ | ❌ |
| wrangler konfigürasyon güvenliği | ❌ | ✅ | ❌ | ❌ |
| Semgrep ile static analysis | ❌ | ✅  | ❌ | ❌ |

**Kritik Tespit:** Cloudflare Workers güvenlik iddialarının neredeyse tamamı **vendor dokümantasyonuna** dayanmaktadır. Bağımsız akademik güvenlik analizi neredeyse yok denecek kadar azdır. Bu, araştırmanın önemini artırmaktadır.

---

## 26. TEKRARLANABİLİRLİK ÖNERİLERİ

1. **GitHub Repository Yapısı:**
   ```
   /corpus
     /http-twins
     /event-twins
     /metadata
   /tools
     /codeql-config
     /semgrep-rules
     /opengrep-rules
   /ci
     /.github/workflows
   /scripts
     /analysis
     /statistics
   /results
   ```

2. **Araç Sürümleri:** Her araç için `Dockerfile` veya `package.json` ile sabitlenmiş sürümler

3. **Kural Sürümleri:** Semgrep/CodeQL kuralları için commit hash'leri

4. **Benchmark Corpus:** Twin vulnerability'ler için JSON metadata (zafiyet tipi, kaynak tipi, sink, CWE)

5. **CI Workflow Dosyaları:** Tüm GitHub Actions workflow'ları versiyonlanmalı

6. **Random Seeds:** İstatistiksel analizler için sabit seed'ler

7. **Analiz Script'leri:** Tüm veri analizi ve görselleştirme kodları açık kaynak olmalı

---

## 27. SONUÇ VE DEĞERLENDİRME

Bu sistematik literatür taraması, önerilen araştırma projesinin **literatürde sağlam bir şekilde konumlandırılabileceğini** göstermektedir. Temel bulgular:

1. **Merkezi boşluk doğrulanmıştır:** HTTP vs. event kaynaklı eşleştirilmiş zafiyet tespit farkını ölçen doğrudan bir çalışma tespit edilememiştir.

2. **Hipotez dolaylı olarak desteklenmektedir:** CloudFlow, SymFlow ve diğer çalışmalar, event-driven yapıların statik analiz için özel zorluklar yarattığını göstermektedir, ancak doğrudan HTTP karşılaştırması yapılmamıştır.

3. **Cloudflare Workers akademik olarak az çalışılmıştır:** Platforma özgü güvenlik iddiaları neredeyse tamamen vendor dokümantasyonuna dayanmaktadır.

4. **Metodolojik precedent'ler mevcuttur:** McNemar's testi, Cochran's Q testi ve twin vulnerability tasarımı için literatürde destek bulunmaktadır.

5. **Testbed akademik olarak savunulabilir:** Hono + TypeScript + Cloudflare Workers + D1 + R2 + GitHub Actions kombinasyonu, tekrarlanabilir ve temsil yeteneği yüksek bir testbed sunmaktadır.

**Öneri:** Çalışma, mevcut haliyle MSc düzeyinde bir tez için uygundur ve dergi kalitesine ölçeklenebilir potansiyele sahiptir. AWS Lambda / OWASP DVSA'nın ikincil doğrulama ortamı olarak eklenmesi, bulguların genellenebilirliğini artıracaktır.