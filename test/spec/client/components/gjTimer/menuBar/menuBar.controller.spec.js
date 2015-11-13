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
    sessionId,
    eventId;

  xdescribe('The menuBar controller', function() {

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

      sessionId = 'Session 1';
      eventId = '333';

      spyOn($uibModal, 'open');
      spyOn(MenuBarService, 'initSettings').and.returnValue({ setting1: 'yw', setting2: 'dw' });
      spyOn(MenuBarService, 'initSessions').and.returnValue([ 'session1', 'session2', 'session3' ]);
      spyOn(MenuBarService, 'initSession').and.returnValue({ sessionId: sessionId, eventId: eventId, results: [] });
      spyOn(MenuBarService, 'changeSession').and.returnValue({ sessionId: sessionId, eventId: eventId, results: [] });
      spyOn(MenuBarService, 'changeEvent');
      spyOn(MenuBarService, 'resetSession');
      spyOn(Events, 'getEvents');
      spyOn(Events, 'getEventId').and.returnValue(eventId);

      MenuBarController = $controller('MenuBarController', {
        $scope: $scope,
        $rootScope: $rootScope,
        $timeout: $timeout,
        $uibModal: $uibModal,
        MenuBarService: MenuBarService,
        Events: Events
      });

      $scope.$digest();

    }));

    it('should call the getSettings function from the MenuBarService', function() {

      expect(MenuBarService.initSettings).toHaveBeenCalled();

    });

    it('should call the initSession function from the MenuBarService', function() {

      expect(MenuBarService.initSession).toHaveBeenCalled();

    });

    it('should call the initSessions function from the MenuBarService', function() {

      expect(MenuBarService.initSessions).toHaveBeenCalled();

    });

    it('should call the getEvents function from the Events service', function() {

      expect(Events.getEvents).toHaveBeenCalled();

    });

    describe('changeSession function', function() {

      it('should call the changeSession function from the MenuBarService with the sessionId', function() {

        MenuBarController.changeSession(sessionId);
        expect(MenuBarService.changeSession).toHaveBeenCalledWith(sessionId);

      });

    });

    describe('changeEvent function', function() {

      it('should call the changeEvent function from the MenuBarService with the eventId', function() {

        MenuBarController.changeEvent(eventId);
        expect(MenuBarService.changeEvent).toHaveBeenCalledWith(sessionId, eventId);

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

        beforeEach(function() {

          spyOn(window, 'confirm').and.returnValue(true);

        });

        it('should call the resetSession function from the MenuBarService with the sessionId', function() {

          MenuBarController.resetSession();
          expect(MenuBarService.resetSession).toHaveBeenCalledWith(sessionId);

        });

        it('should empty the session results and results arrays', function() {

          MenuBarController.resetSession();
          expect(MenuBarController.session.results).toEqual([]);
          expect(MenuBarController.results).toEqual([]);

        });

      });

      describe('when the user does not confirm', function() {

        beforeEach(function() {

          spyOn(window, 'confirm').and.returnValue(false);

        });

        it('should not call the resetSession function from the MenuBarService with the sessionId', function() {

          MenuBarController.resetSession();
          expect(MenuBarService.resetSession).not.toHaveBeenCalledWith(sessionId);

        });

      });

    });

  });

})();
