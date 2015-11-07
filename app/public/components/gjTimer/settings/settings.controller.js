(function() {

  'use strict';

  function SettingsController($rootScope, $modalInstance, settings, MenuBarService) {

    var self = this;

    self.settings = [
      { id: 'input', description: 'Input', options: ['Timer', 'Keyboard', 'Stackmat'] },
      { id: 'saveScrambles', description: 'Save Scrambles', options: ['Yes', 'No'] },
      { id: 'timerStartDelay', description: 'Timer Start Delay', options: [0, 100, 200, 500] },
      { id: 'timerStopDelay', description: 'Timer Stop Delay', options: [0, 100, 200, 500] },
      { id: 'timerPrecision', description: 'Timer Precision', options: [2, 3] },
      { id: 'resultsPrecision', description: 'Results Precision', options: [2, 3] },
      { id: 'statisticsPrecision', description: 'Stats Precision', options: [2, 3] },
    ];

    for (var i = 0; i < self.settings.length; i++) {
      self.settings[i].value = settings[self.settings[i].id];
    }

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

  angular.module('menuBar').controller('SettingsController', ['$rootScope', '$modalInstance', 'settings', 'MenuBarService', SettingsController]);

})();
