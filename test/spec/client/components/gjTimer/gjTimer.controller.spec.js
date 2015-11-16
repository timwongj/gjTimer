(function() {

  'use strict';

  var $controller,
    $scope,
    $rootScope,
    GjTimerController,
    Constants,
    $event,
    event;

  describe('The scramble controller', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $controller = $injector.get('$controller');
      Constants = $injector.get('Constants');

      $scope.eventId = '333fm';
      $scope.settings = Constants.DEFAULT_SETTINGS;

      $event = '$event';
      event = {
        preventDefault: function() {}
      };

      spyOn($rootScope, '$broadcast');
      spyOn(event, 'preventDefault');

      GjTimerController = $controller('gjTimerController', {
        $scope: $scope,
        $rootScope: $rootScope,
        Constants: Constants
      });

      $scope.$digest();

    }));

    describe('keydown function', function() {
      describe('when not typing a comment', function() {
        describe('when the key code is enter and the entry mode is not typing', function() {
          it('should broadcast a new scramble with the eventId', function() {
            event.keyCode = Constants.KEY_CODES.ENTER;
            $rootScope.isTyping = false;
            $scope.keydown($event, event);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('new scramble', $scope.eventId);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('keydown', $event);
            expect(event.preventDefault).not.toHaveBeenCalled();
          });
        });

        describe('when the key code is spacebar', function() {
          it('should prevent the default behavior', function() {
            event.keyCode = Constants.KEY_CODES.SPACE_BAR;
            $scope.keydown($event, event);
            expect($rootScope.$broadcast).not.toHaveBeenCalledWith('new scramble', $scope.eventId);
            expect($rootScope.$broadcast).toHaveBeenCalledWith('keydown', $event);
            expect(event.preventDefault).toHaveBeenCalledWith();
          });
        });
      });
    });

    describe('keyup function', function() {
      it('should broadcast keyup when not typing a comment', function() {
        $scope.keyup($event);
        expect($rootScope.$broadcast).toHaveBeenCalledWith('keyup', $event);
      });
    });

    describe('timer focus event', function() {
      it('should change the styles to focus on the timer', function() {
        $rootScope.$broadcast.and.callThrough();
        $rootScope.$broadcast('timer focus');
        expect($scope.style.body).not.toBeUndefined();
        expect($scope.settings.backgroundColor).toEqual(Constants.DEFAULT_SETTINGS.panelColor);
        expect($scope.style.section).not.toBeUndefined();
        expect($scope.style.timer).not.toBeUndefined();
      });
    });

    describe('timer unfocus event', function() {
      it('should change the styles to unfocus on the timer', function() {
        $scope.style.body = { 'style': 'style' };
        $rootScope.$broadcast.and.callThrough();
        $rootScope.$broadcast('timer unfocus');
        expect($scope.settings.backgroundColor).toEqual($scope.style.body);
        expect($scope.style.section).not.toBeUndefined();
        expect($scope.style.timer).toEqual({});
      });
    });

  });

})();
