(function() {

  'use strict';

  function TimerService(LocalStorage, Calculator) {

    var self = this;

    /**
     * Gets the current time.
     * @param precision
     * @returns {string}
     */
    self.getTime = function(precision) {

      return Calculator.convertTimeFromMillisecondsToString(moment(Date.now() - self.startTime), precision);

    };

    /**
     * Starts the Timer.
     */
    self.startTimer = function() {

      self.startTime = Date.now();

    };

  }

  angular.module('timer').service('TimerService', ['LocalStorage', 'Calculator', TimerService]);

})();
