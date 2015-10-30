(function() {

  'use strict';

  function CubService($sce, Events) {

    var self = this;

    /**
     * Uses the jsss library to create an svg element of the scramble.
     * @param event
     * @param state
     * @returns {*}
     */
    self.drawScramble = function(event, state) {

      var width = Events.getEventSvg(event).width;
      var height = width / Events.getEventSvg(event).ratio;

      var el = document.createElement("div");
      scramblers[Events.getEventId(event)].drawScramble(el, state, height, width);

      var tmp = document.createElement("div");
      tmp.appendChild(el);

      return $sce.trustAsHtml(tmp.innerHTML);

    };

  }

  angular.module('cub').service('CubService', ['$sce', 'Events', CubService]);

})();
