(function() {

  'use strict';

  function resultsPopoverDirective($rootScope, $timeout, $templateCache) {

    return {
      restrict: 'E',
      scope: {
        index: '=',
        precision: '=',
        result: '=',
        results: '=',
        sessionId: '='
      },
      controller: 'ResultsPopoverController',
      controllerAs: 'ctrl',
      bindToController: true,
      link: link
    };

    function link (scope, element) {
      $rootScope.insidePopover = -1;
      $(element).popover({
        animation: false,
        content: $templateCache.get('resultsPopover.html'),
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
    }

  }

  angular.module('results').directive('resultsPopover', ['$rootScope', '$timeout', '$templateCache', resultsPopoverDirective]);

})();