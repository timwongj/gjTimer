(function() {

  'use strict';

  function GjTimerController($scope, Scrambler, Timer, Calculator, Cub) {

    var timer = new Timer();
    var scrambler = new Scrambler();
    var calculator = new Calculator();
    var cub = new Cub();

    $scope.settings = {
      puzzles: [
        { name: '2x2', defaultScrambleLength: 10 },
        { name: '3x3', defaultScrambleLength: 20 },
        { name: '4x4', defaultScrambleLength: 40 },
        { name: '5x5', defaultScrambleLength: 60 },
        { name: '6x6', defaultScrambleLength: 80 },
        { name: '7x7', defaultScrambleLength: 100 }
      ],
      selectedPuzzle: '3x3',
      scrambleLength: 20
    };

    $scope.timer = {
      scramble: scrambler.generateScramble($scope.settings.selectedPuzzle, $scope.settings.scrambleLength),
      scrambleStyle: {'font-size': '150%'},
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

    $scope.applySettings = function(puzzle, length) {
      $scope.settings.scrambleLength = length;
      $scope.newScramble(puzzle, length);
      if (length <= 60) {
        $scope.timer.scrambleStyle = {'font-size': '150%'};
      } else if (length <= 80) {
        $scope.timer.scrambleStyle = {'font-size': '140%'};
      } else if (length <= 100) {
        $scope.timer.scrambleStyle = {'font-size': '130%'};
      } else {
        $scope.timer.scrambleStyle = {'font-size': '100%'};
      }
    };

    $scope.newScramble = function(puzzle, length) {
      $scope.timer.scramble = scrambler.generateScramble(puzzle, length);
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
