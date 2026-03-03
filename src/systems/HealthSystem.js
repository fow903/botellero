import Phaser from 'phaser';
import { HEALTH, EVENTS } from '../config.js';

export default class HealthSystem {
  // Inicializa el sistema con los valores de config y pone todos los timers en 0
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

  // Reinicia la vida al máximo y resetea todos los estados (se llama al iniciar partida)
  start() {
    this.current = this.max;
    this.invulnerableUntil = 0;
    this.buffActiveUntil = 0;
    this.lastDecayTime = this.scene.time.now;
    this.emitChange();
  }

  // Se ejecuta cada frame: descuenta vida según el tiempo transcurrido.
  // Si hay buff activo, omite el descuento pero sí actualiza el timestamp.
  // El elapsed se limita a 100ms para evitar picos si la pestaña perdió foco.
  update(time) {
    if (this.current <= 0) return;
    const elapsed = Math.min((time - this.lastDecayTime) / 1000, 0.1);
    this.lastDecayTime = time;
    if (time < this.buffActiveUntil) return;
    this.add(-this.decayPerSec * elapsed);
  }

  // Suma o resta vida (amount positivo = curar, negativo = dañar).
  // Clampea entre 0 y el máximo, y emite Game Over si llega a 0.
  add(amount) {
    if (this.current <= 0) return;
    this.current = Phaser.Math.Clamp(this.current + amount, 0, this.max);
    this.emitChange();
    if (this.current <= 0) {
      this.scene.events.emit(EVENTS.GAME_OVER);
    }
  }

  // Cura al jugador sumando la cantidad indicada
  heal(amount) {
    this.add(amount);
  }

  // Aplica daño al jugador. Si está en periodo de invulnerabilidad, lo ignora.
  // Al recibir daño activa la invulnerabilidad temporal para evitar daño múltiple.
  damage(amount) {
    if (this.scene.time.now < this.invulnerableUntil) return;
    this.add(-amount);
    this.invulnerableUntil = this.scene.time.now + this.invulnerabilityMs;
  }

  // Devuelve true si el jugador sigue en el periodo de invulnerabilidad
  isInvulnerable() {
    return this.scene.time.now < this.invulnerableUntil;
  }

  // Activa el buff que congela el descuento de vida durante durationMs milisegundos.
  // Emite eventos de inicio y fin del buff para que la UI los muestre.
  startBuff(durationMs) {
    this.buffActiveUntil = this.scene.time.now + durationMs;
    this.scene.events.emit(EVENTS.BUFF_START, durationMs);
    this.scene.time.delayedCall(durationMs, () => {
      this.scene.events.emit(EVENTS.BUFF_END);
    });
  }

  // Devuelve true si el buff de congelación de vida sigue activo
  hasBuff() {
    return this.scene.time.now < this.buffActiveUntil;
  }

  // Devuelve cuántos milisegundos le quedan al buff activo (0 si no hay buff)
  getBuffRemainingMs() {
    if (!this.hasBuff()) return 0;
    return Math.ceil(this.buffActiveUntil - this.scene.time.now);
  }

  // Notifica a la UI que la vida cambió enviando los valores actuales
  emitChange() {
    this.scene.events.emit(EVENTS.HEALTH_CHANGED, { current: this.current, max: this.max });
  }
}
