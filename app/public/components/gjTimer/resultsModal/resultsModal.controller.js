(function() {

  'use strict';

  function ResultsModalController($modalInstance, results, ResultsModalService) {

    var self = this;

    self.results = ResultsModalService.getModalResults(results);

    self.type = results.length === 3 ? 'mean' : 'average';

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'results', 'ResultsModalService', ResultsModalController]);

})();
