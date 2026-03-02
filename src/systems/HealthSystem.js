import Phaser from 'phaser';
import { HEALTH, EVENTS } from '../config.js';

export default class HealthSystem {
  constructor(scene) {
    this.scene = scene;
    this.current = HEALTH.initial;
    this.max = HEALTH.initial;
    this.decayPerSec = HEALTH.decayPerSec;
    this.invulnerabilityMs = HEALTH.invulnerabilityMs;
    this.invulnerableUntil = 0;
    this.buffActiveUntil = 0;
    this.lastDecayTime = 0;
  }

  start() {
    this.current = this.max;
    this.invulnerableUntil = 0;
    this.buffActiveUntil = 0;
    this.lastDecayTime = this.scene.time.now;
    this.emitChange();
  }

  update(time) {
    if (this.current <= 0) return;
    const elapsed = Math.min((time - this.lastDecayTime) / 1000, 0.1);
    this.lastDecayTime = time;
    if (time < this.buffActiveUntil) return;
    this.add(-this.decayPerSec * elapsed);
  }

  add(amount) {
    if (this.current <= 0) return;
    this.current = Phaser.Math.Clamp(this.current + amount, 0, this.max);
    this.emitChange();
    if (this.current <= 0) {
      this.scene.events.emit(EVENTS.GAME_OVER);
    }
  }

  heal(amount) {
    this.add(amount);
  }

  damage(amount) {
    if (this.scene.time.now < this.invulnerableUntil) return;
    this.add(-amount);
    this.invulnerableUntil = this.scene.time.now + this.invulnerabilityMs;
  }

  isInvulnerable() {
    return this.scene.time.now < this.invulnerableUntil;
  }

  startBuff(durationMs) {
    this.buffActiveUntil = this.scene.time.now + durationMs;
    this.scene.events.emit(EVENTS.BUFF_START, durationMs);
    this.scene.time.delayedCall(durationMs, () => {
      this.scene.events.emit(EVENTS.BUFF_END);
    });
  }

  hasBuff() {
    return this.scene.time.now < this.buffActiveUntil;
  }

  getBuffRemainingMs() {
    if (!this.hasBuff()) return 0;
    return Math.ceil(this.buffActiveUntil - this.scene.time.now);
  }

  emitChange() {
    this.scene.events.emit(EVENTS.HEALTH_CHANGED, { current: this.current, max: this.max });
  }
}
