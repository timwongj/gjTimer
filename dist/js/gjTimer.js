(function() {

  'use strict';

  angular.module('gjTimer', ['ui.bootstrap']);

})();

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

(function() {

  'use strict';

  function CalculatorService() {

    var Calculator = function() {

      var self = this;

    };

    return Calculator;

  }

  angular.module('gjTimer').factory('Calculator', CalculatorService);

})();

(function() {

  'use strict';

  function CubService() {

    var Cub = function() {

      var self = this;

    };

    return Cub;

  }

  angular.module('gjTimer').factory('Cub', CubService);

})();

(function() {

  'use strict';

  function ScramblerService() {

    var Scrambler = function() {

      var self = this;

      self.scramble = "B' U F D U R L2 D' U2 F' D' L' F' U L' U' F' L2 D2 L";

    };

    Scrambler.prototype.getScramble = function() {
      return this.scramble;
    };

    return Scrambler;

  }

  angular.module('gjTimer').factory('Scrambler', ScramblerService);

})();

(function() {

  'use strict';

  function TimerService() {

    var Timer = function() {

      var self = this;

      self.time = '15:38.843';

    };

    Timer.prototype.getTime = function() {
      return this.time;
    };

    return Timer;

  }

  angular.module('gjTimer').factory('Timer', TimerService);

})();
