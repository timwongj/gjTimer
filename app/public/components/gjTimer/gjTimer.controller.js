(function() {

  'use strict';

  function GjTimerController($scope, $rootScope, Constants) {

    $rootScope.isTyping = false;
    $scope.style = {};

    $scope.keydown = function($event) {

      if (!$rootScope.isTypingComment) {
        if (($event.keyCode === Constants.KEY_CODES.ENTER) && !$rootScope.isTyping) {
          $rootScope.$broadcast('new scramble', $scope.eventId);
        } else if ($event.keyCode === Constants.KEY_CODES.SPACE_BAR) {
          $event.preventDefault();
        }
        $rootScope.$broadcast('keydown', $event);
      }

    };

    $scope.keyup = function($event) {

      if (!$rootScope.isTypingComment) {
        $rootScope.$broadcast('keyup', $event);
      }

    };

    $scope.$on('timer focus', function() {

      $scope.style.body = $scope.settings.backgroundColor;
      $scope.settings.backgroundColor = $scope.settings.panelColor;
      $scope.style.section = { 'display': 'none' };
      $scope.style.timer = { 'margin-top': '2.9375em' };

    });

    $scope.$on('timer unfocus', function() {

      if ($scope.style.body) {
        $scope.settings.backgroundColor = $scope.style.body;
      }
      $scope.style.section = { 'display': 'block' };
      $scope.style.timer = {};

    });

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', 'Constants', GjTimerController]);

})();
