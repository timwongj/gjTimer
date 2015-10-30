(function() {

  'use strict';

  function SettingsController($modalInstance, settings, MenuBarService) {

    var self = this;
    self.settings = settings;

    self.close = function() {
      $modalInstance.dismiss();
    };

  }

  angular.module('menuBar').controller('SettingsController', ['$modalInstance', 'settings', 'MenuBarService', SettingsController]);

})();
