(function() {

  'use strict';

  function ResultsPopoverController($rootScope, $timeout, ResultsService, Constants) {

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
        if (self.results[self.index].penalty !== '') {
          ResultsService.penaltyAsync(self.results, self.index, self.sessionId, '', self.precision)
            .then(function() {
              $rootScope.$broadcast('refresh statistics', self.results);
              $rootScope.$broadcast('refresh charts', self.results);
            });
        }
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-plus').on('click', function() {
        if (self.results[self.index].penalty !== '+2') {
          ResultsService.penaltyAsync(self.results, self.index, self.sessionId, '+2', self.precision)
            .then(function() {
              $rootScope.$broadcast('refresh statistics', self.results);
              $rootScope.$broadcast('refresh charts', self.results);
            });
        }
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-dnf').on('click', function() {
        if (self.results[self.index].penalty !== 'DNF') {
          ResultsService.penaltyAsync(self.results, self.index, self.sessionId, 'DNF', self.precision)
            .then(function() {
              $rootScope.$broadcast('refresh statistics', self.results);
              $rootScope.$broadcast('refresh charts', self.results);
            });
        }
        $(element).popover('hide');
      });

      $('.popover-btn-remove').on('click', function() {
        if (confirm('Are you sure you want to delete this time?')) {
          ResultsService.removeAsync(self.results, self.index, self.sessionId, self.precision)
            .then(function() {
              $rootScope.$broadcast('refresh statistics', self.results);
              $rootScope.$broadcast('refresh charts', self.results);
            });
          $(element).popover('hide');
        }
      });

      $('.popover-input-comment').on('focus', function() {
        $rootScope.isTypingComment = true;
      }).on('blur', function() {
        $timeout(function() {
          $rootScope.isTypingComment = false;
        }, 1);
      }).on('keydown', function(event) {
        if (event.keyCode === Constants.KEY_CODES.ENTER) {
          if ($('.popover-input-comment')[0].value !== self.results[self.index].comment) {
            ResultsService.commentAsync(self.results, self.index, self.sessionId, $('.popover-input-comment')[0].value);
          }
          $(element).popover('hide');
        }
      })[0].value = self.results[self.index].comment;

    };

  }

  angular.module('results').controller('ResultsPopoverController', ['$rootScope', '$timeout', 'ResultsService', 'Constants', ResultsPopoverController]);

})();
