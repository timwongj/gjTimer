(function() {

  'use strict';

  var items,
    reversedItems;

  describe('The reverse filter', function() {

    beforeEach(module('gjTimer'));

    it('has a reverse filter', inject(function($filter) {

      expect($filter('reverse')).not.toBeNull();

    }));

    it('should return the list of items in reverse order', function(reverseFilter) {

      items = ['a', 'b', 'c'];
      reversedItems = ['c', 'b', 'a'];

      expect(reverseFilter(items)).toEqual(reversedItems);

    });

    it('should return an empty array if items is undefined', function(reverseFilter) {

      items = undefined;

      expect(reverseFilter(items)).toEqual([]);

    });

  });

})();
