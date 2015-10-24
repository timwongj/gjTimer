(function() {

  'use strict';

  function ScrambleService() {

    var self = this;

    self.getScramble = function() {
      return self.scramble;
    };

    self.newScramble = function(puzzle) {
      self.scramble = generateScramble(puzzle);
      return self.scramble;
    };

  }

  angular.module('scramble').service('ScrambleService', ScrambleService);

  function generateScramble(puzzle) {
    switch(puzzle) {
      case '2x2 Cube': return generate2x2Scramble(10);
      case 'Rubik\'s Cube': return generate3x3Scramble(20);
      case '4x4 Cube': return generate4x4Scramble(40);
      case '5x5 Cube': return generate5x5Scramble(60);
      case '6x6 Cube': return generate6x6Scramble(80);
      case '7x7 Cube': return generate7x7Scramble(100);
    }
  }

  function generate2x2Scramble(length)
  {
    var scramble = '', previousOrientation = -1;
    for (var i = 0; i < length; i++)
    {
      var turningOrientation = Math.floor((Math.random() * 3)), innerTurningLayer, turningDirection = Math.floor((Math.random() * 3));
      while (turningOrientation === previousOrientation)
      {
        turningOrientation = Math.floor((Math.random() * 3));
        innerTurningLayer = Math.floor((Math.random() * 2));
        turningDirection = Math.floor((Math.random() * 3));
      }
      if (turningOrientation === 0)
        scramble = scramble.concat('U');
      else if (turningOrientation === 1)
        scramble = scramble.concat('F');
      else if (turningOrientation === 2)
        scramble = scramble.concat('R');
      switch (turningDirection)
      {
        case 1: scramble = scramble.concat('\''); break;
        case 2: scramble = scramble.concat('2'); break;
      }
      previousOrientation = turningOrientation;
      if (i < length - 1)
        scramble = scramble.concat(' ');
    }
    return scramble;
  }

  function generate3x3Scramble(length)
  {
    var previousMove = -1, secondPreviousMove = -1, scramble = '';
    for (var i = 0; i < length; i++)
    {
      var move = Math.floor((Math.random() * 6)), direction = Math.floor((Math.random() * 3));
      if (((previousMove === 0) && (secondPreviousMove !== 1)) || ((previousMove === 1) && (secondPreviousMove !== 0)) || ((previousMove === 2) && (secondPreviousMove !== 3)) || ((previousMove === 3) && (secondPreviousMove !== 2)) || ((previousMove === 4) && (secondPreviousMove !== 5)) || ((previousMove === 5) && (secondPreviousMove !== 4)))
        secondPreviousMove = -1;
      while ((move === previousMove) || (move === secondPreviousMove))
        move = Math.floor((Math.random() * 6));
      switch (move)
      {
        case 0: scramble = scramble.concat('U'); break;
        case 1: scramble = scramble.concat('D'); break;
        case 2: scramble = scramble.concat('L'); break;
        case 3: scramble = scramble.concat('R'); break;
        case 4: scramble = scramble.concat('F'); break;
        case 5: scramble = scramble.concat('B'); break;
      }
      switch (direction)
      {
        case 1: scramble = scramble.concat('\''); break;
        case 2: scramble = scramble.concat('2'); break;
      }
      secondPreviousMove = previousMove;
      previousMove = move;
      if (i < length - 1)
        scramble = scramble.concat(' ');
    }
    return scramble;
  }

  function generate4x4Scramble(length)
  {
    var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
    for (var i = 0; i < length; i++)
    {
      var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 3)), innerTurningLayer = Math.floor((Math.random() * 2)), turningDirection = Math.floor((Math.random() * 3));
      if (turningOrientation !== previousOrientation)
        layersTurned = 0;
      switch (turningLayer)
      {
        case 0: temp = 1; break;
        case 1: temp = 2; break;
        case 2: temp = 4; break;
      }
      while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
      {
        turningOrientation = Math.floor((Math.random() * 3));
        turningLayer = Math.floor((Math.random() * 3));
        innerTurningLayer = Math.floor((Math.random() * 2));
        turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
      }
      if (turningOrientation === 0)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('U');
        else if (turningLayer === 2)
          scramble = scramble.concat('D');
        else if (innerTurningLayer === 0)
          scramble = scramble.concat('Uw');
        else
          scramble = scramble.concat('Dw');
      }
      else if (turningOrientation === 1)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('F');
        else if (turningLayer === 2)
          scramble = scramble.concat('B');
        else if (innerTurningLayer === 0)
          scramble = scramble.concat('Fw');
        else
          scramble = scramble.concat('Bw');
      }
      else if (turningOrientation === 2)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('L');
        else if (turningLayer === 2)
          scramble = scramble.concat('R');
        else if (innerTurningLayer === 0)
          scramble = scramble.concat('Lw');
        else
          scramble = scramble.concat('Rw');
      }
      switch (turningLayer)
      {
        case 0: layersTurned += 1; break;
        case 1: layersTurned += 2; break;
        case 2: layersTurned += 4; break;
      }
      switch (turningDirection)
      {
        case 1: scramble = scramble.concat('\''); break;
        case 2: scramble = scramble.concat('2'); break;
      }
      previousOrientation = turningOrientation;
      if (i < length - 1)
        scramble = scramble.concat(' ');
    }
    return scramble;
  }

  function generate5x5Scramble(length)
  {
    var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
    for (var i = 0; i < length; i++)
    {
      var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 4)), turningDirection = Math.floor((Math.random() * 3));
      if (turningOrientation !== previousOrientation)
        layersTurned = 0;
      switch (turningLayer)
      {
        case 0: temp = 1; break;
        case 1: temp = 2; break;
        case 2: temp = 4; break;
        case 3: temp = 8; break;
      }
      while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
      {
        turningOrientation = Math.floor((Math.random() * 3));
        turningLayer = Math.floor((Math.random() * 4));
        turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
      }
      if (turningOrientation === 0)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('U');
        else if (turningLayer === 1)
          scramble = scramble.concat('Uw');
        else if (turningLayer === 2)
          scramble = scramble.concat('Dw');
        else
          scramble = scramble.concat('D');
      }
      else if (turningOrientation === 1)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('F');
        else if (turningLayer === 1)
          scramble = scramble.concat('Fw');
        else if (turningLayer === 2)
          scramble = scramble.concat('Bw');
        else
          scramble = scramble.concat('B');
      }
      else if (turningOrientation === 2)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('L');
        else if (turningLayer === 1)
          scramble = scramble.concat('Lw');
        else if (turningLayer === 2)
          scramble = scramble.concat('Rw');
        else
          scramble = scramble.concat('R');
      }
      switch (turningLayer)
      {
        case 0: layersTurned += 1; break;
        case 1: layersTurned += 2; break;
        case 2: layersTurned += 4; break;
        case 3: layersTurned += 8; break;
      }
      switch (turningDirection)
      {
        case 1: scramble = scramble.concat('\''); break;
        case 2: scramble = scramble.concat('2'); break;
      }
      previousOrientation = turningOrientation;
      if (i < length - 1)
        scramble = scramble.concat(' ');
    }
    return scramble;
  }

  function generate6x6Scramble(length)
  {
    var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
    for (var i = 0; i < length; i++)
    {
      var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 5)), innerTurningLayer = Math.floor((Math.random() * 2)), turningDirection = Math.floor((Math.random() * 3));
      if (turningOrientation !== previousOrientation)
        layersTurned = 0;
      switch (turningLayer)
      {
        case 0: temp = 1; break;
        case 1: temp = 2; break;
        case 2: temp = 4; break;
        case 3: temp = 8; break;
        case 4: temp = 16; break;
      }
      while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
      {
        turningOrientation = Math.floor((Math.random() * 3));
        turningLayer = Math.floor((Math.random() * 5));
        innerTurningLayer = Math.floor((Math.random() * 2));
        turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
      }
      if (turningOrientation === 0)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('U');
        else if (turningLayer === 1)
          scramble = scramble.concat('D');
        else if (turningLayer === 2)
          scramble = scramble.concat('Uw');
        else if (turningLayer === 3)
          scramble = scramble.concat('Dw');
        else if (innerTurningLayer === 0)
          scramble = scramble.concat('3Uw');
        else
          scramble = scramble.concat('3Dw');
      }
      else if (turningOrientation === 1)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('F');
        else if (turningLayer === 1)
          scramble = scramble.concat('B');
        else if (turningLayer === 2)
          scramble = scramble.concat('Fw');
        else if (turningLayer === 3)
          scramble = scramble.concat('Bw');
        else if (innerTurningLayer === 0)
          scramble = scramble.concat('3Fw');
        else
          scramble = scramble.concat('3Bw');
      }
      else if (turningOrientation === 2)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('L');
        else if (turningLayer === 1)
          scramble = scramble.concat('R');
        else if (turningLayer === 2)
          scramble = scramble.concat('Lw');
        else if (turningLayer === 3)
          scramble = scramble.concat('Rw');
        else if (innerTurningLayer === 0)
          scramble = scramble.concat('3Lw');
        else
          scramble = scramble.concat('3Rw');
      }
      switch (turningLayer)
      {
        case 0: layersTurned += 1; break;
        case 1: layersTurned += 2; break;
        case 2: layersTurned += 4; break;
        case 3: layersTurned += 8; break;
        case 4: layersTurned += 16; break;
      }
      switch (turningDirection)
      {
        case 1: scramble = scramble.concat('\''); break;
        case 2: scramble = scramble.concat('2'); break;
      }
      previousOrientation = turningOrientation;
      if (i < length - 1)
        scramble = scramble.concat(' ');
    }
    return scramble;
  }

  function generate7x7Scramble(length)
  {
    var scramble = '', layersTurned = 0, previousOrientation = -1, temp = -1;
    for (var i = 0; i < length; i++)
    {
      var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 6)), turningDirection = Math.floor((Math.random() * 3));
      if (turningOrientation !== previousOrientation)
        layersTurned = 0;
      switch (turningLayer)
      {
        case 0: temp = 1; break;
        case 1: temp = 2; break;
        case 2: temp = 4; break;
        case 3: temp = 8; break;
        case 4: temp = 16; break;
        case 5: temp = 32; break;
      }
      while ((previousOrientation === turningOrientation) && ((temp & layersTurned) > 0))
      {
        turningOrientation = Math.floor((Math.random() * 3));
        turningLayer = Math.floor((Math.random() * 6));
        turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation !== previousOrientation)
          layersTurned = 0;
      }
      if (turningOrientation === 0)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('U');
        else if (turningLayer === 1)
          scramble = scramble.concat('D');
        else if (turningLayer === 2)
          scramble = scramble.concat('Uw');
        else if (turningLayer === 3)
          scramble = scramble.concat('Dw');
        else if (turningLayer === 4)
          scramble = scramble.concat('3Uw');
        else
          scramble = scramble.concat('3Dw');

      }
      else if (turningOrientation === 1)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('F');
        else if (turningLayer === 1)
          scramble = scramble.concat('B');
        else if (turningLayer === 2)
          scramble = scramble.concat('Fw');
        else if (turningLayer === 3)
          scramble = scramble.concat('Bw');
        else if (turningLayer === 4)
          scramble = scramble.concat('3Fw');
        else
          scramble = scramble.concat('3Bw');
      }
      else if (turningOrientation === 2)
      {
        if (turningLayer === 0)
          scramble = scramble.concat('L');
        else if (turningLayer === 1)
          scramble = scramble.concat('R');
        else if (turningLayer === 2)
          scramble = scramble.concat('Lw');
        else if (turningLayer === 3)
          scramble = scramble.concat('Rw');
        else if (turningLayer === 4)
          scramble = scramble.concat('3Lw');
        else
          scramble = scramble.concat('3Rw');
      }
      switch (turningLayer)
      {
        case 0: layersTurned += 1; break;
        case 1: layersTurned += 2; break;
        case 2: layersTurned += 4; break;
        case 3: layersTurned += 8; break;
        case 4: layersTurned += 16; break;
        case 5: layersTurned += 32; break;
      }
      switch (turningDirection)
      {
        case 1: scramble = scramble.concat('\''); break;
        case 2: scramble = scramble.concat('2'); break;
      }
      previousOrientation = turningOrientation;
      if (i < length - 1)
        scramble = scramble.concat(' ');
    }
    return scramble;
  }

})();
