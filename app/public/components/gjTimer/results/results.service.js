(function() {

  'use strict';

  function ResultsService() {

    var self = this;

    /**
     * Gets results for the session.
     * @param sessionId
     */
    self.getResults = function(sessionId) {

      return JSON.parse(localStorage.getItem(sessionId)).list;

    };

  }

  angular.module('results').service('ResultsService', ResultsService);

})();
