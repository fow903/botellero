import Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  // Escena puente entre Boot (carga de assets) y Game.
  // Aquí se puede agregar una pantalla de carga o lógica de preparación adicional.
  create() {
    this.scene.start('Game');
  }
}
