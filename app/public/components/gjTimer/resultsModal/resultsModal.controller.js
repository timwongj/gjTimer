(function() {

  'use strict';

  function ResultsModalController($uibModalInstance, results, precision, ResultsModalService) {

    var self = this;

    self.results = ResultsModalService.getModalResults(results, precision);

    self.type = results.length === 3 ? 'mean' : 'average';

    self.close = function() {
      $uibModalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$uibModalInstance', 'results', 'precision', 'ResultsModalService', ResultsModalController]);

})();
