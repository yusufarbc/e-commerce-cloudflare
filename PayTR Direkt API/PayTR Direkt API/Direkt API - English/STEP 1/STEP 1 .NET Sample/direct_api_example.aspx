@{
    ViewBag.Title = "Test";
}
<h2>@ViewBag.Title.</h2>
<p>PAYTR API Test</p>
<form action="@ViewBag.PostUrl" method="post">
    Kart Sahibi Adı: <input type="text" name="cc_owner" value="TEST KARTI"><br>
    Kart Numarası: <input type="text" name="card_number" value="5406675406675403"><br>
    Kart Son Kullanma Ay: <input type="text" name="expiry_month" value="12"><br>
    Kart Son Kullanma Yıl: <input type="text" name="expiry_year" value="99"><br>
    Kart Güvenlik Kodu: <input type="text" name="cvv" value="000"><br>

    <input type="hidden" name="merchant_id" value="@ViewBag.MerchantId">
    <input type="hidden" name="user_ip" value="@ViewBag.UserIp">
    <input type="hidden" name="merchant_oid" value="@ViewBag.MerchantOid">
    <input type="hidden" name="email" value="@ViewBag.Email">
    <input type="hidden" name="payment_type" value="@ViewBag.PaymentType">
    <input type="hidden" name="payment_amount" value="@ViewBag.PaymentAmount">
    <input type="hidden" name="currency" value="@ViewBag.Currency">
    <input type="hidden" name="test_mode" value="@ViewBag.TestMode">
    <input type="hidden" name="non_3d" value="@ViewBag.Non3d">
    <input type="hidden" name="merchant_ok_url" value="@ViewBag.MerchantOkUrl">
    <input type="hidden" name="merchant_fail_url" value="@ViewBag.MerchantFailUrl">
    <input type="hidden" name="user_name" value="Paytr Test">
    <input type="hidden" name="user_address" value="test test test">
    <input type="hidden" name="user_phone" value="05555555555">
    <input type="hidden" name="user_basket" value="@ViewBag.UserBasket">
    <input type="hidden" name="debug_on" value="@ViewBag.DebugOn">
    <input type="hidden" name="paytr_token" value="@ViewBag.PaytrToken">
    <input type="hidden" name="non3d_test_failed" value="@ViewBag.Non3dTestFailed">
    <input type="hidden" name="installment_count" value="@ViewBag.InstallmentCount">
    <input type="hidden" name="card_type" value="@ViewBag.CardType">
    <input type="submit" value="Submit">
</form>