
function sortDecr(obj){
        var sortable = [];
        for (var lang in obj)
            sortable.push([lang, obj[lang]]);
        sortable.sort(function(a, b) {return -(a[1] - b[1])});
        return sortable;
    };

var app = angular.module('HashStats', ['ngRoute']);

app.run(function($rootScope, $http) {
    $rootScope.fileContent = 'no file';
    $rootScope.configInfo = 'no config';
    var configLocation = location.origin + location.pathname;
    configLocation = configLocation.substring(0, configLocation.lastIndexOf('/'));
    $http.get(configLocation+'/stats/configinfo.php').then(function(data) {
        $rootScope.configInfo = data.data;
    }, function(error){
        $rootScope.configInfo = 'error';
    });
});

    
//routing
app.config(function ($routeProvider) {
    $routeProvider
        .when('/form', {
          controller: 'FormController',
          templateUrl: 'pages/form.html' 
        })
        .when('/loading', { 
          controller: 'LoadController', 
          templateUrl: 'pages/load.html' 
        })
        .when('/home', { 
          controller: 'HomeController', 
          templateUrl: 'pages/home.html' 
        })
        .when('/tweets', { 
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
          controller: 'PDFController', 
          templateUrl: 'pages/savepdf.html' 
        })
        .otherwise({ 
          redirectTo: '/home' 
        }); 
});

//controllers    

app.controller('FormController', function ($scope, $http, $rootScope, $location) {
    //var getContent = function(filename){ return $http.get('sample.json'); };
    var getContent = function(keyword){
        var location = window.location.href.substring(0, window.location.href.lastIndexOf('#'));
        return $http.get(location+'/stats/stats.php?keyword='+encodeURIComponent(keyword)); 
    };
    
    $scope.error = '';
    $scope.configInfo = function() { return $rootScope.configInfo; };
    
    $scope.$watch('configInfo()', function() {
        if ( $scope.configInfo() === 'error' ) { $scope.error = 'configinfo loading error'; }
    });
    
    $scope.keyword = '';
    $scope.submit = function() {
        $rootScope.fileContent = 'no file'; //reset for no early redirect in LoadController
        getContent($scope.keyword).then(
            function(data) { 
                $rootScope.fileContent = data.data; 
            }, 
            function(error){ 
                $rootScope.fileContent = 'error';
            }
        );
        $scope.filecontent = function() { return $rootScope.fileContent; }
        $location.path('/loading');
    };
});

app.controller('LoadController', function ($scope, $rootScope, $location) {
    
    var countdown = function(duration){
        var duration, minutes, seconds, display = document.querySelector('#timer');
        display.textContent = '99:99';
        setInterval(function(){ 
            minutes = parseInt(duration / 60, 10);
            seconds = parseInt(duration % 60, 10);
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            display.textContent = minutes + ':' + seconds;
            if (--duration < 0) { duration = 0; }
        }, 1000);
    };   
    
    $scope.filecontent = function() { return $rootScope.fileContent; }
    $scope.configInfo = function() { return $rootScope.configInfo; }
    
    $scope.$watch('configInfo()', function() {
        if (typeof $scope.configInfo() !== 'string') {
            $scope.estimatedTime = $scope.configInfo().estimatedtime;
            countdown($scope.estimatedTime);
        }
    });
    
    $scope.$watch('filecontent()', function () {
        if ($scope.filecontent() != 'no file') {
          $location.path('/home');
        }
    }); 
});

app.controller('HomeController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
    $scope.error = '';
    if ( $scope.filecontent() === 'error' ) { $scope.error = 'stats loading error'; }
});
    
app.controller('TweetsController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
    $scope.tweets = $scope.filecontent().tweets;
});
 

app.controller('WordController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
   
    $scope.formobj = {
        hidekw: false
    };

    if (typeof $scope.filecontent() !== 'string') {
        $scope.words = JSON.parse(JSON.stringify($scope.filecontent().word_count));
        $scope.mainkeyword = $scope.filecontent().meta.keyword;
        $scope.mainvalue = $scope.filecontent().word_count[$scope.mainkeyword];  
        $scope.$watch('formobj.hidekw', function () {
            if ($scope.formobj.hidekw == true) {
                delete $scope.words[$scope.mainkeyword]; 
                $scope.max = Math.max.apply(null, Object.keys($scope.words).map(function(key) { return $scope.words[key]; }));
            } else {
                $scope.words[$scope.mainkeyword] = $scope.mainvalue;
                $scope.max = Math.max.apply(null, Object.keys($scope.words).map(function(key) { return $scope.words[key]; }));
            }
        }); 
    }
});
    

app.requires.push('chart.js');

app.controller('SentimentController', function ($scope, $rootScope) {

    $scope.filecontent = function() { return $rootScope.fileContent; }
    
    $scope.sentimentPercent = [];
    $scope.labels = [];
    $scope.sentcount = [];
    $scope.colours = ['#8DB600','#FDB600','#DC143C','#907B3B'];
    $scope.options = {
      'animation' : false,
    };

    if (typeof $scope.filecontent() !== 'string') { 
        $scope.sentimentPercent["positive"] = Math.round(($scope.filecontent().sentiment.positive*100)/$scope.filecontent().meta.numtweets);
        $scope.sentimentPercent["neutral"] = Math.round(($scope.filecontent().sentiment.neutral*100)/$scope.filecontent().meta.numtweets);
        $scope.sentimentPercent["negative"] = Math.round(($scope.filecontent().sentiment.negative*100)/$scope.filecontent().meta.numtweets);
        $scope.sentimentPercent["undef"] = Math.round(($scope.filecontent().sentiment.undefined*100)/$scope.filecontent().meta.numtweets);
        $scope.labels = Object.keys($scope.filecontent().sentiment);
        $scope.sentcount = Object.keys($scope.filecontent().sentiment).map(function (key) {return $scope.filecontent().sentiment[key]});
    };

});

app.controller('LangController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }

    $scope.colours = ['#8DB600','#FDB600','#DC143C','#907B3B'];
    $scope.options = {
      'animation' : false,
      'responsive': true,
      'maintainAspectRatio': false
    };
    $scope.labels = [];
    $scope.langcount = [];
    $scope.langonce = '';

    if (typeof $scope.filecontent() !== 'string') {
        
        $scope.lang = sortDecr($scope.filecontent().lang);

        for (var i = 0; i < $scope.lang.length; i++) {
            if ($scope.lang[i][1] <= 1) { $scope.langonce = $scope.langonce + $scope.lang[i][0] + ', ';  continue; }
            $scope.labels.push($scope.lang[i][0]);
            $scope.langcount.push($scope.lang[i][1]);
        }

        $scope.langcount = [$scope.langcount];
    }
});

app.controller('PDFController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
    if (typeof $scope.filecontent() !== 'string') {
        $scope.created = createPDF($scope.filecontent());
    }
});

//directives

app.directive('tweet', function(){
    return{
      restrict: 'E',
    scope: {
        info: '='
    },
    templateUrl: 'pages/tweet.html'
  };
});