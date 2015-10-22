(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('clean', {
      files: ['dist', 'index.html']
    });

    grunt.registerTask('clean', function() {
      grunt.task.run(['clean']);
    });

    grunt.loadNpmTasks('grunt-contrib-clean');

  }

})();