<?php

    $merchant_id 	= "XXXXXX";
    $merchant_key 	= "YYYYYYYYYYYYYY";
    $merchant_salt	= "ZZZZZZZZZZZZZZ";
    #
    $merchant_oid   = "XXXXXX";
    #
    $return_amount  = "11.97";
    #
    $reference_no  = "XXXXXX11111"; // Not required
    #
    ##############################################################
    $paytr_token = base64_encode(hash_hmac('sha256', $merchant_id . $merchant_oid . $return_amount . $merchant_salt, $merchant_key, true));

    $post_vals = array('merchant_id' => $merchant_id,
        'merchant_oid' => $merchant_oid,
        'return_amount' => $return_amount,
        //'reference_no' => "XXXXXX",
        'paytr_token' => $paytr_token);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/iade");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 90);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);

    ## ATTENTION: If you get "SSL certificate problem: unable to get local issuer certificate" warning on your local machine
    ## you can open the code below and try it. BUT, for security reasons it is very important to keep this code off on your server (in your real environment)!
    ## curl_setopt ($ ch, CURLOPT_SSL_VERIFYPEER, 0);

    $result = @curl_exec($ch);

    if (curl_errno($ch)) {
        echo curl_error($ch);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    $result = json_decode($result, 1);

    /*
        $result - return response content example;

        [status] - If the return request is successful, success returns.
        [is_test] - Returns 1 if the return request is for testing.
        [merchant_oid] - Order number for which a return request was made.
        [return_amount] - Amount made for a refund.
    */

    if ($result[status] == 'success') {
        // DB operations
    } else {
        // Example: $result -> array('status'=>'error', "err_no"=>"006", "err_msg"=>"Toplam iade tutarı odeme tutarindan fazla olamaz")
        echo $result[err_no] . " - " . $result[err_msg];
    }