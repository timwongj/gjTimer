(function() {

  'use strict';

  function MenuBarService(LocalStorage) {

    var self = this;

    var NUMBER_OF_SESSIONS = 15;

    var DEFAULT_SETTINGS = {
      input: 'Timer',
      inspection: 'Off',
      bldMode: 'Off',
      showScramble: 'Yes',
      saveScrambles: 'Yes',
      timerStartDelay: 0,
      timerStopDelay: 100,
      resultsPrecision: 2,
      statisticsPrecision: 3,
      timerPrecision: 3,
      timerRefreshInterval: 50
    };

    /**
     * Gets settings from local storage or initializes it if it doesn't exist.
     * @returns {*}
     */
    self.initSettings = function() {
      var settings = LocalStorage.getJSON('settings');
      if (settings === null) {
        LocalStorage.setJSON('settings', DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      } else {
        for (var key in DEFAULT_SETTINGS) {
          if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
            if (!settings.hasOwnProperty(key)) {
              settings[key] = DEFAULT_SETTINGS[key];
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
     * Initializes sessions in local storage if they do not exist.
     * @returns [String] - sessionId
     */
    self.initSessions = function() {

      var sessions = [];

      for (var i = 1; i <= NUMBER_OF_SESSIONS; i++) {
        sessions.push('Session ' + i);
        var session = LocalStorage.getJSON('Session ' + i);
        if (session === null) {
          LocalStorage.setJSON('Session ' + i, { sessionId: 'Session ' + i , eventId: '333', results: [] });
        }
      }

      return sessions;

    };

    /**
     * Initializes or gets session number from local storage.
     * @returns {object} - session
     */
    self.initSession = function() {

      var sessionId;

      if (LocalStorage.get('sessionId') !== null) {
        sessionId = LocalStorage.get('sessionId');
      } else {
        sessionId = 'Session 1';
        LocalStorage.set('sessionId', 'Session 1');
      }

      return LocalStorage.getJSON(sessionId);

    };

    /**
     * Gets session data from local storage.
     * @param sessionId
     * @returns {object} session
     */
    self.getSession = function(sessionId) {

      return LocalStorage.getJSON(sessionId);

    };

    /**
     * Saves the new session in local storage and returns the new session.
     * @param sessionId
     * @returns {object} session
     */
    self.changeSession = function(sessionId) {

      LocalStorage.set('sessionId', sessionId);
      return LocalStorage.getJSON(sessionId);

    };

    /**
     * Resets the session in local storage by clearing the results list.
     * @param sessionId
     */
    self.resetSession = function(sessionId) {

      var session = LocalStorage.getJSON(sessionId);
      session.results = [];
      LocalStorage.setJSON(sessionId, session);

    };

    /**
     * Saves the new event in the session.
     * @param sessionId
     * @param eventId
     * @returns {*} eventId
     */
    self.changeEvent = function(sessionId, eventId) {

      var session = LocalStorage.getJSON(sessionId);
      session.eventId = eventId;
      LocalStorage.setJSON(sessionId, session);
      return session.eventId;

    };

    /**
     * Resets everything.
     */
    self.resetAll = function() {
      LocalStorage.clear();
    };

  }

  angular.module('menuBar').service('MenuBarService', ['LocalStorage', MenuBarService]);

})();
