(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    $uibModal,
    $q,
    $timeout,
    ResultsController,
    ResultsService,
    sessionId,
    precision,
    results;

  describe('The results controller', function() {

    beforeEach(module('ui.bootstrap'));
    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      $uibModal = $injector.get('$uibModal');
      ResultsService = $injector.get('ResultsService');
      $q = $injector.get('$q');
      $timeout = $injector.get('$timeout');

      results = [26, 23, 19];
      sessionId = 'Session 69';
      precision = 2;

      spyOn(ResultsService, 'getResultsAsync').and.returnValue($q.resolve(results));
      spyOn($rootScope, '$broadcast');
      spyOn($uibModal, 'open');

      ResultsController = $controller('ResultsController', {
        $scope: $scope,
        $rootScope: $rootScope,
        $uibModal: $uibModal,
        ResultsService: ResultsService
      }, {
        results: results,
        sessionId: sessionId,
        settings: {
          resultsPrecision: precision
        }
      });

      $scope.$digest();
    }));

    describe('refresh results event', function() {
      it('should call the getResults function from the ResultsService with the sessionId and precision', function() {
        $rootScope.$broadcast('refresh results', sessionId);
        $timeout.flush();
        $timeout.verifyNoPendingTasks();
        expect(ResultsService.getResultsAsync).toHaveBeenCalledWith(sessionId, precision);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('refresh statistics', results);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('refresh charts', results);
      });
    });

    describe('openModal function', function() {
      describe('when the index is greater than or equal to the number of results', function () {
        it('should call the open function from the $uibModal service', function() {
          ResultsController.openModal(5, 5);
          expect($uibModal.open).toHaveBeenCalled();
        });
      });

      describe('when the index is not greater than or equal to the number of results', function() {
        it('should call the open function from the $uibModal service', function() {
          ResultsController.openModal(1, 5);
          expect($uibModal.open).not.toHaveBeenCalled();
        });
      });

    });

  });

})();
