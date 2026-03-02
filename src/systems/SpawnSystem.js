import Phaser from 'phaser';
import {
  GAME,
  PLAYER,
  ITEMS,
  OBSTACLES,
  SCROLL,
  ASSETS,
  EVENTS,
} from '../config.js';

export default class SpawnSystem {
  constructor(scene, healthSystem, levelSystem) {
    this.scene = scene;
    this.health = healthSystem;
    this.levelSystem = levelSystem;
    this.groups = {};
    this.timers = {};
  }

  create(worldBounds) {
    this.worldBounds = worldBounds;
    this.groups.beer = this.scene.physics.add.group();
    this.groups.musicKey = this.scene.physics.add.group();
    this.groups.npc = this.scene.physics.add.group();
    this.groups.static = this.scene.physics.add.group();
    this.scheduleBeer();
    this.scheduleMusicKey();
    this.scheduleNpc();
    this.scheduleStatic();
  }

  scheduleBeer() {
    const cfg = ITEMS.beer;
    const next = Phaser.Math.Between(cfg.spawnIntervalMin, cfg.spawnIntervalMax);
    this.timers.beer = this.scene.time.delayedCall(next, () => {
      if (this.scene.scene.isActive('Game') && this.health.current > 0) {
        this.spawnBeer();
        this.scheduleBeer();
      }
    });
  }

  spawnBeer() {
    const mult = this.levelSystem.getSpawnRateMultiplier();
    const cfg = ITEMS.beer;
    const x = this.scene.cameras.main.scrollX + GAME.width + 60;
    const y = Phaser.Math.Between(GAME.height * 0.3, GAME.height - 24);
    const beerScale = cfg.scale ?? GAME.itemScale ?? 0.35;
    const sprite = this.scene.physics.add.sprite(x, y, cfg.spriteKey)
      .setScale(beerScale);
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocity(0, 0);
    this.scene.physics.add.overlap(this.scene.player, sprite, () => {
      this.health.heal(cfg.healAmount);
      sprite.destroy();
    });
    this.groups.beer.add(sprite);
  }

  scheduleMusicKey() {
    const cfg = ITEMS.musicKey;
    const next = Phaser.Math.Between(cfg.spawnIntervalMin, cfg.spawnIntervalMax);
    this.timers.musicKey = this.scene.time.delayedCall(next, () => {
      if (this.scene.scene.isActive('Game') && this.health.current > 0) {
        this.spawnMusicKey();
        this.scheduleMusicKey();
      }
    });
  }

  spawnMusicKey() {
    const cfg = ITEMS.musicKey;
    const x = this.scene.cameras.main.scrollX + GAME.width + 60;
    const y = Phaser.Math.Between(GAME.height * 0.2, GAME.height - 24);
    const sprite = this.scene.physics.add.sprite(x, y, cfg.spriteKey)
      .setScale(GAME.itemScale ?? 0.35);
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocity(0, 0);
    this.scene.physics.add.overlap(this.scene.player, sprite, () => {
      this.health.startBuff(cfg.buffDurationMs);
      sprite.destroy();
    });
    this.groups.musicKey.add(sprite);
  }

  scheduleNpc() {
    const cfg = OBSTACLES.npc;
    const mult = this.levelSystem.getSpawnRateMultiplier();
    const next = Phaser.Math.Between(cfg.spawnIntervalMin, cfg.spawnIntervalMax) / mult;
    this.timers.npc = this.scene.time.delayedCall(next, () => {
      if (this.scene.scene.isActive('Game') && this.health.current > 0) {
        this.spawnNpc();
        this.scheduleNpc();
      }
    });
  }

  spawnNpc() {
    const cfg = OBSTACLES.npc;
    const x = this.scene.cameras.main.scrollX + GAME.width + 60;
    const y = GAME.height - 20;
    const lateralSpeed = Phaser.Math.Between(cfg.speedMin, cfg.speedMax) * (Phaser.Math.Between(0, 1) ? 1 : -1);
    const sprite = this.scene.physics.add.sprite(x, y, cfg.spriteKey)
      .setScale(GAME.itemScale ?? 0.35)
      .setSize(6, 6)
      .setOffset(0, 0);
    sprite.npcLateralSpeed = lateralSpeed;
    sprite.setCollideWorldBounds(false);
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocity(0, 0);
    this.scene.physics.add.collider(this.scene.player, sprite, () => {
      this.health.damage(OBSTACLES.damage);
      sprite.destroy();
    });
    this.groups.npc.add(sprite);
  }

  scheduleStatic() {
    const next = Phaser.Math.Between(OBSTACLES.staticSpawnIntervalMin, OBSTACLES.staticSpawnIntervalMax);
    this.timers.static = this.scene.time.delayedCall(next, () => {
      if (this.scene.scene.isActive('Game') && this.health.current > 0) {
        this.spawnStatic();
        this.scheduleStatic();
      }
    });
  }

  spawnStatic() {
    const keys = Object.entries(OBSTACLES.static).filter(([k]) => k !== 'spawnIntervalMin' && k !== 'spawnIntervalMax');
    if (keys.length === 0) return;
    const totalWeight = keys.reduce((s, [, v]) => s + (v.spawnWeight || 1), 0);
    let r = Math.random() * totalWeight;
    let chosen = keys[0];
    for (const [name, config] of keys) {
      r -= config.spawnWeight || 1;
      if (r <= 0) {
        chosen = [name, config];
        break;
      }
    }
    const [, config] = chosen;
    const x = this.scene.cameras.main.scrollX + GAME.width + 60;
    const y = GAME.height - 24;
    const sprite = this.scene.physics.add.sprite(x, y, config.spriteKey)
      .setScale(GAME.itemScale ?? 0.35)
      .setSize(12, 12)
      .setOffset(0, 0)
      .setImmovable(true);
    sprite.body.setAllowGravity(false);
    sprite.body.setVelocity(0, 0);
    this.scene.physics.add.collider(this.scene.player, sprite, () => {
      this.health.damage(OBSTACLES.damage);
      sprite.destroy();
    });
    this.groups.static.add(sprite);
  }

  update(delta) {
    const scrollDelta = SCROLL.speed * (delta / 1000);
    [this.groups.beer, this.groups.musicKey, this.groups.static].forEach((group) => {
      group.getChildren().forEach((c) => {
        c.x -= scrollDelta;
      });
    });
    this.groups.npc.getChildren().forEach((c) => {
      c.x -= scrollDelta;
      c.x += (c.npcLateralSpeed || 0) * (delta / 1000);
    });
    const camX = this.scene.cameras.main.scrollX;
    const killX = camX - 50;
    [this.groups.beer, this.groups.musicKey, this.groups.npc, this.groups.static].forEach((group) => {
      group.getChildren().filter((c) => c.x < killX).forEach((c) => c.destroy());
    });
  }
}
