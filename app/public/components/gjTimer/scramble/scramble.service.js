(function() {

  'use strict';

  function ScrambleService(Events) {

    var self = this;

    /**
     * Gets the current scramble string.
     * @returns {*}
     */
    self.getScramble = function() {

      return self.scramble.scramble_string;

    };

    /**
     * Gets the scramble state of the current scramble.
     * This is used by the cub component to draw the scramble.
     * @returns {*}
     */
    self.getScrambleState = function() {

      return self.scramble.state;

    };

    /**
     * Uses the jsss library to generate a new scramble for the event.
     * @param event
     * @returns {*}
     */
    self.newScramble = function(event) {

      self.scramble = scramblers[Events.getEventId(event)].getRandomScramble();

      return self.scramble.scramble_string;

    };

  }

  angular.module('scramble').service('ScrambleService', ['Events', ScrambleService]);

})();
