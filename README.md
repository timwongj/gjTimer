[![Build Status](https://travis-ci.org/timwongj/gjTimer.svg?branch=master)](https://travis-ci.org/timwongj/gjTimer)

gjTimer
=========

gjTimer is a client side Rubik's Cube timer built with angularJS that uses local storage to save results.

## Usage:

#### To simply run the app:

    $ curl -O -L https://npmjs.org/install.sh
  
    $ sudo sh install.sh

    $ sudo npm install -g http-server
  
    $ http-server
  
Navigate to localhost:8080 on your browser.
  
#### To build and run the app:

    $ npm install
  
    $ bower install

    $ grunt:prod

    $ http-server
  
#### To run the tests:

    $ npm test
    
Coverage reports are located in the ./coverage directory.
  
#### To run in development mode:
  
    $ grunt
    
## Resources

gjTimer uses jsss for scrambling and displaying the state of the puzzles.
This library is publicly available on GitHub and can be found here:
https://github.com/cubing/jsss
