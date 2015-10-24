(function() {

  'use strict';

  function StatisticsService() {

    var self = this;

    /**
     * Gets results for the session.
     * @param sessionId
     */
    self.getResults = function(sessionId) {

      return JSON.parse(localStorage.getItem(sessionId)).list;

    };

  }

  angular.module('statistics').service('StatisticsService', StatisticsService);

})();
