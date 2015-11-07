(function() {

  'use strict';

  function Constants() {

    var self = this;

    self.KEY_CODES = {
      ENTER: 13,
      ESCAPE: 27,
      SPACE_BAR: 32
    };

    self.COLORS = {
      BLACK: '#000000',
      RED: '#FF0000',
      ORANGE: '#FFA500',
      GREEN: '#2EB82E',
      BLUE: '#0000FF',
      GRAY: '#EEEEEE',
      WHITE: '#FFFFFF'
    };

    self.STYLES = {
      COLOR: {
        BLACK: { 'color': self.COLORS.BLACK },
        RED: { 'color': self.COLORS.RED },
        ORANGE: { 'color': self.COLORS.ORANGE },
        GREEN: { 'color': self.COLORS.GREEN },
        BLUE: { 'color': self.COLORS.BLUE }
      },
      BACKGROUND_COLOR: {
        GRAY: { 'background-color': self.COLORS.GRAY },
        WHITE: { 'background-color': self.COLORS.WHITE }
      }
    };

    self.SESSIONS = {
      DEFAULT_NUMBER_OF_SESSIONS: 15
    };

    self.SETTINGS = {
      DEFAULT_SETTINGS: {
        input: 'Timer',
        inspection: 'Off',
        bldMode: 'Off',
        timerStartDelay: 0,
        timerPrecision: 3,
        timerRefreshInterval: 50,
        showScramble: 'Yes',
        saveScrambles: 'Yes',
        resultsPrecision: 2,
        statisticsPrecision: 3
      }
    };

    self.DNF = 864000000;

  }

  angular.module('gjTimer.services').service('Constants', Constants);

})();
