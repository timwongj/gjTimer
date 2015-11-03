(function() {

  'use strict';

  function ReverseFilter() {

    return function(items) {

      if (items !== undefined) {
        return items.slice().reverse();
      } else {
        return [];
      }

    };

  }

  angular.module('gjTimer').filter('reverse', ReverseFilter);

})();
