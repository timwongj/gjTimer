(function() {

  'use strict';

  function TimerController($scope, $rootScope, $interval, TimerService) {

    var self = this;

    var TIMER_REFRESH_INTERVAL = 50;
    var SPACE_BAR_KEY_CODE = 32;
    var COLOR_BLACK = '#000000';
    var COLOR_GREEN = '#2EB82E';
    var DEFAULT_TIMER_DISPLAY = moment(0).format('s.SS');
    var timer, keydown = false, isTiming = false;

    self.time = DEFAULT_TIMER_DISPLAY;
    self.timerStyle = { 'color': '#000000' };

    $scope.$on('keydown', function(event, args) {
      if (!keydown) {
        if (!isTiming && (args.keyCode === 32)) {
          keydown = true;
          self.time = DEFAULT_TIMER_DISPLAY;
          self.timerStyle = { 'color': COLOR_GREEN };
        } else if (isTiming) {
          keydown = true;
          $interval.cancel(timer);
          TimerService.saveResult(self.time, $rootScope.scramble, $rootScope.sessionId);
          $rootScope.$broadcast('new scramble', $rootScope.puzzle);
          $rootScope.$broadcast('refresh data');
        }
      }
    });

    $scope.$on('keyup', function($event, event) {
      if (keydown) {
        if (!isTiming && (event.keyCode === SPACE_BAR_KEY_CODE)) {
          keydown = false;
          isTiming = true;
          self.timerStyle = { 'color': COLOR_BLACK };
          TimerService.startTimer();
          timer = $interval(function() {
            self.time = TimerService.getTime();
          }, TIMER_REFRESH_INTERVAL);
        } else if (isTiming) {
          isTiming = false;
          keydown = false;
        }
      }
    });

  }

  angular.module('timer').controller('TimerController', ['$scope', '$rootScope', '$interval', 'TimerService', TimerController]);

})();