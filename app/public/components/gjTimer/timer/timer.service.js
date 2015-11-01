(function() {

  'use strict';

  function TimerService(Calculator, LocalStorage) {

    var self = this;

    var startTime;

    /**
     * Gets the current time.
     * @param precision
     * @returns {string}
     */
    self.getTime = function(precision) {

      return Calculator.convertTimeFromMillisecondsToString(moment(Date.now() - startTime), precision);

    };

    /**
     * Starts the Timer.
     */
    self.startTimer = function() {

      startTime = Date.now();

    };

    /**
     * Saves the result in the format of 'Time in milliseconds'|'Scramble'|'Date in milliseconds'.
     * @param time
     * @param scramble
     * @param sessionId
     */
    self.saveResult = function(time, scramble, sessionId) {

      var session = LocalStorage.getJSON(sessionId);
      session.results.push(Calculator.convertTimeFromStringToMilliseconds(time) + '|' + scramble + '|' + (new Date()).getTime());
      LocalStorage.setJSON(sessionId, session);

    };

  }

  angular.module('timer').service('TimerService', ['Calculator', 'LocalStorage', TimerService]);

})();
