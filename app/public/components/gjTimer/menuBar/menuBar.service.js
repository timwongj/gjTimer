(function() {

  'use strict';

  function MenuBarService(LocalStorage, Constants) {

    var self = this;

    /**
     * Gets settings from local storage or initializes it if it doesn't exist.
     * @returns {*}
     */
    self.initSettings = function() {
      var settings = LocalStorage.getJSON('settings');
      if (settings === null) {
        LocalStorage.setJSON('settings', Constants.DEFAULT_SETTINGS);
        return Constants.DEFAULT_SETTINGS;
      } else {
        for (var key in Constants.DEFAULT_SETTINGS) {
          if (Constants.DEFAULT_SETTINGS.hasOwnProperty(key)) {
            if (!settings.hasOwnProperty(key)) {
              settings[key] = Constants.DEFAULT_SETTINGS[key];
              LocalStorage.setJSON('settings', settings);
            }
          }
        }
        return settings;
      }
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
     * Initializes sessions in local storage if they do not exist.
     * @returns [String] - sessionId
     */
    self.initSessions = function() {

      var session, sessions = [];

      for (var i = 1; i <= Constants.SESSIONS.DEFAULT_NUMBER_OF_SESSIONS; i++) {
        sessions.push('Session ' + i);
        session = LocalStorage.getJSON('Session ' + i);
        if (session === null) {
          LocalStorage.setJSON('Session ' + i, { results: [] });
        }
      }

      return sessions;

    };

    /**
     * Initializes or gets session number from local storage.
     * @returns {string}
     */
    self.initSession = function() {

      var sessionId = LocalStorage.get('sessionId');

      if (sessionId) {
        return sessionId;
      } else {
        LocalStorage.set('sessionId', 'Session 1');
        return 'Session 1';
      }

    };

    /**
     * Initializes or gets the eventId from local storage.
     * @returns {string}
     */
    self.initEvent = function() {

      var eventId = LocalStorage.get('eventId');
      if (eventId) {
        return eventId;
      } else {
        LocalStorage.set('eventId', '333');
        return '333';
      }

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
          return events[sessionId];
        } else {
          events[sessionId] = '333';
          LocalStorage.setJSON('events', events);
          return '333';
        }
      } else {
        events = {};
        for (var i = 1; i < Constants.DEFAULT_NUMBER_OF_SESSIONS; i++) {
          events['Session ' + i] = '333';
        }
        LocalStorage.setJSON('events', events);
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
          LocalStorage.setJSONAsync(sessionId, session);
        });

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
