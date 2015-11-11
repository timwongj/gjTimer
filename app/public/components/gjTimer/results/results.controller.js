(function() {

  'use strict';

  function ResultsController($scope, $rootScope, $uibModal, ResultsService) {

    var self = this;

    self.results = ResultsService.getResults(self.sessionId, self.settings.resultsPrecision);

    $scope.$on('refresh results', function($event, sessionId) {
      self.results = ResultsService.getResults(sessionId || self.sessionId, self.settings.resultsPrecision);
      $rootScope.$broadcast('refresh charts', self.results);
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
