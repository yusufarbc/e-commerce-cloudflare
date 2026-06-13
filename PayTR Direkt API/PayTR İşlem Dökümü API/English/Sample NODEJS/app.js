var request = require('request');
var crypto = require('crypto');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API - Information Integration  - You can get them from the information page after logging into the PayTR Merchant Panel.

var merchant_id = '';
var merchant_key = '';
var merchant_salt = '';


app.get("/", function (req, res) {

   // Start / End date. Maximum 3 days interval can be defined.
    var start_date = '2020-05-01 00:00:00';
    var end_date = '2020-05-01 23:59:59';

    var paytr_token = crypto.createHmac('sha256', merchant_key).update(merchant_id + start_date + end_date + merchant_salt).digest('base64');

    var options = {
        'method': 'POST',
        'url': 'https://www.paytr.com/rapor/islem-dokumu',
        'headers': {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'merchant_id': merchant_id,
            'start_date': start_date,
            'end_date': end_date,
            'paytr_token': paytr_token,
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var res_data = JSON.parse(body);

        if (res_data.status == 'success') {
            res.send(res_data);

        } else {
            res.end(response.body);
        }

    });


});


var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});
