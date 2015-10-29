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

    var eventSvg = {
      'Rubik\'s Cube': { ratio: 0.75, width: 200 },
      '4x4 Cube': { ratio: 0.75, width: 200 },
      '5x5 Cube': { ratio: 0.75, width: 200 },
      '2x2 Cube': { ratio: 0.75, width: 200 },
      '3x3 blindfolded': { ratio: 0.75, width: 200 },
      '3x3 one-handed': { ratio: 0.75, width: 200 },
      'Megaminx': { ratio: 0.51, width: 150 },
      'Pyraminx': { ratio: 0.69, width: 200 },
      'Square-1': { ratio: 0.57, width: 150 },
      'Rubik\'s Clock': { ratio: 0.50, width: 150 },
      '6x6 Cube': { ratio: 0.75, width: 200 },
      '7x7 Cube': { ratio: 0.75, width: 200 },
      '4x4 blindfolded': { ratio: 0.75, width: 200 },
      '5x5 blindfolded': { ratio: 0.75, width: 200 }
    };

    self.getEvents = function() {
      return eventIds;
    };

    self.getEventId = function(event) {
      return eventIds[event];
    };

    self.getEventSvg = function(event) {
      return eventSvg[event];
    };

  }

  angular.module('gjTimer').service('Events', Events);

})();
