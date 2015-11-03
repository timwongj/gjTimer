(function() {

  'use strict';

  function ResultsPopoverService(LocalStorage) {

    var self = this;

    /**
     * Changes the penalty for a solve.
     * @param sessionId
     * @param index
     * @param penalty
     */
    self.penalty = function(sessionId, index, penalty) {
      var session = LocalStorage.getJSON(sessionId);
      var result = session.results[index];
      var pen = result.substring(result.indexOf('|') - 1, result.indexOf('|'));
      switch(penalty) {
        case '':
          if ((pen === '+') || (pen === '-')) {
            result = result.substring(0, result.indexOf('|') - 1) + result.substring(result.indexOf('|'), result.length);
          }
          break;
        case '+2':
          if ((pen === '+') || (pen === '-')) {
            result = result.substring(0, result.indexOf('|') - 1) + '+' + result.substring(result.indexOf('|'), result.length);
          } else {
            result = result.substring(0, result.indexOf('|')) + '+' + result.substring(result.indexOf('|'), result.length);
          }
          break;
        case 'DNF':
          if ((pen === '+') || (pen === '-')) {
            result = result.substring(0, result.indexOf('|') - 1) + '-' + result.substring(result.indexOf('|'), result.length);
          } else {
            result = result.substring(0, result.indexOf('|')) + '-' + result.substring(result.indexOf('|'), result.length);
          }
          break;
      }
      session.results[index] = result;
      LocalStorage.setJSON(sessionId, session);
    };

    /**
     * Removes a solve.
     * @param sessionId
     * @param index
     */
    self.remove = function(sessionId, index) {
      var session = JSON.parse(localStorage.getItem(sessionId));
      session.results.splice(index, 1);
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

  angular.module('results').service('ResultsPopoverService', ['LocalStorage', ResultsPopoverService]);

})();
