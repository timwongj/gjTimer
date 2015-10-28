(function() {

  'use strict';

  module.exports = function(grunt) {

    grunt.config('watch', {
      html: {
        files: ['app/**/*.html'],
        tasks: ['copy']
      },
      js: {
        files: ['app/**/*.js', 'test/**/*', 'grunt/**/*', 'Gruntfile.js'],
        tasks: ['jshint', 'concat', 'uglify:gjTimerJs']
      },
      css: {
        files: ['app/public/less/*.less'],
        tasks: ['concat', 'less:development']
      }
    });

    grunt.registerTask('watch', function() {
      grunt.task.run(['watch']);
    });

    grunt.loadNpmTasks('grunt-contrib-watch');

  }

})();