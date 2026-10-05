export const REVEAL_SECONDS = 45;
export const REVEAL_DURATIONS = [30, 45, 60];
export const MOSAIC_COLUMNS = 12;
export const MOSAIC_ROWS = 10;
export const MOSAIC_TILES = MOSAIC_COLUMNS * MOSAIC_ROWS;

// Count active time only: pausing and hidden tabs must never consume a round.
export class RevealClock {
  constructor(now = () => performance.now(), duration = REVEAL_SECONDS) {
    this.now = now;
    this.duration = duration;
    this.accumulated = 0;
    this.started = null;
  }
  resume() {
    if (this.started === null && this.seconds < this.duration) this.started = this.now();
  }
  pause() {
    if (this.started !== null) {
      this.accumulated += this.now() - this.started;
      this.started = null;
    }
  }
  get seconds() {
    return Math.min(this.duration, Math.max(0, (this.accumulated + (this.started === null ? 0 : this.now() - this.started)) / 1000));
  }
  get blocks() { return Math.floor(this.seconds * MOSAIC_TILES / this.duration); }
}
