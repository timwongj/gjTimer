(function() {

  'use strict';

  function ResultsModalController($modalInstance, results, ResultsModalService) {

    var self = this;

    self.results = ResultsModalService.getModalResults(results);

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'results', 'ResultsModalService', ResultsModalController]);

})();
