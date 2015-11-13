(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    $sce,
    ScrambleController,
    ScrambleService,
    Events,
    eventId,
    scramble,
    state,
    style;

  xdescribe('The scramble controller', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $sce = $injector.get('$sce');
      $controller = $injector.get('$controller');
      ScrambleService = $injector.get('ScrambleService');
      Events = $injector.get('Events');

      eventId = '333';
      scramble = 'scramble';
      state = 'state';
      style = 'style';

      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(ScrambleService, 'getNewScramble').and.callFake(function() { return scramble; });
      spyOn($sce, 'trustAsHtml').and.callThrough();
      spyOn(ScrambleService, 'getScrambleState').and.callFake(function() { return state; });
      spyOn(Events, 'getEventStyle').and.callFake(function() { return style; });

      ScrambleController = $controller('ScrambleController', {
        $scope: $scope,
        $rootScope: $rootScope,
        $sce: $sce,
        ScrambleService: ScrambleService,
        Events: Events
      });

      $scope.$digest();

    }));


    describe('new scramble event', function() {

      it('should call the getNewScramble function from the ScrambleService with the eventId and set self.scramble to the new scramble', function() {

        $rootScope.$broadcast('new scramble', eventId);
        expect(ScrambleService.getNewScramble).toHaveBeenCalledWith(eventId);
        expect(ScrambleController.scramble).toEqual(scramble);

      });

      it('should call the trustAsHtml function from the $sce service and set self.scramble to it', function() {

        $rootScope.$broadcast('new scramble', eventId);
        expect($sce.trustAsHtml).toHaveBeenCalledWith(ScrambleController.scramble);
        expect(ScrambleController.displayedScramble.$$unwrapTrustedValue()).toEqual(ScrambleController.scramble);

      });

      it('should call the getEventStyle from the Events service with the eventId and set self.scrambleStyle to it', function() {

        $rootScope.$broadcast('new scramble', eventId);
        expect(Events.getEventStyle).toHaveBeenCalledWith(eventId);
        expect(ScrambleController.scrambleStyle).toEqual(style);

      });

      it('should broadcast the draw scramble event', function() {

        $rootScope.$broadcast('new scramble', eventId);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('draw scramble', eventId, state);

      });

    });

  });

})();
