(function() {

  'use strict';

  /**
   * This is the gjTimer.services module.
   * It contains all the shared services in the gjTimer module.
   */
  angular.module('gjTimer.services', []);

  /**
   * This is the gjTimer.filters module.
   * It contains all the shared filters in the gjTimer module.
   */
  angular.module('gjTimer.filters', []);

  /**
   * This is the main gjTimer module.
   * All gjTimer components should be pulled in here as dependencies.
   * This module is pulled into the main app.js 'gjTimerApp' module.
   */
  angular.module('gjTimer', ['gjTimer.services', 'gjTimer.filters', 'cub', 'menuBar', 'results', 'scramble', 'statistics', 'timer']);

})();
