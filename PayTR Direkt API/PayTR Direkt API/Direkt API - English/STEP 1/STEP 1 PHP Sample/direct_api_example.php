<!doctype html>
<html>
	<head>
		<meta charset="UTF-8">
	</head>
	
	<?php

		$merchant_id = 'XXXXXX';
		$merchant_key = 'XXXXXX';
		$merchant_salt = 'XXXXXX';

		$merchant_ok_url="http://example-site.com/Success";
		$merchant_fail_url="http://example-site.com/Failed";

        $user_basket = htmlentities(json_encode(array(
            array("Example Product", "18.00", 1),
            array("Example Product", "33,25", 2),
            array("Example Product", "45,42", 1)
        )));

		srand(time(null));
		$merchant_oid = rand();
		$test_mode="0";
		$non_3d="0";
		$non3d_test_failed="0";
        if( isset( $_SERVER["HTTP_CLIENT_IP"] ) ) {
            $ip = $_SERVER["HTTP_CLIENT_IP"];
        } elseif( isset( $_SERVER["HTTP_X_FORWARDED_FOR"] ) ) {
            $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
        } else {
            $ip = $_SERVER["REMOTE_ADDR"];
        }
        $user_ip = $ip;
		$email = "testnon3d@paytr.com";
		$payment_amount = "100.99";
		$currency="TL";
        $payment_type = "card";
        $client_lang = "en"; // tr or en

//		$card_type = "bonus";       // advantage, axess, combo, bonus, cardfinans, maximum, paraf, world, saglamkart
//		$installment_count = "5";

        $post_url = "https://www.paytr.com/odeme";

		$hash_str = $merchant_id . $user_ip . $merchant_oid . $email . $payment_amount . $payment_type . $installment_count. $currency. $test_mode. $non_3d;
		$token = base64_encode(hash_hmac('sha256',$hash_str.$merchant_salt,$merchant_key,true));
	?>
	
	<body>
		<form action="<?php echo $post_url;?>" method="post">
		  Card Holder Name: <input type="text" name="cc_owner" value="TEST CARD"><br>
		  Card Number: <input type="text" name="card_number" value="5406675406675403"><br>
		  Card Expiration Month: <input type="text" name="expiry_month" value="12" ><br>
		  Card Expiration Year: <input type="text" name="expiry_year" value="99"><br>
		  Card Security Code: <input type="text" name="cvv" value="000"><br>
		  <input type="hidden" name="merchant_id" value="<?php echo $merchant_id;?>">
		  <input type="hidden" name="user_ip" value="<?php echo $user_ip;?>">
		  <input type="hidden" name="merchant_oid" value="<?php echo $merchant_oid;?>">
		  <input type="hidden" name="email" value="<?php echo $email;?>">
		  <input type="hidden" name="payment_type" value="<?php echo $payment_type;?>">
		  <input type="hidden" name="payment_amount" value="<?php echo $payment_amount;?>">
		  <input type="hidden" name="currency" value="<?php echo $currency;?>">
		  <input type="hidden" name="test_mode" value="<?php echo $test_mode;?>">
		  <input type="hidden" name="non_3d" value="<?php echo $non_3d;?>">
		  <input type="hidden" name="merchant_ok_url" value="<?php echo $merchant_ok_url;?>">
		  <input type="hidden" name="merchant_fail_url" value="<?php echo $merchant_fail_url;?>">
		  <input type="hidden" name="user_name" value="Paytr Test">
		  <input type="hidden" name="user_address" value="TEST TEST TEST">
		  <input type="hidden" name="user_phone" value="05555555555">
		  <input type="hidden" name="user_basket" value="<?php echo $user_basket; ?>">
		  <input type="hidden" name="debug_on" value="1">
            <input type="hidden" name="client_lang" value="<?php echo $client_lang; ?>">
		  <input type="hidden" name="paytr_token" value="<?php echo $token; ?>">
		  <input type="hidden" name="non3d_test_failed" value="<?php echo $non3d_test_failed; ?>">
		  <input type="hidden" name="installment_count" value="<?php echo $installment_count; ?>">
		  <input type="hidden" name="card_type" value="<?php echo $card_type; ?>">
		  <input type="submit" value="Submit">
		</form>
	</body>
</html>