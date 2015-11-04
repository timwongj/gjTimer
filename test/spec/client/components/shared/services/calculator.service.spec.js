(function() {

  'use strict';

  var Calculator,
    rawTimes,
    average,
    mean,
    sessionMean,
    timeMilliseconds,
    timeString;

  describe('The calculator service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      Calculator = $injector.get('Calculator');

    }));

    describe('calculateAverage function', function() {

      it('should calculate the average of the results without penalties', function() {

        rawTimes = [644, 848, 708, 420, 625];

        average = Calculator.calculateAverage(rawTimes);

        expect(average).toEqual(659);

      });

    });

    describe('calculateMean function', function() {

      it('should calculate the mean of the results without penalties', function() {

        rawTimes = [644, 708, 625];

        mean = Calculator.calculateMean(rawTimes);

        expect(mean).toEqual(659);

      });

    });

    describe('calculateSessionMean function', function() {

      it('should calculate the large mean of the results without penalties', function() {

        rawTimes = [644, 848, 708, 420, 625];

        sessionMean = Calculator.calculateSessionMean(rawTimes);

        expect(sessionMean).toEqual(649);

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
