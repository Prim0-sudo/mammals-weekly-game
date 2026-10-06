import {letters} from '../logic.js';

export const TRAIL = Object.freeze({width:1672,height:941,start:230,home:1370,groundStart:706,groundHome:662,bodyWidth:116});
export const HOP_MS = 350;
export const ENTRY_MS = 600;
export const clamp = value => Math.max(0,Math.min(1,value));
export const distinctLetters = (answer,topic) => [...new Set(letters(answer,topic))];
export const TRAIL_MIDDLE = (TRAIL.start+TRAIL.home)/2;
export const WRONG_STEP = Math.ceil((TRAIL.home-TRAIL.start)/18);
export function guessedTrailPosition(answer,guessed,topic) {
 const targets=new Set(distinctLetters(answer,topic)),seen=new Set();
 let x=TRAIL.start,remaining=targets.size;
 for(const letter of guessed) {
  if(seen.has(letter))continue;
  seen.add(letter);
  if(targets.has(letter)){x+=(TRAIL.home-x)/remaining;remaining--;}
  else if(x<TRAIL_MIDDLE)x=Math.min(TRAIL_MIDDLE,x+WRONG_STEP);
 }
 const progress=(x-TRAIL.start)/(TRAIL.home-TRAIL.start);
 return {x,y:TRAIL.groundStart+(TRAIL.groundHome-TRAIL.groundStart)*progress};
}
export function trailPosition(correct,count) {
 const progress=count>0?clamp(correct/count):1;
 return {x:TRAIL.start+(TRAIL.home-TRAIL.start)*progress,y:TRAIL.groundStart+(TRAIL.groundHome-TRAIL.groundStart)*progress};
}
export function hopPose(elapsed,from,to,arc=44) {
 const p=clamp((elapsed-40)/290),smooth=p*p*(3-2*p);
 const frame=elapsed<40?'rabbit-sit-right':elapsed<130?'rabbit-hop-01-takeoff':elapsed<240?'rabbit-hop-02-airborne':elapsed<330?'rabbit-hop-03-landing':'rabbit-sit-right';
 return {frame,x:from.x+(to.x-from.x)*smooth,y:from.y+(to.y-from.y)*smooth-Math.sin(Math.PI*p)*arc,scale:1};
}
export function entryPose(elapsed) {
 const p=clamp(elapsed/ENTRY_MS);
 // Hold near the doorway for the rear/tail poses, then slip behind the right lip.
 const travel=elapsed<180?45*clamp(elapsed/180):elapsed<380?45+45*clamp((elapsed-180)/200):90+220*Math.pow(clamp((elapsed-380)/220),2);
 return {frame:elapsed<180?'rabbit-entry-01-crouch':elapsed<380?'rabbit-entry-02-rear-quarter':'rabbit-entry-03-tail',
  x:TRAIL.home+travel,y:TRAIL.groundHome-8*p,scale:1-.48*p,occlude:true,hidden:p===1};
}
export function escapeDuration(from) {return Math.max(800,(from.x+300)/1.65+80);}
export function escapePose(elapsed,from,duration) {
 const p=clamp((elapsed-80)/(duration-80));
 const cycle=['rabbit-escape-01-push-off','rabbit-escape-02-flight','rabbit-escape-03-landing'];
 return {frame:elapsed<80?'rabbit-sit-right':cycle[Math.floor((elapsed-80)/80)%3],
  mirror:elapsed<80,x:from.x+(-300-from.x)*p,y:from.y+(TRAIL.groundStart-from.y)*p-Math.sin(Math.PI*((Math.max(0,elapsed-80)%240)/240))*24,scale:1,hidden:p===1,
  foxX:1810+(1455-1810)*(1-Math.pow(1-clamp(elapsed/300),3))};
}
