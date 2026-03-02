import Phaser from 'phaser';
import {
  GAME,
  PLAYER,
  SCROLL,
  EVENTS,
  ASSETS,
} from '../config.js';
import HealthSystem from '../systems/HealthSystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import ParallaxSystem from '../systems/ParallaxSystem.js';
import LevelSystem from '../systems/LevelSystem.js';
import AudioSystem from '../systems/AudioSystem.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  create() {
    this.healthSystem = new HealthSystem(this);
    this.levelSystem = new LevelSystem(this);
    this.audioSystem = new AudioSystem(this);
    const sectionKeys = this.levelSystem.getCurrentSection().backgroundKeys || ['bg0', 'bg1'];
    const bgConfigs = sectionKeys.map(k => ASSETS.backgrounds.find(b => b.key === k) || { key: k });
    this.parallaxSystem = new ParallaxSystem(this, bgConfigs);
    this.spawnSystem = new SpawnSystem(this, this.healthSystem, this.levelSystem);

    this.parallaxSystem.create();
    this.parallaxSystem.setScrollSpeed(SCROLL.speed);

    const groundY = GAME.height - 8;
    const ground = this.add.tileSprite(0, groundY, GAME.width * 4, 16, 'bg0')
      .setOrigin(0, 1)
      .setTint(0x2d2d44)
      .setScrollFactor(0);
    this.physics.add.existing(ground, true);
    ground.body.setSize(GAME.width * 4, 16).setOffset(0, 0);
    this.ground = ground;
    this.groundY = groundY;

    const playerCfg = PLAYER.spriteSheet;
    const frameW = playerCfg ? playerCfg.frameWidth : 6;
    const frameH = playerCfg ? playerCfg.frameHeight : 6;
    const playerScale = playerCfg ? Math.min(1, (GAME.height * 0.45) / frameH) : GAME.pixelScale;
    const playerY = groundY - 16;
    this.player = this.physics.add.sprite(PLAYER.startX, playerY, PLAYER.spriteKey)
      .setScale(playerScale)
      .setOrigin(0.5, 1);
    if (playerCfg) {
      const bodyW = frameW * 0.4;
      const bodyH = frameH * 0.9;
      this.player.setSize(bodyW, bodyH);
      this.player.setOffset((frameW - bodyW) / 2, frameH - bodyH);
    } else {
      this.player.setSize(6, 6).setOffset(0, 0);
    }
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, ground);
    this.player.body.setAllowGravity(true);
    this.player.body.setGravityY(PLAYER.gravity);
    if (playerCfg && playerCfg.runAnimKey) {
      this.player.play(playerCfg.runAnimKey);
    }

    this.cameras.main.setScroll(0, 0);
    this.physics.world.setBounds(0, 0, 100000, GAME.height);

    this.healthSystem.start();
    this.levelSystem.start();
    this.spawnSystem.create();

    this.cursors = this.input.keyboard.addKeys({ space: Phaser.Input.Keyboard.KeyCodes.SPACE, up: Phaser.Input.Keyboard.KeyCodes.UP });
    this.input.on('pointerdown', () => this.jump());

    this.events.on(EVENTS.SECTION_CHANGED, (section) => {
      this.audioSystem.playSectionMusic(section);
    });
    this.events.once(EVENTS.GAME_OVER, () => this.onGameOver());

    const firstSection = this.levelSystem.getCurrentSection();
    this.audioSystem.playSectionMusic(firstSection);

    this.scene.launch('UI', { healthSystem: this.healthSystem });
  }

  jump() {
    const body = this.player.body;
    const onGround = body.blocked.down || body.touching.down || (body.velocity.y >= -50 && this.player.y >= this.ground.y - 5);
    if (!onGround) return;
    this.player.setVelocityY(PLAYER.jumpForce);
  }

  onGameOver() {
    this.physics.pause();
    this.scene.get('UI').events.emit('show_game_over');
  }

  update(time, delta) {
    if (this.healthSystem.current <= 0) return;
    this.player.x = PLAYER.startX;
    this.player.body.velocity.x = 0;
    if (this.cursors.space.isDown || this.cursors.up.isDown) this.jump();
    this.healthSystem.update(time);
    this.levelSystem.update(delta);
    this.parallaxSystem.update(delta, SCROLL.speed);
    this.ground.tilePositionX -= SCROLL.speed * (delta / 1000);
    this.spawnSystem.update(delta);
  }
}
