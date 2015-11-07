(function() {

  'use strict';

  function SettingsController($scope, $rootScope, $modalInstance, settings, MenuBarService) {

    var self = this;

    var ENTER_KEY_CODE = 13, ESCAPE_KEY_CODE = 27;

    self.settings = [
      { id: 'input', title: 'Input', options: ['Timer', 'Typing', 'Stackmat'] },
      { id: 'inspection', title: 'Inspection', options: ['On', 'Off'] },
      { id: 'bldMode', title: 'BLD Mode', options: ['On', 'Off'] },
      { id: 'showScramble', title: 'Show Scramble', options: ['Yes', 'No'] },
      { id: 'saveScrambles', title: 'Save Scrambles', options: ['Yes', 'No'] },
      { id: 'timerStartDelay', title: 'Timer Start Delay', options: [0, 100, 200, 500] },
      { id: 'timerStopDelay', title: 'Timer Stop Delay', options: [0, 100, 200, 500] },
      { id: 'timerPrecision', title: 'Timer Precision', options: [2, 3] },
      { id: 'resultsPrecision', title: 'Results Precision', options: [2, 3] },
      { id: 'statisticsPrecision', title: 'Stats Precision', options: [2, 3] }
    ];

    for (var i = 0; i < self.settings.length; i++) {
      self.settings[i].value = settings[self.settings[i].id];
    }

    $scope.$on('keydown', function($event, event) {
      switch(event.keyCode) {
        case ENTER_KEY_CODE:
          self.save();
          break;
        case ESCAPE_KEY_CODE:
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

  angular.module('menuBar').controller('SettingsController', ['$scope', '$rootScope', '$modalInstance', 'settings', 'MenuBarService', SettingsController]);

})();
