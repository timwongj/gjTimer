(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, ScrambleService) {

    var self = this;

    var ENTER_KEY_CODE = 13;

    $scope.$on('new scramble', function($event, puzzle) {
      self.scramble = ScrambleService.newScramble(puzzle);
      $rootScope.scramble = self.scramble;
    });

    $scope.$on('keydown', function($event, event) {
      if (event.keyCode == ENTER_KEY_CODE) {
        self.scramble = ScrambleService.newScramble($rootScope.puzzle);
      }
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', 'ScrambleService', ScrambleController]);

})();