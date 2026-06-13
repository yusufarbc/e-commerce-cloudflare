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
var merchant_id = 'XXXXXX';
var merchant_key = 'XXXXXX';
var merchant_salt = 'XXXXXX';
var basket = JSON.stringify([
    ['Sample Product 1', '50.00', 1], // 1st Product (Product Name - Unit Price - Piece)
    ['Sample Product 2', '33.25', 2], // 2nd Product (Product Name - Unit Price - Piece)
    ['Sample Product 3', '45.42', 1] // 3rd Product (Product Name - Unit Price - Piece)
]);
var user_basket = basket;
var merchant_oid = "IN" + microtime.now(); 
var user_ip = '';
var email = ''; 
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
var client_lang = 'tr';
var payment_type = 'card';
var installment_count = '0';
var non_3d = '0'; 
var card_type = '';
var non3d_test_failed = '0'; // Non3d Test Failed.

// ## IF THE UTOKEN IS NOT SHIPPED, THIS USER IS ASSUMED THAT THERE IS NOT A PRE-RECORDED CARD.
// ## AND CREATE A NEW UTOKEN BY PAYTR, IT IS RETURNED IN THE ANSWER OF THE PAYMENT PROCEDURE (TO THE NOTICE URL)!
// ## If the user has already registered a card in your system, you must add the registered UTOKEN PARAMETER TO THE POST CONTENT.
// ## THIS CARD WILL BE IDENTIFIED TO THE SAME USER. A NEW CARD FOR THE EXISTING USER
// ## A NEW UTOKEN WILL BE CREATED IF THERE IS DEFINED, IF IT IS NOT SENT TO UTOKEN, ALL CARD OF THE USER WILL NOT BE GROUPED UNDER ONE UTOKEN !!!

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

