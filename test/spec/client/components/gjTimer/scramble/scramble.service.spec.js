(function() {

  'use strict';

  var ScrambleService,
    $q,
    $timeout,
    eventId,
    scramble,
    scramble_string,
    state;

  describe('The scramble service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      ScrambleService = $injector.get('ScrambleService');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');

      ScrambleService.scramble = { scramble_string: 'scramble_string', state: 'state' };
      eventId = '333';
      scramble = { scramble_string: 'scramble_string', state: 'state' };

      spyOn(scramblers[eventId], 'getRandomScramble').and.callFake(function() { return scramble; });

    }));

    describe('getScrambleState function', function() {
      it('should return the current scramble state', function() {
        expect(ScrambleService.getScrambleState()).toEqual(ScrambleService.scramble.state);
      });
    });

    describe('getNewScramble function', function() {
      it('should set self.scramble to the random scramble and return it', function(done) {
        ScrambleService.getNewScrambleAsync(eventId)
          .then(function(scramble_string) {
            expect(scramblers[eventId].getRandomScramble).toHaveBeenCalledWith();
            expect(ScrambleService.scramble).toEqual(scramble);
            expect(scramble_string).toEqual(scramble.scramble_string);
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });

      it('should return the scramble_string with the last whitespace removed if it exists', function(done) {
        scramble.scramble_string = scramble.scramble_string + ' ';
        ScrambleService.getNewScrambleAsync(eventId)
          .then(function(scramble_string) {
            expect(scramblers[eventId].getRandomScramble).toHaveBeenCalledWith();
            expect(ScrambleService.scramble).toEqual(scramble);
            expect(scramble_string).toEqual(scramble.scramble_string.substring(0, scramble.scramble_string.length - 1));
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });
    });

  });

})();
