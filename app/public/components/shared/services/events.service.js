(function() {

  'use strict';

  function Events() {

    var self = this;

    var events = {
      'Rubik\'s Cube': '333',
      '4x4 Cube': '444',
      '5x5 Cube': '555',
      '2x2 Cube': '222',
      '3x3 blindfolded': '333bf',
      '3x3 one-handed': '333oh',
      '3x3 fewest moves': '333fm',
      '3x3 with feet': '333ft',
      'Megaminx': 'minx',
      'Pyraminx': 'pyram',
      'Square-1': 'sq1',
      'Rubik\'s Clock': 'clock',
      'Skewb': 'skewb',
      '6x6 Cube': '666',
      '7x7 Cube': '777',
      '4x4 blindfolded': '444bf',
      '5x5 blindfolded': '555bf',
      '3x3 multi blind': '333mbf'
    };

    self.getEvents = function() {
      return events;
    };

    self.getEventId = function(event) {
      return events[event];
    };

  }

  angular.module('gjTimer').service('Events', Events);

})();
