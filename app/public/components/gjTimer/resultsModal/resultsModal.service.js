(function() {

  'use strict';

  function ResultsModalService() {

    var self = this;

    /**
     * Get results for the results modal.
     * @param results
     * @param index
     * @param numberOfResults
     * @returns [Object] - modalResults
     */
    self.getModalResults = function(results, index, numberOfResults) {

      var rawTimes = [], PLUS_TWO = 2000, DNF = 2147485547, modalResults = results.slice(index - numberOfResults, index);

      // add penalties
      angular.forEach(modalResults, function(result) {

        if (result.penalty === 'DNF') {
          rawTimes.push(DNF);
        } else if (result.penalty === '+2') {
          rawTimes.push(result.time + PLUS_TWO);
        } else {
          rawTimes.push(result.time);
        }

      });

      modalResults[rawTimes.indexOf(Math.min.apply(null, rawTimes))].min = true;
      modalResults[rawTimes.indexOf(Math.max.apply(null, rawTimes))].max = true;

      return modalResults;

    };

  }

  angular.module('results').service('ResultsModalService', ResultsModalService);

})();
