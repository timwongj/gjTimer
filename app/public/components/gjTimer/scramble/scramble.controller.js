(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService, Events) {

    var self = this;

    newScramble(self.eventId);

    $scope.$on('new scramble', function($event, eventId) {

      newScramble(eventId);

    });

    function newScramble(eventId) {

      ScrambleService.getNewScrambleAsync(eventId)
        .then(function(scramble) {
          self.scramble = scramble;
          self.displayedScramble = $sce.trustAsHtml(self.scramble);
          self.scrambleStyle = Events.getEventStyle(eventId);
          $rootScope.$broadcast('draw scramble', eventId, ScrambleService.getScrambleState());
        });

    }

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', 'Events', ScrambleController]);

})();
