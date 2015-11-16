(function() {

  'use strict';

  module.exports = function(grunt) {

    var jsIncludes = require('../../app/lib/jsIncludes');
    var cssIncludes = require('../../app/lib/cssIncludes');

    grunt.config('concat', {
      gjTimerJs: {
        src: jsIncludes.gjTimerUnminifiedJs,
        dest: 'dist/js/gjTimer.js'
      },
      libJs: {
        src: jsIncludes.thirdPartyMinifiedJs,
        dest: 'dist/js/lib.js'
      },
      gjTimerLess: {
        src: cssIncludes.gjTimerLess,
        dest: 'dist/css/gjTimer.less'
      },
      libCss: {
        src: cssIncludes.thirdPartyUnminifiedCss,
        dest: 'dist/css/lib.css'
      }
    });

    grunt.registerTask('concat', function() {
      grunt.task.run(['concat']);
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

  };

})();