(function() {

  'use strict';

  var LocalStorage,
    key,
    value;

  describe('The localStorage service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      LocalStorage = $injector.get('LocalStorage');

      key = 'key';
      value = 'value';

    }));

    describe('get function', function() {

      it('should call the localStorage.getItem function with the key', function() {

        spyOn(localStorage, 'getItem').and.returnValue(value);

        expect(LocalStorage.get(key)).toEqual(value);
        expect(localStorage.getItem).toHaveBeenCalledWith(key);

      });

    });

    describe('set function', function() {

      it('should call the localStorage.setItem function with the key and value', function() {

        spyOn(localStorage, 'setItem').and.returnValue(undefined);

        expect(LocalStorage.set(key, value)).toBeTruthy();
        expect(localStorage.setItem).toHaveBeenCalledWith(key, value);

      });

      it('should return false if the localStorage.setItem function throws an error', function() {

        spyOn(localStorage, 'setItem').and.callFake(function() { throw new Error('uh oh, riley time!'); });

        expect(LocalStorage.set(key, value)).toBeFalsy();
        expect(localStorage.setItem).toHaveBeenCalledWith(key, value);

      });

    });

    describe('getJSON function', function() {

      it('should call the localStorage.getItem function with the key and parse the value as a JSON object', function() {

        spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ value: value }));

        expect(LocalStorage.getJSON(key)).toEqual({ value: value });
        expect(localStorage.getItem).toHaveBeenCalledWith(key);

      });

    });

    describe('setJSON function', function() {

      it('should call the localStorage.setItem function with the key and the stringified value', function() {

        spyOn(localStorage, 'setItem').and.returnValue(undefined);

        expect(LocalStorage.setJSON(key, { value: value })).toBeTruthy();
        expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify({ value: value }));

      });

      it('should return false if the localStorage.setItem function throws an error', function() {

        spyOn(localStorage, 'setItem').and.callFake(function() { throw new Error('uh oh, riley time!'); });

        expect(LocalStorage.setJSON(key, { value: value })).toBeFalsy();
        expect(localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify({ value: value }));

      });

    });

    describe('clear function', function() {

      it('should call the localStorage.clear function', function() {

        spyOn(localStorage, 'clear').and.returnValue(undefined);

        expect(LocalStorage.clear()).toBeTruthy();
        expect(localStorage.clear).toHaveBeenCalledWith();

      });

      it('should return false if the localStorage.clear function throws an error', function() {

        spyOn(localStorage, 'clear').and.callFake(function() { throw new Error('uh oh, riley time!'); });

        expect(LocalStorage.clear()).toBeFalsy();
        expect(localStorage.clear).toHaveBeenCalledWith();

      });

    });

  });

})();
