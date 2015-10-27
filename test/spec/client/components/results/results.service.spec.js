(function() {

  'use strict';

  describe('The results service', function() {

    var ResultsService;

    beforeEach(module('gjTimer'));
    beforeEach(inject(function($injector) {
      ResultsService = $injector.get('ResultsService');
    }));

    describe('getResults function', function() {

    });

    describe('calculateAverage function', function() {

      it('should calculate the average of the results', function() {

        var results = [
          { time: '9.146' },
          { time: '10.336' },
          { time: '9.331' },
          { time: '11.522' },
          { time: '7.252' }
        ];

        var precision = 2;

        var average = ResultsService.calculateAverage(results, precision);
        expect(average).toEqual('9.60');

      });

    });

    describe('calculateMean function', function() {

    });

    describe('timeToMilliseconds function', function() {

    });

  });

})();
