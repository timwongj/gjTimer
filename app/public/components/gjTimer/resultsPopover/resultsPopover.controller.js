(function() {

  'use strict';

  function ResultsPopoverController($scope, $rootScope) {
    $scope.attachEvents = function (element) {
      $('.popover').on('mouseenter', function () {
        $rootScope.insidePopover = true;
      }).on('mouseleave', function () {
        $rootScope.insidePopover = false;
        $(element).popover('hide');
      }).on('mouseclick', function () {
        $rootScope.insidePopover = false;
        $(element).popover('hide');
      });
    };
  }

  angular.module('results').controller('ResultsPopoverController', ['$scope', '$rootScope', ResultsPopoverController]);

})();
