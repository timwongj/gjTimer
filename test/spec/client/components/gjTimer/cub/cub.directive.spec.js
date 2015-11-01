(function() {

  'use strict';

  var Cub,
    eventId,
    element,
    $compile,
    $httpBackend,
    $scope,
    $rootScope;

  describe('The cub directive', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      $compile = $injector.get('$compile');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      $scope.eventId = '333';

      element = '<cub eventId="{{eventId}}"></cub>';
      Cub = $compile(element)($scope);

      //$scope.$digest();

    }));

    it('should dose gj', function() {

    });

  });

})();
