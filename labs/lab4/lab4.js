
    // Instantiate the myApp Angular application that we attached to out html tag
    var app = angular.module("myApp", []);

    //set up the controller for the app
    app.controller("mainController", ['$scope','$http',function($scope, $http) {

  
        //watch what the view variable is when switching between tabs
        $scope.$watch("view",function(nv,ov){
            if (nv==1){
               
                //this api is useful for getting around the https requirements for chrome when getting the location. its not as accurate though
                 $.getJSON('http://ip-api.com/json', getWeather);
                 $.getJSON('http://ip-api.com/json', getForecast);
                
            }
            if (nv==2){

                

                $.getJSON('https://www.googleapis.com/youtube/v3/videos?', {
                    part: "snippet",
                    chart: "mostPopular",
                    maxResults: "20",
                    key: "AIzaSyDPDV0h0P5wBNVT3cBFTkyO5v_jtjzUPCE"
                }, showVideos, 'jsonp');
            }
            
        })

    }]);
    


   


var showVideos = function(data) {

    console.log(data.items)
    $("#videos").html("");
      $.each(data.items, function (index, element) {
            var insert = "<li class='videos list-group-item'> <a href = 'https://youtube.com/watch?v=" + element.id + "'> <span class= 'picture col-sm-6 col-md-6'><img src = '" + element.snippet.thumbnails.default.url  +  "'/></span><span class= 'title col-sm-6 col-md-6'>" + element.snippet.title + "</span></a></li>";
            $("#videos").append(insert);
      });

}



var getForecast = function(data) {
    $.getJSON('http://api.openweathermap.org/data/2.5/forecast?', {
        lat: data.lat,
        lon: data.lon,
        appid: "7173682ad51a968f8f77bffc3e45fb87",
        units: "imperial"
    }, showForecast, 'jsonp');
};



var showForecast = function(data) {

    var daysUsed = [];
                $.each(data.list, function (index, element) {
                    
                        var temp = element.main.temp + "F";
                        var humidity = element.main.humidity + "%";
                        var description = element.weather[0].main + ": " + element.weather[0].description;
                        var date = new Date(element.dt * 1000);
                        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                        var day = days[date.getDay()];  //getDay reutrns the day of the week it will be as a number, so the list above makes it easy to choose the date
                        var dayTemp = "#" + day + "temp";
                    if (!daysUsed.includes(day)){
                        daysUsed.push(day);
                        var insert  = "<li id= '" + day + "' class = 'list-group-item forecastItem'><div class = 'wtitle'>"+ day +"</div><div id= '" + day + "Stuff' class= 'forecastDay'><div id = '"+ day + "Temp' class='temperature'>Temperature: " + temp + "</div><div class = 'description'>" + description + "</div><div class = 'humidity'>" + humidity + "</div></div></li>";
                        $("#days").append(insert);
                    }
                    else if (temp > $(dayTemp).html()) 
                        $(dayTemp).html("Temperature: " +temp);
                });
               
                $("#forecast").fadeIn(600);
};




var getWeather = function(data) {
    var mapInsert ="<iframe width='400' height='500' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/view?key=AIzaSyDPDV0h0P5wBNVT3cBFTkyO5v_jtjzUPCE&center=" + data.lat+ "," + data.lon + "&zoom=18&maptype=satellite' allowfullscreen></iframe>"

        $("#mapPlace").html(mapInsert);

    $.getJSON('http://api.openweathermap.org/data/2.5/weather?', {
        lat: data.lat,
        lon: data.lon,
        appid: "7173682ad51a968f8f77bffc3e45fb87",
        units: "imperial"
    }, showWeather, 'jsonp');
};

var showWeather = function(data) {
                 var city = data.name;
                var temperature = data.main.temp;
                var humidity = data.main.humidity + "%";
                var description = data.weather[0].main + ": " +data.weather[0].description;
                var icon = "<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png' alt='" + description + "'>";
                
                //reset the contents inside each id location because each time you click this tab it will reload all the stuff.
             
                $("#city").html("Current Location: " + city);
                
                $("#temperature").html(temperature + "F");
                
                $("#humidity").html("Humidity: " + humidity);
               
                $("#description").html(description);
                
                $("#icon").html(icon);
                
                $("#currentWeather").fadeIn(600);
    
};