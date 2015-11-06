(function() {

  'use strict';

  function Calculator() {

    var self = this;

    self.DNF = 864000000;

    /**
     * Calculates the average of the results.
     * @param rawTimes
     * @returns {number}
     */
    self.calculateAverage = function(rawTimes) {

      if (rawTimes.length < 3) {
        return self.DNF;
      }

      var times = rawTimes.slice(0);

      // remove best and worst time
      times.splice(times.indexOf(Math.min.apply(null, times)), 1);
      times.splice(times.indexOf(Math.max.apply(null, times)), 1);

      if (times.indexOf(self.DNF) >= 0) {
        return self.DNF;
      } else {
        return Number((times.reduce(function(pv, cv) { return pv + cv; }, 0) / times.length).toFixed(0));
      }

    };

    /**
     * Calculates the mean of the results.
     * @param rawTimes
     * @returns {number}
     */
    self.calculateMean = function(rawTimes) {

      if ((rawTimes.indexOf(self.DNF) >= 0) || (rawTimes.length === 0)) {
        return self.DNF;
      } else {
        return Number((rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(0));
      }

    };

    /**
     * Calculates the mean of the results ignoring the DNFs.
     * @param rawTimes
     * @returns {number}
     */
    self.calculateSessionMean = function(rawTimes) {

      var times = rawTimes.slice(0);

      for (var i = 0; i < times.length; i++) {
        if (times[i] === self.DNF) {
          times.splice(i, 1);
        }
      }

      if (times.length === 0) {
        return self.DNF;
      }

      return {
        mean: Number((times.reduce(function(pv, cv) { return pv + cv; }, 0) / times.length).toFixed(0)),
        stDev: self.calculateStandardDeviation(times, false)
      };

    };

    /**
     * Calculate the best avg, stDev, index
     * @param rawTimes
     * @param n
     * @returns {{index: number, avg: number, stDev: number}}
     */
    self.calculateBestAverage = function(rawTimes, n) {

      var currentAvg, bestAvg = self.DNF, index = -1;

      for (var i = 0; i < rawTimes.length - n; i++) {
        currentAvg = self.calculateAverage(rawTimes.slice(i, i + n));
        if (currentAvg < bestAvg) {
          bestAvg = currentAvg;
          index = i;
        }
      }

      return {
        index: index,
        avg: bestAvg,
        stDev: bestAvg !== self.DNF ? self.calculateStandardDeviation(rawTimes.slice(index, index + n), true) : -1
      };

    };

    /**
     *
     * @param rawTimes
     * @param n
     * @returns {number}
     */
    self.calculateBestMean = function(rawTimes, n) {

      var currentMean, bestMean = self.DNF, index = -1;

      for (var i = 0; i < rawTimes.length - n; i++) {
        currentMean = self.calculateMean(rawTimes.slice(i, i + n));
        if (currentMean < bestMean) {
          bestMean = currentMean;
          index = i;
        }
      }

      return {
        index: index,
        mean: bestMean,
        stDev: bestMean !== self.DNF ? self.calculateStandardDeviation(rawTimes.slice(index, index + n), false) : -1
      };

    };

    /**
     * Calculate the standard deviation.
     * @param rawTimes
     * @param trimmed
     * @returns {number}
     */
    self.calculateStandardDeviation = function(rawTimes, trimmed) {

      var times = rawTimes.slice(0);

      if (trimmed) {
        times.splice(times.indexOf(Math.min.apply(null, times)), 1);
        times.splice(times.indexOf(Math.max.apply(null, times)), 1);
      }

      var avg = self.calculateMean(times);

      var squareDiffs = times.map(function(time) { return Math.pow(time - avg, 2); });

      return Math.sqrt(self.calculateMean(squareDiffs));

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

      if (timeMilliseconds === self.DNF) {
        return 'DNF';
      }

      if (timeMilliseconds < 0) {
        return 'N/A';
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
