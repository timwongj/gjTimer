(function() {

  'use strict';

  function StatisticsService(Calculator) {

    var self = this;

    self.getStatistics = function(results) {

      var best, rawTimes = Calculator.extractRawTimes(results);

      var statistics = {
        solves: {
          attempted: rawTimes.length,
          solved: Calculator.countNonDNFs(rawTimes),
          best: Calculator.convertTimeFromMillisecondsToString(Math.min.apply(null, rawTimes)),
          worst: Calculator.convertTimeFromMillisecondsToString(Math.max.apply(null, rawTimes))
        },
        sessionMean: {
          mean: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateSessionMean(rawTimes)),
          stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes, false))
        },
        sessionAvg: {
          avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes)),
          stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes, true))
        },
        averages: []
      };

      if (rawTimes.length >= 3) {
        best = Calculator.calculateBestMean(rawTimes, 3);
        statistics.averages.push({
          type: 'm',
          length: 3,
          current: {
            avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateMean(rawTimes.slice(rawTimes.length - 3, rawTimes.length))),
            stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes.slice(rawTimes.length - 3, rawTimes.length), false))
          },
          best: {
            avg: Calculator.convertTimeFromMillisecondsToString(best.mean),
            stDev: Calculator.convertTimeFromMillisecondsToString(best.stDev)
          }
        });
      }

      var typesOfAverages = [5, 12, 50, 100];

      for (var i = 0; i < typesOfAverages.length; i++) {
        if (rawTimes.length >= typesOfAverages[i]) {
          best = Calculator.calculateBestAverage(rawTimes, typesOfAverages[i]);
          statistics.averages.push({
            type: 'a',
            length: typesOfAverages[i],
            current: {
              avg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length))),
              stDev: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateStandardDeviation(rawTimes.slice(rawTimes.length - typesOfAverages[i], rawTimes.length), true))
            },
            best: {
              avg: Calculator.convertTimeFromMillisecondsToString(best.avg),
              stDev: Calculator.convertTimeFromMillisecondsToString(best.stDev)
            }
          });
        }
      }

      return statistics;

    };
    
  }

  angular.module('statistics').service('StatisticsService', ['Calculator', StatisticsService]);

})();
