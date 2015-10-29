(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('karma', {
      unit: {
        options: {
          frameworks: ['jasmine'],
          singleRun: true,
          browsers: ['PhantomJS'],
          files: [
            // third party dependencies
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap.min.js',
            'bower_components/moment/min/moment.min.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/jsss/scramble_222.js',
            'bower_components/jsss/scramble_333.js',
            'bower_components/jsss/scramble_clock.js',
            'bower_components/jsss/scramble_minx.js',
            'bower_components/jsss/scramble_NNN.js',
            'bower_components/jsss/scramble_pyram.js',
            'bower_components/jsss/scramble_sq1.js',
            'bower_components/jsss/lib/raphael-min.js',

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
            'app/public/components/gjTimer/results/results.service.js',

            // Timer
            'app/public/components/gjTimer/timer/timer.directive.js',
            'app/public/components/gjTimer/timer/timer.controller.js',
            'app/public/components/gjTimer/timer/timer.service.js',

            'test/spec/**/*.spec.js'
          ]
        }
      }
    });

    grunt.registerTask('karma', function() {
      grunt.task.run(['karma']);
    });

    grunt.loadNpmTasks('grunt-karma');

  }

})();