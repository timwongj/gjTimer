(function() {

  'use strict';

  function menuBarDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/menuBar/menuBar.html',
      controller: 'MenuBarController',
      controllerAs: 'ctrl',
      scope: {
        event: '=',
        sessionId: '=',
        settings: '='
      }
    };
  }

  angular.module('menuBar', []).directive('menuBar', menuBarDirective);

})();