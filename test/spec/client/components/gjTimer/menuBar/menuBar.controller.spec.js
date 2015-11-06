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

  describe('The menuBar controller', function() {

    beforeEach(module('menuBar'));

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      MenuBarService = $injector.get('MenuBarService');

      sessionId = 'Session 1';
      eventId = '333';

      Events = {
        getEvents: function() { return []; }
      };

      spyOn(MenuBarService, 'initSettings').and.callThrough();
      spyOn(MenuBarService, 'initSessions').and.callThrough();
      spyOn(MenuBarService, 'initSession').and.callThrough();
      spyOn(MenuBarService, 'changeSession').and.callThrough();
      spyOn(MenuBarService, 'changeEvent').and.callThrough();
      spyOn(Events, 'getEvents').and.callThrough();

      MenuBarController = $controller('MenuBarController', {
        $scope: $scope,
        $rootScope: $rootScope,
        $timeout: $timeout,
        $uibModal: $uibModal,
        MenuBarService: MenuBarController,
        Events: Events
      });

      $scope.$digest();

    }));

    xdescribe('controller', function() {

      it('should call the getSettings function from the MenuBarService', function() {
        expect(MenuBarService.getSettings).toHaveBeenCalled();
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

    });

    xdescribe('changeSession function', function() {

      it('should call the changeSession function from the MenuBarService with the sessionId', function() {
        MenuBarController.changeSession(sessionId);
        expect(MenuBarService).changeSession.toHaveBeenCalledWith(sessionId);
      });

    });

    xdescribe('changeEvent function', function() {

      it('should call the changeEvent function from the MenuBarService with the eventId', function() {
        MenuBarController.changeEvent(eventId);
        expect(MenuBarService).changeEvent.toHaveBeenCalledWith(eventId);
      });

    });

    describe('openSettings function', function() {

    });

    describe('resetSession function', function() {

    });

  });

})();
