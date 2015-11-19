(function() {

  'use strict';

  function ResultsService($q, $timeout, LocalStorage, Calculator, Constants) {

    var self = this;

    /**
     * Gets results for the session.
     * @param sessionId
     * @param precision
     */
    self.getResultsAsync = function(sessionId, precision) {

      return LocalStorage.getJSONAsync(sessionId)
        .then(function(session) {

          var results = [], result, res, pen, rawResults = session.results;

          for (var i = 0; i < rawResults.length; i++) {

            res = rawResults[i].split('|');

            result = {
              index: i,
              scramble: res[1],
              date: new Date(Number(res[2])),
              comment: res[3] ? res[3] : ''
            };

            // deal with penalty if it exists
            pen = res[0].substring(res[0].length - 1, res[0].length);
            if (pen === '+') {
              result.time = Number(res[0].substring(0, res[0].length - 1));
              result.penalty = '+2';
              result.rawTime = Number((result.time + 2000).toFixed());
              result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)) + 2000, precision) + '+';
              result.detailedTime = result.displayedTime;
            } else if (pen === '-') {
              result.time = Number(res[0].substring(0, res[0].length - 1));
              result.penalty = 'DNF';
              result.rawTime = Constants.DNF;
              result.displayedTime = 'DNF';
              result.detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)), precision) + ')';
            } else {
              result.time = Number(res[0]);
              result.penalty = '';
              result.rawTime = result.time;
              result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0]), precision);
              result.detailedTime = result.displayedTime;
            }

            results.push(result);

          }

          populateAverages(results, precision);

          return results;

        });

    };

    /**
     * Saves the result in the format of 'Time in milliseconds'|'Scramble'|'Date in milliseconds'.
     * @param results
     * @param time
     * @param penalty
     * @param comment
     * @param scramble
     * @param sessionId
     * @param precision
     * @param saveScramble
     * @returns {{comment: *, date: Date, detailedTime: string, displayedTime: string, index: *, penalty: *, rawTime: number, scramble: *, time: number}}
     */
    self.saveResultAsync = function(results, time, penalty, comment, scramble, sessionId, precision, saveScramble) {

      return $q(function(resolve, reject) {

        $timeout(function() {

          var timeMilliseconds = Calculator.convertTimeFromStringToMilliseconds(time);
          var timeStringWithPrecision = Calculator.convertTimeFromMillisecondsToString(timeMilliseconds, precision);

          var result = {
            comment: comment,
            date: new Date(),
            detailedTime: timeStringWithPrecision,
            displayedTime: timeStringWithPrecision,
            index: results.length,
            penalty: penalty,
            rawTime: timeMilliseconds,
            scramble: scramble,
            time: timeMilliseconds
          };

          var timeString = Calculator.convertTimeFromStringToMilliseconds(time);
          switch(penalty) {
            case '+2':
              result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Calculator.convertTimeFromStringToMilliseconds(time) + 2000, precision) + '+';
              result.detailedTime = result.displayedTime;
              timeString += '+';
              break;
            case 'DNF':
              result.displayedTime = 'DNF';
              result.detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(Calculator.convertTimeFromStringToMilliseconds(time), precision) + ')';
              timeString += '-';
              break;
          }

          results.push(result);

          populateAverages(results, precision);

          LocalStorage.getJSONAsync(sessionId)
            .then(function(session) {
              session.results.push(timeString + '|' + (saveScramble ? scramble : '') + '|' + Date.now() + (comment !== '' ? '|' + comment : ''));
              LocalStorage.setJSONAsync(sessionId, session)
                .catch(function(err) {
                  reject(err);
                });
            });

          resolve(result);

        }, 0);

      });

    };

    /**
     * Changes the penalty for a solve.
     * @param results
     * @param index
     * @param sessionId
     * @param penalty
     * @param precision
     * @returns {*}
     */
    self.penaltyAsync = function(results, index, sessionId, penalty, precision) {

      results[index].penalty = penalty;

      switch(penalty) {
        case '':
          results[index].rawTime = results[index].time;
          results[index].displayedTime = Calculator.convertTimeFromMillisecondsToString(results[index].time, precision);
          results[index].detailedTime = results[index].displayedTime;
          break;
        case '+2':
          results[index].rawTime = results[index].time + 2000;
          results[index].displayedTime = Calculator.convertTimeFromMillisecondsToString(results[index].time + 2000, precision) + '+';
          results[index].detailedTime = results[index].displayedTime;
          break;
        case 'DNF':
          results[index].rawTime = Constants.DNF;
          results[index].displayedTime = 'DNF';
          results[index].detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(results[index].time, precision) + ')';
          break;
      }

      populateAverages(results, precision);

      return LocalStorage.getJSONAsync(sessionId)
        .then(function(session) {

          var res = session.results[index];
          var pen = res.substring(res.indexOf('|') - 1, res.indexOf('|'));

          switch(penalty) {
            case '':
              if ((pen === '+') || (pen === '-')) {
                res = res.substring(0, res.indexOf('|') - 1) + res.substring(res.indexOf('|'), res.length);
              }
              break;
            case '+2':
              if ((pen === '+') || (pen === '-')) {
                res = res.substring(0, res.indexOf('|') - 1) + '+' + res.substring(res.indexOf('|'), res.length);
              } else {
                res = res.substring(0, res.indexOf('|')) + '+' + res.substring(res.indexOf('|'), res.length);
              }
              break;
            case 'DNF':
              if ((pen === '+') || (pen === '-')) {
                res = res.substring(0, res.indexOf('|') - 1) + '-' + res.substring(res.indexOf('|'), res.length);
              } else {
                res = res.substring(0, res.indexOf('|')) + '-' + res.substring(res.indexOf('|'), res.length);
              }
              break;
          }

          session.results[index] = res;

          return LocalStorage.setJSONAsync(sessionId, session);

        });

    };

    /**
     * Removes a result from results.
     * @param results
     * @param index
     * @param sessionId
     * @param precision
     * @returns {*}
     */
    self.removeAsync = function(results, index, sessionId, precision) {

      results.splice(index, 1);

      for (var i = 0; i < results.length; i++) {
        results[i].index = i;
      }

      populateAverages(results, precision);

      return LocalStorage.getJSONAsync(sessionId)
        .then(function(session) {

          session.results.splice(index, 1);

          LocalStorage.setJSONAsync(sessionId, session)
            .catch(function(err) {
              reject(err);
            });

        });

    };

    /**
     * Adds or edits a comment for a solve.
     * @param results
     * @param index
     * @param sessionId
     * @param comment
     * @returns {*}
     */
    self.commentAsync = function(results, index, sessionId, comment) {

      results[index].comment = comment;

      return LocalStorage.getJSONAsync(sessionId)
        .then(function(session) {

          var res = session.results[index].split('|');

          if (comment !== '') {
            if (res[3]) {
              res[3] = comment;
              session.results[index] = res.join('|');
            } else {
              session.results[index] = session.results[index] + '|' + comment;
            }
          } else if (res[3]) {
            res.splice(3, 1);
            session.results[index] = res.join('|');
          }

          LocalStorage.setJSONAsync(sessionId, session)
            .catch(function(err) {
              reject(err);
            });

        });

    };

    /**
     * Populates the avg5 and avg12 for every result in results.
     * @param results
     * @param precision
     * @returns {*}
     */
    function populateAverages(results, precision) {

      var rawTimes = Calculator.extractRawTimes(results);

      for (var i = 0; i < results.length; i++) {
        results[i].avg5 = i > 3 ? Calculator.calculateAverageString(rawTimes.slice(i - 4, i + 1), true, precision) : 'DNF';
        results[i].avg12 = i > 10 ? Calculator.calculateAverageString(rawTimes.slice(i - 11, i + 1), true, precision) : 'DNF';
      }
      
    }

  }

  angular.module('results').service('ResultsService', ['$q', '$timeout', 'LocalStorage', 'Calculator', 'Constants', ResultsService]);

})();
