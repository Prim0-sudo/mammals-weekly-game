import {
  shuffle,
  normalise,
  letters,
  mistakeStage,
  makeChoices,
  makeFlipDeck,
  removeWheelItem,
  wheelTarget,
  stars,
  eligible,
  supportedCounts,
  takeSession,
  restoreSession,
} from "./logic.js";
import { AudioManager } from "./audio.js";
import { getSkin } from "./skins/index.js";
import { mountLandingScene } from "./landing-scene.js";

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
const button = (label, action, cls = "button", attrs = "") =>
  `<button class="${cls}" data-action="${action}" ${attrs}>${label}</button>`;

export class GameEngine {
  constructor(topic) {
    this.topic = topic;
    this.audio = new AudioManager(topic.locale);
    this.app = document.getElementById("app");
    this.effects = document.getElementById("effects");
    this.timers = new Set();
    this.epoch = 0;
    this.queues = {};
    this.state = { screen: "launch" };
    this.reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  init() {
    document.getElementById("home").onclick = () => this.launch();
    document.getElementById("mute").onclick = () => this.mute();
    document.getElementById("fullscreen").onclick = () => this.fullscreen();
    document.addEventListener("fullscreenchange", () => {
      const on = !!document.fullscreenElement;
      document
        .getElementById("fullscreen")
        .setAttribute("aria-pressed", String(on));
      document.getElementById("fullscreen").textContent = on
        ? "Exit full screen"
        : "Full screen";
    });
    document.addEventListener("keydown", (e) => this.key(e));
    document.addEventListener(
      "error",
      (e) => {
        if (e.target.tagName === "IMG") {
          e.target.classList.add("image-unavailable");
          e.target.setAttribute(
            "aria-label",
            e.target.alt || "Picture unavailable",
          );
          this.announce(
            "A picture could not load. Its description is still available.",
          );
        }
      },
      true,
    );
    this.launch();
  }
  clean() {
    this.landingScene?.destroy();
    this.landingScene = null;
    window.scrollTo({top:0,left:0,behavior:'instant'});

    getSkin(this.topic.modeSkins.spelling.id).cancel?.(this);
    this.epoch++;
    for (const t of this.timers) clearTimeout(t);
    this.timers.clear();
    this.audio.stop();
    this.announce("");
    this.app.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    const effects = document.getElementById("effects");
    effects.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    effects.replaceChildren();
  }
  later(fn, ms) {
    const epoch = this.epoch;
    const timer = setTimeout(() => {
      this.timers.delete(timer);
      if (epoch === this.epoch) fn();
    }, ms);
    this.timers.add(timer);
    return timer;
  }
  announce(text) {
    document.getElementById("announcer").textContent = text;
  }
  focus(selector = "h1") {
    const el = this.app.querySelector(selector);
    if (el) {
      if (!el.matches("button")) el.tabIndex = -1;
      el.focus({ preventScroll: true });
    }
  }
  img(item, cls = "art", alt = item.imageAlt || "", attrs = "") {
    if (item.assetStatus === 'missing') {
      if (cls === 'mode-art') return '<span class="css-icon icon-'+esc(item.id)+'" aria-hidden="true"><i></i><b></b><em></em></span>';
      if (cls === 'category-art') return '';
      if (cls === 'marker-art') return '<span class="marker-label">'+esc(item.name)+'</span>';
      if (cls === 'tile-art') return '';
      return '<div class="missing-art '+cls+'" role="img" aria-label="Picture pending: '+esc(alt || item.imageAlt)+'"><span>Picture pending</span>'+(cls==='answer-art'?'':'<small>'+esc(cls === 'spelling-clue' ? item.definition : (item.imageAlt || alt))+'</small>')+'</div>';
    }
    return `<img class="${cls}" src="${esc(item.image)}" alt="${esc(alt)}" draggable="false" ${attrs}>`;
  }
  bind(action, fn) {
    this.app
      .querySelectorAll(`[data-action="${action}"]`)
      .forEach((el) => (el.onclick = () => fn(el)));
  }
  returnUnplayed() {
    const s = this.state;
    if (s.sessionKind === 'flip') {
      const pending = s.items.filter(x => !s.tiles.some(t => t.item.id === x.id && t.matched));
      this.queues[s.queueKey] = restoreSession(pending, this.queues[s.queueKey] || []);
      s.sessionKind = null;
    }
    if (s.sessionKind === "short") {
      const completed = s.answered || s.spellingStatus ? 1 : 0;
      const key = s.queueKey || s.mode;
      this.queues[key] = restoreSession(
        s.items.slice(s.index + completed),
        this.queues[key] || [],
      );
      s.sessionKind = null;
    }
  }
  launch() {
    this.returnUnplayed();
    this.clean();
    this.state = { screen: "launch" };
    document.getElementById("home").hidden = true;
    this.app.className = "launch-screen";
    this.app.innerHTML = '<section class="welcome" aria-labelledby="welcome-title"><span class="eyebrow">'+esc(this.topic.subject)+'</span><div class="welcome-rule" aria-hidden="true"></div><h1 id="welcome-title">'+esc(this.topic.title)+'</h1><p>'+esc(this.topic.subtitle)+'</p>'+button('Come and explore','launch')+'<span class="welcome-footnote">A little adventure. A world of discovery.</span></section>';
    if(this.topic.launch.sceneLayout) this.landingScene=mountLandingScene(this.app,this.topic.launch.sceneLayout,[this.app.querySelector('.welcome'),document.querySelector('.topbar')]);
    this.bind('launch',()=>this.menu());
    this.focus('[data-action="launch"]');
  }
  menu(focusMode) {
    this.returnUnplayed();
    this.clean();
    this.state = { screen: "menu" };
    document.getElementById("home").hidden = false;
    this.app.className = "menu-screen";
    this.app.innerHTML = `<div class="menu-heading"><span class="eyebrow">${esc(this.topic.text.menuEyebrow)}</span><h1>${esc(this.topic.title)}</h1><p>${esc(this.topic.subtitle)}</p></div><div class="mode-grid">${this.topic.modes.map((m, i) => `<button class="mode-card" data-mode="${m.id}" style="--card:var(--card-${i})" ${m.locked ? "disabled" : ""} aria-label="${esc(m.label + (m.locked ? ". " + m.lockedReason : ""))}"><span class="mode-number">0${i + 1}</span>${this.img(m, "mode-art", "")}<strong>${esc(m.label)}</strong><span class="mode-description">${esc(m.description)}</span>${m.locked ? '<span class="locked-tag">Coming soon</span>' : ""}</button>`).join("")}</div><p class="menu-footnote">${esc(this.topic.text.menuFootnote)}</p>`;
    this.app
      .querySelectorAll("[data-mode]")
      .forEach((el) => (el.onclick = () => this.start(el.dataset.mode)));
    this.focus(focusMode ? `[data-mode="${focusMode}"]` : "h1");
  }
  start(mode) {
    this.returnUnplayed();
    if (this.topic.modes.find((m) => m.id === mode)?.locked) return;
    this.clean();
    this.state = {
      screen: "game",
      mode,
      score: 0,
      index: 0,
      items: [],
      category: null,
      answered: false,
      wrong: false,
      showTarget: true,
      showAnswers: true,
    };
    if (mode === "learn" || mode === "wheel") this.categories();
    else if (mode === "flip") this.categories();
    else this.categories();
    this.focus();
  }
  shell(title, helper = "", content = "", current = 0, total = 0) {
    const s = this.state,
      mode = this.topic.modes.find((m) => m.id === s.mode);
    this.app.className = "game-screen";
    const backLabel = s.category ? "Groups" : "Games";
    this.app.innerHTML = `<section class="game-panel" data-game="${s.mode}"><div class="game-toolbar">${button("← " + backLabel, "back", "subtle")}<span class="eyebrow">${esc(mode.label)}</span><span class="score" aria-label="${s.score} stars">★ <b>${s.score}</b></span></div><div class="progress-line"><span id="round-count">${current} / ${total}</span><div class="progress" role="progressbar" aria-label="Activity progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${total ? Math.round((current / total) * 100) : 0}"><span style="width:${total ? (current / total) * 100 : 0}%"></span></div></div><div class="game-heading"><h1>${esc(title)}</h1>${helper ? `<p>${esc(helper)}</p>` : ""}</div><div id="content">${content}</div><div id="feedback" class="feedback" role="status" aria-live="polite"></div></section>`;
    this.bind("back", () => this.back());
  }
  back() {
    const s = this.state;
    if (s.screen === "reading") {
      this.clean();
      s.screen = "game";
      s.reading = false;
      s.category = null;
      this.categories();
      return;
    }
    if (s.screen === "results") {
      this.menu(s.mode);
      return;
    }
    if (s.category) {
      this.returnUnplayed();
      const id = s.category;
      this.clean();
      s.category = null;
      s.score = 0;
      s.items = [];
      s.index = 0;
      this.categories();
      this.focus(
        id === "all" ? '[data-action="all"]' : `[data-category="${id}"]`,
      );
    } else this.menu(s.mode);
  }
  categories() {
    const s = this.state;
    const pool = s.mode === 'knowledge' ? this.topic.knowledgeQuestions : eligible(this.topic, s.mode);
    const list = this.topic.categories.map((c) => ({
      ...c,
      count: pool.filter((i) => s.mode === 'knowledge' ? i.categoryIds.includes(c.id) : i.categoryId === c.id).length,
    }));
    const cards = list
      .map(
        (c) =>
      `<button class="category-card" data-category="${c.id}">${this.img(c, "category-art")}<strong>${esc(c.label)}</strong><span>${c.count} ${s.mode==='knowledge'?'questions':'words'}</span></button>`,
      )
      .join("");
    this.shell(
      s.mode === "wheel"
        ? "Which words shall we spin?"
        : s.mode === 'learn' ? "Which words shall we meet?" : "Choose a subject group",
      "",
      `<div class="category-grid">${cards}</div>${button(`All ${pool.length} ${s.mode==='knowledge'?'questions':'words'} →`, "all", "button all-words")}${s.mode === "learn" ? button("Read & talk together →", "reading", "button all-words") : ""}`,
      0,
      pool.length,
    );
    this.app
      .querySelectorAll("[data-category]")
      .forEach(
        (el) => (el.onclick = () => this.chooseCategory(el.dataset.category)),
      );
    this.bind("all", () => this.chooseCategory("all"));
    this.bind("reading", () => this.startReading());
    this.focus();
  }
  chooseCategory(id) {
    this.clean();
    const s = this.state;
    s.category = id;
    s.items = eligible(this.topic, s.mode).filter(
      (i) => id === "all" || i.categoryId === id,
    );
    s.index = 0;
    s.score = 0;
    if (s.mode === "wheel") {
      s.remaining = [...s.items];
      s.batch = 1;
      s.totalBatches = Math.ceil(
        s.items.length / this.topic.sessions.wheel.capacity,
      );
      s.selected = null;
      this.newWheelBatch();
      this.wheel();
    } else if (s.mode === "learn") this.round();
    else if (s.mode === "flip") this.flipSetup();
    else this.sessionSetup();
    this.focus();
  }
  sessionSetup() {
    const s = this.state,
      pool = (s.mode === 'knowledge' ? this.topic.knowledgeQuestions : eligible(this.topic, s.mode)).filter(x => !s.category || s.category === "all" || (s.mode === 'knowledge' ? x.categoryIds.includes(s.category) : x.categoryId === s.category)),
      count = Math.min(this.topic.sessions.defaultRoundCount, pool.length);
    const remaining = this.queues[s.mode + ":" + s.category]?.length;
    this.shell(
      "Choose a session length",
      `${this.topic.categories.find(c=>c.id===s.category)?.label || 'All groups'} · ${pool.length} ${s.mode==='knowledge'?'questions':'words'}. Short sessions finish this pool before repeating.`,
      '<div class="session-options">' +
        button(`<strong>${Math.min(count,remaining||count)} ${s.mode==='knowledge'?'questions':'words'}</strong><span>Short adventure${remaining ? ` · ${remaining} remain` : ""}</span>`, "short", "session-card") +
        button(`<strong>All ${pool.length} ${s.mode==='knowledge'?'questions':'words'}</strong><span>The selected group</span>`, "all-words", "session-card") +
        "</div>",
      0,
      pool.length,
    );
    const begin = (all) => {
      this.clean();
      s.queueKey = s.mode + ":" + s.category;
      s.sessionPool = pool;
      const session = all
        ? { items: shuffle(pool) }
        : takeSession(pool, count, this.queues[s.queueKey]);
      if (!all) this.queues[s.queueKey] = session.remaining;
      s.items = session.items;
      s.sessionKind = all ? "all" : "short";
      this.round();
      this.focus();
    };
    this.bind("short", () => begin(false));
    this.bind("all-words", () => begin(true));
    this.focus();
  }
  startReading() {
    this.clean();
    this.state.screen = "reading";
    this.state.category = "reading";
    this.state.items = this.topic.curriculum.readingPractice;
    this.state.index = 0;
    this.state.score = 0;
    this.reading();
  }
  reading() {
    const s = this.state,
      card = s.items[s.index];
    this.shell(
      card.type,
      "",
      '<div class="sentence-reading"><p>' +
        esc(card.text) +
        '</p></div><details class="teacher-note"><summary>Teacher prompt</summary><p>' +
        esc(card.note) +
        "</p></details>" +
        button("Next →", "read-next", "button reading-next"),
      s.index + 1,
      s.items.length,
    );
    this.bind("read-next", () => {
      this.clean();
      s.index++;
      s.score++;
      if (s.index === s.items.length) this.results();
      else this.reading();
    });
    this.focus();
  }
  round() {
    const s = this.state;
    s.answered = false;
    s.wrong = false;
    const item = s.items[s.index];
    if (s.mode === "learn") this.learn(item);
    if (s.mode === "sort") this.sort(item);
    if (s.mode === "identify") this.identify(item);
    if (s.mode === "knowledge") this.knowledge(item);
    if (s.mode === "spelling") {
      this.clean();
      s.guessed = [];
      s.misses = 0;
      s.visualStage = 0;
      s.animating = false;
      s.winExitDone = false;
      s.spellingStatus = "";

      const skin = this.topic.modeSkins.spelling, adapter = getSkin(skin.id);
      if (adapter.prepare && !adapter.isReady(skin)) {
        const epoch = this.epoch;
        s.animating = true;
        this.shell(skin.title, "Getting the scene ready…", '<p role="status">Loading the game pictures…</p>');
        adapter.prepare(skin).then(() => {
          if (this.epoch !== epoch || this.state !== s) return;
          s.animating = false;
          this.spelling(item);
          this.focus();
        }).catch(() => {
          if (this.epoch !== epoch || this.state !== s) return;
          this.feedback("The pictures could not load. Please try again.", () => this.round());
        });
      } else this.spelling(item);
    }
  }
  next() {
    this.clean();
    this.state.index++;
    if (this.state.index >= this.state.items.length) {
      this.state.sessionKind = null;
      this.results();
    } else {
      this.round();
      this.focus();
    }
  }
  learn(item) {
    const s = this.state;
    this.shell(
      this.topic.text.learnPrompt,
      "",
      `<div class="learn-layout">${this.img(item, "feature-art")}<div class="learn-copy"><div class="vocab-word">${esc(item.name)}</div><p class="definition">${esc(item.definition)}</p><div class="say-together"><span>LET’S SAY</span><p>${esc(item.sentence)}</p></div><div class="learn-audio">${button("Say word", "word", "subtle")}${button("Hear meaning", "meaning", "subtle")}</div>${button(s.index === s.items.length - 1 ? "Finish →" : "Next word →", "next")}</div></div>`,
      s.index + 1,
      s.items.length,
    );
    this.bind("word", () => this.audio.speak(item.name));
    this.bind("meaning", () => this.audio.speak(item.definition));
    this.bind("next", () => {
      s.score++;
      this.next();
    });
  }
  answerMarkup(choices) {
    return `<div class="answers ${choices.length > 3 ? "many-answers" : ""}">${choices.map((c, i) => `<button class="answer" data-answer="${esc(c.id)}" data-key="${i + 1}">${c.image && !(c.assetStatus==='missing' && !c.name) ? this.img(c, "answer-art") : ""}<span>${esc(c.label || c.name)}</span></button>`).join("")}</div>`;
  }
  answerEvents(correct, explanation) {
    this.app.querySelectorAll("[data-answer]").forEach(
      (el) =>
        (el.onclick = () => {
          const s = this.state;
          if (s.answered) return;
          if (el.dataset.answer !== correct) {
            s.wrong = true;
            el.disabled = true;
            el.classList.add("wrong");
            this.feedback("Have another look. Try again.");
            this.audio.tone(230);
            return;
          }
          s.answered = true;
          if (!s.wrong) s.score++;
          el.classList.add("correct");
          this.app
            .querySelectorAll("[data-answer]")
            .forEach((b) => (b.disabled = true));
          this.updateScore();
          this.audio.tone();
          this.confetti(25);
          this.feedback("Yes! " + explanation, () => this.next());
        }),
    );
  }
  sort(item) {
    const s = this.state;
    this.shell(
      `Which group teaches “${item.name}”?`,
      "Sort by the word’s place in our field guide.",
      `<div class="sort-clue">${this.img(item, "clue-art")}</div>${this.answerMarkup(this.topic.categories)}`,
      s.index + 1,
      s.items.length,
    );
    const c = this.topic.categories.find((c) => c.id === item.categoryId);
    this.answerEvents(c.id, `${item.name} belongs in ${c.label}.`);
  }
  identify(item) {
    const s = this.state;
    this.shell(
      `Which one is “${item.name}”?`,
      "",
      `<div class="teacher-tools">${button("Target picture", "target-toggle", "subtle", `aria-pressed="${s.showTarget}"`)}${button("Answer pictures", "answers-toggle", "subtle", `aria-pressed="${s.showAnswers}"`)}${button("Hear word", "hear", "subtle")}</div><div class="identify-target ${s.showTarget ? "" : "concealed"}">${this.img(item, "clue-art")}</div>${this.answerMarkup(makeChoices(item, s.sessionPool || eligible(this.topic, "identify")))}`,
      s.index + 1,
      s.items.length,
    );
    this.app
      .querySelector(".answers")
      .classList.toggle("conceal-answers", !s.showAnswers);
    this.bind("target-toggle", (el) => {
      s.showTarget = !s.showTarget;
      el.setAttribute("aria-pressed", String(s.showTarget));
      this.app
        .querySelector(".identify-target")
        .classList.toggle("concealed", !s.showTarget);
    });
    this.bind("answers-toggle", (el) => {
      s.showAnswers = !s.showAnswers;
      el.setAttribute("aria-pressed", String(s.showAnswers));
      this.app
        .querySelector(".answers")
        .classList.toggle("conceal-answers", !s.showAnswers);
    });
    this.bind("hear", () => this.audio.speak(item.name));
    this.answerEvents(item.id, this.topic.text.correctItem);
  }
  knowledge(q) {
    const s = this.state,
      visual = this.topic.items.find((x) => x.id === q.visualItemId);
    this.shell(
      q.prompt,
      "",
      `${visual ? `<div class="sort-clue">${this.img(visual, "clue-art")}</div>` : ""}${this.answerMarkup(shuffle(q.choices))}`,
      s.index + 1,
      s.items.length,
    );
    this.answerEvents(q.correctChoiceId, q.explanation);
  }
  feedback(message, onNext) {
    const el = document.getElementById("feedback");
    el.innerHTML = `<span>${esc(message)}</span>${onNext ? button("Next →", "continue") : ""}`;
    if (onNext) {
      this.bind("continue", onNext);
      this.focus('[data-action="continue"]');
    }
  }
  updateScore() {
    this.app.querySelector(".score b").textContent = this.state.score;
    this.app
      .querySelector(".score")
      .setAttribute("aria-label", this.state.score + " stars");
  }
  spelling(item) {
    getSkin(this.topic.modeSkins.spelling.id).cancel?.(this);
    const s = this.state,
      normal = normalise(item.name, this.topic),
      all = letters(item.name, this.topic),
      limit = this.topic.modeSkins.spelling.attempts ?? Math.min(10, all.length),
      skin = this.topic.modeSkins.spelling;
    const word = normal
      .split(" ")
      .map(
        (w) =>
          '<span class="word-part">' +
          [...w]
            .map((c) =>
              this.topic.text.alphabet.includes(c)
                ? '<span class="letter-slot">' +
                  (s.guessed.includes(c) || s.spellingStatus
                    ? esc(c.toLocaleUpperCase(this.topic.locale))
                    : '<span class="sr-only">Hidden letter</span>') +
                  "</span>"
                : "<span>" + esc(c) + "</span>",
            )
            .join("") +
          "</span>",
      )
      .join('<span class="word-space" aria-label="space"></span>');
    const keyboard = [...this.topic.text.alphabet]
      .map(
        (c) =>
          '<button class="letter-key ' +
          (s.guessed.includes(c)
            ? all.includes(c)
              ? "used-correct"
              : "used-wrong"
            : "") +
          '" data-letter="' +
          c +
          '" ' +
          (s.guessed.includes(c) || s.spellingStatus || s.animating
            ? "disabled"
            : "") +
          ">" +
          esc(c.toLocaleUpperCase(this.topic.locale)) +
          "</button>",
      )
      .join("");
    const wrong = s.guessed
      .filter((c) => !all.includes(c))
      .join(", ")
      .toUpperCase();
    this.shell(
      skin.title,
      skin.instruction,
      '<div class="spelling-layout">' +
        this.img(item, "spelling-clue") +
        '<div class="spelling-play">' +
        getSkin(skin.id).render(skin, s.visualStage, esc, s.winExitDone, s.spellingStatus, s) +
        '<div class="spelling-attempts"><strong class="guess-count">' +
        Math.max(0, limit - s.misses) +
        (limit - s.misses === 1 ? " try left" : " tries left") + "</strong><span>Wrong letters: " +
        esc(wrong || "none yet") +
        '</span></div></div></div><div class="spelling-word" aria-label="' +
        (s.spellingStatus ? esc(item.name) : "Hidden word") +
        '">' +
        word +
        '</div><div class="keyboard" aria-label="Letter keyboard">' +
        keyboard +
        "</div>",
      s.index + 1,
      s.items.length,
    );
    this.app
      .querySelectorAll("[data-letter]")
      .forEach((el) => (el.onclick = () => this.guess(el.dataset.letter)));
    if (s.spellingStatus && !s.animating)
      this.feedback(
        s.spellingStatus === "won"
          ? "You spelled “" + item.name + "”!"
          : "The word is “" + item.name + "”. Let’s try another together.",
        () => this.next(),
      );
  }
  guess(letter) {
    const s = this.state;
    if (
      s.screen !== "game" ||
      s.mode !== "spelling" ||
      !s.guessed ||
      s.spellingStatus ||
      s.animating ||
      s.guessed.includes(letter) ||
      !this.topic.text.alphabet.includes(letter)
    )
      return;
    const item = s.items[s.index],
      all = letters(item.name, this.topic),
      limit = this.topic.modeSkins.spelling.attempts ?? Math.min(10, all.length),
      skin = this.topic.modeSkins.spelling,
      epoch = this.epoch;
    const valid = () => this.epoch === epoch && this.state === s;
    s.guessed.push(letter);
    getSkin(skin.id).capture?.(this);
    getSkin(skin.id).cancel?.(this);
    if (all.includes(letter)) {
      if (all.every((c) => s.guessed.includes(c))) {
        s.spellingStatus = "won";
        s.animating = true;
        this.spelling(item);
        this.announce(skin.winAnnouncement);
        getSkin(skin.id).win(this, () => {
          if (!valid()) return;
          s.animating = false;
          s.winExitDone = true;
          s.score++;
          this.spelling(item);
          this.audio.tone(780);
          this.confetti(75);
          this.focus('[data-action="continue"]');
        });
      } else {
        this.audio.tone();
        this.spelling(item);
        getSkin(skin.id).correct?.(this);
        this.announce("Letter found!");
        this.focus(".letter-key:not(:disabled)");
      }
      return;
    }
    s.misses++;
    s.animating = true;
    this.spelling(item);
    this.audio.tone(230);
    this.announce(skin.wrongAnnouncement);
    const final = s.misses >= limit;
    getSkin(skin.id).mistake(
      this,
      mistakeStage(s.misses, limit),
      final,
      item,
      () => {
        if (!valid()) return;
        s.animating = false;
        if (final) s.spellingStatus = "lost";
        this.spelling(item);
        this.announce(
          final
            ? "The word is " + item.name + ". Let’s try another together."
            : "Try another letter.",
        );
        this.focus(
          final ? '[data-action="continue"]' : ".letter-key:not(:disabled)",
        );
      },
    );
  }
  flipSetup() {
    this.flipCountSetup();
  }
  flipCountSetup() {
    const pool = eligible(this.topic, "flip").filter(x => !this.state.category || this.state.category === "all" || x.categoryId === this.state.category);
    const counts = this.topic.sessions.supportedFlipWordCounts.filter((n) => n <= pool.length);
    if (!counts.length && pool.length >= 2) counts.push(pool.length);
    this.shell(
      "Choose your matching board",
      `Choose how many words to match from all ${pool.length}. Each word has two matching tiles.`,
      `<div class="session-options">${counts.map((n) => button(`<strong>${n} words</strong><span>${n * 2} tiles</span>`, "flip-count", "session-card", `data-count="${n}"`)).join("")}</div>`,
      0,
      pool.length,
    );
    this.bind("flip-count", (el) => this.startFlip(+el.dataset.count));
    this.focus();
  }
  startFlip(count) {
    this.clean();
    const s = this.state;
    const pool = eligible(this.topic, "flip").filter(x => !this.state.category || this.state.category === "all" || x.categoryId === this.state.category);
    s.queueKey = 'flip:' + s.category;
    const selection = takeSession(pool, count, this.queues[s.queueKey]);
    this.queues[s.queueKey] = selection.remaining;
    s.sessionKind = 'flip';
    count = selection.items.length;
    s.tiles = makeFlipDeck(selection.items, count);
    s.items = [...new Map(s.tiles.map((t) => [t.item.id, t.item])).values()];
    s.matches = 0;
    s.locked = false;
    s.first = null;
    s.mismatch = null;
    this.shell(
      "Find the matching pairs",
      "",
      `<div class="flip-board flip-board--${count}" data-size="${count * 2}">${s.tiles.map((t, i) => `<button class="tile" data-tile="${t.id}" aria-label="Tile ${i + 1}"><span class="tile-inner"><span class="tile-back" aria-hidden="true">${i + 1}</span><span class="tile-front" aria-hidden="true">${this.img(t.item, "tile-art", "")}<span>${esc(t.item.name)}</span></span></span></button>`).join("")}</div>`,
      0,
      count,
    );
    this.app
      .querySelectorAll("[data-tile]")
      .forEach((el) => (el.onclick = () => this.flip(el.dataset.tile)));
    this.focus();
  }
  tileEl(id) {
    return this.app.querySelector(`[data-tile="${id}"]`);
  }
  updateTile(tile) {
    const el = this.tileEl(tile.id),
      shown = tile.open || tile.matched;
    el.classList.toggle("open", !!shown);
    el.classList.toggle("matched", !!tile.matched);
    el.disabled = !!tile.matched;
    el.setAttribute(
      "aria-label",
      shown ? tile.item.name : "Tile " + (this.state.tiles.indexOf(tile) + 1),
    );
    el.querySelector(".tile-front").setAttribute("aria-hidden", String(!shown));
  }
  flip(id) {
    const s = this.state,
      tile = s.tiles.find((t) => t.id === id);
    if (s.locked || tile.matched) return;
    if (tile.open) return;
    if (s.mismatch) {
      for (const previous of s.mismatch) {
        previous.open = false;
        this.updateTile(previous);
      }
      s.mismatch = null;
      s.first = null;
    }
    if (tile.open) return;
    tile.open = true;
    this.updateTile(tile);
    if (!s.first) {
      s.first = tile;
      return;
    }
    const first = s.first,
      match = first.item.id === tile.item.id;
    if (!match) {
      s.mismatch = [first, tile];
      s.first = null;
      this.announce(
        "Have another look. Choose another tile when you are ready.",
      );
      return;
    }
    s.locked = true;
    this.later(
      () => {
        first.matched = tile.matched = true;
        s.matches++;
        s.score = s.matches;
        this.confetti(s.matches === s.items.length ? 130 : 22);
        this.audio.tone();
        this.announce("A matching pair!");
        this.updateTile(first);
        this.updateTile(tile);
        s.locked = false;
        s.first = null;
        this.updateScore();
        this.updateProgress(s.matches, s.items.length);
        if (s.matches === s.items.length)
          this.feedback("Every pair found!", () => this.results());
        else this.focus(".tile:not(:disabled)");
      },
      this.reduced() ? 500 : 850,
    );
  }
  updateProgress(current, total) {
    document.getElementById("round-count").textContent =
      `${current} / ${total}`;
    const el = this.app.querySelector(".progress");
    el.setAttribute("aria-valuenow", Math.round((current / total) * 100));
    el.firstElementChild.style.width = (current / total) * 100 + "%";
  }
  newWheelBatch() {
    const s = this.state;
    s.wheelPool = s.remaining.slice(0, this.topic.sessions.wheel.capacity);
    s.rotation = 0;
    s.spinning = false;
  }
  wheel() {
    const s = this.state;
    if (s.selected) {
      this.shell(
        "Read this word together",
        "",
        `<div class="reading-word">${esc(s.selected.name)}</div>${button("Next →", "wheel-next", "button reading-next")}`,
        s.score,
        s.items.length,
      );
      this.bind("wheel-next", () => this.nextWheel());
      this.focus('[data-action="wheel-next"]');
      return;
    }
    const n = s.wheelPool.length,
      slice = 360 / n;
    const gradient = `conic-gradient(from 90deg, ${s.wheelPool.map((_, i) => `${this.topic.theme.cardColors[i % this.topic.theme.cardColors.length]} ${i * slice}deg ${(i + 1) * slice}deg`).join(",")})`;
    const markers = s.wheelPool
      .map((item, i) => {
        const angle = ((i + 0.5) * slice * Math.PI) / 180;
        return `<span class="wheel-marker" style="left:${50 + 35 * Math.cos(angle)}%;top:${50 + 35 * Math.sin(angle)}%;--counter:${-s.rotation}deg">${this.img(item, "marker-art", "")}</span>`;
      })
      .join("");
    this.shell(
      "What will we read next?",
      s.totalBatches > 1
        ? `All ${s.items.length} words · batch ${s.batch} of ${s.totalBatches} · ${s.remaining.length} words left`
        : `${s.remaining.length} words left`,
      `<div class="wheel-stage"><div class="wheel-disc" style="background:${gradient};transform:rotate(${s.rotation}deg)">${markers}</div>${button(s.spinning ? "…" : "SPIN", "spin", "wheel-hub", s.spinning ? "disabled" : "")}<span class="wheel-pointer" aria-hidden="true"></span></div>`,
      s.score,
      s.items.length,
    );
    this.bind("spin", () => this.spin());
  }
  spin() {
    const s = this.state;
    if (s.spinning || s.selected) return;
    s.spinning = true;
    const idx = Math.floor(Math.random() * s.wheelPool.length),
      item = s.wheelPool[idx],
      target = wheelTarget(idx, s.wheelPool.length, s.rotation);
    const duration = this.reduced() ? 0 : 2400;
    const disc = this.app.querySelector(".wheel-disc"),
      hub = this.app.querySelector('[data-action="spin"]');
    hub.disabled = true;
    hub.textContent = "…";
    disc.style.transition = duration
      ? `transform ${duration}ms cubic-bezier(.18,.68,.12,1)`
      : "none";
    void disc.offsetWidth;
    disc.style.transform = `rotate(${target}deg)`;
    if (duration)
      for (let i = 0; i < 18; i++)
        this.later(
          () => this.audio.tone(980, 0.025),
          Math.round(duration * (i / 18) ** 1.6),
        );
    this.later(() => {
      s.rotation = target;
      this.announce("The wheel has landed.");
      this.later(
        () => {
          s.selected = item;
          s.spinning = false;
          this.wheel();
        },
        this.reduced() ? 150 : 800,
      );
    }, duration);
  }
  nextWheel() {
    this.clean();
    const s = this.state,
      id = s.selected.id;
    s.remaining = removeWheelItem(s.remaining, id);
    s.wheelPool = removeWheelItem(s.wheelPool, id);
    s.selected = null;
    s.score++;
    if (!s.remaining.length) {
      this.results();
      return;
    }
    if (!s.wheelPool.length) {
      s.batch++;
      this.newWheelBatch();
    } else s.rotation = 0;
    this.wheel();
    this.focus('[data-action="spin"]');
  }
  results() {
    this.returnUnplayed();
    this.clean();
    const s = this.state;
    s.screen = "results";
    const count = stars(s.score, s.items.length);
    this.app.className = "results-screen";
    this.app.innerHTML = `<section class="results-panel"><span class="eyebrow">ADVENTURE COMPLETE</span><div class="result-stars" aria-label="${count} stars">${"★".repeat(count)}</div><h1>Look what you did!</h1><p>${esc(this.topic.completionMessages[s.mode])}</p><div class="result-score">${s.score}<span> / ${s.items.length}</span></div><div class="result-actions">${button("Play again", "again")}${button("Choose another game", "menu", "subtle")}</div></section>`;
    this.bind("again", () => this.start(s.mode));
    this.bind("menu", () => this.menu(s.mode));
    this.focus();
    this.confetti(110);
  }
  confetti(count) {
    if (this.reduced()) return;
    const root = document.getElementById("effects");
    root.replaceChildren();
    for (let i = 0; i < count; i++) {
      const el = document.createElement("i");
      el.style.cssText = `left:${Math.random() * 100}%;background:${this.topic.theme.cardColors[i % this.topic.theme.cardColors.length]};animation-delay:${Math.random() * 0.3}s;--drift:${Math.random() * 200 - 100}px`;
      root.append(el);
    }
    this.later(() => root.replaceChildren(), 2100);
  }
  mute() {
    const muted = this.audio.toggle(),
      el = document.getElementById("mute");
    el.setAttribute("aria-pressed", String(muted));
    el.textContent = muted ? "Sound off" : "Sound on";
    this.announce(muted ? "Sound muted" : "Sound on");
  }
  async fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      this.announce("Full screen is unavailable in this browser.");
    }
  }
  key(e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
    const s = this.state;
    if (e.key === "Escape") {
      e.preventDefault();
      if (
        s.screen === "game" ||
        s.screen === "results" ||
        s.screen === "reading"
      )
        this.back();
      else if (s.screen === "menu") this.launch();
      return;
    }
    // Letter keys belong to spelling while its keyboard is active; utility buttons remain available.
    if (
      s.screen === "game" &&
      s.mode === "spelling" &&
      s.guessed &&
      this.topic.text.alphabet.includes(
        e.key.toLocaleLowerCase(this.topic.locale),
      )
    ) {
      e.preventDefault();
      this.guess(e.key.toLocaleLowerCase(this.topic.locale));
      return;
    }
    if (e.key.toLowerCase() === "m") {
      e.preventDefault();
      this.mute();
      return;
    }
    if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      this.fullscreen();
      return;
    }
    if (s.screen !== "game") return;
    if (/^[1-9]$/.test(e.key)) {
      const el = this.app.querySelector(`[data-key="${e.key}"]`);
      if (el && !el.disabled) {
        e.preventDefault();
        el.click();
      }
    }
    if (e.key === "Enter" && e.target.tagName !== "BUTTON") {
      const el = this.app.querySelector('[data-action="continue"]');
      if (el) {
        e.preventDefault();
        el.click();
      }
    }
  }
}
