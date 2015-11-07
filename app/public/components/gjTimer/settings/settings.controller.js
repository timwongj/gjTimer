(function() {

  'use strict';

  function SettingsController($scope, $rootScope, $modalInstance, settings, MenuBarService, Constants) {

    var self = this;

    self.settings = Constants.SETTINGS;

    for (var i = 0; i < self.settings.length; i++) {
      self.settings[i].value = settings[self.settings[i].id];
    }

    $scope.$on('keydown', function($event, event) {
      switch(event.keyCode) {
        case Constants.KEY_CODES.ENTER:
          self.save();
          break;
        case Constants.KEY_CODES.ESCAPE:
          self.close();
          break;
      }
    });

    self.save = function() {
      for (var i = 0; i < self.settings.length; i++) {
        settings[self.settings[i].id] = self.settings[i].value;
      }
      MenuBarService.saveSettings(settings);
      $modalInstance.dismiss();
      $rootScope.$broadcast('refresh settings');
      $rootScope.$broadcast('refresh results');
    };

    self.resetAll = function() {
      if (confirm('Are you sure you want to reset everything?')) {
        MenuBarService.resetAll();
        $modalInstance.dismiss();
        $rootScope.$broadcast('refresh settings');
        $rootScope.$broadcast('refresh results');
      }
    };

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('menuBar').controller('SettingsController', ['$scope', '$rootScope', '$modalInstance', 'settings', 'MenuBarService', 'Constants', SettingsController]);

})();
