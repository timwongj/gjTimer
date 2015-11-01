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
