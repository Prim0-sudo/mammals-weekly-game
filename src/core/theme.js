export function applyTheme(t) {
 document.title=t.title; document.documentElement.lang=t.locale;
 document.querySelector('meta[name="description"]').content=t.description;
 for(const key of ['primary','accent','ink']) document.documentElement.style.setProperty('--'+key,t.theme[key]);
 t.theme.cardColors.forEach((c,i)=>document.documentElement.style.setProperty('--card-'+i,c));
 // Resolve against the page, not the stylesheet that consumes this variable.
 const backgroundUrl = new URL(t.launch.backgroundImage, document.baseURI).href;
 document.documentElement.style.setProperty('--background',`url("${backgroundUrl}")`);
 const brandImage=document.getElementById('brand-image');
 brandImage.hidden=!t.launch.clubBadge;
 if(t.launch.clubBadge) brandImage.src=t.launch.clubBadge;
 document.getElementById('brand-name').textContent=t.title;
 document.getElementById('home').setAttribute('aria-label',t.title+' home');
}
export function renderScene(){return '';}
