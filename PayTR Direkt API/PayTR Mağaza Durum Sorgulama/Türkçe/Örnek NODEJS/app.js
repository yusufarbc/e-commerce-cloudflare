var request = require('request');
var crypto = require('crypto');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Entegrasyon Bilgilier - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.

var merchant_id = 'XXXXXXXXX';
var merchant_key = 'XXXXXXXXXXXXXXXXXX';
var merchant_salt = 'XXXXXXXXXXXXXXXXXX';

var merchant_oid = ''; // Benzersiz işlem numarası.


app.get("/", function (req, res) {

var paytr_token = crypto.createHmac('sha256', merchant_key).update(merchant_id + merchant_oid + merchant_salt).digest('base64');

var options = {
    'method': 'POST',
    'url': 'https://www.paytr.com/odeme/durum-sorgu',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        'merchant_id': merchant_id,
        'merchant_oid': merchant_oid,
        'paytr_token': paytr_token,
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var res_data = JSON.parse(body);

    if (res_data.status == 'success') {
        res.send(res_data);

    } else {
        //hata durumu
        console.log(response.body);
        res.end(response.body);
    }

});

});


var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});
