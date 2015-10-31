(function() {

  'use strict';

  function ResultsPopoverService() {

    var self = this;

    /**
     * Changes the penalty for a solve.
     * @param sessionId
     * @param index
     * @param penalty
     */
    self.penalty = function(sessionId, index, penalty) {
      var session = JSON.parse(localStorage.getItem(sessionId));
      switch(penalty) {
        case '':
          if (session.list[index].penalty !== undefined) {
            delete session.list[index].penalty;
            localStorage.setItem(sessionId, JSON.stringify(session));
          }
          break;
        case '+2':
          session.list[index].penalty = '+2';
          localStorage.setItem(sessionId, JSON.stringify(session));
          break;
        case 'DNF':
          session.list[index].penalty = 'DNF';
          localStorage.setItem(sessionId, JSON.stringify(session));
          break;
      }
    };

    /**
     * Removes a solve.
     * @param sessionId
     * @param index
     */
    self.remove = function(sessionId, index) {
      var session = JSON.parse(localStorage.getItem(sessionId));
      session.list.splice(index, 1);
      localStorage.setItem(sessionId, JSON.stringify(session));
    };

    /**
     * Adds or edits a comment for a solve.
     * @param sessionId
     * @param index
     * @param comment
     */
    self.comment = function(sessionId, index, comment) {
      console.log('comment ' + sessionId + ' - ' + index + ' - ' + comment);
    };

  }

  angular.module('results').service('ResultsPopoverService', ResultsPopoverService);

})();
