function add_tweets(key, responseData){
    var tweet = responseData[key];
     console.log(tweet);     
			 
	if (tweet){
		if (tweet.user.profile_image_url){
			return ("<li class=\"list-group-item tweets\" id='" + key + "'><img src=\"" + tweet.user.profile_image_url + "\">" + "<strong>" + tweet.user.name + "</strong><span class=\"screen\"> @" + tweet.user.screen_name + "</span><br />" + tweet.text + "</li>");
		}
		else 
			return ("<li class=\"list-group-item tweets\" id='" + key + "'><img src=\"egg.jpg\">" + "<strong>" + tweet.user.name + "</strong> <span class=\"screen\"> @" + tweet.user.screen_name + "</span><br />" + tweet.text + "</li>");
        }
        return "";                         
}

function add_hashtags(key, responseData, hashtags){//add hastags
	var tweet = responseData[key];
	console.log(tweet);
	if (tweet.entities.hashtags.length != 0){ //only run if there is a hashtag
					
		if (hashtags <5){
			$("ul.hashtag").append("<li class = \"list-group-item hashtags\"><a href=\"https://twitter.com/hashtag/" + tweet.entities.hashtags[0].text +"\"> #" + tweet.entities.hashtags[0].text + "</a></li>");
			$("li.hashtags:last").hide().animate({
				height: "toggle"
			}, 700);
		}
		else{									
			$("li.hashtags:first").hide().remove();
			$("li.hashtags:last").after("<li class = \"list-group-item hashtags\"><a href=\"https://twitter.com/hashtag/" + tweet.entities.hashtags[0].text +"\"> #" + tweet.entities.hashtags[0].text + "</a></li>").hide().show(400);
			$("li.hashtags:last").hide().animate({
				height: "toggle"
			}, 700);
		}
		return true;
	}
	return false;
}
		  
function ticker(key, responseData, hashtags) {

	$("li.tweets:first").slideUp(500).delay(500).remove();             
	
	$("li.tweets:last").after(add_tweets(key, responseData, hashtags));//add the next tweet
	$("li.tweets:last").hide().animate({
		height: "toggle"
	}, 500);
	if (add_hashtags(key, responseData, hashtags)){
		hashtags++;
	}
	key ++;
    if (responseData[key])
    	setTimeout(ticker, 3000, key, responseData, hashtags);//wait before going again
    else{
    	key = 0;
    	setTimeout(ticker, 3000, key, responseData, hashtags);//wait before going again
    }
}
          



var ang = angular.module('myApp', []);

ang.controller('myController', function($scope, $http) {
	$http({ //get the json created by the node server file
        url: 'streln-tweets.json',
        method: 'GET',
        
    }).then(
    	function successCallback(response) { //if it can retrieve it
    		var hashtags = 0;
   			console.log(response.data);
			for (key=0; key<5; key++){ //add the first five tweets
				$("ul.tweet").append(add_tweets(key, response.data.statuses, hashtags));
				if (add_hashtags(key, response.data.statuses, hashtags)){
					hashtags++;
				}
				$("li.tweets:last").hide().animate({
					height: "toggle"
				}, 500);
			}
			setTimeout(ticker, 3000, key, response.data.statuses, hashtags);

    	}, function errorCallback(response) {
            console.log(response);
        }

    );
});