<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
</head>

<?php
$merchant_id = 'MERCHANT_ID';
$merchant_key = 'XXXXXXXXXXX';
$merchant_salt = 'YYYYYYYYYYY';
$merchant_ok_url = "http://example.com/success";
$merchant_fail_url = "http://example.com/failed";

$user_basket = htmlentities(json_encode(array(
    // Array items: Product name - Price - Piece
    array("Basket Example Product", "18.00", 1),
    array("Basket Example Product", "33,25", 5)
)));

srand(time(null));
$merchant_oid = rand();
$test_mode = "0";
$non_3d = "0";
$non3d_test_failed = "0";

if (isset($_SERVER["HTTP_CLIENT_IP"])) {
    $ip = $_SERVER["HTTP_CLIENT_IP"];
} elseif (isset($_SERVER["HTTP_X_FORWARDED_FOR"])) {
    $ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
} else {
    $ip = $_SERVER["REMOTE_ADDR"];
}

$user_ip = $ip;
$email = time()."@paytr.com";
$payment_amount = "100.99";
$currency = "TL";
$payment_type = "card";

// $card_type = "bonus"; // Sent only in installments. Avaliable values; advantage, axess, bonus, cardfinans, maximum, paraf, world
// $installment_count = "5"; // 2-12 sent only in installments

$post_url = "https://www.paytr.com/odeme";

$hash_str = $merchant_id . $user_ip . $merchant_oid . $email . $payment_amount . $payment_type . $installment_count . $currency . $test_mode . $non_3d;
$token = base64_encode(hash_hmac('sha256', $hash_str . $merchant_salt, $merchant_key, true));

## IF THE UTOKEN IS NOT SHIPPED, THIS USER IS ASSUMED THAT THERE IS NOT A PRE-RECORDED CARD.
## AND CREATE A NEW UTOKEN BY PAYTR, IT IS RETURNED IN THE ANSWER OF THE PAYMENT PROCEDURE (TO THE NOTICE URL)!
## If the user has already registered a card in your system, you must add the registered UTOKEN PARAMETER TO THE POST CONTENT.
## THIS CARD WILL BE IDENTIFIED TO THE SAME USER. A NEW CARD FOR THE EXISTING USER
## A NEW UTOKEN WILL BE CREATED IF THERE IS DEFINED, IF IT IS NOT SENT TO UTOKEN, ALL CARD OF THE USER WILL NOT BE GROUPED UNDER ONE UTOKEN !!!

$utoken = "";
?>

<body>
<form action="<?php echo $post_url; ?>" method="post">
    Card Holder Name: <input type="text" name="cc_owner" value="TEST KARTI"><br>
    Card Number: <input type="text" name="card_number" value="4355084355084358"><br>
    Card Month: <input type="text" name="expiry_month" value="12"><br>
    Card Year: <input type="text" name="expiry_year" value="99"><br>
    CVV: <input type="text" name="cvv" value="000"><br>
    <input type="hidden" name="merchant_id" value="<?php echo $merchant_id; ?>">
    <input type="hidden" name="user_ip" value="<?php echo $user_ip; ?>">
    <input type="hidden" name="merchant_oid" value="<?php echo $merchant_oid; ?>">
    <input type="hidden" name="email" value="<?php echo $email; ?>">
    <input type="hidden" name="payment_type" value="<?php echo $payment_type; ?>">
    <input type="hidden" name="payment_amount" value="<?php echo $payment_amount; ?>">
    <input type="hidden" name="installment_count" value="0">
    <input type="hidden" name="currency" value="<?php echo $currency; ?>">
    <input type="hidden" name="test_mode" value="<?php echo $test_mode; ?>">
    <input type="hidden" name="non_3d" value="<?php echo $non_3d; ?>">
    <input type="hidden" name="merchant_ok_url" value="<?php echo $merchant_ok_url; ?>">
    <input type="hidden" name="merchant_fail_url" value="<?php echo $merchant_fail_url; ?>">
    <input type="hidden" name="user_name" value="Paytr Test">
    <input type="hidden" name="user_address" value="test test test">
    <input type="hidden" name="user_phone" value="05555555555">
    <input type="hidden" name="user_basket" value="<?php echo $user_basket; ?>">
    <input type="hidden" name="debug_on" value="1">
    <input type="hidden" name="paytr_token" value="<?php echo $token; ?>">
    <input type="hidden" name="non3d_test_failed" value="<?php echo $non3d_test_failed; ?>">
    <input type="hidden" name="installment_count" value="<?php echo $installment_count; ?>">
    <input type="hidden" name="card_type" value="<?php echo $card_type; ?>">
    <input type="hidden" name="utoken" value="<?php echo $utoken; ?>">
    <input type="checkbox" name="store_card" value="1"/> Store My Card
    <br/>
    <input type="submit" value="Submit">
</form>
</body>
</html>