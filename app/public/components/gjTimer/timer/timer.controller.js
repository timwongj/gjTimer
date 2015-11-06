(function() {

  'use strict';

  function TimerController($scope, $rootScope, $interval, $timeout, TimerService, ResultsService) {

    var self = this, timer, state = 'reset', SPACE_BAR_KEY_CODE = 32;

    self.time = self.settings.timerPrecision === 2 ? moment(0).format('s.SS') : moment(0).format('s.SSS');

    var STYLES = {
      BLACK: { 'color': '#000000' },
      RED: { 'color': '#FF0000' },
      GREEN: { 'color': '#2EB82E' }
    };

    $scope.$on('refresh settings', function() {
      self.time = self.settings.timerPrecision === 2 ? moment(0).format('s.SS') : moment(0).format('s.SSS');
    });

    $scope.$on('keydown', function($event, event) {
      if ((state === 'reset') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
        state = 'keydown';
        self.time = self.settings.timerPrecision === 2 ? moment(0).format('s.SS') : moment(0).format('s.SSS');
        self.timerStyle = STYLES.RED;
        $timeout(function() {
          if (state === 'keydown') {
            state = 'ready';
            self.timerStyle = STYLES.GREEN;
            $rootScope.$broadcast('timer focus');
          }
        }, self.settings.timerStartDelay);
      } else if (state === 'timing') {
        state = 'stopped';
        $interval.cancel(timer);
        $rootScope.$broadcast('timer unfocus');
        ResultsService.saveResult(self.results, self.time, self.scramble, self.sessionId, self.settings.resultsPrecision);
        $rootScope.$broadcast('new scramble', self.eventId);
      }
    });

    $scope.$on('keyup', function($event, event) {
      self.timerStyle = STYLES.BLACK;
      if ((state === 'ready') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
        state = 'timing';
        TimerService.startTimer();
        timer = $interval(function() {
          self.time = TimerService.getTime(self.settings.timerPrecision);
        }, self.settings.timerRefreshInterval);
      } else if (state === 'keydown') {
        state = 'reset';
      } else if (state === 'stopped') {
        $timeout(function() {
          state = 'reset';
        }, self.settings.timerStopDelay);
      }
    });

  }

  angular.module('timer').controller('TimerController', ['$scope', '$rootScope', '$interval', '$timeout', 'TimerService', 'ResultsService', TimerController]);

})();
