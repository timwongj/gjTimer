(function() {

  'use strict';

  function Config() {

  }

  function Run() {

  }

  angular.module('gjTimerApp', [
    // main angular modules

    // third-party (non-Angular modules)
    'ui.bootstrap',
    // gjTimer
    'gjTimer'
  ]);

  angular.module('gjTimerApp').config(Config).run(Run);

})();

(function() {

  'use strict';

  /**
   * This is the main gjTimer module. All gjTimer components should be pulled in here as dependencies.
   * This module is pulled into the main app.js 'gjTimerApp' module.
   */
  angular.module('gjTimer', ['cub', 'menuBar', 'scramble', 'statistics', 'timer']);

})();

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

(function() {

  'use strict';

  function cubDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/cub/cub.html',
      controller: 'CubController',
      controllerAs: 'ctrl',
      scope: true
    };
  }

  angular.module('cub', []).directive('cub', cubDirective);

})();
(function() {

  'use strict';

  function CubController($rootScope, CubService) {

    var self = this;

  }

  angular.module('cub').controller('CubController', ['$rootScope', 'CubService', CubController]);

})();
(function() {

  'use strict';

  function CubService() {

    var self = this;

  }

  angular.module('cub').service('CubService', CubService);

})();

(function() {

  'use strict';

  function scrambleDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/scramble/scramble.html',
      controller: 'ScrambleController',
      controllerAs: 'ctrl',
      scope: true
    };
  }

  angular.module('scramble', []).directive('scramble', scrambleDirective);

})();
(function() {

  'use strict';

  function ScrambleController($rootScope, ScrambleService) {

    var self = this;

    self.scramble = "R B' R' U' B2 F2 D2 L2 B' F L' D2 B R2 L' F' B D2 R' B'";

  }

  angular.module('scramble').controller('ScrambleController', ['$rootScope', 'ScrambleService', ScrambleController]);

})();
(function() {

  'use strict';

  function ScrambleService() {

    var self = this;

    self.generateScramble = function(puzzle, length) {
      switch(puzzle) {
        case '2x2': return this.generate2x2Scramble(length);
        case '3x3': return this.generate3x3Scramble(length);
        case '4x4': return this.generate4x4Scramble(length);
        case '5x5': return this.generate5x5Scramble(length);
        case '6x6': return this.generate6x6Scramble(length);
        case '7x7': return this.generate7x7Scramble(length);
      }
    };

    self.generate2x2Scramble = function(length)
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

    self.generate3x3Scramble = function(length)
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

    self.generate4x4Scramble = function(length)
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

    self.generate5x5Scramble = function(length)
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

    self.generate6x6Scramble = function(length)
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

    self.generate7x7Scramble = function(length)
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

  }

  angular.module('scramble').service('ScrambleService', ScrambleService);

})();

(function() {

  'use strict';

  function menuBarDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/menuBar/menuBar.html',
      controller: 'MenuBarController',
      controllerAs: 'ctrl',
      scope: true
    };
  }

  angular.module('menuBar', []).directive('menuBar', menuBarDirective);

})();
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

(function() {

  'use strict';

  function statisticsDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/statistics/statistics.html',
      controller: 'StatisticsController',
      controllerAs: 'ctrl',
      scope: true
    };
  }

  angular.module('statistics', []).directive('statistics', statisticsDirective);

})();
(function() {

  'use strict';

  function StatisticsController($rootScope, StatisticsService) {

    var self = this;

    self.session = {};

    self.session.solves = [
      {
        time: '6.25',
        avg5: 'DNF',
        avg12: 'DNF'
      },
      {
        time: '6.44',
        avg5: 'DNF',
        avg12: 'DNF'
      }
    ];

  }

  angular.module('statistics').controller('StatisticsController', ['$rootScope', 'StatisticsService', StatisticsController]);

})();
(function() {

  'use strict';

  function StatisticsService() {

    var self = this;

  }

  angular.module('statistics').service('StatisticsService', StatisticsService);

})();

(function() {

  'use strict';

  function timerDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/timer/timer.html',
      controller: 'TimerController',
      controllerAs: 'ctrl',
      scope: true
    };
  }

  angular.module('timer', []).directive('timer', timerDirective);

})();
(function() {

  'use strict';

  function TimerController($rootScope, TimerService) {

    var self = this;

    self.time = TimerService.getTime();

  }

  angular.module('timer').controller('TimerController', ['$rootScope', 'TimerService', TimerController]);

})();
(function() {

  'use strict';

  function TimerService() {

    var self = this;

    self.time = '17:38.625';

    self.getTime = function() {
      return self.time;
    };

  }

  angular.module('timer').service('TimerService', TimerService);

})();
