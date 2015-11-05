(function() {

  'use strict';

  var TimerService,
    LocalStorage,
    Calculator,
    moment,
    precision,
    time,
    timeString,
    scramble,
    sessionId,
    session,
    now;

  describe('The timer service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      TimerService = $injector.get('TimerService');
      LocalStorage = $injector.get('LocalStorage');
      Calculator = $injector.get('Calculator');

      precision = 2;
      time = '6.25';
      scramble = 'scramble';
      sessionId = 'session1';
      now = 'now';

      spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.returnValue(time);
      spyOn(Calculator, 'convertTimeFromStringToMilliseconds').and.returnValue(Number(time) * 100);
      spyOn(LocalStorage, 'getJSON').and.returnValue({ results: [] });
      spyOn(LocalStorage, 'setJSON');
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

    describe('saveResult function', function() {

      it('should get the session from the LocalStorage service', function() {

        TimerService.saveResult(time, scramble, sessionId);
        expect(LocalStorage.getJSON).toHaveBeenCalledWith(sessionId);

      });

      it('should call the convertTimeFromStringToMilliseconds function from the Calculator service with the time', function() {

        TimerService.saveResult(time, scramble, sessionId);
        expect(Calculator.convertTimeFromStringToMilliseconds).toHaveBeenCalledWith(time);

      });

      it('should set the session using the LocalStorage service', function() {

        session = {
          results: [ '625|scramble|' + now ]
        };

        TimerService.saveResult(time, scramble, sessionId);
        expect(LocalStorage.setJSON).toHaveBeenCalledWith(sessionId, session);

      });

    });

  });

})();
