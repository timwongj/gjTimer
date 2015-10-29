(function() {

  'use strict';

  function CubController($scope, $rootScope, $sce, Events, CubService) {

    var self = this;
    $scope.$on('draw scramble', function($event, state) {
      var width = Events.getEventSvg($rootScope.event).width;
      var height = width / Events.getEventSvg($rootScope.event).ratio;
      var el = document.createElement("div");
      scramblers[Events.getEventId($rootScope.event)].drawScramble(el, state, height, width);
      var tmp = document.createElement("div");
      tmp.appendChild(el);
      self.cub = $sce.trustAsHtml(tmp.innerHTML);
    });

  }

  angular.module('cub').controller('CubController', ['$scope', '$rootScope', '$sce', 'Events', 'CubService', CubController]);

})();