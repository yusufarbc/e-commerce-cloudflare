# Python 3.6+


import base64
import hmac
import hashlib
import requests
import json


merchant_id = 'XXXXXX'
merchant_key = b'XXXXXX'
merchant_salt = 'XXXXXX'


start_date = '2021-02-02 00:00:00'
end_date = '2021-02-04 23:59:59'


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
    print('No transaction found in the relevant date range')
else:
    print('PAYTR BIN detail request error. Error: ' + res['err_msg'])
    