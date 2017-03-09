NAthan STrelser
661476303
streln

resources used:

stack overflow 
twitter node package
twitter api resource


for the angular part i used the $http  angualr variable to call the json
file and then called funcions using the response data

the node server loads the index page, when you search it posts the data to the server, then the twitter module calls the api whic hreturns the data which gets written to a file using fs. it then responds with script to load the page the shows the tweets

using the default geocode diudnt seem like it was working but eventually it got 1 tweet when i expanded the range. i dont know why, there possibly are no tweets in the area with geolocation on