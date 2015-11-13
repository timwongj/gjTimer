(function() {

  'use strict';

  function StatisticsController($scope, $uibModal, StatisticsService) {

    var self = this;

    $scope.$on('refresh statistics', function($event, results) {
      self.statistics = StatisticsService.getStatistics(results, self.settings.statisticsPrecision);
    });

    self.openModal = function(format, $index) {
      var length = self.statistics.averages[$index].length;
      var index = format === 'best' ? self.statistics.averages[$index].best.index : self.results.length - length;
      $uibModal.open({
        animation: true,
        templateUrl: 'dist/components/gjTimer/resultsModal/resultsModal.html',
        controller: 'ResultsModalController',
        controllerAs: 'ctrl',
        size: 'lg',
        resolve: {
          results: function() {
            return self.results.slice(index, index + length);
          },
          precision: function() {
            return self.settings.resultsPrecision;
          }
        }
      });
    };

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', '$uibModal', 'StatisticsService', StatisticsController]);

})();
