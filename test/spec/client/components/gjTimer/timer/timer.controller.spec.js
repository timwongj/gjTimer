(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    TimerController,
    TimerService,
    $interval,
    $timeout;

  describe('The scramble controller', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      $interval = $injector.get('$interval');
      $timeout = $injector.get('$timeout');
      TimerService = $injector.get('TimerService');

      TimerController = $controller('ScrambleController', {
        $scope: $scope,
        $rootScope: $rootScope,
        $interval: $interval,
        $timeout: $timeout,
        TimerService: TimerService
      });

      $scope.$digest();

    }));

    describe('keydown event', function() {

    });

    describe('keyup event', function() {

    });

  });

})();
