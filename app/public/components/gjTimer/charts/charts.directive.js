(function() {

  'use strict';

  function chartsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/charts/charts.html',
      controller: 'ChartsController',
      controllerAs: 'ctrl',
      scope: {
        results: '=',
        settings: '='
      },
      bindToController: true
    };
  }

  angular.module('charts', []).directive('charts', chartsDirective);

})();
