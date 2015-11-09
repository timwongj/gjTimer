(function() {

  'use strict';

  function Config() {

  }

  function Run($http, $templateCache) {

    $http.get('dist/components/gjTimer/resultsPopover/resultsPopover.html')
      .success(function(template) {
        $templateCache.put('resultsPopover.html', template);
      });

  }

  angular.module('gjTimerApp', [
    // main angular modules

    // third-party (non-Angular modules)
    'ui.bootstrap',
    // gjTimer
    'gjTimer'
  ]);

  angular.module('gjTimerApp').config(Config).run(['$http', '$templateCache', Run]);

})();
