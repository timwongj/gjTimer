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

        result.time = Number(result.time).toFixed(3);

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
     * Get results for the avg5/avg12 modal.
     * @param sessionId
     * @param index
     * @param numberOfResults
     */
    self.getModalResults = function(sessionId, index, numberOfResults) {

      if (localStorage.getItem(sessionId) === null) {
        return [];
      } else {

        var results = JSON.parse(localStorage.getItem(sessionId)).list.slice(index - numberOfResults, index);
        var min, max, rawTimes = [], DNF = 2147485547;

        angular.forEach(results, function(result) {

          if ((result.penalty !== undefined) && (result.penalty === '(DNF)')) {
            rawTimes.push(DNF);
          } else if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
            rawTimes.push(self.timeToSeconds(result.time, 3) + 2);
          } else {
            rawTimes.push(self.timeToSeconds(result.time, 3));
          }

        });

        min = rawTimes.indexOf(Math.min.apply(null, rawTimes));
        max = rawTimes.indexOf(Math.max.apply(null, rawTimes));

        results[min].min = true;
        results[max].max = true;

        return results;
      }

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
          rawTimes.push(self.timeToSeconds(result.time, precision) + 2);
        } else {
          rawTimes.push(self.timeToSeconds(result.time, precision));
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
          rawTimes.push(self.timeToSeconds(result.time, precision) + 2);
        } else {
          rawTimes.push(self.timeToSeconds(result.time, precision));
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
          rawTimes.push(self.timeToSeconds(result.time, precision) + 2);
        } else if ((result.penalty === undefined) || (result.penalty === '')) {
          rawTimes.push(self.timeToSeconds(result.time, precision));
        }

      });

      return (rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(precision);

    };

    /**
     * Adds 2 seconds to the displayed time.
     * @param time
     * @returns {*}
     */
    self.plus2 = function(time) {

      return self.millisecondsToString((self.timeToSeconds(time) + 2) * 1000);

    };

    /**
     * Converts time from string to seconds.
     * @param time
     * @returns {*}
     */
    self.timeToSeconds = function(time) {

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

    /**
     * Converts time from milliseconds to string
     * @param milliseconds
     * @returns {*}
     */
    self.millisecondsToString = function(milliseconds) {

      var time = moment(milliseconds);

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

  }

  angular.module('results').service('ResultsService', [ResultsService]);

})();
