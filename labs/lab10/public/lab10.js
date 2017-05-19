(function(angular) {
   'use strict';
   var app = angular.module('visApp', ['chart.js']);
   app.controller('visCtrl', function($scope, $http, $window) {
      //used to display bills onto page
      $scope.num = 25;
      $scope.subject = '';
      $scope.options = {legend: {display: true}};
      $scope.langs = {};
      $scope.favorites = {};
      $scope.sources = {};
      $scope.timez = {};
      $scope.view= 0;
      $scope.pieLabels = [];
      $scope.pieValues = [];

      $scope.pieLabels2 = [];
      $scope.pieValues2 = [];

      $scope.pieLabels3 = [];
      $scope.pieValues3 = [];

      $scope.pieLabels4 = [];
      $scope.pieValues4 = [];
     

      $scope.submit = function(){
      	console.log("in submit");
      	$http({ //get tweets from nodes js
      		url: '/vis',
      		method: 'GET',
      		params: {
      			num: $scope.num,
      			subject: $scope.subject
      		}
      	}).then(
      		function successCallback(response){
      			console.log("in success");

      			//put data into scope variables to use to display graphs
      			$scope.langs = response.data.langs;
      			$scope.favorites = response.data.favorites;
      			$scope.sources = response.data.sources;
      			$scope.timez = response.data.time_zones;
      			$scope.pieLabels = Object.keys($scope.langs);      			
      			$scope.pieValues = Object.values($scope.langs);

      			$scope.pieLabels2 = Object.keys($scope.favorites);
      			$scope.pieValues2 = Object.values($scope.favorites);

      			$scope.pieLabels3 = Object.keys($scope.sources);
      			$scope.pieValues3 = Object.values($scope.sources);

      			$scope.pieLabels4 = Object.keys($scope.timez);
      			$scope.pieValues4 = Object.values($scope.timez);


            
      		},
      		function errorCallback(response){

      			console.log(response);
      		}


      	);


      }



      

   });

})(window.angular);
