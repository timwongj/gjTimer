(function() {

  'use strict';

  function ScrambleService(Events) {

    var self = this;

    self.getScramble = function() {
      return self.scramble.scramble_string;
    };

    self.getScrambleState = function() {
      return self.scramble.state;
    };

    self.newScramble = function(event) {
      self.scramble = scramblers[Events.getEventId(event)].getRandomScramble();
      return self.scramble.scramble_string;
    };

  }

  angular.module('scramble').service('ScrambleService', ['Events', ScrambleService]);

})();
