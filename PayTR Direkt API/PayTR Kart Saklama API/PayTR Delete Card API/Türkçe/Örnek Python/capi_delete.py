# Python 3.6+
# Kart silmek için örnek kodlar

import base64
import hmac
import hashlib
import requests
import json

# API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
merchant_id = 'XXXXXX'
merchant_key = b'YYYYYYYYYYYYYY'
merchant_salt = 'ZZZZZZZZZZZZZZ'

# Kart kayıt sonrası ödeme bildiriminde tarafınıza PAYTR sisteminden bildirilen kullanıcıya özel token
utoken = ''

# Kullanıcının kayıtlı kartını tanımlayan token (Kullanıcı kayıtlı kart listesini alma sonucunda dönen yanıtta bulunur)
ctoken = ''

# Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur.
hash_str = ctoken + utoken + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'ctoken': ctoken,
    'utoken': utoken,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/odeme/capi/delete', params)
res = json.loads(result.text)

print(res)

# if res['status'] == 'success':
#     print('Kart silindi!')
# else:
#     print('PAYTR CAPI Delete failed. Error:' + res['err_msg'])
