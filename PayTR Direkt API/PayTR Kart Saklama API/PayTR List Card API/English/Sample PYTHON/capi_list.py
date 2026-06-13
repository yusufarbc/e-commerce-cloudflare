# Python 3.6+


import base64
import hmac
import hashlib
import requests
import json


merchant_id = 'XXXXXX'
merchant_key = b'YYYYYYYYYYYYYY'
merchant_salt = 'ZZZZZZZZZZZZZZ'


utoken = ''


hash_str = utoken + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'utoken': utoken,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/odeme/capi/list', params)
res = json.loads(result.text)

print(res)

