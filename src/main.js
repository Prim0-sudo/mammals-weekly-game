import {topic} from './topics/mammals.js';
import {validateTopic} from './core/topic-validator.js';
import {applyTheme} from './core/theme.js';
import {GameEngine} from './core/game-engine.js';
validateTopic(topic); applyTheme(topic);
const game=new GameEngine(topic); game.init();
window.addEventListener('pagehide',()=>game.clean());
// Pause purely decorative CSS effects while hidden; gameplay stays unchanged.
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
