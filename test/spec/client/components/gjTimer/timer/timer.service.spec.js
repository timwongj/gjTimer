(function() {

  'use strict';

  var TimerService,
    Calculator,
    precision,
    time,
    timeString,
    now;

  describe('The timer service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      TimerService = $injector.get('TimerService');
      Calculator = $injector.get('Calculator');

      precision = 2;
      time = '6.25';
      now = 'now';

      spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.returnValue(time);
      spyOn(Calculator, 'convertTimeFromStringToMilliseconds').and.returnValue(Number(time) * 100);
      spyOn(Date, 'now').and.returnValue(now);

    }));

    describe('getTime function', function() {

      it('should call the convertTimeFromMillisecondsToString function from the Calculator service', function() {

        TimerService.startTime = new Date(0);
        timeString = TimerService.getTime(precision);
        expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalled();

      });

      it('should get the current time', function() {

        TimerService.startTime = new Date(0);
        timeString = TimerService.getTime(precision);
        expect(timeString).toEqual(time);

      });

    });

    describe('startTimer function', function() {

      it('should set self.startTime to be the current time', function() {

        TimerService.startTimer();
        expect(TimerService.startTime).toEqual(now);

      });

    });

  });

})();
