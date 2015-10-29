(function() {

  'use strict';

  function ResultsController($scope, $rootScope, ResultsService) {

    var self = this;
    var precision = 2;

    self.results = ResultsService.getResults($rootScope.sessionId, precision);

    $scope.$on('refresh data', function() {
      self.results = ResultsService.getResults($rootScope.sessionId, precision);
    });

  }

  angular.module('results').controller('ResultsController', ['$scope', '$rootScope', 'ResultsService', ResultsController]);

})();