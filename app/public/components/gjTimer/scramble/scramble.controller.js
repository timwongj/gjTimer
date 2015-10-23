(function() {

  'use strict';

  function ScrambleController($rootScope, ScrambleService) {

    var self = this;

    self.scramble = "R B' R' U' B2 F2 D2 L2 B' F L' D2 B R2 L' F' B D2 R' B'";

  }

  angular.module('scramble').controller('ScrambleController', ['$rootScope', 'ScrambleService', ScrambleController]);

})();