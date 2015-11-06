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
