(function() {

  'use strict';

  function timerDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/timer/timer.html',
      controller: 'TimerController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '=',
        results: '=',
        scramble: '=',
        sessionId: '=',
        settings: '='
      },
      bindToController: true
    };
  }

  angular.module('timer', []).directive('timer', timerDirective);

})();
