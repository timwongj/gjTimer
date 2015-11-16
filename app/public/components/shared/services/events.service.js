(function() {

  'use strict';

  function Events() {

    var self = this;

    self.events = {
      '333': { index: 0, name: 'Rubik\'s Cube', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      '444': { index: 1, name: '4x4 Cube', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } },
      '555': { index: 2, name: '5x5 Cube', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } },
      '222': { index: 3, name: '2x2 Cube', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      '333bf': { index: 4, name: '3x3 blindfolded', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      '333oh': { index: 5, name: '3x3 one-handed', style: { 'font-size' : '16pt' }, svg: { ratio: 0.75, width: 250 } },
      'minx': { index: 6, name: 'Megaminx', style: { 'font-size' : '13pt' }, svg: { ratio: 0.51, width: 175 } },
      'pyram': { index: 7, name: 'Pyraminx', style: { 'font-size' : '16pt' }, svg: { ratio: 0.69, width: 250 } },
      'sq1': { index: 8, name: 'Square-1', style: { 'font-size' : '15pt' }, svg: { ratio: 0.57, width: 175 } },
      'clock': { index: 9, name: 'Rubik\'s Clock', style: { 'font-size' : '15pt' }, svg: { ratio: 0.50, width: 175 } },
      '666': { index: 10, name: '6x6 Cube', style: { 'font-size' : '13pt' }, svg: { ratio: 0.75, width: 250 } },
      '777': { index: 11, name: '7x7 Cube', style: { 'font-size' : '13pt' }, svg: { ratio: 0.75, width: 250 } },
      '444bf': { index: 12, name: '4x4 blindfolded', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } },
      '555bf': { index: 13, name: '5x5 blindfolded', style: { 'font-size' : '15pt' }, svg: { ratio: 0.75, width: 250 } }
    };

    /**
     * Gets the list of events supported by gjTimer.
     * @returns {string[]}
     */
    self.getEvents = function() {

      var events = [];
      angular.forEach(self.events, function(event) {
        events[event.index] = event.name;
      });
      return events;

    };

    /**
     * Gets the event given the eventId.
     * @param eventId
     * @returns {string} event
     */
    self.getEvent = function(eventId) {

      if (self.events.hasOwnProperty(eventId)) {
        return self.events[eventId].name;
      } else {
        return null;
      }

    };

    /**
     * Gets the eventId given the event.
     * @param eventName
     * @returns {string}
     */
    self.getEventId = function(eventName) {

      for (var eventId in self.events) {
        if (self.events.hasOwnProperty(eventId)) {
          if (self.events[eventId].name === eventName) {
            return eventId;
          }
        }
      }
      return null;

    };

    /**
     * Gets the css style for the scramble of the event.
     * @param eventId
     * @returns {object} style
     */
    self.getEventStyle = function(eventId) {

      if (self.events.hasOwnProperty(eventId)) {
        return self.events[eventId].style;
      } else {
        return self.events['333'].style;
      }

    };

    /**
     * Gets the svg properties of the event.
     * @param eventId
     * @returns {object}
     */
    self.getEventSvg = function(eventId) {

      if (self.events.hasOwnProperty(eventId)) {
        return self.events[eventId].svg;
      } else {
        return self.events['333'].svg;
      }

    };

  }

  angular.module('gjTimer.services').service('Events', Events);

})();
