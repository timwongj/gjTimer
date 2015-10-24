(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, ScrambleService) {

    var self = this;

    $scope.$on('new scramble', function($event, puzzle) {
      self.scramble = ScrambleService.newScramble(puzzle);
      $rootScope.scramble = self.scramble;
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', 'ScrambleService', ScrambleController]);

})();