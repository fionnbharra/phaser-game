function Player(game) {
  'use strict';
  this.game = game;
  this.sprite = game.add.sprite(32, game.world.height - 550, 'player');
}

Player.prototype = {
};

module.exports = Player;
