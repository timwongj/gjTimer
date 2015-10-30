(function() {

  'use strict';

  /**
   * This is the main gjTimer module. All gjTimer components should be pulled in here as dependencies.
   * This module is pulled into the main app.js 'gjTimerApp' module.
   */
  angular.module('gjTimer', ['cub', 'menuBar', 'results', 'scramble', 'statistics', 'timer']);

})();
