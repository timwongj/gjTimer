(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('concat', {
      gjTimerJs: {
        src: [
          'app/public/components/gjTimer/app.js',
          'app/public/components/gjTimer/gjTimer.controller.js',
          'app/public/components/gjTimer/gjTimer.service.js'
        ],
        dest: 'dist/js/gjTimer.js'
      },
      libJs: {
        src: [
          'bower_components/jquery/dist/jquery.min.js',
          'bower_components/jquery-ui/jquery-ui.min.js',
          'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'bower_components/angular/angular.min.js',
          'bower_components/angular-bootstrap/ui-bootstrap.min.js'
        ],
        dest: 'dist/js/lib.min.js'
      },
      gjTimerLess: {
        src: [
          'app/public/less/gjTimer.less'
        ],
        dest: 'dist/css/gjTimer.less'
      },
      libCss: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
          'bower_components/components-font-awesome/css/font-awesome.min.css'
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