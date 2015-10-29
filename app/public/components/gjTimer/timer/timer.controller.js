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
        $rootScope.$broadcast('new scramble', $rootScope.event);
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