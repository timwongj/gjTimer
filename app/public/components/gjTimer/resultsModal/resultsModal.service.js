(function() {

  'use strict';

  function ResultsModalService(Calculator) {

    var self = this;

    /**
     * Get results for the results modal.
     * @param results
     * @param precision
     * @returns [Object] - results
     */
    self.getModalResults = function(results, precision) {

      var rawTimes = Calculator.extractRawTimes(results);

      results[rawTimes.indexOf(Math.min.apply(null, rawTimes))].min = true;
      results[rawTimes.indexOf(Math.max.apply(null, rawTimes))].max = true;

      return {
        results: results,
        avg: Calculator.calculateAverageString(rawTimes, true, precision),
        stDev: Calculator.calculateStandardDeviationString(rawTimes, true, precision)
      };

    };

  }

  angular.module('results').service('ResultsModalService', ['Calculator', ResultsModalService]);

})();
