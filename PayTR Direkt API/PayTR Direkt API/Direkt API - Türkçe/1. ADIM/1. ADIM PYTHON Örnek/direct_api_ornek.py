# Python 3.6+
# Django Web Framework referans alınarak hazırlanmıştır
# Tek başına bir bütün değildir, home.html ile birlikte çalışmaktadır.
# card_type, installment_count gibi kullanıcıya bağlı bilgiler alındıktan sonra paytr_token oluşturulması gerekmektedir.

import base64
import hashlib
import hmac
import html
import json
import random

from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt


def home(request):
    merchant_id = 'MAGAZA_NO'
    merchant_key = b'XXXXXXXXXXX'
    merchant_salt = b'YYYYYYYYYYY'

    merchant_ok_url = 'http://site-ismi/basarili'
    merchant_fail_url = 'http://site-ismi/basarisiz'

    user_basket = html.unescape(json.dumps([['Altis Renkli Deniz Yatağı - Mavi', '18.00', 1],
                                            ['Pharmaso Güneş Kremi 50+ Yetişkin & Bepanthol Cilt Bakım Kremi', '33,25',
                                             2],
                                            ['Bestway Çocuklar İçin Plaj Seti Beach Set ÇANTADA DENİZ TOPU-BOT-KOLLUK',
                                             '45,42', 1]]))

    merchant_oid = 'OS' + random.randint(1, 9999999).__str__()
    test_mode = '0'
    debug_on = '1'

    # 3d'siz işlem
    non_3d = '0'

    # Ödeme süreci dil seçeneği tr veya en
    client_lang = 'tr'

    # non3d işlemde, başarısız işlemi test etmek için 1 gönderilir (test_mode ve non_3d değerleri 1 ise dikkate alınır!)
    non3d_test_failed = '0'
    user_ip = ''
    email = 'testnon3d@paytr.com'

    # 100.99 TL ödeme
    payment_amount = "100.99"
    currency = 'TL'
    payment_type = 'card'

    user_name = 'Paytr Test'
    user_address = 'test test test'
    user_phone = '05555555555'

    # Alabileceği değerler; advantage, axess, combo, bonus, cardfinans, maximum, paraf, world
    card_type = 'bonus'
    installment_count = '5'

    hash_str = merchant_id + user_ip + merchant_oid + email + payment_amount + payment_type + installment_count + currency + test_mode + non_3d
    paytr_token = base64.b64encode(hmac.new(merchant_key, hash_str.encode() + merchant_salt, hashlib.sha256).digest())

    context = {
        'merchant_id': merchant_id,
        'user_ip': user_ip,
        'merchant_oid': merchant_oid,
        'email': email,
        'payment_type': payment_type,
        'payment_amount': payment_amount,
        'currency': currency,
        'test_mode': test_mode,
        'non_3d': non_3d,
        'merchant_ok_url': merchant_ok_url,
        'merchant_fail_url': merchant_fail_url,
        'user_name': user_name,
        'user_address': user_address,
        'user_phone': user_phone,
        'user_basket': user_basket,
        'debug_on': debug_on,
        'client_lang': client_lang,
        'paytr_token': paytr_token.decode(),
        'non3d_test_failed': non3d_test_failed,
        'installment_count': installment_count,
        'card_type': card_type
    }

    return render(request, 'home.html', context)