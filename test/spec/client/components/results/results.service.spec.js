(function() {

  'use strict';

  var ResultsService,
    results,
    precision,
    average,
    mean;

  describe('The results service', function() {

    beforeEach(module('gjTimer'));
    beforeEach(inject(function($injector) {
      ResultsService = $injector.get('ResultsService');
      precision = 2;
    }));

    describe('getResults function', function() {

    });

    describe('calculateAverage function', function() {

      it('should calculate the average of the results', function() {
        results = [ { time: '9.146' }, { time: '10.336' }, { time: '9.331' }, { time: '11.522' }, { time: '7.252' } ];
        var average = ResultsService.calculateAverage(results, precision);
        expect(average).toEqual('9.60');
      });

    });

    describe('calculateMean function', function() {

      it('should calculate the mean of the results', function() {
        results = [ { time: '9.146' }, { time: '10.336' }, { time: '9.331' } ];
        mean = ResultsService.calculateMean(results, precision);
        expect(mean).toEqual('9.60');
      });

    });

    describe('calculateLargeMean function', function() {

    });

    describe('timeToSeconds function', function() {

    });

  });

})();
