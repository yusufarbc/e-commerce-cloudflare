<?php

	## utoken ile kayıtlı kartların listesi alındığında 1nci adım dokümanında ki zorunlu alanları tamamlayamıyoruz.
	## Kayıtlı bir kart ile ödeme işlemini tamamlama adımını tarif edebilir misiniz?

	## Kullanıcı kart listesi için örnek kodlar ##

	####################### DÜZENLEMESİ ZORUNLU ALANLAR #######################
	#
	## API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.
	$merchant_id 	= 'XXXXXX';
	$merchant_key 	= 'YYYYYYYYYYYYYY';
	$merchant_salt	= 'ZZZZZZZZZZZZZZ';
	#
	## Kart kayıt sonrası ödeme bildiriminde tarafınıza PAYTR sisteminden bildirilen kullanıcıya özel token
	$utoken	= "";
	#
	############################################################################################

	####### Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur. #######
	$hash_str = $utoken . $merchant_salt;
	$paytr_token=base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));
	$post_vals=array(
		'merchant_id'=>$merchant_id,
		'utoken'=>$utoken,
		'paytr_token'=>$paytr_token
	);
	############################################################################################

	$ch=curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/capi/list");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1) ;
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
	curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
	curl_setopt($ch, CURLOPT_TIMEOUT, 20);

	//XXX: DİKKAT: lokal makinanızda "SSL certificate problem: unable to get local issuer certificate" uyarısı alırsanız eğer
	//aşağıdaki kodu açıp deneyebilirsiniz. ANCAK, güvenlik nedeniyle sunucunuzda (gerçek ortamınızda) bu kodun kapalı kalması çok önemlidir!
	//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);

	$result = @curl_exec($ch);

	if(curl_errno($ch))
		die("PAYTR CAPI List connection error. err:".curl_error($ch));

	curl_close($ch);
	
	$result=json_decode($result,1);
		
	if($result['status']=='error')
		die("PAYTR CAPI list failed. Error:".$result['err_msg']);
	else
		print_r($result);

?>
