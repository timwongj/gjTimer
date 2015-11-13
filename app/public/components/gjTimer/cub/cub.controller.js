(function() {

  'use strict';

  function CubController($scope, CubService) {

    var self = this;

    self.cub = CubService.drawScramble(self.eventId, self.state);

    $scope.$on('draw scramble', function($event, eventId, state) {

      self.cub = CubService.drawScramble(eventId, state);

    });

  }

  angular.module('cub').controller('CubController', ['$scope', 'CubService', CubController]);

})();
