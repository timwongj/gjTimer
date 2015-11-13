(function() {

  'use strict';

  function MenuBarController($scope, $rootScope, $uibModal, MenuBarService, Events) {

    var self = this;

    self.eventId = MenuBarService.initEvent();
    self.sessionId = MenuBarService.initSession();
    self.sessions = MenuBarService.initSessions();
    self.settings = MenuBarService.initSettings();
    self.events = Events.getEvents();
    self.event = { eventId: self.eventId, event: Events.getEvent(self.eventId) };

    // show glyphicons instead of text on reset and settings buttons if window size is less than 500px
    self.showDetails = window.innerWidth > 500;
    $(window).resize(function(){
      self.showDetails = window.innerWidth > 500;
      $scope.$apply();
    });

    self.changeSession = function(sessionId) {
      self.sessionId = sessionId;
      var eventId = MenuBarService.changeSession(sessionId);
      if (eventId !== self.eventId) {
        $rootScope.$broadcast('new scramble', eventId);
      }
      self.eventId = eventId;
      $rootScope.$broadcast('refresh results', sessionId);
      self.event = { eventId: self.eventId, event: Events.getEvent(self.eventId) };
    };

    self.changeEvent = function(event) {
      self.eventId = Events.getEventId(event);
      self.event = { eventId: self.eventId, event: Events.getEvent(self.eventId) };
      MenuBarService.changeEvent(self.sessionId, self.eventId);
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
        self.results = [];
        MenuBarService.resetSessionAsync(self.sessionId);
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$scope', '$rootScope', '$uibModal', 'MenuBarService', 'Events', MenuBarController]);

})();
