(function() {

  'use strict';

  var Timer,
    eventId,
    element,
    $compile,
    $httpBackend,
    $scope,
    $rootScope;

  describe('The scramble directive', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      $compile = $injector.get('$compile');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      $scope.eventId = '333';
      $scope.scramble = 'scramble';

      element = '<scramble event-id="{{eventId}}" scramble="{{scramble}}"></scramble>';
      Timer = $compile(element)($scope);

      //$scope.$digest();
    }));

  });

})();
