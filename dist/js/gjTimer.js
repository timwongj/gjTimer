(function() {

  'use strict';

  function Config() {

  }

  function Run($http, $templateCache) {

    $http.get('dist/components/gjTimer/resultsPopover/resultsPopover.html')
      .success(function(template) {
        $templateCache.put('resultsPopover.html', template);
      });

  }

  angular.module('gjTimerApp', [
    // main angular modules

    // third-party (non-Angular modules)
    'ui.bootstrap', 'chart.js',
    // gjTimer
    'gjTimer'
  ]);

  angular.module('gjTimerApp').config(Config).run(['$http', '$templateCache', Run]);

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
  angular.module('gjTimer', ['gjTimer.services', 'gjTimer.filters', 'charts', 'cub', 'menuBar', 'results', 'scramble', 'statistics', 'timer']);

})();

(function() {

  'use strict';

  function GjTimerController($scope, $rootScope, Constants) {

    $rootScope.isTyping = false;
    $scope.style = {};

    $scope.keydown = function($event) {

      if (event.keyCode === Constants.KEY_CODES.ENTER) {
        if ($rootScope.isTypingComment) {
          event.preventDefault();
        } else if (!$rootScope.isTyping) {
          $rootScope.$broadcast('new scramble', $scope.eventId);
        }
      } else if (event.keyCode === Constants.KEY_CODES.SPACE_BAR) {
        event.preventDefault();
      }
      $rootScope.$broadcast('keydown', $event);

    };

    $scope.keyup = function($event) {

      $rootScope.$broadcast('keyup', $event);

    };

    $scope.$on('timer focus', function() {

      $scope.style.body = $scope.settings.backgroundColor;
      $scope.settings.backgroundColor = $scope.settings.panelColor;
      $scope.style.section = { 'display': 'none' };
      $scope.style.timer = { 'margin-top': '2.9375em' };

    });

    $scope.$on('timer unfocus', function() {

      if ($scope.style.body) {
        $scope.settings.backgroundColor = $scope.style.body;
      }
      $scope.style.section = { 'display': 'block' };
      $scope.style.timer = {};

    });

  }

  angular.module('gjTimer').controller('gjTimerController', ['$scope', '$rootScope', 'Constants', GjTimerController]);

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

  function Calculator(Constants) {

    var self = this;

    /**
     * Calculates the average of the results.
     * @param rawTimes
     * @param trimmed
     * @returns {number}
     */
    self.calculateAverage = function(rawTimes, trimmed) {

      var times = rawTimes.slice(0);

      // remove best and worst time
      if (trimmed) {
        times.splice(times.indexOf(Math.min.apply(null, times)), 1);
        times.splice(times.indexOf(Math.max.apply(null, times)), 1);
      }

      if ((times.indexOf(Constants.DNF) >= 0) || times.length === 0) {
        return Constants.DNF;
      } else {
        return Number((times.reduce(function(pv, cv) { return pv + cv; }, 0) / times.length).toFixed());
      }

    };

    /**
     * Calculates the average of the results.
     * @param rawTimes
     * @param trimmed
     * @param precision
     * @returns {string}
     */
    self.calculateAverageString = function(rawTimes, trimmed, precision) {

      return self.convertTimeFromMillisecondsToString(self.calculateAverage(rawTimes, trimmed), precision);

    };

    /**
     * Calculate the standard deviation.
     * @param rawTimes
     * @param trimmed
     * @returns {number}
     */
    self.calculateStandardDeviation = function(rawTimes, trimmed) {

      var times = rawTimes.slice(0);

      // remove best and worst time
      if (trimmed) {
        times.splice(times.indexOf(Math.min.apply(null, times)), 1);
        times.splice(times.indexOf(Math.max.apply(null, times)), 1);
      }

      if ((times.indexOf(Constants.DNF) >= 0) || times.length === 0) {
        return Constants.DNF;
      } else {
        var avg = self.calculateAverage(times, false);
        var squareDiffs = times.map(function(time) { return Math.pow(time - avg, 2); });
        return Number(Math.sqrt(self.calculateAverage(squareDiffs, false)).toFixed());
      }

    };

    /**
     * Calculate the standard deviation.
     * @param rawTimes
     * @param trimmed
     * @param precision
     * @returns {string}
     */
    self.calculateStandardDeviationString = function(rawTimes, trimmed, precision) {

      return self.convertTimeFromMillisecondsToString(self.calculateStandardDeviation(rawTimes, trimmed), precision);

    };

    /**
     * Calculates the mean of the results ignoring the DNFs.
     * @param rawTimes
     * @param precision
     * @returns {string}
     */
    self.calculateSessionMeanAndStandardDeviationString = function(rawTimes, precision) {

      // remove DNFs
      var times = rawTimes.slice(0).filter(function(time) { return time !== Constants.DNF; });

      return {
        mean: self.calculateAverageString(times, false, precision),
        stDev: self.calculateStandardDeviationString(times, false, precision)
      };

    };

    /**
     * Calculate the best avg, stDev, index
     * @param rawTimes
     * @param trimmed
     * @param n
     * @param precision
     * @returns {{index: number, avg: number, stDev: number}}
     */
    self.calculateBestAverageAndStandardDeviationString = function(rawTimes, trimmed, n, precision) {

      var currentAvg, bestAvg = Constants.DNF, index = -1;

      for (var i = 0; i <= rawTimes.length - n; i++) {
        currentAvg = self.calculateAverage(rawTimes.slice(i, i + n), trimmed);
        if (currentAvg < bestAvg) {
          bestAvg = currentAvg;
          index = i;
        }
      }

      return {
        index: index,
        avg: self.convertTimeFromMillisecondsToString(bestAvg, precision),
        stDev: self.calculateStandardDeviationString(rawTimes.slice(index, index + n), trimmed, precision)
      };

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

      return rawTimes.slice(0).filter(function(time) { return time !== Constants.DNF; }).length;

    };

    /**
     * Converts time from string to milliseconds.
     * @param timeString
     * @returns {number} - timeMilliseconds
     */
    self.convertTimeFromStringToMilliseconds = function(timeString) {

      if (timeString === 'DNF') {
        return Constants.DNF;
      }

      var res = timeString.split(':');

      if (res.length === 1) {
        return Number((parseFloat(res[0]) * 1000).toFixed());
      } else if (res.length === 2) {
        return Number(((parseFloat(res[0]) * 60 * 1000) + (parseFloat(res[1]) * 1000)).toFixed());
      } else if (res.length === 3) {
        return Number(((parseFloat(res[0]) * 60 * 60 * 1000) + (parseFloat(res[1]) * 60 * 1000) + (parseFloat(res[2]) * 1000)).toFixed());
      } else {
        return Constants.DNF;
      }

    };

    /**
     * Converts time from milliseconds to string.
     * @param timeMilliseconds
     * @param precision
     * @returns {string} - timeString
     */
    self.convertTimeFromMillisecondsToString = function(timeMilliseconds, precision) {

      if ((timeMilliseconds === Constants.DNF) || (timeMilliseconds < 0) || (timeMilliseconds === Infinity)) {
        return 'DNF';
      }

      var ms, time = moment(timeMilliseconds);

      switch(precision) {
        case 0: ms = ''; break;
        case 1: ms = '.S'; break;
        case 2: ms = '.SS'; break;
        case 3: ms = '.SSS'; break;
        default: ms = '.SS'; break;
      }

      if (timeMilliseconds < 10000) {
        return time.format('s' + ms);
      } else if (timeMilliseconds < 60000) {
        return time.format('ss' + ms);
      } else if (timeMilliseconds < 3600000) {
        return time.format('m:ss' + ms);
      } else {
        return time.utc().format('H:mm:ss' + ms);
      }

    };

  }

  angular.module('gjTimer.services').service('Calculator', ['Constants', Calculator]);

})();

(function() {

  'use strict';

  function Constants() {

    var self = this;

    self.DNF = 864000000;

    self.KEY_CODES = {
      ENTER: 13,
      ESCAPE: 27,
      SPACE_BAR: 32
    };

    self.COLORS = {
      BLACK: '#000000',
      RED: '#FF0000',
      ORANGE: '#FFA500',
      GREEN: '#2EB82E',
      BLUE: '#0000FF',
      GRAY: '#EEEEEE',
      WHITE: '#FFFFFF'
    };

    self.STYLES = {
      COLOR: {
        BLACK: { 'color': self.COLORS.BLACK },
        RED: { 'color': self.COLORS.RED },
        ORANGE: { 'color': self.COLORS.ORANGE },
        GREEN: { 'color': self.COLORS.GREEN },
        BLUE: { 'color': self.COLORS.BLUE }
      },
      BACKGROUND_COLOR: {
        GRAY: { 'background-color': self.COLORS.GRAY },
        WHITE: { 'background-color': self.COLORS.WHITE }
      }
    };

    self.SESSIONS = {
      DEFAULT_NUMBER_OF_SESSIONS: 15
    };

    var colorOptions = [
      { value: { 'background-color': '#FFFFFF'} }, // white
      { value: { 'background-color': '#EEEEEE'} }, // grey
      { value: { 'background-color': '#FFE5EE'} }, // pink
      { value: { 'background-color': '#FFCCCC'} }, // red
      { value: { 'background-color': '#FFE8D2'} }, // orange
      { value: { 'background-color': '#FFFFCC'} }, // yellow
      { value: { 'background-color': '#D7FFD7'} }, // green
      { value: { 'background-color': '#E5F5FF'} }, // blue
      { value: { 'background-color': '#FFE5FF'} }, // purple
      { value: { 'background-color': '#F1E3D4'} } // brown
    ];

    self.DEFAULT_SETTINGS = {
      input: 'Timer',
      inspection: false,
      bldMode: false,
      timerPrecision: 3,
      timerStartDelay: 0,
      timerRefreshInterval: 50,
      showScramble: true,
      showCharts: true,
      saveScramble: true,
      resultsPrecision: 2,
      statisticsPrecision: 3,
      panelColor: { 'background-color': '#EEEEEE'},
      backgroundColor: { 'background-color': '#FFFFFF'}
    };

    self.SETTINGS = [
      {
        id: 'input',
        title: 'Input',
        options: [
          { value: 'Timer', text: 'Timer' },
          { value: 'Typing', text: 'Typing'}
        ]
      }, {
        id: 'inspection',
        title: 'Inspection',
        options: [
          { value: true, text: 'On' },
          { value: false, text: 'Off' }
        ]
      }, { id: 'bldMode',
        title: 'BLD Mode',
        options: [
          { value: true, text: 'On' },
          { value: false, text: 'Off' }
        ]
      }, { id: 'timerPrecision',
        title: 'Timer Precision',
        options: [
          { value: 0, text: '0' },
          { value: 1, text: '0.1' },
          { value: 2, text: '0.01' },
          { value: 3, text: '0.001' }
        ]
      }, { id: 'timerStartDelay',
        title: 'Timer Start Delay',
        options: [
          { value: 0, text: '0' },
          { value: 100, text: '0.1' },
          { value: 500, text: '0.5' },
          { value: 1000, text: '1' }
        ]
      }, { id: 'timerRefreshInterval',
        title: 'Timer Refresh',
        options: [
          { value: 50, text: '0.05' },
          { value: 100, text: '0.1' }
        ]
      }, { id: 'showScramble',
        title: 'Show Scramble',
        options: [
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
        ]
      }, { id: 'showCharts',
        title: 'Show Charts',
        options: [
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
        ]
      }, { id: 'saveScramble',
        title: 'Save Scramble',
        options: [
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
        ]
      }, { id: 'resultsPrecision',
        title: 'Results Precision',
        options: [
          { value: 2, text: '0.01' },
          { value: 3, text: '0.001' }
        ]
      }, {
        id: 'statisticsPrecision',
        title: 'Stats Precision',
        options: [
          { value: 2, text: '0.01' },
          { value: 3, text: '0.001' }
        ]
      }, {
        id: 'panelColor',
        title: 'Panel Color',
        options: colorOptions
      }, {
        id: 'backgroundColor',
        title: 'Background Color',
        options: colorOptions
      }
    ];

  }

  angular.module('gjTimer.services').service('Constants', Constants);

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

  function chartsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/charts/charts.html',
      controller: 'ChartsController',
      controllerAs: 'ctrl',
      scope: {
        results: '=',
        settings: '='
      },
      bindToController: true
    };
  }

  angular.module('charts', []).directive('charts', chartsDirective);

})();

(function() {

  'use strict';

  function ChartsController($scope, ChartsService) {

    var self = this;

    var lineChart, barChart;

    ChartsService.setChartDefaults();

    lineChart = ChartsService.initLineChartData(self.results);
    barChart = ChartsService.initBarChartData(self.results);

    $scope.$on('new result', function($event, result) {

      lineChart =  ChartsService.addLineChartData(lineChart, result);
      barChart = ChartsService.addBarChartData(barChart, result);
      self.updateCharts();

    });

    $scope.$on('refresh results', function() {

      lineChart = ChartsService.initLineChartData(self.results);
      barChart = ChartsService.initBarChartData(self.results);
      self.updateCharts();

    });

    self.updateCharts = function() {

      self.lineChartSeries = lineChart.series;
      self.lineChartLabels = lineChart.labels;
      self.lineChartData = lineChart.data;

      self.barChartLabels = barChart.labels;
      self.barChartData = barChart.data;

    };

    self.updateCharts();

  }

  angular.module('charts').controller('ChartsController', ['$scope', 'ChartsService', ChartsController]);

})();

(function() {

  'use strict';

  function ChartsService(Calculator, Constants) {

    var self = this;

    /**
     * Convert results to line chart data
     * @param results
     * @returns {{series: string[], labels: Array, data: *[]}}
     */
    self.initLineChartData = function(results) {

      var labels = [], data = [ [], [], []], single, avg5, avg12;

      for (var i = 0; i < results.length; i++) {
        labels.push(results[i].index + 1);
        single = results[i].rawTime;
        avg5 = Calculator.convertTimeFromStringToMilliseconds(results[i].avg5);
        avg12 = Calculator.convertTimeFromStringToMilliseconds(results[i].avg12);
        data[0].push(single !== Constants.DNF ? Number((single / 1000).toFixed(2)) : null);
        data[1].push(avg5 !== Constants.DNF ? avg5 / 1000 : null);
        data[2].push(avg12 !== Constants.DNF ? avg12 / 1000 : null);
      }

      return {
        series: ['Time', 'Avg 5', 'Avg 12'],
        labels: labels,
        data: data
      };

    };

    /**
     * Convert results to bar chart data
     * @param results
     * @returns {{labels: Array, data: *[]}}
     */
    self.initBarChartData = function(results) {

      var rawTimes, flooredTime, distribution = {}, labels = [], data = [];

      rawTimes = Calculator.extractRawTimes(results);

      for (var i = 0; i < rawTimes.length; i++) {
        if (rawTimes[i] !== Constants.DNF) {
          flooredTime = Math.floor(rawTimes[i] / 1000);
          if (!distribution.hasOwnProperty(flooredTime)) {
            distribution[flooredTime] = 1;
          } else {
            distribution[flooredTime] += 1;
          }
        }
      }

      for (var key in distribution) {
        if (distribution.hasOwnProperty(key)) {
          labels.push(key);
          data.push(distribution[key]);
        }
      }

      return {
        labels: labels,
        data: [data]
      };

    };

    /**
     * Adds result to the line chart data.
     * @param lineChart
     * @param result
     * @returns {*}
     */
    self.addLineChartData = function(lineChart, result) {

      var single, avg5, avg12;

      lineChart.labels.push(result.index + 1);
      single = result.rawTime;
      avg5 = Calculator.convertTimeFromStringToMilliseconds(result.avg5);
      avg12 = Calculator.convertTimeFromStringToMilliseconds(result.avg12);
      lineChart.data[0].push(single !== Constants.DNF ? Number((single / 1000).toFixed(2)) : null);
      lineChart.data[1].push(avg5 !== Constants.DNF ? avg5 / 1000 : null);
      lineChart.data[2].push(avg12 !== Constants.DNF ? avg12 / 1000 : null);

      return lineChart;

    };

    /**
     * Adds result to the bar chart data.
     * @param barChart
     * @param result
     * @returns {{labels: Array, data: *[]}}
     */
    self.addBarChartData = function(barChart, result) {

      var rawTime, flooredTime, distribution = {}, labels = [], data = [];

      rawTime = Calculator.extractRawTimes([result])[0];

      if (rawTime !== Constants.DNF) {
        flooredTime = Math.floor(rawTime / 1000);
        for (var i = 0; i < barChart.labels.length; i++) {
          distribution[barChart.labels[i]] = barChart.data[0][i];
        }
        if (!distribution.hasOwnProperty(flooredTime)) {
          distribution[flooredTime] = 1;
        } else {
          distribution[flooredTime] += 1;
        }
      }

      for (var key in distribution) {
        if (distribution.hasOwnProperty(key)) {
          labels.push(key);
          data.push(distribution[key]);
        }
      }

      return {
        labels: labels,
        data: [data]
      };

    };

    /**
     * Set chart defaults.
     */
    self.setChartDefaults = function() {

      Chart.defaults.global.animation = false;
      Chart.defaults.global.colours = ['#4D5360', '#46BFBD', '#FDB45C'];
      Chart.defaults.global.tooltipCornerRadius = 2;
      Chart.defaults.global.tooltipFontSize = 12;
      Chart.defaults.global.tooltipTitleFontSize = 12;
      Chart.defaults.Line.bezierCurve = false;
      Chart.defaults.Line.datasetStrokeWidth = 1;
      Chart.defaults.Line.pointDotRadius = 0;
      Chart.defaults.Line.pointHitDetectionRadius = 1;

    };


  }

  angular.module('charts').service('ChartsService', ['Calculator', 'Constants', ChartsService]);

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
        settings: '='
      },
      bindToController: true
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
        results: '=',
        sessionId: '=',
        settings: '='
      },
      bindToController: true
    };
  }

  angular.module('menuBar', []).directive('menuBar', menuBarDirective);

})();

(function() {

  'use strict';

  function MenuBarController($scope, $rootScope, $timeout, $uibModal, MenuBarService, Events) {

    var self = this;

    self.settings = MenuBarService.initSettings();
    self.sessions = MenuBarService.initSessions();
    self.session = MenuBarService.initSession();
    self.events = Events.getEvents();
    self.event = { eventId: self.session.eventId, event: Events.getEvent(self.session.eventId) };
    self.sessionId = self.session.sessionId;
    self.eventId = self.session.eventId;

    self.showDetails = window.innerWidth > 500;
    $(window).resize(function(){
      self.showDetails = window.innerWidth > 500;
      $scope.$apply();
    });

    // TODO - find a better solution to waiting for controllers to initialize before broadcasting
    // The cutoff for successful broadcast is ~15-20ms, so 50 should be sufficient for now.
    $timeout(function() {
      $rootScope.$broadcast('new scramble', self.eventId);
    }, 50);

    self.changeSession = function(sessionId) {
      self.session = MenuBarService.changeSession(sessionId);
      self.sessionId = sessionId;
      self.eventId = self.session.eventId;
      $rootScope.$broadcast('refresh results', sessionId);
      if (self.event.eventId !== self.session.eventId) {
        $rootScope.$broadcast('new scramble', self.eventId);
      }
      self.event = { eventId: self.eventId, event: Events.getEvent(self.eventId) };
    };

    self.changeEvent = function(event) {
      self.eventId = MenuBarService.changeEvent(self.sessionId, Events.getEventId(event));
      self.session.eventId = self.eventId;
      self.event = { eventId: self.eventId, event: Events.getEvent(self.eventId) };
      $rootScope.$broadcast('new scramble', self.eventId);
    };

    self.openSettings = function() {
      $uibModal.open({
        animation: true,
        templateUrl: 'dist/components/gjTimer/settings/settings.html',
        controller: 'SettingsController',
        controllerAs: 'ctrl',
        size: 'md',
        resolve: {
          settings: function () {
            return self.settings;
          }
        }
      });
    };

    self.resetSession = function() {
      if (confirm('Are you sure you want to reset ' + self.sessionId + '?')) {
        MenuBarService.resetSession(self.sessionId);
        self.session.results = [];
        self.results = [];
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$scope', '$rootScope', '$timeout', '$uibModal', 'MenuBarService', 'Events', MenuBarController]);

})();

(function() {

  'use strict';

  function MenuBarService(LocalStorage, Constants) {

    var self = this;

    /**
     * Gets settings from local storage or initializes it if it doesn't exist.
     * @returns {*}
     */
    self.initSettings = function() {
      var settings = LocalStorage.getJSON('settings');
      if (settings === null) {
        LocalStorage.setJSON('settings', Constants.DEFAULT_SETTINGS);
        return Constants.DEFAULT_SETTINGS;
      } else {
        for (var key in Constants.DEFAULT_SETTINGS) {
          if (Constants.DEFAULT_SETTINGS.hasOwnProperty(key)) {
            if (!settings.hasOwnProperty(key)) {
              settings[key] = Constants.DEFAULT_SETTINGS[key];
              LocalStorage.setJSON('settings', settings);
            }
          }
        }
        return settings;
      }
    };

    /**
     * Saves settings.
     * @param settings
     */
    self.saveSettings = function(settings) {
      LocalStorage.setJSON('settings', settings);
    };

    /**
     * Reset settings.
     * @returns {*}
     */
    self.resetSettings = function() {
      LocalStorage.setJSON('settings', Constants.DEFAULT_SETTINGS);
      return Constants.DEFAULT_SETTINGS;
    };

    /**
     * Initializes sessions in local storage if they do not exist.
     * @returns [String] - sessionId
     */
    self.initSessions = function() {

      var sessions = [];

      for (var i = 1; i <= Constants.SESSIONS.DEFAULT_NUMBER_OF_SESSIONS; i++) {
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
     */
    self.resetSession = function(sessionId) {

      var session = LocalStorage.getJSON(sessionId);
      session.results = [];
      LocalStorage.setJSON(sessionId, session);

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

    /**
     * Resets everything.
     */
    self.resetAll = function() {
      LocalStorage.clear();
    };

  }

  angular.module('menuBar').service('MenuBarService', ['LocalStorage', 'Constants', MenuBarService]);

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
      },
      bindToController: true
    };
  }

  angular.module('results', []).directive('results', resultsDirective);

})();

(function() {

  'use strict';

  function ResultsController($scope, $uibModal, ResultsService) {

    var self = this;

    self.results = ResultsService.getResults(self.sessionId, self.settings.resultsPrecision);

    $scope.$on('refresh results', function($event, sessionId) {
      self.results = ResultsService.getResults(sessionId || self.sessionId, self.settings.resultsPrecision);
    });

    self.openModal = function(index, numberOfResults) {
      if (index >= numberOfResults) {
        $uibModal.open({
          animation: true,
          templateUrl: 'dist/components/gjTimer/resultsModal/resultsModal.html',
          controller: 'ResultsModalController',
          controllerAs: 'ctrl',
          size: 'lg',
          resolve: {
            results: function () {
              return self.results.slice(index - numberOfResults, index);
            },
            precision: function() {
              return self.settings.resultsPrecision;
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

  function ResultsService(LocalStorage, Calculator, Constants) {

    var self = this;

    var DNF = Constants.DNF;

    /**
     * Gets results for the session.
     * @param sessionId
     * @param precision
     */
    self.getResults = function(sessionId, precision) {

      var results = [], rawResults = LocalStorage.getJSON(sessionId).results;

      for (var i = 0; i < rawResults.length; i++) {

        var res = rawResults[i].split('|');

        var result = {
          index: i,
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
          result.detailedTime = result.displayedTime;
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
          result.detailedTime = result.displayedTime;
        }

        results.push(result);
        
      }

      var rawTimes = Calculator.extractRawTimes(results);

      for (var j = 0; j < results.length; j++) {
        results[j] = self.populateAverages(rawTimes, results[j], j, precision);
      }

      return results;

    };

    /**
     * Saves the result in the format of 'Time in milliseconds'|'Scramble'|'Date in milliseconds'.
     * @param results
     * @param time
     * @param penalty
     * @param comment
     * @param scramble
     * @param sessionId
     * @param precision
     * @param saveScramble
     * @returns {{comment: *, date: Date, detailedTime: string, displayedTime: string, index: *, penalty: *, rawTime: number, scramble: *, time: number}}
     */
    self.saveResult = function(results, time, penalty, comment, scramble, sessionId, precision, saveScramble) {

      var timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(time);
      var timeStringWithPrecision = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);

      var result = {
        comment: comment,
        date: new Date(),
        detailedTime: timeStringWithPrecision,
        displayedTime: timeStringWithPrecision,
        index: results.length,
        penalty: penalty,
        rawTime: timeMilliseconds,
        scramble: scramble,
        time: timeMilliseconds
      };

      var rawTimes = Calculator.extractRawTimes(results);
      rawTimes.push(Calculator.extractRawTimes([result])[0]);
      result = self.populateAverages(rawTimes, result, result.index, precision);

      var timeString = Calculator.convertTimeFromStringToMilliseconds(time);
      switch(penalty) {
        case '+2':
          result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Calculator.convertTimeFromStringToMilliseconds(time) + 2000, precision) + '+';
          result.detailedTime = result.displayedTime;
          timeString += '+';
          break;
        case 'DNF':
          result.displayedTime = 'DNF';
          result.detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(Calculator.convertTimeFromStringToMilliseconds(time), precision) + ')';
          timeString += '-';
          break;
      }

      results.push(result);

      var session = LocalStorage.getJSON(sessionId);
      session.results.push(timeString + '|' + (saveScramble ? scramble : '') + '|' + Date.now() + (comment !== '' ? '|' + comment : ''));
      LocalStorage.setJSON(sessionId, session);

      return result;

    };

    /**
     * Populate avg5 and avg12 field
     * @param rawTimes
     * @param result
     * @param index
     * @param precision
     */
    self.populateAverages = function(rawTimes, result, index, precision) {

      if (index >= 4) {
        result.avg5 = Calculator.calculateAverageString(rawTimes.slice(index - 4, index + 1), true, precision);
      } else {
        result.avg5 = 'DNF';
      }

      if (index >= 11) {
        result.avg12 = Calculator.calculateAverageString(rawTimes.slice(index - 11, index + 1), true, precision);
      } else {
        result.avg12 = 'DNF';
      }

      return result;

    };

    /**
     * Changes the penalty for a solve.
     * @param result
     * @param sessionId
     * @param index
     * @param penalty
     * @param precision
     */
    self.penalty = function(result, sessionId, index, penalty, precision) {

      var session = LocalStorage.getJSON(sessionId);
      var res = session.results[index];
      var pen = res.substring(res.indexOf('|') - 1, res.indexOf('|'));
      switch(penalty) {
        case '':
          result.penalty = '';
          result.rawTime = result.time;
          result.displayedTime = Calculator.convertTimeFromMillisecondsToString(result.time, precision);
          result.detailedTime = result.displayedTime;
          if ((pen === '+') || (pen === '-')) {
            res = res.substring(0, res.indexOf('|') - 1) + res.substring(res.indexOf('|'), res.length);
          }
          break;
        case '+2':
          result.penalty = '+2';
          result.rawTime = result.time + 2000;
          result.displayedTime = Calculator.convertTimeFromMillisecondsToString(result.time + 2000, precision) + '+';
          result.detailedTime = result.displayedTime;
          if ((pen === '+') || (pen === '-')) {
            res = res.substring(0, res.indexOf('|') - 1) + '+' + res.substring(res.indexOf('|'), res.length);
          } else {
            res = res.substring(0, res.indexOf('|')) + '+' + res.substring(res.indexOf('|'), res.length);
          }
          break;
        case 'DNF':
          result.penalty = 'DNF';
          result.rawTime = Constants.DNF;
          result.displayedTime = 'DNF';
          result.detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(result.time, precision) + ')';
          if ((pen === '+') || (pen === '-')) {
            res = res.substring(0, res.indexOf('|') - 1) + '-' + res.substring(res.indexOf('|'), res.length);
          } else {
            res = res.substring(0, res.indexOf('|')) + '-' + res.substring(res.indexOf('|'), res.length);
          }
          break;
      }
      session.results[index] = res;
      LocalStorage.setJSON(sessionId, session);

    };

    /**
     * Removes a solve.
     * @param results
     * @param sessionId
     * @param index
     */
    self.remove = function(results, sessionId, index) {

      results.splice(index, 1);
      var session = LocalStorage.getJSON(sessionId);
      session.results.splice(index, 1);
      LocalStorage.setJSON(sessionId, session);

    };

    /**
     * Adds or edits a comment for a solve.
     * @param result
     * @param sessionId
     * @param index
     * @param comment
     */
    self.comment = function(result, sessionId, index, comment) {

      result.comment = comment;
      var session = LocalStorage.getJSON(sessionId);
      var res = session.results[index].split('|');
      if (comment !== '') {
        if (res[3]) {
          res[3] = comment;
          session.results[index] = res.join('|');
        } else {
          session.results[index] = session.results[index] + '|' + comment;
        }
      } else if (res[3]) {
        res.splice(3, 1);
        session.results[index] = res.join('|');
      }
      LocalStorage.setJSON(sessionId, session);

    };

  }

  angular.module('results').service('ResultsService', ['LocalStorage', 'Calculator', 'Constants', ResultsService]);

})();

(function() {

  'use strict';

  function ResultsModalController($modalInstance, results, precision, ResultsModalService) {

    var self = this;

    self.results = ResultsModalService.getModalResults(results, precision);

    self.type = results.length === 3 ? 'mean' : 'average';

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('results').controller('ResultsModalController', ['$modalInstance', 'results', 'precision', 'ResultsModalService', ResultsModalController]);

})();

(function() {

  'use strict';

  function ResultsModalService(Calculator) {

    var self = this;

    /**
     * Get results for the results modal.
     * @param results
     * @param precision
     * @returns [Object] - results
     */
    self.getModalResults = function(results, precision) {

      var rawTimes = Calculator.extractRawTimes(results);

      if(rawTimes.length !== 3) {
        results[rawTimes.indexOf(Math.min.apply(null, rawTimes))].min = true;
        results[rawTimes.indexOf(Math.max.apply(null, rawTimes))].max = true;
      }

      return {
        results: results,
        avg: Calculator.calculateAverageString(rawTimes, rawTimes.length !== 3, precision),
        stDev: Calculator.calculateStandardDeviationString(rawTimes, rawTimes.length !== 3, precision)
      };

    };

  }

  angular.module('results').service('ResultsModalService', ['Calculator', ResultsModalService]);

})();

(function() {

  'use strict';

  function resultsPopoverDirective($rootScope, $timeout, $templateCache) {

    return {
      restrict: 'E',
      scope: {
        index: '=',
        precision: '=',
        result: '=',
        results: '=',
        sessionId: '='
      },
      controller: 'ResultsPopoverController',
      controllerAs: 'ctrl',
      bindToController: true,
      link: link
    };

    function link (scope, element) {
      $rootScope.insidePopover = -1;
      $(element).popover({
        animation: false,
        content: $templateCache.get('resultsPopover.html'),
        html: true,
        placement: 'right',
        title: scope.ctrl.result.detailedTime
      });
      $(element).bind('mouseenter', function () {
        scope.ctrl.insideDiv = scope.ctrl.index;
        $timeout(function() {
          $(element).popover('show');
          scope.ctrl.attachEvents(element);
        }, 1);
      });
      $(element).bind('mouseleave', function () {
        scope.ctrl.insideDiv = -1;
        $timeout(function() {
          if ($rootScope.insidePopover !== scope.ctrl.index)
            $(element).popover('hide');
        }, 1);
      });
    }

  }

  angular.module('results').directive('resultsPopover', ['$rootScope', '$timeout', '$templateCache', resultsPopoverDirective]);

})();
(function() {

  'use strict';

  function ResultsPopoverController($scope, $rootScope, $timeout, ResultsService, Constants) {

    var self = this;

    self.attachEvents = function (element) {

      $('.popover').on('mouseenter', function () {
        $rootScope.insidePopover = self.index;
      }).on('mouseleave', function () {
        $rootScope.insidePopover = -1;
        $timeout(function() {
          if (self.insideDiv !== self.index) {
            $(element).popover('hide');
          }
        }, 1);
      });

      $('.popover-btn-penalty-ok').on('click', function() {
        ResultsService.penalty(self.result, self.sessionId, self.index, '', self.precision);
        $scope.$apply();
        $rootScope.$broadcast('refresh results');
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-plus').on('click', function() {
        ResultsService.penalty(self.result, self.sessionId, self.index, '+2', self.precision);
        $scope.$apply();
        $rootScope.$broadcast('refresh results');
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-dnf').on('click', function() {
        ResultsService.penalty(self.result, self.sessionId, self.index, 'DNF', self.precision);
        $scope.$apply();
        $rootScope.$broadcast('refresh results');
        $(element).popover('hide');
      });

      $('.popover-btn-remove').on('click', function() {
        if (confirm('Are you sure you want to delete this time?')) {
          ResultsService.remove(self.results, self.sessionId, self.index);
          $scope.$apply();
          $rootScope.$broadcast('refresh results');
          $(element).popover('hide');
        }
      });

      $('.popover-input-comment').on('focus', function() {
        $rootScope.isTypingComment = true;
      }).on('blur', function() {
        $timeout(function() {
          $rootScope.isTypingComment = false;
        }, 1);
      }).on('keydown', function(event) {
        if (event.keyCode === Constants.KEY_CODES.ENTER) {
          ResultsService.comment(self.result, self.sessionId, self.index, $('.popover-input-comment')[0].value);
          $scope.$apply();
          $(element).popover('hide');
        }
      })[0].value = self.result.comment;

    };

  }

  angular.module('results').controller('ResultsPopoverController', ['$scope', '$rootScope', '$timeout', 'ResultsService', 'Constants', ResultsPopoverController]);

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
      },
      bindToController: true
    };
  }

  angular.module('scramble', []).directive('scramble', scrambleDirective);

})();

(function() {

  'use strict';

  function ScrambleController($scope, $rootScope, $sce, ScrambleService, Events) {

    var self = this;

    $scope.$on('new scramble', function($event, eventId) {

      self.scramble = ScrambleService.getNewScramble(eventId);
      self.displayedScramble = $sce.trustAsHtml(self.scramble);
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

  function SettingsController($scope, $rootScope, $modalInstance, settings, MenuBarService, Constants) {

    var self = this;

    self.settings = Constants.SETTINGS;
    for (var i = 0; i < self.settings.length; i++) {
      self.settings[i].value = settings[self.settings[i].id];
    }

    $scope.$on('keydown', function($event, event) {
      switch(event.keyCode) {
        case Constants.KEY_CODES.ENTER:
          self.save();
          break;
        case Constants.KEY_CODES.ESCAPE:
          self.close();
          break;
      }
    });

    self.save = function() {
      for (var i = 0; i < self.settings.length; i++) {
        settings[self.settings[i].id] = self.settings[i].value;
      }
      MenuBarService.saveSettings(settings);
      $modalInstance.dismiss();
      $rootScope.$broadcast('refresh settings');
      $rootScope.$broadcast('refresh results');
    };

    self.resetSettings = function() {
      if (confirm('Are you sure you want to reset all settings?')) {
        settings = MenuBarService.resetSettings();
        $rootScope.$broadcast('refresh settings');
        $modalInstance.dismiss();
      }
    };

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('menuBar').controller('SettingsController', ['$scope', '$rootScope', '$modalInstance', 'settings', 'MenuBarService', 'Constants', SettingsController]);

})();

(function() {

  'use strict';

  function statisticsDirective() {
    return {
      restrict: 'E',
      templateUrl: 'dist/components/gjTimer/statistics/statistics.html',
      controller: 'StatisticsController',
      controllerAs: 'ctrl',
      scope: {
        results: '=',
        settings: '='
      },
      bindToController: true
    };
  }

  angular.module('statistics', []).directive('statistics', statisticsDirective);

})();

(function() {

  'use strict';

  function StatisticsController($scope, $uibModal, StatisticsService) {

    var self = this;

    $scope.$watchCollection(function() {
      return self.results;
    }, function() {
      self.statistics = StatisticsService.getStatistics(self.results, self.settings.statisticsPrecision);
    });

    self.openModal = function(format, $index) {
      var length = self.statistics.averages[$index].length;
      var index = format === 'best' ? self.statistics.averages[$index].best.index : self.results.length - length;
      $uibModal.open({
        animation: true,
        templateUrl: 'dist/components/gjTimer/resultsModal/resultsModal.html',
        controller: 'ResultsModalController',
        controllerAs: 'ctrl',
        size: 'lg',
        resolve: {
          results: function() {
            return self.results.slice(index, index + length);
          },
          precision: function() {
            return self.settings.resultsPrecision;
          }
        }
      });
    };

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', '$uibModal', 'StatisticsService', StatisticsController]);

})();

(function() {

  'use strict';

  function StatisticsService(Calculator) {

    var self = this;

    /**
     * Get statistics.
     * @param results
     * @param precision
     * @returns {{solves: {attempted: number, solved: number, best: string, worst: string}, sessionMean: ({mean, stDev}|string), sessionAvg: {avg: string, stDev: string}, averages: Array}}
     */
    self.getStatistics = function(results, precision) {

      var rawTimes = Calculator.extractRawTimes(results);

      var statistics = {
        solves: {
          attempted: rawTimes.length,
          solved: Calculator.countNonDNFs(rawTimes),
          best: Calculator.convertTimeFromMillisecondsToString(Math.min.apply(null, rawTimes), precision),
          worst: Calculator.convertTimeFromMillisecondsToString(Math.max.apply(null, rawTimes), precision)
        },
        sessionMean: Calculator.calculateSessionMeanAndStandardDeviationString(rawTimes, precision),
        sessionAvg: {
          avg: Calculator.calculateAverageString(rawTimes, true, precision),
          stDev: Calculator.calculateStandardDeviationString(rawTimes, true, precision)
        },
        averages: []
      };

      if (rawTimes.length >= 3) {
        statistics.averages.push({
          type: 'm',
          length: 3,
          current: {
            avg: Calculator.calculateAverageString(rawTimes.slice(rawTimes.length - 3, rawTimes.length), false, precision),
            stDev: Calculator.calculateStandardDeviationString(rawTimes.slice(rawTimes.length - 3, rawTimes.length), false, precision)
          },
          best: Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, false, 3, precision)
        });
      }

      var typesOfAverages = [5, 12, 50, 100];

      for (var i = 0; i < typesOfAverages.length; i++) {
        if (rawTimes.length >= typesOfAverages[i]) {
          statistics.averages.push({
            type: 'a',
            length: typesOfAverages[i],
            current: {
              avg: Calculator.calculateAverageString(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length), true, precision),
              stDev: Calculator.calculateStandardDeviationString(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length), true, precision)
            },
            best: Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, true, typesOfAverages[i], precision)
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
        results: '=',
        scramble: '=',
        sessionId: '=',
        settings: '='
      },
      bindToController: true
    };
  }

  angular.module('timer', []).directive('timer', timerDirective);

})();

(function() {

  'use strict';

  function TimerController($scope, $rootScope, $interval, $timeout, TimerService, ResultsService, Constants) {

    var self = this;

    var timer, inspection, state = 'reset', penalty = '', comment = '', memo = '', result, precision = self.settings.timerPrecision;

    $scope.$on('refresh settings', function () {

      self.refreshSettings();

    });

    $scope.$on('keydown', function ($event, event) {

      if (self.settings.input === 'Timer') {
        if (self.settings.inspection) {
          if ((state === 'reset') && (event.keyCode === Constants.KEY_CODES.SPACE_BAR)) {
            self.prepareInspection();
          } else if ((state === 'inspecting') && (event.keyCode === Constants.KEY_CODES.SPACE_BAR)) {
            self.prepareTimerWIthInspection();
          }
        } else if ((state === 'reset') && (event.keyCode === Constants.KEY_CODES.SPACE_BAR)) {
          self.prepareTimer();
        } else if (state === 'memorizing') {
          self.saveMemorizationTime();
        } else if (state === 'timing') {
          self.stopTimer();
        }
      }

    });

    $scope.$on('keyup', function ($event, event) {

      if (self.settings.input === 'Timer') {
        if (self.settings.inspection) {
          if ((state === 'pre inspection') && (event.keyCode === Constants.KEY_CODES.SPACE_BAR)) {
            self.startInspection();
          } else if ((state === 'pre timing') && (event.keyCode === Constants.KEY_CODES.SPACE_BAR)) {
            self.stopInspection();
            self.startTimer();
          } else {
            self.resetTimer();
          }
        } else if ((state === 'ready') && (event.keyCode === Constants.KEY_CODES.SPACE_BAR)) {
          self.startTimer();
        } else if (state == 'execution') {
          self.startExecutionTime();
        } else {
          self.resetTimer();
        }
      }

    });

    self.prepareTimer = function() {

      state = 'keydown';
      self.time = precision === 2 ? '0.00' : '0.000';
      if (self.settings.timerStartDelay !== 0) {
        self.timerStyle = Constants.STYLES.COLOR.ORANGE;
      }
      $timeout(function () {
        if (state === 'keydown') {
          state = 'ready';
          self.timerStyle = Constants.STYLES.COLOR.GREEN;
          $rootScope.$broadcast('timer focus');
        }
      }, self.settings.timerStartDelay);

    };

    self.startTimer = function() {

      if (self.settings.bldMode && !self.settings.inspection) {
        state = 'memorizing';
        self.timerStyle = Constants.STYLES.COLOR.BLUE;
      } else {
        state = 'timing';
        self.timerStyle = Constants.STYLES.COLOR.BLACK;
      }
      TimerService.startTimer();
      timer = $interval(function () {
        self.time = TimerService.getTime(precision);
      }, self.settings.timerRefreshInterval);

    };

    self.stopTimer = function() {

      state = 'stopped';
      self.time = TimerService.getTime(precision);
      $interval.cancel(timer);
      comment = self.settings.bldMode ? TimerService.createCommentForBldMode(self.time, memo) : '';
      result = ResultsService.saveResult(self.results, self.time, penalty, comment, self.scramble, self.sessionId, self.settings.resultsPrecision, self.settings.saveScramble);
      $rootScope.$broadcast('new result', result);
      $rootScope.$broadcast('new scramble', self.eventId);

    };

    self.prepareInspection = function() {

      state = 'pre inspection';
      self.timerStyle = Constants.STYLES.COLOR.ORANGE;
      self.time = '15';
      $rootScope.$broadcast('timer focus');

    };

    self.startInspection = function() {

      state = 'inspecting';
      self.timerStyle = Constants.STYLES.COLOR.BLUE;
      TimerService.startInspection();
      inspection = $interval(function() {
        var time = TimerService.getInspectionTime();
        if (time > 0) {
          self.time = time;
        } else if (time > -2) {
          if (self.timerStyle !== Constants.STYLES.COLOR.ORANGE) {
            self.timerStyle = Constants.STYLES.COLOR.RED;
          }
          self.time = '+2';
          penalty = '+2';
        } else {
          self.time = 'DNF';
          penalty = 'DNF';
        }
      }, 1000);

    };

    self.prepareTimerWIthInspection = function() {

      state = 'pre timing';
      self.timerStyle = Constants.STYLES.COLOR.ORANGE;

    };

    self.stopInspection = function() {

      $interval.cancel(inspection);

    };

    self.saveMemorizationTime = function() {

      state = 'execution';
      self.timerStyle = Constants.STYLES.COLOR.BLACK;
      memo = self.time;

    };

    self.startExecutionTime = function() {

      state = 'timing';

    };

    self.resetTimer = function() {

      self.timerStyle = Constants.STYLES.COLOR.BLACK;
      $rootScope.$broadcast('timer unfocus');
      if ((state === 'keydown') || (state === 'stopped')) {
        state = 'reset';
      }
      penalty = '';
      memo = '';
      comment = '';

    };

    self.submitInput = function() {

      if (self.time === '') {
        $rootScope.$broadcast('new scramble', self.eventId);
      } else if ($scope.input.text.$valid) {
        result = ResultsService.saveResult(self.results, self.time, penalty, comment, self.scramble, self.sessionId, self.settings.resultsPrecision, self.settings.saveScramble);
        $rootScope.$broadcast('new result', result);
        $rootScope.$broadcast('new scramble', self.eventId);
        self.time = '';
      }

    };

    self.refreshSettings = function() {

      if (self.settings.input === 'Timer') {
        self.time = !self.settings.inspection ? (precision === 2 ? '0.00' : '0.000') : '15';
      } else if (self.settings.input === 'Typing') {
        self.time = '';
      }

    };

    self.refreshSettings();

  }

  angular.module('timer').controller('TimerController', ['$scope', '$rootScope', '$interval', '$timeout', 'TimerService', 'ResultsService', 'Constants', TimerController]);

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
     * Gets the inspection time.
     * @returns {*}
     */
    self.getInspectionTime = function() {

      return Math.ceil(((15000 + self.inspectionStartTime - Date.now()) / 1000));

    };

    /**
     * Starts the Timer.
     */
    self.startTimer = function() {

      self.startTime = Date.now();

    };

    /**
     * Starts the inspection timer.
     */
    self.startInspection = function() {

      self.inspectionStartTime = Date.now();

    };

    self.createCommentForBldMode = function(time, memo) {

      var timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(time);
      var memoMilliseconds = Calculator.convertTimeFromStringToMilliseconds(memo);
      var execution = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds - memoMilliseconds);
      return 'memo: ' + memo + ', exe: ' + execution;

    };

  }

  angular.module('timer').service('TimerService', ['LocalStorage', 'Calculator', TimerService]);

})();
