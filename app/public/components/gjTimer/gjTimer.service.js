(function() {

  'use strict';

  function GjTimerService(LocalStorage, Constants) {

    var self = this;

    /**
     * Initializes or gets the eventId from local storage.
     * @returns {string}
     */
    self.initEvent = function() {

      var eventId = LocalStorage.get('eventId');
      if (eventId) {
        return eventId;
      } else {
        LocalStorage.set('eventId', '333');
        return '333';
      }

    };

    /**
     * Initializes or gets session number from local storage.
     * @returns {string}
     */
    self.initSession = function() {

      var sessionId = LocalStorage.get('sessionId');

      if (sessionId) {
        return sessionId;
      } else {
        LocalStorage.set('sessionId', 'Session 1');
        return 'Session 1';
      }

    };

    /**
     * Gets settings from local storage or initializes it if it doesn't exist.
     * @returns {*}
     */
    self.initSettings = function() {
      var settings = LocalStorage.getJSON('settings');
      if (settings === null) {
        LocalStorage.setJSON('settings', Constants.DEFAULT_SETTINGS);
        return Constants.DEFAULT_SETTINGS;
      } else {
        for (var key in Constants.DEFAULT_SETTINGS) {
          if (Constants.DEFAULT_SETTINGS.hasOwnProperty(key)) {
            if (!settings.hasOwnProperty(key)) {
              settings[key] = Constants.DEFAULT_SETTINGS[key];
              LocalStorage.setJSON('settings', settings);
            }
          }
        }
        return settings;
      }
    };

  }

  angular.module('gjTimer').service('gjTimerService', ['LocalStorage', 'Constants', GjTimerService]);

})();
