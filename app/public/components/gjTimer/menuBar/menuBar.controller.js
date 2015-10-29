(function() {

  'use strict';

  function MenuBarController($rootScope, $timeout, MenuBarService, Events) {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

    self.events = Events.getEvents();
    self.session = MenuBarService.init();
    self.event = self.session.event;
    $rootScope.sessionId = 'session' + self.session.name.substr(8, self.session.name.length);
    $rootScope.event = self.event;

    // TODO - find a better solution to waiting for controllers to initialize before broadcasting
    // The cutoff for successful broadcast is ~15-20ms, so 50 should be sufficient for now.
    $timeout(function() {
      $rootScope.$broadcast('new scramble', self.event);
    }, 50);

    self.sessions = [];
    for (var i = 0; i < NUMBER_OF_SESSIONS; i++) {
      self.sessions[i] = {};
    }

    angular.forEach(self.sessions, function(session, $index) {
      session.name = 'Session ' + ($index + 1);
    });

    self.selectEvent = function(event) {
      self.event = MenuBarService.changeEvent('session' + self.session.name.substr(8, self.session.name.length), event);
      $rootScope.event = self.event;
      $rootScope.$broadcast('new scramble', self.event);
    };

    self.changeSession = function(sessionName) {
      self.session = MenuBarService.changeSession('session' + sessionName.substr(8, sessionName.length));
      $rootScope.sessionId = 'session' + sessionName.substr(8, sessionName.length);
      $rootScope.event = self.session.event;
      $rootScope.$broadcast('refresh data');
      if (self.event !== self.session.event) {
        $rootScope.$broadcast('new scramble', self.session.event);
      }
      self.event = $rootScope.event;
    };

    self.settings = function() {
      console.log('settings');
    };

    self.scramble = function() {
      $rootScope.$broadcast('new scramble', self.session.event);
    };

    self.resetSession = function() {
      if (confirm('Are you sure you would like to reset ' + self.session.name + '?')) {
        self.session = MenuBarService.resetSession('session' + self.session.name.substr(8, self.session.name.length));
        $rootScope.$broadcast('refresh data');
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$rootScope', '$timeout', 'MenuBarService', 'Events', MenuBarController]);

})();