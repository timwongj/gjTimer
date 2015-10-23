(function() {

  'use strict';

  function MenuBarController($rootScope, MenuBarService) {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

    self.puzzles = MenuBarService.getPuzzles();
    self.session = MenuBarService.init();
    self.puzzle = self.session.puzzle || MenuBarService.convertScrambleType(self.session.scrambleType);

    console.log(self.session.name);

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
    };

    self.changeSession = function(sessionName) {
      self.session = MenuBarService.changeSession('session' + sessionName.substr(8, sessionName.length));
      $rootScope.session = self.session;
    };

    self.options = function() {
      console.log('options');
    };

    self.scramble = function() {
      console.log('scramble');
    };

    self.resetSession = function() {
      console.log('reset session');
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$rootScope', 'MenuBarService', MenuBarController]);

})();