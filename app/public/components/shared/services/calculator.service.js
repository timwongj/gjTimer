(function() {

  'use strict';

  function Calculator() {

    var self = this;

    self.DNF = 864000000; // needs to be a high number (set to 1 day)

    /**
     * Calculates the average of the results.
     * @param rawTimes
     * @param trimmed
     * @returns {number}
     */
    self.calculateAverage = function(rawTimes, trimmed) {

      var times = rawTimes.slice(0);

      // remove best and worst time
      if (trimmed) {
        times.splice(times.indexOf(Math.min.apply(null, times)), 1);
        times.splice(times.indexOf(Math.max.apply(null, times)), 1);
      }

      if ((times.indexOf(self.DNF) >= 0) || times.length === 0) {
        return self.DNF;
      } else {
        return Number((times.reduce(function(pv, cv) { return pv + cv; }, 0) / times.length).toFixed());
      }

    };

    /**
     * Calculates the average of the results.
     * @param rawTimes
     * @param trimmed
     * @param precision
     * @returns {string}
     */
    self.calculateAverageString = function(rawTimes, trimmed, precision) {

      return self.convertTimeFromMillisecondsToString(self.calculateAverage(rawTimes, trimmed), precision);

    };

    /**
     * Calculate the standard deviation.
     * @param rawTimes
     * @param trimmed
     * @returns {number}
     */
    self.calculateStandardDeviation = function(rawTimes, trimmed) {

      var times = rawTimes.slice(0);

      // remove best and worst time
      if (trimmed) {
        times.splice(times.indexOf(Math.min.apply(null, times)), 1);
        times.splice(times.indexOf(Math.max.apply(null, times)), 1);
      }

      if ((times.indexOf(self.DNF) >= 0) || times.length === 0) {
        return self.DNF;
      } else {
        var avg = self.calculateAverage(times, false);
        var squareDiffs = times.map(function(time) { return Math.pow(time - avg, 2); });
        return Number(Math.sqrt(self.calculateAverage(squareDiffs, false)).toFixed());
      }

    };

    /**
     * Calculate the standard deviation.
     * @param rawTimes
     * @param trimmed
     * @param precision
     * @returns {string}
     */
    self.calculateStandardDeviationString = function(rawTimes, trimmed, precision) {

      return self.convertTimeFromMillisecondsToString(self.calculateStandardDeviation(rawTimes, trimmed), precision);

    };

    /**
     * Calculates the mean of the results ignoring the DNFs.
     * @param rawTimes
     * @param precision
     * @returns {string}
     */
    self.calculateSessionMeanAndStandardDeviationString = function(rawTimes, precision) {

      var times = rawTimes.slice(0);

      // remove DNFs
      for (var i = 0; i < times.length; i++) {
        if (times[i] === self.DNF) {
          times.splice(i, 1);
        }
      }

      return {
        mean: self.calculateAverageString(times, false, precision),
        stDev: self.calculateStandardDeviationString(times, false, precision)
      };

    };

    /**
     * Calculate the best avg, stDev, index
     * @param rawTimes
     * @param trimmed
     * @param n
     * @param precision
     * @returns {{index: number, avg: number, stDev: number}}
     */
    self.calculateBestAverageAndStandardDeviationString = function(rawTimes, trimmed, n, precision) {

      var currentAvg, bestAvg = self.DNF, index = -1;

      for (var i = 0; i < rawTimes.length - n; i++) {
        currentAvg = self.calculateAverage(rawTimes.slice(i, i + n), trimmed);
        if (currentAvg < bestAvg) {
          bestAvg = currentAvg;
          index = i;
        }
      }

      return {
        index: index,
        avg: self.convertTimeFromMillisecondsToString(bestAvg, precision),
        stDev: self.calculateStandardDeviationString(rawTimes.slice(index, index + n), trimmed, precision)
      };

    };

    /**
     * Extracts the raw times from the results.
     * @param results
     * @returns {Array}
     */
    self.extractRawTimes = function(results) {

      var rawTimes = [];
      for (var i = 0; i < results.length; i++) {
        rawTimes.push(results[i].rawTime);
      }

      return rawTimes;

    };

    /**
     * Count the number of non DNF results.
     * @param rawTimes
     * @returns {number}
     */
    self.countNonDNFs = function(rawTimes) {

      var count = 0;
      for (var i = 0; i< rawTimes.length; i++) {
        if (rawTimes[i] !== self.DNF) {
          count += 1;
        }
      }

      return count;

    };

    /**
     * Converts time from string to milliseconds.
     * @param timeString
     * @returns {number} - timeMilliseconds
     */
    self.convertTimeFromStringToMilliseconds = function(timeString) {

      if (timeString === 'DNF') {
        return self.DNF;
      }

      if (timeString === 'N/A') {
        return -1;
      }

      var res = timeString.split(':');

      if (res.length === 1) {
        return Number((parseFloat(res[0]) * 1000).toFixed());
      } else if (res.length === 2) {
        return Number(((parseFloat(res[0]) * 60 * 1000) + (parseFloat(res[1]) * 1000)).toFixed());
      } else if (res.length === 3) {
        return Number(((parseFloat(res[0]) * 60 * 60 * 1000) + (parseFloat(res[1]) * 60 * 1000) + (parseFloat(res[2]) * 1000)).toFixed());
      } else {
        return self.DNF;
      }

    };

    /**
     * Converts time from milliseconds to string.
     * @param timeMilliseconds
     * @param precision
     * @returns {string} - timeString
     */
    self.convertTimeFromMillisecondsToString = function(timeMilliseconds, precision) {

      if ((timeMilliseconds < 0) || (timeMilliseconds === Infinity)) {
        return 'N/A';
      }

      if (timeMilliseconds === self.DNF) {
        return 'DNF';
      }

      var time = moment(timeMilliseconds);
      var ms = precision === 2 ? 'SS' : 'SSS';

      if (timeMilliseconds < 10000) {
        return time.format('s.' + ms);
      } else if (timeMilliseconds < 60000) {
        return time.format('ss.' + ms);
      } else if (timeMilliseconds < 3600000) {
        return time.format('m:ss.' + ms);
      } else {
        return time.utc().format('H:mm:ss.' + ms);
      }

    };

  }

  angular.module('gjTimer.services').service('Calculator', Calculator);

})();
