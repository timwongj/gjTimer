(function() {

  'use strict';

  function ResultsService(LocalStorage, Calculator) {

    var self = this;

    var DNF = Calculator.DNF;

    /**
     * Gets results for the session.
     * @param sessionId
     * @param precision
     */
    self.getResults = function(sessionId, precision) {

      var results = [], rawResults = LocalStorage.getJSON(sessionId).results;

      angular.forEach(rawResults, function(rawResult, index) {

        var res = rawResult.split('|');

        var result = {
          index: index,
          scramble: res[1],
          date: new Date(Number(res[2])),
          comment: res[3] ? res[3] : ''
        };

        // deal with penalty if it exists
        if (res[0].substring(res[0].length - 1, res[0].length) === '+') {
          result.time = Number(res[0].substring(0, res[0].length - 1));
          result.penalty = '+2';
          result.rawTime = Number((result.time + 2000).toFixed());
          result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)) + 2000, precision) + '+';
          result.detailedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)) + 2000, precision) + '+';
        } else if (res[0].substring(res[0].length - 1, res[0].length) === '-') {
          result.time = Number(res[0].substring(0, res[0].length - 1));
          result.penalty = 'DNF';
          result.rawTime = DNF;
          result.displayedTime = 'DNF';
          result.detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)), precision) + ')';
        } else {
          result.time = Number(res[0]);
          result.penalty = '';
          result.rawTime = result.time;
          result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0]), precision);
          result.detailedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0]), precision);
        }

        results.push(result);

      });

      var rawTimes = Calculator.extractRawTimes(results);

      angular.forEach(results, function(result, index) {

        if (index >= 4) {
          result.avg5 = Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(index - 4, index + 1)), precision);
        } else {
          result.avg5 = 'DNF';
        }

        if (index >= 11) {
          result.avg12 = Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(index - 11, index + 1)), precision);
        } else {
          result.avg12 = 'DNF';
        }

      });

      return results;

    };

  }

  angular.module('results').service('ResultsService', ['LocalStorage', 'Calculator', ResultsService]);

})();
