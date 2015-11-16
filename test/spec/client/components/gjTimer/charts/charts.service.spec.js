(function() {

  'use strict';

  var ChartsService,
    Calculator,
    Constants,
    results,
    result1,
    result2,
    result3,
    result4,
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
        { index: 4, rawTime: 7080, avg5: '6.25', avg12: 'DNF' },
        { index: 5, rawTime: 6250, avg5: '7.08', avg12: 'DNF' },
        { index: 6, rawTime: 6440, avg5: '9.69', avg12: 'DNF' },
        { index: 7, rawTime: 8480, avg5: '8.48', avg12: 'DNF' },
        { index: 8, rawTime: 5580, avg5: '6.44', avg12: 'DNF' },
        { index: 9, rawTime: 7080, avg5: '9.12', avg12: 'DNF' },
        { index: 10, rawTime: 6250, avg5: '10.38', avg12: 'DNF' },
        { index: 11, rawTime: 6440, avg5: '6.95', avg12: '9.69' },
        { index: 12, rawTime: 8480, avg5: '7.69', avg12: '8.48' },
        { index: 13, rawTime: 5580, avg5: '7.08', avg12: '8.28' },
        { index: 14, rawTime: Constants.DNF, avg5: '6.25', avg12: '7.08' }
      ];

      result1 = { index: 15, rawTime: 17380, avg5: '8.48', avg12: '9.69' };
      result2 = { index: 16, rawTime: Constants.DNF, avg5: 'DNF', avg12: 'DNF' };
      result3 = { index: 17, rawTime: 6445, avg5: '8.48', avg12: '7.08' };
      result4 = { index: 18, rawTime: 12000, avg5: '9.99', avg12: '8.48' };

      spyOn(Calculator, 'extractRawTimes').and.callThrough();
      spyOn(Calculator, 'convertTimeFromStringToMilliseconds').and.callThrough();
      spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.callThrough();
    }));

    describe('initLineChartData function', function() {
      it('should return the line chart data', function() {
        lineChartData = ChartsService.initLineChartData(results);
        expect(lineChartData).toEqual({
          series: [ 'Time', 'Avg 5', 'Avg 12' ],
          labels: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
          data: [
            [ 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, null ],
            [ null, null, null, null, 6.25, 7.08, 9.69, 8.48, 6.44, 9.12, 10.38, 6.95, 7.69, 7.08, 6.25 ],
            [ null, null, null, null, null, null, null, null, null, null, null, 9.69, 8.48, 8.28, 7.08 ]
          ]
        });
      });
    });

    describe('initBarChartData function', function() {
      it('should return the bar chart data', function() {
        barChartData = ChartsService.initBarChartData(results);
        expect(barChartData).toEqual({
          labels: [ '6', '8', '5', '7'],
          data: [ [6, 3, 3, 2] ]
        });
      });
    });

    describe('addLineChartData function', function() {
      it('should return the line chart data with the new result', function() {
        lineChartData = {
          series: [ 'Time', 'Avg 5', 'Avg 12' ],
          labels: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ],
          data: [
            [ 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, null ],
            [ null, null, null, null, 6.25, 7.08, 9.69, 8.48, 6.44, 9.12, 10.38, 6.95, 7.69, 7.08, 6.25 ],
            [ null, null, null, null, null, null, null, null, null, null, null, 9.69, 8.48, 8.28, 7.08 ]
          ]
        };
        lineChartData = ChartsService.addLineChartData(lineChartData, result1);
        expect(lineChartData).toEqual({
          series: [ 'Time', 'Avg 5', 'Avg 12' ],
          labels: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
          data: [
            [ 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, null, 17.38 ],
            [ null, null, null, null, 6.25, 7.08, 9.69, 8.48, 6.44, 9.12, 10.38, 6.95, 7.69, 7.08, 6.25, 8.48 ],
            [ null, null, null, null, null, null, null, null, null, null, null, 9.69, 8.48, 8.28, 7.08, 9.69 ]
          ]
        });
        lineChartData = ChartsService.addLineChartData(lineChartData, result2);
        expect(lineChartData).toEqual({
          series: [ 'Time', 'Avg 5', 'Avg 12' ],
          labels: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17 ],
          data: [
            [ 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, 7.08, 6.25, 6.44, 8.48, 5.58, null, 17.38, null ],
            [ null, null, null, null, 6.25, 7.08, 9.69, 8.48, 6.44, 9.12, 10.38, 6.95, 7.69, 7.08, 6.25, 8.48, null ],
            [ null, null, null, null, null, null, null, null, null, null, null, 9.69, 8.48, 8.28, 7.08, 9.69, null ]
          ]
        });
      });
    });

    describe('addBarChartData function', function() {
      it('should return the bar chart data with the new result', function() {
        barChartData = {
          labels: [ '6', '8', '5', '7'],
          data: [ [6, 3, 3, 2] ]
        };
        barChartData = ChartsService.addBarChartData(barChartData, result1);
        expect(barChartData).toEqual({
          labels: [ '6', '8', '5', '7', '17'],
          data: [ [6, 3, 3, 2, 1] ]
        });
        barChartData = ChartsService.addBarChartData(barChartData, result2);
        expect(barChartData).toEqual({
          labels: [ '6', '8', '5', '7', '17'],
          data: [ [6, 3, 3, 2, 1] ]
        });
        barChartData = ChartsService.addBarChartData(barChartData, result3);
        expect(barChartData).toEqual({
          labels: [ '6', '8', '5', '7', '17'],
          data: [ [7, 3, 3, 2, 1] ]
        });
        barChartData = ChartsService.addBarChartData(barChartData, result4);
        expect(barChartData).toEqual({
          labels: [ '6', '8', '5', '7', '12', '17'],
          data: [ [7, 3, 3, 2, 1, 1] ]
        });
      });
    });

    describe('setChartDefaults function', function() {
      it('should set the settings for the charts', function() {
        ChartsService.setChartDefaults();
      });
    });

  });

})();
