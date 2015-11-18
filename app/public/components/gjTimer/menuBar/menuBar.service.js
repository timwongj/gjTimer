(function() {

  'use strict';

  function MenuBarService(LocalStorage, Constants) {

    var self = this;

    /**
     * Initializes sessions in local storage if they do not exist.
     * @returns [String] - sessionId
     */
    self.initSessions = function() {

      var session, sessions = [];

      for (var i = 1; i <= Constants.DEFAULT_NUMBER_OF_SESSIONS; i++) {
        sessions.push('Session ' + i);
        session = LocalStorage.getJSON('Session ' + i);
        if (session === null) {
          LocalStorage.setJSON('Session ' + i, { results: [] });
        }
      }

      return sessions;

    };

    /**
     * Saves the new sessionId and returns the new eventId.
     * @param sessionId
     * @returns {string} - eventId
     */
    self.changeSession = function(sessionId) {

      LocalStorage.set('sessionId', sessionId);
      var events = LocalStorage.getJSON('events');
      if (events) {
        if (events.hasOwnProperty(sessionId)) {
          LocalStorage.set('eventId', events[sessionId]);
          return events[sessionId];
        } else {
          events[sessionId] = '333';
          LocalStorage.setJSON('events', events);
          LocalStorage.set('eventId', '333');
          return '333';
        }
      } else {
        events = {};
        for (var i = 1; i < Constants.DEFAULT_NUMBER_OF_SESSIONS; i++) {
          events['Session ' + i] = '333';
        }
        LocalStorage.setJSON('events', events);
        LocalStorage.set('eventId', '333');
        return '333';
      }

    };

    /**
     * Saves the new event in the session.
     * @param sessionId
     * @param eventId
     * @returns {*} eventId
     */
    self.changeEvent = function(sessionId, eventId) {

      var events = LocalStorage.getJSON('events');

      if (!events) {
        events = {};
        for (var i = 1; i < Constants.DEFAULT_NUMBER_OF_SESSIONS; i++) {
          events['Session ' + i] = '333';
        }
      }

      events[sessionId] = eventId;
      LocalStorage.setJSON('events', events);
      LocalStorage.set('eventId', eventId);

    };

    /**
     * Resets the session in local storage by clearing the results list.
     * @param sessionId
     */
    self.resetSessionAsync = function(sessionId) {

      return LocalStorage.getJSONAsync(sessionId)
        .then(function(session) {
          session.results = [];
          return LocalStorage.setJSONAsync(sessionId, session);
        });

    };

    /**
     * Saves settings.
     * @param settings
     */
    self.saveSettings = function(settings) {
      LocalStorage.setJSON('settings', settings);
    };

    /**
     * Reset settings.
     * @returns {*}
     */
    self.resetSettings = function() {
      LocalStorage.setJSON('settings', Constants.DEFAULT_SETTINGS);
      return Constants.DEFAULT_SETTINGS;
    };

    /**
     * Resets everything.
     */
    self.resetAll = function() {
      LocalStorage.clear();
    };

  }

  angular.module('menuBar').service('MenuBarService', ['LocalStorage', 'Constants', MenuBarService]);

})();
