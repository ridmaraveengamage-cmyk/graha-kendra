/* Plain-language helpers and the birth-details form shared by every design option */
const AREA=['You and your health','Money and family','Courage and siblings','Home and mother','Children and creativity','Daily work and rivals','Marriage and partners','Sudden changes','Luck and father','Career','Income and friends','Spending and abroad'];
const AREA_SHORT=['You','Money','Courage','Home','Children','Work','Marriage','Change','Luck','Career','Gains','Abroad'];
const PLANET_PLAIN={Su:'confidence, authority and your father',Mo:'feelings, peace of mind and your mother',Ma:'energy, courage and property',Me:'learning, speech and business',Ju:'wisdom, growth, money and children',Ve:'love, comfort and beauty',Sa:'hard work, patience and long-term results',Ra:'ambition, foreign links and sudden change',Ke:'letting go, insight and spirituality'};
const AREA_PH=["self and health","money and family","courage and siblings","home and mother","children and creativity","daily work and rivals","marriage and partners","sudden changes","luck and father","career","income and friends","spending and life abroad"];
const GOOD_NOUN=["personal growth","money","bold moves","home and property","children and creativity","work","relationships","research","luck and learning","career","income","travel abroad"];
const CARE={6:'health and disputes',8:'sudden changes and health',12:'spending and sleep'};
const EV_PLAIN={marriage:'Marriage',career:'Career rise',property:'Property or vehicle',children:'Childbirth',education:'Higher studies',foreign:'Going abroad',wealth:'Money gains'};
const QLABEL={good:'Good time',mixed:'Mixed time',hard:'Testing time'};

function fnPlain(p){const f=funcNature(p);if(f.shadow)return `acts like ${P[f.shadow].n}`;return f.cls==='good'?'works in your favour':f.cls==='bad'?'tests you':'gives mixed results'}
function lordQ(L){const f=funcNature(L),fs=f.shadow?funcNature(f.shadow).score:f.score;return fs*0.5+A.planets[L].strength*0.5}
function quality(md,ad){let q=lordQ(md);if(ad&&ad!==md){q=q*0.4+lordQ(ad)*0.6;const r=adRelation(md,ad);if(r.cls==='good')q+=0.4;if(r.cls==='warn')q-=0.6}return q>=0.75?'good':q<=-0.4?'hard':'mixed'}
function areasOf(L){return [...new Set([A.planets[L].house,...owned(L)])]}
function plainPeriod(md,ad){const L=ad||md,q=quality(md,ad),hs=areasOf(L),fn=funcNature(L);
 const good=hs.filter(h=>![6,8,12].includes(h)).map(h=>GOOD_NOUN[h-1]),care=hs.filter(h=>[6,8,12].includes(h)).map(h=>CARE[h]);
 return{q,brings:`${P[L].n} leads this time, bringing ${PLANET_PLAIN[L]}. Events centre on ${list(hs.map(h=>AREA_PH[h-1]))}.`,
  goodFor:q==='hard'?[]:good,careful:q==='hard'?[...good,...care]:care,
  todo:(fn.cls==='bad'||fn.shadow)?`Calm ${P[L].n}: chant ${P[L].mantra} 108 times on ${P[L].day}s and give ${P[L].give.split(';')[0]}.`:`Support ${P[L].n}: chant ${P[L].mantra} 108 times on ${P[L].day}s and wear ${P[L].color} on important days.`}}
function bestWindow(k){const ev=EVENTS.find(e=>e.k===k);const w=eventWindows(ev);return w.find(x=>x.cls==='good')||w.find(x=>x.cls==='acc')||w[0]||null}
function windowWhen(x){return x.dt.length?`${fmtMonth(x.dt[0][0])} – ${fmtMonth(x.dt[x.dt.length-1][1])}`:`${fmtMonth(x.s)} – ${fmtMonth(x.e)}`}
const ageAt=t=>Math.floor((t-A.c.utcMs)/YR);
function houseStory(h){const L=A.lordOf(h),lh=A.planets[L].house,occ=A.occupants(h);
 const out=[`Its ruler, ${P[L].n}, sits in your house of ${AREA_PH[lh-1]}. ${LIH[h-1][lh-1]}`];
 for(const p of occ)out.push(`${P[p].n} lives here. ${PIH[p][h-1]}`);
 if(!occ.length)out.push('No planet sits here, so its ruler decides how this area goes.');
 return out}
function areaLevel(h){const s=A.houseScore(h);return s>=1.5?['good','Strong']:s>=0?['mixed','Steady']:['hard','Needs care']}

/* Birth-details form */
function mountForm(el,onCast){
 el.innerHTML=`<form class="bf" id="bf" autocomplete="off">
  <label class="f"><span>Name</span><input id="b-name" placeholder="Your name"></label>
  <label class="f"><span>Gender</span><select id="b-gender"><option value="">Not given</option><option value="m">Male</option><option value="f">Female</option></select></label>
  <label class="f"><span>Birth date</span><input id="b-date" type="date" required></label>
  <label class="f"><span>Birth time</span><input id="b-time" type="time" required></label>
  <label class="f"><span>Birth place</span><select id="b-city"></select></label>
  <button class="go" type="submit">Show my reading</button>
  <details class="adv"><summary>Exact location and time zone</summary><div class="advrow">
   <label class="f"><span>Latitude</span><input id="b-lat" type="number" step="0.0001" required></label>
   <label class="f"><span>Longitude</span><input id="b-lon" type="number" step="0.0001" required></label>
   <label class="f"><span>UTC offset</span><input id="b-tz" type="number" step="0.25" required></label></div>
   <p class="hint" id="b-hint">North and east are positive.</p></details></form>`;
 const q=s=>el.querySelector(s),city=q('#b-city');let tzManual=false;
 city.innerHTML=`<optgroup label="Sri Lanka">${CITIES.map((c,i)=>c[4]?`<option value="${i}">${c[0]}</option>`:'').join('')}</optgroup><optgroup label="Other cities">${CITIES.map((c,i)=>c[4]?'':`<option value="${i}">${c[0]}</option>`).join('')}</optgroup><option value="custom">Somewhere else</option>`;
 const autoTz=()=>{if(city.value==='custom'||tzManual)return;const c=CITIES[+city.value];let tz=c[3];const [y,m,d]=(q('#b-date').value||'2000-01-01').split('-').map(Number);if(c[4])tz=lkOffset(y,m,d,+(q('#b-time').value||'12:00').split(':')[0]);q('#b-tz').value=tz;q('#b-hint').textContent=c[4]&&tz!==5.5?`Sri Lanka used UTC +${tz} on this date; set automatically.`:'North and east are positive. Add 1 hour if daylight saving applied.'};
 city.addEventListener('change',()=>{tzManual=false;if(city.value!=='custom'){const c=CITIES[+city.value];q('#b-lat').value=c[1];q('#b-lon').value=c[2]}else q('.adv').open=true;autoTz()});
 ['#b-date','#b-time'].forEach(s=>q(s).addEventListener('change',autoTz));q('#b-tz').addEventListener('input',()=>{tzManual=true});
 const fill=b=>{q('#b-name').value=b.name||'';q('#b-gender').value=b.gender||'';q('#b-date').value=`${b.y}-${String(b.m).padStart(2,'0')}-${String(b.d).padStart(2,'0')}`;q('#b-time').value=`${String(b.hh).padStart(2,'0')}:${String(b.mm).padStart(2,'0')}`;city.value=b.city;q('#b-lat').value=b.lat;q('#b-lon').value=b.lon;q('#b-tz').value=b.tz};
 const read=()=>{const [y,m,d]=q('#b-date').value.split('-').map(Number),[hh,mm]=q('#b-time').value.split(':').map(Number),c=city.value==='custom'?null:CITIES[+city.value];
  return{name:q('#b-name').value.trim(),gender:q('#b-gender').value,y,m,d,hh,mm,lat:+q('#b-lat').value,lon:+q('#b-lon').value,tz:+q('#b-tz').value,ctz:c?c[3]:+q('#b-tz').value,place:c?c[0]:`${(+q('#b-lat').value).toFixed(2)}, ${(+q('#b-lon').value).toFixed(2)}`,city:city.value}};
 let saved=null;try{saved=JSON.parse(localStorage.getItem('gk-last')||'null')}catch(_){}
 const example={name:'Nimal (example)',gender:'m',y:1990,m:8,d:15,hh:10,mm:30,lat:6.9271,lon:79.8612,tz:5.5,city:'0'};
 fill(saved||example);
 q('#bf').addEventListener('submit',e=>{e.preventDefault();const b=read();if([b.y,b.hh,b.lat,b.lon,b.tz].some(Number.isNaN))return;try{localStorage.setItem('gk-last',JSON.stringify(b))}catch(_){}A=analyse(b);onCast(A,false)});
 A=analyse(read());onCast(A,!saved)}
