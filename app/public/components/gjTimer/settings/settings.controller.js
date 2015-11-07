(function() {

  'use strict';

  function SettingsController($rootScope, $modalInstance, settings, MenuBarService) {

    var self = this;

    self.settings = settings;

    self.options = {
      input: ['Timer', 'Keyboard', 'Stackmat'],
      saveScrambles: ['Yes', 'No'],
      timerStartDelay: [0, 100, 200, 500],
      timerStopDelay: [0, 100, 200, 500],
      timerPrecision: [2, 3],
      resultsPrecision: [2, 3],
      statisticsPrecision: [2, 3]
    };

    self.save = function() {
      MenuBarService.saveSettings(self.settings);
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

  angular.module('menuBar').controller('SettingsController', ['$rootScope', '$modalInstance', 'settings', 'MenuBarService', SettingsController]);

})();
