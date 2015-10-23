(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('less', {
      development: {
        files: {
          'dist/css/gjTimer.css': 'dist/css/gjTimer.less'
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          'dist/css/gjTimer.css': 'dist/css/gjTimer.less'
        }
      }
    });

    grunt.registerTask('less', function() {
      grunt.task.run(['less']);
    });

    grunt.loadNpmTasks('grunt-contrib-less');

  }

})();