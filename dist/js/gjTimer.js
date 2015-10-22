(function() {

  'use strict';

  angular.module('GjTimerApp', ['ui.bootstrap']);

})();

(function() {

  'use strict';

  function GjTimerController($scope) {

    $scope.settings = {
      puzzles: ['2x2', '3x3', '4x4', '5x5', '6x6', '7x7'],
      selectedPuzzle: '3x3',
      scrambleLength: 20
    };

    $scope.timer = {
      scramble: '',
      display: '',
      avg5: '',
      avg12: ''
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

  angular.module('GjTimerApp').controller('GjTimerController', ['$scope', GjTimerController]);

})();

(function() {

  'use strict';

  function GjTimerService() {



  }

  angular.module('GjTimerApp').factory('GjTimerService', [GjTimerService]);

})();
