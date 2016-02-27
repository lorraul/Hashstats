//directives
angular.module('HashStats')

.directive('tweet', function(){
    return{
      restrict: 'E',
    scope: {
        info: '='
    },
    templateUrl: 'pages/tweet.html'
  };
});