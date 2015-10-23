(function() {

  'use strict';

  function MenuBarController($rootScope, MenuBarService) {

    var self = this;

    self.puzzles = ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'];

    self.puzzle = '3x3';

    self.sessions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

    angular.forEach(self.sessions, function(session, $index) {
      session.name = 'Session ' + ($index + 1);
    });

    self.session = self.sessions[0];

    self.selectPuzzle = function(puzzle) {
      self.puzzle = puzzle;
      $rootScope.puzzle = puzzle;
      console.log(self.puzzle);
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