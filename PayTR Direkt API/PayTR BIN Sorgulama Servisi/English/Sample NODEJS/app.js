var request = require('request');
var crypto = require('crypto');
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var merchant_id = 'XXXXXX';
var merchant_key = 'XXXXXX';
var merchant_salt = 'XXXXXX';

var bin_number = 'XXXXXX';

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
