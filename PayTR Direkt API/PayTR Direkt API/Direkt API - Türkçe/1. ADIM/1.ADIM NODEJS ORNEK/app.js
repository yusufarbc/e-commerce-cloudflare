var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var microtime = require('microtime');
var crypto = require('crypto');
var nodeBase64 = require('nodejs-base64-converter');
var app = express();
var path = require('path');


app.set('views', path.join(__dirname, '/app_server/views'));
app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var merchant_id = 'MAGAZA_NO';
var merchant_key = 'XXXXXXXXXXX';
var merchant_salt = 'YYYYYYYYYYY';
var basket = JSON.stringify([
    ['Örnek Ürün 1', '50.00', 1], // 1. ürün (Ürün Ad - Birim Fiyat - Adet)
    ['Örnek Ürün 2', '33.25', 2], // 2. ürün (Ürün Ad - Birim Fiyat - Adet)
    ['Örnek Ürün 3', '45.42', 1] // 3. ürün (Ürün Ad - Birim Fiyat - Adet)
]);
var user_basket = basket;
var merchant_oid = "IN" + microtime.now(); // Sipariş numarası: Her işlemde benzersiz olmalıdır!! Bu bilgi bildirim sayfanıza yapılacak bildirimde geri gönderilir.
var user_ip = '';
var email = 'testnon3d@paytr.com'; // Müşterinizin sitenizde kayıtlı veya form vasıtasıyla aldığınız eposta adresi.
var payment_amount = '100.99'; // Tahsil edilecek tutar.
var currency = 'TL';
var test_mode = '0';
var user_name = 'PayTR Test';
var user_address = 'test test test'; // Müşterinizin sitenizde kayıtlı veya form aracılığıyla aldığınız adres bilgisi.
var user_phone = '05555555555';
// Başarılı ödeme sonrası müşterinizin yönlendirileceği sayfa. 
// Bu sayfa siparişi onaylayacağınız sayfa değildir! Yalnızca müşterinizi bilgilendireceğiniz sayfadır!
// Siparişi onaylayacağız sayfa "Bildirim URL" sayfasıdır (Bakınız: 2.ADIM Klasörü ve sayfanın devamında bulunan /callback adımı).
var merchant_ok_url = 'http://www.siteniz.com/odeme_basarili.php';
// Ödeme sürecinde beklenmedik bir hata oluşması durumunda müşterinizin yönlendirileceği sayfa
// Bu sayfa siparişi iptal edeceğiniz sayfa değildir! Yalnızca müşterinizi bilgilendireceğiniz sayfadır!
var merchant_fail_url = 'http://www.siteniz.com/odeme_hata.php';
var debug_on = 1;
var client_lang = 'tr'; //Ödeme süreci dil seçeneği tr veya en.
var payment_type = 'card'; // Ödeme türü
var non_3d = '0'; //3d'siz işlem
var card_type = '';  // Alabileceği değerler; advantage, axess, combo, bonus, cardfinans, maximum, paraf, world
var installment_count = '0'; // Taksit Sayısı

//non3d işlemde, başarısız işlemi test etmek için 1 gönderilir (test_mode ve non_3d değerleri 1 ise dikkate alınır!)
var non3d_test_failed = '0';


app.get("/", function (req, res) {

    var hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installment_count}${currency}${test_mode}${non_3d}`;
    console.log('HASH STR' + hashSTR);
    var paytr_token = hashSTR + merchant_salt;
    console.log('PAYTR TOKEN' + paytr_token);
    var token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');

    console.log('TOKEN' + token);
    context = {
        merchant_id,
        user_ip,
        merchant_oid,
        email,
        payment_type,
        payment_amount,
        currency,
        test_mode,
        non_3d,
        merchant_ok_url,
        merchant_fail_url,
        user_name,
        user_address,
        user_phone,
        user_basket,
        debug_on,
        client_lang,
        token,
        non3d_test_failed,
        installment_count,
        card_type,
    };

    res.render('index');

});


app.post("/callback", function (req, res) {

    // ÖNEMLİ UYARILAR!
    // 1) Bu sayfaya oturum (SESSION) ile veri taşıyamazsınız. Çünkü bu sayfa müşterilerin yönlendirildiği bir sayfa değildir.
    // 2) Entegrasyonun 1. ADIM'ında gönderdiğniz merchant_oid değeri bu sayfaya POST ile gelir. Bu değeri kullanarak
    // veri tabanınızdan ilgili siparişi tespit edip onaylamalı veya iptal etmelisiniz.
    // 3) Aynı sipariş için birden fazla bildirim ulaşabilir (Ağ bağlantı sorunları vb. nedeniyle). Bu nedenle öncelikle
    // siparişin durumunu veri tabanınızdan kontrol edin, eğer onaylandıysa tekrar işlem yapmayın. Örneği aşağıda bulunmaktadır.

    var callback = req.body;


    paytr_token = callback.merchant_oid + merchant_salt + callback.status + callback.total_amount;
    var token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');

    // Oluşturulan hash'i, paytr'dan gelen post içindeki hash ile karşılaştır (isteğin paytr'dan geldiğine ve değişmediğine emin olmak için)
    // Bu işlemi yapmazsanız maddi zarara uğramanız olasıdır.

    if (token != callback.hash) {
        throw new Error("PAYTR notification failed: bad hash");
    }

    if (callback.status == 'success') {
        // basarili
    } else {
        /// basarisiz
    }

    res.send('OK');  // Bildirimin alındığını PayTR sistemine bildir.  

});



var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});

