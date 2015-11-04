(function() {

  'use strict';

  function StatisticsController($scope, StatisticsService) {

    var self = this;
    
    $scope.$watch('results', function() {
      self.statistics = StatisticsService.getStatistics($scope.results);
    });

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', 'StatisticsService', StatisticsController]);

})();
