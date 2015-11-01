(function() {

  'use strict';

  function Events() {

    var self = this;

    /**
     * Gets the list of events supported by gjTimer.
     * @returns {string[]}
     */
    self.getEvents = function() {

      return [
        'Rubik\'s Cube',
        '4x4 Cube',
        '5x5 Cube',
        '2x2 Cube',
        '3x3 blindfolded',
        '3x3 one-handed',
        'Megaminx',
        'Pyraminx',
        'Square-1',
        'Rubik\'s Clock',
        '6x6 Cube',
        '7x7 Cube',
        '4x4 blindfolded',
        '5x5 blindfolded'
      ];

    };

    /**
     * Gets the event given the eventId.
     * @param eventId
     * @returns {string} event
     */
    self.getEvent = function(eventId) {

      var events = {
        '333': 'Rubik\'s Cube',
        '444': '4x4 Cube',
        '555': '5x5 Cube',
        '222': '2x2 Cube',
        '333bf': '3x3 blindfolded',
        '333oh': '3x3 one-handed',
        'minx': 'Megaminx',
        'pyram': 'Pyraminx',
        'sq1': 'Square-1',
        'clock': 'Rubik\'s Clock',
        '666': '6x6 Cube',
        '777': '7x7 Cube',
        '444bf': '4x4 blindfolded',
        '555bf': '5x5 blindfolded'
      };

      if (events.hasOwnProperty(eventId)) {
        return events[eventId];
      } else {
        return null;
      }

    };

    self.getEventId = function(event) {

      var eventIds = {
        'Rubik\'s Cube': '333',
        '4x4 Cube': '444',
        '5x5 Cube': '555',
        '2x2 Cube': '222',
        '3x3 blindfolded': '333bf',
        '3x3 one-handed': '333oh',
        'Megaminx': 'minx',
        'Pyraminx': 'pyram',
        'Square-1': 'sq1',
        'Rubik\'s Clock': 'clock',
        '6x6 Cube': '666',
        '7x7 Cube': '777',
        '4x4 blindfolded': '444bf',
        '5x5 blindfolded': '555bf'
      };

      if (eventIds.hasOwnProperty(event)) {
        return eventIds[event];
      } else {
        return null;
      }

    };

    /**
     * Gets the css style for the scramble of the event.
     * @param eventId
     * @returns {object} style
     */
    self.getEventStyle = function(eventId) {

      var styles = {
        '333': { 'font-size' : '16pt' },
        '444': { 'font-size' : '15pt' },
        '555': { 'font-size' : '15pt' },
        '222': { 'font-size' : '16pt' },
        '333bf': { 'font-size' : '16pt' },
        '333oh': { 'font-size' : '16pt' },
        'minx': { 'font-size' : '13pt' },
        'pyram': { 'font-size' : '16pt' },
        'sq1': { 'font-size' : '15pt' },
        'clock': { 'font-size' : '15pt' },
        '666': { 'font-size' : '13pt' },
        '777': { 'font-size' : '13pt' },
        '444bf': { 'font-size' : '15pt' },
        '555bf': { 'font-size' : '15pt' }
      };

      if (styles.hasOwnProperty(eventId)) {
        return styles[eventId];
      } else {
        return styles['333'];
      }

    };

    /**
     * Gets the svg properties of the event.
     * @param eventId
     * @returns {object}
     */
    self.getEventSvg = function(eventId) {

      var svgs = {
        '333': { ratio: 0.75, width: 250 },
        '444': { ratio: 0.75, width: 250 },
        '555': { ratio: 0.75, width: 250 },
        '222': { ratio: 0.75, width: 250 },
        '333bf': { ratio: 0.75, width: 250 },
        '333oh': { ratio: 0.75, width: 250 },
        'minx': { ratio: 0.51, width: 175 },
        'pyram': { ratio: 0.69, width: 250 },
        'sq1': { ratio: 0.57, width: 175 },
        'clock': { ratio: 0.50, width: 175 },
        '666': { ratio: 0.75, width: 250 },
        '777': { ratio: 0.75, width: 250 },
        '444bf': { ratio: 0.75, width: 250 },
        '555bf': { ratio: 0.75, width: 250 }
      };

      if (svgs.hasOwnProperty(eventId)) {
        return svgs[eventId];
      } else {
        return svgs['333'];
      }

    };

  }

  angular.module('gjTimer').service('Events', Events);

})();
