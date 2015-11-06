(function() {

  'use strict';

  var Calculator,
    rawTimes,
    trimmed,
    precision,
    average,
    averageString,
    stDev,
    stDevString,
    avgAndStDev,
    bestAvgAndStDev,
    n,
    result,
    nonDNFs,
    trimmedRawTimes,
    results,
    timeMilliseconds,
    timeString,
    DNF;

  describe('The calculator service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      Calculator = $injector.get('Calculator');
      DNF = Calculator.DNF;

    }));

    describe('calculateAverage function', function() {

      describe('when trimmed is true', function() {

        beforeEach(function() {

          trimmed = true;

        });

        it('should calculate the trimmed average of the rawTimes', function() {

          rawTimes = [993, 977, 873, 926, 1623];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(965);

        });

        it('should calculate the trimmed average of the rawTimes', function() {

          rawTimes = [1900, 2027, 1145, 1777, 1756];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(1811);

        });

        it('should calculate the trimmed average of the rawTimes', function() {

          rawTimes = [7586, 8069, 7626, 7641, 10036];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(7779);

        });

        it('should calculate the trimmed average of the rawTimes', function() {

          rawTimes = [11643, 9973, 8925, 11523, 8845];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(10140);

        });

        it('should not return DNF if one rawTimes is a DNF', function() {

          rawTimes = [DNF, 4305, 3968, 3583, 4317];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(4197);

        });

        it('should not return DNF if one rawTimes is a DNF', function() {

          rawTimes = [657, 1169, 1040, DNF, 949];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(1053);

        });

        it('should return DNF if two or more rawTimes are DNFs', function() {

          rawTimes = [DNF, 4.31, 3.33, 2.82, DNF];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(DNF);

        });

        it('should return DNF if two or more rawTimes are DNFs', function() {

          rawTimes = [531, DNF, 621, DNF, 675];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(DNF);

        });

      });

      describe('when trimmed is false', function() {

        beforeEach(function() {

          trimmed = false;

        });

        it('should calculate the untrimmed average of the rawTimes', function() {

          rawTimes = [4746, 3244, 3871];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(3954);

        });

        it('should calculate the untrimmed average of the rawTimes', function() {

          rawTimes = [5199, 6722, 4404];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(5442);

        });

        it('should calculate the untrimmed average of the rawTimes', function() {

          rawTimes = [22322, 20616, 24830];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(22589);

        });

        it('should calculate the untrimmed average of the rawTimes', function() {

          rawTimes = [15028, 15296, 16206];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(15510);

        });

        it('should return DNF if one or more rawTimes are DNFs', function() {

          rawTimes = [4485, 3858, DNF];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(DNF);

        });

        it('should return DNF if one or more rawTimes are DNFs', function() {

          rawTimes = [DNF, DNF, 5771];
          average = Calculator.calculateAverage(rawTimes, trimmed);
          expect(average).toEqual(DNF);

        });

      });

    });

    describe('calculateAverageString function', function() {

      beforeEach(function() {

        trimmed = true;
        average = 625;
        precision = 2;
        averageString = '6.25';
        spyOn(Calculator, 'calculateAverage').and.returnValue(average);
        spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.returnValue(averageString);

      });

      it('should call the calculateAverage function with the rawTimes and trimmed', function() {

        Calculator.calculateAverageString(rawTimes, trimmed, precision);
        expect(Calculator.calculateAverage).toHaveBeenCalledWith(rawTimes, trimmed);

      });

      it('should call the convertTimeFromMillisecondsToString function with the average and precision', function() {

        Calculator.calculateAverageString(rawTimes, trimmed, precision);
        expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalledWith(average, precision);

      });

      it('should return the correct result', function() {

        result = Calculator.calculateAverageString(rawTimes, trimmed, precision);
        expect(result).toEqual(averageString);

      });

    });

    describe('calculateStandardDeviation function', function() {

      describe('when trimmed is true', function() {

        beforeEach(function() {

          trimmed = true;

        });

        it('should calculate the trimmed standard deviation of the rawTimes', function() {

          rawTimes = [993, 977, 873, 926, 1623];
          stDev = Calculator.calculateStandardDeviation(rawTimes, trimmed);
          expect(stDev).toEqual(29);

        });

        it('should not return DNF if one rawTimes is a DNF', function() {

          rawTimes = [657, 1169, 1040, DNF, 949];
          average = Calculator.calculateStandardDeviation(rawTimes, trimmed);
          expect(average).toEqual(90);

        });

        it('should return DNF if two or more rawTimes are DNFs', function() {

          rawTimes = [DNF, 4.31, 3.33, 2.82, DNF];
          average = Calculator.calculateStandardDeviation(rawTimes, trimmed);
          expect(average).toEqual(DNF);

        });

      });

      describe('when trimmed is false', function() {

        beforeEach(function() {

          trimmed = false;

        });

        it('should calculate the untrimmed standard deviation of the rawTimes', function() {

          rawTimes = [4746, 3244, 3871];
          stDev = Calculator.calculateStandardDeviation(rawTimes, trimmed);
          expect(stDev).toEqual(616);

        });

        it('should return DNF if one or more rawTimes are DNFs', function() {

          rawTimes = [DNF, DNF, 5771];
          average = Calculator.calculateStandardDeviation(rawTimes, trimmed);
          expect(average).toEqual(DNF);

        });

      });

    });

    describe('calculateStandardDeviationString function', function() {

      beforeEach(function() {

        trimmed = true;
        stDev = 420;
        precision = 3;
        stDevString = '6.25';
        spyOn(Calculator, 'calculateStandardDeviation').and.returnValue(stDev);
        spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.returnValue(stDevString);

      });

      it('should call the calculateAverage function with the rawTimes and trimmed', function() {

        Calculator.calculateStandardDeviationString(rawTimes, trimmed, precision);
        expect(Calculator.calculateStandardDeviation).toHaveBeenCalledWith(rawTimes, trimmed);

      });

      it('should call the convertTimeFromMillisecondsToString function with the average and precision', function() {

        Calculator.calculateStandardDeviationString(rawTimes, trimmed, precision);
        expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalledWith(stDev, precision);

      });

      it('should return the correct result', function() {

        result = Calculator.calculateStandardDeviationString(rawTimes, trimmed, precision);
        expect(result).toEqual(stDevString);

      });

    });

    describe('calculateSessionMeanAndStandardDeviationString function', function() {

      beforeEach(function() {

        rawTimes = [993, 977, 873, 926, 1623, 983, 1149, 867, 1153, 883, 1528, 1020, 1079, 920, 963];
        precision = 3;
        result = {
          mean: 625,
          stDev: 644
        };

        spyOn(Calculator, 'calculateAverageString').and.returnValue(result.mean);
        spyOn(Calculator, 'calculateStandardDeviationString').and.returnValue(result.stDev);

      });

      it('should remove any DNFs from the times', function() {

        rawTimes = [DNF, 420, 625, 644, DNF, 708, 848];
        trimmedRawTimes = [420, 625, 644, 708, 848];
        avgAndStDev = Calculator.calculateSessionMeanAndStandardDeviationString(rawTimes, precision);
        expect(Calculator.calculateAverageString).toHaveBeenCalledWith(trimmedRawTimes, false, precision);
        expect(Calculator.calculateStandardDeviationString).toHaveBeenCalledWith(trimmedRawTimes, false, precision);

      });

      it('should call the calculateAverageString function with the times, false, and precision', function() {

        Calculator.calculateSessionMeanAndStandardDeviationString(rawTimes, precision);
        expect(Calculator.calculateAverageString).toHaveBeenCalledWith(rawTimes, false, precision);

      });

      it('should call the calculateStandardDeviationString function with the times, false, and precision', function() {

        Calculator.calculateSessionMeanAndStandardDeviationString(rawTimes, precision);
        expect(Calculator.calculateStandardDeviationString).toHaveBeenCalledWith(rawTimes, false, precision);

      });

      it('should return the correct average and standard deviation', function() {

        avgAndStDev = Calculator.calculateSessionMeanAndStandardDeviationString(rawTimes, precision);
        expect(avgAndStDev).toEqual(result);

      });

    });

    describe('calculateBestAverageAndStandardDeviationString function', function() {

      beforeEach(function() {

        trimmed = true;
        n = 5;
        precision = 2;

      });

      describe('testing the behavior', function() {

        beforeEach(function() {

          rawTimes = [420, 525, 19, 555, 558, 615, 625, 42, 644, 708, 848, 350, 1738, 6969];

          result = {
            index: 0,
            avg: '6.25',
            stDev: '4.20'
          };

          spyOn(Calculator, 'calculateAverage').and.returnValue(644);
          spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.returnValue(result.avg);
          spyOn(Calculator, 'calculateStandardDeviationString').and.returnValue(result.stDev);

        });

        it('should call the calculateAverage function with each subset of rawTimes and trimmed', function() {

          Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, trimmed, n, precision);
          for (var i = 0; i < rawTimes.length - n; i++) {
            expect(Calculator.calculateAverage).toHaveBeenCalledWith(rawTimes.slice(i, i + n), trimmed);
          }

        });

        it('should call the convertTimeFromMillisecondsToString function with the bestAvg and precision', function() {

          Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, trimmed, n, precision);
          expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalledWith(644, precision);

        });

        it('should call the calculateStandardDeviationString function with the times from the bestAvg, trimmed, and precision', function() {

          Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, trimmed, n, precision);
          expect(Calculator.calculateStandardDeviationString).toHaveBeenCalledWith(rawTimes.slice(0, n), trimmed, precision);

        });

        it('should return the index, average, and standard deviation', function() {

          bestAvgAndStDev = Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, trimmed, n, precision);
          expect(bestAvgAndStDev).toEqual(result);

        });

      });

      describe('testing the correctness', function() {

        beforeEach(function() {

          spyOn(Calculator, 'calculateAverage').and.callThrough();
          spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.callThrough();
          spyOn(Calculator, 'calculateStandardDeviationString').and.callThrough();

        });

        it('should return the correct index, average, and standard deviation', function() {

          rawTimes = [6969, 525, 350, 555, 558, 615, 625, 42, 644, 708, 848, 19, 1738, 420];

          result = {
            index: 7,
            avg: '0.46',
            stDev: '0.30'
          };

          bestAvgAndStDev = Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, trimmed, n, precision);
          expect(bestAvgAndStDev).toEqual(result);

        });

      });

    });

    describe('extractRawTimes function', function() {

      it('should extract rawTimes from results', function() {
        
        results = [
          { rawTime: 625, comment: 'how many times did you delete to get that average?' },
          { rawTime: 644, comment: 'uh oh, riley time!' },
          { rawTime: 420, comment: 'BLAZE IT FGT' },
          { rawTime: 558, comment: 'FIVE FIVE EIGHT' },
          { rawTime: 683, comment: 'edward, what are you dosing?' },
          { rawTime: 555, comment: 'skip the OLL' },
          { rawTime: 708, comment: 'lets remove bigBLD and MBLD' },
          { rawTime: 848, comment: 'how dose you solve that F2L pair?' }
        ];

        rawTimes = Calculator.extractRawTimes(results);
        expect(rawTimes).toEqual([625, 644, 420, 558, 683, 555, 708, 848]);
        
      });
      
    });

    describe('countNonDNFs function', function() {

      it('should count the number of non DNFs in rawTimes', function() {

        rawTimes = [12345, 234324, 2349, 684, 2349, 2923];
        nonDNFs = Calculator.countNonDNFs(rawTimes);
        expect(nonDNFs).toEqual(rawTimes.length);

      });

      it('should count the number of non DNFs in rawTimes', function() {

        rawTimes = [12345, 234324, DNF, 684, 2349, 2923];
        nonDNFs = Calculator.countNonDNFs(rawTimes);
        expect(nonDNFs).toEqual(rawTimes.length - 1);

      });

      it('should count the number of non DNFs in rawTimes', function() {

        rawTimes = [DNF, DNF, 625, 644, 2349, 2923, DNF, 708, DNF];
        nonDNFs = Calculator.countNonDNFs(rawTimes);
        expect(nonDNFs).toEqual(rawTimes.length - 4);

      });

    });

    describe('convertTimeFromStringToMilliseconds function', function() {

      it('should convert the time from a string to milliseconds', function() {

        timeString = '6.25';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(6250);

      });

      it('should convert the time from a string to milliseconds', function() {

        timeString = '6.445';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(6445);

      });

      it('should convert the time from a string to milliseconds', function() {

        timeString = '2:35.10';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(155100);

      });

      it('should convert the time from a string to milliseconds', function() {

        timeString = '4:41.736';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(281736);

      });

      it('should convert the time from a string to milliseconds', function() {

        timeString = '17:38.69';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(1058690);

      });

      it('should convert the time from a string to milliseconds', function() {

        timeString = '1:10:09.69';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(4209690);

      });

      it('should convert a time of DNF to the number representation of DNF', function() {

        timeString = 'DNF';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(DNF);

      });

      it('should convert an invalid input to the number representation of DNF', function() {

        timeString = '420:625:644:848';
        timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(timeString);
        expect(timeMilliseconds).toEqual(DNF);

      });

    });

    describe('convertTimeFromMillisecondsToString function', function() {

      it('should convert the time from milliseconds to a string with the precision', function() {

        timeMilliseconds = 6440;
        precision = 3;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('6.440');

      });

      it('should convert the time from milliseconds to a string with the precision', function() {

        timeMilliseconds = 6259;
        precision = 2;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('6.25');

      });

      it('should convert the time from milliseconds to a string with the precision', function() {

        timeMilliseconds = 17380;
        precision = 3;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('17.380');

      });

      it('should convert the time from milliseconds to a string with the precision', function() {

        timeMilliseconds = 169245;
        precision = 2;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('2:49.24');

      });

      it('should convert the time from milliseconds to a string with the precision', function() {

        timeMilliseconds = 1058692;
        precision = 3;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('17:38.692');

      });

      it('should convert the time from milliseconds to a string with the precision', function() {

        timeMilliseconds = 4209693;
        precision = 2;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('1:10:09.69');

      });

      it('should convert an invalid input to an DNF', function() {

        timeMilliseconds = -69;
        precision = 2;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('DNF');

      });

      it('should convert an invalid input to an DNF', function() {

        timeMilliseconds = Infinity;
        precision = 3;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('DNF');

      });

      it('should convert the number representation of DNF to a DNF', function() {

        timeMilliseconds = DNF;
        precision = 3;
        timeString = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);
        expect(timeString).toEqual('DNF');

      });

    });

  });

})();
