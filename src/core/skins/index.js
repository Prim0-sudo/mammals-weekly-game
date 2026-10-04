// One active skin. Gameplay lives in GameEngine, presentation lives here.
const fieldNotes = {
 render(skin,stage,esc,finished,status,state) {
   return `<div class="field-notes ${status || ''}" aria-label="${state.misses} of ${skin.attempts} mistakes"><strong>${status==='won'?'Observation complete!':status==='lost'?'Pause and read together':'My mammal field notes'}</strong><div class="note-stamps">${Array.from({length:skin.attempts},(_,i)=>`<span class="${i<state.misses?'used':''}">${i<state.misses?'×':'○'}</span>`).join('')}</div><p>${status==='won'?'A new word for your field guide.':status==='lost'?'The answer is ready below.':'Find the letters, one at a time.'}</p></div>`;
 },
 mistake(game,stage,final,item,finish) {game.state.visualStage=stage; game.later(finish,game.reduced()?0:240);},
 win(game,finish) {game.later(finish,game.reduced()?0:300);}
};
export function getSkin(id) {if(id!=='field-notes') throw Error('Unsupported spelling skin '+id); return fieldNotes;}
