(function() {

  'use strict';

  function ResultsController($scope, $rootScope, $uibModal, ResultsService, Constants) {

    var self = this;

    self.NUM_RESULTS_DISPLAYED = Constants.NUM_RESULTS_DISPLAYED;

    refreshResults();

    $scope.$on('refresh results', function($event, sessionId) {

      refreshResults(sessionId);

    });

    function refreshResults(sessionId) {

      self.loaded = false;
      ResultsService.getResultsAsync(sessionId || self.sessionId, self.settings.resultsPrecision)
        .then(function(results) {
          self.NUM_RESULTS_DISPLAYED = Constants.NUM_RESULTS_DISPLAYED;
          self.loaded = true;
          self.results = results;
          self.loaded = true;
          $rootScope.$broadcast('refresh statistics', results);
          $rootScope.$broadcast('refresh charts', results);
        });

    }

    self.openModal = function(index, numberOfResults) {

      if (index >= numberOfResults) {
        $uibModal.open({
          animation: true,
          templateUrl: 'dist/components/gjTimer/resultsModal/resultsModal.html',
          controller: 'ResultsModalController',
          controllerAs: 'ctrl',
          size: 'lg',
          resolve: {
            results: function () {
              return self.results.slice(index - numberOfResults, index);
            },
            precision: function() {
              return self.settings.resultsPrecision;
            }
          }
        });
      }

    };

  }

  angular.module('results').controller('ResultsController', ['$scope', '$rootScope', '$uibModal', 'ResultsService', 'Constants', ResultsController]);

})();
