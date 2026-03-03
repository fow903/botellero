import { LEVEL_SECTIONS, SCROLL, EVENTS } from '../config.js';

export default class LevelSystem {
  // Inicializa con las secciones de nivel definidas en config
  constructor(scene) {
    this.scene                = scene;
    this.distance             = 0;
    this.currentSectionIndex  = 0;
    this.sections             = LEVEL_SECTIONS;
  }

  // Resetea la distancia y la sección al inicio de una nueva partida
  start() {
    this.distance            = 0;
    this.currentSectionIndex = 0;
  }

  // Se ejecuta cada frame: acumula la distancia recorrida y detecta
  // si el jugador entró a una nueva sección para emitir el evento correspondiente
  update(delta) {
    this.distance += SCROLL.speed * (delta / 1000);
    const newIndex = this.getSectionIndexForDistance(this.distance);
    if (newIndex !== this.currentSectionIndex) {
      this.currentSectionIndex = newIndex;
      this.scene.events.emit(EVENTS.SECTION_CHANGED, this.getCurrentSection());
    }
  }

  // Busca la sección activa para una distancia dada.
  // Recorre de mayor a menor para devolver la última sección cuyo umbral se haya superado.
  getSectionIndexForDistance(d) {
    let index = 0;
    for (let i = this.sections.length - 1; i >= 0; i--) {
      if (d >= this.sections[i].distance) {
        index = i;
        break;
      }
    }
    return index;
  }

  // Devuelve el objeto de configuración de la sección actual
  getCurrentSection() {
    return this.sections[this.currentSectionIndex] || this.sections[0];
  }

  // Devuelve el multiplicador de spawn de la sección actual (aumenta la dificultad)
  getSpawnRateMultiplier() {
    return this.getCurrentSection().spawnRateMultiplier || 1;
  }
}
