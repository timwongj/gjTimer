(function() {

  'use strict';

  function statisticsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/statistics/statistics.html',
      controller: 'StatisticsController',
      controllerAs: 'ctrl',
      scopeId: {
        results: '='
      }
    };
  }

  angular.module('statistics', []).directive('statistics', statisticsDirective);

})();
