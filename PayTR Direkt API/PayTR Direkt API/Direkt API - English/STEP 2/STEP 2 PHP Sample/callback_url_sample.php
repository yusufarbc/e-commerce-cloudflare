<?php

	$post = $_POST;

	$merchant_key 	= 'YYYYYYYYYYYYYY';
	$merchant_salt	= 'ZZZZZZZZZZZZZZ';

	$hash = base64_encode( hash_hmac('sha256', $post['merchant_oid'].$merchant_salt.$post['status'].$post['total_amount'], $merchant_key, true) );

	if( $hash != $post['hash'] )
		die('PAYTR notification failed: bad hash');

	if( $post['status'] == 'success' ) {

	} else {

	}

	echo "OK";
	exit;
?>
