var request = require('request');
var crypto = require('crypto');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API - Information Integration  - You can get them from the information page after logging into the PayTR Merchant Panel.

var merchant_id = 'XXXXXXXXX';
var merchant_key = 'XXXXXXXXXXXXXXXXXX';
var merchant_salt = 'XXXXXXXXXXXXXXXXXX';

var merchant_oid = ''; // Merchant number given to you by PayTR


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
        //error
        console.log(response.body);
        res.end(response.body);
    }

});


});


var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});
