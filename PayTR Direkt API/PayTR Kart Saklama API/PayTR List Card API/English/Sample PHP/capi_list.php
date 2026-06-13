<?php
$merchant_id = 'MERCHANT_ID';
$merchant_key = 'XXXXXXXXXXX';
$merchant_salt = 'YYYYYYYYYYY';
#
## User-specific token notified to you by PAYTR system in post-payment payment notification.
$utoken = "";
#
############################################################################################
$hash_str = $utoken . $merchant_salt;
$paytr_token = base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));
$post_vals = array(
    'merchant_id' => $merchant_id,
    'utoken' => $utoken,
    'paytr_token' => $paytr_token
);
############################################################################################

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/capi/list");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

## ATTENTION: If you get "SSL certificate problem: unable to get local issuer certificate" warning on your local machine
## you can open the code below and try it. BUT, for security reasons it is very important to keep this code off on your server (in your real environment)!
## curl_setopt ($ ch, CURLOPT_SSL_VERIFYPEER, 0);

$result = @curl_exec($ch);

if (curl_errno($ch))
    die("PAYTR CAPI List connection error. err:" . curl_error($ch));

curl_close($ch);

$result = json_decode($result, 1);

if ($result['status'] == 'error')
    die("PAYTR CAPI list failed. Error:" . $result['err_msg']);
else
    print_r($result);