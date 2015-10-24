(function() {

  'use strict';

  function TimerService() {

    var self = this;

    var startTime;

    /**
     * Get Time.
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
     */
    self.saveResult = function(time, scramble) {

      var result = {
        time: time,
        scramble: scramble,
        date: new Date()
      };

      console.log(result);

    };

  }

  angular.module('timer').service('TimerService', TimerService);

})();
