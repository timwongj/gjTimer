(function() {

  'use strict';

  function CubService($sce, Events) {

    var self = this;

    /**
     * Uses the jsss library to create an svg element of the scramble.
     * @param eventId
     * @param state
     * @returns {*}
     */
    self.drawScramble = function(eventId, state) {

      var width = Events.getEventSvg(eventId).width;
      var height = width / Events.getEventSvg(eventId).ratio;

      var el = document.createElement("div");
      scramblers[eventId].drawScramble(el, state, height, width);

      var tmp = document.createElement("div");
      tmp.appendChild(el);

      return $sce.trustAsHtml(tmp.innerHTML);

    };

  }

  angular.module('cub').service('CubService', ['$sce', 'Events', CubService]);

})();
