(function() {

  'use strict';

  function ChartsController($scope, ChartsService) {

    var self = this;

    var lineChart, barChart;

    ChartsService.setChartDefaults();

    lineChart = ChartsService.initLineChartData(self.results);
    barChart = ChartsService.initBarChartData(self.results);

    $scope.$on('new result', function($event, result) {

      lineChart =  ChartsService.addLineChartData(lineChart, result);
      barChart = ChartsService.addBarChartData(barChart, result);
      self.updateCharts();

    });

    $scope.$on('refresh results', function() {

      lineChart = ChartsService.initLineChartData(self.results);
      barChart = ChartsService.initBarChartData(self.results);
      self.updateCharts();

    });

    self.updateCharts = function() {

      self.lineChartSeries = lineChart.series;
      self.lineChartLabels = lineChart.labels;
      self.lineChartData = lineChart.data;

      self.barChartLabels = barChart.labels;
      self.barChartData = barChart.data;

    };

    self.updateCharts();

  }

  angular.module('charts').controller('ChartsController', ['$scope', 'ChartsService', ChartsController]);

})();
