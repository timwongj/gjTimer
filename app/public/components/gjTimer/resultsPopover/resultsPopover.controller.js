(function() {

  'use strict';

  function ResultsPopoverController($scope, $rootScope, $timeout, ResultsService) {

    var self = this;

    var ENTER_KEY_CODE = 13;

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
        ResultsService.penalty(self.result, self.sessionId, self.index, '', self.precision);
        $scope.$apply();
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-plus').on('click', function() {
        ResultsService.penalty(self.result, self.sessionId, self.index, '+2', self.precision);
        $scope.$apply();
        $(element).popover('hide');
      });

      $('.popover-btn-penalty-dnf').on('click', function() {
        ResultsService.penalty(self.result, self.sessionId, self.index, 'DNF', self.precision);
        $scope.$apply();
        $(element).popover('hide');
      });

      $('.popover-btn-remove').on('click', function() {
        if (confirm('Are you sure you want to delete this time?')) {
          ResultsService.remove(self.results, self.sessionId, self.index);
          $scope.$apply();
          $(element).popover('hide');
        }
      });

      $('.popover-input-comment').on('focus', function() {
        $rootScope.isTyping = true;
      }).on('blur', function() {
        $rootScope.isTyping = false;
      }).on('keydown', function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
          ResultsService.comment(self.result, self.sessionId, self.index, $('.popover-input-comment')[0].value);
          $scope.$apply();
          $(element).popover('hide');
        }
      })[0].value = self.result.comment;

    };

  }

  angular.module('results').controller('ResultsPopoverController', ['$scope', '$rootScope', '$timeout', 'ResultsService', ResultsPopoverController]);

})();
