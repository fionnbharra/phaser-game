'use strict';

var
  expect = require('chai').expect,
  sinon = require('sinon'),
  Player = require('../../src/js/player.js');

describe('Player', function() {
  var game = {
    add: {
      sprite: function(width, height, imageRef) {
        return {}
      }
    },
    world: {
      height: 0
    }
  };

  it('has a sprite', function() {
    expect(new Player(game).sprite).to.be.an('object');
  });
});
