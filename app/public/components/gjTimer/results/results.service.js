(function() {

  'use strict';

  function ResultsService($q, $timeout, LocalStorage, Calculator, Constants) {

    var self = this;

    var DNF = Constants.DNF;

    /**
     * Gets results for the session.
     * @param sessionId
     * @param precision
     */
    self.getResultsAsync = function(sessionId, precision) {

      return LocalStorage.getJSONAsync(sessionId)
        .then(function(session) {

          var results = [], rawResults = session.results;

          for (var i = 0; i < rawResults.length; i++) {

            var res = rawResults[i].split('|');

            var result = {
              index: i,
              scramble: res[1],
              date: new Date(Number(res[2])),
              comment: res[3] ? res[3] : ''
            };

            // deal with penalty if it exists
            if (res[0].substring(res[0].length - 1, res[0].length) === '+') {
              result.time = Number(res[0].substring(0, res[0].length - 1));
              result.penalty = '+2';
              result.rawTime = Number((result.time + 2000).toFixed());
              result.displayedTime = Calculator.convertTimeFromMillisecondsToString(Number(res[0].substring(0, res[0].length - 1)) + 2000, precision) + '+';
              result.detailedTime = result.displayedTime;
            } else if (res[0].substring(res[0].length - 1, res[0].length) === '-') {
              result.time = Number(res[0].substring(0, res[0].length - 1));
              result.penalty = 'DNF';
              result.rawTime = DNF;
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

          var rawTimes = Calculator.extractRawTimes(results);

          for (var j = 0; j < results.length; j++) {
            results[j] = populateAverages(rawTimes, results[j], j, precision);
          }

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

          var rawTimes = Calculator.extractRawTimes(results);
          rawTimes.push(Calculator.extractRawTimes([result])[0]);
          result = populateAverages(rawTimes, result, result.index, precision);

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
     * @param result
     * @param sessionId
     * @param index
     * @param penalty
     * @param precision
     */
    self.penaltyAsync = function(result, sessionId, index, penalty, precision) {

      return LocalStorage.getJSONAsync(sessionId)
        .then(function(session) {

          var res = session.results[index];
          var pen = res.substring(res.indexOf('|') - 1, res.indexOf('|'));

          switch(penalty) {
            case '':
              result.penalty = '';
              result.rawTime = result.time;
              result.displayedTime = Calculator.convertTimeFromMillisecondsToString(result.time, precision);
              result.detailedTime = result.displayedTime;
              if ((pen === '+') || (pen === '-')) {
                res = res.substring(0, res.indexOf('|') - 1) + res.substring(res.indexOf('|'), res.length);
              }
              break;
            case '+2':
              result.penalty = '+2';
              result.rawTime = result.time + 2000;
              result.displayedTime = Calculator.convertTimeFromMillisecondsToString(result.time + 2000, precision) + '+';
              result.detailedTime = result.displayedTime;
              if ((pen === '+') || (pen === '-')) {
                res = res.substring(0, res.indexOf('|') - 1) + '+' + res.substring(res.indexOf('|'), res.length);
              } else {
                res = res.substring(0, res.indexOf('|')) + '+' + res.substring(res.indexOf('|'), res.length);
              }
              break;
            case 'DNF':
              result.penalty = 'DNF';
              result.rawTime = Constants.DNF;
              result.displayedTime = 'DNF';
              result.detailedTime = 'DNF(' + Calculator.convertTimeFromMillisecondsToString(result.time, precision) + ')';
              if ((pen === '+') || (pen === '-')) {
                res = res.substring(0, res.indexOf('|') - 1) + '-' + res.substring(res.indexOf('|'), res.length);
              } else {
                res = res.substring(0, res.indexOf('|')) + '-' + res.substring(res.indexOf('|'), res.length);
              }
              break;
          }

          session.results[index] = res;

          LocalStorage.setJSONAsync(sessionId, session)
            .catch(function(err) {
              reject(err);
            });

        });

    };

    /**
     * Removes a solve.
     * @param results
     * @param sessionId
     * @param index
     */
    self.removeAsync = function(results, sessionId, index) {

      results.splice(index, 1);

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
     * @param result
     * @param sessionId
     * @param index
     * @param comment
     */
    self.commentAsync = function(result, sessionId, index, comment) {

      result.comment = comment;

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
     * Populate avg5 and avg12 field
     * @param rawTimes
     * @param result
     * @param index
     * @param precision
     * @returns {*}
     */
    function populateAverages(rawTimes, result, index, precision) {

      if (index >= 4) {
        result.avg5 = Calculator.calculateAverageString(rawTimes.slice(index - 4, index + 1), true, precision);
      } else {
        result.avg5 = 'DNF';
      }

      if (index >= 11) {
        result.avg12 = Calculator.calculateAverageString(rawTimes.slice(index - 11, index + 1), true, precision);
      } else {
        result.avg12 = 'DNF';
      }

      return result;

    }

  }

  angular.module('results').service('ResultsService', ['$q', '$timeout', 'LocalStorage', 'Calculator', 'Constants', ResultsService]);

})();
