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

var merchant_id = 'XXXXXX';
var merchant_key = 'XXXXXX';
var merchant_salt = 'XXXXXX';
var basket = JSON.stringify([['Örnek Ürün 1', '50.00', 1], ['Örnek Ürün 2', '50.00', 1]]);
var user_basket = basket;
var merchant_oid = "IN" + microtime.now(); // Sipariş numarası: Her işlemde benzersiz olmalıdır!! Bu bilgi bildirim sayfanıza yapılacak bildirimde geri gönderilir.
var user_ip = '';
var email = ''; // Müşterinizin sitenizde kayıtlı veya form vasıtasıyla aldığınız eposta adresi.
var payment_amount = '100.99'; // Tahsil edilecek tutar. 100.99
var currency = 'TL';
var test_mode = '0';  // Mağaza canlı modda iken test işlem yapmak için 1 olarak gönderilebilir.
var user_name = 'PayTR Test'; // Müşterinizin sitenizde kayıtlı veya form aracılığıyla aldığınız ad ve soyad bilgisi.
var user_address = 'test test test'; // Müşterinizin sitenizde kayıtlı veya form aracılığıyla aldığınız adres bilgisi.
var user_phone = '05555555555'; // Müşterinizin sitenizde kayıtlı veya form aracılığıyla aldığınız telefon bilgisi.

// Başarılı ödeme sonrası müşterinizin yönlendirileceği sayfa
// Bu sayfa siparişi onaylayacağınız sayfa değildir! Yalnızca müşterinizi bilgilendireceğiniz sayfadır!

var merchant_ok_url = 'http://www.siteniz.com/odeme_basarili.php';

// Ödeme sürecinde beklenmedik bir hata oluşması durumunda müşterinizin yönlendirileceği sayfa
// Bu sayfa siparişi iptal edeceğiniz sayfa değildir! Yalnızca müşterinizi bilgilendireceğiniz sayfadır!
var merchant_fail_url = 'http://www.siteniz.com/odeme_hata.php';
var debug_on = 1; // Hata mesajlarının ekrana basılması için entegrasyon ve test sürecinde 1 olarak bırakın. Daha sonra 0 yapabilirsiniz.
var client_lang = 'tr';
var payment_type = 'card';
var installment_count = '0';
var non_3d = '0'; // 3D'siz işlem.
var card_type = '';
var non3d_test_failed = '0'; // Non3d Test Failed.

// UTOKEN GÖNDERİLMEDİĞİ DURUMDA, BU KULLANICIYA AİT DAHA ÖNCEDEN KAYDEDİLMİŞ BİR KART OLMADIĞI VARSAYILIR 
//VE PAYTR TARAFINDA YENİ BİR UTOKEN OLUŞTURULARAK ÖDEME İŞLEMİNİN CEVABINDA DÖNDÜRÜLÜR (BİLDİRİM URL'YE)!
// EĞER KULLANICI SİSTEMİNİZDE DAHA ÖNCE BİR KART KAYDETMİŞSE TARAFINIZDA KAYITLI UTOKEN PARAMETRESİNİ POST 
// İÇERİĞİNE EKLEMELİSİNİZ. BÖYLECE BU KART DA AYNI KULLANICIYA TANIMLANACAKTIR. EĞER MEVCUT KULLANICI İÇİN 
//YENİ BİR KART TANIMI YAPILACAĞI HALDE MEVCUT UTOKEN GÖNDERİLMEZSE YENİ BİR UTOKEN OLUŞTURULACAĞINDAN KULLANICININ 
//TÜM KARTLARI TEK BİR UTOKEN ALTINDA GRUPLANMAZ!!!

var utoken = "";


app.get("/", function (req, res) {

    var hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installment_count}${currency}${test_mode}${non_3d}`;
    var paytr_token = hashSTR + merchant_salt;
    var token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');

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
        utoken,
    };

    res.render('index');


});



var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});

