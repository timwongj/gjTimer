(function() {

  'use strict';

  function ScrambleService(Events) {

    var self = this;

    self.getScramble = function() {
      return self.scramble;
    };

    self.newScramble = function(event) {
      self.scramble = scramblers[Events.getEventId(event)].getRandomScramble().scramble_string;
      return self.scramble;
    };

  }

  angular.module('scramble').service('ScrambleService', ['Events', ScrambleService]);

})();
