(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    ChartsController,
    ChartsService,
    results,
    result,
    lineChart,
    barChart;

  describe('The charts controller', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      ChartsService = $injector.get('ChartsService');

      results = [ { rawTime: 6250 }, { rawTime: 6440 }, { rawTime: 8480 } ];
      result = { rawTime: 5580 };
      lineChart = { series: ['lineChartSeries'], labels: ['lineChartLabels'], data: ['lineChartData'] };
      barChart = { labels: ['barChartLabels'], data: ['barChartData'] };

      spyOn(ChartsService, 'setChartDefaults');
      spyOn(ChartsService, 'initLineChartData').and.returnValue(lineChart);
      spyOn(ChartsService, 'initBarChartData').and.returnValue(barChart);
      spyOn(ChartsService, 'addLineChartData').and.returnValue(lineChart);
      spyOn(ChartsService, 'addBarChartData').and.returnValue(barChart);

      ChartsController = $controller('ChartsController as ctrl', {
        $scope: $scope,
        ChartsService: ChartsService
      });

      $scope.$digest();
    }));

    it('should call the ChartsService to set the default Chart settings', function() {
      expect(ChartsService.setChartDefaults).toHaveBeenCalledWith();
    });

    describe('refresh charts event', function() {
      it('should call the ChartsService to initialize the line and bar chart data', function() {
        $rootScope.$broadcast('refresh charts', results);
        expect(ChartsService.initLineChartData).toHaveBeenCalledWith(results);
        expect(ChartsService.initBarChartData).toHaveBeenCalledWith(results);
        expect(ChartsController.lineChartSeries).toEqual(lineChart.series);
        expect(ChartsController.lineChartLabels).toEqual(lineChart.labels);
        expect(ChartsController.lineChartData).toEqual(lineChart.data);
        expect(ChartsController.barChartLabels).toEqual(barChart.labels);
        expect(ChartsController.barChartData).toEqual(barChart.data);
      });
    });

    describe('new result event', function() {
      it('should call the ChartsService to add data to the line and bar charts', function() {
        $rootScope.$broadcast('new result', result);
        expect(ChartsService.addLineChartData.calls.argsFor(0)[1]).toEqual(result);
        expect(ChartsService.addBarChartData.calls.argsFor(0)[1]).toEqual(result);
        expect(ChartsController.lineChartSeries).toEqual(lineChart.series);
        expect(ChartsController.lineChartLabels).toEqual(lineChart.labels);
        expect(ChartsController.lineChartData).toEqual(lineChart.data);
        expect(ChartsController.barChartLabels).toEqual(barChart.labels);
        expect(ChartsController.barChartData).toEqual(barChart.data);
      });
    });

  });

})();
