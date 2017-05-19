var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var twitter = require('twitter');
var fs = require('fs');
var app = express();
var MongoClient= require('mongodb').MongoClient;
var _ = require('lodash');


var URL = 'mongodb://localhost:27017/tweetFiles';

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

function writeFile(location, data, callback){  //function rights the file given a location, callback with 1 if it works, 2 if it doesnt work
  console.log("in writeFile");
  fs.writeFile(location, data, function(err) {
      if(err){
        callback(2);
        
      }
      else{
        console.log("saved");
        callback(1);
      }

    });
}

function export_stuff(fName, export_type, json_tweets, num, callback){ //determines if it is json or csv, then puts together a string to be sent to writeFile. callback is the callback from write file and wheter the file existed already
  console.log("in export_stuff");
  var wasError = 1;
  var fileExist = false;
  if (export_type == "xml"){  //convert to an xml file
    console.log("in xml part");
    var xmlFile = "<statuses>";


    for (var key= 0; key < num; key++){
      //console.log("hey");
      if (key > 99) //twitter in node can only get 100 tweets
        break;
      var item;
          
      //console.log(key);
      //console.log("in json");
      //console.log(json_tweets);
      item = json_tweets[key];
      //console.log(item);
      console.log("adding new tweet");  
      xmlFile += "<tweet><created_at>" + item.created_at + "</created_at>";
      xmlFile += "<id>" + item.id + "</id>";
      xmlFile += "<text>" + item.text + "</text>";
      xmlFile += "<user_id>" + item.user.id + "</user_id>";
      xmlFile += "<user_name>" + item.user.name + "</user_name>";
      xmlFile += "<user_screen_name>" + item.user.screen_name +"</user_screen_name>";
      xmlFile += "<user_location>" + item.user.location + "</user_location>";
      xmlFile += "<user_followers_count>" + item.user.followers_count + "</user_followers_count>";
      xmlFile += "<user_friends_count>" + item.user.friends_count + "</user_profile_image_url>";
      xmlFile += "<user_created_at>" + item.user.created_at + "</user_created_at>";
      xmlFile +=  "<user_time_zone>" + item.user.time_zone + "</user_time_zone>";
      xmlFile += "<user_profile_background_color>" + item.user.profile_background_color + "</user_profile_background_color>";
      xmlFile +=  "<user_profile_image_url>" + item.user.profile_image_url + "</user_profile_image_url>";
      xmlFile +=  "<geo>" + item.geo + "</geo>";
      xmlFile += "<coordinates>" + item.coordinates + "</geo>";
      xmlFile += "<place>" + item.place + "</place></tweet>";

          
      

    }

    xmlFile += "</statuses>";

    var location = "public/" + fName + '.xml';
    
   
    console.log("done adding tweets");
   

    fs.stat(location, function(err, stat) {
      console.log("fs.stat returned"); //check if file exists
      if (err == null){
        console.log('file exists');
        fileExist = true;
      }
      else{
        console.log(err);
      }

      writeFile(location , xmlFile, function(err){ //write file and call back 
          console.log("done writing file");
          callback(err, fileExist);

        });
    });

  }


  if(export_type == "json"){ //does this part if its json
    var jsonT = {
      statuses: []
    };

    for (var key= 0; key < num; key++){
      //console.log("hey");
      if (key > 99) //twitter in node can only get 100 tweets
        break;
      var item;
          
      //console.log(key);
      //console.log("in json");
      //console.log(json_tweets);
      item = json_tweets[key];
      //console.log(item);
         
          

          
      jsonT.statuses.push({ //create the json file
        "created_at": item.created_at, 
        "id": item.id,
        "text": item.text,
        "user_id": item.user.id,
        "user_name": item.user.name,
        "user_screen_name": item.user.screen_name,
        "user_location": item.user.location,
        "user_followers_count": item.user.followers_count,
        "user_friends_count": item.user.friends_count,
        "user_created_at": item.user.created_at,
        "user_time_zone": item.user.time_zone,
        "user_profile_background_color": item.user.profile_background_color,
        "user_profile_image_url": item.user.profile_image_url,
        "geo": item.geo,
        "coordinates": item.coordinates,
        "place": item.place
      });

    }





    var location = "public/" + fName + '.json';
    

    fs.stat(location, function(err, stat) { //this checks if the file existed already, if the err is null theres a file
      if (err == null){
        console.log('file exists');
        fileExist = true;
        
        
      }

      writeFile(location, JSON.stringify(jsonT, null, "\t"), function(err2){ //write the file, stringify to make it in json format with spacing

           callback(err2, fileExist);

        });


    });
  }

  if (export_type == "csv"){ //do this if its csv
    var csvT = '"created_at","id","text","user_id","user_name","user_screen_name","user_location","user_followers_count","user_friends_count","user_created_at","user_time_zone","user_profile_background_color","user_profile_image_url","geo","coordinates","place"\n'; 
    //create header row
    console.log("csv");

    for (var key=0; key <num; key++){

      //console.log("hey");
      var item;
      if (key > 99)//twitter node can only do 100 tweets
        break;
      //console.log(key);
      //console.log("in csv");
      //console.log(json_tweets);
      item = json_tweets[key];
      //console.log(item);
      item.text = item.text.replace(/[,]/g, ''); 
      var line = '"' + item.created_at + '","' + item.id + '","' + item.text + '","' + item.user.id + '","' + item.user.name + '","' + item.user.screen_name + '","' + item.user.location + '","' + item.user.followers_count + '","' + item.user.friends_count + '","' +item.user.created_at + '","' +item.user.time_zone + '","' +item.user.profile_background_color + '","' +item.user.profile_image_url + '","' +item.geo + '","' +item.coordinates + '","' +item.place + '"';
      line = line.replace(/[\\]/g, '');
      csvT += line;
      csvT += '\n';//creare a new line in the csv file
    }
    //console.log(csvT);
    
    var location = "public/" + fName + '.csv';
    
   

    fs.stat(location, function(err, stat) { //check if file exists
      if (err == null){
        console.log('file exists');
        fileExist = true;
        }
        writeFile(location, csvT, function(err){ //write file and call back 

           callback(err, fileExist);

        });



      
    });



      
  }

  

}

app.post('/export', function(req, res) {

  //console.log(req.body.num);
  //console.log(req.body.subject);
  var num =req.body.num;
  var subject = req.body.subject;
  var export_type = req.body.etype;
  var fName = req.body.fileName;
  console.log(export_type);
  var geo = "-73.68,42.72,5mi"; //couldnt figure out how to ge tlocations within a box but i could find this way to get a radius around the location
  
  if (subject == ""){
    subject = null;
  }
  if (num == ""){
    num = 25;
  }
  var json_tweets;

  MongoClient.connect(URL, function (err, db) { //connect to the DB
                if (err) {
                  res.send('<script>alert("could not connect to DB");window.location.href = "index.html";</scipt>');
                }

                db.collections(function (err, collections) {
                    var found = false;
                    _.forEach(collections, function (collection) {//go through each collection to see if it matches the one oyu want
                        if (collection.s.name == req.body.subject) {
                            found = true;
                            num = Number(req.body.num);
                            console.log(num);
                            collection.find().limit(num).toArray(function (err, data){ //get collection's data for the number they want
                               

                              export_stuff(fName, export_type, data, num, function(result, fileExist){ //call the export_stuff function with a callback to make sure it goes in order.
                                  console.log(result + " result");
                                  console.log(fileExist + " fileExist");

                                  if(result == 2){ //2 means it couldnt write the file, so it alerts the user and goes back to the page
                                      console.log("response couldnt write file");
                                      res.send('<script>alert("could not write file"); window.location.href = "index.html";</script>');
                                      return;
                                  }
                                  else{

                                    if (num >=100){ //can only get 100 tweets, so notify the user if there were only 100 tweets collected
                                       console.log("response > 100");
                                       if (fileExist){ //says overwrote if file existed
                                          res.send('<script>alert("overwrote ' + export_type + ' file with only 100 tweets because that is the max"); window.location.href = "index.html";</script>');    
                                          return;
                                       }
                                       else{
                                          res.send('<script>alert("created ' + export_type + ' file with only 100 tweets because that is the max"); window.location.href = "index.html";</script>');    
                                          return;
                                       }
                                    }
                                    else{ //this part runs if the person did less than 100 tweets and everything went normally
                                      console.log("Response normal");
                                      if (fileExist){
                                      res.send('<script>alert("overwrote ' + export_type + ' file"); window.location.href = "index.html";</script>');
                                      return;
                                      }
                                      else{
                                      res.send('<script>alert("created ' + export_type + ' file"); window.location.href = "index.html";</script>');
                                      return;
                                      }
                                    }

                                  }
                              });


                            });
                            
                            
                          
                        }
                    });
                    if (!found) {
                        console.log("collection not found");
                        res.send('<script>alert("No Collections Match Your Search");window.location.href = "index.html";</scipt>');
                    }
                });
            });


  

  /* this has the old export code in it for when it was just calling the API
  //if both values are set
  if (subject != null && num != null){ //if theres a subject, do this
    //get the JSON with the 2 parameters
    client.get('search/tweets', {
      q: subject,
      count: num
    }, function(error, tweets, response) {
      if (!error) {
          
        json_tweets = tweets.statuses; //simplify the file so i dont have to type tweets.statuses everytime
        //console.log("hey1");
        //console.log(json_tweets);
        export_stuff(fName, export_type, json_tweets, num, function(result, fileExist){ //call the export_stuff function with a callback to make sure it goes in order.
          console.log(result + " result");
          console.log(fileExist + " fileExist");

          if(result == 2){ //2 means it couldnt write the file, so it alerts the user and goes back to the page
              console.log("response couldnt write file");
              res.send('<script>alert("could not write file"); window.location.href = "index.html";</script>');
              return;
          }
          else{

            if (num >=100){ //can only get 100 tweets, so notify the user if there were only 100 tweets collected
               console.log("response > 100");
               if (fileExist){ //says overwrote if file existed
                  res.send('<script>alert("overwrote ' + export_type + ' file with only 100 tweets because that is the max"); window.location.href = "index.html";</script>');    
                  return;
               }
               else{
                  res.send('<script>alert("created ' + export_type + ' file with only 100 tweets because that is the max"); window.location.href = "index.html";</script>');    
                  return;
               }
            }
            else{ //this part runs if the person did less than 100 tweets and everything went normally
              console.log("Response normal");
              if (fileExist){
              res.send('<script>alert("overwrote ' + export_type + ' file"); window.location.href = "index.html";</script>');
              return;
              }
              else{
              res.send('<script>alert("created ' + export_type + ' file"); window.location.href = "index.html";</script>');
              return;
              }
            }

          }


        });
        

      }
      else{ //if ti could never get tweet data it goes here
          console.log(error);
          res.send('<script>alert("error reading tweets"); window.location.href = "index.html";</script>');
          return;
      }
    });

  }
  

  else if (num != null){ //does the same thing except searches the geocode
    
    client.get('search/tweets', {
        geocode: geo,
        count: num

      }, function(error, tweets, response) {
         if (!error) {
          
        json_tweets = tweets.statuses;
        //console.log("hey1");
        //console.log(json_tweets);
        export_stuff(fName, export_type, json_tweets, num, function(result, fileExist){
          console.log(result + " result");
          console.log(fileExist + " fileExist");

          if(result == 2){
              console.log("response couldnt write file");
              res.send('<script>alert("could not write file"); window.location.href = "index.html";</script>');
              return;
          }
          else{

            if (num >=100){
               console.log("response > 100");
               if (fileExist){
                  res.send('<script>alert("overwrote ' + export_type + ' file with only 100 tweets because that is the max"); window.location.href = "index.html";</script>');    
                  return;
               }
               else{
                  res.send('<script>alert("created ' + export_type + ' file with only 100 tweets because that is the max"); window.location.href = "index.html";</script>');    
                  return;
               }
            }
            else{
              console.log("Response normal");
              if (fileExist){
              res.send('<script>alert("overwrote ' + export_type + ' file"); window.location.href = "index.html";</script>');
              return;
              }
              else{
              res.send('<script>alert("created ' + export_type + ' file"); window.location.href = "index.html";</script>');
              return;
              }
            }

          }


        });
        

      }
      else{
          console.log(error);
          res.send('<script>alert("error reading tweets"); window.location.href = "index.html";</script>');
          return;
      }
    });
  }
 */
});


app.post('/buildDB', function(req, res) {//build the database

  console.log(req.body.num);
    console.log(req.body.subject);
    var num =req.body.num;
    var subject = req.body.subject;
    var geo = "-73.68,42.72,5mi"; //couldnt figure out how to ge tlocations within a box but i could find this way to get a radius around the location
   
    if (subject == ""){
      subject = null;
    }
    if (num == ""){
      num = 25;
    }



     //if both values are set
    if (subject != null){
      //get the JSON with the 2 parameters
      client.get('search/tweets', {
        q: subject,
        count: num
      }, function(error, tweets, response) {
        if (!error) {
          tweets = tweets.statuses;
          MongoClient.connect(URL, function (err, db) {
                    if (err !== null) {
                        res.send('<script>alert("Connection to DB could not be established"); <script>window.location.href = "index.html";</script>');
                        return;
                    }
                    console.log("connected to DB");

                    db.collections(function (err, collections) {
                        var found = false;
                        _.forEach(collections, function (collection) {
                            if (collection.s.name == req.body.subject) {
                                found = true;
                            }
                        });
                        if (!found) { //create a new collection
                            console.log("collection not found: creating new one");
                            db.createCollection(req.body.subject, function (err, collection) {
                                console.log("created collection");
                                collection.insertMany(tweets, function (err) { //insert tweets
                                    if (err){
                                       console.log(err);
                                    }
                                    console.log("inserted");
                                    db.close();
                                    res.send('<script>alert("created collection"); window.location.href = "index.html";</script>');
                                    
                                    return;
                                });
                            });
                        }
                        else {
                            console.log("dropping old collection"); //drop the old data if it was there
                            var collection = db.collection(req.body.subject);
                            collection.drop(function (err) {
                                db.createCollection(req.body.subject, function (err, collection) {
                                    collection.insertMany(tweets, function (err) {
                                        db.close();
                                        console.log("going back");
                                        res.send('<script>alert("created collection"); window.location.href = "index.html";</script>');
                                    });
                                });
                            });
                        }
                    });
                });
          



          
        }
      });

    }
    else{ //same as before but saves under the colleciton of the geo code
      
      client.get('search/tweets', {
          geocode: geo,
          count: num

        }, function(error, tweets, response) {
          if (!error) {
              tweets = tweets.statuses;
              MongoClient.connect(URL, function (err, db) {
                    if (err !== null) {
                        res.send('<script>alert("Connection to DB could not be established"); <script>window.location.href = "index.html";</script>');
                        return;
                    }
                    console.log("connected to DB");

                    db.collections(function (err, collections) {
                        var found = false;
                        _.forEach(collections, function (collection) {
                            if (collection.s.name == req.body.geo) {
                                found = true;
                            }
                        });
                        if (!found) {
                            console.log("collection not found: creating new one");
                            db.createCollection(req.body.geo, function (err, collection) {
                                collection.insertMany(tweets, function (err) {
                                    db.close();
                                    res.send('<script>alert("created collection"); <script>window.location.href = "index.html";</script>');
                                });
                            });
                        }
                        else {
                            console.log("dropping old collection");
                            var collection = db.collection(req.body.subject);
                            collection.drop(function (err) {
                                db.createCollection(req.body.geo, function (err, collection) {
                                    collection.insertMany(tweets, function (err) {
                                        db.close();
                                        res.send('<script>alert("created collection"); <script>window.location.href = "index.html";</script>');
                                    });
                                });
                            });
                        }
                    });
                });
            
          }
      });
    }
    


});


app.post('/tweetsAPI', function(req, res) { //when the button gets pressed it goes to /tweets and gets the inputted value
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
      			res.send('<script>window.location.href = "tweets.html";</script>');
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


app.post('/visualize', function(req, res){
    res.send('<script>window.location.href="vis.html"</script>');

});





app.get('/vis', function(req, res){
  var num = req.query.num;
  var subject = req.query.subject; //|| "-73.68,42.72,5mi";
  if (num == '')
    num = 25;
  if (subject == "")
    subject = "-73.68,42.72,5mi"
  console.log(num + subject);
  client.get('search/tweets', { //get tweets from api

    q: subject,
    count: num
  }, function(error, tweets, response) {
      console.log(error);
      //console.log(tweets);
      if (!error){
        //set up variables to hold analytical data
        var langs = {};
        var time_zones = {};
        var favorites = {'over 100': 0, '50 to 100': 0, '10 to 50': 0, '5 to 10': 0, '1 to 5': 0, '0': 0};
        var sources = { 'iPhone': 0, 'Android': 0, 'web': 0, 'other': 0};
        //console.log(tweets);
        tweets = tweets.statuses
        var i = 0;

        

        while (i < num){ //while there are still tweets
          
          if (tweets[i]){ //if the tweet exsists (in case there arent enough tweets on subject)
          
            //determine language and add too correct map location
            if (langs[tweets[i].lang])
              langs[tweets[i].lang]++;
            
            else
              langs[tweets[i].lang] = 1;

            //determine timezone then add to map location
            if (time_zones[tweets[i].user.time_zone])
              time_zones[tweets[i].user.time_zone]++;
            
            else
              time_zones[tweets[i].user.time_zone] = 1;


            //place the amount of favorites in the map location it belongs in (6 different containers)
            if (tweets[i].favorite_count >= 100)
              favorites['over 100']++;
            
            else if (tweets[i].favorite_count >= 50)
              favorites['50 to 100']++;
            
            else if (tweets[i].favorite_count >= 10)
              favorites['10 to 50']++;
            
            else if (tweets[i].favorite_count >=5)
              favorites['5 to 10']++;
            
            else if (tweets[i].favorite_count >0)
              favorites['1 to 5']++;
            
            else 
              favorites['0']++;
            
            
            console.log(tweets[i].source);
            //see which source its from and place in correct container
            if (tweets[i].source.indexOf("web") != -1 || tweets[i].source.indexOf('Web Client') != -1)
              sources['web']++;
            else if(tweets[i].source.indexOf("iPhone") != -1)
              sources['iPhone']++;
            else if (tweets[i].source.indexOf("Android") != -1)
              sources['Android']++;
            else
              sources['other']++;

            i++;
           
            }
            else{ //tweet doesnt exist so there are none left and its less than actuall amount
              i = num; //say it finished
              break; //exit loop

            }
        

        }

        if (i == num){ //prevent it from sending before previous is completed
          console.log(langs);
          console.log(favorites);
          res.send({langs: langs, favorites: favorites, sources: sources, time_zones: time_zones});//send all variables back
        }
      }
    
    else{

      console.log(error);
      res.send("error");

    }


  });

  
});





app.post('/tweetsDB', function(req, res) { //read from database
    console.log(req.body.fileName);
    console.log(req.body.subject);
    console.log(req.body.num);
    

    MongoClient.connect(URL, function (err, db) {
                if (err) {
                  res.send('<script>alert("could not connect to DB");window.location.href = "index.html";</scipt>');
                }

                db.collections(function (err, collections) {
                    var found = false;
                    _.forEach(collections, function (collection) {
                        if (collection.s.name == req.body.subject) {
                            found = true;
                            num = Number(req.body.num);
                            console.log(num);
                            collection.find().limit(num).toArray(function (err, data){
                                //console.log(data);
                                var location = "public/streln-tweets.json";
                                fs.writeFile(location, JSON.stringify(data)); //write the file
                                //console.log(tweets);
                                res.send('<script>window.location.href = "tweetsDB.html";</script>') //changed to the view to display the tweets
                                db.close();


                            });
                            
                            
                          
                        }
                    });
                    if (!found) {
                        console.log("collection not found");
                        res.send('<script>alert("No Collections Match Your Search");window.location.href = "index.html";</scipt>');
                    }
                });
            });

   

});

//listen for connections
app.listen(3000, function () {
    console.log("Listening on port 3000");
});