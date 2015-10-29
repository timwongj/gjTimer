(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService) {

    var self = this;

    var ENTER_KEY_CODE = 13;

    $scope.$on('new scramble', function($event, event) {
      $rootScope.scramble = ScrambleService.newScramble(event);
      self.scramble = $sce.trustAsHtml($rootScope.scramble);
      $rootScope.$broadcast('draw scramble', ScrambleService.getScrambleState());
    });

    $scope.$on('keydown', function($event, event) {
      if (event.keyCode === ENTER_KEY_CODE) {
        $rootScope.scramble = ScrambleService.newScramble(event);
        self.scramble = $sce.trustAsHtml($rootScope.scramble);
        $rootScope.$broadcast('draw scramble', ScrambleService.getScrambleState());
      }
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', ScrambleController]);

})();