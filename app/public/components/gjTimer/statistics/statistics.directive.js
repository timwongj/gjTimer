(function() {

  'use strict';

  function statisticsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/statistics/statistics.html',
      controller: 'StatisticsController',
      controllerAs: 'ctrl',
      scope: {
        results: '='
      },
      bindToController: true
    };
  }

  angular.module('statistics', []).directive('statistics', statisticsDirective);

})();
