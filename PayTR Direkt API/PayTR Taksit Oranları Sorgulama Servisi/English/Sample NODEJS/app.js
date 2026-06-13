var request = require('request');
var crypto = require('crypto');
var express = require('express');
var microtime = require('microtime');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API - Information Integration  - You can get them from the information page after logging into the PayTR Merchant Panel.
var merchant_id = 'XXXXXX';
var merchant_key = 'YYYYYYYYYYYYYY';
var merchant_salt = 'ZZZZZZZZZZZZZZ';


var request_id = microtime.now(); // Request ID: The unique number you set for requests.

var paytr_token = crypto.createHmac('sha256', merchant_key).update(merchant_id + request_id + merchant_salt).digest('base64');

app.get("/", function (req, res) {

var options = {
    'method': 'POST',
    'url': 'https://www.paytr.com/odeme/taksit-oranlari',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        'merchant_id': merchant_id,
        'request_id': request_id,
        'paytr_token': paytr_token,
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var res_data = JSON.parse(body);

    if (res_data.status == 'success') {
        res.send(response.body);
        // Database operations

    } else {
        console.log(response.body);
        res.end(response.body);
        //Örn. $result -> array('status'=>'error', "err_msg" => "Required field value is invalid or not sent: ")
    }

});


});


var port = 3200;
app.listen(port, function () {
    console.log("Server is running. Port:" + port);
});
