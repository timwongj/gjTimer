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
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery-ui/jquery-ui.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/angular-resource/angular-resource.min.js',
            'bower_components/angular-mocks/angular-mocks.js',

            // gjTimerApp
            'app/public/components/app.js',

            // gjTimer
            'app/public/components/gjTimer/gjTimer.directive.js',
            'app/public/components/gjTimer/gjTimer.controller.js',

            // filters
            'app/public/components/shared/filters/reverse.filter.js',

            // Cub
            'app/public/components/gjTimer/cub/cub.directive.js',
            'app/public/components/gjTimer/cub/cub.controller.js',
            'app/public/components/gjTimer/cub/cub.service.js',

            // Scramble
            'app/public/components/gjTimer/scramble/scramble.directive.js',
            'app/public/components/gjTimer/scramble/scramble.controller.js',
            'app/public/components/gjTimer/scramble/scramble.service.js',

            // Menu
            'app/public/components/gjTimer/menu/menuBar.directive.js',
            'app/public/components/gjTimer/menu/menuBar.controller.js',
            'app/public/components/gjTimer/menu/menuBar.service.js',

            // Statistics
            'app/public/components/gjTimer/statistics/statistics.directive.js',
            'app/public/components/gjTimer/statistics/statistics.controller.js',
            'app/public/components/gjTimer/statistics/statistics.service.js',

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