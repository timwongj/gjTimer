(function() {

  'use strict';

  var Calculator,
    results,
    average,
    mean,
    largeMean,
    timeMilliseconds,
    timeString;

  describe('The calculator service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      Calculator = $injector.get('Calculator');

    }));

    describe('calculateAverage function', function() {

      it('should calculate the average of the results without penalties', function() {

        results = [
          { time: 644, penalty: ''},
          { time: 848, penalty: ''},
          { time: 708, penalty: ''},
          { time: 420, penalty: ''},
          { time: 625, penalty: ''}
        ];

        average = Calculator.calculateAverage(results);

        expect(average).toEqual(659);

      });

    });

    describe('calculateMean function', function() {

      it('should calculate the mean of the results without penalties', function() {

        results = [
          { time: 644, penalty: ''},
          { time: 708, penalty: ''},
          { time: 625, penalty: ''}
        ];

        mean = Calculator.calculateMean(results);

        expect(mean).toEqual(659);

      });

    });

    describe('calculateLargeMean function', function() {

      it('should calculate the large mean of the results without penalties', function() {

        results = [
          { time: 644, penalty: ''},
          { time: 848, penalty: ''},
          { time: 708, penalty: ''},
          { time: 420, penalty: ''},
          { time: 625, penalty: ''}
        ];

        largeMean = Calculator.calculateLargeMean(results);

        expect(largeMean).toEqual(649);

      });

    });

    describe('convertTimeFromStringToMilliseconds function', function() {

      it('should convert the time from a string to milliseconds', function() {

        timeString = '6.25';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(6250);

      });

    });

    describe('convertTimeFromMillisecondsToString function', function() {

      it('should convert the time from milliseconds to a string', function() {

        timeMilliseconds = 6440;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds);
        expect(timeString).toEqual('6.440');

      });

    });

  });

})();
