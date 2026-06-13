<?php
    $merchant_id='XXXXXX';
    $merchant_key='YYYYYYYYYYYYYY';
    $merchant_salt='ZZZZZZZZZZZZZZ';
    $request_id=time();

    $paytr_token=base64_encode(hash_hmac('sha256',$merchant_id.$request_id.$merchant_salt,$merchant_key,true));

    $post_vals=array(
        'merchant_id'=>$merchant_id,
        'request_id'=>$request_id,
        'paytr_token'=>$paytr_token
    );

    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/taksit-oranlari");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1) ;
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 90);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);

    // XXX: ATTENTION: if you get "SSL certificate problem: unable to get local issuer certificate" on your local machine,
    // you can open the code below and try it. BUT, it is very important that this code remains off on your server (in your real environment) for security reasons!
    // curl_setopt ($ ch, CURLOPT_SSL_VERIFYPEER, 0);

    $result = @curl_exec($ch);

    if(curl_errno($ch))
    {
        echo curl_error($ch);
        curl_close($ch);
        exit;
    }

    curl_close($ch);
    $result=json_decode($result,1);

    if($result[status]=='success')
    {
        
        print_r($result);
    }
    else 
    {
        echo $result[err_msg];
    }