(function() {

  'use strict';

  function ChartsController($scope, ChartsService) {

    var self = this;

    var results;

    $scope.$watchCollection(function() {
      return self.results;
    }, function() {
      self.refreshData();
    });

    $scope.$on('refresh statistics', function() {
      self.refreshData();
    });

    ChartsService.setChartDefaults();

    self.refreshData = function() {

      results = ChartsService.getLineChartData(self.results);

      self.labels = results.labels;
      self.series = results.series;
      self.data = results.data;

    };

  }

  angular.module('charts').controller('ChartsController', ['$scope', 'ChartsService', ChartsController]);

})();
