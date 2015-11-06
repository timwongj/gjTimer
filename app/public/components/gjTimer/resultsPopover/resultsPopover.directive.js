(function() {

  'use strict';

  function resultsPopoverDirective($rootScope, $timeout, $http, $q, $templateCache) {

    return {
      restrict: 'E',
      scope: {
        index: '=',
        result: '=',
        sessionId: '='
      },
      controller: 'ResultsPopoverController',
      controllerAs: 'ctrl',
      bindToController: true,
      link: link
    };

    function link (scope, element) {
      getTemplate().then(function(content) {
        $rootScope.insidePopover = -1;
        $(element).popover({
          animation: false,
          content: content,
          html: true,
          placement: 'right',
          title: scope.ctrl.result.detailedTime
        });
        $(element).bind('mouseenter', function () {
          scope.ctrl.insideDiv = scope.ctrl.index;
          $timeout(function() {
            $(element).popover('show');
            scope.ctrl.attachEvents(element);
          }, 1);
        });
        $(element).bind('mouseleave', function () {
          scope.ctrl.insideDiv = -1;
          $timeout(function() {
            if ($rootScope.insidePopover !== scope.ctrl.index)
              $(element).popover('hide');
          }, 1);
        });
      });
    }

    function getTemplate() {
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
    }

  }

  angular.module('results').directive('resultsPopover', ['$rootScope', '$timeout', '$http', '$q', '$templateCache', resultsPopoverDirective]);

})();