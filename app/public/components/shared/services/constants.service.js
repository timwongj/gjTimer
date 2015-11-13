(function() {

  'use strict';

  function Constants() {

    var self = this;

    self.DNF = 864000000;

    self.TIMER_REFRESH_INTERVAL = 50;

    self.NUM_RESULTS_DISPLAYED = 50;

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

    var colorOptions = [
      { value: { 'background-color': '#FFFFFF'} }, // white
      { value: { 'background-color': '#EEEEEE'} }, // grey
      { value: { 'background-color': '#FFE5EE'} }, // pink
      { value: { 'background-color': '#FFCCCC'} }, // red
      { value: { 'background-color': '#FFE8D2'} }, // orange
      { value: { 'background-color': '#FFFFCC'} }, // yellow
      { value: { 'background-color': '#D7FFD7'} }, // green
      { value: { 'background-color': '#E5F5FF'} }, // blue
      { value: { 'background-color': '#FFE5FF'} }, // purple
      { value: { 'background-color': '#F1E3D4'} } // brown
    ];

    self.DEFAULT_SETTINGS = {
      input: 'Timer',
      inspection: false,
      bldMode: false,
      timerPrecision: 3,
      timerStartDelay: 0,
      showScramble: true,
      showCharts: true,
      saveScramble: true,
      resultsPrecision: 2,
      statisticsPrecision: 3,
      panelColor: { 'background-color': '#EEEEEE'},
      backgroundColor: { 'background-color': '#FFFFFF'}
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
          { value: 300, text: '0.3' },
          { value: 550, text: '0.55' }
        ]
      }, { id: 'showScramble',
        title: 'Show Scramble',
        options: [
          { value: true, text: 'Yes' },
          { value: false, text: 'No' }
        ]
      }, { id: 'showCharts',
        title: 'Show Charts',
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
      }, {
        id: 'panelColor',
        title: 'Panel Color',
        options: colorOptions
      }, {
        id: 'backgroundColor',
        title: 'Background Color',
        options: colorOptions
      }
    ];

  }

  angular.module('gjTimer.services').service('Constants', Constants);

})();
