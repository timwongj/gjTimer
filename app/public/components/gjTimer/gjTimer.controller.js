(function() {

  'use strict';

  function GjTimerController($scope) {

    //$scope.timer = {
    //  scramble: scramble.generateScramble($scope.settings.selectedPuzzle, $scope.settings.scrambleLength),
    //  scrambleStyle: {'font-size': '150%'},
    //  display: timer.getTime(),
    //  avg5: '8.995',
    //  avg12: '10.235'
    //};
    //
    //
    //$scope.applySettings = function(puzzle, length) {
    //  $scope.settings.scrambleLength = length;
    //  $scope.newScramble(puzzle, length);
    //  if (length <= 60) {
    //    $scope.timer.scrambleStyle = {'font-size': '150%'};
    //  } else if (length <= 80) {
    //    $scope.timer.scrambleStyle = {'font-size': '140%'};
    //  } else if (length <= 100) {
    //    $scope.timer.scrambleStyle = {'font-size': '130%'};
    //  } else {
    //    $scope.timer.scrambleStyle = {'font-size': '100%'};
    //  }
    //};
    //
    //$scope.newScramble = function(puzzle, length) {
    //  $scope.timer.scramble = scramble.generateScramble(puzzle, length);
    //};

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', GjTimerController]);

})();
