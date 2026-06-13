# Python 3.6+
# İşlem dökümü servisi için kullanılacak örnek kod

import base64
import hmac
import hashlib
import requests
import json

# API Entegrasyon Bilgilier - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
merchant_id = 'XXXXXX'
merchant_key = b'XXXXXX'
merchant_salt = 'XXXXXX'

# Başlangıç / Bitiş tarihi. En fazla 3 gün aralık tanımlanabilir.
start_date = '2021-02-02 00:00:00'
end_date = '2021-02-04 23:59:59'

# Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur.
hash_str = merchant_id + start_date + end_date + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'start_date': start_date,
    'end_date': end_date,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/rapor/islem-dokumu', params)
res = json.loads(result.text)

if res['status'] == 'success':
    print(result.text)
elif res['status'] == 'failed':
    print('ilgili tarih araliginda islem bulunamadi')
else:
    print('PAYTR BIN detail request error. Error: ' + res['err_msg'])
    