(function() {

  'use strict';

  var CubService,
    $sce,
    Events,
    eventId,
    state,
    cub,
    el,
    height,
    width,
    ratio;

  describe('The cub service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      CubService = $injector.get('CubService');
      $sce = $injector.get('$sce');
      Events = $injector.get('Events');

      eventId = '333';
      state = 'state';
      el = document.createElement('div');
      width = 150;
      ratio = 1.5;
      height = width / ratio;

      spyOn(Events, 'getEventSvg').and.returnValue({ width: width, ratio: ratio });
      spyOn(scramblers[eventId], 'drawScramble').and.callFake(function() {});
      spyOn($sce, 'trustAsHtml').and.callThrough();
    }));

    describe('drawScramble function', function() {
      it('return a $sce trusted html element of the scrambled puzzle', function() {
        cub = CubService.drawScramble(eventId, state);
        expect(Events.getEventSvg).toHaveBeenCalledWith(eventId);
        expect(scramblers[eventId].drawScramble).toHaveBeenCalledWith(el, state, height, width);
        expect($sce.trustAsHtml).toHaveBeenCalledWith('<div></div>');
        expect(cub.$$unwrapTrustedValue()).toEqual('<div></div>');
      });
    });

  });

})();
