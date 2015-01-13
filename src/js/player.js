function Player(game) {
  'use strict';
  this.sprite = game.add.sprite(32, game.world.height - 550, 'player');
  this.enablePhysics(game);
  this.enableControls(game);
}

Player.prototype = {
  enablePhysics: function(game) {
    game.physics.arcade.enable(this.sprite);
    //  Player physics properties. Give the little guy a slight bounce.
    this.sprite.body.bounce.y = 0.2;
    this.sprite.body.gravity.y = 300;
  },
  enableControls: function(game) {
    game.camera.follow(this.sprite);
    this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
  }
};

module.exports = Player;
