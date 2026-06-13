var request = require('request');
var crypto = require('crypto');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var merchant_id = 'XXXXXX';
var merchant_key = 'YYYYYYYYYYYYYY';
var merchant_salt = 'ZZZZZZZZZZZZZZ';

//User-specific token that is notified to you through the PAYTR system in the payment notification after card registration.
var utoken = '';

// Token that identifies the user's registered card (User returns the response as a result of getting the registered card list)
var ctoken = '';

var paytr_token = crypto.createHmac('sha256', merchant_key).update(ctoken + utoken + merchant_salt).digest('base64');

app.get("/", function (req, res) {

var options = {
    'method': 'POST',
    'url': 'https://www.paytr.com/odeme/capi/delete',
    'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        'merchant_id': merchant_id,
        'ctoken': ctoken,
        'utoken': utoken,
        'paytr_token': paytr_token,
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);
    var res_data = JSON.parse(body);

    if (res_data.status == 'success') {
        res.send('The card information has been successfully deleted.');

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
