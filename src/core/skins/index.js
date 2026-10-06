// Gameplay lives in GameEngine; the active presentation lives in this adapter.
import {homewardTrail} from './homeward-trail.js';
export function getSkin(id) {if(id==='homeward-trail')return homewardTrail;throw Error('Unsupported spelling skin '+id);}
