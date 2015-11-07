(function() {

  'use strict';

  var ResultsService,
    LocalStorage,
    Calculator,
    Constants,
    results,
    time,
    penalty,
    comment,
    scramble,
    sessionId,
    precision,
    session,
    now;

  describe('The results service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      ResultsService = $injector.get('ResultsService');
      LocalStorage = $injector.get('LocalStorage');
      Calculator = $injector.get('Calculator');
      Constants = $injector.get('Constants');

      results = [];
      scramble = 'scramble';
      sessionId = 'session1';
      time = '6.25';
      penalty = '';
      comment = '';
      precision = 2;
      now = 'now';

      spyOn(LocalStorage, 'getJSON').and.returnValue({ results: [] });
      spyOn(LocalStorage, 'setJSON');
      spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.returnValue(time);
      spyOn(Calculator, 'convertTimeFromStringToMilliseconds').and.returnValue(Number(time) * 100);
      spyOn(Date, 'now').and.returnValue(now);

    }));

    describe('saveResult function', function() {

      it('should get the session from the LocalStorage service', function() {

        ResultsService.saveResult(results, time, penalty, comment, scramble, sessionId, precision);
        expect(LocalStorage.getJSON).toHaveBeenCalledWith(sessionId);

      });

      it('should call the convertTimeFromStringToMilliseconds function from the Calculator service with the time', function() {

        ResultsService.saveResult(results, time, penalty, comment, scramble, sessionId, precision);
        expect(Calculator.convertTimeFromStringToMilliseconds).toHaveBeenCalledWith(time);

      });

      it('should save the result using the LocalStorage service', function() {

        session = {
          results: [ '625|scramble|' + now ]
        };

        ResultsService.saveResult(results, time, penalty, comment, scramble, sessionId, precision);
        expect(LocalStorage.setJSON).toHaveBeenCalledWith(sessionId, session);

      });

      it('should save the result with the penalty using the LocalStorage service', function() {

        penalty = '+2';
        session = {
          results: [ '625+|scramble|' + now ]
        };

        ResultsService.saveResult(results, time, penalty, comment, scramble, sessionId, precision);
        expect(LocalStorage.setJSON).toHaveBeenCalledWith(sessionId, session);

      });

      it('should save the result with the comment using the LocalStorage service', function() {

        comment = 'yw';
        session = {
          results: [ '625|scramble|' + now + '|yw' ]
        };

        ResultsService.saveResult(results, time, penalty, comment, scramble, sessionId, precision);
        expect(LocalStorage.setJSON).toHaveBeenCalledWith(sessionId, session);

      });

    });

  });

})();
