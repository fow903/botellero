import Phaser from 'phaser';
import { GAME } from './config.js';
import BootScene from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,
  width: GAME.width,
  height: GAME.height,
  parent: 'game-container',
  backgroundColor: GAME.backgroundColor,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: [BootScene, PreloadScene, GameScene, UIScene],
};

window.addEventListener('load', () => {
  new Phaser.Game(config);
});
