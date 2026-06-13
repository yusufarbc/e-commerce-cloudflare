# Python 3.6+


import base64
import hmac
import hashlib
import requests
import json


merchant_id = 'XXX'
merchant_key = 'XXX'
merchant_salt = 'XXX'


bin_number = 'XXXXXX'


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
