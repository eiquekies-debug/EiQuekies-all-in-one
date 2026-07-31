// Sound FX Engine menggunakan Web Audio API (Tanpa perlu muat turun fail .mp3 luaran)
class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.enabled = localStorage.getItem('eiquekies_sound') !== 'false';
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioCtx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  toggleSound(enable) {
    this.enabled = enable;
    localStorage.setItem('eiquekies_sound', enable);
  }
}

export const soundEngine = new SoundEngine();
