module.exports = (function() {

  'use strict';

  var exports = {};

  exports.thirdPartyUnminifiedJs = [];

  exports.thirdPartyMinifiedJs = [
    // jquery
    'bower_components/jquery/dist/jquery.min.js',

    // bootstrap
    'bower_components/bootstrap/dist/js/bootstrap.min.js',

    // angular
    'bower_components/angular/angular.min.js',

    // angular-ui
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',

    // angular-spinkit
    'bower_components/angular-spinkit/build/angular-spinkit.min.js',

    // moment
    'bower_components/moment/min/moment.min.js',

    // angular-chart.js
    'bower_components/Chart.js/Chart.min.js',
    'bower_components/angular-chart.js/dist/angular-chart.min.js',

    // raphael
    'bower_components/jsss/lib/raphael-min.js',

    // jsss
    'bower_components/jsss/scramble_222.js',
    'bower_components/jsss/scramble_333.js',
    'bower_components/jsss/scramble_clock.js',
    'bower_components/jsss/scramble_minx.js',
    'bower_components/jsss/scramble_NNN.js',
    'bower_components/jsss/scramble_pyram.js',
    'bower_components/jsss/scramble_sq1.js'
  ];

  exports.gjTimerUnminifiedJs = [
    // gjTimerApp
    'app/public/components/app.js',

    // gjTimer
    'app/public/components/gjTimer/gjTimer.directive.js',
    'app/public/components/gjTimer/gjTimer.controller.js',

    // filters
    'app/public/components/shared/filters/reverse.filter.js',

    // services
    'app/public/components/shared/services/calculator.service.js',
    'app/public/components/shared/services/constants.service.js',
    'app/public/components/shared/services/events.service.js',
    'app/public/components/shared/services/localStorage.service.js',

    // Charts
    'app/public/components/gjTimer/charts/charts.directive.js',
    'app/public/components/gjTimer/charts/charts.controller.js',
    'app/public/components/gjTimer/charts/charts.service.js',
    
    // Cub
    'app/public/components/gjTimer/cub/cub.directive.js',
    'app/public/components/gjTimer/cub/cub.controller.js',
    'app/public/components/gjTimer/cub/cub.service.js',

    // MenuBar
    'app/public/components/gjTimer/menuBar/menuBar.directive.js',
    'app/public/components/gjTimer/menuBar/menuBar.controller.js',
    'app/public/components/gjTimer/menuBar/menuBar.service.js',

    // Results
    'app/public/components/gjTimer/results/results.directive.js',
    'app/public/components/gjTimer/results/results.controller.js',
    'app/public/components/gjTimer/results/results.service.js',

    // ResultsModal
    'app/public/components/gjTimer/resultsModal/resultsModal.controller.js',
    'app/public/components/gjTimer/resultsModal/resultsModal.service.js',

    // ResultsPopover
    'app/public/components/gjTimer/resultsPopover/resultsPopover.directive.js',
    'app/public/components/gjTimer/resultsPopover/resultsPopover.controller.js',

    // Scramble
    'app/public/components/gjTimer/scramble/scramble.directive.js',
    'app/public/components/gjTimer/scramble/scramble.controller.js',
    'app/public/components/gjTimer/scramble/scramble.service.js',

    // Settings
    'app/public/components/gjTimer/settings/settings.controller.js',

    // Statistics
    'app/public/components/gjTimer/statistics/statistics.directive.js',
    'app/public/components/gjTimer/statistics/statistics.controller.js',
    'app/public/components/gjTimer/statistics/statistics.service.js',

    // Timer
    'app/public/components/gjTimer/timer/timer.directive.js',
    'app/public/components/gjTimer/timer/timer.controller.js',
    'app/public/components/gjTimer/timer/timer.service.js'
  ];

  return exports;

})();
