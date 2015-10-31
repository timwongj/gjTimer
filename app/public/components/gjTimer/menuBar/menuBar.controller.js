(function() {

  'use strict';

  function MenuBarController($scope, $rootScope, $timeout, $uibModal, MenuBarService, Events) {

    var self = this;

    var NUMBER_OF_SESSIONS = 20;

    self.events = Events.getEvents();
    self.session = MenuBarService.init();
    self.event = self.session.event;
    $scope.sessionId = 'session' + self.session.name.substr(8, self.session.name.length);
    $scope.event = self.event;
    $scope.settings = {
      precision: 2, // 2 digits after decimal
      timerStartDelay: 100, // milliseconds
      timerStopDelay: 100, // milliseconds
      timerRefreshInterval: 50 // milliseconds
    };

    // TODO - find a better solution to waiting for controllers to initialize before broadcasting
    // The cutoff for successful broadcast is ~15-20ms, so 50 should be sufficient for now.
    $timeout(function() {
      $rootScope.$broadcast('new scramble', $scope.event);
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
      $scope.event = self.event;
      $rootScope.$broadcast('new scramble', $scope.event);
    };

    self.changeSession = function(sessionName) {
      self.session = MenuBarService.changeSession('session' + sessionName.substr(8, sessionName.length));
      $scope.sessionId = 'session' + sessionName.substr(8, sessionName.length);
      $scope.event = self.session.event;
      $rootScope.$broadcast('refresh data', $scope.sessionId);
      if (self.event !== self.session.event) {
        $rootScope.$broadcast('new scramble', $scope.event);
      }
      self.event = $scope.event;
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
      if (confirm('Are you sure you want to reset ' + self.session.name + '?')) {
        self.session = MenuBarService.resetSession('session' + self.session.name.substr(8, self.session.name.length));
        $rootScope.$broadcast('refresh data');
      }
    };

  }

  angular.module('menuBar').controller('MenuBarController', ['$scope', '$rootScope', '$timeout', '$uibModal', 'MenuBarService', 'Events', MenuBarController]);

})();
