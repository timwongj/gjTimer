(function() {

  'use strict';

  function LocalStorage() {

    var self = this;

    /**
     * Get a localStorage value given a key.
     * @param key
     */
    self.get = function(key) {
      return localStorage.getItem(key);
    };

    /**
     * Set a localStorage (key, value) pair in local storage with error handling.
     * @param key
     * @param value
     * @returns {boolean}
     */
    self.set = function(key, value) {
      try {
        localStorage.setItem(key, value);
        return true;
      } catch(e) {
        console.error('Error saving to local storage');
        return false;
      }
    };

    /**
     * Get a localStorage value as JSON given a key.
     * @param key
     * @returns {null}
     */
    self.getJSON = function(key) {
      var value = localStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      } else {
        return null;
      }
    };

    /**
     * Set a localStorage (key, value) pair as a JSON string in local storage with error handling.
     * @param key
     * @param value
     * @returns {boolean}
     */
    self.setJSON = function(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch(e) {
        console.error('Error saving to local storage');
        return false;
      }
    };

  }

  angular.module('gjTimer').service('LocalStorage', LocalStorage);

})();
