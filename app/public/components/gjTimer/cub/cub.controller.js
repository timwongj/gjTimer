(function() {

  'use strict';

  function CubController($scope, CubService) {

    var self = this;

    $scope.$on('draw scramble', function($event, eventId, state) {

      self.cub = CubService.drawScramble(eventId, state);

    });

  }

  angular.module('cub').controller('CubController', ['$scope', 'CubService', CubController]);

})();
