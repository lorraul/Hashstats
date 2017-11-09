//controllers    
angular.module('HashStats')

    .controller('AppController', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        var setmessage;
        $rootScope.$on("$routeChangeStart", function (event, current, previous) {
            setmessage = $timeout(function () {
                $rootScope.message = 'Loading';
            }, 1000);
        });
        $rootScope.$on("$routeChangeSuccess", function () {
            $timeout.cancel(setmessage);
            if ($rootScope.message == 'Loading') $rootScope.message = '';
        });
        $rootScope.$on("$routeChangeError", function () {
            $timeout.cancel(setmessage);
            $rootScope.message = 'Cannot load route';
        });
}])

    .controller('FormController', ['$scope', '$location', 'configdata', 'statsData', function ($scope, $location, configdata, statsData) {
        $scope.configInfo = configdata;
        $scope.keyword = '';
        $scope.submit = function () {
            statsData.getStats($scope.keyword);
            $location.path('/loading');
        };
}])

    .controller('LoadController', ['$scope', '$location', '$interval', 'configdata', function ($scope, $location, $interval, configdata) {
        $scope.estimatedTime = configdata.estimatedtime;
        $scope.valueNow = 0;
        $scope.timeLeft = $scope.estimatedTime;
        $interval(function () {
            $scope.valueNow++;
        }, ($scope.estimatedTime * 1000) / 100, 100);
        $interval(function () {
            $scope.timeLeft--;
        }, 1000, $scope.estimatedTime);
        $scope.$watch('statsData', function () {
            if (typeof $scope.statsData !== 'string') {
                $location.path('/home');
            }
        });
}])

    .controller('HomeController', ['$scope', function ($scope) {

}])

    .controller('TweetsController', ['$scope', '$routeParams', '$filter', function ($scope, $routeParams, $filter) {
        var filterKeyword = $routeParams.keyword;
        var numberOfTweets, filteredTweets;
        if (typeof $scope.statsData !== 'string')
            numberOfTweets = parseInt($scope.statsData.meta.numtweets);
        var tweets = $scope.statsData.tweets;
        var tweetsPerPage = 10;
        $scope.currentPage = $routeParams.page;
        var startTweet = ($scope.currentPage - 1) * tweetsPerPage;
        var endTweet = $scope.currentPage * tweetsPerPage;

        $scope.$watch('filterKeyword', function () {
            if (filterKeyword == 'all') {
                filteredTweets = tweets;
                $scope.tweetsIntro = 'Number of tweets: ' + $scope.statsData.meta.numtweets + '.';
            } else {
                filteredTweets = $filter('filter')(tweets, {
                    3: filterKeyword
                });
                $scope.tweetsIntro = 'Filtered by keyword: ' + filterKeyword + '.';
            }
            $scope.tweetsOnCurrentPage = filteredTweets.slice(startTweet, endTweet);
            console.log(filteredTweets.slice(startTweet, endTweet));
            var pageNumber = Math.ceil(filteredTweets.length / tweetsPerPage);
            var previousPage, nextPage;
            if ($scope.currentPage != 1) previousPage = parseInt($scope.currentPage) - 1;
            else previousPage = 1;
            if ($scope.currentPage != pageNumber) nextPage = parseInt($scope.currentPage) + 1;
            else nextPage = pageNumber;
            $scope.firstLink = '#/tweets/' + filterKeyword + '/1';
            $scope.lastLink = '#/tweets/' + filterKeyword + '/' + pageNumber;
            $scope.previousLink = '#/tweets/' + filterKeyword + '/' + previousPage;
            $scope.nextLink = '#/tweets/' + filterKeyword + '/' + nextPage;

            if ($scope.currentPage == 1) $scope.firstClass = 'disabled';
            else $scope.firstClass = '';
            if ($scope.currentPage == 1) $scope.previousClass = 'disabled';
            else $scope.previousClass = '';
            if ($scope.currentPage == pageNumber) $scope.nextClass = 'disabled';
            else $scope.nextClass = '';
            if ($scope.currentPage == pageNumber) $scope.lastClass = 'disabled';
            else $scope.lastClass = '';
        });
}])

    .controller('WordController', ['$scope', function ($scope) {
        $scope.hidebuttonText = 'Hide';
        $scope.hidebuttonClass = 'btn btn-success active';
        $scope.formobj = {
            hideKeyword: false
        };
        if (typeof $scope.statsData !== 'string') {
            $scope.words = JSON.parse(JSON.stringify($scope.statsData.word_count));
            $scope.mainkeyword = $scope.statsData.meta.keyword;
            $scope.mainvalue = $scope.words[$scope.mainkeyword];
            $scope.$watch('formobj.hideKeyword', function () {
                if ($scope.formobj.hideKeyword === true) {
                    $scope.hidebuttonText = 'Show';
                    $scope.hidebuttonClass = 'btn btn-info btn-s active';
                    delete $scope.words[$scope.mainkeyword];
                    $scope.max = Math.max.apply(null, Object.keys($scope.words).map(function (key) {
                        return $scope.words[key];
                    }));
                } else {
                    $scope.hidebuttonText = 'Hide';
                    $scope.hidebuttonClass = 'btn btn-success btn-s';
                    if (typeof ($scope.mainvalue) !== 'undefined') $scope.words[$scope.mainkeyword] = $scope.mainvalue;
                    $scope.max = Math.max.apply(null, Object.keys($scope.words).map(function (key) {
                        return $scope.words[key];
                    }));
                }
            });
        }
}])

    .controller('SentimentController', ['$scope', function ($scope) {
        $scope.sentimentPercent = [];
        $scope.labels = [];
        $scope.sentcount = [];
        $scope.colours = ['#8DB600', '#FDB600', '#DC143C', '#907B3B'];
        $scope.options = {
            'animation': false,
        };
        if (typeof $scope.statsData !== 'string') {
            $scope.sentimentPercent["positive"] = Math.round(($scope.statsData.sentiment.positive * 100) / $scope.statsData.meta.numtweets);
            $scope.sentimentPercent["neutral"] = Math.round(($scope.statsData.sentiment.neutral * 100) / $scope.statsData.meta.numtweets);
            $scope.sentimentPercent["negative"] = Math.round(($scope.statsData.sentiment.negative * 100) / $scope.statsData.meta.numtweets);
            $scope.sentimentPercent["undef"] = Math.round(($scope.statsData.sentiment.undefined * 100) / $scope.statsData.meta.numtweets);
            $scope.labels = Object.keys($scope.statsData.sentiment);
            $scope.sentcount = Object.keys($scope.statsData.sentiment).map(function (key) {
                return $scope.statsData.sentiment[key];
            });
        }
}])

    .controller('LangController', ['$scope', function ($scope) {
        $scope.colours = ['#8DB600', '#FDB600', '#DC143C', '#907B3B'];
        $scope.options = {
            'animation': false,
            'responsive': true,
            'maintainAspectRatio': false
        };
        $scope.labels = [];
        $scope.langcount = [];
        $scope.langonce = '';
        if (typeof $scope.statsData !== 'string') {
            $scope.lang = sortDecr($scope.statsData.lang);
            for (var i = 0; i < $scope.lang.length; i++) {
                if ($scope.lang[i][1] <= 1) {
                    $scope.langonce = $scope.langonce + $scope.lang[i][0] + ', ';
                    continue;
                }
                $scope.labels.push($scope.lang[i][0]);
                $scope.langcount.push($scope.lang[i][1]);
            }
            if ($scope.langonce === '') {
                $scope.langonce = 'non';
            }
            $scope.langcount = [$scope.langcount];
        }
}])

    .controller('PdfController', ['$scope', function ($scope) {
        if (typeof $scope.statsData !== 'string') {
            $scope.created = createPDF($scope.statsData);
        }
}]);
