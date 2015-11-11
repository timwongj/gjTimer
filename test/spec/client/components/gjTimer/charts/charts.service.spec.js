(function() {

  'use strict';

  var ChartsService;

  describe('The charts service', function() {

    beforeEach(module('gjTimer'));

    beforeEach(inject(function($injector) {

      ChartsService = $injector.get('ChartsService');

    }));

  });

})();
