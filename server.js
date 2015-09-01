var express = require('express');
var sheller = require('./sheller');
var app = express();
var busy = false;

app.use(express.static('public'));

app.get('/b*', function (req, res) {
    if (busy) {
        return res.status(200).send(clog('working...'));
    }
    busy = true;
    sheller(0, function (err, result) {
        busy = false;
    });
    res.status(200).send(clog('just started...'));
    function clog(msg) {
        return ("console.log('" + msg + "');");
    }
});

var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});