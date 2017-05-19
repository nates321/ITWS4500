(function(angular) {
   'use strict';
   var app = angular.module('quizApp', ['chart.js']);
   app.controller('quizCtrl', function($scope, $http, $window) {
     
   	$scope.temps = [];
   	$scope.zip = null;
   	$scope.view = 0;
   	$scope.barLabels = [];
   	$scope.barValues = [];
   	$scope.series = ['Temperatures'];

    //ADD a new temperature to to the database
   	$scope.add = function(){
   		console.log('in add');
   		$http({ //post the zip to the server to add
   			url: '/weather',
   			method: 'POST',
   			params: {
   				zip: $scope.zip
   			}
   		}).then(

     	function successCallback(response){
      		console.log(response);
      		if (response.data != 'invalid zip code'){	//if it inserted
      			$scope.view = 1;
      			alert('inserted');
      		}
      		else
      			alert('Invalid zip code, try again'); //if it didnt
            
      		},
      		function errorCallback(response){

      			console.log(response);
      		}


      	
     	);


   	}
    $scope.show = function(){ //get temperatures from DB
     	$http({
     		url: '/getTemps',
     		method: 'GET'
     	}).then(

     	function successCallback(response){
      			$scope.temps = response.data; //set the temps varibale
            	$scope.displayed = 1;
            	for (var i = 0; i < $scope.temps.length; i++){ //add the labels and values for the bar graph
            		$scope.barValues.push($scope.temps[i].temp);
            		$scope.barLabels.push($scope.temps[i].location);

            	}
            	console.log($scope.barLabels);
            	
      		},
      		function errorCallback(response){

      			console.log(response);
      		}


      	
     	);

     };

   $scope.output = function(){ //output to the file
     	$http({
     		url: '/output',
     		method: 'GET'
     	}).then(

     	function successCallback(response){
      			alert(response.data); //alert whether it succeeded or not
            	
      		},
      		function errorCallback(response){

      			console.log(response);
      		}


      	
     	);

     };


   });

})(window.angular);


