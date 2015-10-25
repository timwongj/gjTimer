(function() {

  'use strict';

  function MenuBarController($rootScope, $timeout, MenuBarService) {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

    self.puzzles = MenuBarService.getPuzzles();
    self.session = MenuBarService.init();
    self.puzzle = self.session.puzzle || MenuBarService.convertScrambleType(self.session.scrambleType);
    $rootScope.sessionId = 'session' + self.session.name.substr(8, self.session.name.length);
    $rootScope.puzzle = self.puzzle;

    // TODO - find a better solution to waiting for controllers to initialize before broadcasting
    // The cutoff for successful broadcast is ~15-20ms, so 50 should be sufficient for now.
    $timeout(function() {
      $rootScope.$broadcast('new scramble', self.puzzle);
    }, 50);

    self.sessions = [];
    for (var i = 0; i < NUMBER_OF_SESSIONS; i++) {
      self.sessions[i] = {};
    }

    angular.forEach(self.sessions, function(session, $index) {
      session.name = 'Session ' + ($index + 1);
    });

    self.selectPuzzle = function(puzzle) {
      self.puzzle = MenuBarService.changePuzzle('session' + self.session.name.substr(8, self.session.name.length), puzzle);
      $rootScope.puzzle = self.puzzle;
      $rootScope.$broadcast('new scramble', self.puzzle);
    };

    self.changeSession = function(sessionName) {
      self.session = MenuBarService.changeSession('session' + sessionName.substr(8, sessionName.length));
      if (self.puzzle !== (self.session.puzzle || MenuBarService.convertScrambleType(self.session.scrambleType))) {
        $rootScope.$broadcast('new scramble', self.session.puzzle);
      }
      self.puzzle = self.session.puzzle || MenuBarService.convertScrambleType(self.session.scrambleType);
      $rootScope.puzzle = self.puzzle;
    };

    self.settings = function() {
      console.log('settings');
    };

    self.scramble = function() {
      $rootScope.$broadcast('new scramble', self.session.puzzle);
    };

    self.resetSession = function() {
      if (confirm('Are you sure you would like to reset ' + self.session.name + '?')) {
        self.session = MenuBarService.resetSession('session' + self.session.name.substr(8, self.session.name.length));
        $rootScope.$broadcast('refresh data');
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$rootScope', '$timeout', 'MenuBarService', MenuBarController]);

})();