# Organik vakalar (held-out)

Bu dosyalar demo uygulamanın düzeltme öncesi hâlinin birebir kopyasıdır.
Kaynak: `research/organic-snapshot-v1` etiketi (commit `0bdb302`).
Uygulamadaki açıklar bu snapshot alındıktan sonra düzeltildi; buradaki kopyalar
yalnızca statik analiz içindir, deploy edilmez ve import edilen modüller
bilerek dahil edilmemiştir.

| Vaka | CWE | Dosya | Açıklama |
|---|---|---|---|
| O001 | CWE-798 | `snapshot/wrangler.toml` | `[vars]` ve `[env.staging.vars]` içinde düz metin `ADMIN_JWT_SECRET` |
| O002 | CWE-798 | `snapshot/config.js` | Aynı JWT sırrı kodda varsayılan değer olarak |
| O003 | CWE-942 | `snapshot/app.js` | CORS gelen origin'i yansıtıyor ve `credentials: true` |
| O004 | CWE-306 | `snapshot/app.js` | Kimlik doğrulamasız `/api/v1/debug-db` (tablo dökümü + stack trace) |
| O005 | CWE-798 | `snapshot/app.js` | Admin girişinde varsayılan şifre `admin12345` |

Korpus dışında kalan organik bulgu: repoya commit edilmiş `api/prisma/dev.db`
(ikili dosya; etiketten erişilebilir, SAST puanlamasına alınmaz).

İkinci satır eşleşmeleri: O001 için satır 74 (staging), O002 için satır 39 da
aynı vakanın geçerli konumlarıdır; puanlamada bunlardan herhangi biri TP sayılır.
