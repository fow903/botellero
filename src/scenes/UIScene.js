import Phaser from 'phaser';
import { GAME, HEALTH, EVENTS } from '../config.js';

export default class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UI' });
  }

  create(data) {
    this.healthSystem = data.healthSystem || this.registry.get('healthSystem');
    if (!this.healthSystem) return;

    const margin = 12;
    const barW = 200;
    const barH = 16;
    const bg = this.add.rectangle(margin, margin, barW + 4, barH + 4, 0x000000, 0.6).setOrigin(0, 0).setScrollFactor(0);
    this.barBg = bg;
    this.barFill = this.add.rectangle(margin + 2, margin + 2, barW * (this.healthSystem.current / HEALTH.initial), barH, 0x00ff00, 1).setOrigin(0, 0).setScrollFactor(0);
    this.hpText = this.add.text(margin + barW + 8, margin + 4, `${Math.ceil(this.healthSystem.current)} HP`, { fontSize: 14, color: '#fff' }).setScrollFactor(0);
    this.buffText = this.add.text(margin, margin + barH + 8, '', { fontSize: 12, color: '#ff0' }).setScrollFactor(0).setVisible(false);

    const gameScene = this.scene.get('Game');
    if (gameScene) {
      gameScene.events.on(EVENTS.HEALTH_CHANGED, ({ current, max }) => {
        this.barFill.width = barW * (current / max);
        this.barFill.setFillStyle(current > max * 0.3 ? 0x00ff00 : 0xff0000);
        this.hpText.setText(`${Math.ceil(current)} HP`);
      });
      gameScene.events.on(EVENTS.BUFF_START, () => { this.buffText.setVisible(true); });
      gameScene.events.on(EVENTS.BUFF_END, () => { this.buffText.setVisible(false); });
    }

    this.gameOverPanel = null;
    this.events.on('show_game_over', () => this.showGameOver());
  }

  showGameOver() {
    if (this.gameOverPanel) return;
    const w = GAME.width;
    const h = GAME.height;
    const panel = this.add.container(w / 2, h / 2);
    const bg = this.add.rectangle(0, 0, 280, 120, 0x000000, 0.85).setStrokeStyle(2, 0xff0000);
    const title = this.add.text(0, -35, 'GAME OVER', { fontSize: 24, color: '#ff4444' }).setOrigin(0.5);
    const restartBtn = this.add.text(0, 20, 'RESTART', { fontSize: 18, color: '#fff' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    restartBtn.on('pointerover', () => restartBtn.setStyle({ color: '#aaa' }));
    restartBtn.on('pointerout', () => restartBtn.setStyle({ color: '#fff' }));
    restartBtn.on('pointerdown', () => {
      this.scene.stop('Game');
      this.scene.stop('UI');
      this.scene.start('Game');
    });
    panel.add([bg, title, restartBtn]);
    panel.setScrollFactor(0);
    this.gameOverPanel = panel;
  }

  update() {
    if (this.healthSystem && this.healthSystem.hasBuff()) {
      this.buffText.setText(`Buff: ${(this.healthSystem.getBuffRemainingMs() / 1000).toFixed(1)}s`);
    }
  }
}
