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

      if(rawTimes.length !== 3) {
        results[rawTimes.indexOf(Math.min.apply(null, rawTimes))].min = true;
        results[rawTimes.indexOf(Math.max.apply(null, rawTimes))].max = true;
      }

      return {
        results: results,
        avg: Calculator.calculateAverageString(rawTimes, rawTimes.length !== 3, precision),
        stDev: Calculator.calculateStandardDeviationString(rawTimes, rawTimes.length !== 3, precision)
      };

    };

  }

  angular.module('results').service('ResultsModalService', ['Calculator', ResultsModalService]);

})();
