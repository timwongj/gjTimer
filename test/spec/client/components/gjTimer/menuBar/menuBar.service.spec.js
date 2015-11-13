(function() {

  'use strict';

  var MenuBarService,
    LocalStorage,
    Constants,
    $q,
    $timeout,
    settings,
    sessions,
    sessionId,
    eventId;

  describe('The menuBar service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      MenuBarService = $injector.get('MenuBarService');
      LocalStorage = $injector.get('LocalStorage');
      Constants = $injector.get('Constants');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');

      sessionId = 'Session 69';
      eventId = '333fm';

      spyOn(LocalStorage, 'get').and.returnValue('Session 69');
      spyOn(LocalStorage, 'set').and.returnValue({});
      spyOn(LocalStorage, 'getJSON').and.returnValue({});
      spyOn(LocalStorage, 'getJSONAsync').and.returnValue($q.resolve({ results: [] }));
      spyOn(LocalStorage, 'setJSON').and.returnValue({});
      spyOn(LocalStorage, 'setJSONAsync').and.returnValue($q.resolve());
      spyOn(LocalStorage, 'clear');
    }));

    describe('initSettings function', function() {
      it('should get the settings from the LocalStorage service', function() {
        MenuBarService.initSettings();
        expect(LocalStorage.getJSON).toHaveBeenCalled();
      });

      describe('when the settings are null', function() {
        it('should set the settings in LocalStorage to the default settings and return them', function() {
          LocalStorage.getJSON.and.returnValue(null);
          settings = MenuBarService.initSettings();
          expect(LocalStorage.setJSON).toHaveBeenCalledWith('settings', Constants.DEFAULT_SETTINGS);
          expect(settings).toEqual(Constants.DEFAULT_SETTINGS);
        });
      });

      describe('when the settings are not null', function() {
        it('should populate any setting that has a default value', function() {
          settings = MenuBarService.initSettings();
          expect(settings).toEqual(Constants.DEFAULT_SETTINGS);
        });
      });
    });

    describe('saveSettings function', function() {
      it('should call the setJSON function from the LocalStorage service with the given settings', function() {
        settings = { setting1: 'value1' };
        MenuBarService.saveSettings(settings);
        expect(LocalStorage.setJSON).toHaveBeenCalledWith('settings', settings);
      });
    });

    describe('resetSettings function', function() {
      it('should call the setJSON function from the LocalStorage service with the default settings', function() {
        MenuBarService.resetSettings();
        expect(LocalStorage.setJSON).toHaveBeenCalledWith('settings', Constants.DEFAULT_SETTINGS);
      });
    });

    describe('initSessions function', function() {
      describe('when the sessions are not null', function() {
        it('should call the getJSON function from the LocalStorage service for each session', function() {
          sessions = MenuBarService.initSessions();
          expect(LocalStorage.getJSON.calls.count()).toEqual(Constants.DEFAULT_NUMBER_OF_SESSIONS);
          expect(LocalStorage.setJSON).not.toHaveBeenCalled();
          expect(sessions.length).toEqual(Constants.DEFAULT_NUMBER_OF_SESSIONS);
        });
      });

      describe('when the sessions are null', function() {
        it('should call the setJSON function from the LocalStorage service for session that are null', function() {
          LocalStorage.getJSON.and.returnValue(null);
          sessions = MenuBarService.initSessions();
          expect(LocalStorage.getJSON).toHaveBeenCalledWith('Session 1');
          expect(LocalStorage.setJSON.calls.count()).toEqual(Constants.DEFAULT_NUMBER_OF_SESSIONS);
          expect(sessions.length).toEqual(Constants.DEFAULT_NUMBER_OF_SESSIONS);
        });
      });
    });

    describe('initSession function', function() {
      describe('when the current sessionId exists in local storage', function() {
        it('should get the session for that sessionId from the LocalStorage service', function() {
          sessionId = MenuBarService.initSession();
          expect(LocalStorage.get).toHaveBeenCalledWith('sessionId');
          expect(sessionId).toEqual('Session 69');
        });
      });

      describe('when the current sessionId does not exist in local storage', function() {
        it('should get the session for Session 1 from the LocalStorage service', function() {
          LocalStorage.get.and.returnValue(null);
          sessionId = MenuBarService.initSession();
          expect(LocalStorage.get).toHaveBeenCalledWith('sessionId');
          expect(LocalStorage.set).toHaveBeenCalledWith('sessionId', 'Session 1');
          expect(sessionId).toEqual('Session 1');
        });
      });
    });

    describe('changeSession function', function() {
      describe('when events exist in local storage', function() {
        describe('and sessionId is in events', function() {
          it('should return the event for that session', function() {
            LocalStorage.getJSON.and.returnValue({ 'Session 69': eventId });
            expect(MenuBarService.changeSession(sessionId)).toEqual(eventId);
            expect(LocalStorage.set).toHaveBeenCalledWith('sessionId', sessionId);
            expect(LocalStorage.getJSON).toHaveBeenCalledWith('events');
          });
        });

        describe('and sessionId is not in events', function() {
          it('should save the default event for that session and return it', function() {
            LocalStorage.getJSON.and.returnValue({});
            expect(MenuBarService.changeSession(sessionId)).toEqual('333');
            expect(LocalStorage.set).toHaveBeenCalledWith('sessionId', sessionId);
            expect(LocalStorage.getJSON).toHaveBeenCalledWith('events');
            expect(LocalStorage.setJSON).toHaveBeenCalledWith('events', { 'Session 69': '333' });
          });
        });
      });

      describe('when events do not exist in local storage', function() {
        it('should save events with default events and return the default event', function() {
          LocalStorage.getJSON.and.returnValue(null);
          expect(MenuBarService.changeSession(sessionId)).toEqual('333');
          expect(LocalStorage.set).toHaveBeenCalledWith('sessionId', sessionId);
          expect(LocalStorage.getJSON).toHaveBeenCalledWith('events');
          expect(LocalStorage.setJSON.calls.argsFor(0)[1]['Session 1']).toEqual('333');
        });
      });
    });

    describe('changeEvent function', function() {
      describe('when events exist in local storage', function() {
        it('should save the changed event', function() {
          MenuBarService.changeEvent(sessionId, eventId);
          expect(LocalStorage.getJSON).toHaveBeenCalledWith('events');
          expect(LocalStorage.setJSON.calls.argsFor(0)[1]).toEqual({ 'Session 69': eventId });
          expect(LocalStorage.set).toHaveBeenCalledWith('eventId', eventId);
        });
      });

      describe('when events do not exist in local storage', function() {
        it('should save events and the changed event', function() {
          LocalStorage.getJSON.and.returnValue(null);
          MenuBarService.changeEvent(sessionId, eventId);
          expect(LocalStorage.getJSON).toHaveBeenCalledWith('events');
          expect(LocalStorage.setJSON.calls.argsFor(0)[1]['Session 1']).toEqual('333');
          expect(LocalStorage.setJSON.calls.argsFor(0)[1]['Session 69']).toEqual(eventId);
          expect(LocalStorage.set).toHaveBeenCalledWith('eventId', eventId);
        });
      });
    });

    describe('resetSessionAsync function', function() {
      it('should get the session from the LocalStorage service', function(done) {
        MenuBarService.resetSessionAsync(sessionId)
          .then(function() {
            expect(LocalStorage.getJSONAsync).toHaveBeenCalledWith(sessionId);
            expect(LocalStorage.setJSONAsync).toHaveBeenCalledWith(sessionId, { results: []});
            done();
          });
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
      });
    });

    describe('resetAll function', function() {
      it('should call the clear function from the LocalStorage service', function() {
        MenuBarService.resetAll();
        expect(LocalStorage.clear).toHaveBeenCalledWith();
      });
    });

  });

})();
