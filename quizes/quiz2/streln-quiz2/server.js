var express = require('express');
var request = require('request');
var fs = require('fs');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quiz2');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

var app = express();

//how to use the parser to find the form values
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended : false }));

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('public/index.html');
});


//mongoose model to tmeplate insertions
var Temp = mongoose.model('temperature', {
    temp: Number,
    location: String,
    zip: Number
});



app.post('/weather', function(req, res) { //when the button gets pressed it goes to /weather and finds the zip
    console.log(req.query.zip);
    var zip =req.query.zip;
    //var requestText = "'http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&units=metric&appid=69ba0bf66c2926a797a91ae4fb6fda54";
    //console.log(requestText);
    request("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&units=metric&appid=69ba0bf66c2926a797a91ae4fb6fda54", function (error, response, body) {
    //request calls the weather API then returns it in body        
        
        //parse the json
        jsonbody = JSON.parse(body);
        console.log(jsonbody.cod);
        if (jsonbody.cod == 200){
            var temp = parseInt(jsonbody.main.temp);
            var location = jsonbody.name;
            console.log(location);
            var cur = new Temp({ //create a new Temp
                temp: temp,
                location: location,
                zip: zip
            });
            cur.save(function(err){ //save the temp
                if (err) {
                    console.log(err);
                }
                else{
                    res.end('success');
                }
            })

        }
        else{ //if the zipcode doesnt exist, it gives an error
            console.log("invalid Zip Code");
                res.end('invalid zip code');


        }

        
    });
});


app.get('/getTemps', function(req, res){ //get all temperatures in the DB

    console.log('getting temps');
    
    var query = Temp.find({});

    
    query.exec(function (err, docs){ //execute the query
        if (err!= null)
            console.log(err);
        //console.log(docs);


        res.send(docs); //send docs back to angular call

    });

});

app.get('/output', function(req, res){ //does the same thing as /getTemps but instead of sending the json file, it writes it to new .json file

    console.log('getting temps');
    
    var query = Temp.find({});

    
    query.exec(function (err, docs){ //execute the query
        if (err!= null)
            console.log(err);
        //console.log(docs);

        fs.writeFile('public/Q2Q1c-streln.json', JSON.stringify(docs, null, "\t"), function(err2){ //write the file, stringify to make it in json format with spacing
            if (!err2)
                res.send('success'); //send succes call back to angular call
            else
                res.send('fail');           

        });
        
        

    });

});


//listen for connections
app.listen(8000, function () {
    console.log("Listening on port 8000");
});