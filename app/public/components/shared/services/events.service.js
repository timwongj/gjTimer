(function() {

  'use strict';

  function Events() {

    var self = this;

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

    var eventSvgs = {
      'Rubik\'s Cube': { ratio: 0.75, width: 250 },
      '4x4 Cube': { ratio: 0.75, width: 250 },
      '5x5 Cube': { ratio: 0.75, width: 250 },
      '2x2 Cube': { ratio: 0.75, width: 250 },
      '3x3 blindfolded': { ratio: 0.75, width: 250 },
      '3x3 one-handed': { ratio: 0.75, width: 250 },
      'Megaminx': { ratio: 0.51, width: 175 },
      'Pyraminx': { ratio: 0.69, width: 250 },
      'Square-1': { ratio: 0.57, width: 175 },
      'Rubik\'s Clock': { ratio: 0.50, width: 175 },
      '6x6 Cube': { ratio: 0.75, width: 250 },
      '7x7 Cube': { ratio: 0.75, width: 250 },
      '4x4 blindfolded': { ratio: 0.75, width: 250 },
      '5x5 blindfolded': { ratio: 0.75, width: 250 }
    };

    var eventStyles = {
      'Rubik\'s Cube': { 'font-size' : '16pt' },
      '4x4 Cube': { 'font-size' : '15pt' },
      '5x5 Cube': { 'font-size' : '15pt' },
      '2x2 Cube': { 'font-size' : '16pt' },
      '3x3 blindfolded': { 'font-size' : '16pt' },
      '3x3 one-handed': { 'font-size' : '16pt' },
      'Megaminx': { 'font-size' : '13pt' },
      'Pyraminx': { 'font-size' : '16pt' },
      'Square-1': { 'font-size' : '15pt' },
      'Rubik\'s Clock': { 'font-size' : '15pt' },
      '6x6 Cube': { 'font-size' : '13pt' },
      '7x7 Cube': { 'font-size' : '13pt' },
      '4x4 blindfolded': { 'font-size' : '15pt' },
      '5x5 blindfolded': { 'font-size' : '15pt' }
    };

    /**
     * Gets the list of events supported by gjTimer.
     * @returns {}
     */
    self.getEvents = function() {

      return eventIds;

    };

    /**
     * Gets the eventId of the event.
     * @param event
     * @returns {*}
     */
    self.getEventId = function(event) {

      if (eventIds.hasOwnProperty(event)) {
        return eventIds[event];
      } else {
        return eventIds['Rubik\'s Cube'];
      }

    };

    /**
     * Gets the css style for the scramble of the event.
     * @param event
     * @returns {*}
     */
    self.getEventStyle = function(event) {

      if (eventStyles.hasOwnProperty(event)) {
        return eventStyles[event];
      } else {
        return eventStyles['Rubik\'s Cube'];
      }

    };

    /**
     * Gets the svg properties of the event.
     * @param event
     * @returns {*}
     */
    self.getEventSvg = function(event) {

      if (eventSvgs.hasOwnProperty(event)) {
        return eventSvgs[event];
      } else {
        return eventSvgs['Rubik\'s Cube'];
      }

    };

  }

  angular.module('gjTimer').service('Events', Events);

})();
