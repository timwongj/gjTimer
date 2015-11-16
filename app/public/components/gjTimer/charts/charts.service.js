(function() {

  'use strict';

  function ChartsService(Calculator, Constants) {

    var self = this;

    /**
     * Convert results to line chart data
     * @param results
     * @returns {{series: string[], labels: Array, data: *[]}}
     */
    self.initLineChartData = function(results) {

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
     * Convert results to bar chart data
     * @param results
     * @returns {{labels: Array, data: *[]}}
     */
    self.initBarChartData = function(results) {

      var rawTimes, flooredTime, distribution = {}, labels = [], data = [];

      rawTimes = Calculator.extractRawTimes(results);

      for (var i = 0; i < rawTimes.length; i++) {
        if (rawTimes[i] !== Constants.DNF) {
          flooredTime = Math.floor(rawTimes[i] / 1000);
          if (!distribution.hasOwnProperty(flooredTime)) {
            distribution[flooredTime] = 1;
          } else {
            distribution[flooredTime] += 1;
          }
        }
      }

      for (var key in distribution) {
        if (distribution.hasOwnProperty(key)) {
          labels.push(Calculator.convertTimeFromMillisecondsToString(key * 1000, 0));
          data.push(distribution[key]);
        }
      }

      return {
        labels: labels,
        data: [data]
      };

    };

    /**
     * Adds result to the line chart data.
     * @param lineChart
     * @param result
     * @returns {*}
     */
    self.addLineChartData = function(lineChart, result) {

      var single, avg5, avg12;

      lineChart.labels.push(result.index + 1);
      single = result.rawTime;
      avg5 = Calculator.convertTimeFromStringToMilliseconds(result.avg5);
      avg12 = Calculator.convertTimeFromStringToMilliseconds(result.avg12);
      lineChart.data[0].push(single !== Constants.DNF ? Number((single / 1000).toFixed(2)) : null);
      lineChart.data[1].push(avg5 !== Constants.DNF ? avg5 / 1000 : null);
      lineChart.data[2].push(avg12 !== Constants.DNF ? avg12 / 1000 : null);

      return lineChart;

    };

    /**
     * Adds result to the bar chart data.
     * @param barChart
     * @param result
     * @returns {{labels: Array, data: *[]}}
     */
    self.addBarChartData = function(barChart, result) {

      var rawTime, flooredTime, index;

      rawTime = Calculator.extractRawTimes([result])[0];

      if (rawTime !== Constants.DNF) {
        flooredTime = Calculator.convertTimeFromMillisecondsToString(rawTime, 0);
        index = barChart.labels.indexOf(flooredTime);
        if (index < 0) {
          for (var i = 0; i < barChart.labels.length; i++) {
            if (rawTime < Calculator.convertTimeFromStringToMilliseconds(barChart.labels[i])) {
              barChart.labels.splice(i, 0, flooredTime);
              barChart.data[0].splice(i, 0, 1);
              return barChart;
            }
          }
          barChart.labels.push(flooredTime);
          barChart.data[0].push(1);
          return barChart;
        } else {
          barChart.data[0][index] += 1;
          return barChart;
        }
      } else {
        return barChart;
      }

    };

    /**
     * Set chart defaults.
     */
    self.setChartDefaults = function() {

      Chart.defaults.global.animation = false;
      Chart.defaults.global.colours = ['#4D5360', '#46BFBD', '#FDB45C'];
      Chart.defaults.global.tooltipCornerRadius = 2;
      Chart.defaults.global.tooltipFontSize = 12;
      Chart.defaults.global.tooltipTitleFontSize = 12;
      Chart.defaults.Line.bezierCurve = false;
      Chart.defaults.Line.datasetStrokeWidth = 1;
      Chart.defaults.Line.pointDotRadius = 0;
      Chart.defaults.Line.pointHitDetectionRadius = 10;

    };


  }

  angular.module('charts').service('ChartsService', ['Calculator', 'Constants', ChartsService]);

})();
