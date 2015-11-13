(function() {

  'use strict';

  var ResultsService,
    LocalStorage,
    Calculator,
    Constants,
    $q,
    $timeout,
    results,
    time,
    penalty,
    comment,
    scramble,
    sessionId,
    precision,
    saveScramble,
    session,
    now;

  describe('The results service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      ResultsService = $injector.get('ResultsService');
      LocalStorage = $injector.get('LocalStorage');
      Calculator = $injector.get('Calculator');
      Constants = $injector.get('Constants');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');

      results = [];
      scramble = 'scramble';
      sessionId = 'session1';
      time = '6.25';
      penalty = '';
      comment = '';
      precision = 2;
      saveScramble = true;
      now = 'now';

      spyOn(LocalStorage, 'getJSON');
      spyOn(LocalStorage, 'getJSONAsync').and.returnValue($q.resolve({ results: [] }));
      spyOn(LocalStorage, 'setJSON');
      spyOn(LocalStorage, 'setJSONAsync').and.returnValue($q.resolve());
      spyOn(Calculator, 'convertTimeFromMillisecondsToString').and.returnValue(time);
      spyOn(Calculator, 'convertTimeFromStringToMilliseconds').and.returnValue(Number(time) * 100);
      spyOn(Date, 'now').and.returnValue(now);

    }));

    describe('getResultsAsync function', function() {
      it('should get the rawResults from the LocalStorage service', function(done) {
        ResultsService.getResultsAsync(sessionId, precision)
          .then(function(results) {
            expect(LocalStorage.getJSONAsync).toHaveBeenCalledWith(sessionId);
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });
    });

    describe('saveResultAsync function', function() {
      it('should save the result using the LocalStorage service', function(done) {
        session = { results: [ '625|scramble|' + now ] };
        ResultsService.saveResultAsync(results, time, penalty, comment, scramble, sessionId, precision, saveScramble)
          .then(function() {
            expect(LocalStorage.getJSONAsync).toHaveBeenCalledWith(sessionId);
            expect(Calculator.convertTimeFromStringToMilliseconds).toHaveBeenCalledWith(time);
            expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalled();
            expect(LocalStorage.setJSONAsync).toHaveBeenCalledWith(sessionId, session);
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });

      it('should save the result with the penalty using the LocalStorage service', function(done) {
        session = { results: [ '625+|scramble|' + now ] };
        penalty = '+2';
        ResultsService.saveResultAsync(results, time, penalty, comment, scramble, sessionId, precision, saveScramble)
          .then(function() {
            expect(LocalStorage.getJSONAsync).toHaveBeenCalledWith(sessionId);
            expect(Calculator.convertTimeFromStringToMilliseconds).toHaveBeenCalledWith(time);
            expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalled();
            expect(LocalStorage.setJSONAsync).toHaveBeenCalledWith(sessionId, session);
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });

      it('should save the result with the comment using the LocalStorage service', function(done) {
        session = { results: [ '625|scramble|' + now + '|yw' ] };
        comment = 'yw';
        ResultsService.saveResultAsync(results, time, penalty, comment, scramble, sessionId, precision, saveScramble)
          .then(function() {
            expect(LocalStorage.getJSONAsync).toHaveBeenCalledWith(sessionId);
            expect(Calculator.convertTimeFromStringToMilliseconds).toHaveBeenCalledWith(time);
            expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalled();
            expect(LocalStorage.setJSONAsync).toHaveBeenCalledWith(sessionId, session);
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });

      it('should not save the scramble if saveScramble is false', function(done) {
        session = session = { results: [ '625||' + now ] };
        saveScramble = false;
        ResultsService.saveResultAsync(results, time, penalty, comment, scramble, sessionId, precision, saveScramble)
          .then(function() {
            expect(LocalStorage.getJSONAsync).toHaveBeenCalledWith(sessionId);
            expect(Calculator.convertTimeFromStringToMilliseconds).toHaveBeenCalledWith(time);
            expect(Calculator.convertTimeFromMillisecondsToString).toHaveBeenCalled();
            expect(LocalStorage.setJSONAsync).toHaveBeenCalledWith(sessionId, session);
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });
    });

    describe('penaltyAsync function', function() {

    });

    describe('removeAsync function', function() {

    });

    describe('commentAsync function', function() {

    });

  });

})();
