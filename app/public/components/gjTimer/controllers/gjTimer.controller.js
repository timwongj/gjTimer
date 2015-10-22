(function() {

  'use strict';

  function GjTimerController($scope, Scrambler, Timer, Calculator, Cub) {

    var timer = new Timer();
    var scrambler = new Scrambler();
    var calculator = new Calculator();
    var cub = new Cub();

    $scope.settings = {
      puzzles: ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'],
      selectedPuzzle: '3x3',
      scrambleLength: 20
    };

    $scope.timer = {
      scramble: scrambler.getScramble(),
      display: timer.getTime(),
      avg5: '8.995',
      avg12: '10.235'
    };

    $scope.session = {
      name: 'Session 1',
      solved: 0,
      attempted: 0,
      mean: 0,
      solves: []
    };

    $scope.sessions = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

    angular.forEach($scope.sessions, function(session, $index) {
      session.name = 'Session ' + ($index + 1);
    });

    $scope.newScramble = function() {

    };

    $scope.options = function() {

    };

    $scope.stats = function() {

    };

    $scope.reset = function() {

    };

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', 'Scrambler', 'Timer', 'Calculator', 'Cub', GjTimerController]);

})();
