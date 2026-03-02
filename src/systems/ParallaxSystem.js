import { GAME } from '../config.js';

export default class ParallaxSystem {
  constructor(scene, layerConfigs) {
    this.scene = scene;
    this.layers = [];
    this.scrollSpeed = 0;
    this.layerConfigs = layerConfigs || [];
  }

  setScrollSpeed(speed) {
    this.scrollSpeed = speed;
  }

  create(layerConfigs) {
    if (layerConfigs) this.layerConfigs = layerConfigs;
    const w = GAME.width;
    const h = GAME.height;
    this.layerConfigs.forEach((config, i) => {
      const key = typeof config === 'string' ? config : config.key;
      const factor = typeof config === 'object' && config.parallaxFactor != null
        ? config.parallaxFactor
        : 0.2 + i * 0.2;
      const img1 = this.scene.add.tileSprite(0, 0, w * 2, h, key).setOrigin(0, 0);
      const img2 = this.scene.add.tileSprite(w * 2, 0, w * 2, h, key).setOrigin(0, 0);
      img1.setScrollFactor(0);
      img2.setScrollFactor(0);
      this.layers.push({ img1, img2, factor });
    });
  }

  update(delta, scrollSpeed) {
    const pixelsPerMs = scrollSpeed / 1000;
    this.layers.forEach(({ img1, img2, factor }) => {
      const move = -pixelsPerMs * delta * factor;
      img1.tilePositionX += move;
      img2.tilePositionX += move;
      if (img1.tilePositionX <= -GAME.width * 2) img1.tilePositionX += GAME.width * 2;
      if (img2.tilePositionX <= -GAME.width * 2) img2.tilePositionX += GAME.width * 2;
    });
  }
}
