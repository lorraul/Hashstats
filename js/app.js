
angular.module('HashStats', ['ngRoute', 'chart.js']);

angular.module('HashStats')

.run(function($rootScope, $http) {
    $rootScope.message = '';
    $rootScope.statsData = 'empty';
})

    
//routing
.config(function ($routeProvider) {
    $routeProvider
        .when('/form', {
          controller: 'FormController',
          templateUrl: 'pages/form.html',
          resolve: {
              configdata: function(configData){ return configData(); }
          }
        })
        .when('/loading', { 
          controller: 'LoadController', 
          templateUrl: 'pages/load.html', 
          resolve: {
              configdata: function(configData){ return configData(); }
          }
        })
        .when('/home', { 
          controller: 'HomeController', 
          templateUrl: 'pages/home.html' 
        })
        .when('/tweets/:keyword/:page', { 
          controller: 'TweetsController', 
          templateUrl: 'pages/tweets.html' 
        })
        .when('/sentiment', { 
          controller: 'SentimentController', 
          templateUrl: 'pages/sentiment.html' 
        })
        .when('/wordcount', { 
          controller: 'WordController', 
          templateUrl: 'pages/wordcount.html' 
        })
        .when('/lang', { 
          controller: 'LangController', 
          templateUrl: 'pages/lang.html' 
        })
        .when('/savepdf', { 
          controller: 'PdfController', 
          templateUrl: 'pages/savepdf.html' 
        })
        .otherwise({ 
          redirectTo: '/form' 
        }); 
});