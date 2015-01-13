function Land(game) {
  'use strict';
  this.map = game.add.tilemap('level1');
  //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
  this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');
  this.createLayers(this.map);
  this.backgroundlayer.resizeWorld();
}

Land.prototype = {
  createLayers: function (map) {
    this.backgroundlayer = map.createLayer('backgroundLayer');
    this.blockedLayer = map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
  }
};

module.exports = Land;
