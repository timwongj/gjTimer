(function() {

  'use strict';

  module.exports = function(grunt) {

    var jsIncludes = require('../../app/lib/jsIncludes');
    var files = [];
    files = files.concat(jsIncludes.thirdPartyMinifiedJs);
    files = files.concat(['bower_components/angular-mocks/angular-mocks.js']);
    files = files.concat(jsIncludes.gjTimerUnminifiedJs);
    files = files.concat(['test/spec/**/*.spec.js']);

    grunt.config('karma', {
      unit: {
        options: {
          frameworks: ['jasmine'],
          singleRun: true,
          browsers: ['PhantomJS'],
          files: files
        }
      }
    });

    grunt.registerTask('karma', function() {
      grunt.task.run(['karma']);
    });

    grunt.loadNpmTasks('grunt-karma');

  }

})();