(function() {

  'use strict';

  function ResultsPopoverController($scope, $rootScope, $timeout, ResultsPopoverService) {

    var self = this;

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

      $('.popover-btn-penalty-ok').on('click', function() {
        ResultsPopoverService.penalty($scope.sessionId, $scope.index, '');
        $rootScope.$broadcast('refresh data', $scope.sessionId);
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-plus').on('click', function() {
        ResultsPopoverService.penalty($scope.sessionId, $scope.index, '+2');
        $rootScope.$broadcast('refresh data', $scope.sessionId);
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-dnf').on('click', function() {
        ResultsPopoverService.penalty($scope.sessionId, $scope.index, 'DNF');
        $rootScope.$broadcast('refresh data', $scope.sessionId);
        $(element).popover('hide');
      });

      $('.popover-btn-remove').on('click', function() {
        if (confirm('Are you sure you want to delete this time?')) {
          ResultsPopoverService.remove($scope.sessionId, $scope.index);
          $rootScope.$broadcast('refresh data', $scope.sessionId);
        }
        $(element).popover('hide');
      });

    };

  }

  angular.module('results').controller('ResultsPopoverController', ['$scope', '$rootScope', '$timeout', 'ResultsPopoverService', ResultsPopoverController]);

})();
