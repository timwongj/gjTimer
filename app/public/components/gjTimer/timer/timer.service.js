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
     * Gets the inspection time.
     * @returns {*}
     */
    self.getInspectionTime = function() {

      return Math.ceil(((15000 + self.inspectionStartTime - Date.now()) / 1000));

    };

    /**
     * Starts the Timer.
     */
    self.startTimer = function() {

      self.startTime = Date.now();

    };

    /**
     * Starts the inspection timer.
     */
    self.startInspection = function() {

      self.inspectionStartTime = Date.now();

    };

    self.createCommentForBldMode = function(time, memo) {

      var timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(time);
      var memoMilliseconds = Calculator.convertTimeFromStringToMilliseconds(memo);
      var execution = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds - memoMilliseconds);
      return 'memo: ' + memo + ', exe: ' + execution;

    };

  }

  angular.module('timer').service('TimerService', ['LocalStorage', 'Calculator', TimerService]);

})();
