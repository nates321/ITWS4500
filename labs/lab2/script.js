var APIkey = "69ba0bf66c2926a797a91ae4fb6fda54";

function getWeather() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
		
		
		var mapInsert ="<iframe width='400' height='500' frameborder='0' style='border:0' src='https://www.google.com/maps/embed/v1/view?key=AIzaSyDPDV0h0P5wBNVT3cBFTkyO5v_jtjzUPCE&center=" + latitude+ "," + longitude + "&zoom=18&maptype=satellite' allowfullscreen></iframe>"

		$("#mapPlace").append(mapInsert);
		//$("#currentWeather").show();
		
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + APIkey,
            
            success: function (data) {
                var city = data.name;
                var temperature = data.main.temp;
                var humidity = data.main.humidity + "%";
                var description = data.weather[0].main + ": " +data.weather[0].description;
                var icon = "<img src='http://openweathermap.org/img/w/" + data.weather[0].icon + ".png' alt='" + description + "'>";
                

                $("#city").append("Current Location: " + city);
                $("#temperature").append(temperature + "F");
                $("#humidity").append("Humidity: " + humidity);
                $("#description").append(description);
                $("#icon").append(icon);
                
				$("#currentWeather").fadeIn(600);
            },
            error: function() {
                alert("error");
            }
        });
    });
}

function getForecast() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
	
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=" + APIkey,
            success: function (data) {
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
						var insert  = "<li id= '" + day + "' class = 'list-group-item forecastItem'><div class = 'title'>"+ day +"</div><div id= '" + day + "Stuff' class= 'forecastDay'><div id = '"+ day + "Temp' class='temperature'>Temperature: " + temp + "</div><div class = 'description'>" + description + "</div><div class = 'humidity'>" + humidity + "</div></div></li>";
						$("#days").append(insert);
					}
					else if (temp > $(dayTemp).html()) 
						$(dayTemp).html("Temperature: " +temp);
                });
               
                $("#forecast").fadeIn(600);
            },
            error: function() {
               
            }
        });
    });
}


$(getWeather());

$(getForecast());

