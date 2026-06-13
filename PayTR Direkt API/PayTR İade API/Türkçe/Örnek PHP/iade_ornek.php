<?php

    ####################### DÜZENLEMESİ ZORUNLU ALANLAR #######################
    #
    ## API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
    $merchant_id 	= "XXXXXX";
    $merchant_key 	= "YYYYYYYYYYYYYY";
    $merchant_salt	= "ZZZZZZZZZZZZZZ";
    #
    # Sipariş No: İade etmek istediğiniz siparişin numarası.
    $merchant_oid   = "XXXXXX";
    #
    # İade Tutarı: Örneğin işlem 11.97 TL veya 11.97 USD ise.
    $return_amount  = "11.97";
    #
    # Referans Numarası: En fazla 64 karakter, alfa numerik. Zorunlu değil.
    $reference_no  = "XXXXXX11111";
    #
    ####### Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur. #######
    $paytr_token=base64_encode(hash_hmac('sha256',$merchant_id.$merchant_oid.$return_amount.$merchant_salt,$merchant_key,true));

    $post_vals=array('merchant_id'=>$merchant_id,
        'merchant_oid'=>$merchant_oid,
        'return_amount'=>$return_amount,
        //'reference_no' => $reference_no,
        'paytr_token'=>$paytr_token);

    $ch=curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/iade");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1) ;
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 90);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);

    //XXX: DİKKAT: lokal makinanızda "SSL certificate problem: unable to get local issuer certificate" uyarısı alırsanız eğer
    //aşağıdaki kodu açıp deneyebilirsiniz. ANCAK, güvenlik nedeniyle sunucunuzda (gerçek ortamınızda) bu kodun kapalı kalması çok önemlidir!
    //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

    $result = @curl_exec($ch);

    if(curl_errno($ch))
    {
        echo curl_error($ch);
        curl_close($ch);
        exit;
    }

    curl_close($ch);

    $result=json_decode($result,1);

    /*
        $result değeri içerisinde;

        [status]        - İade talebi başarılı ise success döner.
        [is_test]       - İade talebi test işlem içinse 1 döner.
        [merchant_oid]  - İade talebi yapılan sipariş numarası.
        [return_amount] - İade talebi yapılan tutar.

        bilgileri dönmektedir.
    */

    if($result[status]=='success')
    {
        // VT işlemleri vs.
    }
    else
    {
        //Örn. $result -> array('status'=>'error', "err_no"=>"006", "err_msg"=>"Toplam iade tutarı odeme tutarindan fazla olamaz")
        echo $result[err_no]." - ".$result[err_msg];
    }