
'use strict';

function Game() {
  this.player = null;
  this.platforms = null;
  this.cursors = null;
  this.stars = null;
  this.score = 0;
  this.scoreText = null;
}

Game.prototype = {

  create: function () {

    this.physics.startSystem(Phaser.Physics.ARCADE);
    // this.add.sprite(0, 0, 'sky');

    this.addLand();
    this.addPlayer();

    // this.addScoreText();
    //
    this.cursors = this.input.keyboard.createCursorKeys();
  },

  update: function () {


    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    if(this.player.y >= this.game.world.height) {
      this.game.state.start('menu');

    }
    // //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0;
    //
    if (this.cursors.left.isDown)
    {
      //  Move to the left
      this.player.body.velocity.x = -150;

      this.player.animations.play('left');
    }
    else if (this.cursors.right.isDown)
    {
      //  Move to the right
      this.player.body.velocity.x = 150;

      this.player.animations.play('right');
    }
    else
    {
      //  Stand still
      this.player.animations.stop();

      this.player.frame = 4;
    }

    //  Allow the this.player to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.body.blocked.down)
    {
      this.player.body.velocity.y = -350;
    }
  },

  onInputDown: function () {
    this.game.state.start('menu');
  },

  addLand: function () {


    this.map = this.game.add.tilemap('level1');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    //
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
    //
    // //create layers
    //
    this.backgroundlayer = this.map.createLayer('backgroundLayer');
    //
    this.blockedLayer = this.map.createLayer('blockedLayer');
    //
    // //collision on blockedLayer
    //
    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions

    this.backgroundlayer.resizeWorld();

  },

  addPlayer: function () {
    // The player and its settings
    this.player = this.add.sprite(32, this.world.height - 550, 'player');

    //  We need to enable physics on the player
    this.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.game.camera.follow(this.player);
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
  },

  addStars: function() {
    this.stars = this.add.group();

    this.stars.enableBody = true;
    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
      //  Create a star inside of the 'stars' group
      var star = this.stars.create(i * 70, 0, 'star');

      //  Let gravity do its thing
      star.body.gravity.y = 500;

      //  This just gives each star a slightly random bounce value
      star.body.bounce.y = 0.4 + Math.random() * 0.2;
    }
  },

  collectStar: function (player, star) {
    star.kill();
    this.score += 10;
    this.scoreText.text = 'score: ' + this.score;
  },

  addScoreText: function () {
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  }
};
module.exports = Game;
