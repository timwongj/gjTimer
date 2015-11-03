(function() {

  'use strict';

  function ResultsController($scope, $uibModal, ResultsService) {

    var self = this;

    $scope.results = ResultsService.getResults($scope.sessionId, $scope.settings.precision);
    self.results = $scope.results;

    $scope.$on('refresh data', function($event, sessionId) {
      $scope.results = ResultsService.getResults(sessionId, $scope.settings.precision);
      self.results = $scope.results;
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
      }
    });

    self.openModal = function(index, avg, numberOfResults) {
      if (index >= numberOfResults) {
        $uibModal.open({
          animation: true,
          templateUrl: 'dist/components/gjTimer/resultsModal/resultsModal.html',
          controller: 'ResultsModalController',
          controllerAs: 'ctrl',
          size: 'md',
          resolve: {
            data: function () {
              return {
                index: index,
                numberOfResults: numberOfResults,
                results: $scope.results,
                avg: avg
              };
            }
          }
        });
      }
    };

  }

  angular.module('results').controller('ResultsController', ['$scope', '$uibModal', 'ResultsService', ResultsController]);

})();
