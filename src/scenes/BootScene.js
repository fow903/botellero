import Phaser from 'phaser';
import { GAME, PLAYER, ASSETS } from '../config.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    const playerCfg = PLAYER.spriteSheet;
    if (playerCfg && playerCfg.path) {
      const playerUrl = new URL('../' + playerCfg.path, import.meta.url).href;
      this.load.spritesheet('player', playerUrl, {
        frameWidth: playerCfg.frameWidth,
        frameHeight: playerCfg.frameHeight,
      });
    } else {
      const size = 6 * GAME.pixelScale;
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x00ff00, 1);
      g.fillRect(0, 0, size, size);
      g.generateTexture('player', size, size);
      g.destroy();
    }

    const beerUrl = new URL('../' + ASSETS.sprites.beer.path, import.meta.url).href;
    this.load.image(ASSETS.sprites.beer.key, beerUrl);

    const size = 6 * GAME.pixelScale;

    const g3 = this.make.graphics({ x: 0, y: 0, add: false });
    g3.fillStyle(0xffff00, 1);
    g3.fillRect(0, 0, size, size);
    g3.generateTexture('musicKey', size, size);
    g3.destroy();

    const g4 = this.make.graphics({ x: 0, y: 0, add: false });
    g4.fillStyle(0x888888, 1);
    g4.fillRect(0, 0, size, size);
    g4.generateTexture('npc', size, size);
    g4.destroy();

    const g5 = this.make.graphics({ x: 0, y: 0, add: false });
    g5.fillStyle(0x666666, 1);
    g5.fillRect(0, 0, size * 2, size);
    g5.generateTexture('cables', size * 2, size);
    g5.destroy();

    const g6 = this.make.graphics({ x: 0, y: 0, add: false });
    g6.fillStyle(0x444466, 1);
    g6.fillRect(0, 0, size, size * 2);
    g6.generateTexture('speakers', size, size * 2);
    g6.destroy();

    const g7 = this.make.graphics({ x: 0, y: 0, add: false });
    g7.fillStyle(0x8b4513, 1);
    g7.fillRect(0, 0, size * 2, size);
    g7.generateTexture('tables', size * 2, size);
    g7.destroy();

    const g8 = this.make.graphics({ x: 0, y: 0, add: false });
    g8.fillStyle(0xaaaaaa, 1);
    g8.fillRect(0, 0, size, size * 2);
    g8.generateTexture('fridges', size, size * 2);
    g8.destroy();

    ASSETS.backgrounds.forEach(({ key, path }) => {
      const url = new URL('../' + path, import.meta.url).href;
      this.load.image(key, url);
    });
  }

  create() {
    const playerCfg = PLAYER.spriteSheet;
    if (playerCfg && this.anims.get(playerCfg.runAnimKey) === undefined) {
      const end = (playerCfg.totalFrames != null) ? playerCfg.totalFrames - 1 : 41;
      this.anims.create({
        key: playerCfg.runAnimKey,
        frames: this.anims.generateFrameNumbers('player', { start: 0, end }),
        frameRate: playerCfg.runFrameRate || 18,
        repeat: -1,
      });
    }
    this.scene.start('Preload');
  }
}
