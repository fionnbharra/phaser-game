function Player(game) {
  'use strict';
  this.player = null;
  this.game = game;
  return this.init(game);
}

Player.prototype = {
  init: function(game){
    this.player = game.add.sprite(32, game.world.height - 550, 'player');
    return this.player;
  }
};

module.exports = Player;
