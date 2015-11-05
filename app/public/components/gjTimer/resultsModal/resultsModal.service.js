(function() {

  'use strict';

  function ResultsModalService(Calculator) {

    var self = this;

    /**
     * Get results for the results modal.
     * @param results
     * @returns [Object] - results
     */
    self.getModalResults = function(results) {

      var rawTimes = Calculator.extractRawTimes(results);

      results[rawTimes.indexOf(Math.min.apply(null, rawTimes))].min = true;
      results[rawTimes.indexOf(Math.max.apply(null, rawTimes))].max = true;

      return {
        results: results,
        avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes)),
        stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes, true))
      };

    };

  }

  angular.module('results').service('ResultsModalService', ['Calculator', ResultsModalService]);

})();
