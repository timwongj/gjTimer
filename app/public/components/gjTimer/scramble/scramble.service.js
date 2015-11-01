(function() {

  'use strict';

  function ScrambleService() {

    var self = this;

    /**
     * Gets the scramble state of the current scramble.
     * This is used by the cub component to draw the scramble.
     * @returns {string}
     */
    self.getScrambleState = function() {

      return self.scramble.state;

    };

    /**
     * Uses the jsss library to generate a new scramble for the event.
     * @param eventId
     * @returns {string}
     */
    self.getNewScramble = function(eventId) {

      self.scramble = scramblers[eventId].getRandomScramble();

      if (self.scramble.scramble_string.substring(self.scramble.scramble_string.length - 1, self.scramble.scramble_string.length) === ' ') {
        return self.scramble.scramble_string.substring(0, self.scramble.scramble_string.length - 1);
      } else {
        return self.scramble.scramble_string;
      }

    };

  }

  angular.module('scramble').service('ScrambleService', ScrambleService);

})();
