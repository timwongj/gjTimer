(function() {

  'use strict';

  function CubController($scope, CubService) {

    var self = this;

    $scope.$on('draw scramble', function($event, event, state) {
      self.cub = CubService.drawScramble(event, state);
    });

  }

  angular.module('cub').controller('CubController', ['$scope', 'CubService', CubController]);

})();
