(function() {

  'use strict';

  function menuBarDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/menuBar/menuBar.html',
      controller: 'MenuBarController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '=',
        sessionId: '=',
        settings: '='
      },
      bindToController: true
    };
  }

  angular.module('menuBar', []).directive('menuBar', menuBarDirective);

})();
