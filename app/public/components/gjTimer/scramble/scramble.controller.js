(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService, Events) {

    var self = this;

    $scope.$on('new scramble', function($event, event) {
      $scope.scramble = ScrambleService.newScramble(event);
      self.scramble = $sce.trustAsHtml($scope.scramble);
      self.scrambleStyle = Events.getEventStyle(event);
      $rootScope.$broadcast('draw scramble', event, ScrambleService.getScrambleState());
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', 'Events', ScrambleController]);

})();
