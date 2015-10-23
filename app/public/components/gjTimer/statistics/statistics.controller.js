(function() {

  'use strict';

  function StatisticsController($rootScope, StatisticsService) {

    var self = this;

    self.session = {};

    self.session.solves = [
      {
        time: '6.25',
        avg5: 'DNF',
        avg12: 'DNF'
      },
      {
        time: '6.44',
        avg5: 'DNF',
        avg12: 'DNF'
      }
    ];

  }

  angular.module('statistics').controller('StatisticsController', ['$rootScope', 'StatisticsService', StatisticsController]);

})();