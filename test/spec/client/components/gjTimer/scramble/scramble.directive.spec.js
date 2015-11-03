(function() {

  'use strict';

  var Scramble,
    eventId,
    element,
    $compile,
    $httpBackend,
    $scope,
    $rootScope;

  describe('The timer directive', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      $compile = $injector.get('$compile');
      $httpBackend = $injector.get('$httpBackend');
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();

      $scope.eventId = '333';
      $scope.scramble = 'scramble';
      $scope.sessionId = 'session1';
      $scope.settings = {};

      element = '<timer event-id="{{eventId}}" scramble="{{scramble}}" session-id="{{sessionId}}" settings="{{settings}}"></timer>';
      Scramble = $compile(element)($scope);

      //$scope.$digest();

    }));

    it('should dose gj', function() {

    });

  });

})();
