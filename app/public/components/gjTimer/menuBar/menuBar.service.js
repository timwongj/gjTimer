(function() {

  'use strict';

  function MenuBarService() {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;
    var PUZZLES = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'];

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
        puzzle: '3x3',
        list: []
      };

      for (var i = 1; i <= NUMBER_OF_SESSIONS; i++) {
        if (localStorage.getItem('session' + i) === null) {
          newSession.name = 'Session ' + i;
          localStorage.setItem('session' + i, JSON.stringify(newSession));
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
     * Saves the new puzzle in the session.
     * @param sessionId
     * @param puzzle
     * @returns {*}
     */
    self.changePuzzle = function(sessionId, puzzle) {

      var session = JSON.parse(localStorage.getItem(sessionId));
      session.puzzle = puzzle;
      localStorage.setItem(sessionId, JSON.stringify(session));
      return session.puzzle;

    };

    /**
     * Gets the list of puzzles supported in gjTimer.
     * @returns {string[]}
     */
    self.getPuzzles = function() {

      return PUZZLES;

    };

    /**
     * Converts scrambleType to puzzle.
     * This is for handling old session data from legacy gjTimer.
     * @param scrambleType
     * @returns {*}
     */
    self.convertScrambleType = function(scrambleType) {

      switch(scrambleType) {
        case 3: return '3x3';
        case 4: return '4x4';
        case 5: return '5x5';
        case 6: return '6x6';
        case 7: return '7x7';
      }

    };

  }

  angular.module('menuBar').service('MenuBarService', MenuBarService);

})();
