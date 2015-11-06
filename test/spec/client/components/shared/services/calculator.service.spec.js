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

    });

    describe('calculateAverageString function', function() {

    });

    describe('calculateStandardDeviation function', function() {

    });

    describe('calculateStandardDeviationString function', function() {

    });

    describe('calculateSessionMeanAndStandardDeviationString function', function() {

    });

    describe('calculateBestAverageAndStandardDeviationString function', function() {

    });

    describe('extractRawTimes function', function() {

    });

    describe('countNonDNFs function', function() {

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
