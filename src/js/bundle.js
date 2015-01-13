(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.onload = function () {
  'use strict';

  var game; 

  game = new Phaser.Game(746, 420, Phaser.AUTO, 'finbar-game');
  game.state.add('boot', require('./boot.js'));
  game.state.add('preloader', require('./preloader.js'));
  game.state.add('menu', require('./menu.js'));
  game.state.add('game', require('./game.js'));

  game.state.start('boot');
};

},{"./boot.js":2,"./game.js":3,"./menu.js":5,"./preloader.js":7}],2:[function(require,module,exports){
function Boot() {
  'use strict';
}
 
Boot.prototype = {

  preload: function () {
    this.load.image('preloader', 'assets/preloader.gif');
  },

  create: function () {
    this.game.input.maxPointers = 1;

    if (this.game.device.desktop) {
      this.game.scale.pageAlignHorizontally = true;
    } else {
      this.game.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth =  480;
      this.game.scale.minHeight = 260;
      this.game.scale.maxWidth = 640;
      this.game.scale.maxHeight = 480;
      this.game.scale.forceLandscape = true;
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.setScreenSize(true);
    }
    this.game.state.start('preloader');
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){
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

},{"./map.js":4,"./player.js":6}],4:[function(require,module,exports){
function Map(game) {
  'use strict';

  this.game = game;
  return this.init();
}

Map.prototype = {
  init: function(){
    this.map = this.game.add.tilemap('level1');

    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
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
    return this;
  }
};

module.exports = Map;

},{}],5:[function(require,module,exports){
'use strict';

function Menu() {
  this.titleTxt = null;
  this.startTxt = null;
}

Menu.prototype = {

  create: function () {
    var x = this.game.width / 2
      , y = this.game.height / 2;


    this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Example Game' );
    this.titleTxt.align = 'center';
    this.titleTxt.x = this.game.width / 2 - this.titleTxt.textWidth / 2;

    y = y + this.titleTxt.height + 5;
    this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'START');
    this.startTxt.align = 'center';
    this.startTxt.x = this.game.width / 2 - this.startTxt.textWidth / 2;

    this.input.onDown.add(this.onDown, this);
  },

  update: function () {

  },

  onDown: function () {
    this.game.state.start('game');
  }
};

module.exports = Menu;

},{}],6:[function(require,module,exports){
function Player(game) {
  'use strict';
  this.game = game;
  this.sprite = game.add.sprite(32, game.world.height - 550, 'player');
}

Player.prototype = {
};

module.exports = Player;

},{}],7:[function(require,module,exports){
'use strict';

function Preloader() {
  this.asset = null;
  this.ready = false;
}

Preloader.prototype = {

  preload: function () {
    this.asset = this.add.sprite(320, 240, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);


    this.load.tilemap('level1', 'assets/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/tiles_spritesheet.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.spritesheet('player', 'assets/player.png', 32, 48);
    this.load.image('star', 'assets/star.png');
    this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
  },

  create: function () {
    this.asset.cropEnabled = false;
  },

  update: function () {
    if (!!this.ready) {
      this.game.state.start('menu');
    }
  },

  onLoadComplete: function () {
    this.ready = true;
  }
};

module.exports = Preloader;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9ib290LmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvbWFwLmpzIiwic3JjL2pzL21lbnUuanMiLCJzcmMvanMvcGxheWVyLmpzIiwic3JjL2pzL3ByZWxvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgZ2FtZTsgXG5cbiAgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg3NDYsIDQyMCwgUGhhc2VyLkFVVE8sICdmaW5iYXItZ2FtZScpO1xuICBnYW1lLnN0YXRlLmFkZCgnYm9vdCcsIHJlcXVpcmUoJy4vYm9vdC5qcycpKTtcbiAgZ2FtZS5zdGF0ZS5hZGQoJ3ByZWxvYWRlcicsIHJlcXVpcmUoJy4vcHJlbG9hZGVyLmpzJykpO1xuICBnYW1lLnN0YXRlLmFkZCgnbWVudScsIHJlcXVpcmUoJy4vbWVudS5qcycpKTtcbiAgZ2FtZS5zdGF0ZS5hZGQoJ2dhbWUnLCByZXF1aXJlKCcuL2dhbWUuanMnKSk7XG5cbiAgZ2FtZS5zdGF0ZS5zdGFydCgnYm9vdCcpO1xufTtcbiIsImZ1bmN0aW9uIEJvb3QoKSB7XG4gICd1c2Ugc3RyaWN0Jztcbn1cbiBcbkJvb3QucHJvdG90eXBlID0ge1xuXG4gIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3ByZWxvYWRlcicsICdhc3NldHMvcHJlbG9hZGVyLmdpZicpO1xuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZ2FtZS5pbnB1dC5tYXhQb2ludGVycyA9IDE7XG5cbiAgICBpZiAodGhpcy5nYW1lLmRldmljZS5kZXNrdG9wKSB7XG4gICAgICB0aGlzLmdhbWUuc2NhbGUucGFnZUFsaWduSG9yaXpvbnRhbGx5ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5nYW1lLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4gICAgICB0aGlzLmdhbWUuc2NhbGUubWluV2lkdGggPSAgNDgwO1xuICAgICAgdGhpcy5nYW1lLnNjYWxlLm1pbkhlaWdodCA9IDI2MDtcbiAgICAgIHRoaXMuZ2FtZS5zY2FsZS5tYXhXaWR0aCA9IDY0MDtcbiAgICAgIHRoaXMuZ2FtZS5zY2FsZS5tYXhIZWlnaHQgPSA0ODA7XG4gICAgICB0aGlzLmdhbWUuc2NhbGUuZm9yY2VMYW5kc2NhcGUgPSB0cnVlO1xuICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgICB0aGlzLmdhbWUuc2NhbGUuc2V0U2NyZWVuU2l6ZSh0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdwcmVsb2FkZXInKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCb290O1xuIiwidmFyIFBsYXllciA9ICByZXF1aXJlKCcuL3BsYXllci5qcycpO1xudmFyIE1hcCA9ICByZXF1aXJlKCcuL21hcC5qcycpO1xuXG5mdW5jdGlvbiBHYW1lKCkge1xuICAndXNlIHN0cmljdCc7XG4gIHRoaXMucGxheWVyID0gbnVsbDtcbiAgdGhpcy5wbGF0Zm9ybXMgPSBudWxsO1xuICB0aGlzLmN1cnNvcnMgPSBudWxsO1xufVxuXG5HYW1lLnByb3RvdHlwZSA9IHtcblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBoeXNpY3Muc3RhcnRTeXN0ZW0oUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcbiAgICB0aGlzLmFkZExhbmQoKTtcbiAgICB0aGlzLmFkZFBsYXllcigpO1xuICAgIHRoaXMuY3Vyc29ycyA9IHRoaXMuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZ2FtZS5waHlzaWNzLmFyY2FkZS5jb2xsaWRlKHRoaXMucGxheWVyLCB0aGlzLm1hcC5ibG9ja2VkTGF5ZXIsIHRoaXMucGxheWVySGl0LCBudWxsLCB0aGlzKTtcblxuICAgIGlmKHRoaXMucGxheWVyLnNwcml0ZS55ID49IHRoaXMuZ2FtZS53b3JsZC5oZWlnaHQpIHtcbiAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbWVudScpO1xuICAgIH1cbiAgICAvLyBSZXNldCB0aGUgcGxheWVycyB2ZWxvY2l0eSAobW92ZW1lbnQpXG4gICAgdGhpcy5wbGF5ZXIuc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IDA7XG4gICAgaWYgKHRoaXMuY3Vyc29ycy5sZWZ0LmlzRG93bilcbiAgICB7XG4gICAgICAvLyAgTW92ZSB0byB0aGUgbGVmdFxuICAgICAgdGhpcy5wbGF5ZXIuc3ByaXRlLmJvZHkudmVsb2NpdHkueCA9IC0xNTA7XG5cbiAgICAgIHRoaXMucGxheWVyLnNwcml0ZS5hbmltYXRpb25zLnBsYXkoJ2xlZnQnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jdXJzb3JzLnJpZ2h0LmlzRG93bilcbiAgICB7XG4gICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgIHRoaXMucGxheWVyLnNwcml0ZS5ib2R5LnZlbG9jaXR5LnggPSAxNTA7XG5cbiAgICAgIHRoaXMucGxheWVyLnNwcml0ZS5hbmltYXRpb25zLnBsYXkoJ3JpZ2h0Jyk7XG4gICAgfVxuICAgIGVsc2VcbiAgICB7XG4gICAgICAvLyAgU3RhbmQgc3RpbGxcbiAgICAgIHRoaXMucGxheWVyLnNwcml0ZS5hbmltYXRpb25zLnN0b3AoKTtcblxuICAgICAgdGhpcy5wbGF5ZXIuc3ByaXRlLmZyYW1lID0gNDtcbiAgICB9XG5cbiAgICAvLyAgQWxsb3cgdGhlIHRoaXMucGxheWVyLnNwcml0ZSB0byBqdW1wIGlmIHRoZXkgYXJlIHRvdWNoaW5nIHRoZSBncm91bmQuXG4gICAgaWYgKHRoaXMuY3Vyc29ycy51cC5pc0Rvd24gJiYgdGhpcy5wbGF5ZXIuc3ByaXRlLmJvZHkuYmxvY2tlZC5kb3duKVxuICAgIHtcbiAgICAgIHRoaXMucGxheWVyLnNwcml0ZS5ib2R5LnZlbG9jaXR5LnkgPSAtMzUwO1xuICAgIH1cbiAgfSxcblxuICBhZGRMYW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5tYXAgPSBuZXcgTWFwKHRoaXMpO1xuICB9LFxuXG4gIGFkZFBsYXllcjogZnVuY3Rpb24gKCkge1xuICAgIC8vIFRoZSBwbGF5ZXIgYW5kIGl0cyBzZXR0aW5nc1xuICAgIHRoaXMucGxheWVyLnNwcml0ZSA9IG5ldyBQbGF5ZXIoKTtcblxuICAgIC8vICBXZSBuZWVkIHRvIGVuYWJsZSBwaHlzaWNzIG9uIHRoZSBwbGF5ZXJcbiAgICB0aGlzLnBoeXNpY3MuYXJjYWRlLmVuYWJsZSh0aGlzLnBsYXllci5zcHJpdGUpO1xuXG4gICAgLy8gIFBsYXllciBwaHlzaWNzIHByb3BlcnRpZXMuIEdpdmUgdGhlIGxpdHRsZSBndXkgYSBzbGlnaHQgYm91bmNlLlxuICAgIHRoaXMucGxheWVyLnNwcml0ZS5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIHRoaXMucGxheWVyLnNwcml0ZS5ib2R5LmdyYXZpdHkueSA9IDMwMDtcbiAgICB0aGlzLmdhbWUuY2FtZXJhLmZvbGxvdyh0aGlzLnBsYXllci5zcHJpdGUpO1xuICAgIHRoaXMucGxheWVyLnNwcml0ZS5hbmltYXRpb25zLmFkZCgnbGVmdCcsIFswLCAxLCAyLCAzXSwgMTAsIHRydWUpO1xuICAgIHRoaXMucGxheWVyLnNwcml0ZS5hbmltYXRpb25zLmFkZCgncmlnaHQnLCBbNSwgNiwgNywgOF0sIDEwLCB0cnVlKTtcbiAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsImZ1bmN0aW9uIE1hcChnYW1lKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB0aGlzLmdhbWUgPSBnYW1lO1xuICByZXR1cm4gdGhpcy5pbml0KCk7XG59XG5cbk1hcC5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy5tYXAgPSB0aGlzLmdhbWUuYWRkLnRpbGVtYXAoJ2xldmVsMScpO1xuXG4gICAgLy90aGUgZmlyc3QgcGFyYW1ldGVyIGlzIHRoZSB0aWxlc2V0IG5hbWUgYXMgc3BlY2lmaWVkIGluIFRpbGVkLCB0aGUgc2Vjb25kIGlzIHRoZSBrZXkgdG8gdGhlIGFzc2V0XG4gICAgdGhpcy5tYXAuYWRkVGlsZXNldEltYWdlKCd0aWxlc19zcHJpdGVzaGVldCcsICdnYW1lVGlsZXMnKTtcbiAgICAvL1xuICAgIC8vIC8vY3JlYXRlIGxheWVyc1xuICAgIC8vXG4gICAgdGhpcy5iYWNrZ3JvdW5kbGF5ZXIgPSB0aGlzLm1hcC5jcmVhdGVMYXllcignYmFja2dyb3VuZExheWVyJyk7XG4gICAgLy9cbiAgICB0aGlzLmJsb2NrZWRMYXllciA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdibG9ja2VkTGF5ZXInKTtcbiAgICAvL1xuICAgIC8vIC8vY29sbGlzaW9uIG9uIGJsb2NrZWRMYXllclxuICAgIC8vXG4gICAgdGhpcy5tYXAuc2V0Q29sbGlzaW9uQmV0d2VlbigxLCAxMDAwMDAsIHRydWUsICdibG9ja2VkTGF5ZXInKTtcblxuICAgIC8vcmVzaXplcyB0aGUgZ2FtZSB3b3JsZCB0byBtYXRjaCB0aGUgbGF5ZXIgZGltZW5zaW9uc1xuICAgIHRoaXMuYmFja2dyb3VuZGxheWVyLnJlc2l6ZVdvcmxkKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBNZW51KCkge1xuICB0aGlzLnRpdGxlVHh0ID0gbnVsbDtcbiAgdGhpcy5zdGFydFR4dCA9IG51bGw7XG59XG5cbk1lbnUucHJvdG90eXBlID0ge1xuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHZhciB4ID0gdGhpcy5nYW1lLndpZHRoIC8gMlxuICAgICAgLCB5ID0gdGhpcy5nYW1lLmhlaWdodCAvIDI7XG5cblxuICAgIHRoaXMudGl0bGVUeHQgPSB0aGlzLmFkZC5iaXRtYXBUZXh0KHgsIHksICdtaW5lY3JhZnRpYScsICdFeGFtcGxlIEdhbWUnICk7XG4gICAgdGhpcy50aXRsZVR4dC5hbGlnbiA9ICdjZW50ZXInO1xuICAgIHRoaXMudGl0bGVUeHQueCA9IHRoaXMuZ2FtZS53aWR0aCAvIDIgLSB0aGlzLnRpdGxlVHh0LnRleHRXaWR0aCAvIDI7XG5cbiAgICB5ID0geSArIHRoaXMudGl0bGVUeHQuaGVpZ2h0ICsgNTtcbiAgICB0aGlzLnN0YXJ0VHh0ID0gdGhpcy5hZGQuYml0bWFwVGV4dCh4LCB5LCAnbWluZWNyYWZ0aWEnLCAnU1RBUlQnKTtcbiAgICB0aGlzLnN0YXJ0VHh0LmFsaWduID0gJ2NlbnRlcic7XG4gICAgdGhpcy5zdGFydFR4dC54ID0gdGhpcy5nYW1lLndpZHRoIC8gMiAtIHRoaXMuc3RhcnRUeHQudGV4dFdpZHRoIC8gMjtcblxuICAgIHRoaXMuaW5wdXQub25Eb3duLmFkZCh0aGlzLm9uRG93biwgdGhpcyk7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG5cbiAgfSxcblxuICBvbkRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ2dhbWUnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNZW51O1xuIiwiZnVuY3Rpb24gUGxheWVyKGdhbWUpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB0aGlzLmdhbWUgPSBnYW1lO1xuICB0aGlzLnNwcml0ZSA9IGdhbWUuYWRkLnNwcml0ZSgzMiwgZ2FtZS53b3JsZC5oZWlnaHQgLSA1NTAsICdwbGF5ZXInKTtcbn1cblxuUGxheWVyLnByb3RvdHlwZSA9IHtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBQcmVsb2FkZXIoKSB7XG4gIHRoaXMuYXNzZXQgPSBudWxsO1xuICB0aGlzLnJlYWR5ID0gZmFsc2U7XG59XG5cblByZWxvYWRlci5wcm90b3R5cGUgPSB7XG5cbiAgcHJlbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYXNzZXQgPSB0aGlzLmFkZC5zcHJpdGUoMzIwLCAyNDAsICdwcmVsb2FkZXInKTtcbiAgICB0aGlzLmFzc2V0LmFuY2hvci5zZXRUbygwLjUsIDAuNSk7XG5cbiAgICB0aGlzLmxvYWQub25Mb2FkQ29tcGxldGUuYWRkT25jZSh0aGlzLm9uTG9hZENvbXBsZXRlLCB0aGlzKTtcbiAgICB0aGlzLmxvYWQuc2V0UHJlbG9hZFNwcml0ZSh0aGlzLmFzc2V0KTtcblxuXG4gICAgdGhpcy5sb2FkLnRpbGVtYXAoJ2xldmVsMScsICdhc3NldHMvbGV2ZWwxLmpzb24nLCBudWxsLCBQaGFzZXIuVGlsZW1hcC5USUxFRF9KU09OKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2dhbWVUaWxlcycsICdhc3NldHMvdGlsZXNfc3ByaXRlc2hlZXQucG5nJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdza3knLCAnYXNzZXRzL3NreS5wbmcnKTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ2dyb3VuZCcsICdhc3NldHMvZ3JvdW5kLnBuZycpO1xuICAgIHRoaXMubG9hZC5zcHJpdGVzaGVldCgncGxheWVyJywgJ2Fzc2V0cy9wbGF5ZXIucG5nJywgMzIsIDQ4KTtcbiAgICB0aGlzLmxvYWQuaW1hZ2UoJ3N0YXInLCAnYXNzZXRzL3N0YXIucG5nJyk7XG4gICAgdGhpcy5sb2FkLmJpdG1hcEZvbnQoJ21pbmVjcmFmdGlhJywgJ2Fzc2V0cy9taW5lY3JhZnRpYS5wbmcnLCAnYXNzZXRzL21pbmVjcmFmdGlhLnhtbCcpO1xuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYXNzZXQuY3JvcEVuYWJsZWQgPSBmYWxzZTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISF0aGlzLnJlYWR5KSB7XG4gICAgICB0aGlzLmdhbWUuc3RhdGUuc3RhcnQoJ21lbnUnKTtcbiAgICB9XG4gIH0sXG5cbiAgb25Mb2FkQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmVsb2FkZXI7XG4iXX0=
