(function() {

  'use strict';

  var reverseFilter,
    items,
    reversedItems;

  describe('The reverse filter', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {
      reverseFilter = $injector.get('reverseFilter');
    }));

    it('should return the list of items in reverse order', function() {
      items = ['a', 'b', 'c'];
      reversedItems = ['c', 'b', 'a'];
      expect(reverseFilter(items)).toEqual(reversedItems);
    });

    it('should return an empty array if items is undefined', function() {
      items = undefined;
      expect(reverseFilter(items)).toEqual([]);
    });

  });

})();
