(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('concat', {
      gjTimerJs: {
        src: [
          // gjTimerApp
          'app/public/components/app.js',

          // gjTimer
          'app/public/components/gjTimer/gjTimer.directive.js',
          'app/public/components/gjTimer/gjTimer.controller.js',

          // filters
          'app/public/components/shared/filters/reverse.filter.js',

          // services
          'app/public/components/shared/services/events.service.js',

          // Cub
          'app/public/components/gjTimer/cub/cub.directive.js',
          'app/public/components/gjTimer/cub/cub.controller.js',
          'app/public/components/gjTimer/cub/cub.service.js',

          // Scramble
          'app/public/components/gjTimer/scramble/scramble.directive.js',
          'app/public/components/gjTimer/scramble/scramble.controller.js',
          'app/public/components/gjTimer/scramble/scramble.service.js',

          // Menu
          'app/public/components/gjTimer/menuBar/menuBar.directive.js',
          'app/public/components/gjTimer/menuBar/menuBar.controller.js',
          'app/public/components/gjTimer/menuBar/menuBar.service.js',

          // Results
          'app/public/components/gjTimer/results/results.directive.js',
          'app/public/components/gjTimer/results/results.controller.js',
          'app/public/components/gjTimer/results/resultsModal.controller.js',
          'app/public/components/gjTimer/results/resultsPopover.controller.js',
          'app/public/components/gjTimer/results/results.service.js',

          // Timer
          'app/public/components/gjTimer/timer/timer.directive.js',
          'app/public/components/gjTimer/timer/timer.controller.js',
          'app/public/components/gjTimer/timer/timer.service.js'
        ],
        dest: 'dist/js/gjTimer.js'
      },
      libJs: {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'bower_components/angular/angular.min.js',
          'bower_components/angular-bootstrap/ui-bootstrap.min.js',
          'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
          'bower_components/moment/min/moment.min.js',
          'bower_components/jsss/scramble_222.js',
          'bower_components/jsss/scramble_333.js',
          'bower_components/jsss/scramble_clock.js',
          'bower_components/jsss/scramble_minx.js',
          'bower_components/jsss/scramble_NNN.js',
          'bower_components/jsss/scramble_pyram.js',
          'bower_components/jsss/scramble_sq1.js',
          'bower_components/jsss/lib/raphael-min.js'
        ],
        dest: 'dist/js/lib.js'
      },
      gjTimerLess: {
        src: [
          'app/public/less/gjTimer.less',
          'app/public/less/cub.less',
          'app/public/less/scramble.less',
          'app/public/less/menuBar.less',
          'app/public/less/results.less',
          'app/public/less/resultsModal.less',
          'app/public/less/resultsPopover.less',
          'app/public/less/timer.less'
        ],
        dest: 'dist/css/gjTimer.less'
      },
      libCss: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dest: 'dist/css/lib.css'
      }
    });

    grunt.registerTask('concat', function() {
      grunt.task.run(['concat']);
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

  }

})();