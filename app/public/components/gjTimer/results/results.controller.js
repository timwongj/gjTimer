(function() {

  'use strict';

  function ResultsController($scope, $rootScope, $uibModal, ResultsService) {

    var self = this;

    $scope.results = ResultsService.getResults($scope.sessionId, $scope.settings.precision);
    self.results = $scope.results;

    $scope.$on('refresh data', function() {
      $scope.results = ResultsService.getResults($scope.sessionId, $scope.settings.precision);
      self.results = $scope.results;
    });

    self.openModal = function(index, avg, numberOfResults) {
      if (index >= numberOfResults) {
        $uibModal.open({
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
