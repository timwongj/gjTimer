(function() {

  'use strict';

  function ScramblerService() {

    var Scrambler = function() {

      var self = this;

      self.scramble = "B' U F D U R L2 D' U2 F' D' L' F' U L' U' F' L2 D2 L";

    };

    Scrambler.prototype.getScramble = function() {
      return this.scramble;
    };

    return Scrambler;

  }

  angular.module('gjTimer').factory('Scrambler', ScramblerService);

})();
