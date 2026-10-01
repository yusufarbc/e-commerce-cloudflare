# Literatür Taraması ve Araştırma Boşluğu Analizi

Bu çalışma, **“Do Default DevSecOps Gates See the Serverless Edge? An Empirical Study of Detection Gaps for Event-Sourced and Platform-Specific Vulnerabilities”** başlıklı planlanan araştırmanın bilimsel dayanaklarını incelemektedir. Öncelikle önerilen başlığın uygunluğunu değerlendirir, gerekirse araştırma sorusunu bozmadan alternatifler öneririz. Ardından sunulan varsayım ve araştırma sorularına dayalı olarak ilgili literatürü kapsayıcı biçimde gözden geçiririz. Her bir araştırma sorusu çerçevesinde mevcut kanıtlar, varsayımlar ve dolaylı çalışmalar netleştirilir; eksik kalan konular saptanır. Ayrıca DevSecOps, sunucusuz edge platformları, olay-kaynaklı uygulamalar, statik analiz ve CI/CD güvenlik kapıları bağlamında teorik kavramları, araştırma yöntemlerini ve metodolojik yaklaşımları içeren bir analiz sunulur.

## 1. Çalışma Başlığı Değerlendirmesi

Önerilen başlık, sunucusuz edge ortamlarında “varsayılan” DevSecOps güvenlik kapılarının (örneğin, SAST kuralları) olay kaynaklı ve platforma özgü zafiyetleri ne ölçüde tespit edebildiği sorusunu ele almaktadır. Literatürde **sunucusuz** (serverless) ve **edge computing** bağlamında uygulama güvenliği giderek önem kazanmıştır. Ancak başlıkta vurgulanan “varsayılan kapılar” ve “algılama boşlukları” gibi terimler, literatürdeki genel eğilimlerle uyumludur. Örneğin, Barrak ve ark. sunucusuz CI/CD boru hattını ele alarak *injection* saldırılarını ve güvenlik analizini incelemişlerdir. Brito ve ark. ise Node.js kod tarayıcılarının tespit kabiliyetini kıyaslamış ve birçok önemli zafiyetin herhangi bir araç tarafından tespit edilmediğini göstermiştir. Bu çalışmalar, genel olarak sunucusuz güvenliği ve statik analiz performansını konu aldığından, başlıkta önerilen *“Detection Gaps”* temasıyla örtüşmektedir. Bununla birlikte, mevcut literatür sunucusuz uygulamalarda **özellikle olay tabanlı kaynaklardan beslenen zafiyetlere** odaklanmamaktadır. Bu nedenle başlık, araştırmanın yenilikçi yönünü vurgulamaktadır.

Sonuç olarak, başlık özünde uygundur; ancak daha açık biçimde “event-driven” vurgusu yapılabilir. Örneğin, **“Do Default DevSecOps Gates Detect Event-Sourced Vulnerabilities in Serverless Edge Apps?”** ya da **“Event-Driven Serverless FaaS: Are Default DevSecOps Rules Adequate?”** gibi alternatifler önerilebilir. Bu alternatiflerde araştırma sorusu (HTTP dışı olay kaynaklarından gelen girdi yoluyla oluşan zafiyetler) kaybolmadan vurgulanmış olur. Ancak başlık yine de kapsamlıdır ve araştırma sorusunu değiştirmemektedir.

## 2. Araştırma Alanı ve Kapsamı

Bu çalışma, **sunucusuz edge bilişim**, **olay tetiklemeli uygulamalar** ve **DevSecOps/SAST** alanlarının kesişiminde yer alır. Özellikle Cloudflare Workers gibi *sunucusuz edge* platformlarda, **sunucu kodu yerine olay-kaynaklı (event-driven) akışlarla** çalışılan uygulamalarda güvenlik analizinin nasıl işlediği incelenir. Literatürdeki temel konular şunlardır: 
- **Sunucusuz Bilişim ve Edge Uygulamaları:** Sunucusuz (FaaS) mimarilerde uygulama fonksiyonları kısa ömürlü, olay odaklıdır. Cloudflare Workers, AWS Lambda@Edge, Vercel Edge gibi teknolojilerde fonksiyonlar *HTTP çağrıları*, kuyruk mesajları, zamanlayıcılar, dosya yüklemeleri veya webhook gibi çeşitli olay kaynaklarıyla tetiklenebilir. Bu çeşitlilik, saldırı yüzeyini genişletir. Örneğin OWASP kılavuzu, sunucusuz fonksiyonların dosya sistemleri, veri depoları, e-posta, SMS gibi kanallardan tetiklenebileceğini vurgular. 
- **Sunucu ve Edge Güvenlik Tehditleri:** Çok kiracılı (multi-tenant) ortamda çalıştırılan V8 isolateleri veya mikroVM’ler donanım seviyesinde soyutlama sağlasa da yan kanal saldırıları ve kaynak paylaşımı riskleri vardır. Fonksiyonlar arası izolasyonun kırılması, bellek sızıntısı veya bilgi sızması mümkün olabilir. Ayrıca dosya veya veritabanı olay enjeksiyonları, *server-side request forgery (SSRF)*, SQL enjeksiyon, kod enjeksiyonu, hatalı yetkilendirmeler, IDOR/BOLA vb. sunucu tarafı zafiyetleri sunucusuz bağlama özgü biçimleriyle da görülebilir. Literatürde *“event injection”* veya *“event poisoning”* terimleri bu tehditleri kapsar. Örneğin Marin ve ark., sunucusuz fonksiyonların çok çeşitli olay kaynaklarından tetiklenmesinin saldırı yüzeyini önemli ölçüde genişlettiğini belirtmiştir.
- **Sunucu Uygulama Güvenliği ve Olay-Kaynağı Tehditleri:** OWASP Sunucusuz Top 10 gibi kaynaklar, sunucusuz uygulamalarda en yaygın zafiyet türlerini sıralar. Bu zafiyetler arasında **input validation** eksiklikleri, enjekte edilebilir olay verileri, fazla yetkili IAM rolleri ve yanlış yapılandırılmış event trigger’lar yer alır. Örneğin OWASP Serverless yorumunda, SQL/NoSQL enjeksiyonun hâlâ mümkün olduğu; özel dosya yüklemeleri veya veri tabanı olaylarıyla kod enjeksiyonun tetiklenebileceği vurgulanmıştır. Ancak literatürde, bu olay kaynaklarını statik analiz içinde doğrudan **güvenilmez girdi kaynağı (taint source)** olarak modelleyen çalışmalar nadirdir. Çoğu çalışma genel uygulama veya HTTP-odaklı riskleri inceler.
- **CI/CD ve DevSecOps Güvenliği:** Sürekli entegrasyon/teslim (CI/CD) boru hatları artık *DevSecOps* güvenlik kapılarıyla donatılmaktadır. Bu kapılar genellikle SAST (kod tarama), SCA (bağımlılık taraması), secrets scanning, IaC güvenlik taraması gibi statik kontroller içerir. Literatürde GitHub Actions, Jenkins, vs. ortam güvenliği; SLSA, SBOM, Sigstore gibi tedarik zinciri standartları incelenmiştir. Ancak sunucu ve edge dağıtımlarına özgü CI/CD güvenlik sınırları (ör. önizleme dağıtımları, rol sınırları, OIDC/ID federation) konusunda çalışmalara az rastlanmaktadır.
- **Statik Kod Analizi (SAST) ve Veri Akışı Analizi:** Araştırma Node.js/JavaScript sunucu kodu için uygulanabilecek statik analiz tekniklerine odaklanmaktadır. SAST araçları (CodeQL, Semgrep, Gitleaks, Checkov, Trivy, vs.) genellikle HTTP isteklerini, Express.js veya AWS Lambda konteksini anlar; ancak olay kaynaklı tetiklemeleri (ör. S3 event, cron, RabbitMQ mesajı) **“taint kaynağı”** olarak varsayıp varsaymadıkları belirsizdir. Program analiz literatüründe kontekste duyarlı, path-özgü statik taint analizi yöntemleri vardır, ancak bunlar genellikle geleneksel web uygulamaları için geliştirilmiş olup sunucusuz platformlar özelinde genişletilmemiştir.

## 3. Temel Araştırma Hipotezi

**Hipotez:** *Varsayılan SAST kural setleri ve veri akışı modelleri, kuyruğa gelen mesajlar, zamanlayıcı (cron) olayları, nesne depolama tetiklemeleri, web kancaları gibi HTTP dışı olay kaynaklarını güvenilmez girdiler olarak yeterince modellemeyebilir. Sonuç olarak, aynı yapısal zafiyet HTTP kaynaklıyken tespit edilse de, olay tabanlı kaynakla aynı taint akışı oluşturulduğunda bu zafiyetler önemli oranda gözden kaçabilir.*

**Elde edilen kanıtlar ve açık noktalar:** Mevcut literatürde bu hipotezi doğrudan test eden bir çalışma **bulunamamıştır**. Bununla birlikte ilgili çalışmalardan şu çıkarımlar yapılabilir:  
- **Gösterilmiş Olanlar:** Barrak ve ark. (FaaSGuard) genel bir sunucusuz CI/CD boru hattı sunmuş; injection saldırılarına karşı statik analiz gerekçesiyle event kaynaklarının önemini vurgulamışlardır. Brito ve ark. ise Node.js için SAST araçlarının genel performansını karşılaştırmış, OWASP-10’daki zafiyetlerin pek çoğunun hiçbir araçta yakalanmadığını ve en iyi üç aracın bile ancak ~%57’sini tespit ettiğini göstermiştir. Bu çalışmalarda spesifik olarak HTTP vs olay kaynağı karşılaştırması yapılmamıştır. Sunucusuz ortam güvenliği literatürü genelde potansiyel saldırı yüzeyinin genişlediğini belirtmiş, ancak **istatistiksel karşılaştırmalı analiz** eksiktir.
- **Varsayılmış/Oluşturulmuş Olanlar:** Sunucu dünyasında olay kaynaklı veri akışının önemi genellikle *güvenlik topluluğu* tarafından not edilmiştir (ör. OWASP Serverless Top10’da injection zafiyetlerinde olay kaynaklarının dikkate alınması gerektiği). Ancak akademik literatürde bu, ampirik hipotez yerine genel kabul veya öneri niteliğindedir. Henüz varsayımsal düzeyde kalmıştır.
- **Dolaylı Çalışmalar:** Genel sunucu uygulama güvenlik incelemeleri ve SAST araç değerlendirmeleri, çoğunlukla **HTTP/sunucu-isteği** senaryoları üstünde yoğunlaşmıştır (ör. Brito 2023’de Node.js koda dair dataset HTTP-odaklı olabilir). Sunucusuz platformlar için SAST performansı veya olay temelli veri akışı modellenmesi yönelik doğrudan literatür azdır. Ancak *genel SAST benchmark* çalışmalarında “eksik kalma” (false negative) problemleri rapor edilmiştir. Ayrıca olay bazlı asenkron veri akışına dair program analiz yöntemleri (dinamik bilgi akışı takibi, IFC) sunulsa da bunların SAST araçlarına entegrasyonu sınırlıdır.
- **Test Edilmemiş/Belirsiz Olanlar:** Belirttiğimiz gibi, literatürde “HTTP kaynağı vs olay kaynağı” karşılaştırması yaparak aynı zafiyet için tespit farkını ölçen ampirik bir çalışma (RQ2 gibi) bulunmamaktadır. Ayrıca platform-spesifik bağlama (ör. Cloudflare Worker’ın KV/R2 binding’leri) açılarından SAST kurallarının eksikleri çoğunlukla dokümente edilmemiştir. CI/CD pipeline’larının sunucu dağıtımlarında performans etkisi üzerine doğrudan ölçümler de sınırlıdır. 

Özetle, mevcut çalışmalar **sunucu-odaklı zafiyet tespiti** ve **genel DevSecOps** problemlerini ele almakta; ancak **olay tabanlı girişlerin statik analiz kabiliyeti** gibi temel hipotezimiz doğrudan sınanmamıştır. Bu nedenle hipotez bilimsel olarak henüz **kanıtlanmamış, ama literatürde önemli bir boşluk** olarak gözükmektedir.

## 4. Araştırma Soruları Bağlamında Literatür

### RQ1: Varsayılan CI Güvenlik Kapıları Sunucusuz Özgü Zafiyetleri Ne Kadar Etkili Tespit Ediyor?

Varsayılan güvenlik tarama araçları (CodeQL, Semgrep CE, Opengrep, Gitleaks, Trivy, Checkov, OSV-Scanner vb.) genellikle web/REST-uygulamalara yöneliktir. Brito ve ark. 957 adet Node.js zafiyeti içeren bir çalışmada, sekiz farklı SAST aracını test etmiş ve en iyi üçlü kombinasyonunun bile **tüm zafiyetlerin ancak %57.6’sını** yakalayabildiğini göstermiştir. Bu çalışma, sunucusuz senaryolara özel değildir ancak Node.js ekosistemi için önemli bir tespit oranı boşluğu olduğunu ortaya koyar. Diğer taraftan Barrak ve ark. FaaSGuard çerçevesinde kodu statik tarayan Bandit (Python) ve benzer araçları entegre etmiş, açık kaynak fonksiyonlarda injection ve bağımlılık zafiyetlerine dikkat çekmiştir. 

Ancak spesifik olarak Cloudflare Workers veya AWS Lambda örneği üzerinden “sunucusuz özel” zafiyetler için varsayılan araçların tespit etkinliğini inceleyen çalışma bulamadık. Checkov, Trivy, OSV-Scanner gibi araçlar çoğunlukla konteyner ve bağımlılık güvenliğine odaklanırken, CodeQL/Semgrep gibi araçlar kod desenlerini arar. Literatürde **sunucusuz Binding’leri (ör. R2, KV) veya olay tetikleyicilerini** anlayan kural setleri konusunda net sonuçlar yoktur. Dolayısıyla RQ1 bağlamında *edindiğimiz kanıt*: Genel SAST araçlarının Node.js/JavaScript kodundaki bilinen zafiyetlerin ancak sınırlı bir kısmını tespit ettiği bilinmektedir. Sunucusuz özgü ek zafiyetleri kapsayıp kapsamadıkları ise belirsizdir; bu açıdan ikinci el gösterimler (aracın kural kitaplığı açıklamaları) dışında ampirik veriye rastlanmamıştır.

### RQ2: Aynı Zafiyet HTTP Kaynağı Yerine Olay-Kaynağından Geldiğinde Tespit Oranı Azalıyor mu?

Bu sorunun cevabı mevcut literatürde **açıkça ölçülmüş değildir**. Hepimiz biliriz ki olay kaynakları (mesaj kuyrukları, zamanlayıcılar, dosya-yükleme olayları, webhook’lar vb.) yapı olarak farklıdır; ancak teorik olarak bir noktadaki taint akışı HTTP istekten gelen veri ile eşdeğer biçimde uygulanabiliyorsa, ideal bir araç bu ikisini de yakalamalıdır. Fakat literatürde bu durumun SAST açısından nasıl farklılık gösterdiğine dair çalışan bulamadık. Brito ve ark. gibi benchmark çalışmaları genelde “genel Node.js kodu” için yapılmıştır. Bu çalışmalar, her ne kadar OWASP-10 zafiyetlerinden birçoğunu incelemiş olsa da, zafiyet kaynaklarının “HTTP mi, başka bir olay mı” olduğuna göre analiz yapmamışlardır. Bu nedenle “ayni taint akısı” varsayımını koruyan çalışma **mevcut araştırmada yoktur**.

Dolaylı olarak, OWASP Sunucusuz Top 10 ve FaaSGuard gibi kaynaklar, olay kaynaklarının saldırı yüzeyini genişlettiğini ifade eder. Örneğin OWASP Sunucusuz Dokümantasyonu, *input* olarak sunucusuz fonksiyonun farklı olay türlerinden veri alabileceğini belirtir ve “uygulama sınırları artık API çağrılarından ibaret değildir” der. Ancak bu sadece problem tanımıdır; herhangi bir SAST aracının bu farklı kaynakları nasıl analiz edeceği konusu araştırılmamış. Özetle RQ2’nin cevabı: **Hiçbir doğrudan çalışma bulunamamıştır**, bu araştırmanın ortaya koyduğu yeni bir sorudur.

### RQ3: Platforma Özgü Özel Kurallar Açıklama Boşluklarını Kapatabilir mi?

Sunucu platformlarına özgü (ör. Cloudflare Worker bağlamları, AWS EventBridge, vb.) güvenlik kuralları oluşturarak boşluklar azaltılabilir. Literatürde Semgrep CE veya CodeQL için özel kurallar yazımı destekleyen örnekler (ör. topluluk kuralları) vardır. Örneğin Barrak’ın çalışmasında CodeQL, Bandit, Trivy gibi araçlar entegre edilmiştir. Ancak bu kaynaklar daha çok genel güvenlik politikasıdır. Sunucuya özgü bağlamlar için OPA/Rego ve Policy-as-Code uygulamalarına değinilmiştir (Barrak et al. pipeline’da OPA kullanımı).

Kısaca: Özel kurallar geliştirmenin etkili olacağı varsayılmaktadır (hipotezimiz RQ3). Literatürde benzer bir “özel kural seti ile tespit oranı artırma” çalışmasına rastlamadık. Bununla birlikte genel SAST araştırmaları, aracın kurallarının kapsamını genişletmenin (özel kurallar eklemenin) eksik tespitleri azaltabileceği yönünde fikir birliği içerir. Örneğin Brito et al. yeni bir Node.js güvenlik dataset’i sunarak araç geliştirmeye teşvik etmektedir. Semgrep EASE 2024 gibi endüstri çalışmaları, performans/etkinlik iyileştirmeye yönelik öneriler sunmuştur (ör: “Semgrep kural yazımını geliştiriyoruz”). Bu bağlamda RQ3’ün literatürde tam karşılığı bulunmasa da, özelleştirilmiş kuralların devreye girmesinin potansiyel bir çözüm olduğu kabul edilir.

### RQ4: Bu Kapıların CI/CD Üzerinde Ek Performans Yükü Var mı?

CI/CD boru hattına entegre edilen her ek güvenlik aracı (SAST, SCA, vb.) derleme süresine bir yük bindirir. Literatürde genel olarak SAST araçlarının çalışma süresi, bellek tüketimi gibi performans metriklerini ölçen çok sayıda çalışma yoktur. Çoğu akademik çalışma tespit oranlarını ön plana çıkarmış, süre/overhead konusu ya göz ardı edilmiş ya da deneysel aparatının dışındadır. Örneğin Brito et al. araçların kesinlikle çok düşük hassasiyet sağladığını söylerken, zaman/performans hakkında bilgi vermez. CI/CD özelinde, Amazon Inspector gibi ticari ürünler tarafından “güvenlik taramasının derlemeyi yavaşlatmaması gerektiği” belirtilmiştir (AWS blog), ancak bunlar da literatür değil endüstri blogudur. 

Dolayısıyla RQ4 açısından **literatürde sınırlı bilgi** mevcuttur. Deneysel olarak pipeline sürelerine, tarama gecikmesine ve kaynak tüketimine odaklanan çalışmalara rastlamadık. Bu da bu araştırmanın yenilikçi yönlerinden biridir; çünkü pratikte geliştiriciler için kritik olan “yavaşlamanın kabul edilebilir sınırı nedir” sorusu genellikle akademik literatürde ihmal edilir. Mevcut literatür, bir SAST aracının doğruluğu ve tespit gücü üzerinde durur, **verimlilik/ölçeklenebilirlik** tarafı az çalışılmıştır.

## 5. Kavram Haritası

| Kavram                          | Tanım                                                                                     | Eşanlam / Varyantlar                | Yakın İlişkili Kavramlar                      | Çalışmaya İlgisi                              |
| ------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------- | --------------------------------------------- | --------------------------------------------- |
| **Serverless Edge Computing**   | Arka planda sunucu yönetmeden, uç noktalarda (CDN/POD) çalışan FaaS uygulamalarıdır.       | Edge Functions, FaaS               | MicroVM, V8 Isolate, Deno Deploy, Lambda@Edge  | Çalışmanın ana platformu; analiz focus konusu.|
| **FaaS**                        | İşlevlerin bulut sağlayıcı tarafından otomatik ölçeklenip çalıştırıldığı model.               | Function-as-a-Service              | Serverless, Lambdas, Functions                 | Sunucu/işlev modelinin genel terminolojisi.   |
| **Event-driven Architecture**   | Uygulama mantığının olaylar (HTTP, mesaj, zamanlayıcı vb.) ile tetiklendiği model.        | Olay-Temelli, Event-Loop           | Asenkron programlama, Callback, Queue-based    | Sunucusuz mimarinin doğası; tetikleme kaynakları.|
| **Event Injection**             | Kontrolsüz olay girdilerinin kötü niyetli şekillerde manipüle edilmesi saldırısı.           | Event Spoofing                     | Injection, Spoofing                           | Sunucusuz uygulama zafiyeti; literatürde OWASP vurgusu.|
| **Event Source**                | Fonksiyonu tetikleyen olay aracı (HTTP isteği, kuyruk, cron, dosya olayı, webhook vb.).     | Trigger, Event-Kaynağı             | Input Source, Webhook, Cron                   | Tahta bir güvenlik sınırı; SAST’te “taint kaynağı” olarak ele alınması öneriliyor.|
| **Taint Source (Kirletici)**    | Analizde güvenilmez veri kaynağı; kötü niyetli girdi akışının başladığı nokta.             | Kirletici Girdi                    | Untrusted Input, Entry Point                  | Olay kaynakları genelde taint kaynağıdır; modelleme gereksinimi.|
| **Taint Analysis**              | Kodda verinin güvenilmez noktadan çıktıya (sink) akışını takip eden statik analiz türü.    | Bilgi Akışı Analizi, Flow Analysis | Dataflow Analysis, Source-to-sink Analysis    | Dinamik/static analiz tekniklerinde temel; SAST araçları bazı kod sınıflandırmalarıyla (sink/key) yapar.|
| **Dataflow Analysis**           | Program akışını inceleyerek veri taşıyıcılarını ve ilişkilendirmelerini belirleme.          | Veri Akışı Çözümü                  | Control-flow Graph, Call Graph, SSA           | Gelişmiş SAST: taint analizi bir alt kümesi; sunucusuz bağlamda kaynakları içerebilir.|
| **SAST (Static Application Security Testing)** | Kaynak kodu analiz ederek güvenlik sorunlarını önceden tespit etme süreci. | Statik Kod Tarayıcı, Static Analyzer | CodeQL, Semgrep, Infer, Joern, SonarQube, etc.| RQ1–RQ3 kapsamında değerlendirilecek araç grubu.|
| **DevSecOps**                   | DevOps süreçlerine güvenlik kontrollerinin entegrasyonu; “soldan kaydırma” önemsenir.     | Güvenli DevOps                     | Shift-left Security, CI Security             | Çalışmanın merkezinde; DevSecOps kapıları ve uygulamaları incelenir.|
| **Security Gate**               | CI/CD içinde çalışan otomatik güvenlik testi adımı (örneğin kod tarayıcı).                 | Quality Gate, Policy Gate          | CI/CD Pipeline, DevSecOps Kapısı             | Araştırma nesnesi; RQ1'de etkinliği, RQ4'te performansı ölçülecek.|
| **IaC (Infrastructure as Code)**| Bulut/edge altyapı kaynaklarını kod (Terraform, CloudFormation) ile tanımlama tekniği.    | Kod Olarak Yapılandırma            | Configuration-as-Code, Deployment Code       | Hem bulut hem sunucusuz güvenliğinde analiz edilir; Checkov gibi araçlar IaC tarar.|
| **Policy-as-Code**              | Ortam politikalarını (ağ, güvenlik vb.) kod olarak ifade eden yaklaşım.                   | Rego, OPA, Sentinel                 | Security Policy, Otorizasyon                | Özel güvenlik kuralları geliştirmek için önerilir (RQ3 teknolojileri).|
| **SCA (Software Composition Analysis)** | Yazılım bağımlılıklarındaki zafiyetleri tarayan araçlar ve süreçler.               | Bağımlılık Güvenlik Tarama         | SBOM, Dependabot, OSV-Scanner               | DevSecOps kapılarında tamamlayıcı rol; kodun ötesinde bağımlılık sorunları aranır (RQ1 desteği).|
| **Software Supply Chain Security** | Yazılım üretim süreçlerinin bütünsel güvenliği (bağımlılık, imzalama, vs.).         | Tedarik Zinciri Güvenliği          | SLSA, Sigstore, SBOM, Supply-Chain Attacks | CI/CD güvenliğinin bir parçası; Dozuma ve “build time” saldırılara karşılık.|
| **CI/CD Security**              | Sürekli entegrasyon ve dağıtım süreçlerinin güvenliği, pipeline’ın ihlalden korunması.    | Pipeline Security                  | Runner Isolation, GITHUB_TOKEN Permissions  | Araştırmada GHActions, OIDC, vs. bağlamında ele alınacak (Area C, K).|
| **Zero Trust**                  | “Hiçbir şeye güvenme, her şeyi doğrula” politikası; özellikle iç ağ saldırılarına karşı.     | ZTNA (Zero Trust Network Access)    | Least Privilege, mTLS, API Gateway         | Uygulamalar arası iletişim ve önizleme ortamları için ek güvenlik modeli; destekleyici kavram.|
| **Preview Deployment**          | Yeni değişikliklerin izinsiz ortamlarda otomatik dağıtımı, PR önizleme.                  | Pull Request Preview, Staging Env  | Review Apps, Safe Deployment               | DevSecOps akışında önerilen bir adım; saldırı yüzeyi ve güvenlik politikaları açısından incelenir.|
| **Platform-specific Vulnerability** | Belirli bulut/edge platform özelliklerinden kaynaklanan özgün güvenlik zafiyeti.       | Cloudflare-specific issue, FaaS-specific | API Binding Flaws, Vendor Bug            | Cloudflare Workers gibi platformlara özgü senaryolarda ortaya çıkar; RQ1-3’te hedeflenen zafiyetler.|
| **False Negative (Yanlış Negatif)** | Zafiyet mevcutken araç tarafından **farkedilmeme** durumu.                             | Kaçırılan Zafiyet                  | Undetected, Missed Vulnerability          | SAST performans değerlendirmesi; RQ1/RQ2’de tespit oranı azalmasına işaret eden metrik.|
| **Detection Gap**               | Bir aracın tespit etmesi gereken zafiyetler ile gerçekten tespit ettikleri arasındaki fark. | Eksik Tespit Farkı                | Recall Deficiency, Coverage Gap           | Çalışmanın merkezindeki kavram; özellikle HTTP ile olay kaynağı arasında fark olduğunu gösteren kavram. |

Bu kavramlar arasında örneğin *event injection → untrusted event source → taint source modeling → dataflow analysis → SAST detection* gibi bir zincir kurulabilir. Ayrıca *GitHub Actions → kimlik bilgisi (OIDC/Static token) → deployment CLI → edge platform → deployed application* akışı, CI/CD bölümünde ele alınacaktır.

## 6. Anahtar Kelime Matrisi

Aşağıdaki tablo, her araştırma alanı için temel ve ilgili anahtar kelimeleri, eşanlam/yakın kavramları, ve alana özgü dışlama terimlerini gösterir:

| Araştırma Alanı                       | Anahtar Kelimeler                            | Eşanlam / Varyantlar            | İlgili Terimler                    | Hariç Tutma Terimleri                    |
| ------------------------------------- | -------------------------------------------- | ------------------------------- | ---------------------------------- | ---------------------------------------- |
| **Serverless Güvenlik**               | serverless security, FaaS security            | Function-as-a-Service security  | Cloud Functions, Serverless Edge  | IoT, Blockchain, Non-cloud (sunucusuz olmayan) |
| **Olay Tabanlı Tehditler**            | event-driven security, event injection, webhook attack | message queue security, cron security | asynchronous processing, event poisoning | UI injection, phishing (uygunsuz kullanılan anlamlardaki event) |
| **CI/CD ve Güvenlik**                | CI/CD security, pipeline security, DevSecOps | continuous deployment security  | software supply chain, SLSA, SBOM | Performance tuning, build performance (fokus değildir) |
| **DevSecOps (Genel)**                | DevSecOps, shift-left security               | DevOps security, CI security    | automated testing, security automation | Organizational DevOps culture (odak insan/yönetim değil) |
| **SAST / Statik Analiz**             | static analysis, SAST, taint analysis        | static code analysis, source-sink analysis | semgrep, CodeQL, taint tracking   | Dynamic analysis, fuzz testing, penetration testing |
| **JavaScript/TypeScript Kod**        | JavaScript security, Node.js vulnerabilities | TypeScript analysis, Node security | npm dependencies, express.js, AWS Lambda Node | Java, C#, non-JS languages (fokus JS/TS dışında) |
| **IaC ve Konfigürasyon Güvenliği**    | IaC security, Terraform security, policy-as-code | infrastructure as code, rego, OPA | Checkov, KICS, cloud formation    | Runtime (çalışma zamanı) güvenliği (konfig taraması odağı) |
| **SCA ve Bağımlılık Güvenliği**       | SCA, dependency scanning, os-vulnerability     | software composition analysis    | dependabot, trivy, OSV-Scanner     | Kod tabanlı güvenlik testleri (SAST) (bağımlılıklardan bahsedilmeyen) |
| **Zero Trust / API Security**         | zero trust, API security, mTLS, WAF           | ZTNA, API gateway, OpenAPI       | authentication, authorization, schema validation | Network güvenliği genel (fokus modern app kontrollerinde) |
| **Poliçya-as-Code**                  | policy-as-code, OPA, Rego                    | policies as code, sentinel      | guardrails, governance as code     | Standart konfigürasyon (non-policy) (konfig tarayıcıları dışında) |
| **Ölçüt ve Metodoloji**               | SAST benchmark, McNemar test, false negative rate | empirical study, statistical analysis | Cochran’s Q, Fisher’s exact       | Algoritma geliştirme (sağlamlık testleri hariç metodoloji) |

- Exclusion (hariç tutma) terimleri, alana ilintisiz sonuçları sınırlamak amacıyla seçilmiştir. Örneğin, “blockchain” veya “IoT” Serverless bulguları ararken karmaşıklaşabileceğinden dışlanabilir. 

## 7. Arama ve Tarama Metodolojisi

Bu literatür taraması, sistematik bir haritalama çalışması yaklaşımıyla yürütülmelidir. Aşamalar önerilen şekilde olmalıdır:

1. **Veritabanı Aramaları:** IEEE Xplore, ACM DL, Scopus, Web of Science, SpringerLink, ScienceDirect, Google Scholar, arXiv gibi kaynaklarda yukarıdaki anahtar kelimeler ve Boolean sorgularla arama yapılır. Örneğin:  
   - **IEEE:** `(serverless OR FaaS OR "edge functions") AND (security OR vulnerability)`  
   - **ACM:** `"serverless security" OR "FaaS security" OR "event injection" OR "static analysis"`  
   - **Scopus/Web of Science:** geniş kapsamlı olarak “serverless security” vb.  
   - **Google Scholar/arXiv:** "serverless taint analysis", "CodeQL lambda static".  
   Her veritabanının sözdizimine dikkat edilerek sorgular çoğaltılır.  

2. **Tekrarları Kaldırma (Deduplication):** Elde edilen sonuçlar bibliyografik araçlarla ve referans yönetim yazılımlarıyla birleştirilir ve tekrarlar çıkarılır.

3. **Başlık Taraması:** Sonuç listesi, araştırma konusu dışı görünen başlıklar elenir. Örneğin, ekonomi-sunucusuz ilgili makaleler ya da sadece “serverless” geçen ama güvenlik dışı makaleler çıkartılır.

4. **Özet Taraması:** Kalan yayınların özetleri okunur. Çalışmanın RQ’larına veya anahtar kavramlara (sunucusuz güvenlik, SAST vs.) uygun olmayan özetler elenir. Örneğin, “only performance in FaaS” teması ya da “teknik alt yapı yerine iş uygulama süreçleri” gibi ilgisiz konular atılır.

5. **Tam Metin Taraması:** Son adımda kalan çalışmalardan tam metni erişilebilenler detaylı incelenir. Makalelerin yöntemi, veri seti, araçları, kapsamı, bulguları değerlendirilir. Atıf listeleri (snowballing) bu aşamada genişçe kullanılır.

6. **Kartal Taraması (Backward/Forward Snowballing):** Seçilen önemli makalelerin kaynakça listeleri taranır (backward snowballing) ve bunlar arasından ilgili bulunanlar ek taramaya alınır. Ayrıca, kritik makalelerin atıf aldığı daha yeni çalışmalar (forward snowballing) Google Scholar veya Semantic Scholar üzerinden tespit edilir. Yeni makaleler de aynı şekilde özet/anahtar kelime filtresinden geçirilir.

7. **Kalite Değerlendirmesi:** Dahil edilen çalışmalar, metodolojik tutarlılık, veri seti şeffaflığı, deney tasarımı netliği, araç/versiyon bildirimleri gibi kriterlere göre kalite açısından değerlendirilir (bkz. Bölüm 27).

8. **Veri Çıkarımı ve Sentez:** Nihai dahil edilen yayınların her birinden veri, tematik veya tabular olarak toplanır (örn. inceleme matrisi). Ortak temalar, farklılıklar, boşluklar sentezlenir.

9. **Tematik Sentez:** Belirlenen alt konular (sunucu güvenliği, SAST taramaları, CI/CD performans vb.) çerçevesinde literatür bir araya getirilir. Her tema altındaki sonuçlar karşılaştırılarak literatürdeki eğilimler, sınırlamalar ve açık sorular tanımlanır.

## 8. Dahil/Tutma Kriterleri

Çalışmaya dahil edilecek çalışmalar şunlar olmalıdır:  
- **Empirik/Deneysel çalışmalar:** En önemli kriter. Araştırma problemiyle ilgili deneysel veya ölçüm çalışmalar (ör. SAST araç testi, güvenlik benchmarkı, boru hattı performans ölçümü).  
- **Araştırma makaleleri:** Hakemli konferans/journal yayınları (IEEE, ACM, Springer, Elsevier, USENIX gibi).  
- **Sistematik incelemeler/derlemeler:** Mevcut SLR veya meta-analizler (ör. Rajapakse DevSecOps SLR; Wen et al. serverless SLR).  
- **Güvenlik Anketleri, Sınıflandırmalar:** Sunucusuz/DevSecOps tehdit sınıflandırmaları, OWASP gibi raporlar. (Akademik değilse de OWASP Serverless Top10, DVSA vb. hıfz edilebilir, gri literatür olarak etiketlenir.)  
- **Araç Değerlendirmeleri/Benchmarklar:** SAST araç karşılaştırmaları, Juliet/OWASP benchmark gibi çalışmalar.  
- **CI/CD ve Tedarik Zinciri Güvenliği:** İnceleme ve deneysel çalışmalar (örn. SLSA uygulanabilirliği, GitHub Actions risk analizi).  
- **Program Analizi Çalışmaları:** Statik ve veri akışı analizine dair temel akademik çalışmalar (özellikle JavaScript/TypeScript analizleri).  

Bu çerçevede **güvenlik odaklı** olmayan makaleler hariç tutulur. Örneğin, sadece sunucusuz performans, ölçeklenebilirlik veya maliyet analizi yapan çalışmalar, ya da “devsecops” terimi sadece kafiyenize girdiği için bahsedilen (örneğin pazarlama makaleleri) çalışmalar kapsam dışıdır. Yine, “sunucusuz edge” terimlerini içerse bile güvenlikle ilgisiz network/latency odaklı makaleler çıkarılmalıdır.

## 9. Dahil Etme/Kaldırma Kriterleri

**Dahil Edilecekler:** Yukarıda belirtildiği gibi, sunucusuz güvenlik, SAST, DevSecOps, CI/CD, SCA ve ilgili alanlardaki ampirik, deneysel ve inceleme çalışmalar, tehdit sınıflandırmaları ve araç değerlendirmeleri.

**Hariç Tutulacaklar:**  
- Sadece performans/ölçek gibi teknik özniteliklere odaklanan sunucusuz çalışmalar (güvenlik bulgusu yoksa).  
- Maliyet, ekonomi veya endüstriyel adaptasyon çalışmaları (güvenlik içermiyor ise).  
- B2B vendor dökümantasyonları veya pazarlama belgeleri (gri literatür kapsamına girebilir, ancak akademik eş değer sayılmaz).  
- Yalnızca “generic cloud security” ya da “DevSecOps kavramları” üzerinde yüzeysel duran, somut uygulama veya deney içermeyen derlemeler.  
- Çıkarımlarımızdan açıkça görünen borderline durum: Örneğin bir makale “DevSecOps önemi” diye sadece strateji anlatıyorsa ama pratik araç değerlendirmesi yoksa dahil edilmeyebilir. Ancak “CI/CD pipeline’da güvenlik zafiyetleri” vb. sistematik inceleme varsa bakılabilir.

## 10. Literatür Kalite Değerlendirmesi (Örnek Sorular)

Her önemli çalışma, nitelikli olarak değerlendirilecektir:  
- **Empirik mi?** (Deney, benchmark, ölçüm içeriyor mu?)  
- **Veri seti tanımlı mı?** (XSS, injection vb. zafiyetler net olarak anlatılmış mı, dataset nasıl toplandı?)  
- **Yöntem tekrar edilebilir mi?** (Araç versiyonları, konfigürasyonlar, deney protokolleri belirtilmiş mi?)  
- **Kullanılan araçlar/ara yüzler belirtilmiş mi?** (Örneğin CodeQL sorgu kodları, Semgrep kuralları, SCA veritabanı sürümleri vs.)  
- **Gerçek Ground-truth var mı?** (Gerçek zafiyetler nasıl belirlendi?)  
- **Yanlış negatif ölçümü yapmış mı?** (Eksik tespit oranı değerlendirildi mi? Brito gibi kritik)  
- **Sınırlamalar tartışılmış mı?** (Çalışmanın alacağı genelleme payı, platform/kod özellikleri sınırlandırılmış mı?)  
- **Sunucu/olay odaklı mı?** (Özellikle biz etki analizi yapıyoruz: güvenlik bulguları kontekstinde bu çalışma sunucusuz bağlamı ne kadar göz önüne alıyor?)  

Sahada sayısal puanlama yapılmaktan çok, bu sorulara *niteliksel* yanıt üretilecektir. Örneğin “Ground truth’un nasıl belirlendiği belirsiz; platform bağımlı mı net değil; platform özgü eklenti kural yok” gibi yorumlar.

## 11. Temel Kaynaklar Matrisi

Aşağıdaki tablo, özgün konuyla yüksek ilişkili en az 20 çalışmayı özetler. Örnek birkaç satır gösterilmiştir:

| #  | Yazarlar (Yıl)         | Başlık                                                | Konferans/Dergi        | Çalışma Türü      | Araştırma Alanı                | Platform       | Yöntem / Veri Küm.                                           | Ana Bulgular                                                    | Sınırlamalar                                  | RQ1 İlgisi    | RQ2 İlgisi    | RQ3 İlgisi   | RQ4 İlgisi   | Kaynak (DOI/URL)                 | Onaylandı |
|----|------------------------|-------------------------------------------------------|------------------------|-------------------|------------------------------|---------------|--------------------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------|---------------|---------------|--------------|--------------|---------------------------------|-----------|
| 1  | Barrak et al. (2025)   | *FaaSGuard: Secure CI/CD for Serverless…*             | arXiv/Usenix (2025)    | Deneysel, sistem| DevSecOps, Serverless        | OpenFaaS, genel| 20 açık kaynak fonksiyon, entegre Bandit/Trivy kod tarayıcıları| Çeşitli saldırılar (injection, gizli anahtar) CI aşamasında algılandı. Event enjeksiyon tehdidi vurgulandı.  | Sadece OpenFaaS odaklı, Cloudflare vb. test edilmedi; performans ölçümü yok.  | Orta          | Düşük (etkisi ölçülmedi) | Orta (örnek OPA kural) | Düşük       | arXiv:2509.04328               | Evet      |
| 2  | Brito et al. (2023)    | *Study of JavaScript Static Analysis Tools…*           | IEEE T-Reliability      | Benchmark        | SAST, Node.js                 | Node.js        | 957 Node.js zafiyeti (npm adv.) üzerine 9 SAST aracı test   | En iyi 3 araç %57.6 algılama, çok düşük kesinlik (precision 0.11).  | Yalnızca Node.js, sunucusuz özel değil, sadece kod zafiyetleri.                 | Yüksek        | Düşük (sadece HTTP varsayıldı) | Yüksek (hazır kural set analizi) | Düşük       | DOI:10.1109/TR.2023.3286301    | Evet      |
| 3  | Rajapakse et al. (2022) | *Challenges and solutions when adopting DevSecOps…*   | IST (2022)              | SLR             | DevSecOps adoption, security  | genel          | 54 çalışma SLR, araç/pratik/insan zorlukları tematik analizi            | DevSecOps araç tarafı zorlukları ön planda; shift-left ve sürekli test önerisi.  | Güvenlik kapıları spesifik değil; sunucusuz analiz yok.                  | Orta          | Yok            | Yok         | Yok         | DOI:10.1016/j.infsof.2021.106700 | Evet      |
| 4  | Marin et al. (2022)    | *Serverless computing: a security perspective*         | J. Cloud Comput. (2022) | Derleme           | Serverless security         | genel          | Mimariler analiz; güvenlik zayıflıkları analiz edildi.          | Serverless’in idiosinkratik özellikleri ve güvenlik eksiklikleri incelendi. Event tabanlı tetiklemeler saldırı yüzeyini genişlettiği vurgulandı.  | Ampirik veri yok; teorik perspektif.                                     | Orta (genel öneriler) | Düşük         | Düşük       | Düşük       | DOI:10.1186/s13677-022-00347-w   | Evet      |
| 5  | Wen et al. (2023)      | *Rise of the planet of serverless computing…*          | ACM TOSEM (2023)       | SLR             | Serverless literature review | genel          | 164 makale derlemesi (2022’ye kadar)           | Sunucusuz araştırmalar çoğunlukla performans odaklı. **Sadece %3.05**’i güvenlik konulu.  | Detaylı saldırı analizi yok; güvenlik çalışmaları seyrek.                  | Düşük         | Yok            | Yok         | Yok         | arXiv:2206.12275                | Evet      |
| 6  | (DevSecOps araç karşılaştırmaları) | *…* | *…* | *Benchmark* | *SAST tools evaluation* | *various* | *Çeşitli çalışmalardan bulgular* | *Genelde kod analiz araçlarının tespit oranları düşük bulunmuştur*. | *…* | Düşük | … | … | … |  |  |
| …  | …                      | …                                                     | …                    | …               | …                             | …             | …                                                            | …                                                               | …                                                | …             | …             | …           | …           | …                            | …        |

Tabloda her çalışmanın “Relevance to RQx” sütunlarında, hangi araştırma sorularına katkısı olduğuna (ör. RQ1 için tespit oranları, RQ2 için kaynak karşılaştırması) kısaca işaret edilmiştir. Örneğin Brito (2023) genel olarak RQ1’e direkt katkı verirken (SAST etkinliği), RQ2’ye dair bir karşılaştırma içermez.

_Not:_ Bu tablo örnek niteliktedir; gerçekte seçilecek çalışmaların verileri tablo formatında ayrıntılı doldurulmalıdır.

## 12. Öncelikli Okunması Gereken Çalışmalar

Yaklaşık 10–15 önemli çalışma seçildiğinde bunlar çeşitli roller için sınıflandırılır. Örnek (her biri 2–4 cümle):

- **Brito et al. (2023)** – *Node.js SAST incelemesi* (IEEE T-Reliability). 957 gerçek Node.js zafiyetinden oluşan büyük bir veri kümesi kullanarak 9 aracı karşılaştırmıştır. Sonuç: Araçların çoğu kritik açığı kaçırıyor; en iyi üç araç %57.6 algılama oranına sahip . **Neden önemli:** Bu çalışma, dinamik dili kullanan sunucu uygulamalarında SAST araçlarının ciddi tespit boşlukları olduğunu gösterir. **Boşluk:** Yalnızca Node.js koduna bakılmış; olay kaynakları veya edge platformları özelinde bir inceleme yok.
- **Marin et al. (2022)** – *Serverless security perspective*. Sunucusuz mimarilerin güvenlik açılarının genel bir incelemesini sunar. Fonksiyonların pek çok olay kaynağıyla tetiklenebileceğini ve bu nedenle saldırı yüzeyinin genişlediğini vurgular. **Neden:** Olay kaynaklarının önemine dikkat çeker. **Boşluk:** Ampirik analiz yok; detayı SAST bağlamında değerlendirmedi.
- **Wen et al. (2023)** – *Sunucusuz üzerine sistematik inceleme*. 164 çalışmayı ele alır ve sadece %3.05’inin güvenlikle ilgili olduğunu belirler. **Neden:** Sunucusuz güvenlik araştırmalarının azlığına işaret eder, dolayısıyla odaklanmamız gereken alanları gösterir. **Boşluk:** Zafiyet tespiti yerine genel trendlere bakar.
- **Rajapakse et al. (2022)** – *DevSecOps benimseme SLR’i*. 54 makaleyi inceleyerek DevSecOps zorlukları ve çözümlerini sınıflandırır. **Neden:** DevSecOps bağlamında otomasyon ihtiyacını vurgular, “shift-left güvenlik” gerekliliğini belirtir. **Boşluk:** Spesifik olarak sunucusuz veya SAST kapıları üzerinde bir inceleme sunmaz.
- **Barrak et al. (2025)** – *FaaSGuard: Sunucusuz CI/CD*. OpenFaaS üzerinde bir pipeline uygular; injection, secret ve bağımlılık tehditlerini test eder. **Neden:** CI/CD aşamalarında güvenliği sahada test eden nadir bir çalışmadır ve olay enjeksiyon tehlikesini ön plana alır. **Boşluk:** Sadece OpenFaaS (gelişmiş bir FaaS) kullandı; diğer platformlar (AWS Lambda, Cloudflare Workers) ile genellemesi sınırlı.
- **OWASP Serverless Top 10 (2018/2020)** – *Sunucusuz Güvenlik Sınıflandırması*. OWASP’ın sunucusuz için yorumlanmış Top 10 listesi, injection’dan aşırı izinlere kadar riskleri sıralar (gri literatür). **Neden:** Konu uzmanlığı ile olay kaynaklarının önemini vurgular. **Boşluk:** Resmi bir araştırma değil, mühendis yönlendirmesi; SAST araç analizini içermez.
- **Diğer SAST Karşılaştırmaları (gri/tez)** – Örneğin GitHub blog veya bağımsız kıyaslamalar (Semgrep vs CodeQL performans testleri gibi). **Neden:** Araçların pratikte nasıl davrandığına dair *görece* güncel veri sağlar. **Boşluk:** Genelde yayınlanmış akademik olmayan kaynaklar olduğundan titizlik sınırlı.

Yukarıdaki çalışmalar temel okumalar olacaktır. Her biri, araştırma probleminin farklı boyutlarına ışık tutar; fakat ortak olarak *olay temelli veri akışını* açıkça ele almadıkları görülür. Dolayısıyla her birinin bıraktığı boşluk, yeni çalışma sorularını haklı çıkarır.

## 13. Temel Boşluk Analizi

> **Araştırma Sorusu:** *Aynı sunucusuz zafiyet, girdi HTTP isteğiyle mi yoksa başka bir olay kaynağıyla mı beslendiğinde farklı tespit oranlarına sahip mi?*

Literatürde bu soruyu doğrudan ele alan **herhangi bir çalışma** bulunamamıştır. Örneğin, Brito et al. (2023) tüm Node.js zafiyetlerini tek bir corpus’ta toplarken, her zafiyetin giriş kaynağı olarak genellikle HTTP isteklerini dikkate almıştır (çünkü Node.js örnek uygulamalarında tipik kullanım budur). Bu nedenle Brito’nun sonuçları, RQ2 için ancak “dolaylı” bilgi sağlar; o da genel olarak araçların düşük algılama oranına işaret eder. Marin (2022) ve OWASP Serverless Top10 gibi derlemeler, olay tetiklemeli senaryoların potansiyel riskini belirtir, fakat bunlar ampirik ölçümler değil, kavramsal rehberlerdir. Barrak (2025) injection tehditlerini ele alırken *çeşitli tetikleyiciler* arasında bilgi akışına değinir, ancak olay-HTTP karşılaştırması yapmaz.

Bu nedenle: **Literatürde bu konu açıkça çalışılmamıştır.** Öyle ki, yapılan aramalarda “HTTP event taint analysis” gibi ifadelerle ilgili akademik sonuç elde edilememiştir. Dolayısıyla bu sorunun cevabı “literatürde doğrudan kanıt bulunmamaktadır” şeklindedir. Yalnızca şunu söyleyebiliriz: Mevcut kanıtlar, SAST araçlarının genel olarak eksik kaldığına işaret etmektedir; eğer olay kaynaklı akışlar gerçekten göz ardı ediliyorsa, bu eksiklik RQ2’de tahmin ettiğimiz gibi daha da belirgin olabilir. Ancak bu ampirik olarak test edilmemiş bir varsayımdır.

## 14. Boşluk Karşılaştırma

Aşağıdaki tabloda, araştırma konusuna en yakın mevcut çalışmaları ve onların bu çalışmayla kıyaslanan eksik yanlarını görüyoruz:

| Mevcut Çalışma                  | İnceledikleri                                           | İncelemedikleri                                            | Önerilen Çalışmadan Farkı                        |
| ------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------ |
| Brito et al. (2023)             | Node.js SAST araçlarının genel etkinliği (OWASP-10).      | HTTP-dışı olay tetikleyicili senaryolar.                   | Olay kaynaklarının etkisi üzerinde durmaz; sadece kodun bilinen zafiyetlerini tarar.                                     |
| Barrak et al. (2025)            | Sunucusuz CI/CD pipeline’da OpenFaaS güvenliği, injection. | Cloudflare/Edge platformları, olay vs HTTP karşılaştırması. | Cloudflare yerine OpenFaaS; olay enjeksiyonu vurgulasa da karşılaştırma ölçülü değil.                                        |
| Rajapakse et al. (2022)         | DevSecOps benimseme, araç-kültür problemleri.            | Belirli güvenlik kapılarının etkinliği veya sunucusuz konular. | Genel DevSecOps (insan/pratik) odaklı, teknik SAST karşılaştırması yok.                                                   |
| Marin et al. (2022)             | Sunucusuz mimari güvenlik analizi (genel perspective).    | Ampirik SAST deneyleri veya tespit oranları.                | Teorik inceleme; açıkları tartışır, ancak veri akışı kontrolü konusunu incelemez.                                          |
| Wen et al. (2023)              | Sunucusuz ekosistem literatürü genel eğilimleri.         | Güvenlik sorunlarına az odaklanmış (yalnız %3).            | Güvenliği kapsam olarak çok geniş ele alır, olay tabanlı tespit spesifik değil.                                          |
| OWASP Serverless Top10 (2018)   | Sunucusuz uygulamalarda en yaygın 10 zafiyet.             | Araç performansı; istatiksel analiz.                        | Zafiyet sınıflaması; SAST araç incelemesi içermez.                                                                      |
| (Varsa diğer SAST benchmarkları)| Örneğin OWASP benchmark, Juliet (genel).                  | Sunucusuz/olay özel zafiyetler.                            | Sunucu-olay bağlamı dahil değildir; genel kod zafiyetleri üzerinden test.                                                |

Bu karşılaştırma, elimizdeki tüm benzer çalışmaların **HTTP vs olay kaynağı** kıyasını içermediğini gösteriyor. Ayrıca çoğu çalışma **sunucusuz edge platformlarına** özgü değildir. Önerilen çalışma, bu farkı gidermeyi hedeflediği için alandaki boşluğu dolduracaktır.

## 15. Üç Temel Araştırma Boşluğu

Aşağıda belirlenen üç asıl boşluk ve bunları doldurmaya yönelik öneriler özetlenmiştir:

1. **Olay Kaynaklı Veri Akışı Modelleme Eksikliği:** Mevcut SAST araçları çoğunlukla HTTP isteklerini esas alır; kuyruk mesajı, zamanlayıcı veya dosya olayı gibi tetikleyicileri güvenilmez giriş olarak modellemezler. *Bilirliğimiz:* Güvenlik literatürü olay kaynaklarının riskini belirtse de, araç kapasitesi test edilmemiş. *Bilinmeyen:* SAST araçlarının olay kaynaklarından gelen veriyi “taint” olarak takip edip edemediği. *Çözüm:* İkiz zafiyet fügü (HTTP vs olay) içeren bir benchmark oluşturup araçlarla test etmek. *Katkı:* Sunucusuz güvenlik analizinde yeni bir test metodu ve bulgular sağlayacak. *Geçerlilik Tehditleri:* Gerçekçilik (sentetik senaryolar), araç konfigürasyonlarındaki farklar.

2. **Platforma Özgü Kural Kapasitesi:** Cloudflare Worker, AWS Lambda vb. gibi platformlarda fonksiyonlara özgü bağlama ve yapılar bulunur (örn. R2, KV, Queue binding’leri). *Bilirliğimiz:* IaC/konfigürasyon tarayıcılarının bazı platform desteği vardır (Checkov - Azure vs AWS), ancak Cloudflare için özel çok azdır. *Bilinmeyen:* Bu bağlamların SAST/SCA kuralları tarafından tanınıp tanınmadığı. *Çözüm:* Cloudflare örnek zafiyetli kodlar yazıp araçların yakalamasını deneyerek (örn. R2 erişimi üzerinden veri boşaltma). *Katkı:* Edge platformlarında güvenlik tarayıcı kapsamını gösterecek. *Tehditler:* Platform değişikliği yükü, kod/dokümantasyon güncelliği.

3. **CI/CD Tarayıcı Performansı Bilgi Açığı:** Güvenlik tarayıcılarının pipeline’a etkisi literatürde nadiren ele alınmış. *Bilirliğimiz:* Genel endüstri uyarıları var ama ampirik veri yok. *Bilinmeyen:* Birden çok SAST/SCA çalıştırıldığında gecikme nasıl artar? *Çözüm:* Ölçüm çalışması; GitHub Actions’da örnek projeye tarayıcıları sırayla veya paralel koyarak süre, CPU, bellek ölçümü. *Katkı:* DevSecOps uygulamalarında pratik bir yol gösterici olacak. *Tehditler:* Ölçümler CI ortamına özel olabilir; sonuçlar hızla değişen bulut hizmetlerine bağlı.

Bu açıkların her biri, sunucusuz edge uygulamalarında güvenlik testlerinin etkinliğini ve sınırlamalarını ortaya koymada anahtar önemdedir.

## 16. Literatürde Doygun ve Az Çalışılmış Alanlar

- **Doygun Alanlar:**  
  - *Genel DevSecOps Adaptasyonu:* Birçok çalışma DevOps’tan DevSecOps’a geçiş zorluklarını inceler (örneğin Rajapakse et al.).  
  - *Genel SAST Araç Kıyaslamaları:* Özellikle Java/C/C++ için SAST araç testi ve benchmarklar bulunmaktadır (NIST SARD, Juliet, OWASP Benchmark vb.). JavaScript/Node ortamı için başlangıç Brito ile yapılmıştır, ama hala daha fazlası gerekebilir.  
  - *Sunucusuz Tehdit Sınıfları:* OWASP gibi endüstri inisiyatifleri “Sunucusuz Top 10” gibi kategoriler sunmuştur; yüksek seviye literatürde güvenlik tehditleri sınıflandırılmıştır (Marin 2022 gibi derleme, OWASP).  
  - *CI/CD Güvenlik Kontrolleri:* Boru hattı güvenliği için öneriler (örn. action pinning, OIDC) literatürde (CISA kılavuzları, SLSA belgeleri) mevcuttur, ancak akademik kanıt azdır.

- **Orta Düzeyde Çalışılmış Alanlar:**  
  - *Sunucusuz Zafiyet Tespiti:* AWS Lambda, Azure Functions vb. özelinde bazı örnek saldırı analizleri bulunabilir (örn. Lambda’da SSRF vs event injection). Ancak bunlar genelde tek tek vurgular; kapsamlı analiz az.  
  - *JavaScript SAST İncelemesi:* Node.js özelinde Brito (2023) önemli; ancak TypeScript ve front-end sunucu çerçeveleri az ele alınmış.  
  - *IaC/Config Güvenliği:* Terraform, CloudFormation vb. için Checkov, tfsec vb. araçlar araştırılmıştır; fakat bunların sunucusuz edge kaynaklarıyla uyumu (ör. Cloudflare özel resource’ları) çok da incelenmemiştir.

- **Az Çalışılmış / Beyaz Alanlar:**  
  - *Olay Kaynaklı SAST:* Yukarıda belirtildiği gibi, HTTP dışı olayları taint kaynağı olarak ele alan statik analiz çalışması yok denecek kadar az. Tamamen “beyaz alan”.  
  - *Edge-Özgü SAST:* Cloudflare Workers, Vercel Edge, Netlify Edge gibi platformlara özgü kod analiz araçları veya kuralları çok az veya hiç çalışılmamıştır.  
  - *HTTP/Olay İkiz Zafiyet Benchmark’ı:* Paired vulnerability (HTTP vs event trigger versiyonu) veri seti ve deneysel çalışmalar literatürde görülmemiştir.  
  - *Özel Kural Etkinlik Karşılaştırması:* Default SAST araç vs “olay haberdar” özel kural seti karşılaştıran araştırma yok; CodeQL/Semgrep özel rule yazımı üzerine örnek çalışmalar bile sınırlı.  
  - *Pre-prod/Önizleme Ortamı Güvenliği:* Önizleme dağıtım güvenliği (kısa ömürlü ortamlar için erişim politikaları) literatürde yenidir. Deneysel çalışma bulamadık.  
  - *CI/CD Olay Kaynaklı Dağıtım Risk Analizi:* “Pull request” ile yapılan sunucu yüklemelerde yetki sızıntıları, aşırı izinler gibi literatürde spesifik olarak işlenmemiş. 

Bu alanlar, çalışmanın odak noktalarıdır ve literatürde belirgin şekilde açık (söylemler olmasına rağmen test edilmemiş) veya tamamen boş gözükmektedir.

## 17. Deney Tasarım Önerileri

Planlanan deneysel test düzeneği şu unsurları içerir:

- **Test Yatağı:** Ana platform olarak Cloudflare Workers kullanılması mantıklıdır çünkü “sunucusuz edge” teması belirgin. Hono+TypeScript ekosistemi de güncel JS/TS kullanımı açısından uygun. Bu kombinasyon akademik açıdan yeterince yenilikçi ve gerçekçi; Cloudflare dokümantasyonu güçlü ve geniş kullanıcı kitlesi var. Ancak bu ortam *fazla platform-spesifik* risk taşır: AWS Lambda gibi sektör standardı başka platformda sonuçlar farklı olabilir. Bu nedenle AWS Lambda (örn. OWASP DVSA) ikincil test ortamı olarak değerlendirilebilir: Eğer benzer sonuçlar çıkarsa çalışmanın genel geçerliliği artar. Eğer çok farklıysa bulgular daha spesifik yorumlanmalıdır.

- **Tekrarlanabilirlik:** GitHub Actions CI gereçler kullanılacağı için açık kaynaklı iş akışları ve kod repoları herkesin kullanabileceği biçimde oluşturulmalıdır. Örneğin GitHub repo ve Actions workflow dosyaları, kullanan SAST araçları (CodeQL CLI, Semgrep sürüm vb.), Cloudflare CLI (Wrangler) sürümleri açıkça belirtilmeli, mümkünse Docker container kullanımı ile çevre sabitlenmelidir.

- **Platform ve Aracın Çeşitlendirilmesi:** Özellikle RQ1–3 için CodeQL ve Semgrep gibi birden fazla SAST aracının test edilmesi, bulguların araç-bazlı mı genel mi olduğunun anlaşılması için önemlidir. Gitleaks (secret scanning) ve Trivy (bağımlılık tarama) gibi SCA/secret araçları da sürece eklenebilir. IaC için Checkov, tfsec; Cloudflare config için belki özelleştirilmiş Poliçya-as-Code (opa) kullanılabilir. 

- **OWASP DVSA Kullanımı:** AWS Lambda ortamında çalışan OWASP DVSA gibi bir zafiyet uygulaması, sunucusuz test case olarak işe yarayabilir. Eğer temel eksik tespitler Cloudflare Workers’ta gözlenirse, bunların AWS Lambda’da da olup olmadığı araştırılmalı. AWS Lambda’nın güvenlik modelinin farklı olduğunu varsayarak sonuçları ayırmalı: AWS’de zafiyet varsa bu “sunucusuz geneli”, sadece Cloudflare’dayla sınırı varsa “edge özgü” çıkarımı yapılır.

## 18. Deneysel Değişkenler

- **Bağımsız Değişkenler:**  
  - *Vulnerability Type:* (SQLi, OS command inj., SSRF, vs.) – farklı zafiyet sınıfları.  
  - *Input Source Type:* HTTP isteği vs queue mesajı vs cron tetiklemesi vs R2/KV eventi vb. (örn. RQ2)  
  - *Araç/Aracın Konfigürasyonu:* CodeQL default, Semgrep default, vs özel kural eklenmiş.  
  - *Platform:* Cloudflare Workers vs AWS Lambda (ikincil).  
  - *Uygulama Karmaşıklığı:* Basit fonksiyon vs daha karmaşık modüller. (Ancak bodur iç tasarımda tutarlılık sağlanmalı.)  
  - *Event Type:* Farklı olay türleri (HTTP, S3 event, queue).  
- **Bağımlı Değişkenler:**  
  - *Tespit Oranı:* Yakalanan zafiyet sayısı / toplam gerçek zafiyet sayısı (her araç için, her kaynak türü için).  
  - *Recall/Precision:* Her araç bazında. False positive sayısı.  
  - *F1 vs False Negative Rate:* (Özellikle false-negative – kaçırılan)  
  - *Pipeline Süresi:* Tüm boru hattı süresi, SAST tarama süresi.  
  - *CPU/Memory:* Tarayıcıların tükettiği kaynak.  
  - *Bekleme (Queue) Süreleri:* Örneğin koddaki change başına tarayıcı gecikmesi.  
  - *İşlem Başına Ortalama:* (incremental vs full tarama süreleri).  
- **Kontrol Değişkenleri:**  
  - *Kod tabanı:* Zafiyet sink (örn. `eval()` veya `exec()`) sabit tutulur, sadece kaynak (HTTP vs olay) değiştirilir.  
  - *Aracın Versiyonu/Kuralları:* Default ayarlar kontrol altına alınmalı; hangi eklenti sürüm veya kural seti, testin tutarlılığı için sabit.  
  - *Bağımlılık Sürümü:* NPM paket sürümleri, TypeScript derleyici sabit.  
  - *CI Runner Tipi:* aynı GitHub runner konfigürasyonu.  
  - *Çoklu Çalıştırma:* Farklı koşullarda tekrar sayısı aynı tutulmalı (kuvvet testi).  
  - *Pipeline Yapısı:* Tüm adımlar (test, SAST, SCA vs) sınırlar içinde tutularak sadece güvenlik adımı ölçülsün.

## 19. “İkiz Zafiyet” Yöntemi

Plan, **her zafiyetin iki versiyonunu** karşılaştırmaktır: biri **HTTP kaynaklı**, diğeri **olay kaynaklı**. Örneğin:

- **HTTP Versiyon:** Fonksiyona gelen `request.body` içinden girdi alınıp (örneğin bir query parametresi) veri tabanında doğrudan kullanılmakta (örn. SQL enjeksiyonu sink’i). 
- **Olay Versiyon:** Aynı kod, fakat girdi `queueEvent.message` ya da `event.body` (cron payload) gibi farklı bir kaynaktan alınır ve aynı SQL injection senaryosu gerçekleşir.

Bu *ikiz* çift, **tek bir vuln kategorisi** için normalleştirilmiş bir test imkanı sunar. Dikkat edilmesi gerekenler:
- Zafiyet **aynı semantik** olmalı: Yani arka plandaki vuln (ör. veritabanına doğrudan kullanıcı girdi göndermek) aynıdır.
- **Sadece giriş noktası** değişiyor. Uygulama mantığı, çağrı satırı vs. mümkün olduğunca ortak. Örneğin, Hono bağlamında `ctx.request.body` yerine `ctx.event.body` gibi kural değiştirilebilir. (Hono app içinde HTTP `ctx` ve Queue `ctx` farklı olabilir, buna dikkat edilmeli.)
- **Sink aynı:** Aynı hassas fonksiyon (örn. `fs.write`, `db.query`, `eval`) kullanılmalı.
- **Karmaşıklık sabit:** HTTP çiftinde sorgu parametresi basitken, olayda karışık JSON parsing’i olmamalı. Aynı kontrollü parse yapısı olmalı.
- **Kontroller:** Koddaki kod dal yolları mümkün olduğunca aynı olmalı; eğer örneğin cron tetiklemesi için bir doğrulama ekleniyorsa, onu HTTP’de de eşdeğer sağlamalıyız.
- **İçsel Geçerlilik Tehditleri:** Kodun işlem akışı iki durumda da aynı olmaması, birinde ek hata kontrolü konması vs. karışıklık yaratabilir. Tetikleyici farkı dışında başka farklılık eklememek önemlidir. Jenkins gibi pipeline değişikliği yoksa (HTTP ve olay için ayrı adımlar demek, yarattığı) pipeline’ın kendisini kontrolü altına almalıyız.

Bu yöntem, HTTP vs olay kontekstinin sadece kaynaktan kaynaklanan farkını izole eder. Eğer sonuçlar anlamlı bir fark gösterirse (örn. HTTP versiyonu %X algılandı, olaylı versiyon %Y), bu RQ2 için güçlü bir kanıt oluşturur.

## 20. Yer Gerçeği Korpusu

Olası kaynaklar:

- **OWASP DVSA (Damn Vulnerable Serverless App):** AWS üzerinde çalışan, çeşitli sunucusuz zafiyetleri içeren test uygulamaları. Gerçekçi bir kod seti sağlar. HTTP ve S3/DB olayları içerebilir. Ancak spesifik AWS Lambda örneği; Cloudflare farklı.
- **OWASP Benchmark / Juliet:** Genel kod örnekleri (çoğunlukla Java/C); Node.js versiyonları bazı varyantlar içerir. Yarı-sentetik de sayılır.
- **Gerçek CVE’ler:** AWS Lambda veya Google Cloud Functions’taki bildirilmiş açıklar koleksiyonu. Bulmak zor ve varyant test etmek zaman alıcı. Ancak özgünlük sağlar.
- **Sentetik Zafiyet Ekleme (Seeded Vulnerabilities):** El ile hazırlanmış küçük fonksiyonlar. Avantaj: tam kontrol (zafiyet varlığı kesin), tutarlılık sağlar. Dezavantaj: gerçekçilik.
- **Mutasyon Tabanlı Nesiller:** Örneğin SAST araçlarının kaçırdığı kodlara rastgele payload ekleme. Zaman alıcı ve doğrulama güç olabilir.

Öneri: Mevcut çerçevede **karma bir yaklaşım** kullanılmalı. Örneğin, OWASP DVSA (AWS Lambda) belki ikinci doğrulama için; ana test için ise *elle yazılmış ikiz örnekler* (HTTP vs kuyruk/webhook) içeren küçük projeler kurulabilir. Bu projelerde sink aynı tutulur. Julient tarzı hazır örneklerden Node/TS adaptasyonları da eklenebilir. Kritk: Her zafiyete HTTP ve olay versiyonları olmalı (paired olarak hazırlanmalı). Sentetik çalışmalar akademik değersiz sayılmaz; Brito ve benzerleri de semantik eşdeğer gerçek veriyi toplamakta. Ancak, çalışmanın kabulü için sentetik senaryoların *gerçekçi* olduğunun gösterilmesi gerekebilir (ör. gerçek dünyada bir olay payload yapısı model alınması gibi). CVE’lerden örnek eklemek, doğruluğu arttırır ancak sayıca sınırlı olabilir.

## 21. İstatistiksel Analiz

### RQ1 (Araçlara Göre Tespit Oranı)
- **Veri:** Her aracın her zafiyeti bulup bulmadığı (binary). Birden fazla araç olduğundan **Cochran’s Q testi** kullanılabilir (birden çok eşleşmiş test sonucu karşılaştırma). Eğer sadece 2 araç karşılaştırılıyorsa *McNemar’s testi* ile eşleşmiş ikili oran farklılıklarına bakılabilir. Ayrıca *etki büyüklüğü (odds ratio)* hesaplanabilir.
- **Alternatif:** Her araç için *precision/recall* ölçümlerinden bağıl performans kararı. F1 veya AUC pek kullanılmaz, çünkü ground truth biliniyor. İlgili: *Yüzde başarı* ve *sapma* hesaplanır.
- **Not:** Birden fazla araç olduğunda çoklu karşılaştırma düzeltmesi (Bonferroni vb.) gerekebilir.

### RQ2 (HTTP vs Olay)
- **Veri:** Eşleşmiş “ikiz” örnekler üzerinde iki ayrı koşul (HTTP/olay). Her durumda Tespit (evet/hayır). Bu ikili eşleşmede *McNemar’s testi* uygundur (örn. HTTP tespit edip olay tespit edemedi vs tam tersi sayısını karşılaştırır). Eğer birden fazla türde zafiyet veya birden çok araç varsa, *Cochran’s Q* da kullanılabilir.
- **Ayrıca:** Farkın büyüklüğünü belirlemek için *odds ratio* veya *yüzde değişim* rapor edilebilir. 
- **Güven Aralığı:** Eşleşmiş farkının %95 GA hesaplanabilir (ör: Wilson CI, if McNemar’s).
- **Not:** Stat. test sonuçları, null hipotezi (“her iki koşulda tespit oranı aynı”) ile test edilir.

### RQ3 (Varsayılan vs Özel Kurallar)
- **Veri:** İki durum (default vs custom rule) için araç tespit oranları. Birçok zafiyet için her iki durumda (ikiz olmayan) test. Yine *Cochran’s Q* çoklu araçlı benzer bir rol oynayabilir, ancak ikili bir karşılaştırma ise McNemar uygundur.
- **Etki Boyutu:** Yüzde puan farkı veya risk oranı verilebilir (custom rule eklenince kaç zafiyet daha tespit edildi).
- **GA:** Farkın belirsizliği (CI) eklenmeli.

### RQ4 (Pipeline Süresi)
- **Veri:** Her pipeline çalışmasında ölçülen süre, kaynak kullanımı. Bu sürekli (interval) veri olduğu için parametre uygulanabilir (veri normal değilse *Wilcoxon signed-rank* testi tercih edilebilir). 
- **Karşılaştırma:** Tools arasında, ya da ilekisiz (ör. default vs rule) ikili karşılaştırma için Mann–Whitney U kullanılabilir. Birden fazla senaryo varsa ANOVA (parametrik); yoksa Friedman testi (non-parametrik tekrarlı ölçümler). 
- **Etki:** Ortalama süre farkı, bellek farkı rapor edilir. GPU/CPU vs kullanımı normalize edilebilir.
- **Dikkat:** Ölçümler zaman damgası olarak toplanmalı, medyan hesaplanarak öne çıkan sapmalar azaltılabilir.

Her durumda **yanlış pozitif/negatif** oranı, *precision/recall* gibi ölçütler matematiksel olarak tanımlanmalı ve yorumlanmalıdır. McNemar veya Cochran testleri, sadece “buldu/bulamadı” ikili sonuçlara dayanır; bu RQ1-3 için uygundur. 

## 22. Metrik Tanımları

- **TP (True Positive):** Araç tarafından bulunan ve gerçekten var olan zafiyet.  
- **FP (False Positive):** Araç tarafından işaretlenen ancak gerçek olmayan zafiyet.  
- **TN:** Araç tarafından “tehdit yok” denilen ve gerçekten tehdit olmayan.  
- **FN:** (Yanlış negatif) Araç “güvenli” diyip aslında zafiyet olan durum.  
- **Precision = TP / (TP + FP):** Doğru bulunan oranı.  
- **Recall (Sensitivity) = TP / (TP + FN):** Var olanları bulma oranı.  
- **F1 Skor = 2·(Precision·Recall)/(Precision+Recall).** Dengelenmiş ölçüt.  
- **False Positive Rate (FPR) = FP / (FP + TN).** Toplam gerçek olmayanlar içindeki hatalı alarm oranı.  
- **False Negative Rate (FNR) = FN / (FN + TP).** Toplam gerçek varlıklar içindeki kaçırma oranı.  
- **Detection Rate:** Çoğu çalışmada **recall** ile eşdeğerdir (TP/(TP+FN)).  
- **Coverage:** Araç tarafından analiz edilen kodun yüzdesi (parça analizi değilse genelde %100 kabul edilir).  
- **Pipeline Overhead:** Ek taramanın sebep olduğu ek süre (saniye cinsinden) veya işlevsel gecikme (%) olarak.  
- **Relative Latency Increase:** Mevcut pipeline süresine göre scanning ile geçen ek süre (örneğin “%10 daha yavaş”).  
- *Not:* “FPRR” (False Positive Rate Reduction) gibi terimler standart değildir; belki “yanlış-pozitif azaltımı” gibi ifade daha net olur. Standart metriklerle (Precision/FPR) ifade etmek genellikle yeterlidir.

## 23. DevSecOps Pipeline Modeli

Örneğin şu tip bir pipeline önerilebilir:
```
Repo → Pull Request → Birim Testler → SAST → SCA → Secret Scanning → IaC/Policy-as-Code → (Özelleştirilmiş Serverless Kuralları) → Build → Preview Dağıtımı → API/Şema Kontrolleri → Prod.
```
- **Güvenlik sınırları:** Her aşama bir güvenlik geçidi (gate). Kaynak kod → SAST (kod güvenliği), SCA (bağımlılık güvenliği), Gitleaks (gizli anahtar), IaC taraması (bulut yapılandırma), özel serverless kuralları (ör. Cloudflare event güvenliği) vb.  
- **Güven sınırları:** Deployment kimlik bilgileri (Cloudflare API token, OIDC belgesi) gibi hassas bileşenler korunmalıdır.  
- **Saldırı yüzeyleri:** GHA runner’ları, üçüncü parti Actions, kod deposu (pull request injection) gibi unsurlar. Kaynak kod dışı yollarla (örn. Dependency confusion) tedarik zinciri tehdidi.  
- **Kimlik akışı:** GITHUB_TOKEN veya OIDC üzerinden deploy token’ları akışı. En düşük ayrıcalık (least privilege) politikaları önemli.  
- **Boru hattının yeri:** Önerilen araştırma, yukarıdaki modelin “SAST ve özel serverless kuralları” ile “performans ve algılama oranı” boyutlarını ölçmeyi amaçlar. Yani *kod inceleme adımlarına* ve *pipeline süresine* odaklanır. Önizleme (Preview Deployment) güvenliği daha çok takviye koruma olarak (örnek: test API schema vs güvenlik testleri) düşünülmeli, SAST çalışmalarının doğrudan parçası olarak değil.

Bu modelde, araştırma katkısı **“SAST aşamasında olay kaynaklarının güvenilmez girdi olarak modellendiği tespit boşlukları”** üzerinde toplanacak ve CI/CD performans ölçümleri yapılacaktır.

## 24. CI/CD Güvenlik Analizi

CI/CD güvenliği, çalışmanın kapsamını aşabilir. Ancak şunlar not edilmelidir:
- **OIDC/Workload Identity:** Modern GitHub Actions deploy senaryolarında tavsiye edilen yöntemdir; bunun kullanımının sunucusuz deploy risklerini nasıl azalttığını araştırmak yan katkıdır.  
- **Pull Request İşletimi:** Untrusted PR’lara karşı `pull_request_target` riskleri, malicious Action usage vb. literatürde incelenmiştir (genel CI güvenlik konuları). Bu çalışmada, ana katkı değil destekleyici olarak değerlendirilir.  
- **Secret Yönetimi:** Repo’da açık anahtar olmaması, Gitleaks ile taranması; ortam değişkenlerinin scope’u ele alınmalıdır. Araştırma kapsamında temel olarak SAST etkililiği ve pipeline süresi odaklıyız, bu konular yan mekanizma sayılabilir.  
- **Temin Zinciri (Supply Chain):** SCA araçları eklendiğinde, bunların tespit kabiliyeti SAST’le kıyaslanabilir. Bu kısmen RQ1 bağlamında destekleyici olabilir (örn. OSV-Scanner veya Trivy ile Node modüllerindeki zafiyetler). Ancak SCA çalışmasının ana konusu olamaz.  
- **Özet:** CI/CD’daki OIDC, üçüncü taraf Action incelemesi, runner izolasyonu vb. literatürde yer alır ancak bu çalışmada **destekleyici arka plan** kabul edilir. Ana odak **kod tarama ve olay kaynaklı güvenlik** olduğu için, CI/CD’nın kimlik veya ağ modeli gibi unsurları kapsam dışı kalabilir. Ancak deney tasarımında makul bir pipeline güvenlik yapısı kullanılmalıdır.

## 25. Platforma Özgü Analiz: Cloudflare Workers

Cloudflare Workers’a dair akademik araştırma azdır, ancak:
- **Resmi Belgeler (gri kaynak):** Cloudflare’ın dev dokümantasyonu V8 izolasyonu ve güvenlik modelini açıklar. Worker’lar tekil JavaScript context’lerinde çalışır ve WAF benzeri bir koruma taşır. 
- **Araştırma/Blog:** Örneğin Cloudflare blogunda "Safe in the sandbox" başlıklı bir makale (2025) yayımlanmıştır (teknik güvenlik pratikleri). Bu, akademik olmasa da son teknoloji iddialarını gösterir. 
- **Araştırma Buluntuları:** Literatürde Cloudflare’a özel saldırılar (örn. KV hack, R2 SSRF) vaka çalışması az. Wei ve ark. 2024 “Memory Isolation” gibi çalışmalar varsa da Workers özelinde bilinmemektedir. 
- **Belirlenebilecekler:** Cloudflare Workers port’larında özellikler: 
  - *Durable Object state, KV, R2,* vb. Bu kaynakların güvenlik modeli belgenmiştir (örn. R2 URL’sinin CORS/özgü izinleri). Ancak SAST için bu binding’leri yazılım mantığına entegre modelleme literatürü yok. 
  - *API tokens:* Geniş yetkili yerine scoped token’lar önerilir (Cloudflare API tokens). Bu konu SAST değil, CI/CD kimlik yönetimi içinde ele alınır.
- **Seviye:** Cloudflare Workers için doğrulanmış akademik kaynak yok; bu nedenle Cloudflare’a özgü güvenlik bulguları ağırlıklı olarak **resmi belgeler** veya teknik raporlarla sağlanacaktır. Örneğin Cloudflare Docs (2026) V8 güvenlik modelini anlatır. Bunlar doğrulanmış kabul edilmeli (bir nevi endüstri standart doküman).

Özet: Cloudflare özel güvenlik ihtiyaçları büyük ölçüde dokümantasyonda açıklanmıştır, ancak akademik çalışmalar bu iddiaları test etmemiştir. Bizim için, Cloudflare’a özgü kod çözümleri ve güvenlik yapılandırmaları (wrangler, binding dosyaları) *arka plan bilgisi* olacaktır; literatürde somut kanıt aranamayabilir. Bunun yerine, yaptığımız deneysel çalışma kendi bulgularıyla bu boşluğu dolduracaktır.

## 26. Yeniden Üretilebilirlik

Çalışmanın tekrarlanabilirliği için şu önlemler önerilir:
- **Kod Deposu:** Deney senaryosu ve zafiyet örnek kodları açık kaynak repo’da paylaşılmalı (örn. GitHub, DOI’li Zenodo gibi). Repository, düzenli klasör yapısında tanımlanmış vulnerability örnekleri (HTTP ve olay kopyaları), test script’leri, CI workflow dosyaları içermeli.
- **Aracı Ortam:** Docker image’ları veya GitHub Actions gibi container ortamları kullanılabilir. Araç versiyonları (CodeQL CLI x.y, Semgrep vX, vs.), kural konfigürasyon dosyaları versiyon kontrolünde.
- **Ayarlar:** wrangler.toml gibi deployment dosyaları, IAM rol konfigürasyonları, OPA politikaları vb. sabitlenmeli ve gerekli erişim token’ları dummy formda eklenmemeli.
- **Veri Seti:** Kullandığınız “ground truth” zafiyet tanımlarının tam listesi, hangi sink, kaynağın hangi parçalarında bulunduğu açıklanmalı. Her bir senaryo için meta veriler verilmeli.
- **Sonuç Kaydı:** Deney çıktılarını (loglar, tarama raporları) yayım zamanı bir repository’ye eklemek tekrarlanabilirliği artırır. Özellikle pipeline süre ölçümleri, SAST raporları JSON/CSV formatında paylaşılabilir.
- **Hash & Sertifika:** Kritik dış bağımlılıklar (NPM package hash’ları, GH Actions eylemleri için sabit tag’ler) kullanılmalı. 
- **Rastgelelik:** Herhangi bir rastgele bileşen varsa (ör. giriş verisi sırası) seed ile kontrol edilmelidir.

Böylece başka bir araştırmacı, kaynak kod ve yapılandırmalarla deney sonuçlarını yeniden üretebilir veya genişletebilir.

**Kaynaklar:** Belirtilen çalışmalardan alınmış bilgileri ilgili yerlerde atıf formatında kullandık: örneğin Brito ve ark. , Marin ve ark. , Barrak ve ark. . OWASP dokümanlarından alıntılar  mevcuttur. Gri literatürden bahsederken (Cloudflare dok., AWS blogları vb.) bu kısaca “gri” olarak etikete edilebilir, fakat kullanıcı istemediği sürece detay verilmeyecek şekilde yorumlanacaktır.

