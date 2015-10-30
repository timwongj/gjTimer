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
  angular.module('gjTimer', ['cub', 'menuBar', 'scramble', 'results', 'timer']);

})();

(function() {

  'use strict';

  function GjTimerController($scope, $rootScope) {

    var COLOR_WHITE = '#FFFFFF';
    var COLOR_DARK_GRAY = 'rgba(0, 0 , 0, 0.8)';
    var SPACEBAR_KEY_CODE = 32;

    $scope.style = {
      body: {},
      section: {},
      timer: {}
    };

    $scope.keydown = function(event) {
      if (event.keyCode === SPACEBAR_KEY_CODE) {
        event.preventDefault();
      }
      $rootScope.$broadcast('keydown', event);
    };

    $scope.keyup = function(event) {
      $rootScope.$broadcast('keyup', event);
    };

    $scope.$on('timer focus', function() {
      $scope.style.body = { 'background-color': COLOR_DARK_GRAY };
      $scope.style.section = { 'display': 'none' };
      $scope.style.timer = { 'margin-top': '4.5625em' };
    });

    $scope.$on('timer unfocus', function() {
      $scope.style.body = { 'background-color': COLOR_WHITE };
      $scope.style.section = { 'display': 'block' };
      $scope.style.timer = { 'margin-top': '0' };
    });

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

  function Events() {

    var self = this;

    var eventIds = {
      'Rubik\'s Cube': '333',
      '4x4 Cube': '444',
      '5x5 Cube': '555',
      '2x2 Cube': '222',
      '3x3 blindfolded': '333bf',
      '3x3 one-handed': '333oh',
      'Megaminx': 'minx',
      'Pyraminx': 'pyram',
      'Square-1': 'sq1',
      'Rubik\'s Clock': 'clock',
      '6x6 Cube': '666',
      '7x7 Cube': '777',
      '4x4 blindfolded': '444bf',
      '5x5 blindfolded': '555bf'
    };

    var eventSvg = {
      'Rubik\'s Cube': { ratio: 0.75, width: 200 },
      '4x4 Cube': { ratio: 0.75, width: 200 },
      '5x5 Cube': { ratio: 0.75, width: 200 },
      '2x2 Cube': { ratio: 0.75, width: 200 },
      '3x3 blindfolded': { ratio: 0.75, width: 200 },
      '3x3 one-handed': { ratio: 0.75, width: 200 },
      'Megaminx': { ratio: 0.51, width: 150 },
      'Pyraminx': { ratio: 0.69, width: 200 },
      'Square-1': { ratio: 0.57, width: 150 },
      'Rubik\'s Clock': { ratio: 0.50, width: 150 },
      '6x6 Cube': { ratio: 0.75, width: 200 },
      '7x7 Cube': { ratio: 0.75, width: 200 },
      '4x4 blindfolded': { ratio: 0.75, width: 200 },
      '5x5 blindfolded': { ratio: 0.75, width: 200 }
    };

    self.getEvents = function() {
      return eventIds;
    };

    self.getEventId = function(event) {
      return eventIds[event];
    };

    self.getEventSvg = function(event) {
      return eventSvg[event];
    };

  }

  angular.module('gjTimer').service('Events', Events);

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

  function CubController($scope, $rootScope, $sce, Events, CubService) {

    var self = this;
    $scope.$on('draw scramble', function($event, state) {
      var width = Events.getEventSvg($rootScope.event).width;
      var height = width / Events.getEventSvg($rootScope.event).ratio;
      var el = document.createElement("div");
      scramblers[Events.getEventId($rootScope.event)].drawScramble(el, state, height, width);
      var tmp = document.createElement("div");
      tmp.appendChild(el);
      self.cub = $sce.trustAsHtml(tmp.innerHTML);
    });

  }

  angular.module('cub').controller('CubController', ['$scope', '$rootScope', '$sce', 'Events', 'CubService', CubController]);

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

  function ScrambleController($scope, $rootScope, $sce, ScrambleService) {

    var self = this;

    var ENTER_KEY_CODE = 13;

    $scope.$on('new scramble', function() {
      $rootScope.scramble = ScrambleService.newScramble($rootScope.event);
      self.scramble = $sce.trustAsHtml($rootScope.scramble);
      $rootScope.$broadcast('draw scramble', ScrambleService.getScrambleState());
    });

    $scope.$on('keydown', function() {
      if (event.keyCode === ENTER_KEY_CODE) {
        $rootScope.scramble = ScrambleService.newScramble($rootScope.event);
        self.scramble = $sce.trustAsHtml($rootScope.scramble);
        $rootScope.$broadcast('draw scramble', ScrambleService.getScrambleState());
      }
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', ScrambleController]);

})();
(function() {

  'use strict';

  function ScrambleService(Events) {

    var self = this;

    self.getScramble = function() {
      return self.scramble.scramble_string;
    };

    self.getScrambleState = function() {
      return self.scramble.state;
    };

    self.newScramble = function(event) {
      self.scramble = scramblers[Events.getEventId(event)].getRandomScramble();
      return self.scramble.scramble_string;
    };

  }

  angular.module('scramble').service('ScrambleService', ['Events', ScrambleService]);

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

  function MenuBarController($rootScope, $timeout, MenuBarService, Events) {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

    self.events = Events.getEvents();
    self.session = MenuBarService.init();
    self.event = self.session.event;
    $rootScope.sessionId = 'session' + self.session.name.substr(8, self.session.name.length);
    $rootScope.event = self.event;

    // TODO - find a better solution to waiting for controllers to initialize before broadcasting
    // The cutoff for successful broadcast is ~15-20ms, so 50 should be sufficient for now.
    $timeout(function() {
      $rootScope.$broadcast('new scramble', self.event);
    }, 50);

    self.sessions = [];
    for (var i = 0; i < NUMBER_OF_SESSIONS; i++) {
      self.sessions[i] = {};
    }

    angular.forEach(self.sessions, function(session, $index) {
      session.name = 'Session ' + ($index + 1);
    });

    self.selectEvent = function(event) {
      self.event = MenuBarService.changeEvent('session' + self.session.name.substr(8, self.session.name.length), event);
      $rootScope.event = self.event;
      $rootScope.$broadcast('new scramble', self.event);
    };

    self.changeSession = function(sessionName) {
      self.session = MenuBarService.changeSession('session' + sessionName.substr(8, sessionName.length));
      $rootScope.sessionId = 'session' + sessionName.substr(8, sessionName.length);
      $rootScope.event = self.session.event;
      $rootScope.$broadcast('refresh data');
      if (self.event !== self.session.event) {
        $rootScope.$broadcast('new scramble', self.session.event);
      }
      self.event = $rootScope.event;
    };

    self.settings = function() {
      console.log('settings');
    };

    self.scramble = function() {
      $rootScope.$broadcast('new scramble', self.session.event);
    };

    self.resetSession = function() {
      if (confirm('Are you sure you would like to reset ' + self.session.name + '?')) {
        self.session = MenuBarService.resetSession('session' + self.session.name.substr(8, self.session.name.length));
        $rootScope.$broadcast('refresh data');
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$rootScope', '$timeout', 'MenuBarService', 'Events', MenuBarController]);

})();
(function() {

  'use strict';

  function MenuBarService() {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

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
        event: 'Rubik\'s Cube',
        list: []
      };

      for (var i = 1; i <= NUMBER_OF_SESSIONS; i++) {
        var session = JSON.parse(localStorage.getItem('session' + i));
        if (session === null) {
          newSession.name = 'Session ' + i;
          localStorage.setItem('session' + i, JSON.stringify(newSession));
        } else if (session.event === null) {
          session.event = 'Rubik\'s Cube';
          localStorage.setItem('session' + i, JSON.stringify(session));
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
     * Saves the new event in the session.
     * @param sessionId
     * @param event
     * @returns {*}
     */
    self.changeEvent = function(sessionId, event) {

      var session = JSON.parse(localStorage.getItem(sessionId));
      session.event = event;
      localStorage.setItem(sessionId, JSON.stringify(session));
      return session.event;

    };

  }

  angular.module('menuBar').service('MenuBarService', MenuBarService);

})();

(function() {

  'use strict';

  function resultsDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/results/results.html',
      controller: 'ResultsController',
      controllerAs: 'ctrl',
      scope: true
    };
  }

  angular.module('results', []).directive('results', resultsDirective);

})();
(function() {

  'use strict';

  function ResultsController($scope, $rootScope, $uibModal, ResultsService) {

    var self = this;
    var precision = 2;

    self.results = ResultsService.getResults($rootScope.sessionId, precision);

    $scope.$on('refresh data', function() {
      self.results = ResultsService.getResults($rootScope.sessionId, precision);
    });

    self.openModal = function(index, avg, numberOfResults) {
      if (index >= numberOfResults) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'dist/components/gjTimer/results/resultsModal.html',
          controller: 'ResultsModalController',
          controllerAs: 'ctrl',
          size: 'md',
          resolve: {
            data: function () {
              return {
                sessionId: $rootScope.sessionId,
                index: index,
                avg: avg,
                numberOfResults: numberOfResults
              };
            }
          }
        });
      }
    };

  }

  angular.module('results').controller('ResultsController', ['$scope', '$rootScope', '$uibModal', 'ResultsService', ResultsController]);

})();

(function() {

  'use strict';

  function ResultsModalController($modalInstance, data, ResultsService) {

    var self = this;

    self.title = data.avg + ' average of ' + data.numberOfResults;
    self.results = ResultsService.getModalResults(data.sessionId, data.index, data.numberOfResults);

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'data', 'ResultsService', ResultsModalController]);

})();

(function() {

  'use strict';

  function ResultsPopoverController($scope, $rootScope, ResultsService) {

  }

  angular.module('results').controller('ResultsPopoverController', ['$scope', '$rootScope', 'ResultsService', ResultsPopoverController]);

})();

(function() {

  'use strict';

  function ResultsService() {

    var self = this;

    /**
     * Gets results for the session.
     * @param sessionId
     * @param precision
     */
    self.getResults = function(sessionId, precision) {

      var results = JSON.parse(localStorage.getItem(sessionId)).list;

      angular.forEach(results, function(result, index) {
        result.time = Number(result.time).toFixed(precision);
        if (index >= 4) {
          result.avg5 = self.calculateAverage(results.slice(index - 4, index + 1), precision);
        } else {
          result.avg5 = 'DNF';
        }
        if (index >= 11) {
          result.avg12 = self.calculateAverage(results.slice(index - 11, index + 1), precision);
        } else {
          result.avg12 = 'DNF';
        }
      });

      return results;

    };

    /**
     * Get results for the avg5/avg12 modal.
     * @param sessionId
     * @param index
     * @param numberOfResults
     */
    self.getModalResults = function(sessionId, index, numberOfResults) {
      if (localStorage.getItem(sessionId) === null) {
        return [];
      } else {
        var min, max, rawTimes = [], results = JSON.parse(localStorage.getItem(sessionId)).list.slice(index - numberOfResults, index);
        angular.forEach(results, function(result) {
          if ((result.penalty !== undefined) && (result.penalty === '(DNF)')) {
            rawTimes.push(DNF);
          } else if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
            rawTimes.push(self.timeToMilliseconds(result.time, 3) + 2);
          } else {
            rawTimes.push(self.timeToMilliseconds(result.time, 3));
          }
        });
        min = rawTimes.indexOf(Math.min.apply(null, rawTimes));
        max = rawTimes.indexOf(Math.max.apply(null, rawTimes));
        results[min].min = true;
        results[max].max = true;
        return results;
      }
    };

    /**
     * Calculates the average of the results.
     * @param results
     * @param precision
     * @returns {*}
     */
    self.calculateAverage = function(results, precision) {
      if (results.length < 3) {
        return 'DNF';
      }
      var rawTimes = [], DNF = 2147485547;
      angular.forEach(results, function(result) {
        if ((result.penalty !== undefined) && (result.penalty === '(DNF)')) {
          rawTimes.push(DNF);
        } else if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision) + 2);
        } else {
          rawTimes.push(self.timeToMilliseconds(result.time, precision));
        }
      });
      rawTimes.splice(rawTimes.indexOf(Math.min.apply(null, rawTimes)), 1);
      rawTimes.splice(rawTimes.indexOf(Math.max.apply(null, rawTimes)), 1);
      if (rawTimes.indexOf(DNF) >= 0) {
        return 'DNF';
      } else {
        return (rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(precision);
      }
    };

    /**
     * Calculates the mean of the results.
     * @param results
     * @param precision
     */
    self.calculateMean = function(results, precision) {
      var rawTimes = [];
      angular.forEach(results, function(result) {
        if ((result.penalty !== undefined) && (result.penalty === '(DNF)')) {
          return 'DNF';
        } else if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision) + 2);
        } else {
          rawTimes.push(self.timeToMilliseconds(result.time, precision));
        }
      });
      return (rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(precision);
    };

    /**
     * Calculates the mean of the results.
     * @param results
     * @param precision
     */
    self.calculateLargeMean = function(results, precision) {
      var rawTimes = [];
      angular.forEach(results, function(result) {
        if ((result.penalty !== undefined) && (result.penalty === '(+2)')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision) + 2);
        } else if ((result.penalty === undefined) || (result.penalty === '')) {
          rawTimes.push(self.timeToMilliseconds(result.time, precision));
        }
      });
      return (rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(precision);
    };

    /**
     * Converts time from string to milliseconds.
     * @param time
     * @returns {*}
     */
    self.timeToMilliseconds = function(time) {
      var res = time.split(':');
      if (res.length === 1) {
        return parseFloat(res[0]);
      } else if (res.length === 2) {
        return (parseFloat(res[0]) * 60) + parseFloat(res[1]);
      } else if (res.length === 3) {
        return (parseFloat(res[0]) * 3600) + (parseFloat(res[1]) * 60) + parseFloat(res[2]);
      } else {
        return -1;
      }
    };

  }

  angular.module('results').service('ResultsService', ResultsService);

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

  function TimerController($scope, $rootScope, $interval, $timeout, TimerService) {

    var self = this, timer, state = 'reset';

    var TIMER_REFRESH_INTERVAL = 50, START_TIMER_DELAY = 100, STOP_TIMER_DELAY = 100, SPACE_BAR_KEY_CODE = 32;

    self.time = moment(0).format('s.SSS');

    var STYLES = {
      BLACK: { 'color': '#000000' },
      RED: { 'color': '#FF0000' },
      GREEN: { 'color': '#2EB82E' }
    };

    $scope.$on('keydown', function($event, event) {
      if ((state === 'reset') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
        state = 'keydown';
        self.time = moment(0).format('s.SSS');
        self.timerStyle = STYLES.RED;
        $timeout(function() {
          if (state === 'keydown') {
            state = 'ready';
            self.timerStyle = STYLES.GREEN;
            $rootScope.$broadcast('timer focus');
          }
        }, START_TIMER_DELAY);
      } else if (state === 'timing') {
        state = 'stopped';
        $interval.cancel(timer);
        $rootScope.$broadcast('timer unfocus');
        TimerService.saveResult(self.time, $rootScope.scramble, $rootScope.sessionId);
        $rootScope.$broadcast('refresh data');
        $rootScope.$broadcast('new scramble');
      }
    });

    $scope.$on('keyup', function($event, event) {
      self.timerStyle = STYLES.BLACK;
      if ((state === 'ready') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
        state = 'timing';
        TimerService.startTimer();
        timer = $interval(function() {
          self.time = TimerService.getTime();
        }, TIMER_REFRESH_INTERVAL);
      } else if (state === 'keydown') {
        state = 'reset';
      } else if (state === 'stopped') {
        $timeout(function() {
          state = 'reset';
        }, STOP_TIMER_DELAY);
      }
    });

  }

  angular.module('timer').controller('TimerController', ['$scope', '$rootScope', '$interval', '$timeout', 'TimerService', TimerController]);

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
