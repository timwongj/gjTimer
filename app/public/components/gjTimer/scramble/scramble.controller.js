(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService, Events) {

    var self = this;

    newScramble(self.eventId);

    $scope.$on('new scramble', function($event, eventId) {

      newScramble(eventId);

    });

    function newScramble(eventId) {

      self.scramble = ScrambleService.getNewScramble(eventId);
      self.displayedScramble = $sce.trustAsHtml(self.scramble);
      self.scrambleStyle = Events.getEventStyle(eventId);
      self.state = ScrambleService.getScrambleState();
      $rootScope.$broadcast('draw scramble', eventId, ScrambleService.getScrambleState());

    }

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', 'Events', ScrambleController]);

})();
