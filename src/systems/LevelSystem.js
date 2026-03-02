import { LEVEL_SECTIONS, SCROLL, EVENTS } from '../config.js';

export default class LevelSystem {
  constructor(scene) {
    this.scene = scene;
    this.distance = 0;
    this.currentSectionIndex = 0;
    this.sections = LEVEL_SECTIONS;
  }

  start() {
    this.distance = 0;
    this.currentSectionIndex = 0;
  }

  update(delta) {
    this.distance += SCROLL.speed * (delta / 1000);
    const newIndex = this.getSectionIndexForDistance(this.distance);
    if (newIndex !== this.currentSectionIndex) {
      this.currentSectionIndex = newIndex;
      this.scene.events.emit(EVENTS.SECTION_CHANGED, this.getCurrentSection());
    }
  }

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

  getCurrentSection() {
    return this.sections[this.currentSectionIndex] || this.sections[0];
  }

  getSpawnRateMultiplier() {
    return this.getCurrentSection().spawnRateMultiplier || 1;
  }
}
