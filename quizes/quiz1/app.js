var express = require('express');
var request = require('request');


var app = express();

//how to use the parser to find the form values
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended : false }));

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('public/index.html');
});

app.post('/weather', function(req, res) { //when the button gets pressed it goes to /weather and finds the zip
    console.log(req.body.zip);
    var zip =req.body.zip;
    //var requestText = "'http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&units=metric&appid=69ba0bf66c2926a797a91ae4fb6fda54";
    //console.log(requestText);
    request("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + ",us&units=metric&appid=69ba0bf66c2926a797a91ae4fb6fda54", function (error, response, body) {
    //request calls the weather API then returns it in body        
        console.log(body);
        //parse the json
        jsonbody = JSON.parse(body);
        
        if (jsonbody.main != 'undefined'){
            var temp = parseInt(jsonbody.main.temp);
            console.log(temp);
            //See what the temperature is then send the response
            if (temp <= 0) {
                res.send("<p style='color: blue'>It is freezing in " + zip + "</p><a href = 'http://localhost:3000/'><button>New Zip code</button></a>")
            }

            else if (temp > 0 && temp < 11) {
                res.send("<p style='color: gray'>It is cold in " + zip + "</p><a href = 'http://localhost:3000/'><button>New Zip code</button></a>")
            }

            else if (temp >= 11 && temp <=25) {
                res.send("<p style='color: yellow'>It is warm in " + zip + "</p><a href = 'http://localhost:3000/'><button>New Zip code</button></a>")
            }

            else if (temp > 25) {
                res.send("<p style='color: red'>It is hot in " + zip + "</p><a href = 'http://localhost:3000/'><button>New Zip code</button></a>")
            }
        }
        else{
            console.log("invalid Zip Code");
                res.send("<p>Invalid Zip Code </p><a href = 'http://localhost:3000/'><button>New Zip code</button></a>");


        }

        
    });
});

//listen for connections
app.listen(3000, function () {
    console.log("Listening on port 3000");
});