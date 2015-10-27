(function() {

  'use strict';

  function ResultsController($scope, $rootScope, ResultsService) {

    var self = this;

    self.results = ResultsService.getResults($rootScope.sessionId);

    $scope.$on('refresh data', function() {
      self.results = ResultsService.getResults($rootScope.sessionId);
    });

  }

  angular.module('results').controller('ResultsController', ['$scope', '$rootScope', 'ResultsService', ResultsController]);

})();