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
