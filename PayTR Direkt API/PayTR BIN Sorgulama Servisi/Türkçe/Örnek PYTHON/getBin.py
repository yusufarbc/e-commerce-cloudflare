# Python 3.6+
# BIN sorgulama servisi için kullanılacak örnek kod

import base64
import hmac
import hashlib
import requests
import json

# API Entegrasyon Bilgilier - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
merchant_id = 'XXX'
merchant_key = 'XXX'
merchant_salt = 'XXX'

# Sorgulama yapılmak istenen karta ait kart numarasının ilk 6 veya 8 hanesi. Maksimum doğrulama için 8 hane kullanın.
bin_number = 'XXXXXX'

# Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur.
hash_str = bin_number + merchant_id + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'bin_number': bin_number,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/odeme/api/bin-detail', params)
res = json.loads(result.text)

if res['status'] == 'error':
    print('PAYTR BIN detail request error. Error: ' + res['err_msg'])
elif res['status'] == 'failed':
    print('BIN tanımlı değil. (Örneğin bir yurtdışı kartı)')
else:
    print(result.text)
