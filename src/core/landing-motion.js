const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const smooth = value => { const t = clamp(value, 0, 1); return t * t * (3 - 2 * t); };

// Cubic segments are measured in the original painting, never viewport percentages.
function bezier(points, t) {
  const u = 1 - t;
  return {x: u**3*points[0][0]+3*u*u*t*points[1][0]+3*u*t*t*points[2][0]+t**3*points[3][0],
    y: u**3*points[0][1]+3*u*u*t*points[1][1]+3*u*t*t*points[2][1]+t**3*points[3][1]};
}
export function measureRoute(segments) {
  const samples = []; let length = 0, previous;
  segments.forEach((segment, index) => {
    for (let step = index ? 1 : 0; step <= 120; step++) {
      const point = bezier(segment, step / 120);
      if (previous) length += Math.hypot(point.x-previous.x, point.y-previous.y);
      samples.push({...point, distance:length}); previous = point;
    }
  });
  return {segments, samples, length};
}
export function routePoint(route, progress) {
  const distance = clamp(progress, 0, 1) * route.length, list = route.samples;
  let low = 0, high = list.length - 1;
  while (low < high) { const mid = (low+high)>>1; if (list[mid].distance < distance) low=mid+1; else high=mid; }
  const a=list[Math.max(0,low-1)], b=list[Math.max(1,low)], fraction=(distance-a.distance)/(b.distance-a.distance || 1);
  return {x:a.x+(b.x-a.x)*fraction, y:a.y+(b.y-a.y)*fraction, angle:Math.atan2(b.y-a.y,b.x-a.x)};
}
export function encounterPlan(cycle=0) {
  const rows=[['squirrel-peek',6400,cycle%2?'rightPeek':'leftPeek',false],
    ['mouse',3000,'mouseRun',cycle%2===1],
    ['bat',10000,cycle%2?'skyHigh':'skyLow',cycle%2===1],
    ['squirrel-run',6500,'squirrelRun',false],
    ['bat',9000,cycle%2?'skyLow':'skyHigh',cycle%2===0]];
  let start=0;
  const encounters=rows.map(([kind,duration,route,reverse],index)=> {
    const row={kind,duration,route,reverse,start,index,cycle}; start+=duration; return row;
  });
  return {encounters,duration:start};
}
export function landingSample(elapsed) {
  let time=elapsed,cycle=0,plan=encounterPlan(cycle);
  while(time>=plan.duration){time-=plan.duration;plan=encounterPlan(++cycle);}
  const encounter=plan.encounters.find(row=>time>=row.start&&time<row.start+row.duration);
  return encounter ? {...encounter,time:time-encounter.start,progress:(time-encounter.start)/encounter.duration} : null;
}
export function animalState(sample, route) {
  const {kind,time,duration,reverse}=sample;
  let progress,sequence,poseTime=time,state,walking=true,speed;
  if(kind==='squirrel-peek') {
    if(time<1700){progress=smooth(time/1700);sequence='squirrel-acorn-run';state='emerging';speed=route.length/1700;}
    else if(time<4700){progress=1;sequence='squirrel-idle';poseTime=time-1700;state='looking';walking=false;}
    else {progress=1-smooth((time-4700)/1700);sequence='squirrel-acorn-run';state='retreating';speed=-route.length/1700;}
  } else {progress=time/duration; sequence=kind==='bat'?'bat-flight':kind==='mouse'?'mouse-run':'squirrel-acorn-run'; state=kind==='bat'?'flying':'running';speed=route.length/duration*(reverse?-1:1);}
  if(reverse)progress=1-progress;
  const point=routePoint(route,progress);
  const facing=Math.cos(point.angle)*(speed??1)<0?-1:1;
  return {...point,progress,sequence,state,walking,facing,speed,poseTime,
    tilt:clamp(Math.atan(Math.tan(point.angle)),kind==='bat'?-0.12:-0.07,kind==='bat'?0.12:0.07)};
}
