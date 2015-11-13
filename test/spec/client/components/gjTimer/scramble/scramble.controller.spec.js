(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    $sce,
    $q,
    $timeout,
    ScrambleController,
    ScrambleService,
    Events,
    eventId,
    scramble,
    state,
    style;

  describe('The scramble controller', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $sce = $injector.get('$sce');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');
      $controller = $injector.get('$controller');
      ScrambleService = $injector.get('ScrambleService');
      Events = $injector.get('Events');

      eventId = '333';
      scramble = 'scramble';
      state = 'state';
      style = 'style';

      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(ScrambleService, 'getNewScrambleAsync').and.returnValue($q.resolve(scramble));
      spyOn($sce, 'trustAsHtml').and.callThrough();
      spyOn(ScrambleService, 'getScrambleState').and.returnValue(state);
      spyOn(Events, 'getEventStyle').and.returnValue(style);

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
      it('should get a new scramble from the ScrambleService and set its scramble, displayedScramble, and style', function() {
        $rootScope.$broadcast('new scramble', eventId);
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
        expect(ScrambleService.getNewScrambleAsync).toHaveBeenCalledWith(eventId);
        expect(ScrambleController.scramble).toEqual(scramble);
        expect($sce.trustAsHtml).toHaveBeenCalledWith(ScrambleController.scramble);
        expect(ScrambleController.displayedScramble.$$unwrapTrustedValue()).toEqual(ScrambleController.scramble);
        expect(Events.getEventStyle).toHaveBeenCalledWith(eventId);
        expect(ScrambleController.scrambleStyle).toEqual(style);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('draw scramble', eventId, state);
      });
    });

  });

})();
