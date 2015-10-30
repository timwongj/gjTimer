(function() {

  'use strict';

  function cubDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/cub/cub.html',
      controller: 'CubController',
      controllerAs: 'ctrl',
      scope: {
        event: '='
      }
    };
  }

  angular.module('cub', []).directive('cub', cubDirective);

})();
