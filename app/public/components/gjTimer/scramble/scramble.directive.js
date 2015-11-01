(function() {

  'use strict';

  function scrambleDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/scramble/scramble.html',
      controller: 'ScrambleController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '=',
        scramble: '='
      }
    };
  }

  angular.module('scramble', []).directive('scramble', scrambleDirective);

})();
