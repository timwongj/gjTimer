(function() {

  'use strict';

  function GjTimerController($scope, $rootScope, Constants) {

    $rootScope.isTyping = false;
    $scope.style = { body: {}, section: {}, timer: {} };

    $scope.keydown = function($event) {

      if (event.keyCode === Constants.KEY_CODES.ENTER) {
        if ($rootScope.isTypingComment) {
          event.preventDefault();
        } else if (!$rootScope.isTyping) {
          $rootScope.$broadcast('new scramble', $scope.eventId);
        }
      } else if (event.keyCode === Constants.KEY_CODES.SPACE_BAR) {
        event.preventDefault();
      }
      $rootScope.$broadcast('keydown', $event);

    };

    $scope.keyup = function($event) {

      $rootScope.$broadcast('keyup', $event);

    };

    $scope.$on('timer focus', function() {

      $scope.style.body = Constants.STYLES.BACKGROUND_COLOR.GRAY;
      $scope.style.section = { 'display': 'none' };
      $scope.style.timer = { 'margin-top': '2.9375em' };

    });

    $scope.$on('timer unfocus', function() {

      $scope.style.body = Constants.STYLES.BACKGROUND_COLOR.WHITE;
      $scope.style.section = { 'display': 'block' };
      $scope.style.timer = {};

    });

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', 'Constants', GjTimerController]);

})();
