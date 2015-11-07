(function() {

  'use strict';

  function ResultsModalController($modalInstance, results, precision, ResultsModalService) {

    var self = this;

    self.results = ResultsModalService.getModalResults(results, precision);

    self.type = results.length === 3 ? 'mean' : 'average';

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'results', 'precision', 'ResultsModalService', ResultsModalController]);

})();
