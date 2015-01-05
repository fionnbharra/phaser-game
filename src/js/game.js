(function() {
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
      this.add.sprite(0, 0, 'sky');

      this.addLand();
      this.addPlayer();
      this.addStars();
      this.addScoreText();

      this.cursors = this.input.keyboard.createCursorKeys();
    },

    update: function () {
      this.physics.arcade.collide(this.player, this.platforms);
      this.physics.arcade.collide(this.stars, this.platforms);
      this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
      //  Reset the players velocity (movement)
      this.player.body.velocity.x = 0;

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
      if (this.cursors.up.isDown && this.player.body.touching.down)
      {
        this.player.body.velocity.y = -350;
      }
    },

    onInputDown: function () {
      this.game.state.start('menu');
    },

    addLand: function () {
      //  The platforms group contains the ground and the 2 ledges we can jump on
      this.platforms = this.add.group();

      //  We will enable physics for any object that is created in this group
      this.platforms.enableBody = true;

      // Here we create the ground.
      var ground = this.platforms.create(0, this.world.height - 64, 'ground');

      //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
      ground.scale.setTo(2, 2);

      //  This stops it from falling away when you jump on it
      ground.body.immovable = true;

      //  Now let's create two ledges
      var ledge = this.platforms.create(400, this.world.height/2, 'ground');

      ledge.body.immovable = true;

      ledge = this.platforms.create(-150, this.world.height/2, 'ground');

      ledge.body.immovable = true;
    },

    addPlayer: function () {
      // The player and its settings
      this.player = this.add.sprite(32, this.world.height - 150, 'player');

      //  We need to enable physics on the player
      this.physics.arcade.enable(this.player);

      //  Player physics properties. Give the little guy a slight bounce.
      this.player.body.bounce.y = 0.2;
      this.player.body.gravity.y = 300;
      this.player.body.collideWorldBounds = true;
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

  window['finbar'] = window['finbar'] || {};
  window['finbar'].Game = Game;

}());
