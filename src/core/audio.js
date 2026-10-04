export class AudioManager {
  constructor(locale) {
    this.locale = locale;
    this.muted = false;
    this.nodes = new Set();
  }
  stop() {
    globalThis.speechSynthesis?.cancel();
    for (const node of this.nodes) {
      try {
        node.stop();
      } catch {}
    }
    this.nodes.clear();
  }
  toggle() {
    this.muted = !this.muted;
    if (this.muted) this.stop();
    return this.muted;
  }
  speak(text) {
    if (this.muted || !text || !globalThis.speechSynthesis) return;
    const voices = speechSynthesis
      .getVoices()
      .filter((voice) => voice.localService);
    const voice =
      voices.find((v) => v.lang === this.locale) ||
      voices.find((v) => v.lang.split("-")[0] === this.locale.split("-")[0]);
    if (!voice) return;
    this.stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = this.locale;
    utterance.rate = 0.82;
    speechSynthesis.speak(utterance);
  }
  tone(frequency = 640, duration = 0.12) {
    if (this.muted) return;
    try {
      const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!Audio) return;
      this.context ||= new Audio();
      this.context.resume().catch(() => {});
      const node = this.context.createOscillator(),
        gain = this.context.createGain(),
        now = this.context.currentTime;
      node.frequency.value = frequency;
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      node.connect(gain).connect(this.context.destination);
      node.onended = () => {
        this.nodes.delete(node);
        node.disconnect();
        gain.disconnect();
      };
      this.nodes.add(node);
      node.start();
      node.stop(now + duration);
    } catch {
      /* Audio is an optional enhancement. */
    }
  }
}
