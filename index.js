const request = require('request');
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url, {useNewUrlParser: true});

var objShazam = {};

request('https://www.shazam.com/shazam/v2/ru/UA/web/-/tracks/world-chart-world?pageSize=200&startFrom=0', (error, response, html) => {

    if (!error && response.statusCode == 200) {

        var obj = JSON.parse(html);

        mongoClient.connect(function (err, client) {
            const db = client.db("ShazamMongodb");
            const collection = db.collection("src");

            for (let i = 0; i < 200; i++) {
                const name = obj['chart'][i]['share']['subject'];
                const link = obj['chart'][i]['share']['href'];

                objShazam = {
                    name,
                    link
                };

                console.log(objShazam);

                collection.insertOne(objShazam, function (err, results) {
                    console.log(results.ops);
                });
            }
            client.close();
        })
    }
})