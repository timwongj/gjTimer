(function() {

  'use strict';

  function ResultsModalController($modalInstance, data, ResultsService) {

    var self = this;

    self.title = data.avg + ' average of ' + data.numberOfResults;
    self.results = ResultsService.getModalResults(data.sessionId, data.index, data.numberOfResults);

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'data', 'ResultsService', ResultsModalController]);

})();
