(function() {

  'use strict';

  function ResultsService() {

    var self = this;

    /**
     * Gets results for the session.
     * @param sessionId
     */
    self.getResults = function(sessionId) {

      return JSON.parse(localStorage.getItem(sessionId)).list;

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
        if ((result.penalty !== undefined) && (result.penalty == '(DNF)')) {
          rawTimes.push(DNF);
        } else if ((result.penalty !== undefined) && (result.penalty == '(+2)')) {
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
     */
    self.calculateMean = function(results) {

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
    }

  }

  angular.module('results').service('ResultsService', ResultsService);

})();
