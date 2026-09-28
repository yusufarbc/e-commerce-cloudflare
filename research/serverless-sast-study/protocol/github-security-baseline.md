# GitHub Güvenlik Başlangıç Durumu

Kontrol tarihi: 2026-09-28

Depo: `yusufarbc/e-commerce-cloudflare`

Ana dal: `main`

Bu kayıt, makale çalışmasının başlangıcında GitHub Security sekmesinde görünen
açık uyarıları belgeler. Veriler `gh` CLI ile GitHub API üzerinden salt okunur
olarak alınmıştır.

## Özet

| Kaynak | Açık uyarı |
|---|---:|
| Dependabot | 24 |
| Code scanning | 0 |
| Secret scanning | 0 |

Dependabot önem dağılımı:

| Önem | Sayı |
|---|---:|
| High | 16 |
| Medium | 7 |
| Low | 1 |

Manifest dağılımı:

| Manifest | Sayı |
|---|---:|
| `api/package-lock.json` | 13 |
| `client/package-lock.json` | 9 |
| `admin/package-lock.json` | 2 |

## Öncelikli gözlemler

- `api/package-lock.json` içinde runtime ve transitive olan
  `@xmldom/xmldom` paketi sekiz ayrı high uyarıyla en önemli kümeyi
  oluşturuyor. Uyarılara göre giderilmiş sürüm advisory'ye bağlı olarak
  `0.8.14` veya `0.8.15`.
- `client/package-lock.json` içindeki doğrudan development bağımlılığı `sharp`
  için high uyarı var; bildirilen giderilmiş sürüm `0.35.4`.
- Diğer high development/transitive kümeleri `browserslist`, `fast-uri` ve
  `js-yaml` paketlerinde.
- Açık CodeQL veya secret-scanning uyarısı bulunmaması, Dependabot bulgularının
  giderildiği anlamına gelmez; üç tarama kanalı ayrı güvenlik sınıflarını ölçer.

## Yeniden üretim

```powershell
gh repo view --json nameWithOwner,url,defaultBranchRef
gh api --paginate --slurp 'repos/yusufarbc/e-commerce-cloudflare/dependabot/alerts?state=open&per_page=100'
gh api --paginate --slurp 'repos/yusufarbc/e-commerce-cloudflare/code-scanning/alerts?state=open&per_page=100'
gh api --paginate --slurp 'repos/yusufarbc/e-commerce-cloudflare/secret-scanning/alerts?state=open&per_page=100'
```

Bu dosya bir güvenlik düzeltmesi değildir. Uyarıların erişilebilir kod yolunda
olup olmadığı ve yükseltmelerin uyumluluğu ayrı olarak doğrulanmalıdır.
