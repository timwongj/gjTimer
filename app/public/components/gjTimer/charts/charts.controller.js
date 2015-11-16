(function() {

  'use strict';

  function ChartsController($scope, ChartsService) {

    var self = this;

    var lineChart, barChart;

    ChartsService.setChartDefaults();

    $scope.$on('refresh results', function() {
      self.loaded = false;
    });

    $scope.$on('refresh charts', function($event, results) {

      self.loaded = false;
      lineChart = ChartsService.initLineChartData(results);
      barChart = ChartsService.initBarChartData(results);
      updateCharts();
      self.loaded = true;

    });

    $scope.$on('new result', function($event, result) {

      lineChart =  ChartsService.addLineChartData(lineChart, result);
      barChart = ChartsService.addBarChartData(barChart, result);
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
