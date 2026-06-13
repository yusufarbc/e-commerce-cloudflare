var request = require('request');
var crypto = require('crypto');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Entegrasyon Bilgileri - Mağaza paneline giriş yaparak BİLGİ sayfasından alabilirsiniz.

var merchant_id = 'XXXXXX';
var merchant_key = 'XXXXXX';
var merchant_salt = 'XXXXXX';
// Sorgulama yapılmak istenen karta ait kart numarasının ilk 6 veya 8 hanesi. Maksimum doğrulama için 8 hane kullanın.
var bin_number = 'XXXXXX';
// Bu kısımda herhangi bir değişiklik yapmanıza gerek yoktur. //
var paytr_token = crypto.createHmac('sha256', merchant_key).update(bin_number + merchant_id + merchant_salt).digest('base64');

app.get("/", function (req, res) {

    var options = {
        'method': 'POST',
        'url': 'https://www.paytr.com/odeme/api/bin-detail',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'merchant_id': merchant_id,
            'bin_number': bin_number,
            'paytr_token': paytr_token,
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var res_data = JSON.parse(body);

        if (res_data.status == 'success') {
            res.send(response.body);

        } else {
            res.end(response.body);
        }

    });

});

var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});
