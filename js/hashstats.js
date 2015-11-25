var app = angular.module('HashStats', ['ngRoute']);
    
app.run(function($rootScope) {
    $rootScope.fileContent = 'no file';
    //$rootScope.kwCount = 0;
})    

    
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
    .when('/wordcount', { 
      controller: 'WordController', 
      templateUrl: 'pages/wordcount.html' 
    })
    .when('/lang', { 
      controller: 'LangController', 
      templateUrl: 'pages/lang.html' 
    })
    .otherwise({ 
      redirectTo: '/home' 
    }); 
});

//controllers    
app.controller('FormController', function ($scope, $http, $rootScope, $location) {
    //var getContent = function(filename){ return $http.get('sample.json'); };
    var getContent = function(filename){
        var location = window.location.href.substring(0, window.location.href.lastIndexOf('#'));
        return $http.get(location+'/stats/stats.php?keyword='+encodeURIComponent(filename)); 
    };
    $scope.text = '';
    $scope.kw = '';
    $scope.submit = function() {
        $rootScope.fileContent = 'no file';
        if ($scope.text) {
            $scope.kw = this.text;
            $scope.$watch('kw', function() {
                getContent($scope.kw).then(
                    function(data) { 
                        $rootScope.fileContent = data.data; 
                        $rootScope.kwCount = data.data.word_count[data.data.meta.keyword]; 
                    }, 
                    function(error){ $scope.filecontent = function() { return 'file not found'; } }
                );
                $scope.filecontent = function() { return $rootScope.fileContent; }
                
            });
            $location.path('/loading');
        }
    };
});

app.controller('LoadController', function ($scope, $rootScope, $location) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
    $scope.$watch('filecontent()', function () {
        if ($scope.filecontent() != 'no file') {
          $location.path('/home');
        }
    }); 
});

app.controller('HomeController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
});
    
app.controller('TweetsController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
    $scope.tweets = $scope.filecontent().tweets;
});
 

app.controller('WordController', function ($scope, $rootScope) {
    $scope.filecontent = function() { return $rootScope.fileContent; }
    //$scope.mainvalue = function() { return $rootScope.kwCount; } 
    
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

app.controller('LangController', function ($scope, $rootScope) {
    var sortDecr = function(ulang){
        var sortable = [];
        for (var lang in ulang)
            sortable.push([lang, ulang[lang]]);
        sortable.sort(function(a, b) {return -(a[1] - b[1])});
        return sortable;
    };
    $scope.filecontent = function() { return $rootScope.fileContent; }

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