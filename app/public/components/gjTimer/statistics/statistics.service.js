(function() {

  'use strict';

  function StatisticsService(Calculator) {

    var self = this;

    self.getStatistics = function(results) {

      var rawTimes = Calculator.extractRawTimes(results);

      var statistics = {
        solves: {
          attempted: rawTimes.length,
          solved: Calculator.countNonDNFs(rawTimes),
          best: Calculator.convertTimeFromMillisecondsToString(Math.min.apply(null, rawTimes)),
          worst: Calculator.convertTimeFromMillisecondsToString(Math.max.apply(null, rawTimes))
        },
        sessionMean: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateSessionMean(rawTimes)),
        sessionAvg: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes))
      };

      if (rawTimes.length >= 3) {
        statistics.mo3 = {
          current: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateMean(rawTimes.slice(rawTimes.length - 5, rawTimes.length - 2))),
          best: ''
        };
      }

      if (rawTimes.length >= 5) {
        statistics.avg5 = {
          current: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(rawTimes.length - 7, rawTimes.length - 2))),
          best: ''
        };
      }

      if (rawTimes.length >= 12) {
        statistics.avg12 = {
          current: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(rawTimes.length - 14, rawTimes.length - 2))),
          best: ''
        };
      }

      if (rawTimes.length >= 50) {
        statistics.avg50 = {
          current: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(rawTimes.length - 52, rawTimes.length - 2))),
          best: ''
        };
      }

      if (rawTimes.length >= 100) {
        statistics.avg100 = {
          current: Calculator.convertTimeFromMillisecondsToString(Calculator.calculateAverage(rawTimes.slice(rawTimes.length - 102, rawTimes.length - 2))),
          best: ''
        };
      }

      return statistics;

    };
    
  }

  angular.module('statistics').service('StatisticsService', ['Calculator', StatisticsService]);

})();
