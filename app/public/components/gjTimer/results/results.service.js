(function() {

  'use strict';

  function ResultsService() {

    var self = this;

    /**
     * Gets results for the session.
     * @param sessionId
     * @param precision
     */
    self.getResults = function(sessionId, precision) {

      var results = JSON.parse(localStorage.getItem(sessionId)).list;

      angular.forEach(results, function(result, index) {
        result.time = Number(result.time).toFixed(precision);
        if (index >= 4) {
          result.avg5 = self.calculateAverage(results.slice(index - 4, index + 1), precision);
        } else {
          result.avg5 = 'DNF';
        }
        if (index >= 11) {
          result.avg12 = self.calculateAverage(results.slice(index - 11, index + 1), precision);
        } else {
          result.avg12 = 'DNF';
        }
      });

      return results;

    };

    /**
     * Calculates the average of the results.
     * @param results
     * @param precision
     * @returns {*}
     */
    self.calculateAverage = function(results, precision) {
      if (results.length < 3) {
        return 'DNF';
      }
      var rawTimes = [], DNF = 2147485547;
      angular.forEach(results, function(result) {
        if ((result.penalty !== undefined) && (result.penalty === '(DNF)')) {
          rawTimes.push(DNF);
        } else if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision) + 2);
        } else {
          rawTimes.push(self.timeToMilliseconds(result.time, precision));
        }
      });
      rawTimes.splice(rawTimes.indexOf(Math.min.apply(null, rawTimes)), 1);
      rawTimes.splice(rawTimes.indexOf(Math.max.apply(null, rawTimes)), 1);
      if (rawTimes.indexOf(DNF) >= 0) {
        return 'DNF';
      } else {
        return (rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(precision);
      }
    };

    /**
     * Calculates the mean of the results.
     * @param results
     * @param precision
     */
    self.calculateMean = function(results, precision) {
      var rawTimes = [];
      angular.forEach(results, function(result) {
        if ((result.penalty !== undefined) && (result.penalty === '(DNF)')) {
          return 'DNF';
        } else if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision) + 2);
        } else {
          rawTimes.push(self.timeToMilliseconds(result.time, precision));
        }
      });
      return (rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(precision);
    };

    /**
     * Calculates the mean of the results.
     * @param results
     * @param precision
     */
    self.calculateLargeMean = function(results, precision) {
      var rawTimes = [];
      angular.forEach(results, function(result) {
        if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision) + 2);
        } else if ((result.penalty === undefined) || (result.penalty === '')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision));
        }
      });
      return (rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(precision);
    };

    /**
     * Converts time from string to milliseconds.
     * @param time
     * @returns {*}
     */
    self.timeToMilliseconds = function(time) {
      var res = time.split(':');
      if (res.length === 1) {
        return parseFloat(res[0]);
      } else if (res.length === 2) {
        return (parseFloat(res[0]) * 60) + parseFloat(res[1]);
      } else if (res.length === 3) {
        return (parseFloat(res[0]) * 3600) + (parseFloat(res[1]) * 60) + parseFloat(res[2]);
      } else {
        return -1;
      }
    };

  }

  angular.module('results').service('ResultsService', ResultsService);

})();
