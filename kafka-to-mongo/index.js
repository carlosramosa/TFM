'use strict';

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const run = async () => {
    const database = await MongoClient.connect(url) ;
    var dbo = database.db("DATABASE_PRUEBAS");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("miPolla").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
    });
};

    run ();