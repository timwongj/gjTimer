(function() {

  'use strict';

  function SettingsController($scope, $rootScope, $modalInstance, settings, MenuBarService, Constants) {

    var self = this;

    self.settings = [
      { id: 'input', title: 'Input', options: ['Timer', 'Typing', 'Stackmat'] },
      { id: 'inspection', title: 'Inspection', options: ['On', 'Off'] },
      { id: 'bldMode', title: 'BLD Mode', options: ['On', 'Off'] },
      { id: 'timerStartDelay', title: 'Timer Start Delay', options: [0, 100, 550, 1000] },
      { id: 'timerPrecision', title: 'Timer Precision', options: [0, 1, 2, 3] },
      { id: 'timerRefreshInterval', title: 'Timer Refresh', options: [50, 100, 500, 1000] },
      { id: 'showScramble', title: 'Show Scramble', options: ['Yes', 'No'] },
      { id: 'saveScrambles', title: 'Save Scrambles', options: ['Yes', 'No'] },
      { id: 'resultsPrecision', title: 'Results Precision', options: [2, 3] },
      { id: 'statisticsPrecision', title: 'Stats Precision', options: [2, 3] }
    ];

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
