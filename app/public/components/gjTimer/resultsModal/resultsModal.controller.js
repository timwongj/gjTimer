(function() {

  'use strict';

  function ResultsModalController($modalInstance, data, ResultsModalService) {

    var self = this;

    self.title = data.avg + ' average of ' + data.numberOfResults;
    self.results = ResultsModalService.getModalResults(data.results, data.index, data.numberOfResults);

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'data', 'ResultsModalService', ResultsModalController]);

})();
