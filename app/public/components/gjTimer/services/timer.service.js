(function() {

  'use strict';

  function TimerService() {

    var Timer = function() {

      var self = this;

      self.time = '15:38.843';

    };

    Timer.prototype.getTime = function() {
      return this.time;
    };

    return Timer;

  }

  angular.module('gjTimer').factory('Timer', TimerService);

})();
