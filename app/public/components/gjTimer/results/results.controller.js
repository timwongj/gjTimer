(function() {

  'use strict';

  function ResultsController($scope, $rootScope, $uibModal, ResultsService) {

    var self = this;

    self.refreshResults = function(sessionId) {
      ResultsService.getResultsAsync(sessionId || self.sessionId, self.settings.resultsPrecision)
        .then(function(results) {
          self.results = results;
          $rootScope.$broadcast('refresh statistics', results);
          $rootScope.$broadcast('refresh charts', results);
        });
    };

    self.refreshResults();

    $scope.$on('refresh results', function($event, sessionId) {
      self.refreshResults(sessionId);
    });

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

  angular.module('results').controller('ResultsController', ['$scope', '$rootScope', '$uibModal', 'ResultsService', ResultsController]);

})();
