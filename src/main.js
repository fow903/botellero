import Phaser from 'phaser';
import { GAME } from './config.js';
import BootScene    from './scenes/BootScene.js';
import PreloadScene from './scenes/PreloadScene.js';
import GameScene    from './scenes/GameScene.js';
import UIScene      from './scenes/UIScene.js';

// Configuración principal de Phaser:
// - Renderer automático (WebGL con fallback a Canvas)
// - Modo pixel art activado (sin blur en escalado)
// - Física Arcade sin gravedad global (cada objeto la define por su cuenta)
// - Escala FIT centrada para adaptarse a cualquier pantalla
const config = {
  type:            Phaser.AUTO,
  width:           GAME.width,
  height:          GAME.height,
  parent:          'game-container',
  backgroundColor: GAME.backgroundColor,
  pixelArt:        true,
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade:  {
      gravity: { y: 0 },
      debug:   false,
    },
  },
  // Orden de escenas: Boot carga assets → Preload hace puente → Game es el juego → UI es el HUD
  scene: [BootScene, PreloadScene, GameScene, UIScene],
};

// Espera a que el DOM esté listo antes de crear la instancia del juego
window.addEventListener('load', () => {
  new Phaser.Game(config);
});
