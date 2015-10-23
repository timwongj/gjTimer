(function() {

  'use strict';

  function TimerService() {

    var self = this;

    self.time = '17:38.625';

    self.getTime = function() {
      return self.time;
    };

  }

  angular.module('timer').service('TimerService', TimerService);

})();
