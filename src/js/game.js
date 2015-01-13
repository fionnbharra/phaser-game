var Player =  require('./player.js');
var Map =  require('./map.js');

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
    this.game.physics.arcade.collide(this.player, this.map.blockedLayer, this.playerHit, null, this);

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
    this.map = new Map(this);
  },

  addPlayer: function () {
    // The player and its settings
    this.player.sprite = new Player();

    //  We need to enable physics on the player
    this.physics.arcade.enable(this.player.sprite);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.sprite.body.bounce.y = 0.2;
    this.player.sprite.body.gravity.y = 300;
    this.game.camera.follow(this.player.sprite);
    this.player.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
  }
};
module.exports = Game;
