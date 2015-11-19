(function() {

  'use strict';

  var GjTimerService,
    LocalStorage,
    Constants,
    $q,
    $timeout,
    settings,
    sessionId,
    eventId;

  describe('The menuBar service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      GjTimerService = $injector.get('gjTimerService');
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

    describe('initEvent function', function() {
      describe('when eventId exists in local storage', function() {
        it('should return the current event', function() {
          LocalStorage.get.and.returnValue(eventId);
          expect(GjTimerService.initEvent()).toEqual(eventId);
        });
      });

      describe('when eventId does not exists in local storage', function() {
        it('should return the default event', function() {
          LocalStorage.get.and.returnValue(null);
          expect(GjTimerService.initEvent()).toEqual('333');
        });
      });
    });

    describe('initSession function', function() {
      describe('when the current sessionId exists in local storage', function() {
        it('should get the session for that sessionId from the LocalStorage service', function() {
          sessionId = GjTimerService.initSession();
          expect(LocalStorage.get).toHaveBeenCalledWith('sessionId');
          expect(sessionId).toEqual('Session 69');
        });
      });

      describe('when the current sessionId does not exist in local storage', function() {
        it('should get the session for Session 1 from the LocalStorage service', function() {
          LocalStorage.get.and.returnValue(null);
          sessionId = GjTimerService.initSession();
          expect(LocalStorage.get).toHaveBeenCalledWith('sessionId');
          expect(LocalStorage.set).toHaveBeenCalledWith('sessionId', 'Session 1');
          expect(sessionId).toEqual('Session 1');
        });
      });
    });

    describe('initSettings function', function() {
      it('should get the settings from the LocalStorage service', function() {
        GjTimerService.initSettings();
        expect(LocalStorage.getJSON).toHaveBeenCalled();
      });

      describe('when the settings are null', function() {
        it('should set the settings in LocalStorage to the default settings and return them', function() {
          LocalStorage.getJSON.and.returnValue(null);
          settings = GjTimerService.initSettings();
          expect(LocalStorage.setJSON).toHaveBeenCalledWith('settings', Constants.DEFAULT_SETTINGS);
          expect(settings).toEqual(Constants.DEFAULT_SETTINGS);
        });
      });

      describe('when the settings are not null', function() {
        it('should populate any setting that has a default value', function() {
          settings = GjTimerService.initSettings();
          expect(settings).toEqual(Constants.DEFAULT_SETTINGS);
        });
      });
    });

  });

})();
