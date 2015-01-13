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

    if(this.player.y >= this.game.world.height) {
      this.game.state.start('menu');
    }
    // Reset the players velocity (movement)
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
    if (this.cursors.up.isDown && this.player.body.blocked.down)
    {
      this.player.body.velocity.y = -350;
    }
  },

  addLand: function () {
    this.map = new Map(this);
  },

  addPlayer: function () {
    // The player and its settings
    this.player = new Player(this);

    //  We need to enable physics on the player
    this.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.game.camera.follow(this.player);
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyIsInNyYy9qcy9ib290LmpzIiwic3JjL2pzL2dhbWUuanMiLCJzcmMvanMvbWFwLmpzIiwic3JjL2pzL21lbnUuanMiLCJzcmMvanMvcGxheWVyLmpzIiwic3JjL2pzL3ByZWxvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ3aW5kb3cub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGdhbWU7IFxuXG4gIGdhbWUgPSBuZXcgUGhhc2VyLkdhbWUoNzQ2LCA0MjAsIFBoYXNlci5BVVRPLCAnZmluYmFyLWdhbWUnKTtcbiAgZ2FtZS5zdGF0ZS5hZGQoJ2Jvb3QnLCByZXF1aXJlKCcuL2Jvb3QuanMnKSk7XG4gIGdhbWUuc3RhdGUuYWRkKCdwcmVsb2FkZXInLCByZXF1aXJlKCcuL3ByZWxvYWRlci5qcycpKTtcbiAgZ2FtZS5zdGF0ZS5hZGQoJ21lbnUnLCByZXF1aXJlKCcuL21lbnUuanMnKSk7XG4gIGdhbWUuc3RhdGUuYWRkKCdnYW1lJywgcmVxdWlyZSgnLi9nYW1lLmpzJykpO1xuXG4gIGdhbWUuc3RhdGUuc3RhcnQoJ2Jvb3QnKTtcbn07XG4iLCJmdW5jdGlvbiBCb290KCkge1xuICAndXNlIHN0cmljdCc7XG59XG4gXG5Cb290LnByb3RvdHlwZSA9IHtcblxuICBwcmVsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdwcmVsb2FkZXInLCAnYXNzZXRzL3ByZWxvYWRlci5naWYnKTtcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmdhbWUuaW5wdXQubWF4UG9pbnRlcnMgPSAxO1xuXG4gICAgaWYgKHRoaXMuZ2FtZS5kZXZpY2UuZGVza3RvcCkge1xuICAgICAgdGhpcy5nYW1lLnNjYWxlLnBhZ2VBbGlnbkhvcml6b250YWxseSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZ2FtZS5zY2FsZU1vZGUgPSBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMO1xuICAgICAgdGhpcy5nYW1lLnNjYWxlLm1pbldpZHRoID0gIDQ4MDtcbiAgICAgIHRoaXMuZ2FtZS5zY2FsZS5taW5IZWlnaHQgPSAyNjA7XG4gICAgICB0aGlzLmdhbWUuc2NhbGUubWF4V2lkdGggPSA2NDA7XG4gICAgICB0aGlzLmdhbWUuc2NhbGUubWF4SGVpZ2h0ID0gNDgwO1xuICAgICAgdGhpcy5nYW1lLnNjYWxlLmZvcmNlTGFuZHNjYXBlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZ2FtZS5zY2FsZS5wYWdlQWxpZ25Ib3Jpem9udGFsbHkgPSB0cnVlO1xuICAgICAgdGhpcy5nYW1lLnNjYWxlLnNldFNjcmVlblNpemUodHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgncHJlbG9hZGVyJyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQm9vdDtcbiIsInZhciBQbGF5ZXIgPSAgcmVxdWlyZSgnLi9wbGF5ZXIuanMnKTtcbnZhciBNYXAgPSAgcmVxdWlyZSgnLi9tYXAuanMnKTtcblxuZnVuY3Rpb24gR2FtZSgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICB0aGlzLnBsYXllciA9IG51bGw7XG4gIHRoaXMucGxhdGZvcm1zID0gbnVsbDtcbiAgdGhpcy5jdXJzb3JzID0gbnVsbDtcbn1cblxuR2FtZS5wcm90b3R5cGUgPSB7XG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5waHlzaWNzLnN0YXJ0U3lzdGVtKFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG4gICAgdGhpcy5hZGRMYW5kKCk7XG4gICAgdGhpcy5hZGRQbGF5ZXIoKTtcbiAgICB0aGlzLmN1cnNvcnMgPSB0aGlzLmlucHV0LmtleWJvYXJkLmNyZWF0ZUN1cnNvcktleXMoKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUuY29sbGlkZSh0aGlzLnBsYXllciwgdGhpcy5tYXAuYmxvY2tlZExheWVyLCB0aGlzLnBsYXllckhpdCwgbnVsbCwgdGhpcyk7XG5cbiAgICBpZih0aGlzLnBsYXllci55ID49IHRoaXMuZ2FtZS53b3JsZC5oZWlnaHQpIHtcbiAgICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnbWVudScpO1xuICAgIH1cbiAgICAvLyBSZXNldCB0aGUgcGxheWVycyB2ZWxvY2l0eSAobW92ZW1lbnQpXG4gICAgdGhpcy5wbGF5ZXIuYm9keS52ZWxvY2l0eS54ID0gMDtcbiAgICBpZiAodGhpcy5jdXJzb3JzLmxlZnQuaXNEb3duKVxuICAgIHtcbiAgICAgIC8vICBNb3ZlIHRvIHRoZSBsZWZ0XG4gICAgICB0aGlzLnBsYXllci5ib2R5LnZlbG9jaXR5LnggPSAtMTUwO1xuXG4gICAgICB0aGlzLnBsYXllci5hbmltYXRpb25zLnBsYXkoJ2xlZnQnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5jdXJzb3JzLnJpZ2h0LmlzRG93bilcbiAgICB7XG4gICAgICAvLyAgTW92ZSB0byB0aGUgcmlnaHRcbiAgICAgIHRoaXMucGxheWVyLmJvZHkudmVsb2NpdHkueCA9IDE1MDtcblxuICAgICAgdGhpcy5wbGF5ZXIuYW5pbWF0aW9ucy5wbGF5KCdyaWdodCcpO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgLy8gIFN0YW5kIHN0aWxsXG4gICAgICB0aGlzLnBsYXllci5hbmltYXRpb25zLnN0b3AoKTtcblxuICAgICAgdGhpcy5wbGF5ZXIuZnJhbWUgPSA0O1xuICAgIH1cblxuICAgIC8vICBBbGxvdyB0aGUgdGhpcy5wbGF5ZXIgdG8ganVtcCBpZiB0aGV5IGFyZSB0b3VjaGluZyB0aGUgZ3JvdW5kLlxuICAgIGlmICh0aGlzLmN1cnNvcnMudXAuaXNEb3duICYmIHRoaXMucGxheWVyLmJvZHkuYmxvY2tlZC5kb3duKVxuICAgIHtcbiAgICAgIHRoaXMucGxheWVyLmJvZHkudmVsb2NpdHkueSA9IC0zNTA7XG4gICAgfVxuICB9LFxuXG4gIGFkZExhbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm1hcCA9IG5ldyBNYXAodGhpcyk7XG4gIH0sXG5cbiAgYWRkUGxheWVyOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhlIHBsYXllciBhbmQgaXRzIHNldHRpbmdzXG4gICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHRoaXMpO1xuXG4gICAgLy8gIFdlIG5lZWQgdG8gZW5hYmxlIHBoeXNpY3Mgb24gdGhlIHBsYXllclxuICAgIHRoaXMucGh5c2ljcy5hcmNhZGUuZW5hYmxlKHRoaXMucGxheWVyKTtcblxuICAgIC8vICBQbGF5ZXIgcGh5c2ljcyBwcm9wZXJ0aWVzLiBHaXZlIHRoZSBsaXR0bGUgZ3V5IGEgc2xpZ2h0IGJvdW5jZS5cbiAgICB0aGlzLnBsYXllci5ib2R5LmJvdW5jZS55ID0gMC4yO1xuICAgIHRoaXMucGxheWVyLmJvZHkuZ3Jhdml0eS55ID0gMzAwO1xuICAgIHRoaXMuZ2FtZS5jYW1lcmEuZm9sbG93KHRoaXMucGxheWVyKTtcbiAgICB0aGlzLnBsYXllci5hbmltYXRpb25zLmFkZCgnbGVmdCcsIFswLCAxLCAyLCAzXSwgMTAsIHRydWUpO1xuICAgIHRoaXMucGxheWVyLmFuaW1hdGlvbnMuYWRkKCdyaWdodCcsIFs1LCA2LCA3LCA4XSwgMTAsIHRydWUpO1xuICB9XG59O1xubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuIiwiZnVuY3Rpb24gTWFwKGdhbWUpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHRoaXMuZ2FtZSA9IGdhbWU7XG4gIHJldHVybiB0aGlzLmluaXQoKTtcbn1cblxuTWFwLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKXtcbiAgICB0aGlzLm1hcCA9IHRoaXMuZ2FtZS5hZGQudGlsZW1hcCgnbGV2ZWwxJyk7XG5cbiAgICAvL3RoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgdGhlIHRpbGVzZXQgbmFtZSBhcyBzcGVjaWZpZWQgaW4gVGlsZWQsIHRoZSBzZWNvbmQgaXMgdGhlIGtleSB0byB0aGUgYXNzZXRcbiAgICB0aGlzLm1hcC5hZGRUaWxlc2V0SW1hZ2UoJ3RpbGVzX3Nwcml0ZXNoZWV0JywgJ2dhbWVUaWxlcycpO1xuICAgIC8vXG4gICAgLy8gLy9jcmVhdGUgbGF5ZXJzXG4gICAgLy9cbiAgICB0aGlzLmJhY2tncm91bmRsYXllciA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdiYWNrZ3JvdW5kTGF5ZXInKTtcbiAgICAvL1xuICAgIHRoaXMuYmxvY2tlZExheWVyID0gdGhpcy5tYXAuY3JlYXRlTGF5ZXIoJ2Jsb2NrZWRMYXllcicpO1xuICAgIC8vXG4gICAgLy8gLy9jb2xsaXNpb24gb24gYmxvY2tlZExheWVyXG4gICAgLy9cbiAgICB0aGlzLm1hcC5zZXRDb2xsaXNpb25CZXR3ZWVuKDEsIDEwMDAwMCwgdHJ1ZSwgJ2Jsb2NrZWRMYXllcicpO1xuXG4gICAgLy9yZXNpemVzIHRoZSBnYW1lIHdvcmxkIHRvIG1hdGNoIHRoZSBsYXllciBkaW1lbnNpb25zXG4gICAgdGhpcy5iYWNrZ3JvdW5kbGF5ZXIucmVzaXplV29ybGQoKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIE1lbnUoKSB7XG4gIHRoaXMudGl0bGVUeHQgPSBudWxsO1xuICB0aGlzLnN0YXJ0VHh0ID0gbnVsbDtcbn1cblxuTWVudS5wcm90b3R5cGUgPSB7XG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHggPSB0aGlzLmdhbWUud2lkdGggLyAyXG4gICAgICAsIHkgPSB0aGlzLmdhbWUuaGVpZ2h0IC8gMjtcblxuXG4gICAgdGhpcy50aXRsZVR4dCA9IHRoaXMuYWRkLmJpdG1hcFRleHQoeCwgeSwgJ21pbmVjcmFmdGlhJywgJ0V4YW1wbGUgR2FtZScgKTtcbiAgICB0aGlzLnRpdGxlVHh0LmFsaWduID0gJ2NlbnRlcic7XG4gICAgdGhpcy50aXRsZVR4dC54ID0gdGhpcy5nYW1lLndpZHRoIC8gMiAtIHRoaXMudGl0bGVUeHQudGV4dFdpZHRoIC8gMjtcblxuICAgIHkgPSB5ICsgdGhpcy50aXRsZVR4dC5oZWlnaHQgKyA1O1xuICAgIHRoaXMuc3RhcnRUeHQgPSB0aGlzLmFkZC5iaXRtYXBUZXh0KHgsIHksICdtaW5lY3JhZnRpYScsICdTVEFSVCcpO1xuICAgIHRoaXMuc3RhcnRUeHQuYWxpZ24gPSAnY2VudGVyJztcbiAgICB0aGlzLnN0YXJ0VHh0LnggPSB0aGlzLmdhbWUud2lkdGggLyAyIC0gdGhpcy5zdGFydFR4dC50ZXh0V2lkdGggLyAyO1xuXG4gICAgdGhpcy5pbnB1dC5vbkRvd24uYWRkKHRoaXMub25Eb3duLCB0aGlzKTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcblxuICB9LFxuXG4gIG9uRG93bjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZ2FtZS5zdGF0ZS5zdGFydCgnZ2FtZScpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XG4iLCJmdW5jdGlvbiBQbGF5ZXIoZ2FtZSkge1xuICAndXNlIHN0cmljdCc7XG4gIHRoaXMucGxheWVyID0gbnVsbDtcbiAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgcmV0dXJuIHRoaXMuaW5pdChnYW1lKTtcbn1cblxuUGxheWVyLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oZ2FtZSl7XG4gICAgdGhpcy5wbGF5ZXIgPSBnYW1lLmFkZC5zcHJpdGUoMzIsIGdhbWUud29ybGQuaGVpZ2h0IC0gNTUwLCAncGxheWVyJyk7XG4gICAgcmV0dXJuIHRoaXMucGxheWVyO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gUHJlbG9hZGVyKCkge1xuICB0aGlzLmFzc2V0ID0gbnVsbDtcbiAgdGhpcy5yZWFkeSA9IGZhbHNlO1xufVxuXG5QcmVsb2FkZXIucHJvdG90eXBlID0ge1xuXG4gIHByZWxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFzc2V0ID0gdGhpcy5hZGQuc3ByaXRlKDMyMCwgMjQwLCAncHJlbG9hZGVyJyk7XG4gICAgdGhpcy5hc3NldC5hbmNob3Iuc2V0VG8oMC41LCAwLjUpO1xuXG4gICAgdGhpcy5sb2FkLm9uTG9hZENvbXBsZXRlLmFkZE9uY2UodGhpcy5vbkxvYWRDb21wbGV0ZSwgdGhpcyk7XG4gICAgdGhpcy5sb2FkLnNldFByZWxvYWRTcHJpdGUodGhpcy5hc3NldCk7XG5cblxuICAgIHRoaXMubG9hZC50aWxlbWFwKCdsZXZlbDEnLCAnYXNzZXRzL2xldmVsMS5qc29uJywgbnVsbCwgUGhhc2VyLlRpbGVtYXAuVElMRURfSlNPTik7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdnYW1lVGlsZXMnLCAnYXNzZXRzL3RpbGVzX3Nwcml0ZXNoZWV0LnBuZycpO1xuICAgIHRoaXMubG9hZC5pbWFnZSgnc2t5JywgJ2Fzc2V0cy9za3kucG5nJyk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdncm91bmQnLCAnYXNzZXRzL2dyb3VuZC5wbmcnKTtcbiAgICB0aGlzLmxvYWQuc3ByaXRlc2hlZXQoJ3BsYXllcicsICdhc3NldHMvcGxheWVyLnBuZycsIDMyLCA0OCk7XG4gICAgdGhpcy5sb2FkLmltYWdlKCdzdGFyJywgJ2Fzc2V0cy9zdGFyLnBuZycpO1xuICAgIHRoaXMubG9hZC5iaXRtYXBGb250KCdtaW5lY3JhZnRpYScsICdhc3NldHMvbWluZWNyYWZ0aWEucG5nJywgJ2Fzc2V0cy9taW5lY3JhZnRpYS54bWwnKTtcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFzc2V0LmNyb3BFbmFibGVkID0gZmFsc2U7XG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCEhdGhpcy5yZWFkeSkge1xuICAgICAgdGhpcy5nYW1lLnN0YXRlLnN0YXJ0KCdtZW51Jyk7XG4gICAgfVxuICB9LFxuXG4gIG9uTG9hZENvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJlbG9hZGVyO1xuIl19
