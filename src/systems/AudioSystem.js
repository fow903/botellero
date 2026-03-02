export default class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentMusic = null;
    this.musicKeys = {};
  }

  registerMusic(sectionKey, musicKey) {
    this.musicKeys[sectionKey] = musicKey;
  }

  playSectionMusic(section) {
    const key = section.musicKey || this.musicKeys[section.distance];
    if (!key) return;
    try {
      if (this.currentMusic && this.currentMusic.key === key) return;
      if (this.currentMusic) {
        this.currentMusic.stop();
      }
      this.currentMusic = this.scene.sound.add(key, { loop: true, volume: 0.3 });
      this.currentMusic.play();
    } catch (_) {
      // Sin audio cargado
    }
  }

  stop() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }
}
