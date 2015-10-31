(function() {

  'use strict';

  function resultsPopoverDirective($rootScope, $timeout, $http, $q, $templateCache) {

    var getTemplate = function() {
      var def = $q.defer(), template = $templateCache.get('dist/components/gjTimer/resultsPopover/resultsPopover.html');
      if (typeof template === "undefined") {
        $http.get('dist/components/gjTimer/resultsPopover/resultsPopover.html')
          .success(function(data) {
            $templateCache.put('dist/components/gjTimer/resultsPopover/resultsPopover.html', data);
            def.resolve(data);
          });
      } else {
        def.resolve(template);
      }
      return def.promise;
    };

    return {
      restrict: 'E',
      scope: {
        index: '=',
        result: '='
      },
      controller: 'ResultsPopoverController',
      link: function (scope, element, attrs) {
        getTemplate().then(function(content) {
          scope.popoverDelay = 1; // just needs to be at least 1
          $rootScope.insidePopover = -1;
          $(element).popover({
            animation: false,
            content: content,
            html: true,
            placement: 'right',
            title: scope.result.time
          });
          $(element).bind('mouseenter', function () {
            scope.insideDiv = scope.index;
            $timeout(function() {
              $(element).popover('show');
              scope.attachEvents(element);
            }, scope.popoverDelay);
          });
          $(element).bind('mouseleave', function () {
            scope.insideDiv = -1;
            $timeout(function() {
              if ($rootScope.insidePopover !== scope.index)
                $(element).popover('hide');
            }, scope.popoverDelay);
          });
        });
      }
    };

  }

  angular.module('results').directive('resultsPopover', ['$rootScope', '$timeout', '$http', '$q', '$templateCache', resultsPopoverDirective]);

})();