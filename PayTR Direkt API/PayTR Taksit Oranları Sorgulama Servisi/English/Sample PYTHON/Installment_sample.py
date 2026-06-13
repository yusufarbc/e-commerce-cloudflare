# Python 3.6+

import base64
import hmac
import hashlib
import requests
import json
import time


merchant_id = 'XXX'
merchant_key = b'XXX'
merchant_salt = 'XXX'


request_id = str(time.time())


hash_str = merchant_id + request_id + merchant_salt
paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode(), hashlib.sha256).digest())

params = {
    'merchant_id': merchant_id,
    'request_id': request_id,
    'paytr_token': paytr_token
}

result = requests.post('https://www.paytr.com/odeme/taksit-oranlari', params)
res = json.loads(result.text)

if res['status'] == 'success':

    print(res)
else:
    """
    Örn.
    ['status']        - error
    ['err_no']        - 006
    ['err_msg']       - Zorunlu alan degeri gecersiz veya gonderilmedi: 
    """
    print(res)