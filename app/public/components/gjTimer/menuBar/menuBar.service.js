(function() {

  'use strict';

  function MenuBarService() {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

    /**
     * Initialize or get session number from local storage.
     * Initialize sessions if they do not exist in local storage
     * @returns {*}
     */
    self.init = function() {

      var currentSessionId;

      if (localStorage.getItem('currentSessionId') !== null) {
        currentSessionId = localStorage.getItem('currentSessionId');
      } else {
        currentSessionId = (localStorage.getItem('sessionNumber') !== null) ? 'session' + localStorage.getItem('sessionNumber') : 'session1';
        localStorage.setItem('currentSessionId', currentSessionId);
      }

      var newSession = {
        event: 'Rubik\'s Cube',
        list: []
      };

      for (var i = 1; i <= NUMBER_OF_SESSIONS; i++) {
        var session = JSON.parse(localStorage.getItem('session' + i));
        if (session === null) {
          newSession.name = 'Session ' + i;
          localStorage.setItem('session' + i, JSON.stringify(newSession));
        } else if (session.event === null) {
          session.event = 'Rubik\'s Cube';
          localStorage.setItem('session' + i, JSON.stringify(session));
        }
      }

      return self.getSession(currentSessionId);

    };

    /**
     * Gets session data from local storage.
     * @param sessionId
     * @returns {*}
     */
    self.getSession = function(sessionId) {

      return JSON.parse(localStorage.getItem(sessionId));

    };

    /**
     * Saves the new session in local storage and returns the new session.
     * @param sessionId
     * @returns {*}
     */
    self.changeSession = function(sessionId) {

      localStorage.setItem('currentSessionId', sessionId);
      return self.getSession(sessionId);

    };

    /**
     * Resets the session in local storage.
     * @param sessionId
     */
    self.resetSession = function(sessionId) {

      var session = JSON.parse(localStorage.getItem(sessionId));
      session.list = [];
      localStorage.setItem(sessionId, JSON.stringify(session));
      return session;

    };

    /**
     * Saves the new event in the session.
     * @param sessionId
     * @param event
     * @returns {*}
     */
    self.changeEvent = function(sessionId, event) {

      var session = JSON.parse(localStorage.getItem(sessionId));
      session.event = event;
      localStorage.setItem(sessionId, JSON.stringify(session));
      return session.event;

    };

  }

  angular.module('menuBar').service('MenuBarService', MenuBarService);

})();
