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
      const isStatic = typeof config === 'object' && config.static === true;
      const blendMode = typeof config === 'object' && config.blendMode ? config.blendMode : null;

      if (isStatic) {
        const img = this.scene.add.image(w / 2, h / 2, key)
          .setScrollFactor(0)
          .setDisplaySize(w, h);
        this.layers.push({ img1: img, img2: null, factor: 0, isStatic: true });
        return;
      }

      const yPercent      = typeof config === 'object' && config.yPercent      != null ? config.yPercent      : 0;
      const heightPercent = typeof config === 'object' && config.heightPercent != null ? config.heightPercent : 1;
      const tileScale     = typeof config === 'object' && config.tileScale  != null ? config.tileScale  : 1;
      const tileScaleX    = typeof config === 'object' && config.tileScaleX != null ? config.tileScaleX : tileScale;
      const tileScaleY    = typeof config === 'object' && config.tileScaleY != null ? config.tileScaleY : tileScale;

      const layerY = h * yPercent;
      const layerH = h * heightPercent;

      const img1 = this.scene.add.tileSprite(0, layerY, w * 2, layerH, key).setOrigin(0, 0);
      const img2 = this.scene.add.tileSprite(w * 2, layerY, w * 2, layerH, key).setOrigin(0, 0);
      img1.setScrollFactor(0);
      img2.setScrollFactor(0);
      img1.setTileScale(tileScaleX, tileScaleY);
      img2.setTileScale(tileScaleX, tileScaleY);
      if (blendMode) {
        img1.setBlendMode(blendMode);
        img2.setBlendMode(blendMode);
      }
      this.layers.push({ img1, img2, factor, isStatic: false });
    });
  }

  update(delta, scrollSpeed) {
    const pixelsPerMs = scrollSpeed / 1000;
    this.layers.forEach(({ img1, img2, factor, isStatic }) => {
      if (isStatic) return;
      const move = pixelsPerMs * delta * factor;
      img1.tilePositionX += move;
      img2.tilePositionX += move;
    });
  }
}
