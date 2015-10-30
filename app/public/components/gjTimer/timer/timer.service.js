(function() {

  'use strict';

  function TimerService() {

    var self = this;

    var startTime;

    /**
     * Gets the current time.
     * @returns {string}
     */
    self.getTime = function() {

      var time = moment(Date.now() - startTime);

      if (time < 10000) {
        return time.format('s.SSS');
      } else if (time < 60000) {
        return time.format('ss.SSS');
      } else if (time < 600000) {
        return time.format('m:ss.SSS');
      } else if (time < 3600000) {
        return time.utc().format('h:mm:ss.SSS');
      }

    };

    /**
     * Starts the Timer.
     */
    self.startTimer = function() {

      startTime = Date.now();

    };

    /**
     * Saves the result.
     * @param time
     * @param scramble
     * @param sessionId
     */
    self.saveResult = function(time, scramble, sessionId) {

      var result = {
        time: time,
        scramble: scramble,
        date: new Date()
      };

      var session = JSON.parse(localStorage.getItem(sessionId));
      session.list.push(result);
      localStorage.setItem(sessionId, JSON.stringify(session));

    };

  }

  angular.module('timer').service('TimerService', TimerService);

})();
