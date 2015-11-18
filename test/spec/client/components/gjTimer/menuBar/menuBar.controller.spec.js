(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    $timeout,
    $uibModal,
    MenuBarController,
    MenuBarService,
    Events,
    eventId,
    sessionId,
    sessions,
    settings,
    events,
    event;

  describe('The menuBar controller', function() {

    beforeEach(module('ui.bootstrap'));
    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      $timeout = $injector.get('$timeout');
      $uibModal = $injector.get('$uibModal');
      MenuBarService = $injector.get('MenuBarService');
      Events = $injector.get('Events');

      eventId = '333';
      sessionId = 'Session 1';
      settings = { setting1: 'yw', setting2: 'dw' };
      sessions = [ 'Session 1', 'Session 2', 'Session 3' ];
      events = ['333', '444'];

      spyOn($uibModal, 'open');
      spyOn(MenuBarService, 'initSessions').and.returnValue(sessions);
      spyOn(MenuBarService, 'changeSession');
      spyOn(MenuBarService, 'changeEvent');
      spyOn(MenuBarService, 'resetSessionAsync');
      spyOn(Events, 'getEvents').and.returnValue(events);
      spyOn(Events, 'getEventId').and.returnValue(eventId);
      spyOn($rootScope, '$broadcast');

      MenuBarController = $controller('MenuBarController', {
        $scope: $scope,
        $rootScope: $rootScope,
        $timeout: $timeout,
        $uibModal: $uibModal,
        MenuBarService: MenuBarService,
        Events: Events
      }, {
        eventId: eventId,
        sessionId: sessionId
      });

      $scope.$digest();
    }));

    it('should initialize the sessions and events', function() {
      expect(MenuBarService.initSessions).toHaveBeenCalledWith();
      expect(MenuBarController.sessions).toEqual(sessions);
      expect(Events.getEvents).toHaveBeenCalledWith();
      expect(MenuBarController.events).toEqual(events);
      expect(MenuBarController.event.eventId).toEqual(eventId);
    });

    describe('changeSession function', function() {
      describe('when the new session\'s event is the same as that of the current session', function() {
        it('should call the changeSession function from the MenuBarService with the sessionId', function() {
          MenuBarService.changeSession.and.returnValue(eventId);
          MenuBarController.changeSession(sessionId);
          expect(MenuBarController.sessionId).toEqual(sessionId);
          expect(MenuBarController.eventId).toEqual(eventId);
          expect(MenuBarService.changeSession).toHaveBeenCalledWith(sessionId);
          expect($rootScope.$broadcast).toHaveBeenCalledWith('refresh results', sessionId);
        });
      });

      describe('when the new session\'s event is different than that of the current session', function() {
        it('should call the changeSession function from the MenuBarService with the sessionId', function() {
          eventId = '444';
          MenuBarService.changeSession.and.returnValue(eventId);
          MenuBarController.changeSession(sessionId);
          expect(MenuBarController.sessionId).toEqual(sessionId);
          expect(MenuBarController.eventId).toEqual(eventId);
          expect(MenuBarService.changeSession).toHaveBeenCalledWith(sessionId);
          expect($rootScope.$broadcast).toHaveBeenCalledWith('new scramble', eventId);
          expect($rootScope.$broadcast).toHaveBeenCalledWith('refresh results', sessionId);
        });
      });
    });

    describe('changeEvent function', function() {
      it('should call the changeEvent function from the MenuBarService with the eventId', function() {
        event = 'Rubik\'s Cube';
        MenuBarController.changeEvent(event);
        expect(Events.getEventId).toHaveBeenCalledWith(event);
        expect(MenuBarController.eventId).toEqual(eventId);
        expect(MenuBarController.event.eventId).toEqual(eventId);
        expect(MenuBarController.event.event).toEqual(event);
        expect(MenuBarService.changeEvent).toHaveBeenCalledWith(sessionId, eventId);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('new scramble', eventId);
      });
    });

    describe('openSettings function', function() {
      it('should call the open function from the $uibModal service', function() {
        MenuBarController.openSettings();
        expect($uibModal.open).toHaveBeenCalled();
      });
    });

    describe('resetSession function', function() {
      describe('when the user confirms', function() {
        it('should call the resetSession function with the sessionId and empty the results array', function() {
          spyOn(window, 'confirm').and.returnValue(true);
          MenuBarController.resetSession();
          expect(MenuBarController.results).toEqual([]);
          expect(MenuBarService.resetSessionAsync).toHaveBeenCalledWith(sessionId);
        });
      });

      describe('when the user does not confirm', function() {
        it('should not call the resetSession function from the MenuBarService with the sessionId', function() {
          spyOn(window, 'confirm').and.returnValue(false);
          MenuBarController.results = [1, 2, 3];
          MenuBarController.resetSession();
          expect(MenuBarController.results).toEqual([1, 2, 3]);
          expect(MenuBarService.resetSessionAsync).not.toHaveBeenCalledWith(sessionId);
        });
      });
    });

  });

})();
