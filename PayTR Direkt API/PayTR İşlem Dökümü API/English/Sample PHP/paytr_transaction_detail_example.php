<?php

    $merchant_id    = 'XXXXXX';
    $merchant_key   = 'XXXXXXYYYYYY';
    $merchant_salt  = 'YYYYYYXXXXXX';
    #
    $start_date = "2020-06-02 00:00:00";
    $end_date = "2020-06-04 23:59:59";
    #
    ############################################################################################
    #
    $paytr_token = base64_encode(hash_hmac('sha256', $merchant_id . $start_date . $end_date . $merchant_salt, $merchant_key, true));

    $post_vals = array('merchant_id' => $merchant_id,
        'start_date' => $start_date,
        'end_date' => $end_date,
        'paytr_token' => $paytr_token
    );
    #
    ############################################################################################

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/rapor/islem-dokumu");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 90);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);
    
    // XXX: ATTENTION: if you get "SSL certificate problem: unable to get local issuer certificate" on your local machine,
    // you can open the code below and try it. BUT, it is very important that this code remains off on your server (in your real environment) for security reasons!
    // curl_setopt ($ ch, CURLOPT_SSL_VERIFYPEER, 0);

    $result = @curl_exec($ch);

    if (curl_errno($ch)) {
        echo curl_error($ch);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    $result = json_decode($result, 1);

    if ($result[status] == 'success')
    {
        print_r($result);
    }
    elseif ($result[status] == 'failed')
    {
        echo "No transaction was found in date duration";
    }
    else
    {
        echo $result[err_no] . " - " . $result[err_msg];
    }