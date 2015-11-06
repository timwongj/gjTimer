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

    $scope.$on('refresh settings', function() {
      self.time = $scope.settings.timerPrecision === 2 ? moment(0).format('s.SS') : moment(0).format('s.SSS');
    });

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
        $rootScope.$broadcast('refresh results', $scope.sessionId);
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
