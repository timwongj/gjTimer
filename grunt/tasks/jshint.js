(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('jshint', {
      files: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js', 'grunt/**/*.js']
    });

    grunt.registerTask('jshint', function() {
      grunt.task.run(['jshint']);
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

  };

})();