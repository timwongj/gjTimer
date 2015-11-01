(function() {

  'use strict';

  function timerDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/timer/timer.html',
      controller: 'TimerController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '=',
        scramble: '=',
        sessionId: '=',
        settings: '='
      }
    };
  }

  angular.module('timer', []).directive('timer', timerDirective);

})();
