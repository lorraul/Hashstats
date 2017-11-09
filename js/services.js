//services

angular.module('HashStats')

    .factory('configData', ['$http', function ($http) {
        var configLocation = location.origin + location.pathname;
        configLocation = configLocation.substring(0, configLocation.lastIndexOf('/'));
        return function () {
            return $http.get(configLocation + '/stats/configinfo.php').then(
                function (response) {
                    return response.data;
                });
        };
}])

    .service('statsData', ['$http', '$rootScope', function ($http, $rootScope) {
        this.getStats = function (keyword) {
            $rootScope.statsData = 'empty'; //reset for no early redirect in LoadController
            var location = window.location.href.substring(0, window.location.href.lastIndexOf('#'));
            //$http.get('sample.json').then(
            $http.get(location + '/stats/stats.php?keyword=' + keyword).then(
                function (data) {
                    $rootScope.statsData = data.data;
                },
                function (error) {
                    $rootScope.message = 'Cannot load stats';
                    $rootScope.statsData = 'error';
                }
            );
            return 'rootscope set';
        };
}]);
