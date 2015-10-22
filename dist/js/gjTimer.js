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

    var Scrambler = function() {  };

    Scrambler.prototype.generateScramble = function(puzzle, length) {
      switch(puzzle) {
        case '2x2': return this.generate2x2Scramble(length);
        case '3x3': return this.generate3x3Scramble(length);
        case '4x4': return this.generate4x4Scramble(length);
        case '5x5': return this.generate5x5Scramble(length);
        case '6x6': return this.generate6x6Scramble(length);
        case '7x7': return this.generate7x7Scramble(length);
      }
    };

    Scrambler.prototype.generate2x2Scramble = function(length)
    {
      var scramble = '', previousOrientation = -1;
      for (var i = 0; i < length; i++)
      {
        var turningOrientation = Math.floor((Math.random() * 3)), innerTurningLayer, turningDirection = Math.floor((Math.random() * 3));
        while (turningOrientation === previousOrientation)
        {
          turningOrientation = Math.floor((Math.random() * 3));
          innerTurningLayer = Math.floor((Math.random() * 2));
          turningDirection = Math.floor((Math.random() * 3));
        }
        if (turningOrientation === 0)
          scramble = scramble.concat('U');
        else if (turningOrientation === 1)
          scramble = scramble.concat('F');
        else if (turningOrientation === 2)
          scramble = scramble.concat('R');
        switch (turningDirection)
        {
          case 1: scramble = scramble.concat('\''); break;
          case 2: scramble = scramble.concat('2'); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
          scramble = scramble.concat(' ');
      }
      return scramble;
    };

    Scrambler.prototype.generate3x3Scramble = function(length)
    {
      var previousMove = -1, secondPreviousMove = -1, scramble = '';
      for (var i = 0; i < length; i++)
      {
        var move = Math.floor((Math.random() * 6)), direction = Math.floor((Math.random() * 3));
        if (((previousMove === 0) && (secondPreviousMove !== 1)) || ((previousMove === 1) && (secondPreviousMove !== 0)) || ((previousMove === 2) && (secondPreviousMove !== 3)) || ((previousMove === 3) && (secondPreviousMove !== 2)) || ((previousMove === 4) && (secondPreviousMove !== 5)) || ((previousMove === 5) && (secondPreviousMove !== 4)))
          secondPreviousMove = -1;
        while ((move === previousMove) || (move === secondPreviousMove))
          move = Math.floor((Math.random() * 6));
        switch (move)
        {
          case 0: scramble = scramble.concat('U'); break;
          case 1: scramble = scramble.concat('D'); break;
          case 2: scramble = scramble.concat('L'); break;
          case 3: scramble = scramble.concat('R'); break;
          case 4: scramble = scramble.concat('F'); break;
          case 5: scramble = scramble.concat('B'); break;
        }
        switch (direction)
        {
          case 1: scramble = scramble.concat('\''); break;
          case 2: scramble = scramble.concat('2'); break;
        }
        secondPreviousMove = previousMove;
        previousMove = move;
        if (i < length - 1)
          scramble = scramble.concat(' ');
      }
      return scramble;
    };

    Scrambler.prototype.generate4x4Scramble = function(length)
    {
      var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
      for (var i = 0; i < length; i++)
      {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 3)), innerTurningLayer = Math.floor((Math.random() * 2)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
        switch (turningLayer)
        {
          case 0: temp = 1; break;
          case 1: temp = 2; break;
          case 2: temp = 4; break;
        }
        while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
        {
          turningOrientation = Math.floor((Math.random() * 3));
          turningLayer = Math.floor((Math.random() * 3));
          innerTurningLayer = Math.floor((Math.random() * 2));
          turningDirection = Math.floor((Math.random() * 3));
          if (turningOrientation !== previousOrientation)
            layersTurned = 0;
        }
        if (turningOrientation === 0)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('U');
          else if (turningLayer === 2)
            scramble = scramble.concat('D');
          else if (innerTurningLayer === 0)
            scramble = scramble.concat('Uw');
          else
            scramble = scramble.concat('Dw');
        }
        else if (turningOrientation === 1)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('F');
          else if (turningLayer === 2)
            scramble = scramble.concat('B');
          else if (innerTurningLayer === 0)
            scramble = scramble.concat('Fw');
          else
            scramble = scramble.concat('Bw');
        }
        else if (turningOrientation === 2)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('L');
          else if (turningLayer === 2)
            scramble = scramble.concat('R');
          else if (innerTurningLayer === 0)
            scramble = scramble.concat('Lw');
          else
            scramble = scramble.concat('Rw');
        }
        switch (turningLayer)
        {
          case 0: layersTurned += 1; break;
          case 1: layersTurned += 2; break;
          case 2: layersTurned += 4; break;
        }
        switch (turningDirection)
        {
          case 1: scramble = scramble.concat('\''); break;
          case 2: scramble = scramble.concat('2'); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
          scramble = scramble.concat(' ');
      }
      return scramble;
    };

    Scrambler.prototype.generate5x5Scramble = function(length)
    {
      var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
      for (var i = 0; i < length; i++)
      {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 4)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
        switch (turningLayer)
        {
          case 0: temp = 1; break;
          case 1: temp = 2; break;
          case 2: temp = 4; break;
          case 3: temp = 8; break;
        }
        while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
        {
          turningOrientation = Math.floor((Math.random() * 3));
          turningLayer = Math.floor((Math.random() * 4));
          turningDirection = Math.floor((Math.random() * 3));
          if (turningOrientation !== previousOrientation)
            layersTurned = 0;
        }
        if (turningOrientation === 0)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('U');
          else if (turningLayer === 1)
            scramble = scramble.concat('Uw');
          else if (turningLayer === 2)
            scramble = scramble.concat('Dw');
          else
            scramble = scramble.concat('D');
        }
        else if (turningOrientation === 1)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('F');
          else if (turningLayer === 1)
            scramble = scramble.concat('Fw');
          else if (turningLayer === 2)
            scramble = scramble.concat('Bw');
          else
            scramble = scramble.concat('B');
        }
        else if (turningOrientation === 2)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('L');
          else if (turningLayer === 1)
            scramble = scramble.concat('Lw');
          else if (turningLayer === 2)
            scramble = scramble.concat('Rw');
          else
            scramble = scramble.concat('R');
        }
        switch (turningLayer)
        {
          case 0: layersTurned += 1; break;
          case 1: layersTurned += 2; break;
          case 2: layersTurned += 4; break;
          case 3: layersTurned += 8; break;
        }
        switch (turningDirection)
        {
          case 1: scramble = scramble.concat('\''); break;
          case 2: scramble = scramble.concat('2'); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
          scramble = scramble.concat(' ');
      }
      return scramble;
    };

    Scrambler.prototype.generate6x6Scramble = function(length)
    {
      var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
      for (var i = 0; i < length; i++)
      {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 5)), innerTurningLayer = Math.floor((Math.random() * 2)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
        switch (turningLayer)
        {
          case 0: temp = 1; break;
          case 1: temp = 2; break;
          case 2: temp = 4; break;
          case 3: temp = 8; break;
          case 4: temp = 16; break;
        }
        while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
        {
          turningOrientation = Math.floor((Math.random() * 3));
          turningLayer = Math.floor((Math.random() * 5));
          innerTurningLayer = Math.floor((Math.random() * 2));
          turningDirection = Math.floor((Math.random() * 3));
          if (turningOrientation !== previousOrientation)
            layersTurned = 0;
        }
        if (turningOrientation === 0)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('U');
          else if (turningLayer === 1)
            scramble = scramble.concat('D');
          else if (turningLayer === 2)
            scramble = scramble.concat('Uw');
          else if (turningLayer === 3)
            scramble = scramble.concat('Dw');
          else if (innerTurningLayer === 0)
            scramble = scramble.concat('3Uw');
          else
            scramble = scramble.concat('3Dw');
        }
        else if (turningOrientation === 1)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('F');
          else if (turningLayer === 1)
            scramble = scramble.concat('B');
          else if (turningLayer === 2)
            scramble = scramble.concat('Fw');
          else if (turningLayer === 3)
            scramble = scramble.concat('Bw');
          else if (innerTurningLayer === 0)
            scramble = scramble.concat('3Fw');
          else
            scramble = scramble.concat('3Bw');
        }
        else if (turningOrientation === 2)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('L');
          else if (turningLayer === 1)
            scramble = scramble.concat('R');
          else if (turningLayer === 2)
            scramble = scramble.concat('Lw');
          else if (turningLayer === 3)
            scramble = scramble.concat('Rw');
          else if (innerTurningLayer === 0)
            scramble = scramble.concat('3Lw');
          else
            scramble = scramble.concat('3Rw');
        }
        switch (turningLayer)
        {
          case 0: layersTurned += 1; break;
          case 1: layersTurned += 2; break;
          case 2: layersTurned += 4; break;
          case 3: layersTurned += 8; break;
          case 4: layersTurned += 16; break;
        }
        switch (turningDirection)
        {
          case 1: scramble = scramble.concat('\''); break;
          case 2: scramble = scramble.concat('2'); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
          scramble = scramble.concat(' ');
      }
      return scramble;
    };

    Scrambler.prototype.generate7x7Scramble = function(length)
    {
      var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
      for (var i = 0; i < length; i++)
      {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 6)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
        switch (turningLayer)
        {
          case 0: temp = 1; break;
          case 1: temp = 2; break;
          case 2: temp = 4; break;
          case 3: temp = 8; break;
          case 4: temp = 16; break;
          case 5: temp = 32; break;
        }
        while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
        {
          turningOrientation = Math.floor((Math.random() * 3));
          turningLayer = Math.floor((Math.random() * 6));
          turningDirection = Math.floor((Math.random() * 3));
          if (turningOrientation !== previousOrientation)
            layersTurned = 0;
        }
        if (turningOrientation === 0)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('U');
          else if (turningLayer === 1)
            scramble = scramble.concat('D');
          else if (turningLayer === 2)
            scramble = scramble.concat('Uw');
          else if (turningLayer === 3)
            scramble = scramble.concat('Dw');
          else if (turningLayer === 4)
            scramble = scramble.concat('3Uw');
          else
            scramble = scramble.concat('3Dw');

        }
        else if (turningOrientation === 1)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('F');
          else if (turningLayer === 1)
            scramble = scramble.concat('B');
          else if (turningLayer === 2)
            scramble = scramble.concat('Fw');
          else if (turningLayer === 3)
            scramble = scramble.concat('Bw');
          else if (turningLayer === 4)
            scramble = scramble.concat('3Fw');
          else
            scramble = scramble.concat('3Bw');
        }
        else if (turningOrientation === 2)
        {
          if (turningLayer === 0)
            scramble = scramble.concat('L');
          else if (turningLayer === 1)
            scramble = scramble.concat('R');
          else if (turningLayer === 2)
            scramble = scramble.concat('Lw');
          else if (turningLayer === 3)
            scramble = scramble.concat('Rw');
          else if (turningLayer === 4)
            scramble = scramble.concat('3Lw');
          else
            scramble = scramble.concat('3Rw');
        }
        switch (turningLayer)
        {
          case 0: layersTurned += 1; break;
          case 1: layersTurned += 2; break;
          case 2: layersTurned += 4; break;
          case 3: layersTurned += 8; break;
          case 4: layersTurned += 16; break;
          case 5: layersTurned += 32; break;
        }
        switch (turningDirection)
        {
          case 1: scramble = scramble.concat('\''); break;
          case 2: scramble = scramble.concat('2'); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
          scramble = scramble.concat(' ');
      }
      return scramble;
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
