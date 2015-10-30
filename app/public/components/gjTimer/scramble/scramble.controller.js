(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService) {

    var self = this;

    var ENTER_KEY_CODE = 13;

    $scope.$on('new scramble', function() {
      $scope.scramble = ScrambleService.newScramble($scope.event);
      self.scramble = $sce.trustAsHtml($scope.scramble);
      $rootScope.$broadcast('draw scramble', ScrambleService.getScrambleState());
    });

    $scope.$on('keydown', function() {
      if (event.keyCode === ENTER_KEY_CODE) {
        $scope.scramble = ScrambleService.newScramble($scope.event);
        self.scramble = $sce.trustAsHtml($scope.scramble);
        $rootScope.$broadcast('draw scramble', ScrambleService.getScrambleState());
      }
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', ScrambleController]);

})();
