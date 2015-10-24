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