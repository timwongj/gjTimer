(function() {

  'use strict';

  function ResultsController($scope, $rootScope, $uibModal, ResultsService) {

    var self = this;

    self.refreshResults = function(sessionId) {

      self.loaded = false;
      ResultsService.getResultsAsync(sessionId || self.sessionId, self.settings.resultsPrecision)
        .then(function(results) {
          self.loaded = true;
          self.results = results;
          self.loaded = true;
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
