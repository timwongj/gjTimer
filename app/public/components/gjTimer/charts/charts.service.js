(function() {

  'use strict';

  function ChartsService(Calculator) {

    var self = this;

    /**
     * Convert results to line chart data
     * @param results
     * @returns {{indices: Array, singles: Array, avg5: Array, avg12: Array}}
     */
    self.getLineChartData = function(results) {

      var data = { indices: [], singles: [], avg5: [], avg12: [] };

      for (var i = 0; i < results.length; i++) {
        data.indices.push(results[i].index);
        data.singles.push(results[i].rawTime / 1000);
        data.avg5.push(Calculator.convertTimeFromStringToMilliseconds(results[i].avg5) / 1000);
        data.avg12.push(Calculator.convertTimeFromStringToMilliseconds(results[i].avg12) / 1000);
      }

      return {
        labels: data.indices,
        datasets: [
          {
            label: 'Single',
            fillColor: "rgba(150,150,150,0.2)",
            strokeColor: "rgba(150,150,150,1)",
            pointColor: "rgba(150,150,150,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(150,150,150,1)",
            data: data.singles
          }, {
            label: 'Avg 5',
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: data.avg5
          }, {
            label: 'Avg 12',
            fillColor: "rgba(190,145,195,0.2)",
            strokeColor: "rgba(190,145,195,1)",
            pointColor: "rgba(190,145,195,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(190,145,195,1)",
            data: data.avg12
          }
        ]
      };

    };

    /**
     * Get Line Chart Options
     * @returns {{scaleShowGridLines: boolean, scaleGridLineColor: string, scaleGridLineWidth: number, scaleShowHorizontalLines: boolean, scaleShowVerticalLines: boolean, bezierCurve: boolean, bezierCurveTension: number, pointDot: boolean, pointDotRadius: number, pointDotStrokeWidth: number, pointHitDetectionRadius: number, datasetStroke: boolean, datasetStrokeWidth: number, datasetFill: boolean, legendTemplate: string}}
     */
    self.getLineChartOptions = function() {

      return {
        animation: false,
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(0,0,0,.05)",
        scaleGridLineWidth : 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        bezierCurve : false,
        pointDot : true,
        pointDotRadius : 4,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
      };

    };

  }

  angular.module('charts').service('ChartsService', ['Calculator', ChartsService]);

})();
