(function() {

  'use strict';

  function resultsDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/results/results.html',
      controller: 'ResultsController',
      controllerAs: 'ctrl',
      scope: true
    };
  }

  angular.module('results', []).directive('results', resultsDirective);

})();