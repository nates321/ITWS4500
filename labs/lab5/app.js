var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var twitter = require('twitter');
var fs = require('fs');
var app = express();


//create a twitter client so you can be authenitcated
var client = new twitter({
  consumer_key: 'EDyjG1ertdeWvDLwaJgt7XESy',
  consumer_secret: 'pDrheonrZtSfWPWhN1V5nte4lAlf7BUQbI2CAjgjpXyS4p5Xj3',
  access_token_key: '306009316-QyUOWAxtd0QbcKQJVWkHNIrjrhjKSjAOuA0uuQoi',
  access_token_secret: 'QwK3e9sSEkqWQmG41wsquo8oj5AvfGMzS3as3xPFyYrXx'
});
app.use(bodyParser.urlencoded({ extended : false }));

app.use(express.static('public'));

//load the index page automatically
app.get('/', function (req, res) {
    res.render('public/index.html');
});



app.post('/tweets', function(req, res) { //when the button gets pressed it goes to /tweets and gets the inputted value
    console.log(req.body.num);
    console.log(req.body.subject);
    var num =req.body.num;
    var subject = req.body.subject;
    var geo = "-73.68,42.72,5mi"; //couldnt figure out how to ge tlocations within a box but i could find this way to get a radius around the location
   
    if (subject == ""){
    	subject = null;
    }
    if (num == ""){
    	num = null;
    }

    //if both values are set
    if (subject != null && num != null){
    	//get the JSON with the 2 parameters
    	client.get('search/tweets', {
	    	q: subject,
    		count: num
    	}, function(error, tweets, response) {
  			if (!error) {
	  			
  				var location = "public/streln-tweets.json";
            	fs.writeFile(location, JSON.stringify(tweets)); //write the file
    			//console.log(tweets);
    			res.send('<script>window.location.href = "tweets.html";</script>') //changed to the view to display the tweets
    			//res.render('public/tweets.html');
	  		}
		});

	}
	// next 2 else ifs and else are the same thing except with different parameters
	else if (subject != null){
		
		client.get('search/tweets', {
	    	q: subject,
    		count: 25
    	}, function(error, tweets, response) {
  			if (!error) {
	  			
  				var location = "public/streln-tweets.json";
            	fs.writeFile(location, JSON.stringify(tweets));
    			//console.log(tweets);
    			res.send('<script>window.location.href = "tweets.html";</script>')
	  		}
		});

	}
	else if (num != null){
		
		client.get('search/tweets', {
    		geocode: geo,
    		count: num

    	}, function(error, tweets, response) {
  			if (!error) {
	  			
  				var location = "public/streln-tweets.json";
            	fs.writeFile(location, JSON.stringify(tweets));
    			//console.log(tweets);
    			res.send('<script>window.location.href = "tweets.html";</script>')
	  		}
		});
	}
	else{
		console.log("hey 4");
		client.get('search/tweets', {
    		count: 25,
    		geocode: geo
    	}, function(error, tweets, response) {
  			if (!error) {
	  			
  				var location = "public/streln-tweets.json";
            	fs.writeFile(location, JSON.stringify(tweets));
    			console.log(tweets);
    			res.send('<script>window.location.href = "tweets.html";</script>')
	  		}
		});


	}

    
});

//listen for connections
app.listen(3000, function () {
    console.log("Listening on port 3000");
});