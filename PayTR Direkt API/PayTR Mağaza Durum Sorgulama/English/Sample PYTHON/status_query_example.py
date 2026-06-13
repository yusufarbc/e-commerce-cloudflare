# Python 3.6+

import base64
import hmac
import hashlib
import requests
import json
import random


merchant_id = 'XXXXXX'
merchant_key = b'XXXXXXXXXXXXXXXXXX'
merchant_salt = 'XXXXXXXXXXXXXXXXXX'
merchant_oid = ''





hash_str = merchant_id + merchant_oid + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'merchant_oid': merchant_oid,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/odeme/durum-sorgu', params)
res = json.loads(result.text)

if res['status'] == 'success':
    print(res['payment_amount'] + res['currency'])
    print(res['payment_total'] + res['currency'])

    for return_success in res['returns']:
      print(return_success)

else:
    print(res['err_no'] + ' ' + res['err_msg'])
    
    