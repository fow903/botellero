import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  create() {
    this.scene.start('Game');
  }
}
