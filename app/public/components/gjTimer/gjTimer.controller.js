(function() {

  'use strict';

  function GjTimerController($scope, $rootScope) {

    var COLOR_WHITE = '#FFFFFF';
    var COLOR_DARK_GRAY = 'rgba(0, 0 , 0, 0.8)';

    $scope.style = {
      body: {},
      section: {},
      timer: {}
    };

    $scope.keydown = function(event) {
      $rootScope.$broadcast('keydown', event);
    };

    $scope.keyup = function(event) {
      $rootScope.$broadcast('keyup', event);
    };

    $scope.$on('timer focus', function() {
      $scope.style.body = { 'background-color': COLOR_DARK_GRAY };
      $scope.style.section = { 'display': 'none' };
      $scope.style.timer = { 'margin-top': '4.5625em' };
    });

    $scope.$on('timer unfocus', function() {
      $scope.style.body = { 'background-color': COLOR_WHITE };
      $scope.style.section = { 'display': 'block' };
      $scope.style.timer = { 'margin-top': '0' };
    });

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', GjTimerController]);

})();
