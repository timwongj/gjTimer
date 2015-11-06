(function() {

  'use strict';

  function SettingsController($rootScope, $modalInstance, settings, MenuBarService) {

    var self = this;

    self.settings = settings;

    self.options = {
      input: ['timer', 'keyboard', 'stackmat'],
      timerStartDelay: [0, 50, 100],
      resultsPrecision: [2, 3],
      timerPrecision: [2, 3]
    };

    self.save = function() {
      MenuBarService.saveSettings(self.settings);
      $modalInstance.dismiss();
      $rootScope.$broadcast('refresh settings');
      $rootScope.$broadcast('refresh results');
    };

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('menuBar').controller('SettingsController', ['$rootScope', '$modalInstance', 'settings', 'MenuBarService', SettingsController]);

})();
