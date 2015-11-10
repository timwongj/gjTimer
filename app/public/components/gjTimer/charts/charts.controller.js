(function() {

  'use strict';

  function ChartsController($scope, ChartsService) {

    var self = this;

    var ctx, options, data, newData, lineChart, dataLength;

    ctx = document.getElementById("lineChart").getContext("2d");
    options = ChartsService.getLineChartOptions();

    $scope.$watchCollection(function() {
      return self.results;
    }, function() {
      self.refreshData();
    });

    $scope.$on('refresh statistics', function() {
      self.refreshData();
    });

    $(window).resize(function() {
      self.refreshCanvas();
    });

    self.refreshData = function() {
      data = ChartsService.getLineChartData(self.results.slice(self.results.length - dataLength, self.results.length));
      for (var i = 0; i < data.datasets.length; i++) {
        for (var j = 0; j < data.datasets[i].data.length; j++) {
          lineChart.datasets[i].points[j].value = data.datasets[i].data[j];
          lineChart.datasets[i].points[j].label = data.labels[j];
        }
      }
      lineChart.update();
    };

    self.refreshCanvas = function() {
      $('#lineChart').width($('#charts').width());
      $('#lineChart').height($('#charts').height());
      dataLength = Number($('#charts').width().toFixed()) / 25;
      data = ChartsService.getLineChartData(self.results.slice(self.results.length - dataLength, self.results.length));
      lineChart = new Chart(ctx).Line(data, options);
    };

    self.refreshCanvas();

  }

  angular.module('charts').controller('ChartsController', ['$scope', 'ChartsService', ChartsController]);

})();
