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

// API - Information Integration  - You can get them from the information page after logging into the PayTR Merchant Panel.

var merchant_id = 'merchant_number';
var merchant_key = 'XXXXXXXXXXX';
var merchant_salt = 'YYYYYYYYYYY';
var basket = JSON.stringify([
    ['Sample Product 1', '50.00', 1], // 1st Product (Product Name - Unit Price - Piece)
    ['Sample Product 2', '33.25', 2], // 2nd Product (Product Name - Unit Price - Piece)
    ['Sample Product 3', '45.42', 1] // 3rd Product (Product Name - Unit Price - Piece)
]);
var user_basket = basket;
var merchant_oid = "IN" + microtime.now(); 
var user_ip = '';
var email = 'testnon3d@paytr.com'; 
var payment_amount = '100.99';
var currency = 'TL';
var test_mode = '0';
var user_name = 'PayTR Test';
var user_address = 'test test test'; 
var user_phone = '05555555555';
// The page where your customer will be directed after successful payment.
var merchant_ok_url = 'http://www.siteniz.com/odeme_basarili.php';
// The page where your customer will be directed after fail payment.
var merchant_fail_url = 'http://www.siteniz.com/odeme_hata.php';
var debug_on = 1;
var client_lang = 'en'; //tr for Turkish or en for English (tr is assumed if not sent)
var payment_type = 'card'; 
var non_3d = '0'; // For Non3D transactions send this value as 1
var card_type = '';  
var installment_count = '0'; 

//If you need to test failed Non3D transaction send 1 (non_3d and test_mode values must be both 1)
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

    var callback = req.body;

    paytr_token = callback.merchant_oid + merchant_salt + callback.status + callback.total_amount;
    var token = crypto.createHmac('sha256', merchant_key).update(paytr_token).digest('base64');

    if (token != callback.hash) {
        throw new Error("PAYTR notification failed: bad hash");
    }

    if (callback.status == 'success') {
        // success
    } else {
        /// failed
    }

    res.send('OK');  // Notify the PayTR system that the notification has been received.  

});



var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});

