(function() {

  'use strict';

  function GjTimerController($scope, $rootScope) {

    $scope.keydown = function(event) {
      $rootScope.$broadcast('keydown', event);
    };

    $scope.keyup = function(event) {
      $rootScope.$broadcast('keyup', event);
    };

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', GjTimerController]);

})();
