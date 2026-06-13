var request = require('request');
var crypto = require('crypto');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API - Information Integration  - You can get them from the information page after logging into the PayTR Merchant Panel.
var merchant_id = 'XXXXXX';
var merchant_key = 'XXXXXX';
var merchant_salt = 'XXXXXX';

// User-specific token that is notified to you through the PAYTR system in the payment notification after card registration.
var utoken = '';


var paytr_token = crypto.createHmac('sha256', merchant_key).update(utoken + merchant_salt ).digest('base64');

app.get("/", function (req, res) {

var options = {
    'method': 'POST',
    'url': 'https://www.paytr.com/odeme/capi/list',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        'merchant_id': merchant_id,
        'utoken': utoken,
        'paytr_token': paytr_token,
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var res_data = JSON.parse(body);

    console.log(res_data);
    console.log(body);
    console.log(response.body);
    if (res_data.status == 'success') {
        res.send(response.body);

    } else {
        console.log(response.body);
        res.end(response.body);
    }

});

 
});


var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});
