(function() {

  'use strict';

  function resultsPopoverDirective($rootScope, $http, $q, $templateCache) {

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
        result: '='
      },
      controller: 'ResultsPopoverController',
      link: function (scope, element, attrs) {
        scope.$watch(function () {
          return scope.result;
        }, function () {
          getTemplate().then(function(content) {
            $rootScope.insidePopover = false;
            $(element).popover({
              animation: true,
              content: content,
              html: true,
              placement: 'right',
              title: scope.result.time
            });
            $(element).bind('mouseenter', function () {
              $(element).popover('show');
              scope.attachEvents(element);
            });
            $(element).bind('mouseleave', function () {
              if (!$rootScope.insidePopover)
                $(element).popover('hide');
            });
          });
        });
      }
    };

  }

  angular.module('results').directive('resultsPopover', ['$rootScope', '$http', '$q', '$templateCache', resultsPopoverDirective]);

})();