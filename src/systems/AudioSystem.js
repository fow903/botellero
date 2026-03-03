export default class AudioSystem {
  // Guarda la escena y prepara el slot para la música actual
  constructor(scene) {
    this.scene        = scene;
    this.currentMusic = null;
    this.musicKeys    = {};
  }

  // Registra manualmente un key de música asociado a una sección (uso opcional)
  registerMusic(sectionKey, musicKey) {
    this.musicKeys[sectionKey] = musicKey;
  }

  // Reproduce la música de la sección indicada.
  // Si ya está sonando la misma pista no hace nada (evita reinicio innecesario).
  // Detiene la pista anterior antes de iniciar la nueva.
  // Falla silenciosamente si el audio no está cargado.
  playSectionMusic(section) {
    const key = section.musicKey || this.musicKeys[section.distance];
    if (!key) return;
    try {
      if (this.currentMusic && this.currentMusic.key === key) return;
      if (this.currentMusic) this.currentMusic.stop();
      this.currentMusic = this.scene.sound.add(key, { loop: true, volume: 0.3 });
      this.currentMusic.play();
    } catch (_) {
      // Sin audio cargado — el juego continúa sin música
    }
  }

  // Detiene la música actual y limpia la referencia
  stop() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }
}
