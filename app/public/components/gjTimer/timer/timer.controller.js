(function() {

  'use strict';

  function TimerController($rootScope, TimerService) {

    var self = this;

    self.time = TimerService.getTime();

  }

  angular.module('timer').controller('TimerController', ['$rootScope', 'TimerService', TimerController]);

})();