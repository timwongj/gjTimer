(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService) {

    var self = this;

    $scope.$on('new scramble', function($event, event) {
      $scope.scramble = ScrambleService.newScramble(event);
      self.scramble = $sce.trustAsHtml($scope.scramble);
      $rootScope.$broadcast('draw scramble', event, ScrambleService.getScrambleState());
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', ScrambleController]);

})();
