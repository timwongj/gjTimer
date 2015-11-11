(function() {

  'use strict';

  function ChartsController($scope, ChartsService) {

    var self = this;

    var lineChart, barChart;

    ChartsService.setChartDefaults();

    lineChart = ChartsService.initLineChartData(self.results);
    barChart = ChartsService.initBarChartData(self.results);
    updateCharts();

    $scope.$on('new result', function($event, result) {

      lineChart =  ChartsService.addLineChartData(lineChart, result);
      barChart = ChartsService.addBarChartData(barChart, result);
      updateCharts();

    });

    $scope.$on('refresh charts', function($event, results) {

      lineChart = ChartsService.initLineChartData(results);
      barChart = ChartsService.initBarChartData(results);
      updateCharts();

    });

    function updateCharts() {

      self.lineChartSeries = lineChart.series;
      self.lineChartLabels = lineChart.labels;
      self.lineChartData = lineChart.data;

      self.barChartLabels = barChart.labels;
      self.barChartData = barChart.data;

    }

  }

  angular.module('charts').controller('ChartsController', ['$scope', 'ChartsService', ChartsController]);

})();
