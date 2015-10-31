(function() {

  'use strict';

  function ResultsPopoverController($scope, $rootScope, $timeout, ResultsService) {
    $scope.attachEvents = function (element) {
      $('.popover').on('mouseenter', function () {
        $rootScope.insidePopover = $scope.index;
      }).on('mouseleave', function () {
        $rootScope.insidePopover = -1;
        $timeout(function() {
          if ($scope.insideDiv !== $scope.index) {
            $(element).popover('hide');
          }
        }, $scope.popoverDelay);
      });
    };
  }

  angular.module('results').controller('ResultsPopoverController', ['$scope', '$rootScope', '$timeout', 'ResultsService', ResultsPopoverController]);

})();
