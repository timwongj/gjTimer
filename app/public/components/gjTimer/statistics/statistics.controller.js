(function() {

  'use strict';

  function StatisticsController($scope, $rootScope, StatisticsService) {

    var self = this;

    self.results = StatisticsService.getResults($rootScope.sessionId);

    $scope.$on('refresh data', function() {
      self.results = StatisticsService.getResults($rootScope.sessionId);
    });

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', '$rootScope', 'StatisticsService', StatisticsController]);

})();