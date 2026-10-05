import { RevealClock, REVEAL_SECONDS, REVEAL_DURATIONS, MOSAIC_COLUMNS, MOSAIC_ROWS, MOSAIC_TILES } from './detective-clock.js';
import { shuffle } from './logic.js';

const modes = [
  {id:'silhouette', title:'Silhouette', icon:'◐'},
  {id:'pixel', title:'Pixel Reveal', icon:'▦'},
  {id:'mosaic', title:'Mosaic Reveal', icon:'▧'},
];
const button = (label, action, extra = '') => `<button class="button" data-action="${action}" ${extra}>${label}</button>`;

export class Detective {
  constructor(engine) {
    this.engine = engine;
    this.active = true;
    this.timer = null;
    this.duration = REVEAL_SECONDS;
    this.visibility = () => {
      if (document.hidden && this.clock && this.clock.started !== null) {
        this.clock.pause();
        this.update();
      }
    };
    document.addEventListener('visibilitychange', this.visibility);
    this.setup();
  }
  stop() { clearTimeout(this.timer); this.timer = null; this.clock?.pause(); }
  destroy() {
    this.active = false;
    this.stop();
    document.removeEventListener('visibilitychange', this.visibility);
  }
  setup() {
    this.stop();
    this.roundId = (this.roundId || 0) + 1;
    this.roundActive = false;
    this.engine.shell('Detective', '',
      `<div class="detective-options">${modes.map(m => `<button class="session-card" data-reveal="${m.id}"><span class="detective-option-icon" aria-hidden="true">${m.icon}</span><strong>${m.title}</strong></button>`).join('')}</div>`);
    this.engine.app.querySelectorAll('[data-reveal]').forEach(el => el.onclick = () => this.begin(el.dataset.reveal));
    this.engine.focus();
  }
  async begin(id) {
    this.stop();
    const roundId = ++this.roundId;
    const mode = modes.find(m => m.id === id);
    if (!mode) return;
    this.mode = id;
    this.roundActive = true;
    this.revealed = false;
    this.scene = null;
    this.clock = new RevealClock(undefined, this.duration);
    this.order = shuffle(Array.from({length:MOSAIC_TILES}, (_,i) => i));
    this.engine.shell(mode.title, '',
      `<div class="detective-stage" aria-busy="true"><canvas class="detective-canvas" width="1536" height="1024" role="img" aria-label="Mystery mammal picture"></canvas><span class="detective-loading">Loading picture…</span></div><div class="detective-status">${id === 'silhouette' ? '' : `<div class="detective-durations" role="group" aria-label="Reveal duration">${REVEAL_DURATIONS.map(seconds => `<button class="subtle" data-duration="${seconds}" aria-pressed="${seconds === this.duration}">${seconds}s</button>`).join('')}</div>`}<span id="detective-time" role="timer" ${id === 'silhouette' ? 'hidden' : ''}></span><progress id="detective-progress" max="${this.clock.duration}" value="0" aria-label="Picture reveal progress" ${id === 'silhouette' ? 'hidden' : ''}></progress></div><div class="detective-controls">${id === 'silhouette' ? '' : button('Start','detective-pause','disabled')}${button('Guess','detective-guess','disabled')}${button('Reveal','detective-reveal','disabled')}${button('Next','detective-next','disabled')}${button('Modes','detective-setup')}</div><div class="detective-answers" hidden><div class="answers">${shuffle(['Elephant','Rhinoceros','Hippopotamus']).map((name,i) => `<button class="answer" data-detective-answer="${name}" data-key="${i+1}">${name}</button>`).join('')}</div></div>`);
    this.engine.bind('detective-setup', () => this.setup());
    this.engine.app.querySelectorAll('[data-duration]').forEach(el => el.onclick = () => {
      if (this.revealed || this.clock.started !== null || this.clock.seconds > 0) return;
      this.duration = Number(el.dataset.duration);
      this.clock.duration = this.duration;
      this.engine.app.querySelector('#detective-progress').max = this.duration;
      this.engine.app.querySelectorAll('[data-duration]').forEach(option => option.setAttribute('aria-pressed', String(Number(option.dataset.duration) === this.duration)));
      this.update();
    });
    this.canvas = this.engine.app.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.engine.focus();
    try {
      const load = (src) => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; });
      const assets = this.engine.topic.detectiveDemo;
      const [scene, cutout] = await Promise.all([load(assets.scene), id === 'silhouette' ? load(assets.cutout) : Promise.resolve(null)]);
      if (!this.active || this.roundId !== roundId) return;
      this.scene = scene;
      this.cutout = cutout;
      this.small = document.createElement('canvas');
      this.engine.app.querySelector('.detective-loading').remove();
      this.engine.app.querySelector('.detective-stage').setAttribute('aria-busy', 'false');
      for (const action of ['detective-pause','detective-guess','detective-reveal']) {
        const el = this.engine.app.querySelector(`[data-action="${action}"]`);
        if (el) el.disabled = false;
      }
      this.engine.bind('detective-pause', () => {
        if (this.clock.started === null) { this.clock.resume(); this.tick(); }
        else { this.stop(); this.update(); }
      });
      this.engine.bind('detective-guess', () => {
        this.stop();
        this.update();
        this.engine.app.querySelector('.detective-answers').hidden = false;
        this.engine.focus('[data-detective-answer]:not(:disabled)');
      });
      this.engine.bind('detective-reveal', () => this.reveal(false));
      this.engine.bind('detective-next', () => this.setup());
      this.engine.app.querySelectorAll('[data-detective-answer]').forEach(el => el.onclick = () => {
        if (this.revealed) return;
        if (el.dataset.detectiveAnswer === assets.answer) this.reveal(true);
        else {
          el.disabled = true;
          this.feedback('Try again.');
          this.engine.focus('[data-detective-answer]:not(:disabled)');
        }
      });
      this.update();
    } catch {
      if (!this.active || this.roundId !== roundId) return;
      this.engine.app.querySelector('.detective-loading').textContent = 'Picture unavailable. Try again.';
      this.engine.app.querySelector('.detective-stage').setAttribute('aria-busy','false');
    }
  }
  tick() {
    if (!this.active || !this.roundActive || this.revealed) return;
    this.update();
    if (this.clock.seconds >= this.clock.duration) { this.reveal(false); return; }
    if (this.clock.started !== null) this.timer = setTimeout(() => this.tick(), 100);
  }
  update() {
    if (!this.roundActive || !this.scene || this.revealed) return;
    this.draw();
    const paused = this.clock.started === null;
    const button = this.engine.app.querySelector('[data-action="detective-pause"]');
    if (button) button.textContent = paused ? (this.clock.seconds ? 'Resume' : 'Start') : 'Pause';
    if (this.mode !== 'silhouette') {
      const started = this.clock.started !== null || this.clock.seconds > 0;
      this.engine.app.querySelector('.detective-durations').hidden = started;
      this.engine.app.querySelector('#detective-time').hidden = !started;
      this.engine.app.querySelector('#detective-time').textContent = `${Math.ceil(this.clock.duration-this.clock.seconds)}s`;
      this.engine.app.querySelector('#detective-progress').value = this.clock.seconds;
    }
  }
  draw() {
    const {ctx,canvas,scene} = this;
    const {width:w,height:h} = canvas;
    ctx.clearRect(0,0,w,h);
    if (this.revealed) { ctx.drawImage(scene,0,0,w,h); return; }
    if (this.mode === 'silhouette') {
      ctx.drawImage(this.cutout,0,0,w,h);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#23483b'; ctx.fillRect(0,0,w,h);
      ctx.globalCompositeOperation = 'source-over';
      return;
    }
    if (this.mode === 'pixel') {
      // True pixelation: sample at low resolution, then enlarge without smoothing.
      const progress = this.clock.seconds / this.clock.duration;
      const columns = Math.round(6 * Math.pow(w/6, progress));
      this.small.width = columns; this.small.height = Math.max(1,Math.round(columns*h/w));
      const smallCtx = this.small.getContext('2d');
      smallCtx.drawImage(scene,0,0,this.small.width,this.small.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.small,0,0,w,h);
      ctx.imageSmoothingEnabled = true;
      return;
    }
    ctx.fillStyle = '#e8e7d6'; ctx.fillRect(0,0,w,h);
    const visible = new Set(this.order.slice(0,this.clock.blocks));
    for (let i=0;i<MOSAIC_TILES;i++) {
      const tileW=w/MOSAIC_COLUMNS, tileH=h/MOSAIC_ROWS;
      const x=i%MOSAIC_COLUMNS*tileW, y=Math.floor(i/MOSAIC_COLUMNS)*tileH;
      if (visible.has(i)) ctx.drawImage(scene,x,y,tileW,tileH,x,y,tileW,tileH);
      else {
        ctx.fillStyle = i%2 ? '#d4dfcc' : '#e8e7d6'; ctx.fillRect(x,y,tileW,tileH);
        ctx.strokeStyle = '#81967a'; ctx.lineWidth=2; ctx.strokeRect(x,y,tileW,tileH);
      }
    }
  }
  feedback(text) {
    this.engine.app.querySelector('#feedback').textContent = text;
  }
  reveal(correct) {
    if (this.revealed) return;
    this.stop(); this.revealed = true;
    this.draw();
    this.canvas.setAttribute('aria-label',this.engine.topic.detectiveDemo.alt);
    this.engine.app.querySelector('#detective-time').hidden = true;
    const durations = this.engine.app.querySelector('.detective-durations');
    if (durations) durations.hidden = true;
    this.engine.app.querySelector('#detective-progress').value = this.clock.duration;
    for (const action of ['detective-pause','detective-guess','detective-reveal']) {
      const el = this.engine.app.querySelector(`[data-action="${action}"]`);
      if (el) el.disabled=true;
    }
    this.engine.app.querySelectorAll('[data-detective-answer]').forEach(el=>el.disabled=true);
    this.engine.app.querySelector('[data-action="detective-next"]').disabled=false;
    if (correct) {
      this.engine.state.score++;
      this.engine.app.querySelector('.score b').textContent=this.engine.state.score;
      this.engine.app.querySelector('.score').setAttribute('aria-label',`${this.engine.state.score} stars`);
    }
    this.feedback(correct ? 'Elephant! Well done.' : 'Elephant.');
    this.engine.focus('[data-action="detective-next"]');
  }
}
