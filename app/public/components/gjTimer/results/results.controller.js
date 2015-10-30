(function() {

  'use strict';

  function ResultsController($scope, $rootScope, $uibModal, ResultsService) {

    var self = this;
    var precision = 2;

    self.results = ResultsService.getResults($rootScope.sessionId, precision);

    $scope.$on('refresh data', function() {
      self.results = ResultsService.getResults($rootScope.sessionId, precision);
    });

    self.openModal = function(index, avg, numberOfResults) {
      if (index >= numberOfResults) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'dist/components/gjTimer/results/resultsModal.html',
          controller: 'ResultsModalController',
          controllerAs: 'ctrl',
          size: 'md',
          resolve: {
            data: function () {
              return {
                sessionId: $rootScope.sessionId,
                index: index,
                avg: avg,
                numberOfResults: numberOfResults
              };
            }
          }
        });
      }
    };

  }

  angular.module('results').controller('ResultsController', ['$scope', '$rootScope', '$uibModal', 'ResultsService', ResultsController]);

})();
