(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    ChartsController;

  describe('The charts controller', function() {

    beforeEach(module('charts'));

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');

      ChartsController = $controller('ChartsController', {

      });

      $scope.$digest();

    }));
    

  });

})();
