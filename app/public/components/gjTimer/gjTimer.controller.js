(function() {

  'use strict';

  function GjTimerController($scope, $rootScope) {

    var COLOR_BACKGROUND_DEFAULT = '#FFFFFF'; // white
    var COLOR_BACKGROUND_FOCUS = '#EEEEEE'; // gray
    var SPACEBAR_KEY_CODE = 32, ENTER_KEY_CODE = 13;

    $scope.style = {
      body: {},
      section: {},
      timer: {}
    };

    $scope.keydown = function(event) {

      if (event.keyCode === ENTER_KEY_CODE) {
        $rootScope.$broadcast('new scramble', $scope.event);
      } else if (event.keyCode === SPACEBAR_KEY_CODE) {
        event.preventDefault();
      }
      $rootScope.$broadcast('keydown', event);

    };

    $scope.keyup = function(event) {

      $rootScope.$broadcast('keyup', event);

    };

    $scope.$on('timer focus', function() {

      $scope.style.body = { 'background-color': COLOR_BACKGROUND_FOCUS };
      $scope.style.section = { 'display': 'none' };
      $scope.style.timer = { 'margin-top': '2.9375em' };

    });

    $scope.$on('timer unfocus', function() {

      $scope.style.body = { 'background-color': COLOR_BACKGROUND_DEFAULT };
      $scope.style.section = { 'display': 'block' };
      $scope.style.timer = {};

    });

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', GjTimerController]);

})();
