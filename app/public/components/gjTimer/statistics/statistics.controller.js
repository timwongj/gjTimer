(function() {

  'use strict';

  function StatisticsController($scope, StatisticsService, Events) {

    var self = this;

    self.event = Events.getEvent($scope.eventId);

    $scope.$watch('results', function() {
      self.statistics = StatisticsService.getStatistics($scope.results);
    });

  }

  angular.module('statistics').controller('StatisticsController', ['$scope', 'StatisticsService', 'Events', StatisticsController]);

})();
