(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('uglify', {
      gjTimerJs: {
        files: {
          'dist/js/gjTimer.min.js': ['dist/js/gjTimer.js']
        }
      },
      libJs: {
        files: {
          'dist/js/lib.min.js': ['dist/js/lib.js']
        }
      }
    });

    grunt.registerTask('uglify', function() {
      grunt.task.run(['uglify']);
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

  };

})();