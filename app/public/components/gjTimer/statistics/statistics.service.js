(function() {

  'use strict';

  function StatisticsService(Calculator) {

    var self = this;

    /**
     * Get statistics.
     * @param results
     * @param precision
     * @returns {{solves: {attempted: number, solved: number, best: string, worst: string}, sessionMean: ({mean, stDev}|string), sessionAvg: {avg: string, stDev: string}, averages: Array}}
     */
    self.getStatistics = function(results, precision) {

      var rawTimes = Calculator.extractRawTimes(results);

      var statistics = {
        solves: {
          attempted: rawTimes.length,
          solved: Calculator.countNonDNFs(rawTimes),
          best: Calculator.convertTimeFromMillisecondsToString(Math.min.apply(null, rawTimes), precision),
          worst: Calculator.convertTimeFromMillisecondsToString(Math.max.apply(null, rawTimes), precision)
        },
        sessionMean: Calculator.calculateSessionMeanAndStandardDeviationString(rawTimes, precision),
        sessionAvg: {
          avg: Calculator.calculateAverageString(rawTimes, true, precision),
          stDev: Calculator.calculateStandardDeviationString(rawTimes, true, precision)
        },
        averages: []
      };

      if (rawTimes.length >= 3) {
        statistics.averages.push({
          type: 'm',
          length: 3,
          current: {
            avg: Calculator.calculateAverageString(rawTimes.slice(rawTimes.length - 3, rawTimes.length), false, precision),
            stDev: Calculator.calculateStandardDeviationString(rawTimes.slice(rawTimes.length - 3, rawTimes.length), false, precision)
          },
          best: Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, false, 3, precision)
        });
      }

      var typesOfAverages = [5, 12, 50, 100];

      for (var i = 0; i < typesOfAverages.length; i++) {
        if (rawTimes.length >= typesOfAverages[i]) {
          statistics.averages.push({
            type: 'a',
            length: typesOfAverages[i],
            current: {
              avg: Calculator.calculateAverageString(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length), true, precision),
              stDev: Calculator.calculateStandardDeviationString(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length), true, precision)
            },
            best: Calculator.calculateBestAverageAndStandardDeviationString(rawTimes, true, typesOfAverages[i], precision)
          });
        }
      }

      return statistics;

    };
    
  }

  angular.module('statistics').service('StatisticsService', ['Calculator', StatisticsService]);

})();
