(function() {

  'use strict';

  var ScrambleService,
    eventId,
    scramble,
    scramble_string,
    state;

  describe('The scramble service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      ScrambleService = $injector.get('ScrambleService');

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

      it('should set self.scramble to be the result of the getRandomScramble function from the scramblers library', function() {

        ScrambleService.getNewScramble(eventId);
        expect(scramblers[eventId].getRandomScramble).toHaveBeenCalledWith();
        expect(ScrambleService.scramble).toEqual(scramble);

      });

      it('should return the scramble_string', function() {

        scramble_string = ScrambleService.getNewScramble(eventId);
        expect(scramble_string).toEqual(scramble.scramble_string);

      });

      it('should return the scramble_string with the last whitespace removed if it exists', function() {

        scramble.scramble_string = scramble.scramble_string + ' ';
        scramble_string = ScrambleService.getNewScramble(eventId);
        expect(scramble_string).toEqual(scramble.scramble_string.substring(0, scramble.scramble_string.length - 1));

      });

    });

  });

})();
