var Player =  require('./player.js');
var Land =  require('./land.js');

function Game() {
  'use strict';
  this.player = null;
  this.platforms = null;
  this.cursors = null;
}

Game.prototype = {

  create: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.addLand();
    this.addPlayer();
    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {
    this.game.physics.arcade.collide(this.player.sprite, this.map.blockedLayer, this.playerHit, null, this);

    if(this.player.sprite.y >= this.game.world.height) {
      this.game.state.start('menu');
    }
    // Reset the players velocity (movement)
    this.player.sprite.body.velocity.x = 0;
    if (this.cursors.left.isDown)
    {
      //  Move to the left
      this.player.sprite.body.velocity.x = -150;

      this.player.sprite.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
      //  Move to the right
      this.player.sprite.body.velocity.x = 150;

      this.player.sprite.animations.play('right');
    }
    else
    {
      //  Stand still
      this.player.sprite.animations.stop();

      this.player.sprite.frame = 4;
    }

    //  Allow the this.player.sprite to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.sprite.body.blocked.down)
    {
      this.player.sprite.body.velocity.y = -350;
    }
  },

  addLand: function () {
    this.map = new Land(this);
  },

  addPlayer: function () {
    this.player = new Player(this);
  }
};
module.exports = Game;
