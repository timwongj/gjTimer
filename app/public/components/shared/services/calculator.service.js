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

      angular.forEach(times, function(rawTime, index) {
        if (rawTime === self.DNF) {
          times.splice(index, 1);
        }
      });

      if (times.length === 0) {
        return self.DNF;
      }

      return Number((times.reduce(function(pv, cv) { return pv + cv; }, 0) / times.length).toFixed(0));

    };

    /**
     * Extracts the raw times from the results.
     * @param results
     * @returns {Array}
     */
    self.extractRawTimes = function(results) {

      var rawTimes = [];

      angular.forEach(results, function(result) {
        rawTimes.push(result.rawTime);
      });

      return rawTimes;

    };

    /**
     * Count the number of non DNF results.
     * @param rawTimes
     * @returns {number}
     */
    self.countNonDNFs = function(rawTimes) {

      var count = 0;
      angular.forEach(rawTimes, function(rawTime) {
        count = rawTime !== self.DNF ? count + 1 : count;
      });
      return count;

    };

    /**
     * Returns DNF value for other services to use.
     * @returns {number}
     */
    self.getDNF = function() {
      return self.DNF;
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

      var time = moment(timeMilliseconds);

      if (precision === 2) {
        if (timeMilliseconds < 10000) {
          return time.format('s.SS');
        } else if (timeMilliseconds < 60000) {
          return time.format('ss.SS');
        } else if (timeMilliseconds < 3600000) {
          return time.format('m:ss.SS');
        } else {
          return time.utc().format('H:mm:ss.SS');
        }
      } else {
        if (timeMilliseconds < 10000) {
          return time.format('s.SSS');
        } else if (timeMilliseconds < 60000) {
          return time.format('ss.SSS');
        } else if (timeMilliseconds < 3600000) {
          return time.format('m:ss.SSS');
        } else {
          return time.utc().format('H:mm:ss.SSS');
        }
      }

    };

  }

  angular.module('gjTimer.services').service('Calculator', Calculator);

})();
