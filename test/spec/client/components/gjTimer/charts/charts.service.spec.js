(function() {

  'use strict';

  var ChartsService,
    Calculator,
    Constants,
    results,
    result,
    lineChartData,
    barChartData;

  describe('The charts service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      ChartsService = $injector.get('ChartsService');
      Calculator = $injector.get('Calculator');
      Constants = $injector.get('Constants');

      results = [
        { index: 0, rawTime: 6250, avg5: 'DNF', avg12: 'DNF' },
        { index: 1, rawTime: 6440, avg5: 'DNF', avg12: 'DNF' },
        { index: 2, rawTime: 8480, avg5: 'DNF', avg12: 'DNF' },
        { index: 3, rawTime: 5580, avg5: 'DNF', avg12: 'DNF' },
        { index: 4, rawTime: 7080, avg5: '6.25', avg12: 'DNF' }
      ];

      result = { index: 3, rawTime: 17380, avg5: 'DNF', avg12: 'DNF' };

      spyOn(Calculator, 'extractRawTimes').and.callThrough();
      spyOn(Calculator, 'convertTimeFromStringToMilliseconds').and.callThrough();
      spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.callThrough();
    }));

    describe('initLineChartData function', function() {
      it('should return the line chart data', function() {
        lineChartData = ChartsService.initLineChartData(results);
        expect(lineChartData).toEqual({
          series: ['Time', 'Avg 5', 'Avg 12'],
          labels: [1, 2, 3, 4, 5],
          data: [ [ 6.25, 6.44, 8.48, 5.58, 7.08 ], [ null, null, null, null, 6.25 ], [ null, null, null, null, null ] ]
        });
      });
    });

    describe('initBarChartData function', function() {
      it('should return the bar chart data', function() {
        barChartData = ChartsService.initBarChartData(results);
        expect(barChartData).toEqual({
          labels: [ '6', '8', '5', '7'],
          data: [ [2, 1, 1, 1] ]
        });
      });
    });

    describe('addLineChartData function', function() {
      it('should return the line chart data with the new result', function() {
        lineChartData = {
          series: ['Time', 'Avg 5', 'Avg 12'],
          labels: [1, 2, 3],
          data: [ [ 6.25, 6.44, 8.48 ], [ null, null, null ], [ null, null, null ] ]
        };
        lineChartData = ChartsService.addLineChartData(lineChartData, result);
        expect(lineChartData).toEqual({
          series: ['Time', 'Avg 5', 'Avg 12'],
          labels: [1, 2, 3, 4],
          data: [ [ 6.25, 6.44, 8.48, 17.38 ], [ null, null, null, null ], [ null, null, null, null ] ]
        });
      });
    });

    describe('addBarChartData function', function() {
      it('should return the bar chart data with the new result', function() {
        barChartData = {
          labels: [ '6', '8', '5', '7'],
          data: [ [2, 1, 1, 1] ]
        };
        barChartData = ChartsService.addBarChartData(barChartData, result);
        expect(barChartData).toEqual({
          labels: [ '6', '8', '5', '7', '17'],
          data: [ [2, 1, 1, 1, 1] ]
        });
      });
    });

  });

})();
