(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    CubController,
    CubService,
    eventId,
    state;

  describe('The cub controller', function() {

    beforeEach(module('cub'));

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');

      eventId = '333';
      state = 'state';

      CubService = {
        drawScramble: function(event, state) {
          return event + state;
        }
      };

      spyOn($rootScope, '$broadcast').and.callThrough();
      spyOn(CubService, 'drawScramble').and.callThrough();

      CubController = $controller('CubController', {
        $scope: $scope,
        CubService: CubService
      });

      $scope.$digest();

    }));


    describe('draw scramble event', function() {

      it('should call the drawScramble function from the CubService with the eventId and state', function() {

        $rootScope.$broadcast('draw scramble', eventId, state);
        expect(CubService.drawScramble).toHaveBeenCalledWith(eventId, state);

      });

    });

  });

})();
