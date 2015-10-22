(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('uglify', {
      gjTimerJs: {
        files: {
          'dist/js/gjTimer.min.js': ['dist/js/gjTimer.js']
        }
      }
    });

    grunt.registerTask('uglify', function() {
      grunt.task.run(['uglify']);
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

  }

})();