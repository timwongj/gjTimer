(function() {

  'use strict';

  function ReverseFilter() {

    return function(items) {

      return items.slice().reverse();

    };

  }

  angular.module('gjTimer').filter('reverse', ReverseFilter);

})();
