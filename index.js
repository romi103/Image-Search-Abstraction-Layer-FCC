var express = require('express');
var app = express();
var path = require("path");
var google = require('googleapis');
var customsearch = google.customsearch('v1');

app.set('port', (process.env.PORT || 5000));

app.get("/", function (req, res) {


    res.sendFile(path.join(__dirname + '/index.html'));


});
//custom search API



app.get('/search/:query', function (req, res) {

    var request = req.params.query;
    var params = {
        cx: '009883279465385279356:lmbggz3twmu',
        q: request,
        key: "AIzaSyAeHrDEOr0ASI8G7MfZ8O7XeCtnraPp3AY"
    };


    var respond = customsearch.cse.list(params, function (err, response) {
        if (err) {
            console.log('Encountered error', err);
        } else {
            console.log('Response', response);
        }
    });


    res.send(respond);

});



app.listen(app.get('port'), function () {
    console.log('Example app listening on port', app.get('port'));
});