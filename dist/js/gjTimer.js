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
   * This is the gjTimer.services module.
   * It contains all the shared services in the gjTimer module.
   */
  angular.module('gjTimer.services', []);

  /**
   * This is the gjTimer.filters module.
   * It contains all the shared filters in the gjTimer module.
   */
  angular.module('gjTimer.filters', []);

  /**
   * This is the main gjTimer module.
   * All gjTimer components should be pulled in here as dependencies.
   * This module is pulled into the main app.js 'gjTimerApp' module.
   */
  angular.module('gjTimer', ['gjTimer.services', 'gjTimer.filters', 'cub', 'menuBar', 'results', 'scramble', 'statistics', 'timer']);

})();

(function() {

  'use strict';

  function GjTimerController($scope, $rootScope) {

    var COLOR_BACKGROUND_DEFAULT = '#FFFFFF'; // white
    var COLOR_BACKGROUND_FOCUS = '#EEEEEE'; // gray
    var SPACEBAR_KEY_CODE = 32, ENTER_KEY_CODE = 13;

    $scope.style = { body: {}, section: {}, timer: {} };

    $scope.keydown = function($event) {

      if (event.keyCode === ENTER_KEY_CODE) {
        $rootScope.$broadcast('new scramble', $scope.eventId);
      } else if (event.keyCode === SPACEBAR_KEY_CODE) {
        event.preventDefault();
      }
      $rootScope.$broadcast('keydown', $event);

    };

    $scope.keyup = function($event) {

      $rootScope.$broadcast('keyup', $event);

    };

    $scope.$on('timer focus', function() {

      $scope.style.body = { 'background-color': COLOR_BACKGROUND_FOCUS };
      $scope.style.section = { 'display': 'none' };
      $scope.style.timer = { 'margin-top': '2.9375em' };

    });

    $scope.$on('timer unfocus', function() {

      $scope.style.body = { 'background-color': COLOR_BACKGROUND_DEFAULT };
      $scope.style.section = { 'display': 'block' };
      $scope.style.timer = {};

    });

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', GjTimerController]);

})();

(function() {

  'use strict';

  function ReverseFilter() {

    return function(items) {

      if (items !== undefined) {
        return items.slice().reverse();
      } else {
        return [];
      }

    };

  }

  angular.module('gjTimer.filters').filter('reverse', ReverseFilter);

})();

(function() {

  'use strict';

  function Calculator() {

    var self = this;

    self.DNF = 864000000;

    /**
     * Calculates the average of the results.
     * @param rawTimes
     * @returns {number}
     */
    self.calculateAverage = function(rawTimes) {

      if (rawTimes.length < 3) {
        return self.DNF;
      }

      var times = rawTimes.slice(0);

      // remove best and worst time
      times.splice(times.indexOf(Math.min.apply(null, times)), 1);
      times.splice(times.indexOf(Math.max.apply(null, times)), 1);

      if (times.indexOf(self.DNF) >= 0) {
        return self.DNF;
      } else {
        return Number((times.reduce(function(pv, cv) { return pv + cv; }, 0) / times.length).toFixed(0));
      }

    };

    /**
     * Calculates the mean of the results.
     * @param rawTimes
     * @returns {number}
     */
    self.calculateMean = function(rawTimes) {

      if ((rawTimes.indexOf(self.DNF) >= 0) || (rawTimes.length === 0)) {
        return self.DNF;
      } else {
        return Number((rawTimes.reduce(function(pv, cv) { return pv + cv; }, 0) / rawTimes.length).toFixed(0));
      }

    };

    /**
     * Calculates the mean of the results ignoring the DNFs.
     * @param rawTimes
     * @returns {number}
     */
    self.calculateSessionMean = function(rawTimes) {

      var times = rawTimes.slice(0);

      for (var i = 0; i < times.length; i++) {
        if (times[i] === self.DNF) {
          times.splice(i, 1);
        }
      }

      if (times.length === 0) {
        return self.DNF;
      }

      return Number((times.reduce(function(pv, cv) { return pv + cv; }, 0) / times.length).toFixed(0));

    };

    /**
     * Calculate the best avg, stDev, index
     * @param rawTimes
     * @param n
     * @returns {{index: number, avg: number, stDev: number}}
     */
    self.calculateBestAverage = function(rawTimes, n) {

      var currentAvg, bestAvg = self.DNF, index = -1;

      for (var i = 0; i < rawTimes.length - n; i++) {
        currentAvg = self.calculateAverage(rawTimes.slice(i, i + n));
        if (currentAvg < bestAvg) {
          bestAvg = currentAvg;
          index = i;
        }
      }

      return {
        index: index,
        avg: bestAvg,
        stDev: bestAvg !== self.DNF ? self.calculateStandardDeviation(rawTimes.slice(index, index + n), true) : -1
      };

    };

    /**
     *
     * @param rawTimes
     * @param n
     * @returns {number}
     */
    self.calculateBestMean = function(rawTimes, n) {

      var currentMean, bestMean = self.DNF, index = -1;

      for (var i = 0; i < rawTimes.length - n; i++) {
        currentMean = self.calculateMean(rawTimes.slice(i, i + n));
        if (currentMean < bestMean) {
          bestMean = currentMean;
          index = i;
        }
      }

      return {
        index: index,
        mean: bestMean,
        stDev: bestMean !== self.DNF ? self.calculateStandardDeviation(rawTimes.slice(index, index + n), false) : -1
      };

    };

    /**
     * Calculate the standard deviation.
     * @param rawTimes
     * @param trimmed
     * @returns {number}
     */
    self.calculateStandardDeviation = function(rawTimes, trimmed) {

      var times = rawTimes.slice(0);

      if (trimmed) {
        times.splice(times.indexOf(Math.min.apply(null, times)), 1);
        times.splice(times.indexOf(Math.max.apply(null, times)), 1);
      }

      var avg = self.calculateMean(times);

      var squareDiffs = times.map(function(time) { return Math.pow(time - avg, 2); });

      return Math.sqrt(self.calculateMean(squareDiffs));

    };

    /**
     * Extracts the raw times from the results.
     * @param results
     * @returns {Array}
     */
    self.extractRawTimes = function(results) {

      var rawTimes = [];

      for (var i = 0; i < results.length; i++) {
        rawTimes.push(results[i].rawTime);
      }

      return rawTimes;

    };

    /**
     * Count the number of non DNF results.
     * @param rawTimes
     * @returns {number}
     */
    self.countNonDNFs = function(rawTimes) {

      var count = 0;

      for (var i = 0; i< rawTimes.length; i++) {
        if (rawTimes[i] !== self.DNF) {
          count += 1;
        }
      }

      return count;

    };

    /**
     * Converts time from string to milliseconds.
     * @param timeString
     * @returns {number} - timeMilliseconds
     */
    self.convertTimeFromStringToMilliseconds = function(timeString) {

      if (timeString === 'DNF') {
        return self.DNF;
      }

      if (timeString === 'N/A') {
        return -1;
      }

      var res = timeString.split(':');

      if (res.length === 1) {
        return Number((parseFloat(res[0]) * 1000).toFixed());
      } else if (res.length === 2) {
        return Number(((parseFloat(res[0]) * 60 * 1000) + (parseFloat(res[1]) * 1000)).toFixed());
      } else if (res.length === 3) {
        return Number(((parseFloat(res[0]) * 60 * 60 * 1000) + (parseFloat(res[1]) * 60 * 1000) + (parseFloat(res[2]) * 1000)).toFixed());
      } else {
        return self.DNF;
      }

    };

    /**
     * Converts time from milliseconds to string.
     * @param timeMilliseconds
     * @param precision
     * @returns {string} - timeString
     */
    self.convertTimeFromMillisecondsToString = function(timeMilliseconds, precision) {

      if (timeMilliseconds === self.DNF) {
        return 'DNF';
      }

      if (timeMilliseconds < 0) {
        return 'N/A';
      }

      var time = moment(timeMilliseconds);
      var ms = precision === 2 ? 'SS' : 'SSS';

      if (timeMilliseconds < 10000) {
        return time.format('s.' + ms);
      } else if (timeMilliseconds < 60000) {
        return time.format('ss.' + ms);
      } else if (timeMilliseconds < 3600000) {
        return time.format('m:ss.' + ms);
      } else {
        return time.utc().format('H:mm:ss.' + ms);
      }

    };

  }

  angular.module('gjTimer.services').service('Calculator', Calculator);

})();

(function() {

  'use strict';

  function Events() {

    var self = this;

    self.events = {
      '333': { index: 0, name: 'Rubik\'s Cube', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      '444': { index: 1, name: '4x4 Cube', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } },
      '555': { index: 2, name: '5x5 Cube', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } },
      '222': { index: 3, name: '2x2 Cube', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      '333bf': { index: 4, name: '3x3 blindfolded', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      '333oh': { index: 5, name: '3x3 one-handed', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      'minx': { index: 6, name: 'Megaminx', style: { 'font-size' : '13pt' }, svg: { ratio: 0.51, width: 175 } },
      'pyram': { index: 7, name: 'Pyraminx', style: { 'font-size' : '16pt' }, svg: { ratio: 0.69, width: 250 } },
      'sq1': { index: 8, name: 'Square-1', style: { 'font-size' : '15pt' }, svg: { ratio: 0.57, width: 175 } },
      'clock': { index: 9, name: 'Rubik\'s Clock', style: { 'font-size' : '15pt' }, svg: { ratio: 0.50, width: 175 } },
      '666': { index: 10, name: '6x6 Cube', style: { 'font-size' : '13pt' }, svg: { ratio: 0.75, width: 250 } },
      '777': { index: 11, name: '7x7 Cube', style: { 'font-size' : '13pt' }, svg: { ratio: 0.75, width: 250 } },
      '444bf': { index: 12, name: '4x4 blindfolded', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } },
      '555bf': { index: 13, name: '5x5 blindfolded', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } }
    };

    /**
     * Gets the list of events supported by gjTimer.
     * @returns {string[]}
     */
    self.getEvents = function() {

      var events = [];
      angular.forEach(self.events, function(event) {
        events[event.index] = event.name;
      });
      return events;

    };

    /**
     * Gets the event given the eventId.
     * @param eventId
     * @returns {string} event
     */
    self.getEvent = function(eventId) {

      if (self.events.hasOwnProperty(eventId)) {
        return self.events[eventId].name;
      } else {
        return null;
      }

    };

    /**
     * Gets the eventId given the event.
     * @param eventName
     * @returns {string}
     */
    self.getEventId = function(eventName) {

      for (var eventId in self.events) {
        if (self.events.hasOwnProperty(eventId)) {
          if (self.events[eventId].name === eventName) {
            return eventId;
          }
        }
      }
      return null;

    };

    /**
     * Gets the css style for the scramble of the event.
     * @param eventId
     * @returns {object} style
     */
    self.getEventStyle = function(eventId) {

      if (self.events.hasOwnProperty(eventId)) {
        return self.events[eventId].style;
      } else {
        return self.events['333'].style;
      }

    };

    /**
     * Gets the svg properties of the event.
     * @param eventId
     * @returns {object}
     */
    self.getEventSvg = function(eventId) {

      if (self.events.hasOwnProperty(eventId)) {
        return self.events[eventId].svg;
      } else {
        return self.events['333'].svg;
      }

    };

  }

  angular.module('gjTimer.services').service('Events', Events);

})();

(function() {

  'use strict';

  function LocalStorage() {

    var self = this;

    /**
     * Get a localStorage value given a key.
     * @param key
     */
    self.get = function(key) {
      return localStorage.getItem(key);
    };

    /**
     * Set a localStorage (key, value) pair in local storage with error handling.
     * @param key
     * @param value
     * @returns {boolean}
     */
    self.set = function(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch(e) {
        return false;
      }
    };

    /**
     * Get a localStorage value as JSON given a key.
     * @param key
     * @returns {null}
     */
    self.getJSON = function(key) {
      var value = localStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    };

    /**
     * Set a localStorage (key, value) pair as a JSON string in local storage with error handling.
     * @param key
     * @param value
     * @returns {boolean}
     */
    self.setJSON = function(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch(e) {
        return false;
      }
    };

    /**
     * Clears localStorage
     * @returns {boolean}
     */
    self.clear = function() {
      try {
        localStorage.clear();
        return true;
      } catch(e) {
        return false;
      }
    };

  }

  angular.module('gjTimer.services').service('LocalStorage', LocalStorage);

})();

(function() {

  'use strict';

  function cubDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/cub/cub.html',
      controller: 'CubController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '='
      }
    };
  }

  angular.module('cub', []).directive('cub', cubDirective);

})();

(function() {

  'use strict';

  function CubController($scope, CubService) {

    var self = this;

    $scope.$on('draw scramble', function($event, eventId, state) {

      self.cub = CubService.drawScramble(eventId, state);

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
     * @param eventId
     * @param state
     * @returns {*}
     */
    self.drawScramble = function(eventId, state) {

      var width = Events.getEventSvg(eventId).width;
      var height = width / Events.getEventSvg(eventId).ratio;

      var el = document.createElement('div');
      scramblers[eventId].drawScramble(el, state, height, width);

      var tmp = document.createElement('div');
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
      templateUrl: 'dist/components/gjTimer/menuBar/menuBar.html',
      controller: 'MenuBarController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '=',
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

    self.sessions = MenuBarService.initSessions();
    self.session = MenuBarService.initSession();
    self.events = Events.getEvents();
    self.event = { eventId: self.session.eventId, event: Events.getEvent(self.session.eventId) };
    $scope.sessionId = self.session.sessionId;
    $scope.eventId = self.session.eventId;
    $scope.settings = {
      precision: 2, // 2 digits after decimal
      timerPrecision: 3, // 3 digits after decimal
      timerStartDelay: 100, // milliseconds
      timerStopDelay: 100, // milliseconds
      timerRefreshInterval: 50 // milliseconds
    };

    // TODO - find a better solution to waiting for controllers to initialize before broadcasting
    // The cutoff for successful broadcast is ~15-20ms, so 50 should be sufficient for now.
    $timeout(function() {
      $rootScope.$broadcast('new scramble', $scope.eventId);
    }, 50);

    self.changeSession = function(sessionId) {
      self.session = MenuBarService.changeSession(sessionId);
      $scope.sessionId = sessionId;
      $scope.eventId = self.session.eventId;
      $rootScope.$broadcast('refresh data', sessionId);
      if (self.event.eventId !== self.session.eventId) {
        $rootScope.$broadcast('new scramble', $scope.eventId);
      }
      self.event = { eventId: $scope.eventId, event: Events.getEvent($scope.eventId) };
    };

    self.changeEvent = function(event) {
      $scope.eventId = MenuBarService.changeEvent($scope.sessionId, Events.getEventId(event));
      self.session.eventId = $scope.eventId;
      self.event = { eventId: $scope.eventId, event: Events.getEvent($scope.eventId) };
      $rootScope.$broadcast('new scramble', $scope.eventId);
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

    self.resetSession = function() {
      if (confirm('Are you sure you want to reset ' + $scope.sessionId + '?')) {
        self.session = MenuBarService.resetSession($scope.sessionId);
        $rootScope.$broadcast('refresh data', $scope.sessionId);
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$scope', '$rootScope', '$timeout', '$uibModal', 'MenuBarService', 'Events', MenuBarController]);

})();

(function() {

  'use strict';

  function MenuBarService(LocalStorage) {

    var self = this;

    var NUMBER_OF_SESSIONS = 15;

    /**
     * Initializes sessions in local storage if they do not exist.
     * @returns [String] - sessionId
     */
    self.initSessions = function() {

      var sessions = [];

      for (var i = 1; i <= NUMBER_OF_SESSIONS; i++) {
        sessions.push('Session ' + i);
        var session = LocalStorage.getJSON('Session ' + i);
        if (session === null) {
          LocalStorage.setJSON('Session ' + i, { sessionId: 'Session ' + i , eventId: '333', results: [] });
        }
      }

      return sessions;

    };

    /**
     * Initializes or gets session number from local storage.
     * @returns {object} - session
     */
    self.initSession = function() {

      var sessionId;

      if (LocalStorage.get('sessionId') !== null) {
        sessionId = LocalStorage.get('sessionId');
      } else {
        sessionId = 'Session 1';
        LocalStorage.set('sessionId', 'Session 1');
      }

      return LocalStorage.getJSON(sessionId);

    };

    /**
     * Gets session data from local storage.
     * @param sessionId
     * @returns {object} session
     */
    self.getSession = function(sessionId) {

      return LocalStorage.getJSON(sessionId);

    };

    /**
     * Saves the new session in local storage and returns the new session.
     * @param sessionId
     * @returns {object} session
     */
    self.changeSession = function(sessionId) {

      LocalStorage.set('sessionId', sessionId);
      return LocalStorage.getJSON(sessionId);

    };

    /**
     * Resets the session in local storage by clearing the results list.
     * @param sessionId
     * @returns {object} session
     */
    self.resetSession = function(sessionId) {

      var session = LocalStorage.getJSON(sessionId);
      session.results = [];
      LocalStorage.setJSON(sessionId, session);
      return session;

    };

    /**
     * Saves the new event in the session.
     * @param sessionId
     * @param eventId
     * @returns {*} eventId
     */
    self.changeEvent = function(sessionId, eventId) {

      var session = LocalStorage.getJSON(sessionId);
      session.eventId = eventId;
      LocalStorage.setJSON(sessionId, session);
      return session.eventId;

    };

  }

  angular.module('menuBar').service('MenuBarService', ['LocalStorage', MenuBarService]);

})();

(function() {

  'use strict';

  function resultsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/results/results.html',
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

    $scope.$on('refresh data', function($event, sessionId) {
      $scope.results = ResultsService.getResults(sessionId, $scope.settings.precision);
      self.results = $scope.results;
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
      }
    });

    self.openModal = function(index, numberOfResults) {
      if (index >= numberOfResults) {
        $uibModal.open({
          animation: true,
          templateUrl: 'dist/components/gjTimer/resultsModal/resultsModal.html',
          controller: 'ResultsModalController',
          controllerAs: 'ctrl',
          size: 'md',
          resolve: {
            results: function () {
              return $scope.results.slice(index - numberOfResults, index);
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

  function ResultsService(LocalStorage, Calculator) {

    var self = this;

    var DNF = Calculator.DNF;

    /**
     * Gets results for the session.
     * @param sessionId
     * @param precision
     */
    self.getResults = function(sessionId, precision) {

      var results = [], rawResults = LocalStorage.getJSON(sessionId).results;

      angular.forEach(rawResults, function(rawResult, index) {

        var res = rawResult.split('|');

        var result = {
          index: index,
          scramble: res[1],
          date: new Date(Number(res[2])),
          comment: res[3] ? res[3] : ''
        };

        // deal with penalty if it exists
        if (res[0].substring(res[0].length - 1, res[0].length) === '+') {
          result.time = Number(res[0].substring(0, res[0].length - 1));
          result.penalty = '+2';
          result.rawTime = Number((result.time + 2000).toFixed());
          result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)) + 2000, precision) + '+';
          result.detailedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)) + 2000, precision) + '+';
        } else if (res[0].substring(res[0].length - 1, res[0].length) === '-') {
          result.time = Number(res[0].substring(0, res[0].length - 1));
          result.penalty = 'DNF';
          result.rawTime = DNF;
          result.displayedTime = 'DNF';
          result.detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)), precision) + ')';
        } else {
          result.time = Number(res[0]);
          result.penalty = '';
          result.rawTime = result.time;
          result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0]), precision);
          result.detailedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0]), precision);
        }

        results.push(result);

      });

      var rawTimes = Calculator.extractRawTimes(results);

      angular.forEach(results, function(result, index) {

        if (index >= 4) {
          result.avg5 = Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(index - 4, index + 1)), precision);
        } else {
          result.avg5 = 'DNF';
        }

        if (index >= 11) {
          result.avg12 = Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(index - 11, index + 1)), precision);
        } else {
          result.avg12 = 'DNF';
        }

      });

      return results;

    };

  }

  angular.module('results').service('ResultsService', ['LocalStorage', 'Calculator', ResultsService]);

})();

(function() {

  'use strict';

  function ResultsModalController($modalInstance, results, ResultsModalService) {

    var self = this;

    self.results = ResultsModalService.getModalResults(results);

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'results', 'ResultsModalService', ResultsModalController]);

})();

(function() {

  'use strict';

  function ResultsModalService(Calculator) {

    var self = this;

    /**
     * Get results for the results modal.
     * @param results
     * @returns [Object] - results
     */
    self.getModalResults = function(results) {

      var rawTimes = Calculator.extractRawTimes(results);

      results[rawTimes.indexOf(Math.min.apply(null, rawTimes))].min = true;
      results[rawTimes.indexOf(Math.max.apply(null, rawTimes))].max = true;

      return {
        results: results,
        avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes)),
        stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes, true))
      };

    };

  }

  angular.module('results').service('ResultsModalService', ['Calculator', ResultsModalService]);

})();

(function() {

  'use strict';

  function resultsPopoverDirective($rootScope, $timeout, $http, $q, $templateCache, ResultsService) {

    var getTemplate = function() {
      var def = $q.defer(), template = $templateCache.get('dist/components/gjTimer/resultsPopover/resultsPopover.html');
      if (typeof template === "undefined") {
        $http.get('dist/components/gjTimer/resultsPopover/resultsPopover.html')
          .success(function(data) {
            $templateCache.put('dist/components/gjTimer/resultsPopover/resultsPopover.html', data);
            def.resolve(data);
          });
      } else {
        def.resolve(template);
      }
      return def.promise;
    };

    return {
      restrict: 'E',
      scope: {
        index: '=',
        result: '=',
        sessionId: '='
      },
      controller: 'ResultsPopoverController',
      controllerAs: 'ctrl',
      link: function (scope, element, attrs) {
        getTemplate().then(function(content) {
          scope.popoverDelay = 1; // just needs to be at least 1
          $rootScope.insidePopover = -1;
          $(element).popover({
            animation: false,
            content: content,
            html: true,
            placement: 'right',
            title: scope.result.detailedTime
          });
          $(element).bind('mouseenter', function () {
            scope.insideDiv = scope.index;
            $timeout(function() {
              $(element).popover('show');
              scope.attachEvents(element);
            }, scope.popoverDelay);
          });
          $(element).bind('mouseleave', function () {
            scope.insideDiv = -1;
            $timeout(function() {
              if ($rootScope.insidePopover !== scope.index)
                $(element).popover('hide');
            }, scope.popoverDelay);
          });
        });
      }
    };

  }

  angular.module('results').directive('resultsPopover', ['$rootScope', '$timeout', '$http', '$q', '$templateCache', 'ResultsService', resultsPopoverDirective]);

})();
(function() {

  'use strict';

  function ResultsPopoverController($scope, $rootScope, $timeout, ResultsPopoverService) {

    var self = this;

    $scope.attachEvents = function (element) {

      $('.popover').on('mouseenter', function () {
        $rootScope.insidePopover = $scope.index;
      }).on('mouseleave', function () {
        $rootScope.insidePopover = -1;
        $timeout(function() {
          if ($scope.insideDiv !== $scope.index) {
            $(element).popover('hide');
          }
        }, $scope.popoverDelay);
      });

      $('.popover-btn-penalty-ok').on('click', function() {
        ResultsPopoverService.penalty($scope.sessionId, $scope.index, '');
        $rootScope.$broadcast('refresh data', $scope.sessionId);
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-plus').on('click', function() {
        ResultsPopoverService.penalty($scope.sessionId, $scope.index, '+2');
        $rootScope.$broadcast('refresh data', $scope.sessionId);
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-dnf').on('click', function() {
        ResultsPopoverService.penalty($scope.sessionId, $scope.index, 'DNF');
        $rootScope.$broadcast('refresh data', $scope.sessionId);
        $(element).popover('hide');
      });

      $('.popover-btn-remove').on('click', function() {
        if (confirm('Are you sure you want to delete this time?')) {
          ResultsPopoverService.remove($scope.sessionId, $scope.index);
          $rootScope.$broadcast('refresh data', $scope.sessionId);
        }
        $(element).popover('hide');
      });

    };

  }

  angular.module('results').controller('ResultsPopoverController', ['$scope', '$rootScope', '$timeout', 'ResultsPopoverService', ResultsPopoverController]);

})();

(function() {

  'use strict';

  function ResultsPopoverService(LocalStorage) {

    var self = this;

    /**
     * Changes the penalty for a solve.
     * @param sessionId
     * @param index
     * @param penalty
     */
    self.penalty = function(sessionId, index, penalty) {
      var session = LocalStorage.getJSON(sessionId);
      var result = session.results[index];
      var pen = result.substring(result.indexOf('|') - 1, result.indexOf('|'));
      switch(penalty) {
        case '':
          if ((pen === '+') || (pen === '-')) {
            result = result.substring(0, result.indexOf('|') - 1) + result.substring(result.indexOf('|'), result.length);
          }
          break;
        case '+2':
          if ((pen === '+') || (pen === '-')) {
            result = result.substring(0, result.indexOf('|') - 1) + '+' + result.substring(result.indexOf('|'), result.length);
          } else {
            result = result.substring(0, result.indexOf('|')) + '+' + result.substring(result.indexOf('|'), result.length);
          }
          break;
        case 'DNF':
          if ((pen === '+') || (pen === '-')) {
            result = result.substring(0, result.indexOf('|') - 1) + '-' + result.substring(result.indexOf('|'), result.length);
          } else {
            result = result.substring(0, result.indexOf('|')) + '-' + result.substring(result.indexOf('|'), result.length);
          }
          break;
      }
      session.results[index] = result;
      LocalStorage.setJSON(sessionId, session);
    };

    /**
     * Removes a solve.
     * @param sessionId
     * @param index
     */
    self.remove = function(sessionId, index) {
      var session = JSON.parse(localStorage.getItem(sessionId));
      session.results.splice(index, 1);
      localStorage.setItem(sessionId, JSON.stringify(session));
    };

    /**
     * Adds or edits a comment for a solve.
     * @param sessionId
     * @param index
     * @param comment
     */
    self.comment = function(sessionId, index, comment) {
      console.log('comment ' + sessionId + ' - ' + index + ' - ' + comment);
    };

  }

  angular.module('results').service('ResultsPopoverService', ['LocalStorage', ResultsPopoverService]);

})();

(function() {

  'use strict';

  function scrambleDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/scramble/scramble.html',
      controller: 'ScrambleController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '=',
        scramble: '='
      }
    };
  }

  angular.module('scramble', []).directive('scramble', scrambleDirective);

})();

(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService, Events) {

    var self = this;

    $scope.$on('new scramble', function($event, eventId) {

      $scope.scramble = ScrambleService.getNewScramble(eventId);
      self.scramble = $sce.trustAsHtml($scope.scramble);
      self.scrambleStyle = Events.getEventStyle(eventId);
      $rootScope.$broadcast('draw scramble', eventId, ScrambleService.getScrambleState());

    });

  }

  angular.module('scramble').controller('ScrambleController', ['$scope', '$rootScope', '$sce', 'ScrambleService', 'Events', ScrambleController]);

})();

(function() {

  'use strict';

  function ScrambleService() {

    var self = this;

    /**
     * Gets the scramble state of the current scramble.
     * This is used by the cub component to draw the scramble.
     * @returns {string}
     */
    self.getScrambleState = function() {

      return self.scramble.state;

    };

    /**
     * Uses the jsss library to generate a new scramble for the event.
     * @param eventId
     * @returns {string}
     */
    self.getNewScramble = function(eventId) {

      self.scramble = scramblers[eventId].getRandomScramble();

      if (self.scramble.scramble_string.substring(self.scramble.scramble_string.length - 1, self.scramble.scramble_string.length) === ' ') {
        return self.scramble.scramble_string.substring(0, self.scramble.scramble_string.length - 1);
      } else {
        return self.scramble.scramble_string;
      }

    };

  }

  angular.module('scramble').service('ScrambleService', ScrambleService);

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
      templateUrl: 'dist/components/gjTimer/statistics/statistics.html',
      controller: 'StatisticsController',
      controllerAs: 'ctrl',
      scopeId: {
        event: '=',
        results: '='
      }
    };
  }

  angular.module('statistics', []).directive('statistics', statisticsDirective);

})();

(function() {

  'use strict';

  function StatisticsController($scope, StatisticsService, Events) {

    var self = this;

    self.event = Events.getEvent($scope.eventId);

    $scope.$watch('results', function() {
      self.statistics = StatisticsService.getStatistics($scope.results);
    });

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', 'StatisticsService', 'Events', StatisticsController]);

})();

(function() {

  'use strict';

  function StatisticsService(Calculator) {

    var self = this;

    self.getStatistics = function(results) {

      var best, rawTimes = Calculator.extractRawTimes(results);

      var statistics = {
        solves: {
          attempted: rawTimes.length,
          solved: Calculator.countNonDNFs(rawTimes),
          best: Calculator.convertTimeFromMillisecondsToString(Math.min.apply(null, rawTimes)),
          worst: Calculator.convertTimeFromMillisecondsToString(Math.max.apply(null, rawTimes))
        },
        sessionMean: {
          mean: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateSessionMean(rawTimes)),
          stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes, false))
        },
        sessionAvg: {
          avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes)),
          stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes, true))
        },
        averages: []
      };

      if (rawTimes.length >= 3) {
        best = Calculator.calculateBestMean(rawTimes, 3);
        statistics.averages.push({
          type: 'mo3',
          current: {
            avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateMean(rawTimes.slice(rawTimes.length - 3, rawTimes.length))),
            stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes.slice(rawTimes.length - 3, rawTimes.length), false))
          },
          best: {
            avg: Calculator.convertTimeFromMillisecondsToString(best.mean),
            stDev: Calculator.convertTimeFromMillisecondsToString(best.stDev)
          }
        });
      }

      var typesOfAverages = [5, 12, 50, 100];

      for (var i = 0; i < typesOfAverages.length; i++) {
        if (rawTimes.length >= typesOfAverages[i]) {
          best = Calculator.calculateBestAverage(rawTimes, typesOfAverages[i]);
          statistics.averages.push({
            type: 'avg' + typesOfAverages[i],
            current: {
              avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length))),
              stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length), true))
            },
            best: {
              avg: Calculator.convertTimeFromMillisecondsToString(best.avg),
              stDev: Calculator.convertTimeFromMillisecondsToString(best.stDev)
            }
          });
        }
      }

      return statistics;

    };
    
  }

  angular.module('statistics').service('StatisticsService', ['Calculator', StatisticsService]);

})();

(function() {

  'use strict';

  function timerDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/timer/timer.html',
      controller: 'TimerController',
      controllerAs: 'ctrl',
      scope: {
        eventId: '=',
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

    self.time = $scope.settings.timerPrecision === 2 ? moment(0).format('s.SS') : moment(0).format('s.SSS');

    var STYLES = {
      BLACK: { 'color': '#000000' },
      RED: { 'color': '#FF0000' },
      GREEN: { 'color': '#2EB82E' }
    };

    $scope.$on('keydown', function($event, event) {
      if ((state === 'reset') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
        state = 'keydown';
        self.time = $scope.settings.timerPrecision === 2 ? moment(0).format('s.SS') : moment(0).format('s.SSS');
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
        $rootScope.$broadcast('refresh data', $scope.sessionId);
        $rootScope.$broadcast('new scramble', $scope.eventId);
      }
    });

    $scope.$on('keyup', function($event, event) {
      self.timerStyle = STYLES.BLACK;
      if ((state === 'ready') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
        state = 'timing';
        TimerService.startTimer();
        timer = $interval(function() {
          self.time = TimerService.getTime($scope.settings.timerPrecision);
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

  function TimerService(LocalStorage, Calculator) {

    var self = this;

    /**
     * Gets the current time.
     * @param precision
     * @returns {string}
     */
    self.getTime = function(precision) {

      return Calculator.convertTimeFromMillisecondsToString(moment(Date.now() - self.startTime), precision);

    };

    /**
     * Starts the Timer.
     */
    self.startTimer = function() {

      self.startTime = Date.now();

    };

    /**
     * Saves the result in the format of 'Time in milliseconds'|'Scramble'|'Date in milliseconds'.
     * @param time
     * @param scramble
     * @param sessionId
     */
    self.saveResult = function(time, scramble, sessionId) {

      var session = LocalStorage.getJSON(sessionId);
      session.results.push(Calculator.convertTimeFromStringToMilliseconds(time) + '|' + scramble + '|' + Date.now());
      LocalStorage.setJSON(sessionId, session);

    };

  }

  angular.module('timer').service('TimerService', ['LocalStorage', 'Calculator', TimerService]);

})();
