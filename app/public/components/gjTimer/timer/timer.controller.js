(function() {

  'use strict';

  function TimerController($scope, $rootScope, $interval, $timeout, TimerService, ResultsService) {

    var self = this;

    var timer, inspection, state = 'reset', penalty = '', comment = '', precision = self.settings.timerPrecision;
    var SPACE_BAR_KEY_CODE = 32;

    var STYLES = {
      BLACK: { 'color': '#000000' },
      RED: { 'color': '#FF0000' },
      ORANGE: { 'color': '#FFA500' },
      GREEN: { 'color': '#2EB82E' },
      BLUE: { 'color': '#0000FF' }
    };

    if (self.settings.input === 'Timer') {
      self.time = self.settings.inspection !== 'On' ? (precision === 2 ? '0.00' : '0.000') : '15';
    } else if (self.settings.input === 'Typing') {
      self.time = '';
    }

    $scope.$on('refresh settings', function () {

      if (self.settings.input === 'Timer') {
        self.time = self.settings.inspection !== 'On' ? (precision === 2 ? '0.00' : '0.000') : '15';
      } else if (self.settings.input === 'Typing') {
        self.time = '';
      }

    });

    $scope.$on('keydown', function ($event, event) {

      if (self.settings.input === 'Timer') {
        if (self.settings.inspection === 'On') {

          if ((state === 'reset') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
            self.prepareInspection();
          } else if ((state === 'inspecting') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
            self.prepareTimerWIthInspection();
          }

        } else if ((state === 'reset') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
          self.prepareTimer();
        }

        if (state === 'timing') {
          self.stopTimer();
        }

      }

    });

    $scope.$on('keyup', function ($event, event) {

      if (self.settings.input === 'Timer') {
        if (self.settings.inspection === 'On') {

          if ((state === 'pre inspection') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
            self.startInspection();
          } else if ((state === 'pre timing') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
            self.stopInspection();
            self.startTimer();
          } else {
            self.resetTimer();
          }

        } else if ((state === 'ready') && (event.keyCode === SPACE_BAR_KEY_CODE)) {
          self.startTimer();
        } else {
          self.resetTimer();
        }
      }

    });

    self.prepareTimer = function() {

      state = 'keydown';
      self.time = precision === 2 ? '0.00' : '0.000';
      self.timerStyle = STYLES.ORANGE;
      $timeout(function () {
        if (state === 'keydown') {
          state = 'ready';
          self.timerStyle = STYLES.GREEN;
          $rootScope.$broadcast('timer focus');
        }
      }, self.settings.timerStartDelay);

    };

    self.startTimer = function() {

      state = 'timing';
      self.timerStyle = STYLES.BLACK;
      TimerService.startTimer();
      timer = $interval(function () {
        self.time = TimerService.getTime(precision);
      }, self.settings.timerRefreshInterval);

    };

    self.stopTimer = function() {

      state = 'stopped';
      $interval.cancel(timer);
      ResultsService.saveResult(self.results, self.time, penalty, comment, self.scramble, self.sessionId, self.settings.resultsPrecision);
      $rootScope.$broadcast('new scramble', self.eventId);

    };

    self.prepareInspection = function() {

      state = 'pre inspection';
      self.timerStyle = STYLES.ORANGE;
      self.time = '15';
      $rootScope.$broadcast('timer focus');

    };

    self.startInspection = function() {

      state = 'inspecting';
      self.timerStyle = STYLES.BLUE;
      TimerService.startInspection();
      inspection = $interval(function() {
        var time = TimerService.getInspectionTime();
        if (time > 0) {
          self.time = time;
        } else if (time > -2) {
          if (self.timerStyle !== STYLES.ORANGE) {
            self.timerStyle = STYLES.RED;
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
      self.timerStyle = STYLES.ORANGE;

    };

    self.stopInspection = function() {

      $interval.cancel(inspection);

    };

    self.resetTimer = function() {

      self.timerStyle = STYLES.BLACK;
      $rootScope.$broadcast('timer unfocus');
      if ((state === 'keydown') || (state === 'stopped')) {
        state = 'reset';
      }
      penalty = '';

    };

    self.submitInput = function() {

      if (self.time === '') {
        $rootScope.$broadcast('new scramble', self.eventId);
      } else if ($scope.input.text.$valid) {
        ResultsService.saveResult(self.results, self.time, penalty, comment, self.scramble, self.sessionId, self.settings.resultsPrecision);
        self.time = '';
        $rootScope.$broadcast('new scramble', self.eventId);
      }

    };

  }

  angular.module('timer').controller('TimerController', ['$scope', '$rootScope', '$interval', '$timeout', 'TimerService', 'ResultsService', TimerController]);

})();
