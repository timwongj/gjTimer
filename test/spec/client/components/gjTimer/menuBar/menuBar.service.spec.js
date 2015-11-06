(function() {

  'use strict';

  var MenuBarService,
    LocalStorage;

  describe('The menuBar service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      MenuBarService = $injector.get(MenuBarService);
      LocalStorage = $injector.get(LocalStorage);

    }));

    describe('initSettings function', function() {

    });

    describe('saveSettings function', function() {

    });

    describe('initSessions function', function() {

    });

    describe('initSession function', function() {

    });

    describe('getSession function', function() {

    });

    describe('changeSession function', function() {

    });

    describe('resetSession function', function() {

    });

    describe('changeEvent function', function() {

    });

    describe('resetAll function', function() {

    });

  });

})();
