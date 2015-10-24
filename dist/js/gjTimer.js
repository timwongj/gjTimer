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

  function GjTimerController($scope, $rootScope) {

    $scope.keydown = function(event) {
      $rootScope.$broadcast('keydown', event);
    };

    $scope.keyup = function(event) {
      $rootScope.$broadcast('keyup', event);
    };

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', GjTimerController]);

})();

(function() {

  'use strict';

  function ReverseFilter() {

    return function(items) {

      return items.slice().reverse();

    };

  }

  angular.module('gjTimer').filter('reverse', ReverseFilter);

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

  function ScrambleController($scope, $rootScope, ScrambleService) {

    var self = this;

    $scope.$on('new scramble', function($event, puzzle) {
      self.scramble = ScrambleService.newScramble(puzzle);
      $rootScope.scramble = self.scramble;
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', 'ScrambleService', ScrambleController]);

})();
(function() {

  'use strict';

  function ScrambleService() {

    var self = this;

    self.getScramble = function() {
      return self.scramble;
    };

    self.newScramble = function(puzzle) {
      self.scramble = generateScramble(puzzle);
      return self.scramble;
    };

  }

  angular.module('scramble').service('ScrambleService', ScrambleService);

  function generateScramble(puzzle) {
    switch(puzzle) {
      case '2x2 Cube': return generate2x2Scramble(10);
      case 'Rubik\'s Cube': return generate3x3Scramble(20);
      case '4x4 Cube': return generate4x4Scramble(40);
      case '5x5 Cube': return generate5x5Scramble(60);
      case '6x6 Cube': return generate6x6Scramble(80);
      case '7x7 Cube': return generate7x7Scramble(100);
    }
  }

  function generate2x2Scramble(length)
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
  }

  function generate3x3Scramble(length)
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
  }

  function generate4x4Scramble(length)
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
  }

  function generate5x5Scramble(length)
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
  }

  function generate6x6Scramble(length)
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
  }

  function generate7x7Scramble(length)
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
  }

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
(function() {

  'use strict';

  function MenuBarService() {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;
    var PUZZLES = ['Rubik\'s Cube', '4x4 Cube', '5x5 Cube', '2x2 Cube', '6x6 Cube', '7x7 Cube'];

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
        puzzle: 'Rubik\'s Cube',
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
     * Resets the session in local storage.
     * @param sessionId
     */
    self.resetSession = function(sessionId) {

      var session = JSON.parse(localStorage.getItem(sessionId));
      session.list = [];
      localStorage.setItem(sessionId, JSON.stringify(session));
      return session;

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
        case 2: return '2x2 Cube';
        case 3: return 'Rubik\'s Cube';
        case 4: return '4x4 Cube';
        case 5: return '5x5 Cube';
        case 6: return '6x6 Cube';
        case 7: return '7x7 Cube';
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

  function StatisticsController($scope, $rootScope, StatisticsService) {

    var self = this;

    self.results = StatisticsService.getResults($rootScope.sessionId);

    $scope.$on('refresh data', function() {
      self.results = StatisticsService.getResults($rootScope.sessionId);
    });

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', '$rootScope', 'StatisticsService', StatisticsController]);

})();
(function() {

  'use strict';

  function StatisticsService() {

    var self = this;

    /**
     * Gets results for the session.
     * @param sessionId
     */
    self.getResults = function(sessionId) {

      return JSON.parse(localStorage.getItem(sessionId)).list;

    };

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

  function TimerController($scope, $rootScope, $interval, TimerService) {

    var self = this;

    var TIMER_REFRESH_INTERVAL = 50;
    var timer, isKeydown = false, isTiming = false;

    self.time = moment(0).format('s.SS');
    self.timerStyle = { 'color': '#000000' };

    $scope.$on('keydown', function(event, args) {
      if (!isKeydown) {
        isKeydown = true;
        if (!isTiming && (args.keyCode === 32)) {
          self.time = moment(0).format('s.SS');
          self.timerStyle = { 'color': '#2EB82E' };
        } else if (isTiming) {
          $interval.cancel(timer);
          TimerService.saveResult(self.time, $rootScope.scramble, $rootScope.sessionId);
          $rootScope.$broadcast('new scramble', $rootScope.puzzle);
          $rootScope.$broadcast('refresh data');
        }
      }
    });

    $scope.$on('keyup', function(event, args) {
      if (isKeydown && (args.keyCode === 32)) {
        isKeydown = false;
        if (!isTiming) {
          isTiming = 1;
          self.timerStyle = { 'color': '#000000' };
          TimerService.startTimer();
          timer = $interval(function() {
            self.time = TimerService.getTime();
          }, TIMER_REFRESH_INTERVAL);
        } else {
          isTiming = 0;
        }
      }
    });

  }

  angular.module('timer').controller('TimerController', ['$scope', '$rootScope', '$interval', 'TimerService', TimerController]);

})();
(function() {

  'use strict';

  function TimerService() {

    var self = this;

    var startTime;

    /**
     * Get Time.
     * @returns {string}
     */
    self.getTime = function() {
      var time = moment(Date.now() - startTime);
      if (time < 10000) {
        return time.format('s.SSS');
      } else if (time < 60000) {
        return time.format('ss.SSS');
      } else if (time < 600000) {
        return time.format('m:ss.SSS');
      } else if (time < 3600000) {
        return time.utc().format('h:mm:ss.SSS');
      }
    };

    /**
     * Starts the Timer.
     */
    self.startTimer = function() {

      startTime = Date.now();

    };

    /**
     * Saves the result.
     * @param time
     * @param scramble
     * @param sessionId
     */
    self.saveResult = function(time, scramble, sessionId) {

      var result = {
        time: time,
        scramble: scramble,
        date: new Date()
      };

      var session = JSON.parse(localStorage.getItem(sessionId));
      session.list.push(result);
      localStorage.setItem(sessionId, JSON.stringify(session));

    };

  }

  angular.module('timer').service('TimerService', TimerService);

})();
