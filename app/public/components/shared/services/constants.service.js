(function() {

  'use strict';

  function Constants() {

    var self = this;

    self.DNF = 864000000;

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

    self.DEFAULT_SETTINGS = {
      input: 'Timer',
      inspection: false,
      bldMode: false,
      timerPrecision: 3,
      timerStartDelay: 0,
      timerRefreshInterval: 50,
      showScramble: true,
      saveScramble: true,
      resultsPrecision: 2,
      statisticsPrecision: 3
    };

    self.SETTINGS = [
      {
        id: 'input',
        title: 'Input',
        options: [
          { value: 'Timer', text: 'Timer' },
          { value: 'Typing', text: 'Typing'}
        ]
      }, {
        id: 'inspection',
        title: 'Inspection',
        options: [
          { value: true, text: 'On' },
          { value: false, text: 'Off' }
        ]
      }, { id: 'bldMode',
        title: 'BLD Mode',
        options: [
          { value: true, text: 'On' },
          { value: false, text: 'Off' }
        ]
      }, { id: 'timerPrecision',
        title: 'Timer Precision',
        options: [
          { value: 0, text: '0' },
          { value: 1, text: '0.1' },
          { value: 2, text: '0.01' },
          { value: 3, text: '0.001' }
        ]
      }, { id: 'timerStartDelay',
        title: 'Timer Start Delay',
        options: [
          { value: 0, text: '0' },
          { value: 100, text: '0.1' },
          { value: 500, text: '0.5' },
          { value: 1000, text: '1' }
        ]
      }, { id: 'timerRefreshInterval',
        title: 'Timer Refresh',
        options: [
          { value: 50, text: '0.05' },
          { value: 100, text: '0.1' },
          { value: 500, text: '0.5' },
          { value: 1000, text: '1' }
        ]
      }, { id: 'showScramble',
        title: 'Show Scramble',
        options: [
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
        ]
      }, { id: 'saveScramble',
        title: 'Save Scramble',
        options: [
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
        ]
      }, { id: 'resultsPrecision',
        title: 'Results Precision',
        options: [
          { value: 2, text: '0.01' },
          { value: 3, text: '0.001' }
        ]
      }, {
        id: 'statisticsPrecision',
        title: 'Stats Precision',
        options: [
          { value: 2, text: '0.01' },
          { value: 3, text: '0.001' }
        ]
      }
    ];

  }

  angular.module('gjTimer.services').service('Constants', Constants);

})();
