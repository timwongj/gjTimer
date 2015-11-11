(function() {

  'use strict';

  function ChartsService(Calculator, Constants) {

    var self = this;

    /**
     * Convert results to line chart data
     * @param results
     * @returns {{series: string[], labels: Array, data: *[]}}
     */
    self.getLineChartData = function(results) {

      var labels = [], data = [ [], [], []], single, avg5, avg12;

      for (var i = 0; i < results.length; i++) {
        labels.push(results[i].index + 1);
        single = results[i].rawTime;
        avg5 = Calculator.convertTimeFromStringToMilliseconds(results[i].avg5);
        avg12 = Calculator.convertTimeFromStringToMilliseconds(results[i].avg12);
        data[0].push(single !== Constants.DNF ? Number((single / 1000).toFixed(2)) : null);
        data[1].push(avg5 !== Constants.DNF ? avg5 / 1000 : null);
        data[2].push(avg12 !== Constants.DNF ? avg12 / 1000 : null);
      }

      return {
        series: ['Time', 'Avg 5', 'Avg 12'],
        labels: labels,
        data: data
      };

    };

    /**
     * Set chart defaults.
     */
    self.setChartDefaults = function() {

      Chart.defaults.global.animation = false;
      Chart.defaults.global.colours = ['#4D5360', '#46BFBD', '#FDB45C'];
      Chart.defaults.global.showScale = false;
      Chart.defaults.global.tooltipCornerRadius = 2;
      Chart.defaults.global.tooltipFontSize = 12;
      Chart.defaults.global.tooltipTitleFontSize = 12;
      Chart.defaults.Line.bezierCurve = false;
      Chart.defaults.Line.datasetStrokeWidth = 1;
      Chart.defaults.Line.pointDotRadius = 0;
      Chart.defaults.Line.pointHitDetectionRadius = 1;

    };


  }

  angular.module('charts').service('ChartsService', ['Calculator', 'Constants', ChartsService]);

})();
