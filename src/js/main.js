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
