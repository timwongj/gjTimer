(function() {

  'use strict';

  module.exports = function(config) {

    var jsIncludes = require('../../../app/lib/jsIncludes');
    var files = [];
    files = files.concat(jsIncludes.thirdPartyMinifiedJs);
    files = files.concat('bower_components/angular-mocks/angular-mocks.js');
    files = files.concat(jsIncludes.gjTimerUnminifiedJs);
    files = files.concat('test/spec/**/*.spec.js');
    files = files.concat('dist/**/*.html');

    config.set({
      basePath: '../../..',
      frameworks: ['jasmine'],
      singleRun: true,
      browsers: ['PhantomJS'],
      files: files,
      reporters: ['progress', 'coverage'],
      preprocessors: {
        'app/public/components/**/*.js': ['coverage']
      },
      coverageReporter: {
        dir: './coverage',
        reporters: [
          { type: 'html', subdir: 'report-html' }
        ]
      },
      plugins: [
        'karma-phantomjs-launcher',
        'karma-jasmine',
        'karma-coverage'
      ]
    });

  };

})();
