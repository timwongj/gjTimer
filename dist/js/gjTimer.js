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
  angular.module('gjTimer', ['cub', 'menuBar', 'results', 'scramble', 'statistics', 'timer']);

})();

(function() {

  'use strict';

  function GjTimerController($scope, $rootScope) {

    var COLOR_WHITE = '#FFFFFF';
    var COLOR_DARK_GRAY = 'rgba(0, 0 , 0, 0.8)';
    var SPACEBAR_KEY_CODE = 32, ENTER_KEY_CODE = 13;

    $scope.style = {
      body: {},
      section: {},
      timer: {}
    };

    $scope.keydown = function(event) {

      if (event.keyCode === ENTER_KEY_CODE) {
        $rootScope.$broadcast('new scramble', $scope.event);
      } else if (event.keyCode === SPACEBAR_KEY_CODE) {
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
      scope: {
        event: '='
      }
    };
  }

  angular.module('cub', []).directive('cub', cubDirective);

})();

(function() {

  'use strict';

  function CubController($scope, CubService) {

    var self = this;

    $scope.$on('draw scramble', function($event, event, state) {
      self.cub = CubService.drawScramble(event, state);
    });

  }

  angular.module('cub').controller('CubController', ['$scope', 'CubService', CubController]);

})();

(function() {

  'use strict';

  function CubService($sce, Events) {

    var self = this;

    /**
     * Uses the jsss library to create an svg element of the scramble.
     * @param event
     * @param state
     * @returns {*}
     */
    self.drawScramble = function(event, state) {

      var width = Events.getEventSvg(event).width;
      var height = width / Events.getEventSvg(event).ratio;

      var el = document.createElement("div");
      scramblers[Events.getEventId(event)].drawScramble(el, state, height, width);

      var tmp = document.createElement("div");
      tmp.appendChild(el);

      return $sce.trustAsHtml(tmp.innerHTML);

    };

  }

  angular.module('cub').service('CubService', ['$sce', 'Events', CubService]);

})();

(function() {

  'use strict';

  function menuBarDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/menuBar/menuBar.html',
      controller: 'MenuBarController',
      controllerAs: 'ctrl',
      scope: {
        event: '=',
        sessionId: '=',
        settings: '='
      }
    };
  }

  angular.module('menuBar', []).directive('menuBar', menuBarDirective);

})();

(function() {

  'use strict';

  function MenuBarController($scope, $rootScope, $timeout, $uibModal, MenuBarService, Events) {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

    self.events = Events.getEvents();
    self.session = MenuBarService.init();
    self.event = self.session.event;
    $scope.sessionId = 'session' + self.session.name.substr(8, self.session.name.length);
    $scope.event = self.event;
    $scope.settings = {
      precision: 2, // 2 digits after decimal
      timerStartDelay: 100, // milliseconds
      timerStopDelay: 100, // milliseconds
      timerRefreshInterval: 50 // milliseconds
    };

    // TODO - find a better solution to waiting for controllers to initialize before broadcasting
    // The cutoff for successful broadcast is ~15-20ms, so 50 should be sufficient for now.
    $timeout(function() {
      $rootScope.$broadcast('new scramble', $scope.event);
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
      $scope.event = self.event;
      $rootScope.$broadcast('new scramble', $scope.event);
    };

    self.changeSession = function(sessionName) {
      self.session = MenuBarService.changeSession('session' + sessionName.substr(8, sessionName.length));
      $scope.sessionId = 'session' + sessionName.substr(8, sessionName.length);
      $scope.event = self.session.event;
      $rootScope.$broadcast('refresh data');
      if (self.event !== self.session.event) {
        $rootScope.$broadcast('new scramble', $scope.event);
      }
      self.event = $scope.event;
    };

    self.settings = function() {
      $uibModal.open({
        animation: true,
        templateUrl: 'dist/components/gjTimer/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'ctrl',
        size: 'md',
        resolve: {
          settings: function () {
            return $scope.settings;
          }
        }
      });
    };

    self.scramble = function() {
      $rootScope.$broadcast('new scramble');
    };

    self.resetSession = function() {
      if (confirm('Are you sure you want to reset ' + self.session.name + '?')) {
        self.session = MenuBarService.resetSession('session' + self.session.name.substr(8, self.session.name.length));
        $rootScope.$broadcast('refresh data');
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$scope', '$rootScope', '$timeout', '$uibModal', 'MenuBarService', 'Events', MenuBarController]);

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
      scope: {
        results: '=',
        sessionId: '=',
        settings: '='
      }
    };
  }

  angular.module('results', []).directive('results', resultsDirective);

})();

(function() {

  'use strict';

  function ResultsController($scope, $uibModal, ResultsService) {

    var self = this;

    $scope.results = ResultsService.getResults($scope.sessionId, $scope.settings.precision);
    self.results = $scope.results;

    $scope.$on('refresh data', function() {
      $scope.results = ResultsService.getResults($scope.sessionId, $scope.settings.precision);
      self.results = $scope.results;
    });

    self.openModal = function(index, avg, numberOfResults) {
      if (index >= numberOfResults) {
        $uibModal.open({
          animation: true,
          templateUrl: 'dist/components/gjTimer/resultsModal/resultsModal.html',
          controller: 'ResultsModalController',
          controllerAs: 'ctrl',
          size: 'md',
          resolve: {
            data: function () {
              return {
                sessionId: $scope.sessionId,
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

  angular.module('results').controller('ResultsController', ['$scope', '$uibModal', 'ResultsService', ResultsController]);

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

        var results = JSON.parse(localStorage.getItem(sessionId)).list.slice(index - numberOfResults, index);
        var min, max, rawTimes = [], DNF = 2147485547;

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

  function scrambleDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/scramble/scramble.html',
      controller: 'ScrambleController',
      controllerAs: 'ctrl',
      scope: {
        event: '=',
        scramble: '='
      }
    };
  }

  angular.module('scramble', []).directive('scramble', scrambleDirective);

})();

(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService) {

    var self = this;

    $scope.$on('new scramble', function($event, event) {
      $scope.scramble = ScrambleService.newScramble(event);
      self.scramble = $sce.trustAsHtml($scope.scramble);
      $rootScope.$broadcast('draw scramble', event, ScrambleService.getScrambleState());
    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', ScrambleController]);

})();

(function() {

  'use strict';

  function ScrambleService(Events) {

    var self = this;

    /**
     * Gets the current scramble string.
     * @returns {*}
     */
    self.getScramble = function() {

      return self.scramble.scramble_string;

    };

    /**
     * Gets the scramble state of the current scramble.
     * This is used by the cub component to draw the scramble.
     * @returns {*}
     */
    self.getScrambleState = function() {

      return self.scramble.state;

    };

    /**
     * Uses the jsss library to generate a new scramble for the event.
     * @param event
     * @returns {*}
     */
    self.newScramble = function(event) {

      self.scramble = scramblers[Events.getEventId(event)].getRandomScramble();

      return self.scramble.scramble_string;

    };

  }

  angular.module('scramble').service('ScrambleService', ['Events', ScrambleService]);

})();

(function() {

  'use strict';

  function SettingsController($modalInstance, settings, MenuBarService) {

    var self = this;
    self.settings = settings;

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('menuBar').controller('SettingsController', ['$modalInstance', 'settings', 'MenuBarService', SettingsController]);

})();

(function() {

  'use strict';

  function statisticsDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/statistics/statistics.html',
      controller: 'StatisticsController',
      controllerAs: 'ctrl',
      scope: {
        event: '=',
        results: '='
      }
    };
  }

  angular.module('statistics', []).directive('statistics', statisticsDirective);

})();

(function() {

  'use strict';

  function StatisticsController($scope, StatisticsService) {

    var self = this;

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', 'StatisticsService', StatisticsController]);

})();

(function() {

  'use strict';

  function StatisticsService() {

    var self = this;
    
  }

  angular.module('statistics').service('StatisticsService', [StatisticsService]);

})();

(function() {

  'use strict';

  function timerDirective() {
    return {
      restrict: 'E',
      templateUrl: '/dist/components/gjTimer/timer/timer.html',
      controller: 'TimerController',
      controllerAs: 'ctrl',
      scope: {
        event: '=',
        scramble: '=',
        sessionId: '=',
        settings: '='
      }
    };
  }

  angular.module('timer', []).directive('timer', timerDirective);

})();

(function() {

  'use strict';

  function TimerController($scope, $rootScope, $interval, $timeout, TimerService) {

    var self = this, timer, state = 'reset', SPACE_BAR_KEY_CODE = 32;

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
        }, $scope.settings.timerStartDelay);
      } else if (state === 'timing') {
        state = 'stopped';
        $interval.cancel(timer);
        $rootScope.$broadcast('timer unfocus');
        TimerService.saveResult(self.time, $scope.scramble, $scope.sessionId);
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
        }, $scope.settings.timerRefreshInterval);
      } else if (state === 'keydown') {
        state = 'reset';
      } else if (state === 'stopped') {
        $timeout(function() {
          state = 'reset';
        }, $scope.settings.timerStopDelay);
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
     * Gets the current time.
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
