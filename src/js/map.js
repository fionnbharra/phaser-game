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
