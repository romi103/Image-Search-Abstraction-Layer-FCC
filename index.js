var express = require('express');
var app = express();
var path = require("path");
var google = require('googleapis');
var customsearch = google.customsearch('v1');
var fs = require("fs");
var mongodb = require('mongodb');

app.set('port', (process.env.PORT || 5000));

app.get("/", function (req, res) {


    res.sendFile(path.join(__dirname + '/index.html'));


});
//custom search API

var uri = process.env.PROD_MONGODB;

app.get('/search/:se', function (req, res) {

    var request = req.params.se;
    var query = parseInt(req.query.offset);
    var params = {
        cx: '009883279465385279356:lmbggz3twmu',
        q: request,
        key: "AIzaSyAeHrDEOr0ASI8G7MfZ8O7XeCtnraPp3AY",
        num: query,
        searchType: "image"
    };


    customsearch.cse.list(params, function (err, response) {
        if (err) {
            res.send('Encountered error', err);
        } else {
            
            console.log(uri);
//            var d = new Data();
//            var dataSearch = d.toUTCString();
            var dataToDatbase = {
                term: request,
                when: new Date().toUTCString()
            };

            //database interaction
            mongodb.MongoClient.connect(uri, function (err, db) {

                    if (err) throw err;

                    var search = db.collection('search');

                    search.insert(dataToDatbase);
                });

                var json = [];

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });

                for (var i = 0; i < query; i++) {
                    json.push({
                        url: response.items[i].link,
                        snippet: response.items[i].snippet,
                        thumbnail: response.items[i].image.thumbnailLink,
                        context: response.items[i].image.contextLink
                    });

                }

            
            res.end(JSON.stringify(json));


            //            res.end(JSON.stringify(response.items));
        }
    });
});

//getting search history
app.get('/search/:se', function (req, res) {});







app.listen(app.get('port'), function () {
    console.log('Example app listening on port', app.get('port'));
});