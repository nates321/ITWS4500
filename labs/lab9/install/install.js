var MongoClient= require('mongodb').MongoClient;
var URL = 'mongodb://localhost:27017/tweetFiles';

MongoClient.connect(URL, function (err, db) {
	
	if (err !== null) {
    console.log("could not set up database");
	return;
    }

    console.log("created Databae");

    db.close();

});
