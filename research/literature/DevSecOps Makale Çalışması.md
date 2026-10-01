### 1. Çalışmanın Konsepti, Kapsamı ve Mimari Kurgusu

Bu araştırma; sunucusuz uç bilişim (*serverless edge computing*) ortamlarında çalışan uygulamaların güvenliğini sağlamak üzere kurgulanan **çok katmanlı DevSecOps boru hatlarının (CI/CD security gates)** tespit kabiliyetini, kör noktalarını ve getirdiği süreçsel maliyetleri ampirik olarak inceleyen bir yazılım mühendisliği çalışmasıdır.

Geleneksel web mimarilerinde dış dünyadan gelen veri neredeyse her zaman standart bir HTTP isteğidir. Ancak sunucusuz uç mimarilerde fonksiyonlar; asenkron mesaj kuyrukları (Cloudflare Queues), zamanlayıcılar (Cron Triggers), nesne depolama bildirimleri (R2 Events) veya harici web kancaları (Webhooks) gibi çok çeşitli olay kaynakları (*event sources*) tarafından tetiklenebilmektedir.

Geliştiriciler bu asenkron olay yüklerini genellikle "güvenilir iç sistem bileşeni" varsayarak girdi doğrulaması yapmadan doğrudan veri tabanı sorgularına veya kritik sistem fonksiyonlarına aktarmaktadır.

```
                     [ Geliştirici Ortamı (VS Code) ]
                                     │ (Pre-commit: Husky, Gitleaks, ESLint)
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │            GitHub Actions CI/CD Güvenlik Kapıları                      │
 │ ├─ Pipeline Linter : zizmor (PPE & İş Akışı Enjeksiyon Taraması)       │
 │ ├─ Secret Scanning : Gitleaks (Sert Kodlanmış Anahtar Taraması)        │
 │ ├─ SCA             : OSV-Scanner, npm audit (Bağımlılık CVE Taraması)  │
 │ ├─ IaC / Config    : Checkov, Trivy (wrangler.jsonc Yetki Taraması)    │
 │ ├─ SAST (Çekirdek) : CodeQL, Semgrep CE, Opengrep (Veri Akış Analizi)  │
 │ └─ DAST (Dinamik)  : OWASP ZAP (Önizleme Ortamı API Fuzzing Testi)     │
 └────────────────────────────────────────────────────────────────────────┘
                                     │ (Fail-Closed: Bulgu Varsa Dağıtımı Kır)
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │           Cloudflare Workers & Pages (Uç Dağıtım Ortamı)               │
 │ (Hono.js + TypeScript + Cloudflare D1 + R2 + Queues + Cron Triggers)   │
 └────────────────────────────────────────────────────────────────────────┘

```

Araştırma, bu çok katmanlı boru hattını `yusufarbc/e-commerce-cloudflare` referans mimarisi üzerinde kurgulayarak şu temel soruyu sınar:

Varsayılan DevSecOps kapıları, aynı güvenlik açığı bir HTTP isteği yerine asenkron bir olay kaynağından geldiğinde bu açığı yakalamakta başarısız olmakta mıdır; bu başarısızlık diğer araç katmanlarıyla (IaC, DAST) telafi edilebilir mi ve bu kontrollerin CI/CD yürütme süresine getirdiği maliyet nedir?

---

### 2. Literatürdeki Mevcut Durum ve Çalışmanın Konumlandığı Boşluk

Mevcut akademik literatür incelendiğinde, bu çalışmanın tam merkezinde durduğu problem parçalı olarak tartışılmış, ancak nedensel bir deney tasarımıyla birleştirilmemiştir:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│                              LİTERATÜR HARİTASI VE BOŞLUK                                 │
├──────────────────────────┬───────────────────────────────┬────────────────────────────────┤
│ Literatür Grubu          │ Neyi İncelediler?             │ Neyi Eksik Bıraktılar?         │
├──────────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ CloudFlow (2025)[cite: 1]│ IaC tabanlı olay çıkarımıyla  │ Yalnızca AWS Lambda & Python;  │
│ SymFlow (2026)[cite: 8] │ özel statik analiz ve sembolik│ varsayılan CI kapılarını ve    │
│                          │ yürütme motoru geliştirdiler  │ HTTP vs. Event ikizlerini      │
│                          │[cite: 3, 8, 9].              │ test etmediler[cite: 3, 8].   │
├──────────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ FaaSGuard (2025)[cite: 3]│ OpenFaaS için uçtan uca       │ Girdi kaynağını bağımsız       │
│                          │ DevSecOps pipeline'ı kurdular │ değişken almadılar; V8 Isolate │
│                          │[cite: 3, 4, 8].              │ mimarisini dışladılar[cite: 3]│
├──────────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ Brito vd. (2023)[cite: 3]│ Node.js ve Java kodlarında    │ FaaS giriş noktaları ve bulut  │
│ Bennett vd. (2024)[cite: 3│ genel SAST araçlarının yüksek │ bağlamları (bindings) yok;     │
│                          │ FN oranlarını gösterdiler     │ yalnızca paket düzeyinde       │
│                          │[cite: 3, 4, 8].              │ kütüphane koduna baktılar[cite: 3, 4].
├──────────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ BU ÇALIŞMA               │ Eşleştirilmiş İkiz Zafiyet    │ Çok katmanlı boru hattında     │
│ (Sizin Makaleniz)        │ Tasarımı (Paired Twins) ile   │ kaynak türü değişiminin marjinal│
│                          │ varsayılan kapıların ölçümü   │ tespit ve süre etkisini        │
│                          │[cite: 2, 8].                 │ sayısallaştırır[cite: 2, 8].  │
└──────────────────────────┴───────────────────────────────┴────────────────────────────────┘

```

1. **Özel Araç Geliştirme ile Varsayılan Kapı Değerlendirmesi Arasındaki Ayrım:**
*CloudFlow* (USENIX Security 2025) ve *SymFlow* (LCTES 2026), olay zincirlerinin statik analizi zorlaştırdığını kanıtlamış ve bu sorunu aşmak için altyapı kodundan olayları çıkaran akademik prototip analiz motorları inşa etmişlerdir. Ancak endüstride geliştiricilerin %54'ü güvenlik tarayıcılarını hiçbir özel konfigürasyon yapmadan, varsayılan ayarlarla çalıştırmaktadır. Endüstrinin fiilen kullandığı GitHub Actions kapılarının (CodeQL, Semgrep CE) bu olay akışları karşısındaki ampirik başarımı literatürde ölçülmemiştir.


2. **Platform ve Çalışma Zamanı Eksikliği:**
Serverless statik analiz literatürü neredeyse bütünüyle AWS Lambda ve Python odaklıdır. Cloudflare Workers'ın temsil ettiği V8 Isolate tabanlı uç bilişim ekosisteminde; işletim sistemi ve VPC sınırlarının olmaması, veritabanı erişimlerinin C++ ortam bağlamları (`env.DB`, `env.R2`) üzerinden yürütülmesi program analizi literatüründe incelenmemiş bir alandır.


3. **Eşleştirilmiş (Paired) Nedensel Deney Yokluğu:**
Literatürde olay enjeksiyonunun bir tehdit olduğu OWASP kılavuzlarında belirtilse de, aynı zafiyetli alıcı (sink) üzerinde kaynağın HTTP'den olay tetikleyicisine dönüştürülmesinin tespit oranında yarattığı asimetriyi kontrollü ikiz açık deneyiyle ölçen hakemli bir çalışma bulunmamaktadır.



---

### 3. Çalışmanın Özgün Akademik Katkıları

Bu çalışma, yazılım güvenliği ve ampirik yazılım mühendisliği literatürüne 5 temel özgün katkı sunmaktadır:

#### Katkı 1: İlk Nedensel "Taint-Source Kapsama" Ölçümü (Ampirik Katkı)

Zafiyetli alıcı fonksiyonu (`env.DB.prepare()` SQL sorgusu gibi) ve iş mantığı bayt düzeyinde sabit tutulurken, yalnızca adaptör katmanındaki girdi kaynağı (HTTP vs. Queue/Cron/R2) manipüle edilir.

Böylece tespit kayıplarının kod karmaşıklığından değil, doğrudan SAST motorunun veri akış grafında (DFG) asenkron olay parametrelerini leke kaynağı (*untrusted source*) olarak modelleyememesinden kaynaklandığı Exact McNemar testi ve Odds Ratio ile ilk kez nedensel olarak kanıtlanır.

#### Katkı 2: Çok Katmanlı DevSecOps Marjinal Güvenlik ve Süre-Maliyet Modeli (Süreç Katkısı)

Araçlar boru hattına gelişigüzel entegre edilmez; her güvenlik katmanı (Secret $\rightarrow$ SCA $\rightarrow$ IaC $\rightarrow$ SAST $\rightarrow$ DAST) sırayla eklenerek bağımsız marjinal güvenlik artışı ve getirdiği duvar saati gecikmesi (*pipeline overhead %*) ölçülür.

Bu sayede geliştirici sürtünmesi ile güvenlik kazanımı arasındaki ödünleşim (*trade-off*) sayısallaştırılarak bir "Güvenlik Faydası" (*Security Utility*) modeli önerilir.

#### Katkı 3: "DAST Asenkron Körlüğü" ile SAST Boşluğunun Kesişiminin Gösterilmesi

Önizleme dağıtımlarında koşturulan OWASP ZAP gibi DAST araçlarının HTTP uç noktalarını tarayabildiği, ancak kuyruk ve cron gibi asenkron olayları dışarıdan tetikleyemediği deneysel olarak gösterilir.

Böylece şu kritik tez ortaya konur: Olay güdümlü mimarilerde DAST protokol seviyesinde kör kalırken, geriye kalan tek otomatik savunma hattı olan SAST ise varsayılan kural eksikliği nedeniyle açığı kaçırmaktadır.

#### Katkı 4: Taban Etkisini (*Floor Effect*) Önleyen Üç Kollu Metodoloji (Metodolojik Katkı)

CodeQL'in resmî kütüphanesinde Hono ve Cloudflare Workers çerçeve modellerinin bulunmadığı dikkate alınarak; Modellenmiş HTTP (Express pozitif kontrolü), Modellenmemiş HTTP (Hono çerçeve etkisi) ve Olay Kaynağı (Queue/Cron) olmak üzere üç kollu bir karşılaştırma kurgulanır.

Bu tasarım, hakemlerin *"Araç açığı olay olduğu için değil, Hono'yu tanımadığı için kaçırdı"* eleştirisini önceden çürütür.

#### Katkı 5: Held-Out Doğrulamalı Açık Bilim Kıyaslama Kümeleri (Topluluk Katkısı)

Cloudflare Workers platformuna özgü 40–60 ikiz açık çifti içeren zemin gerçeği korpusu, Miniflare ile dinamik istismar testleri (exploit oracle) ve `wrangler.jsonc` konfigürasyonlarını modelleyen özel Semgrep/OPA kuralları açık bilim standartlarında (Zenodo DOI) yayımlanır.

Özel kurallar geliştirme kümesinde eğitilip hiç görülmemiş (*held-out*) test kümesinde ölçüldüğünden döngüsellik ve aşırı uyum (*overfitting*) riski metodolojik olarak engellenir.

---

### 4. Araştırma Soruları (RQ1 – RQ4) ve Araç Matrisi

Akademik kategori hatasını engellemek adına boru hattındaki her araç kendi uzmanlık alanına göre ilgili araştırma sorusuna atanmıştır:

| Güvenlik Katmanı | Kullanılan Araçlar | RQ1: Genel Kapsama | RQ2: İkiz Kaynak Analizi | RQ3: Özel Kural Başarımı | RQ4: CI/CD Süre Yükü |
| --- | --- | --- | --- | --- | --- |
| **Pipeline Linter** | zizmor, actionlint

 | ✓

 | — | — | ✓

 |
| **Secret Scanning** | Gitleaks, TruffleHog

 | ✓

 | — | — | ✓

 |
| **SCA (Bağımlılık)** | OSV-Scanner, npm audit

 | ✓

 | — | — | ✓

 |
| **IaC / Config** | Checkov, Trivy (config)

 | ✓

 | — | ✓ (OPA Rego)

 | ✓

 |
| **SAST (Leke Analizi)** | CodeQL, Semgrep CE, Opengrep

 | ✓

 | **✓ (Çekirdek)**<br> | **✓ (Held-Out)**<br> | ✓

 |
| **DAST (Dinamik)** | OWASP ZAP (API Scan)

 | ✓ (Önizleme)

 | — | — | ✓

 |

* **RQ1 (Varsayılan Kapı Etkinliği):** Varsayılan DevSecOps araç zinciri (Secret, SCA, IaC, SAST, DAST) serverless edge projesindeki açıkların ne kadarını yakalayabilmektedir? (Tüm araçlar çalışır; zafiyet sınıfı bazında genel Recall ve Precision ölçülür).


* **RQ2 (Girdi Kaynağının Tespitteki Asimetrisi - Çekirdek Deney):** Aynı zafiyetli alıcı ve iş mantığında, girdi HTTP yerine bir olay kaynağından (Queue, Cron, R2, Webhook) geldiğinde SAST araçlarının tespit oranı istatistiksel olarak anlamlı ölçüde düşmekte midir? (Yalnızca CodeQL, Semgrep ve Opengrep sınanır; Exact McNemar testi uygulanır).


* **RQ3 (Platforma Duyarlı Kural Etkinliği):** `wrangler.jsonc` konfigürasyonundan ve uç bağlamlarından (`c.env.*`) türetilen özel Semgrep kuralları ve OPA/Rego politikaları, kural yazılırken hiç görülmemiş (*held-out*) test setinde bu boşluğu ne kadar kapatmaktadır?


* **RQ4 (Süreçsel Maliyet ve Geliştirici Yükü):** Bu güvenlik kapılarının kademeli olarak CI/CD hattına eklenmesi boru hattı duvar saati yürütme süresine (Overhead %), bellek/CPU tüketimine ve geliştirici sürtünmesine nasıl yansımaktadır? (30 bağımsız koşum üzerinden Wilcoxon ve Cliff's delta analizi).



---

### 5. Deneysel Metodoloji ve İkiz Korpus Tasarımı

#### İkiz Zafiyet Mimarisi (Paired-Twin Protocol)

Deneyde alıcı fonksiyon ve iş mantığı `handleOrder()` modülünde bayt düzeyinde kilitlenir; yalnızca giriş adaptörü değiştirilir:

```typescript
// --- Ortak Zafiyetli Alıcı (Sink): CWE-89 SQL Enjeksiyonu ---
async function handleOrder(sku: string, env: Env) {
  return await env.DB.prepare(`SELECT * FROM products WHERE sku = '${sku}'`).all();[cite: 2, 8]
}

// 1. HTTP İkizi (Hono Web Çatısı Girişi)
app.post("/orders", async (c) => {
  const { sku } = await c.req.json();
  return handleOrder(sku, c.env);[cite: 2, 8]
});

// 2. Olay İkizi (Cloudflare Queue Girişi)
export default {
  async queue(batch: MessageBatch<any>, env: Env) {
    for (const msg of batch.messages) {
      await handleOrder(msg.body.sku, env);[cite: 2, 8]
    }
  }
};

// 3. Temiz İkiz (Düzeltilmiş Kontrol Grubu - Negatif Örnek)
async function handleOrderClean(sku: string, env: Env) {
  return await env.DB.prepare("SELECT * FROM products WHERE sku = ?").bind(sku).all();[cite: 2]
}

```

#### Korpus Tasarımı ve Veri Bölümlemesi

Korpus, 5 kritik CWE sınıfında (CWE-89 SQLi, CWE-78 Komut Enjeksiyonu, CWE-22 Path Traversal, CWE-918 SSRF, CWE-502 Deserialization) toplam 40–60 ikiz çift (160–240 dosya) olarak kurgulanır:

* **Geliştirme Kümesi (Dev Set - %50):** Özel kural paketlerinin (Semgrep YAML, CodeQL `sourceModel`, OPA Rego) geliştirildiği ve optimize edildiği açık küme.


* **Ayrılmış Doğrulama Kümesi (Held-Out Set - %50):** Kuralların başarısının sınandığı, kural yazımı esnasında analiz motorlarına gösterilmemiş bağımsız küme.


* **Negatif Çiftler (Temiz İkizler):** Her açıklı dosyanın parametrik sorgulu düzeltilmiş hali oluşturularak araçların yanlış pozitif oranları (FPR) ve özgüllükleri (*specificity*) hesaplanır.



#### İki Katmanlı Testbed Ortamı

* **Birincil Testbed (Uç Bilişim - Cloudflare Workers):** `e-commerce-cloudflare` projeniz üzerinde Hono, TypeScript, D1, R2 ve Queues ile tüm deneyler (E1–E4) detaylı yürütülür.


* **İkincil Doğrulama Testbed'i (Dış Geçerlilik - AWS Lambda):** OWASP DVSA (Damn Vulnerable Serverless Application) üzerinde belirli açıklar tekrarlanarak, elde edilen sonuçların yalnızca Cloudflare'e özgü olmadığı, sunucusuz olay mimarilerinin genel bir yapısal eksikliği olduğu ispatlanır.



---

### 6. İstatistiksel Değerlendirme Çerçevesi

Toplanan verilerin analizinde parametrik olmayan hipotez testleri işletilir:

* **RQ2 Hipotez Testi (Exact McNemar Testi):**
Her araç için HTTP ve Olay ikizlerinin tespit durumları (1: Bulundu, 0: Kaçırıldı) $2 \times 2$ kontenjans tablosunda eşleştirilir. Uyumsuz çiftlerin ($b$: HTTP'de bulunup Olay'da kaçırılan, $c$: Olay'da bulunup HTTP'de kaçırılan) dağılımı küçük örneklemlerde kesin binomiyal test ile hesaplanır:



$$p = 2 \sum_{k=b}^{n} \binom{n}{k} \left(\frac{1}{2}\right)^n \quad \text{burada } n = b + c$$




Etki büyüklüğü Eşleştirilmiş Risk Oranı (*Odds Ratio*) ile ifade edilir: $OR = b / c$.


* **Kovaryat Kontrolü (Lojistik GLMM):**
Akış karmaşıklığı (interprocedural derinlik) ve CWE türünün etkisini izole etmek amacıyla Genelleştirilmiş Doğrusal Karma Model (*Generalized Linear Mixed Model*) çalıştırılır:



$$\text{logit}(P(\text{Detected}_{ij} = 1)) = \beta_0 + \beta_1 \text{Source}_{ij} + \beta_2 \text{Tool}_i + \beta_3 \text{Complexity}_{j} + u_{\text{pair}(j)} + v_{\text{CWE}(j)}$$



* **RQ4 Süre Analizi (Wilcoxon Signed-Rank Testi & Cliff's Delta):**
CI/CD çalışma süreleri sağa çarpık dağıldığından ortalama yerine Medyan ve IQR (Interquartile Range) kullanılır. Konfigürasyonlar arasındaki fark Wilcoxon testiyle, pratik etki büyüklüğü ise Cliff's delta ($\delta$) metriğiyle sayısallaştırılır.


* **Boru Hattı Bağıl Gecikme Artışı (Overhead %):**

$$\text{Overhead}_{\%} = \frac{\tilde{T}_{\text{config}} - \tilde{T}_{\text{baseline}}}{\tilde{T}_{\text{baseline}}} \times 100$$




(Burada $\tilde{T}$ medyan duvar saati süresidir).



---

### 7. Makalenin Yayın Konumlandırması ve Stratejik Değeri

Bu çalışma; hem tezinizden bağımsız birinci yazarlı bir bilimsel makale üretmek hem de kurumsal kariyerinizde güçlü bir portföy ortaya koymak üzere tasarlanmıştır:

* **Yayın Hedefi:** Wiley tarafından basılan **Software: Practice and Experience (SCI-E)** dergisi birincil hedeftir. Dergi abonelik modeliyle ücretsiz basım sunmakta olup, ampirik araç değerlendirmeleri ve benchmark çalışmalarına doğrudan açıktır. Alternatif güvenli seçenek olarak TÜBİTAK **Turkish Journal of Electrical Engineering & Computer Sciences (SCI-E / TR Dizin)** konumlandırılabilir.


* **Hakem Savunma Gücü:** Çalışma; "sentetik açıklar gerçekçi değildir" eleştirisini dinamik exploit oracle'lar ve depodaki organik açıklarla bertaraf eder; "bu sadece Cloudflare sorunudur" eleştirisini AWS DVSA doğrulamasıyla aşar; "kendi açığınıza kural yazıyorsunuz" eleştirisini ise held-out set protokolüyle kesin olarak engeller.


* **Nihai Sonuç:** Araştırma, basit bir tarama raporu olmaktan çıkarak; modern uç bilişim mimarilerinde yazılım tedarik zinciri güvenliğinin katmanlı yapısını, olay modellerinin yarattığı kör noktaları ve optimum DevSecOps kapı konfigürasyonunu ampirik kanıtlarla ortaya koyan özgün bir mühendislik yayını niteliği kazanır.


Mevcut literatür incelendiğinde, bu çalışmanın akademik katkısı rastgele bir araç karşılaştırmasının çok ötesinde, **program analizi (SAST), bulut bilişim (Serverless Edge) ve ampirik yazılım mühendisliği (DevSecOps)** kesişimindeki kuramsal ve pratik bir boşluğu doldurmaktadır.

Çalışmanızın literatürdeki diğer çalışmalardan nasıl ayrıştığı, sağlayacağı 4 temel özgün katkı ve üst düzey hakemli bir dergide (örneğin *Software: Practice and Experience* veya *IEEE Transactions on Software Engineering*) kabul alması için adım adım nasıl kurgulanması gerektiği aşağıda ayrıntılandırılmıştır.

---

## 1. Mevcut Literatürün Durumu ve Ayrıştığınız Temel Eksen

Elinizdeki kaynaklar (CloudFlow, SymFlow, FaaSGuard, Brito vd., Bennett vd., Obetz vd.), konunun farklı parçalarını çalışmış ancak asıl nedensel soruyu cevapsız bırakmıştır:

* CloudFlow (USENIX Security 2025) ve SymFlow (LCTES 2026): Altyapı kodunu (IaC) analiz ederek olay zincirlerini sembolik yürütmeyle takip eden *özel akademik araçlar* geliştirmişlerdir. "Olay zincirlerinin statik analizi körleştirdiğini" kanıtlamışlardır; ancak **endüstrinin fiilen kullandığı varsayılan CI/CD kapılarını (CodeQL, Semgrep) test etmemişler** ve **aynı açığı HTTP ile asenkron olay kaynağı arasında eşleştirerek (paired) ölçmemişlerdir**. Üstelik tamamen Python ve AWS Lambda odaklıdırlar.


* **FaaSGuard (SCAM 2025):** OpenFaaS üzerinde uçtan uca bir DevSecOps boru hattı önermiştir. Ancak kaynak türünü (HTTP vs. Event) bağımsız bir değişken olarak ele almamış ve V8 Isolate tabanlı modern uç mimarileri kapsamamıştır.


* *Bennett vd. (Semgrep*, EASE 2024) ve Brito vd. (IEEE TRel 2023):* SAST araçlarının genel kodlama açıklarındaki yüksek yanlış negatif (FN) oranlarını (%11–%26 tespit) ve kuralları özelleştirmenin gücünü göstermişlerdir. Ancak bu çalışmalar kurumsal Java veya standart Node.js kütüphanelerine odaklanmış; bulut tetikleyicilerini ve uç bağlamları dışarıda bırakmıştır.


* **Obetz vd. (HotCloud 2019 / ESOCC 2020):** Olay semantiği modellenmeden sunucusuz çağrı grafiklerinin (call graph) ve veri akışının (dataflow) sağlıklı kurulamayacağını kuramsal olarak ispatlamıştır. Ancak bunu ampirik bir güvenlik kapısı testine dönüştürmemiştir.



```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              LİTERATÜRDEKİ YERİNİZ                                      │
├──────────────────────────┬───────────────────────────────┬──────────────────────────────┤
│ Öncül Çalışmalar         │ Ne Yaptılar?                  │ Neyi Eksik Bıraktılar?       │
├──────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ CloudFlow (2025)[cite: 1]│ Özel IaC-statik analiz motoru │ Varsayılan araçlar yok;      │
│ SymFlow (2026)[cite: 8] │ (AWS + Python) geliştirdiler  │ HTTP vs Event ikiz farkı yok │
├──────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ Brito vd. (2023)[cite: 4]│ Node.js kütüphanelerinde SAST │ Sunucusuz FaaS girişleri yok;│
│ Bennett (2024)[cite: 4] │ kurallarını kıyasladılar      │ Uç API bağlamları yok        │
├──────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ BU ÇALIŞMA               │ Eşleştirilmiş İkiz Zafiyet    │ Çekirdek nedensel ispat:     │
│ (Sizin Makaleniz)        │ Tasarımı (Paired Twins)       │ "Aynı sink, farklı kaynak =  │
│                          │ Cloudflare Workers + Hono     │ Ölçülebilir tespit boşluğu"  │
└──────────────────────────┴───────────────────────────────┴──────────────────────────────┘

```

---

## 2. Makalenin 4 Temel Akademik Katkısı

Makalenizin hakemler tarafından güçlü bulunmasını sağlayacak 4 temel katkı ekseni şunlardır:

### Katkı 1: İlk Nedensel "Taint-Source Kapsama" Ölçümü (Ampirik Katkı)

Literatürde ilk kez, iş mantığı ve zafiyetli alıcı satırı (`env.DB.prepare()` gibi) bayt düzeyinde sabit tutulurken, girdinin HTTP'den asenkron bir kanala (Queue, Cron, R2) aktarılmasının SAST motorlarının veri akış grafını (DFG) nasıl kopardığı ampirik olarak kanıtlanacaktır. Bu durum, güvenlik topluluklarının (OWASP, PureSec) yıllardır iddia ettiği fakat veriye dayandırmadığı "Olay Enjeksiyonu Kör Noktası" savını ilk kez istatistiksel olarak (McNemar testi, Odds Ratio) sayısallaştıracaktır.

### Katkı 2: Taban Etkisini (*Floor Effect*) Kıran Üç Kollu Metodoloji (Metodolojik Katkı)

Resmî belgeler CodeQL'in Express.js'i tanıdığını, ancak Hono ve Cloudflare Workers'ı henüz modellemediğini göstermektedir. Eğer sadece Hono HTTP ile Queue karşılaştırılsaydı, araç ikisini de yakalayamayacak (%0 vs %0) ve "fark yok" yanılgısı doğacaktı.
Sizin çalışmanız **üç kollu eşleştirilmiş tasarım** önererek metodolojik bir katkı sunar:

1. **Modellenmiş HTTP (Express/Node):** Pozitif kontrol; aracın sink'i prensipte yakalayabildiğini doğrular.


2. **Uç HTTP (Hono):** Çerçeve körlüğünü (*framework blindness*) ölçer.


3. **Uç Olay Kaynağı (Queue/Cron):** Asıl hipotez olan olay modeli körlüğünü (*event-source blindness*) yalıtır.



### Katkı 3: Güvenlik Kapılarında Marjinal Getiri ve Süre Maliyeti (DevSecOps Süreç Katkısı)

Araçları körü körüne pipeline'a yığmak yerine, her güvenlik katmanının (Gitleaks, OSV-Scanner, Checkov, Semgrep, CodeQL, ZAP) boru hattına kümülatif olarak eklenmesiyle elde edilen **marjinal güvenlik artışı** ve getirdiği **gecikme maliyeti (Overhead %)** ilk kez ölçülecektir. Bu sayede endüstri için bir *"Güvenlik Faydası / Verimlilik"* dengesi modellenecektir.

### Katkı 4: Açık Bilim Standardında "Serverless Edge Paired Benchmark"ı (Topluluk Katkısı)

Cloudflare Workers, Hono, D1 ve R2 için 40–60 eşleştirilmiş çiftten oluşan, Miniflare ile dinamik istismar doğrulaması (exploit oracle) yapılmış ilk çalıştırılabilir kıyaslama kümesi (benchmark) ve platforma duyarlı özel kural paketi Zenodo/GitHub üzerinden literatüre kazandırılacaktır.

---

## 3. Makaleyi Kurgulama ve Yürütme Planı (Adım Adım Yol Haritası)

Elinizdeki `e-commerce-cloudflare` projesini ve literatür taraması belgelerini temel alarak araştırmayı şu aşamalarla inşa etmelisiniz:

### Adım 1: Eşleştirilmiş Zafiyet Korpusunu Oluşturma (Hafta 1–3)

Projenizin `experiments/security-corpus` dalında 5 kritik CWE için dosyalar arası değil, kontrollü tek modül içinde ikiz açıklar yazın:

* **CWE-89 (SQLi):** `c.req.query('sku')` $\rightarrow$ `env.DB.prepare()` **vs.** `msg.body.sku` (Queue) $\rightarrow$ `env.DB.prepare()`.


* **CWE-78 (Komut Enjeksiyonu):** HTTP parametresi $\rightarrow$ `exec()` **vs.** Cron tetikleyicisi dış veri $\rightarrow$ `exec()`.


* **CWE-22 (Path Traversal):** Route parametresi $\rightarrow$ R2 nesne anahtarı **vs.** Webhook payload $\rightarrow$ R2 anahtarı.


* **CWE-918 (SSRF):** Request body URL $\rightarrow$ `fetch()` **vs.** Kuyruktaki bildirim URL'si $\rightarrow$ `fetch()`.


* **CWE-502 / BOLA:** Admin route **vs.** İmzasız webhook tetiklemesi.



> **Altın Kural:** Her zafiyetin mutlaka parametrik sorgu veya doğrulama içeren **düzeltilmiş temiz ikizi (clean twin)** bulunmalıdır. Temiz ikiz olmadan yanlış pozitif (FPR) ölçülemez.
> 
> 

### Adım 2: Deney İş Akışının Kurulması (Hafta 4–5)

GitHub Actions üzerinde `security-experiment.yml` dosyasını oluşturun:

* **Araç Sürümlerini Kilitleyin:** CodeQL action sürümünü, Semgrep ve Trivy versiyonlarını tam commit hash veya digest ile sabitleyin (tekrarlanabilirlik şartı).


* **SARIF Çıktıları:** Her araç tarama sonucunu `results/` klasörüne standart SARIF formatında yazmalıdır.


* **Süre Kaydı:** Adımların başlama ve bitiş zamanlarını milisaniye hassasiyetinde `timings.csv` dosyasına ekleyin.



### Adım 3: Deneylerin Koşulması ve Veri Toplama (Hafta 6–8)

1. **Deney 1 (RQ1 - Varsayılan Durum):** Tüm korpus varsayılan ayarlarla taranır; genel yakalama (Recall), kesinlik (Precision) ve F1 hesaplanır.


2. **Deney 2 (RQ2 - İkiz Karşılaştırma):** Yalnızca leke analizi yapabilen SAST araçlarının (CodeQL, Semgrep CE, Opengrep) HTTP ve Olay ikizlerindeki tespitleri $2 \times 2$ matrisinde eşleştirilir.


3. **Deney 3 (RQ3 - Platforma Duyarlı Kurallar):** `wrangler.jsonc` konfigürasyonunu ve `c.env.*` bağlamlarını kaynak sayan özel Semgrep/OPA kuralları yazılır. Bu kurallar geliştirme setinde hazırlanır; başarımı **held-out (ayrılmış)** sette ölçülür.


4. **Deney 4 (RQ4 - Süre ve Maliyet):** 3 farklı konfigürasyon (Yalın Derleme, Varsayılan Kapılar, Özel Kurallı Tam Kapılar) GitHub Actions üzerinde **30'ar kez** çalıştırılır.



### Adım 4: İstatistiksel Analiz (Hafta 9)

* **RQ2 için:** Eşleştirilmiş ikili verilerde farkın tesadüf olup olmadığını sınamak için **Exact McNemar Testi** ($p < 0.05$) ve etki büyüklüğü için **Odds Ratio** ($OR = b/c$) hesaplayın.


* **Kovaryat Analizi:** Zafiyet karmaşıklığının etkisini izole etmek için lojistik GLMM (Generalized Linear Mixed Model) çalıştırın.


* **RQ4 için:** Dağılım sağa çarpık olacağından ortalama yerine **Medyan ve IQR** verin; gruplar arası farkı **Wilcoxon Signed-Rank** ve **Cliff's Delta** ile raporlayın.



---

## 4. Hakem Eleştirilerini Önceden Bertaraf Etme Stratejisi

Makalenizin hakem değerlendirmesinde (peer-review) en çok takılabileceği 4 nokta ve bunların savunma kalkanı şunlardır:

1. **"Sentetik zafiyetler gerçek dünyayı yansıtmaz" Eleştirisi:**
* *Savunma:* "Çalışmanın amacı zafiyet keşfi değil, nedensel kaynak modeli yalıtımıdır. Bu nedenselliği sağlamanın tek yolu alıcıyı (sink) sabit tutup kaynağı değiştirmektir. Ayrıca sentetik açıkların sömürülebilirliği Miniflare testleriyle dinamik olarak kanıtlanmış, depodaki organik açıklar (`ADMIN_JWT_SECRET`, güvensiz CORS) held-out sete eklenerek dış geçerlilik desteklenmiştir."




2. **"Bu sadece Cloudflare Workers'a özgü bir sorun" Eleştirisi:**
* *Savunma:* "Ana deney uç bilişimin temsilcisi olarak Cloudflare üzerinde yürütülmüş; ancak dış geçerliliği doğrulamak için deney AWS Lambda tabanlı OWASP DVSA üzerinde tekrarlanarak bulguların FaaS olay mimarisine genellenebilirliği kanıtlanmıştır."




3. **"Kendi yazdığınız açığa kendi kuralınızı yazıp test ediyorsunuz (Overfitting / Döngüsellik)" Eleştirisi:**
* *Savunma:* "Bennett vd.'nin düştüğü metodolojik hatadan kaçınmak için veri kümesi kesin çizgilerle *Dev Set* ve *Held-Out Set* olarak ikiye ayrılmıştır. Özel kurallar yalnızca Dev Set üzerinde geliştirilmiş, dondurulmuş (SHA ile kilitlenmiş) ve daha sonra hiç görülmemiş Held-Out kümede test edilmiştir."




4. **"Neden SCA ve Secret Scanning olay zafiyetini yakalayamadı diye bakıyorsunuz?" Eleştirisi:**
* *Savunma:* "Kategori hatası yapılmamıştır. RQ2'deki eşleştirilmiş nedensel analizde yalnızca leke analizi yapabilen SAST araçları (CodeQL, Semgrep, Opengrep) kullanılmıştır. SCA, Secrets ve IaC araçları yalnızca RQ1 (genel mevcut durum) ve RQ4 (boru hattı toplam maliyeti) bağlamında tutulmuştur."





---

## 5. Önerilen Makale İskeleti ve Hedef Dergi

Makalenizi standart **IMRaD (Introduction, Methodology, Results, Discussion)** yapısında 10–12 sayfa olarak kurgulayın:

* **1. Introduction:** Uç bilişimin yükselişi, çoklu tetikleyici modelleri, varsayılan tarayıcıların HTTP varsayımı, RQ1–RQ4 ve 4 temel katkı.


* **2. Background & Related Work:** Serverless tehditleri (OWASP SAS-01), CloudFlow/SymFlow ile farkınız, SAST benchmark literatürü (Brito vd., Bennett vd.).


* **3. Methodology:** Üç kollu eşleştirilmiş ikiz korpus tasarımı, ground-truth kuralları, araç sürümleri ve konfigürasyonları, istatistiksel test protokolü.


* **4. Empirical Results:**
* E1 Sonuçları: Varsayılan kapıların genel kapsama ısı haritası (Tablo 1).


* E2 Sonuçları: HTTP vs. Event McNemar ve Odds Ratio bulguları (Tablo 2, Kaçırma taksonomisi).


* E3 Sonuçları: Platforma duyarlı özel kuralların held-out performansı ($\Delta Recall$).


* E4 Sonuçları: CI/CD boru hattı gecikme süreleri (Boxplot grafiği ve Wilcoxon sonuçları).




* **5. Discussion & Practical Implications:** Geliştiriciler ve SAST üreticileri için öneriler (Wrangler bildirimlerinin AST'ye gömülmesi gerekliliği), DAST'ın asenkron olaylardaki protokol körlüğü.


* **6. Threats to Validity:** İç, dış, yapı ve sonuç geçerliliği tehditleri ve alınan önlemler.


* **7. Conclusion & Open Science:** Özet ve Zenodo DOI bağlantısı.



**Hedef Dergi:**

İlk tercih olarak **Software: Practice and Experience (Wiley - SCI-E)** hedeflenmelidir. Abonelik modeliyle basıldığında yazar ücreti (APC) yoktur, pratik yazılım mühendisliği ve araç değerlendirme makalelerine doğrudan açıktır. Güvenli akademik yedek olarak TÜBİTAK **Turkish Journal of Electrical Engineering & Computer Sciences (SCI-E / TR Dizin)** kullanılabilir.

# DevSecOps Makale Çalışması — Serverless Edge Güvenlik Kapıları

Sep 29, 2026 · @araştırma yapacağım onboardingi geç

## Özet

Makale, hazır ve ücretsiz güvenlik tarama araçlarının serverless uygulamalardaki açıkları, veri web isteği yerine bir olay kaynağından (kuyruk, cron, dosya depolama, webhook) geldiğinde kaçırıp kaçırmadığını ölçen kontrollü bir deney çalışmasıdır.

Çalışma başlığı: *Do Default DevSecOps Gates See the Serverless Edge? An Empirical Study of Detection Gaps for Event-Sourced and Platform-Specific Vulnerabilities*.

- **Ana fikir:** Aynı açığı biri HTTP, biri event kaynaklı iki ikiz olarak yazıp araçların ikisini aynı oranda bulup bulmadığını istatistiksel olarak test etmek.
- **Testbed:** Kendi `e-commerce-cloudflare` projen (Workers, Hono, D1, R2), genellenebilirlik için AWS Lambda üzerindeki OWASP DVSA.
- **Araçlar:** Tamamı ücretsiz — CodeQL, Semgrep CE, Opengrep, OSV-Scanner, Gitleaks, Trivy, Checkov, Conftest/OPA; hepsi GitHub Actions'ta çalışır.
- **Katkı:** Kör noktanın ölçülmesi, nedenlerinin sınıflandırılması, açık kaynak özel kural paketi ve CI maliyet analizi.
- **Tezle ilişkisi:** Tez (npm topolojisi) değişmiyor; bu makale ayrı ve paralel bir yayın. Mezuniyet için ikinci güvence işlevi görür.

## Bağlam: mezuniyet şartı ve tez

Karabük Üniversitesi'nde tezli yüksek lisans mezuniyeti için indeks şartı olmayan, bilim alanıyla ilgili tek bir bilimsel yayın yeterli (Senato, 18.05.2023, 2023/07, Karar 12; 2023-2024 Güz ve sonrası kayıtlar).

Karar metnindeki koşullar:

1. Yayın programa kayıt tarihinden **sonra** yapılmış olmalı.
2. Bilim alanıyla ilgili olmalı — tezden üretilmiş olması şart değil.
3. Aday **birinci yazar** olmalı.
4. Yayın **Karabük Üniversitesi adresli** olmalı.

Lisansüstü Eğitim ve Öğretim Yönetmeliği Madde 19(1) yalnızca "Enstitü Yönetim Kurulunca belirlenen diğer koşullara" atıf yapar; ayrıntı yukarıdaki senato kararındadır.

**Tez:** "NPM Tedarik Zincirinin Karmaşık Ağ Analizi: Bağımlılık Ağının Topolojik Olarak Değerlendirilmesi" — danışman Dr. Öğr. Üyesi Ömer Faruk Acar, enstitü kararı onaylı, aktif. Konuyu değiştirmemek kararlaştırıldı: veri hazır, IISEC 2027 bildirisi yolda ve konu daha özgün.

**IISEC 2027 bildirisi için:** birinci yazar Yusuf, Karabük adresi ve kurumsal e-posta, tezden üretildiğini belirten Acknowledgment (kör hakemlik yok), kabul/basım belgelerinin saklanması.

**Açık sorular (enstitüye/danışmana):**

- [ ] Kabul mektubu yeterli mi, yoksa bildirinin sunulmuş/basılmış olması mı gerekiyor?
- [ ] ARDEK formu bildiride ayrı bir ibare istiyor mu?

Bu DevSecOps makalesi de şartı karşılar (birinci yazar + Karabük adresi); zorunluluk değil, ek güvencedir.

## Konunun evrimi: neden bu konu

Geniş bir "Cloudflare üzerinde uçtan uca DevSecOps" fikrinden, tek ve ölçülebilir bir soruya daraltıldı: serverless'ta olay kaynaklı açıklar için tarama araçlarının kör noktası.

| Seçenek | Özgünlük | Risk / yük | Karar |
| --- | --- | --- | --- |
| Katmanlı DevSecOps kapıları benchmark'ı (P0→P6, ΔRecall) | Orta | Orta; sıra bağımlılığı, döngüsellik | Metrikleri bu makaleye taşındı |
| Cloudflare Zero Trust + OIDC + API Shield (geniş) | Orta | Yüksek; çok değişken | Tez / sonraki çalışma |
| AI kodlama ajanlarının açıklarını pipeline yakalıyor mu? | Çok yüksek | Yüksek | İkinci makale adayı |
| Developer PaaS (Vercel/Netlify/Render) güvence karşılaştırması | Yüksek | Ground truth zor | Tez bölümü |
| wrangler / workflow konfigürasyon mining | Yüksek | Düşük; etik bildirim | Paralel hızlı yayın |
| Bundle-aware SCA (tree-shaking sonrası reachability) | Yüksek | Orta | npm teziyle köprü, sonraki makale |
| Serverless event injection vs SAST | **Yüksek** | **Orta, temiz tasarım** | **Seçildi** |

Seçilme nedenleri: tasarım küçük ve kontrollü, ground truth bizim elimizde, sonuç tek cümlede anlatılabiliyor ("event kaynaklı açıklarda recall X puan düşüyor") ve mevcut testbed doğrudan kullanılabiliyor.

Önceki taslaklardan dersler: Doc'lardaki uydurma örnek sonuç tablosu kullanılmayacak; araçların "eğitildiği" ifadesi yanlış (kural/sorgu tabanlılar); tespit için n=30 koşum anlamsız, yalnızca süre için gerekli.

## Problem ve hipotez

Hipotez: Varsayılan SAST kural setleri ve dataflow modelleri, serverless platformlarda web isteği dışındaki olay kaynaklarını (kuyruk mesajı, cron, depolama olayı, webhook) güvenilmeyen girdi olarak modellemediği için bu kaynaklardan gelen açıklarda anlamlı ölçüde daha düşük recall üretir.

Geleneksel web uygulamasında dışarıdan gelen veri neredeyse her zaman bir HTTP isteğidir. Serverless'ta bir fonksiyon kuyruk, zamanlayıcı, dosya yükleme olayı veya üçüncü taraf bildirimiyle de tetiklenir; bu kanallar da saldırganın kontrol edebildiği veri taşır.

**Terimler**

| Terim | Anlamı |
| --- | --- |
| SAST | Kaynak kodu çalıştırmadan inceleyen statik analiz (CodeQL, Semgrep) |
| SCA | Bağımlılıklardaki bilinen açıkları arayan analiz (OSV-Scanner, npm audit) |
| DAST | Çalışan uygulamaya dışarıdan saldırarak test (OWASP ZAP) |
| IaC / config taraması | Yapılandırma dosyalarındaki hatalı ayarları arama (Checkov, Trivy, OPA) |
| Source (kaynak) | Güvenilmeyen verinin koda girdiği yer — HTTP parametresi, kuyruk mesajı |
| Sink (hedef) | Verinin tehlikeli kullanıldığı yer — SQL sorgusu, dosya yolu, dış istek |
| Taint analizi | Source'tan sink'e temizlenmeden giden veri akışını izleme |
| Event injection | Olay kaynağından gelen verinin sink'e ulaşmasıyla oluşan enjeksiyon |
| Security gate | CI'da başarısız olursa deploy'u durduran güvenlik adımı |
| SARIF | Güvenlik araçlarının ortak JSON rapor formatı |

**Kapsam:** Tespit kontrolleri (SAST, SCA, secret, config). SBOM, imzalama, SLSA provenance gibi güvence kontrolleri kapsam dışı; başarı ölçütleri farklı olduğu için teze bırakıldı.

## Araştırma soruları

Dört soru var; ana katkıyı RQ2 taşır, RQ4 sayfa sıkışırsa ilk kısaltılacak kısımdır.

| RQ | Soru | Rolü |
| --- | --- | --- |
| RQ1 | Varsayılan kapılar (CodeQL, Semgrep, Gitleaks, Trivy, Checkov) serverless'a özgü açıkların ne kadarını yakalıyor? | Durumu ortaya koyar |
| RQ2 | Aynı açık HTTP yerine bir event kaynağında olduğunda tespit oranı anlamlı ölçüde düşüyor mu? | Ana bulgu |
| RQ3 | Platforma duyarlı özel kurallar, kural yazımında hiç görülmemiş (held-out) vakalarda bu boşluğu ne kadar kapatıyor? | Çözüm önerisi |
| RQ4 | Bu kapılar CI süresine ne kadar ek yük getiriyor? | Pratik maliyet |

## Testbed

Üç kaynak kullanılacak: birincil olarak kendi projen, genellenebilirlik için AWS Lambda tabanlı DVSA, temsil gücü için birkaç açık kaynak Workers projesi.

| Testbed | Platform | Rolü | Not |
| --- | --- | --- | --- |
| [e-commerce-cloudflare](https://github.com/yusufarbc/e-commerce-cloudflare) | Workers, Pages, Hono, Prisma, D1, R2, cron, webhook | Birincil; ikiz vakalar buraya enjekte edilir | MIT lisanslı, prod değil, demo |
| [OWASP DVSA](https://github.com/OWASP/DVSA) | AWS Lambda (SAM / Serverless Framework) | E1–E2 tekrarı, "yalnızca Cloudflare'e özgü değil" kanıtı | GPL-3.0; statik analiz için deploy gerekmez |
| 2–3 açık kaynak Workers/Hono projesi | Cloudflare Workers | Enjeksiyonsuz organik bulgular, elle doğrulama | Seçim ölçütleri makalede yazılmalı |

**Projenin makaledeki tanımı:** "a representative reference e-commerce application built on Cloudflare Workers, Hono, D1 and R2". Gerçek prod olmadığı için bulgular "sahada bulunan açık" olarak sunulmaz.

**Projede kendiliğinden bulunan açıklar (organik vakalar, held-out):**

- `api/wrangler.toml` `[vars]` içinde düz metin `ADMIN_JWT_SECRET` ve `config.js` içinde aynı varsayılan değer (CWE-798).
- `app.js` CORS: gelen origin olduğu gibi yansıtılıyor, `credentials: true` (CWE-942).
- Kimlik doğrulamasız `/api/v1/debug-db` endpoint'i (CWE-306).
- Repoya commit edilmiş `api/prisma/dev.db`.

**Motivasyon örneği:** CI'da zaten `semgrep scan --config auto --error` çalışıyor ve pipeline bu açıklara rağmen geçiyor.

**Kurallar:** Açıklı kod yalnızca `experiments/security-corpus` dalında durur ve asla deploy edilmez. Deneyler herkese açık demo ortamında değil, runner içinde veya yerelde koşar.

## Korpus tasarımı

Her açık dört dosyalık bir grup olarak yazılır: HTTP-açıklı, HTTP-düzeltilmiş, event-açıklı, event-düzeltilmiş. Sink aynıdır, yalnızca kaynak değişir. Hedef 40–60 vaka.

**Tasarım ilkeleri**

- **İkiz vakalar:** RQ2'nin eşleşmiş karşılaştırması ve McNemar testi buna dayanır.
- **Negatif örnekler:** Her açıklı dosyanın düzeltilmiş ikizi precision ve FP ölçümü için.
- **Dev / held-out ayrımı:** Özel kurallar vakaların yarısında yazılır, diğer yarısında ölçülür (döngüsellik eleştirisine karşı).
- **Farklı yazar:** Held-out vakaların bir kısmını mümkünse başka biri yazar.
- **Tek dosya:** Vakalar şimdilik tek dosya içinde; ileride birkaç dosyalar arası vaka motor farkını gösterir.

**Planlanan vaka grupları**

| Pair | CWE | HTTP kaynağı | Event kaynağı | Durum |
| --- | --- | --- | --- | --- |
| C001 | CWE-89 D1 SQL injection | `c.req.query` | Queue mesajı | Yazıldı |
| C002 | CWE-22 path traversal | Route parametresi | R2 nesne anahtarı | Planlandı |
| C003 | CWE-918 SSRF | İstek gövdesi | Queue mesajındaki URL | Planlandı |
| C004 | CWE-862 yetki eksikliği | Admin route | İmzasız ödeme webhook'u | Planlandı |
| C005 | CWE-89 | `c.req.query` | Cron'un dış kaynaktan çektiği veri | Planlandı |
| C006 | CWE-16 / 798 | — | `wrangler.toml` varyantları | Planlandı |
| O001–O003 | 798 / 942 / 306 | Organik | Organik | Held-out |

**`ground_truth.csv` sütunları:** `case_id, pair_id, cwe, source_type, variant, file, sink_line, split, origin, notes`.

**Puanlama kuralı:** Araç, sink satırının ±3 satırı içinde doğru CWE ailesiyle bulgu raporlarsa TP; açıklı dosyada böyle bulgu yoksa FN; düzeltilmiş dosyadaki her bulgu FP.

Örnek ikiz (C001, özet):

```
// HTTP-açıklı
const sku = c.req.query('sku');
c.env.DB.prepare(`SELECT * FROM urunler WHERE sku = '${sku}'`).all();

// Queue-açıklı
const { sku } = msg.body;
env.DB.prepare(`... WHERE sku = '${sku}'`).run();

// Düzeltilmiş (ikisinde de)
env.DB.prepare('... WHERE sku = ?').bind(sku)
```

## Araçlar

Tüm araçlar ücretsiz ve GitHub Actions'ta çalışıyor; iki tanesinde metodolojiyi etkileyen kısıt var.

| Kategori | Araç | Lisans | Actions'ta kullanım | Makalede |
| --- | --- | --- | --- | --- |
| SAST | CodeQL | GitHub CodeQL şartları | `github/codeql-action` init + analyze, `security-extended` | Ana (E1–E2) |
| SAST | Semgrep CE | LGPL-2.1 | `pip install semgrep`, `--sarif --metrics off` | Ana (E1–E3) |
| SAST | Opengrep | LGPL-2.1 | Kurulum script'i, Semgrep ile aynı kurallar | Ana, motor karşılaştırması |
| SAST | ESLint + eslint-plugin-security | MIT | Lint adımı | Ek |
| SCA | OSV-Scanner | Apache 2.0 | Docker, `scan -r . --format sarif` | Ana |
| SCA | npm audit | npm'e dahil | `npm audit --json` | Karşılaştırma |
| Secret | Gitleaks | MIT | Docker CLI (action organizasyonlarda lisans isteyebilir) | Ana |
| Secret | TruffleHog | AGPL-3.0 | `trufflesecurity/trufflehog` | Ek |
| Config | Trivy | Apache 2.0 | `aquasecurity/trivy-action`, vuln+secret+misconfig | Ana |
| Config | Checkov | Apache 2.0 | `pip install checkov`, `-o sarif` | Ana |
| Config | Conftest / OPA | Apache 2.0 | Rego politikaları, TOML okur | E3 özel kurallar |
| DAST | OWASP ZAP | Apache 2.0 | `zaproxy/action-api-scan` + `wrangler dev` | Opsiyonel |
| CI güvenliği | zizmor, actionlint, OpenSSF Scorecard | Açık kaynak | Workflow taraması | Pratik öneri |
| SBOM | Syft, Trivy SBOM, CycloneDX-npm | Açık kaynak | — | Kapsam dışı (tez) |

**CodeQL:** Yalnızca OSI onaylı açık kaynak kodda, akademik araştırmada ve tanıtımda ücretsiz. Repo MIT lisanslı ve çalışma akademik, dolayısıyla uygun.

**Semgrep CE kısıtı:** Açık kaynak sürüm tek dosya/fonksiyon içi analiz yapıyor; dosyalar arası dataflow ücretli Pro'da. Opengrep bu fonksiyonlar arası taint analizini LGPL altında geri getiren topluluk fork'u. Makalede "Semgrep CE (intra-file)" açıkça yazılmalı; Opengrep'in eklenmesi kaçırmanın kuraldan mı motordan mı kaynaklandığını ayırt eder.

**Deney workflow'u** (`security-experiment.yml`): elle tetiklenir, `baseline | default | default+custom` konfigürasyonlarıyla koşar, her araç `results/` altına SARIF yazar, adım süreleri `timings.csv`'ye eklenir. Final deneyden önce action'lar commit SHA'ya, araçlar tam sürüme sabitlenir.

**Deploy hattı:** VS Code (yerel, opsiyonel ön kontrol) → GitHub Actions (asıl kapı) → Cloudflare. `deploy-backend` işi `needs: test-and-build` ile bağlı; Cloudflare panelindeki Git otomatik deploy açıksa bu kapıyı atlar, kapalı tutulmalı.

**Analiz araçları:** Python `pandas` + `sarif-tools` (SARIF okuma), `statsmodels` (McNemar), `scipy` (Mann-Whitney U).

## Deneyler ve analiz

Dört deney aynı korpus üzerinde koşar; tespit deterministik olduğu için tek koşum, süre ölçümü için 30 koşum yapılır.

| Deney | Soru | Yöntem | Ölçüt / test | Çıktı |
| --- | --- | --- | --- | --- |
| E1 | Araçlar genel olarak ne kadar iyi? | Korpus varsayılan ayarlarla 5+ araçtan geçer | TP/FP/FN, recall, precision, F1 | Tablo 1, araç×CWE kapsama ısı haritası |
| E2 (ana) | Veri başka kanaldan gelince kör mü oluyorlar? | İkiz çiftlerde HTTP vs event sonuçları | Kaynak tipine göre recall, McNemar, odds ratio | Tablo 2, kaçırma nedenleri taksonomisi |
| E3 | Platformu öğretirsek düzelir mi? | Dev sette özel Semgrep + Rego kuralları, held-out'ta ölçüm | ΔRecall, Δprecision, McNemar | Tablo 3, açık kaynak kural paketi |
| E4 | Bedeli ne kadar yavaşlık? | 3 konfigürasyon × 30 koşum | Medyan, IQR, overhead %, Mann-Whitney U, Cliff's delta | Şekil 2, süre boxplot'u |

**Metrikler**

```latex
Recall = \frac{TP}{TP + FN} \qquad Precision = \frac{TP}{TP + FP} \qquad F_1 = 2 \cdot \frac{Precision \cdot Recall}{Precision + Recall}
```

```latex
Overhead_{\%} = \frac{\tilde{T}_{config} - \tilde{T}_{baseline}}{\tilde{T}_{baseline}} \times 100
```

- **Recall:** gerçek açıkların yüzde kaçı bulundu. **Precision:** alarmların yüzde kaçı gerçek. **F1:** ikisinin dengeli ortalaması.
- **McNemar testi:** ikiz (eşleşmiş) ikili sonuçlarda farkın tesadüf olup olmadığını sınar. **Odds ratio:** farkın büyüklüğü ("web versiyonu 4 kat daha sık yakalanıyor").
- **Medyan ve IQR:** ortalama yerine; aykırı yavaş koşumlar ortalamayı bozar. **Mann-Whitney U:** iki süre dağılımı farklı mı. **Cliff's delta:** farkın pratik büyüklüğü.
- Süre formülünde T̃ medyan süredir.

**Kaçırma nedenleri taksonomisi (E2):** kaynak modellenmemiş · sink modellenmemiş · dataflow kopuyor · kural yok.

**Genellenebilirlik:** E1 ve E2 DVSA üzerinde tekrarlanır; kısa bir tablo yeterli.

**Önceki taslaklardan eleştiriler ve çözümleri**

- Kendi yazdığın vakaya kendi kuralını yazmak döngüsel → held-out + farklı yazar.
- Kapıların sabit sırayla eklenmesi ΔRecall'u sıraya bağımlı kılar → gerekirse leave-one-out analizi.
- ΔRecall / Overhead oranı sıfıra yakın paydada anlamsızlaşır → ana metrik değil, tamamlayıcı.

## Literatür ve boşluk

Üç literatür kolu var — DevSecOps, serverless güvenliği ve SAST değerlendirmeleri — ve hiçbiri aynı açığın HTTP ile event kaynağı arasında tespit farkını kontrollü ikiz tasarımla ölçmüyor; boşluk budur.

**1. DevSecOps incelemeleri: ampirik doğrulama eksik**

| Çalışma | Yıl | Bulgusu | Bizimle ilişkisi |
| --- | --- | --- | --- |
| [Rajapakse ve ark., IST](https://arxiv.org/abs/2103.08266) | 2022 | 54 çalışma; 21 zorluk, 31 çözüm; geliştirici odaklı güvenlik test araçlarına ihtiyaç | Klasik referans, SAST/DAST sınırları |
| [Evolution of DevSecOps SLR, MDPI Technologies](https://www.mdpi.com/2227-7080/13/12/548) | 2025 | 2012–2025; çalışmalar çoğunlukla teorik, ampirik doğrulama ve standart metrik eksik | Motivasyon: ampirik katkı |
| [DevSecOps in Practice SLR (UEL)](https://uel-repository.worktribe.com/output/490095/devsecops-in-practice-a-systematic-review-of-challenges-best-practices-and-tools) | 2026 | 15 çalışma; 24 zorluk, 21 pratik, 13 araç; ampirik doğrulama yetersiz | Aynı boşluk |

**2. Serverless güvenliği: event injection biliniyor ama ölçülmemiş**

| Çalışma | Yıl | Bulgusu | Bizimle ilişkisi |
| --- | --- | --- | --- |
| [FaaSGuard (Barrak ve ark.)](https://arxiv.org/pdf/2509.04328) | 2025 | OpenFaaS için uçtan uca DevSecOps hattı; 20 Python reposunda P 0.95, R 0.91 | **En yakın çalışma.** Fark: onlar hattı öneriyor, biz araçların kaynak tipine göre kör noktasını kontrollü ölçüyoruz; onlar Python/OpenFaaS, biz JS/TS + Workers/Lambda; onlarda ground truth alarm etiketlemesi, bizde enjekte ikizler |
| [Marin ve ark., "Serverless computing: a security perspective"](https://arxiv.org/pdf/2107.03832) | 2022 | Serverless tehdit sınıflandırması; event injection | Tehdit modeli |
| [Securing Serverless Computing (survey)](https://arxiv.org/pdf/2105.12581) | 2021 | Çoklu tetikleyici = çoklu giriş noktası; statik analiz uygulanabilir ama sınırlı bilgi | Hipotezin dayanağı |
| [SecLambda](https://arxiv.org/pdf/2011.05322) | 2020 | Çalışma zamanı koruması, flow injection | Runtime tarafı, kapsam dışı |
| [ALPS](https://arxiv.org/pdf/2603.25393) | 2026 | LLM + AST ile en az yetki çıkarımı; Kalium (USENIX Sec '23), GRASP (WWW '24), Growlithe (S&P '25) atıfları | İlgili statik analiz hattı |
| [Jeremy Daly, Event Injection](https://www.jeremydaly.com/event-injection-protecting-your-serverless-applications/) | 2018 | S3 dosya adı gibi "iç" görünen girdiler güvenilmez; Lambda'yı tetikleyebilen 47 olay kaynağı | Motivasyon örneği (gri literatür) |
| [OWASP DVSA](https://github.com/OWASP/DVSA) · OWASP Serverless Top 10 | 2018– | Kasıtlı açıklı serverless uygulama; event injection ilk sırada | İkinci testbed, sınıflandırma |

**3. SAST değerlendirmeleri: araçların recall'u genel olarak düşük**

| Çalışma | Yıl | Bulgusu | Bizimle ilişkisi |
| --- | --- | --- | --- |
| [Semgrep\* (EASE)](https://dl.acm.org/doi/10.1145/3661167.3661262) | 2024 | Tek araç tespit oranı %11.2–26.5, dört araç birlikte %38.8; kaçırma nedenleri incelenmiş | Metodoloji emsali, beklenti düzeyi |
| Brito ve ark., Study of JavaScript Static Analysis Tools for Node.js Packages (IEEE Trans. Reliability) | 2023 | JS/Node.js SAST karşılaştırması | Dil emsali; tam metni okunmalı |
| Li ve ark., Comparison and Evaluation of SAST Tools for Java (ESEC/FSE) | 2023 | Java SAST karşılaştırması | Değerlendirme yöntemi |
| [SAST vs LLM, repo düzeyi](https://arxiv.org/pdf/2407.16235) | 2024 | SAST ve LLM karşılaştırması | İleri çalışma bağlantısı |

**Boşluk:** (1) DevSecOps literatürü ampirik doğrulama eksikliğini tekrar tekrar vurguluyor. (2) Serverless literatürü event injection'ı tehdit olarak tanımlıyor ama hazır araçların bunu ne ölçüde kaçırdığını ölçmüyor. (3) SAST değerlendirmeleri klasik web/HTTP kaynaklarına odaklı. Bu makale üçünün kesişiminde, kontrollü ikiz korpusla bu farkı ölçen ilk çalışma olmayı hedefliyor.

**Tam metni okunacaklar:**

- [ ] FaaSGuard — farkı Related Work'te iki cümleyle net yaz
- [ ] Brito ve ark. 2023 — JS SAST sonuçları
- [ ] Semgrep\* 2024 — kaçırma nedenleri sınıflandırması (bizim taksonomiye temel)
- [ ] Ni ve ark. 2024, "Toward security quantification of serverless computing" (J. Cloud Computing)
- [ ] Wen ve ark. 2023, serverless SLR (TOSEM)

## Bağlantılı alanlar ve gelecek çalışmalar

Bu makalenin korpusu ve CI altyapısı, sonraki yayınlar ve tez için yeniden kullanılabilir bir testbed olur.

| Alan | Soru | Nasıl bağlanır | Ne zaman |
| --- | --- | --- | --- |
| Bundle-aware SCA | Tree-shaking sonrası açıklı npm fonksiyonu bundle'da kalıyor mu? SCA alarmları şişiyor mu? | npm teziyle doğrudan köprü; aynı Workers projeleri | Sonraki makale (en güçlü aday) |
| AI kodlama ajanları | Ajanların ürettiği açıkları aynı kapılar yakalıyor mu? | Aynı korpus + pipeline, insan kodu yerine ajan kodu | İkinci makale adayı |
| Konfigürasyon mining | GitHub'daki `wrangler.toml`, `serverless.yml`, SAM şablonlarında hata yaygınlığı | E3'teki Rego politikaları ölçüm aracına dönüşür | Paralel, hızlı yayın |
| GitHub Actions / agentic workflow güvenliği | `pull_request_target`, pinlenmemiş action, AI-assisted action enjeksiyonu | zizmor ve Scorecard bulguları | Sonraki çalışma |
| Developer PaaS (Vercel, Netlify, Render) | Platform soyutlaması güvenlik kapılarını atlatıyor mu (preview deploy, otomatik build)? | Cloudflare Git otomatik deploy bulgusu | Tez bölümü |
| SBOM / SLSA / imzalama | Güvence kontrolleri | Tespit kontrollerinden ayrı başarı ölçütü | Tez bölümü |
| Kimlik: statik token vs OIDC, PPE | Pipeline ele geçirilirse token sızıntısı | Önceki geniş taslaktaki Deney B | Tez / ayrı çalışma |
| Runtime: API Shield, WAF, Zero Trust | Mantıksal açıklar uçta durur mu? | Önceki geniş taslaktaki Deney C | Kapsam dışı |

Açık kalan ölçüm fikri: IAM aşırı yetkisi (fonksiyon başına verilen yetki vs koddaki gerçek ihtiyaç) — AWS/SAM tarafında ayrı bir mining çalışması olabilir.

## Hedef dergiler ve yayın stratejisi

İlk tercih Software: Practice and Experience (abonelik modeliyle ücretsiz, konuya en uygun), güvenli yedek TÜBİTAK Turk J Elec Eng & Comp Sci (APC yok).

| Dergi | İndeks | Ücretsiz model | Uygunluk | Not |
| --- | --- | --- | --- | --- |
| Software: Practice and Experience (Wiley) | SCI-E | Abonelik (subscription) seçeneği | Çok yüksek — pratik, ampirik, araç odaklı | İlk tercih |
| Software Quality Journal (Springer) | SCI-E | Abonelik seçeneği | Yüksek | Alternatif |
| [Turk J Elec Eng & Comp Sci](https://journals.tubitak.gov.tr/elektrik/about.html) (TÜBİTAK) | SCI-E, TR Dizin | Tamamen açık erişim, yazar ücreti yok | Orta-yüksek | Güvenli yedek; süreç uzun olabilir |
| Gazi Üniv. Bilişim Teknolojileri Dergisi | TR Dizin | APC yok | Orta | Hızlı yerli seçenek |
| Journal of Systems and Software (Elsevier) | SCI-E Q1 | Abonelik seçeneği | Yüksek ama rekabetçi | 6–8 sayfa kısa kalır; ilk hedef değil |

Dergilerin güncel indeks durumu, sayfa sınırı ve APC politikası gönderimden önce kendi sitelerinden kontrol edilmeli; tablodaki karar süreleri önceki taslaklarda iyimserdi.

**Gönderim kuralları**

- Birinci yazar Yusuf, adres Karabük Üniversitesi (mezuniyet şartı).
- Gönderim günü arXiv (cs.CR veya cs.SE) preprint; ilk gönderimde endorsement gerekebilir, dergi preprint politikası kontrol edilmeli.
- Kod, korpus ve kural paketi GitHub + Zenodo DOI ile açık (replication package) — hakem güveni için önemli.
- Hibrit dergilerde kabul sonrası açık erişim değil, abonelik seçeneği işaretlenir.

## Makale iskeleti, geçerlilik ve plan

Makale IMRaD yapısında 8–12 sayfa hedefliyor; iş planı yaklaşık 12–14 hafta.

**İskelet**

1. **Introduction** — Serverless'ta çoklu tetikleyici; event injection; motivasyon örneği (Semgrep `auto` açıkları geçirdi); RQ1–RQ4; katkılar.
2. **Background & Related Work** — DevSecOps SLR'leri, serverless tehditleri, SAST değerlendirmeleri, FaaSGuard ile fark.
3. **Methodology** — Testbed'ler, ikiz korpus, ground truth, puanlama kuralı, araçlar ve sürümleri, CI kurulumu, istatistik.
4. **Results** — E1 (Tablo 1, kapsama ısı haritası), E2 (Tablo 2, kaçırma taksonomisi), E3 (Tablo 3), E4 (boxplot), DVSA tekrarı.
5. **Discussion** — Kaynağı mı sink'i mi tanımıyor; motor mu kural mı (Semgrep CE vs Opengrep); pratik öneriler (event kaynakları için kural paketi, PR ve nightly ayrımı).
6. **Threats to Validity** — aşağıda.
7. **Conclusion** + replication package.

**Geçerlilik tehditleri**

| Tür | Tehdit | Hafifletme |
| --- | --- | --- |
| İç | Vakaları ve kuralları aynı kişi yazıyor | Held-out ayrımı, farklı yazar, organik vakalar |
| İç | Araç sürümleri ve kural setleri değişir | Tüm araçlar ve action'lar sabitlenir, sürümler raporlanır |
| Yapı | Puanlama kuralı (±3 satır, CWE ailesi) keyfi görünebilir | Kural önceden tanımlanır, alternatif eşikle duyarlılık analizi |
| Dış | Tek, kendi yazdığın uygulama | DVSA + açık kaynak Workers projeleri |
| Dış | Yalnızca JS/TS | Kapsam açıkça belirtilir |
| Sonuç | Korpus küçük, McNemar gücü sınırlı | Etki büyüklüğü ve güven aralığı raporlanır |
| Ölçüm | GitHub runner süre değişkenliği | 30 koşum, medyan/IQR, parametrik olmayan test |

**Zaman planı**

1. Hafta 1–3: Korpus (C002–C006, negatifler, held-out vakalar), `ground_truth.csv`.
2. Hafta 4–5: Deney workflow'u, SARIF parser, puanlama script'i; araç sürümlerini sabitleme.
3. Hafta 6: E1 ve E2 koşumları; DVSA tekrarı.
4. Hafta 7–8: Özel Semgrep + Rego kuralları (dev set), E3 ölçümü (held-out); E4 30'ar koşum.
5. Hafta 9: İstatistik analiz, tablo ve şekiller.
6. Hafta 10–12: Yazım (Method + Results önce, sonra Intro, Related Work, Discussion).
7. Hafta 13–14: Danışman okuması, dil kontrolü, arXiv + dergi gönderimi.

**Sıradaki adımlar**

- [ ] C002–C004 ikiz vakalarını yaz
- [ ] Held-out vakalar için ikinci yazar bul
- [ ] Cloudflare panelinde Git otomatik deploy'un kapalı olduğunu doğrula
- [ ] FaaSGuard ve Semgrep\* tam metinlerini oku
- [ ] Hedef dergiyi Ömer Faruk Hoca ile netleştir

**Hazır dosyalar (sohbette üretildi):** `security-corpus/` iskeleti (C001 ikizleri, `ground_truth.csv`, README), `security-experiment.yml` deney workflow'u.
