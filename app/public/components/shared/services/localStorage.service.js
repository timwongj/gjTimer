(function() {

  'use strict';

  function LocalStorage($q, $timeout) {

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
      } catch(err) {
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
     * Get a localStorage value as JSON given a key asynchronously.
     * @param key
     * @returns {null}
     */
    self.getJSONAsync = function(key) {

      return $q(function(resolve) {

        $timeout(function() {

          var value = localStorage.getItem(key);
          if (value !== null) {
            resolve(JSON.parse(value));
          } else {
            resolve(null);
          }

        }, 0);

      });

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
      } catch(err) {
        return false;
      }
    };

    /**
     * Set a localStorage (key, value) pair as a JSON string in local storage with error handling asynchronously.
     * @param key
     * @param value
     * @returns {boolean}
     */
    self.setJSONAsync = function(key, value) {

      return $q(function(resolve, reject) {

        $timeout(function() {

          try {
            localStorage.setItem(key, JSON.stringify(value));
            resolve();
          } catch(err) {
            reject(err);
          }

        }, 0);

      });

    };

    /**
     * Clears localStorage.
     * @returns {boolean}
     */
    self.clear = function() {
      try {
        localStorage.clear();
        return true;
      } catch(err) {
        return false;
      }
    };

  }

  angular.module('gjTimer.services').service('LocalStorage', ['$q', '$timeout', LocalStorage]);

})();
