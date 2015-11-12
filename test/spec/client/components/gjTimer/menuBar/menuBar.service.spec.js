(function() {

  'use strict';

  var MenuBarService,
    LocalStorage,
    Constants,
    settings,
    sessions,
    session,
    sessionId,
    eventId;

  describe('The menuBar service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      MenuBarService = $injector.get('MenuBarService');
      LocalStorage = $injector.get('LocalStorage');
      Constants = $injector.get('Constants');

      sessionId = 69;
      eventId = '333fm';

      spyOn(LocalStorage, 'get').and.returnValue('Session 69');
      spyOn(LocalStorage, 'set').and.returnValue({});
      spyOn(LocalStorage, 'getJSON').and.returnValue({});
      spyOn(LocalStorage, 'setJSON').and.returnValue({});
      spyOn(LocalStorage, 'clear');

    }));

    describe('initSettings function', function() {

      it('should get the settings from the LocalStorage service', function() {

        MenuBarService.initSettings();
        expect(LocalStorage.getJSON).toHaveBeenCalled();

      });

      describe('when the settings are null', function() {

        beforeEach(function() {

          LocalStorage.getJSON.and.returnValue(null);

        });

        it('should set the settings in LocalStorage to the default settings from the Constants service', function() {

          MenuBarService.initSettings();
          expect(LocalStorage.setJSON).toHaveBeenCalledWith('settings', Constants.DEFAULT_SETTINGS);

        });

        it('should return the default settings', function() {

          settings = MenuBarService.initSettings();
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

          MenuBarService.initSessions();
          expect(LocalStorage.getJSON.calls.count()).toEqual(Constants.SESSIONS.DEFAULT_NUMBER_OF_SESSIONS);
          expect(LocalStorage.setJSON).not.toHaveBeenCalled();

        });

      });

      describe('when the sessions are null', function() {

        beforeEach(function() {

          LocalStorage.getJSON.and.returnValue(null);

        });

        it('should call the setJSON function from the LocalStorage service for session that are null', function() {

          MenuBarService.initSessions();
          expect(LocalStorage.getJSON).toHaveBeenCalledWith('Session 1');
          expect(LocalStorage.setJSON.calls.count()).toEqual(Constants.SESSIONS.DEFAULT_NUMBER_OF_SESSIONS);

        });

      });

      it('should return a list of sessionIds', function() {

        sessions = MenuBarService.initSessions();
        expect(sessions.length).toEqual(Constants.SESSIONS.DEFAULT_NUMBER_OF_SESSIONS);

      });

    });

    describe('initSession function', function() {

      it('should get the current sessionId from the LocalStorage service', function() {

        MenuBarService.initSession();
        expect(LocalStorage.get).toHaveBeenCalledWith('sessionId');

      });

      describe('when the current sessionId exists in local storage', function() {

        it('should get the session for that sessionId from the LocalStorage service', function() {

          session = MenuBarService.initSession();
          expect(LocalStorage.getJSON).toHaveBeenCalledWith('Session 69');
          expect(session).toEqual({});

        });

      });

      describe('when the current sessionId does not exist in local storage', function() {

        beforeEach(function() {

          LocalStorage.get.and.returnValue(null);

        });

        it('should set the current sessionId to Session 1 in local storage', function() {

          MenuBarService.initSession();
          expect(LocalStorage.set).toHaveBeenCalledWith('sessionId', 'Session 1');

        });

        it('should get the session for Session 1 from the LocalStorage service', function() {

          session = MenuBarService.initSession();
          expect(session).toEqual({});

        });

      });

    });

    describe('getSession function', function() {

      beforeEach(function() {

        LocalStorage.getJSON.and.returnValue({ sessionId: 'Session 69', eventId: 'pyra', results: [] });

      });

      it('should get the session from the LocalStorage service', function() {

        session = MenuBarService.getSession(sessionId);
        expect(LocalStorage.getJSON).toHaveBeenCalledWith(sessionId);
        expect(session).toEqual({ sessionId: 'Session 69', eventId: 'pyra', results: [] });

      });

    });

    describe('changeSession function', function() {

      beforeEach(function() {

        LocalStorage.getJSON.and.returnValue({ sessionId: 'Session 19', eventId: '333fm', results: [] });

      });

      it('should set the current sessionId in local storage to the new sessionId', function() {

        MenuBarService.changeSession(sessionId);
        expect(LocalStorage.set).toHaveBeenCalledWith('sessionId', sessionId);

      });

      it('should get the new session from the LocalStorage service', function() {

        session = MenuBarService.changeSession(sessionId);
        expect(LocalStorage.getJSON).toHaveBeenCalledWith(sessionId);
        expect(session).toEqual({ sessionId: 'Session 19', eventId: '333fm', results: [] });

      });

    });

    describe('resetSession function', function() {

      beforeEach(function() {

        LocalStorage.getJSON.and.returnValue({ sessionId: 'Session 19', eventId: '333fm', results: [26, 23, 19] });

      });

      it('should get the session from the LocalStorage service', function() {

        MenuBarService.resetSession(sessionId);
        expect(LocalStorage.getJSON).toHaveBeenCalledWith(sessionId);

      });

      it('should empty the results for the session and save it with the LocalStorage service', function() {

        MenuBarService.resetSession(sessionId);
        expect(LocalStorage.setJSON).toHaveBeenCalledWith(sessionId, { sessionId: 'Session 19', eventId: '333fm', results: []});

      });

    });

    describe('changeEvent function', function() {

      beforeEach(function() {

        LocalStorage.getJSON.and.returnValue({ sessionId: 'Session 19', eventId: '333mbf', results: [26, 23, 19] });

      });

      it('should get the session from the LocalStorage service', function() {

        MenuBarService.changeEvent(sessionId, eventId);
        expect(LocalStorage.getJSON).toHaveBeenCalledWith(sessionId);

      });

      it('should set the eventId of that session to the new eventId and save it with the LocalStorage service', function() {

        MenuBarService.changeEvent(sessionId, eventId);
        expect(LocalStorage.setJSON).toHaveBeenCalledWith(sessionId, { sessionId: 'Session 19', eventId: '333fm', results: [26, 23, 19] });

      });

      it('should return the new eventId', function() {

        expect(MenuBarService.changeEvent(sessionId, eventId)).toEqual(eventId);

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
