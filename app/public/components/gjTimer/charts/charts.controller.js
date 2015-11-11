(function() {

  'use strict';

  function ChartsController($scope, ChartsService) {

    var self = this;

    var lineChart, barChart;

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

      lineChart = ChartsService.getLineChartData(self.results);

      self.lineChartSeries = lineChart.series;
      self.lineChartLabels = lineChart.labels;
      self.lineChartData = lineChart.data;

      barChart = ChartsService.getBarChartData(self.results);

      self.barChartLabels = barChart.labels;
      self.barChartData = barChart.data;

    };

  }

  angular.module('charts').controller('ChartsController', ['$scope', 'ChartsService', ChartsController]);

})();
