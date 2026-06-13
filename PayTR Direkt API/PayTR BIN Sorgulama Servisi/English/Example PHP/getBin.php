<?php

	$merchant_id 	= 'XXXXXX';
	$merchant_key 	= 'XXXXXX';
	$merchant_salt	= 'XXXXXX';
	#
	$bin_number	= "";
	#
	############################################################################################
	#
	$hash_str = $bin_number . $merchant_id . $merchant_salt;
	$paytr_token=base64_encode(hash_hmac('sha256', $hash_str, $merchant_key, true));
	$post_vals=array(
		'merchant_id'=>$merchant_id,
		'bin_number'=>$bin_number,
		'paytr_token'=>$paytr_token
	);
	############################################################################################

	$ch=curl_init();
	curl_setopt($ch, CURLOPT_URL, "https://www.paytr.com/odeme/api/bin-detail");
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1) ;
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post_vals);
	curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
	curl_setopt($ch, CURLOPT_TIMEOUT, 20);

	$result = @curl_exec($ch);

	if(curl_errno($ch))
		die("PAYTR BIN detail request timeout. err:".curl_error($ch));

	curl_close($ch);
	
	$result=json_decode($result,1);
		
	if($result['status']=='error')
		die("PAYTR BIN detail request error. Error:".$result['err_msg']);
	elseif($result['status']=='failed')
		die("BIN is not defined. (For example, a foreign card)");
	else
		print_r($result);