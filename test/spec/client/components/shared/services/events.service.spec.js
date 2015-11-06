(function() {

  'use strict';

  var Events,
    events,
    event,
    eventId,
    eventName,
    style,
    svg;

  describe('The events service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      Events = $injector.get('Events');

    }));

    describe('getEvents function', function() {

      it('should return the list of events supported by gjTimer', function() {

        events = ['Rubik\'s Cube', '4x4 Cube', '5x5 Cube', '2x2 Cube', '3x3 blindfolded', '3x3 one-handed',
          'Megaminx', 'Pyraminx', 'Square-1', 'Rubik\'s Clock', '6x6 Cube', '7x7 Cube', '4x4 blindfolded', '5x5 blindfolded'];

        expect(Events.getEvents()).toEqual(events);

      });

    });

    describe('getEvent function', function() {

      it('should return the event given the eventId', function() {

        eventId = '555';
        event = Events.events[eventId].name;

        expect(Events.getEvent(eventId)).toEqual(event);

      });

      xit('should return null given an invalid eventId', function() {

        eventId = 'same';

        expect(Events.getEvent(eventId)).toBeNull();

      });

    });

    describe('getEventId function', function() {

      it('should return the eventId of the eventName', function() {

        eventName = '4x4 Cube';
        eventId = '444';

        expect(Events.getEventId(eventName)).toEqual(eventId);

      });

      it('should return null given an invalid eventName', function() {

        eventName = 'same';

        expect(Events.getEventId(eventName)).toBeNull();

      });

    });

    describe('getEventStyle function', function() {

      it('should return the eventStyle given the eventId', function() {

        eventId = 'minx';
        style = { 'font-size' : '13pt' };

        expect(Events.getEventStyle(eventId)).toEqual(style);

      });

      it('should return the eventStyle of the default event given an invalid eventId', function() {

        eventId = 'same';
        style = { 'font-size' : '16pt' };

        expect(Events.getEventStyle(eventId)).toEqual(style);

      });

    });

    describe('getEventSvg function', function() {

      it('should return the eventSvg given the eventId', function() {

        eventId = 'pyram';
        svg = { ratio: 0.69, width: 250 };

        expect(Events.getEventSvg(eventId)).toEqual(svg);

      });

      it('should return the eventSvg of the default event given an invalid eventId', function() {

        eventId = 'same';
        svg = { ratio: 0.75, width: 250 };

        expect(Events.getEventSvg(eventId)).toEqual(svg);

      });

    });

  });

})();
