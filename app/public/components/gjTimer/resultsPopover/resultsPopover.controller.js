(function() {

  'use strict';

  function ResultsPopoverController($rootScope, $timeout, ResultsPopoverService) {

    var self = this;

    self.attachEvents = function (element) {

      $('.popover').on('mouseenter', function () {
        $rootScope.insidePopover = self.index;
      }).on('mouseleave', function () {
        $rootScope.insidePopover = -1;
        $timeout(function() {
          if (self.insideDiv !== self.index) {
            $(element).popover('hide');
          }
        }, 1);
      });

      $('.popover-btn-penalty-ok').on('click', function() {
        ResultsPopoverService.penalty(self.sessionId, self.index, '');
        $rootScope.$broadcast('refresh results');
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-plus').on('click', function() {
        ResultsPopoverService.penalty(self.sessionId, self.index, '+2');
        $rootScope.$broadcast('refresh results');
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-dnf').on('click', function() {
        ResultsPopoverService.penalty(self.sessionId, self.index, 'DNF');
        $rootScope.$broadcast('refresh results');
        $(element).popover('hide');
      });

      $('.popover-btn-remove').on('click', function() {
        if (confirm('Are you sure you want to delete this time?')) {
          ResultsPopoverService.remove(self.sessionId, self.index);
          $rootScope.$broadcast('refresh results');
        }
        $(element).popover('hide');
      });

    };

  }

  angular.module('results').controller('ResultsPopoverController', ['$rootScope', '$timeout', 'ResultsPopoverService', ResultsPopoverController]);

})();
