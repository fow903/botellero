import { GAME } from '../config.js';

export default class ParallaxSystem {
  // Recibe la escena y el array de configuraciones de capas de fondo
  constructor(scene, layerConfigs) {
    this.scene        = scene;
    this.layers       = [];
    this.scrollSpeed  = 0;
    this.layerConfigs = layerConfigs || [];
  }

  // Define la velocidad de scroll base (se usa para calcular el movimiento parallax)
  setScrollSpeed(speed) {
    this.scrollSpeed = speed;
  }

  // Construye todas las capas de fondo según sus configs.
  // Soporta dos tipos de capa:
  //   - static: imagen fija que llena la pantalla (ej. cielo)
  //   - tileSprite: imagen que se repite y desplaza (ej. nubes, edificios)
  create(layerConfigs) {
    if (layerConfigs) this.layerConfigs = layerConfigs;
    const w = GAME.width;
    const h = GAME.height;

    this.layerConfigs.forEach((config, i) => {
      const key       = typeof config === 'string' ? config : config.key;
      const factor    = typeof config === 'object' && config.parallaxFactor != null
        ? config.parallaxFactor : 0.2 + i * 0.2;
      const isStatic  = typeof config === 'object' && config.static === true;
      const blendMode = typeof config === 'object' && config.blendMode ? config.blendMode : null;

      // Capa estática: imagen centrada escalada al tamaño exacto del canvas
      if (isStatic) {
        const img = this.scene.add.image(w / 2, h / 2, key)
          .setScrollFactor(0)
          .setDisplaySize(w, h);
        this.layers.push({ img1: img, img2: null, factor: 0, isStatic: true });
        return;
      }

      // Capa dinámica: posición y altura en porcentaje del canvas
      const yPercent      = typeof config === 'object' && config.yPercent      != null ? config.yPercent      : 0;
      const heightPercent = typeof config === 'object' && config.heightPercent != null ? config.heightPercent : 1;
      // tileScaleX/Y controlan el tamaño visual del tile (< 1 = más pequeño, se repite más)
      const tileScale     = typeof config === 'object' && config.tileScale  != null ? config.tileScale  : 1;
      const tileScaleX    = typeof config === 'object' && config.tileScaleX != null ? config.tileScaleX : tileScale;
      const tileScaleY    = typeof config === 'object' && config.tileScaleY != null ? config.tileScaleY : tileScale;

      const layerY = h * yPercent;
      const layerH = h * heightPercent;

      // Se usan dos tileSprites en paralelo para cubrir el ancho doble del canvas
      const img1 = this.scene.add.tileSprite(0,       layerY, w * 2, layerH, key).setOrigin(0, 0);
      const img2 = this.scene.add.tileSprite(w * 2,   layerY, w * 2, layerH, key).setOrigin(0, 0);
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

  // Se ejecuta cada frame: desplaza el tile de cada capa dinámica
  // a una velocidad proporcional a su parallaxFactor (capas lejanas van más lentas)
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
