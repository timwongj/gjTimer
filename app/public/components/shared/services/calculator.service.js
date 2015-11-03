(function() {

  'use strict';

  function Calculator() {

    var self = this;

    /**
     * Calculates the average of the results.
     * @param results
     * @returns {number}
     */
    self.calculateAverage = function(results) {

      var rawTimes = [], PLUS_TWO = 2000, DNF = 2147485547;

      // add penalties
      angular.forEach(results, function(result) {

        if (result.penalty === 'DNF') {
          rawTimes.push(DNF);
        } else if (result.penalty === '+2') {
          rawTimes.push(result.time + PLUS_TWO);
        } else {
          rawTimes.push(result.time);
        }

      });

      // remove best and worst time
      rawTimes.splice(rawTimes.indexOf(Math.min.apply(null, rawTimes)), 1);
      rawTimes.splice(rawTimes.indexOf(Math.max.apply(null, rawTimes)), 1);

      if (rawTimes.indexOf(DNF) >= 0) {
        return DNF;
      } else {
        return Number((rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(0));
      }

    };

    /**
     * Calculates the mean of the results.
     * @param results
     * @returns {number}
     */
    self.calculateMean = function(results) {

      var rawTimes = [], PLUS_TWO = 2000, DNF = 2147485547;

      // add penalties
      angular.forEach(results, function(result) {

        if (result.penalty === 'DNF') {
          rawTimes.push(DNF);
        } else if (result.penalty === '+2') {
          rawTimes.push(result.time + PLUS_TWO);
        } else {
          rawTimes.push(result.time);
        }

      });

      if (rawTimes.indexOf(DNF) >= 0) {
        return DNF;
      } else {
        return Number((rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(0));
      }

    };

    /**
     * Calculates the mean of the results ignoring the DNFs.
     * @param results
     * @returns {number}
     */
    self.calculateLargeMean = function(results) {

      var rawTimes = [], PLUS_TWO = 2000, DNF = 2147485547;

      // add penalties
      angular.forEach(results, function(result) {

        if (result.penalty === '+2') {
          rawTimes.push(result.time + PLUS_TWO);
        } else {
          rawTimes.push(result.time);
        }

      });

      return Number((rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(0));

    };

    /**
     * Converts time from string to milliseconds.
     * @param timeString
     * @returns {number} - timeMilliseconds
     */
    self.convertTimeFromStringToMilliseconds = function(timeString) {

      var res = timeString.split(':');

      if (res.length === 1) {
        return (parseFloat(res[0]) * 1000);
      } else if (res.length === 2) {
        return (parseFloat(res[0]) * 60 * 1000) + (parseFloat(res[1]) * 1000);
      } else if (res.length === 3) {
        return (parseFloat(res[0]) * 60 * 60 * 1000) + (parseFloat(res[1]) * 60 * 1000) + (parseFloat(res[2]) * 1000);
      } else {
        return -1;
      }

    };

    /**
     * Converts time from milliseconds to string.
     * @param timeMilliseconds
     * @param precision
     * @returns {string} - timeString
     */
    self.convertTimeFromMillisecondsToString = function(timeMilliseconds, precision) {

      var time = moment(timeMilliseconds);

      if (precision === 2) {
        if (timeMilliseconds < 10000) {
          return time.format('s.SS');
        } else if (timeMilliseconds < 60000) {
          return time.format('ss.SS');
        } else if (timeMilliseconds < 600000) {
          return time.format('m:ss.SS');
        } else if (timeMilliseconds < 3600000) {
          return time.utc().format('h:mm:ss.SS');
        }
      } else {
        if (timeMilliseconds < 10000) {
          return time.format('s.SSS');
        } else if (timeMilliseconds < 60000) {
          return time.format('ss.SSS');
        } else if (timeMilliseconds < 600000) {
          return time.format('m:ss.SSS');
        } else if (timeMilliseconds < 3600000) {
          return time.utc().format('h:mm:ss.SSS');
        }
      }

    };

  }

  angular.module('gjTimer').service('Calculator', Calculator);

})();
