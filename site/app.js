/* Graha Kendra site: routing, rendered sky and every page */
const $id=id=>document.getElementById(id);
const STORE={get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}},del(k){try{localStorage.removeItem(k)}catch(_){}}};
const EXAMPLE={name:'Nimal Perera',gender:'m',y:1990,m:8,d:15,hh:10,mm:30,lat:6.9271,lon:79.8612,tz:5.5,ctz:5.5,place:'Colombo',city:'0'};
const EXAMPLE_B={name:'Dilini Fernando',gender:'f',y:1993,m:3,d:22,hh:6,mm:45,lat:7.2906,lon:80.6337,tz:5.5,ctz:5.5,place:'Kandy',city:'1'};
let PMODE='lagna',RTAB='overview',RASHI=null,PMONTH=0,MEVENT='marriage',CHSTYLE='north',EDIT=false,POR=null,LASTKEY='';
const ARROW='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const ELEM=['fire','earth','air','water'],ORBS={fire:['#ffcf8a','#ff7a59','#7a1f2b','#ff8a5c'],earth:['#e9f0b5','#8fbf7a','#1f3b2e','#9fd08a'],air:['#e6e2ff','#9f8cff','#2a2363','#a896ff'],water:['#c8fff4','#4fc3c9','#0f2f4a','#5fd6d6']};
// The twelve lagna symbols, drawn as line art on a 48 x 48 grid
const GLYPH=[
 'M24 41V21M24 21C24 9 11 6 9.5 13.5C8.6 18.5 13 20.5 15.5 17.5M24 21C24 9 37 6 38.5 13.5C39.4 18.5 35 20.5 32.5 17.5',
 'M9 8C11 18 17 22 24 22C31 22 37 18 39 8M24 22A9.5 9.5 0 1 1 23.99 22',
 'M9 8C17 12.5 31 12.5 39 8M9 40C17 35.5 31 35.5 39 40M18 11.4V36.6M30 11.4V36.6',
 'M15 14A5 5 0 1 0 15.01 14M15 14C23 8 34 8.5 41 15M33 34A5 5 0 1 0 32.99 34M33 34C25 40 14 39.5 7 33',
 'M20 30A6 6 0 1 1 19.99 30M19 27C14 18 15 8 25.5 8C35 8 37.5 17 32.5 24C28.5 29.5 29.5 38 35.5 40C38.5 41 41 39.5 41 37',
 'M7 13V34M7 18C7 11.5 15 11.5 15 18V34M15 18C15 11.5 23 11.5 23 18V33C23 38 26 41 30 41M23 26C27 20 34 21 34 27C34 33 28 36 23 33',
 'M8 38H40M8 30H17C12.5 26 12.5 13 24 12C35.5 13 35.5 26 31 30H40',
 'M7 13V33M7 18C7 11.5 15 11.5 15 18V33M15 18C15 11.5 23 11.5 23 18V32C23 37 27 38.5 33 38.5H41M36 33.5L41 38.5L36 43.5',
 'M10 38L38 10M25 10H38V23M15 23L25 33',
 'M7 11L13.5 33L19.5 14C20.5 11 24 11.5 24 15V31C24 38 31 41 35.5 36.5C39.5 32.5 36 26 31 28.5C27 30.5 28 38 23 42',
 'M6 20L12 14L18 20L24 14L30 20L36 14L42 20M6 33L12 27L18 33L24 27L30 33L36 27L42 33',
 'M11 8C20 16 20 32 11 40M37 8C28 16 28 32 37 40M13 24H35'];
const EMBLEM=['Ram','Bull','Twins','Crab','Lion','Maiden','Scales','Scorpion','Bow and arrow','Sea creature','Water pot','Two fish'];
const glyph=(i,size,stroke)=>`<svg class="glyph" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><path d="${GLYPH[i]}" fill="none" stroke="${stroke||'currentColor'}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const orb=(i,sym)=>{const o=ORBS[ELEM[i%4]];return `<div class="orb" style="--glow:${o[3]};background:radial-gradient(circle at 32% 28%,${o[0]} 0%,${o[1]} 38%,${o[2]} 78%)">${sym?glyph(i,34,'#fff'):''}</div>`};
const ymd=b=>`${b.y}-${String(b.m).padStart(2,'0')}-${String(b.d).padStart(2,'0')}`,hm=b=>`${String(b.hh).padStart(2,'0')}:${String(b.mm).padStart(2,'0')}`;
const tname=i=>i===14?'Purnima':i===29?'Amavasya':TITHI[i%15],pk=i=>i<15?'Shukla':'Krishna';
const rng=r=>`${fmtHr(r[0])}–${fmtHr(r[1])}`;
const Qchip=(q,label)=>`<span class="q q-${q}">${label||QLABEL[q]}</span>`;
const firstName=b=>(b.name||'').trim().split(/\s+/)[0]||'';

/* ---------- live sky for the user's place ---------- */
function myPlace(){const b=STORE.get('gk-last');if(b&&b.city!=='custom'&&CITIES[+b.city])return CITIES[+b.city];return CITIES[0]}
function kalams(ev,wd){if(!ev)return null;const p=(ev.set-ev.rise)/8,seg=k=>[ev.rise+p*k,ev.rise+p*(k+1)],mu=(ev.set-ev.rise)/15;
 return{rahu:seg([7,1,6,4,5,3,2][wd]),yama:seg([4,3,2,1,0,6,5][wd]),gulika:seg([6,5,4,3,2,1,0][wd]),abhijit:[ev.noon-mu/2,ev.noon+mu/2]}}
function skyNow(c){c=c||myPlace();const now=Date.now(),jd=now/864e5+2440587.5,tp=tropical(jd),sp=siderealAll(jd),el=norm(tp.Mo-tp.Su),loc=new Date(now+c[3]*36e5),wd=loc.getUTCDay();
 const ev=sunEvents(loc.getUTCFullYear(),loc.getUTCMonth()+1,loc.getUTCDate(),c[1],c[2],c[3]);
 return{c,jd,sp,el,ti:Math.floor(el/12),nk:nakOf(sp.Mo),yi:Math.floor(norm(sp.Su+sp.Mo)/(360/27)),ev,wd,loc,k:kalams(ev,wd),lit:Math.round((1-Math.cos(el*Math.PI/180))/2*100)}}
function drawMoon(cv){const el=+cv.dataset.e,c=cv.getContext('2d'),W=cv.width,R=W*0.4,cx=W/2,cy=W/2,k=Math.cos(el*Math.PI/180),wax=el<180;c.clearRect(0,0,W,W);
 const g=c.createRadialGradient(cx,cy,R*.9,cx,cy,R*1.25);g.addColorStop(0,'rgba(183,166,255,.25)');g.addColorStop(1,'rgba(183,166,255,0)');c.fillStyle=g;c.fillRect(0,0,W,W);
 c.fillStyle='#1a1630';c.beginPath();c.arc(cx,cy,R,0,7);c.fill();c.save();c.beginPath();c.arc(cx,cy,R,0,7);c.clip();
 const lg=c.createRadialGradient(cx-R*.3,cy-R*.3,R*.1,cx,cy,R);lg.addColorStop(0,'#fbf9ff');lg.addColorStop(1,'#bdb3e6');
 c.fillStyle=lg;c.beginPath();c.arc(cx,cy,R,-Math.PI/2,Math.PI/2,!wax);c.closePath();c.fill();c.fillStyle=k>0?'#1a1630':lg;c.beginPath();c.ellipse(cx,cy,Math.abs(k)*R,R,0,0,7);c.fill();c.restore();
 c.strokeStyle='rgba(220,212,255,.35)';c.lineWidth=2;c.beginPath();c.arc(cx,cy,R,0,7);c.stroke()}

/* ---------- birth form ---------- */
function cityOptions(sel){return `<optgroup label="Sri Lanka">${CITIES.map((c,i)=>c[4]?`<option value="${i}"${String(sel)===String(i)?' selected':''}>${c[0]}</option>`:'').join('')}</optgroup><optgroup label="Other cities">${CITIES.map((c,i)=>c[4]?'':`<option value="${i}"${String(sel)===String(i)?' selected':''}>${c[0]}</option>`).join('')}</optgroup><option value="custom"${sel==='custom'?' selected':''}>Somewhere else</option>`}
function birthFields(p,b){b=b||{};return `
 <div class="field full"><label for="${p}-name">Full name</label><input id="${p}-name" value="${esc(b.name||'')}" placeholder="Nimal Perera" autocomplete="off"></div>
 <div class="field"><label for="${p}-date">Date of birth</label><input id="${p}-date" type="date" value="${b.y?ymd(b):''}"></div>
 <div class="field"><label for="${p}-time">Time of birth</label><input id="${p}-time" type="time" value="${b.y?hm(b):''}"></div>
 <div class="field"><label for="${p}-city">Place of birth</label><select id="${p}-city">${cityOptions(b.city==null?'0':b.city)}</select></div>
 <div class="field"><label for="${p}-gender">Gender</label><select id="${p}-gender"><option value="">Prefer not to say</option><option value="m"${b.gender==='m'?' selected':''}>Male</option><option value="f"${b.gender==='f'?' selected':''}>Female</option></select></div>
 <details class="more" style="grid-column:1/-1"${b.city==='custom'?' open':''}><summary>Born somewhere else? Enter coordinates</summary><div class="fgrid" style="grid-template-columns:repeat(3,minmax(0,1fr))">
  <div class="field"><label for="${p}-lat">Latitude</label><input id="${p}-lat" type="number" step="0.0001" value="${b.city==='custom'?b.lat:''}" placeholder="6.93"></div>
  <div class="field"><label for="${p}-lon">Longitude</label><input id="${p}-lon" type="number" step="0.0001" value="${b.city==='custom'?b.lon:''}" placeholder="79.86"></div>
  <div class="field"><label for="${p}-tz">UTC offset</label><input id="${p}-tz" type="number" step="0.25" value="${b.city==='custom'?b.tz:''}" placeholder="5.5"></div></div>
  <p class="fine" style="text-align:left;margin-top:8px">Choose "Somewhere else" above, then enter coordinates (north and east positive) and the time zone in hours.</p></details>
 <p class="err full" id="${p}-err" role="alert" style="grid-column:1/-1"></p>`}
function readBirth(p){const v=s=>($id(`${p}-${s}`)||{}).value||'',err=$id(`${p}-err`);err.textContent='';
 if(!v('date')){err.textContent='Enter a date of birth.';return null}if(!v('time')){err.textContent='Enter a time of birth. If you only know it roughly, use your best guess.';return null}
 const [y,m,d]=v('date').split('-').map(Number),[hh,mm]=v('time').split(':').map(Number),city=v('city');let lat,lon,tz,ctz,place;
 if(city==='custom'){lat=parseFloat(v('lat'));lon=parseFloat(v('lon'));tz=parseFloat(v('tz'));if([lat,lon,tz].some(Number.isNaN)){err.textContent='For "Somewhere else", enter latitude, longitude and UTC offset under the coordinates link.';return null}ctz=tz;place=`${lat.toFixed(2)}, ${lon.toFixed(2)}`}
 else{const c=CITIES[+city];lat=c[1];lon=c[2];ctz=c[3];tz=c[4]?lkOffset(y,m,d,hh):c[3];place=c[0]}
 return{name:v('name').trim(),gender:v('gender'),y,m,d,hh,mm,lat,lon,tz,ctz,place,city}}
function getChart(){const b=STORE.get('gk-last');if(!b)return null;const k=JSON.stringify(b);if(k!==LASTKEY||!A){A=analyse(b);LASTKEY=k}return A}

/* ---------- shared bits ---------- */
function head(eyebrow,title,lede,extra){return `<header class="pagehead g"><div class="cap in rise">${eyebrow?`<span class="eyebrow">${eyebrow}</span>`:''}<h1>${title}</h1>${lede?`<p class="lede">${lede}</p>`:''}${extra||''}</div></header>`}
function guidesGrid(){const arts=['a1','a2','a3'];return `<div class="guides">${Object.entries(GUIDES).map(([k,g],i)=>`<a class="guide" href="#${k}"><div class="art ${arts[i]}"><span>${g.tag}</span></div><h3>${g.t}</h3><p>${g.min} min read</p></a>`).join('')}</div>`}
function closing(){return `<section class="g" style="padding-bottom:20px"><div class="cap closing"><span class="eyebrow">Your reading</span><h2>A complete reading of your <em>life</em></h2><p>Nature, career, money, marriage, health, your life periods and the best dates ahead, from one accurate chart.</p><a class="btn primary" href="#reading">${STORE.get('gk-last')?'Open my reading':'Cast my chart'} ${ARROW}</a></div></section>`}
function rashiCards(sel,act,mode){return SIGNS.map((s,i)=>`<button class="rcard" data-act="${act}" data-r="${i}" aria-pressed="${sel===i}">${orb(i,true)}<span class="n">${s[0]}</span><span class="e">${s[1]} ${mode==='rashi'?'Moon sign':'lagna'} · ${EMBLEM[i]}</span><span class="meta"><span>Ruler <b>${P[SIGN_LORD[i]].n}</b></span><span>Read →</span></span></button>`).join('')}
/* ---------- HOME ---------- */
function vHome(){const S=skyNow(),b=STORE.get('gk-last'),C=b?getChart():null;
 let welcome='';
 if(C){const{md,ad}=currentDasha();if(md){const q=quality(md.lord,ad.lord),pp=plainPeriod(md.lord,ad.lord);
  welcome=`<section class="g" style="padding-top:0;margin-top:-40px"><div class="cap"><a class="card" href="#reading" style="text-decoration:none;flex-direction:row;align-items:center;gap:22px;flex-wrap:wrap"><div style="flex:1 1 300px;display:grid;gap:6px"><span class="tag">Welcome back${firstName(b)?', '+esc(firstName(b)):''}</span><p class="big">Your reading is ready.</p><p>${SIGNS[A.lag][0]} lagna · current phase: ${P[md.lord].n}–${P[ad.lord].n}, until ${fmtMonth(ad.end)}</p></div>${Qchip(q)}<span class="btn glass sm">Open reading ${ARROW}</span></a></div></section>`}}
 const mr=C?A.moonS:signOf(S.sp.Mo);
 return `<header class="hero g"><div class="cap in rise">
  <span class="chip"><span class="dot"></span>Tonight in ${S.c[0]} · ${pk(S.ti)} ${tname(S.ti)} · Moon in ${S.nk.name}</span>
  <h1>Read the sky you were <em>born under</em></h1>
  <p class="lede">Vedic astrology for Sri Lanka, explained in plain words. Your nature, your life periods, and the best times ahead, from one accurate birth chart.</p>
  <div class="ctas"><a class="btn primary" href="#reading">${C?'Open my reading':'Cast my chart'} ${ARROW}</a><a class="btn glass" href="#palapala">This month's palapala</a></div>
  <div class="proof"><span>Lahiri ayanamsa</span><span>Vimshottari dasha</span><span>Classical Parashari readings</span></div></div></header>
 ${welcome}
 <section class="s g"><div class="cap"><div class="head"><div><span class="eyebrow">Lagna palapala</span><h2>Your lagna this <em>${MONTHS[S.loc.getUTCMonth()]}</em></h2></div><p>In Sri Lanka, monthly palapala is read from your lagna, the sign rising at the moment you were born. ${C?`Yours is ${SIGNS[A.lag][0]} (${SIGNS[A.lag][1]}).`:'Choose yours for the month ahead.'}</p></div>
  <div class="rail">${rashiCards(C?A.lag:-1,'rashi','lagna')}</div></div></section>
 <section class="s tight g"><div class="cap"><div class="head"><div><span class="eyebrow">Everything in one chart</span><h2>Tools that read like a <em>conversation</em></h2></div><p>Every tool works from real planetary positions and speaks plainly. No tables of jargon unless you ask for them.</p></div>
  <div class="bento">
   <a class="tile t-2x2" href="#reading"><span class="tag">Kendaraya</span><h3>Your birth chart, in the Sri Lankan square</h3>${kendaraya(C?A:analyse(EXAMPLE),false,'north')}<div class="row"><p>${C?'Your chart. Tap to open your full reading.':'Lagna, planets and houses, with every placement explained.'}</p><span class="btn glass sm">${C?'Open':'Cast mine'}</span></div></a>
   <a class="tile t-2" href="#nakath"><span class="tag">Today · ${S.c[0]}</span><div class="moonrow"><canvas class="moon" width="192" height="192" data-e="${S.el}" aria-label="Moon phase today"></canvas><div class="kv">
    <div><span>Tithi</span><b>${pk(S.ti)} ${tname(S.ti)}</b></div><div><span>Nakshatra</span><b>${S.nk.name}</b></div><div><span>Sunrise</span><b>${S.ev?fmtHr(S.ev.rise):'—'}</b></div><div><span>Rahu kalaya</span><b>${S.k?rng(S.k.rahu):'—'}</b></div><div><span>Yoga</span><b>${YOGA[S.yi]}</b></div><div><span>Moon</span><b>${S.lit}% lit</b></div></div></div></a>
   <a class="tile t-2" href="#reading" data-act="tab" data-t="timeline"><span class="tag">Life periods</span><h3>See which chapter of life you're in</h3><div class="bars">${(C?A.dasha.filter(d=>d.end>Date.now()).slice(0,3):[{lord:'Ju'},{lord:'Sa'},{lord:'Me'}]).map((d,i)=>`<div class="bar" style="--c1:${['#7fe0d2','#b7a6ff','#f6c97e'][i]};--c2:${['#5fb7ff','#ff9fc8','#ff9f7a'][i]}"><span>${P[d.lord].n}</span><i style="width:${100-i*12}%"></i><b>${d.end?'to '+new Date(d.end).getUTCFullYear():''}</b></div>`).join('')}</div></a>
   <a class="tile t-1" href="#porondam"><span class="tag">Porondam</span><h3>Match two charts</h3><svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9"/><circle cx="60" cy="60" r="50" fill="none" stroke="url(#kg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="244 314" transform="rotate(-90 60 60)"/><text x="60" y="66" text-anchor="middle" font-family="Instrument Serif,Georgia" font-size="34" fill="#f5f3fc">36</text></svg><p>Eight factors, Rajju and Kuja dosha.</p></a>
   <a class="tile t-1" href="#nakath"><span class="tag">Nakath</span><h3>Good times</h3><div class="list"><div><b style="font-weight:500">Abhijit</b><span>${S.k?rng(S.k.abhijit):'—'}</span></div><div><b style="font-weight:500">Avoid</b><span>${S.k?rng(S.k.rahu):'—'}</span></div><div><b style="font-weight:500">Sunset</b><span>${S.ev?fmtHr(S.ev.set):'—'}</span></div></div></a>
  </div></div></section>
 ${C?'':`<section class="s tight g"><div class="cap grid2" style="gap:56px;align-items:center"><div><span class="eyebrow">Your full reading</span><h2>Know yourself. Know <em>when</em>.</h2>
   <ul class="clean" style="margin-top:28px"><li><span><b style="color:var(--ink);font-weight:500">Your nature.</b> What your lagna, Moon and birth star say about you.</span></li><li><span><b style="color:var(--ink);font-weight:500">Career, money, marriage and health.</b> Each area read from its house and ruler.</span></li><li><span><b style="color:var(--ink);font-weight:500">Dates that matter.</b> Likely windows for marriage, a new job, property and travel.</span></li><li><span><b style="color:var(--ink);font-weight:500">Simple remedies.</b> Which planets to strengthen, and which to calm.</span></li></ul></div>
  <form class="formcard" data-form="home" novalidate><h3>Cast your chart</h3><div class="fgrid">${birthFields('h',{})}</div><button class="btn primary" type="submit">See my reading</button><p class="fine">Free · your details stay on your device</p></form></div></section>`}
 <section class="s tight g"><div class="cap"><div class="head"><div><span class="eyebrow">Learn</span><h2>Guides to your <em>chart</em></h2></div><a class="btn glass" href="#learn">All guides</a></div>${guidesGrid()}</div></section>
 ${closing()}`}

/* ---------- READING ---------- */
function readingForm(b){return `<section class="s tight g"><div class="cap grid2" style="gap:56px;align-items:start">
 <div class="prose"><h3 style="font:400 1.8rem var(--serif)">What you'll get</h3><p>Your nature from your lagna, Moon and birth star. Each part of life read from its house and ruler. Your life chapters with dates. The most likely windows for marriage, career, property and travel. Simple remedies.</p><p>Your birth time matters: the rising sign changes about every two hours. Use the time on your birth certificate if you have it.</p>${b?'':`<p><button class="btn glass" data-act="example">See an example reading</button></p>`}</div>
 <form class="formcard" data-form="reading" novalidate><h3>${b?'Edit birth details':'Your birth details'}</h3><div class="fgrid">${birthFields('r',b||{})}</div><button class="btn primary" type="submit">${b?'Update my reading':'See my reading'}</button>${b?'<button class="btn glass" type="button" data-act="canceledit">Cancel</button>':''}<p class="fine">Calculated in your browser · your details stay on your device</p></form></div></section>`}
function vReading(){const b=STORE.get('gk-last');
 if(!b||EDIT)return head(EDIT?'Edit details':'Your reading',EDIT?'Update your <em>birth details</em>':'Cast your <em>birth chart</em>','Enter your date, time and place of birth. It takes a few seconds.')+readingForm(EDIT?b:null);
 getChart();const{md,ad}=currentDasha(),fn=firstName(b),pl=A.planets;
 const q=md?quality(md.lord,ad.lord):'mixed',pp=md?plainPeriod(md.lord,ad.lord):null;
 const ranked=[1,2,4,5,7,9,10,11].map(h=>[h,A.houseScore(h)]).sort((x,y)=>y[1]-x[1]),care=[1,2,4,5,6,7,8,9,10,11,12].filter(h=>A.houseScore(h)<0).slice(0,3);
 const moments=EVENTS.map(ev=>({ev,w:bestWindow(ev.k)})).filter(x=>x.w).sort((a,b)=>a.w.s-b.w.s);
 const top=`<header class="pagehead g"><div class="cap in rise"><div class="chips"><span class="chip">${glyph(A.lag,18)}${SIGNS[A.lag][0]} (${SIGNS[A.lag][1]}) lagna · ${dms(A.c.asc)}</span><span class="chip">${glyph(A.moonS,18)}Moon in ${SIGNS[A.moonS][0]}</span><span class="chip">${pl.Mo.nak.name} nakshatra</span><span class="chip">${esc(b.place)} · ${b.d}/${b.m}/${b.y} · ${hm(b)}</span></div>
  <h1>${fn?esc(fn)+"'s":'Your'} <em>reading</em></h1>
  ${md?`<p class="lede">You're in your <b style="color:var(--ink);font-weight:500">${P[md.lord].n} chapter</b> until ${fmtMonth(md.end)}. The current <b style="color:var(--ink);font-weight:500">${P[ad.lord].n} phase</b> runs to ${fmtMonth(ad.end)}.</p>`:''}
  <div class="ctas"><button class="btn glass sm" data-act="edit">Edit details</button><button class="btn glass sm" data-act="clear">New reading</button></div></div></header>`;
 const summary=`<section class="g"><div class="cap bento" style="grid-auto-rows:auto">
  <div class="tile t-2" style="grid-row:span 2"><span class="tag">What is happening in your life right now</span><div style="display:flex;justify-content:space-between;gap:12px;align-items:start;flex-wrap:wrap"><p class="big">${md?`${P[md.lord].n} – ${P[ad.lord].n}`:'—'}</p>${Qchip(q)}</div><div class="prose">${md?nPeriod(md.lord,ad.lord,ad.start,ad.end):''}</div></div>
  <div class="tile t-1"><span class="tag">Strongest areas</span><ul class="clean good">${ranked.slice(0,3).map(([h])=>`<li><span>${AREA[h-1]}</span></li>`).join('')}</ul></div>
  <div class="tile t-1"><span class="tag">Needs care</span>${care.length?`<ul class="clean hard">${care.map(h=>`<li><span>${AREA[h-1]}</span></li>`).join('')}</ul>`:'<p>No area stands out as weak.</p>'}</div>
 </div></section>`;
 const tabs=[['overview','About you'],['life','Life areas'],['timeline','Timeline'],['remedies','Remedies'],['chart','Chart']];
 const body={overview:rOverview,life:rLife,timeline:rTimeline,remedies:rRemedies,chart:rChart}[RTAB]||rOverview;
 return top+summary+`<section class="s g" style="padding-top:36px"><div class="cap"><div class="sticky-seg"><div class="seg" role="tablist">${tabs.map(([k,n])=>`<button role="tab" aria-selected="${RTAB===k}" data-act="tab" data-t="${k}">${n}</button>`).join('')}</div></div><div id="rbody">${body(moments)}</div></div></section>`+closing().replace('Open my reading','Back to top').replace('href="#reading"','href="#reading" data-act="top"')}
function rOverview(){const pl=A.planets;
 return `<div class="grid2">
  <div class="card"><span class="tag">Your nature · ${SIGNS[A.lag][0]} (${SIGNS[A.lag][1]}) lagna</span><div class="prose">${nPersonality()}</div></div>
  <div class="card"><span class="tag">Your mind · Moon in ${SIGNS[A.moonS][0]}</span><div class="prose">${nMind()}</div></div>
  <div class="card" style="grid-column:1/-1"><span class="tag">Your birth star · ${pl.Mo.nak.name}, pada ${pl.Mo.nak.pada}</span><div class="prose" style="max-width:none;column-width:340px;column-gap:40px;display:block">${nStar()}</div></div></div>
 <div class="head" style="margin:56px 0 20px"><div><span class="eyebrow">Special combinations</span><h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem)">Blessings and cautions in your chart</h2></div></div>
 <div class="grid2">${A.yogas.map(y=>`<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h3>${y[0]}</h3>${Qchip('good','Blessing')}</div><div class="prose">${nYoga(y,false)}</div></div>`).join('')}${A.doshas.map(y=>`<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><h3>${y[0]}</h3>${Qchip(y[2]==='acc'?'n':'mixed',y[2]==='acc'?'Mild':'Check')}</div><div class="prose">${nYoga(y,true)}</div></div>`).join('')}${!A.yogas.length&&!A.doshas.length?'<p class="muted">No major classical yogas or doshas were found in your chart.</p>':''}</div>`}
const LIFE=[{n:'Career and work',hs:[10],ev:'career'},{n:'Money',hs:[2,11],ev:'wealth'},{n:'Love and marriage',hs:[7],ev:'marriage'},{n:'Home and family',hs:[4],ev:'property'},{n:'Children and studies',hs:[5,9],ev:'children'},{n:'Health',hs:[1,6],ev:null},{n:'Travel and abroad',hs:[12],ev:'foreign'}];
function rLife(){return `<div class="grid2">${LIFE.map(a=>{const s=a.hs.reduce((t,h)=>t+A.houseScore(h),0)/a.hs.length,q=s>=1.5?'good':s>=0?'mixed':'hard',w=a.ev?bestWindow(a.ev):null;
 let extra='';if(a.n.startsWith('Career')){const t=A.lordOf(10);extra=`<p><b>Fields that fit you:</b> ${CAREER[t]}${A.occupants(10).filter(p=>p!==t).slice(0,2).map(p=>'; '+CAREER[p]).join('')}.</p>`}
 return `<div class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><h3 style="font:400 1.9rem var(--serif)">${a.n}</h3>${Qchip(q,q==='good'?'Strong':q==='mixed'?'Steady':'Needs care')}</div>
 ${w?`<div><span class="tag">Best time ahead</span><p class="big" style="font-size:1.5rem;margin-top:2px">${windowWhen(w)}</p></div>`:''}
 <div class="prose">${nArea(a)}${extra}</div></div>`}).join('')}</div>`}
function rTimeline(){const now=Date.now(),b0=A.c.utcMs,span=100*YR;
 const segs=A.dasha.filter(d=>d.end>b0&&d.start<b0+span).map(d=>{const s=Math.max(d.start,b0),e=Math.min(d.end,b0+span),q=quality(d.lord);return `<div class="b-${q}${now>=d.start&&now<d.end?' now':''}" style="flex:${(e-s)/YR}" title="${P[d.lord].n}: age ${ageAt(s)}–${ageAt(e)}">${(e-s)/YR>5?P[d.lord].n:''}</div>`}).join('');
 const ads=A.dasha.flatMap(d=>d.subs.map(s=>({...s,md:d.lord}))).filter(s=>s.end>now&&s.start<now+5*YR);
 const moments=EVENTS.map(ev=>({ev,all:eventWindows(ev)})).map(x=>({...x,w:bestWindow(x.ev.k)})).filter(x=>x.w).sort((a,b)=>a.w.s-b.w.s);
 return `<div class="card"><span class="tag">Your life chapters · birth to 100</span><div class="lifebar">${segs}</div><div class="ages"><span>Birth</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
  <div class="chips">${Qchip('good','Good time')}${Qchip('mixed','Mixed time')}${Qchip('hard','Testing time')}<span class="q q-n">White outline: now</span></div></div>
 <div class="head" style="margin:56px 0 8px"><div><span class="eyebrow">The next five years</span><h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem)">What is happening, phase by phase</h2></div></div>
 ${ads.map(s=>{const qq=quality(s.md,s.lord),p=plainPeriod(s.md,s.lord);
  return `<div class="phase"><div class="when"><b>${fmtMonth(Math.max(s.start,now))}</b>to ${fmtMonth(s.end)}<div style="margin-top:10px">${Qchip(qq)}</div><div style="margin-top:12px;display:grid;gap:4px">${p.goodFor.map(x=>`<span class="q q-good" style="justify-self:start">${x}</span>`).join('')}${p.careful.map(x=>`<span class="q q-hard" style="justify-self:start">${x}</span>`).join('')}</div></div>
  <div class="prose" style="max-width:none">${nPeriod(s.md,s.lord,s.start,s.end)}</div></div>`}).join('')}
 <div class="head" style="margin:56px 0 8px"><div><span class="eyebrow">Big moments</span><h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem)">The most likely windows</h2></div></div>
 <div class="grid2">${moments.map(({ev,w,all})=>`<div class="card"><span class="tag">${EV_PLAIN[ev.k]}</span><p class="big" style="font-size:1.7rem">${windowWhen(w)}</p>${w.cls==='good'?Qchip('good','Strong window'):Qchip('n','Supportive window')}<div class="prose">${nEvent(ev,w,all)}</div></div>`).join('')||'<p class="muted">No strong windows found in the next 25 years.</p>'}</div>`}
function rRemedies(){const LL=SIGN_LORD[A.lag],helpful=ORDER.filter(p=>funcNature(p).cls==='good'),testing=ORDER.filter(p=>funcNature(p).cls==='bad');
 const stone=(p,role)=>{const f=funcNature(p);return `<div class="card">${orb(['Su','Ma','Ju'].includes(p)?0:['Me','Sa'].includes(p)?1:['Ve','Ra','Ke'].includes(p)?2:3)}<span class="tag">${role}</span><h3 style="font:400 1.8rem var(--serif)">${GEM[p].split(',')[0]}</h3><p>For ${P[p].n}. ${GEM[p].split(',').slice(1).join(',').trim()}.</p>${f.cls==='bad'?'<p style="color:var(--mixed)">This planet also rules a difficult area for you. Test the stone carefully first.</p>':''}</div>`};
 return `<div class="card"><span class="tag">What to do now</span><div class="prose" style="max-width:none;column-width:340px;column-gap:40px;display:block">${nRemedies()}</div></div>
 <div class="grid2" style="margin-top:14px"><div class="card"><span class="tag">On your side</span><p class="big" style="font-size:1.6rem">${list(helpful.map(p=>P[p].n))||'None clearly'}</p><p>Strengthen these with their mantras, colours and gemstones.</p></div>
  <div class="card"><span class="tag">Tests you</span><p class="big" style="font-size:1.6rem">${list(testing.map(p=>P[p].n))||'None clearly'}</p><p>Calm these with mantra, charity and service. Don't wear their gemstones.</p></div></div>
 <div class="head" style="margin:56px 0 8px"><div><span class="eyebrow">Gemstones</span><h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem)">Your traditional stones</h2></div><p>Have an astrologer confirm a stone against your full chart before wearing it.</p></div>
 <div class="grid3">${stone(LL,'Life stone · lagna lord')}${stone(A.lordOf(5),'Lucky stone · 5th lord')}${stone(A.lordOf(9),'Fortune stone · 9th lord')}</div>
 <div class="head" style="margin:56px 0 8px"><div><span class="eyebrow">By planet</span><h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem)">Mantras, days and charity</h2></div></div>
 <div class="tbl"><table><thead><tr><th>Planet</th><th>For you</th><th>Mantra (108 times)</th><th>Day</th><th>Charity</th></tr></thead><tbody>${ORDER.map(p=>{const f=funcNature(p);return `<tr><td><b style="font-weight:500">${P[p].n}</b></td><td>${Qchip(f.cls==='good'?'good':f.cls==='bad'?'hard':'n',f.shadow?'Like '+P[f.shadow].n:f.cls==='good'?'Helps':f.cls==='bad'?'Tests':'Neutral')}</td><td style="font-family:var(--mono);font-size:13px">${P[p].mantra}</td><td>${P[p].day}</td><td class="wrap">${P[p].give}</td></tr>`}).join('')}</tbody></table></div>`}
function rChart(){const pl=A.planets;
 return `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px"><div class="seg"><button aria-selected="${CHSTYLE==='north'}" data-act="chstyle" data-s="north">Sri Lankan square</button><button aria-selected="${CHSTYLE==='south'}" data-act="chstyle" data-s="south">South Indian</button></div><a class="btn glass sm" href="#method">How we calculate</a></div>
 <div class="grid2"><div class="card"><span class="tag">Kendaraya · birth chart</span>${kendaraya(A,false,CHSTYLE)}</div><div class="card"><span class="tag">Navamsa · D9</span>${kendaraya(A,true,CHSTYLE)}</div></div>
 <div class="card" style="margin-top:14px"><span class="tag">Your lagna · ${SIGNS[A.lag][0]} (${SIGNS[A.lag][1]}) ${dms(A.c.asc)}</span><div class="prose" style="max-width:none;column-width:340px;column-gap:40px;display:block">${nLagna()}</div></div>
 <div class="card" style="margin-top:14px"><span class="tag">The twelve houses of your chart</span><div class="tbl" style="border:0"><table><thead><tr><th>House</th><th>Sign</th><th>Part of life</th><th>Planets</th></tr></thead><tbody>${[1,2,3,4,5,6,7,8,9,10,11,12].map(h=>{const s=(A.lag+h-1)%12;return `<tr><td>${h===1?'<b style="font-weight:500;color:var(--rose)">1 · Lagna</b>':h}</td><td><span style="display:inline-flex;align-items:center;gap:10px;color:${h===1?'var(--rose)':'var(--ink)'}">${glyph(s,20)}${SIGNS[s][0]} (${SIGNS[s][1]})</span></td><td class="wrap">${AREA[h-1]}</td><td>${A.occupants(h).map(p=>P[p].n).join(', ')||'<span class="muted">—</span>'}</td></tr>`}).join('')}</tbody></table></div></div>
 <div class="tbl" style="margin-top:14px"><table><thead><tr><th>Planet</th><th>Sign</th><th>Degree</th><th>Nakshatra</th><th>House</th><th>Dignity</th></tr></thead><tbody>
 <tr><td><b style="font-weight:500;color:var(--rose)">Lagna</b></td><td>${SIGNS[A.lag][0]}</td><td style="font-family:var(--mono)">${dms(A.c.asc)}</td><td>${nakOf(A.c.asc).name} ${nakOf(A.c.asc).pada}</td><td>1</td><td></td></tr>
 ${ORDER.map(p=>{const x=pl[p];return `<tr><td><b style="font-weight:500">${P[p].n}</b>${x.retro&&!['Ra','Ke'].includes(p)?' <span class="muted">(R)</span>':''}</td><td>${SIGNS[x.sign][0]}</td><td style="font-family:var(--mono)">${dms(x.lon)}</td><td>${x.nak.name} ${x.nak.pada}</td><td>${x.house}</td><td>${x.dig.label}</td></tr>`}).join('')}</tbody></table></div>
 <p class="fine" style="text-align:left;margin-top:12px">Sidereal positions, Lahiri ayanamsa ${dms(A.c.ay)}, whole-sign houses, mean nodes. R means the planet appears to move backwards (retrograde).</p>`}
/* ---------- PALAPALA ---------- */
function monthForecast(r,y,m){const tz=5.5,H={},sp=siderealAll(julianDay(y,m,15,12-tz));
 for(const p of['Su','Ma','Me','Ju','Ve','Sa','Ra','Ke'])H[p]=houseFrom(signOf(sp[p]),r);
 const Wt={Sa:3,Ju:3,Ra:1.5,Ke:1,Ma:1,Su:1,Ve:1,Me:1};let sc=0;for(const p in H)sc+=Wt[p]*(GOCHARA_GOOD[p].includes(H[p])?1:-1);
 const dim=new Date(Date.UTC(y,m,0)).getUTCDate(),days=[],ing=[];let prev=siderealAll(julianDay(y,m,1,-tz-12));
 for(let d=1;d<=dim;d++){const s=siderealAll(julianDay(y,m,d,12-tz)),mh=houseFrom(signOf(s.Mo),r);days.push({d,mh,st:mh===8?'care':[1,3,6,7,10,11].includes(mh)?'good':'n'});
  for(const p of['Su','Ma','Me','Ve','Ju','Sa'])if(signOf(s[p])!==signOf(prev[p]))ing.push({d,p,to:signOf(s[p])});prev=s}
 return{H,sc,q:sc>=4?'good':sc>=-2?'mixed':'hard',label:sc>=7?'An excellent month':sc>=4?'A good month':sc>=-2?'A mixed month':'A challenging month',days,ing,dim,first:new Date(Date.UTC(y,m-1,1)).getUTCDay()}}
function vPalapala(){const C=STORE.get('gk-last')?getChart():null,S=skyNow();if(RASHI==null)RASHI=C?(PMODE==='lagna'?A.lag:A.moonS):(PMODE==='lagna'?0:signOf(S.sp.Mo));
 const base=new Date(S.loc.getTime());base.setUTCDate(1);base.setUTCMonth(base.getUTCMonth()+PMONTH);const y=base.getUTCFullYear(),m=base.getUTCMonth()+1,F=monthForecast(RASHI,y,m),r=RASHI,isL=PMODE==='lagna',mine=C&&(isL?A.lag:A.moonS)===r;
 const cal=`<div class="tbl" style="border:0"><div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;min-width:300px">${['S','M','T','W','T','F','S'].map(d=>`<div class="tag" style="text-align:center">${d}</div>`).join('')}${'<div></div>'.repeat(F.first)}${F.days.map(x=>`<div title="Moon in your ${ord(x.mh)} house" style="aspect-ratio:1;border-radius:12px;display:grid;place-items:center;font:500 14px var(--mono);border:1px solid var(--line);background:${x.st==='good'?'var(--good-bg)':x.st==='care'?'var(--hard-bg)':'var(--glass)'};color:${x.st==='good'?'var(--good)':x.st==='care'?'var(--hard)':'var(--ink2)'}">${x.d}</div>`).join('')}</div></div>`;
 const goodDays=F.days.filter(x=>x.st==='good').map(x=>x.d),careDays=F.days.filter(x=>x.st==='care').map(x=>x.d),mn=MONTHS[m-1];
 const keyText=fill([F.ing.length?F.ing.map(x=>{const h=houseFrom(x.to,r);return `On ${x.d} ${mn}, ${P[x.p].n} moves into ${SIGNS[x.to][0]}, your ${ord(h)} house, and attention shifts toward ${HOUSE_LIFE[h-1].focus}: ${lc(pick(HOUSE_LIFE[h-1][GOCHARA_GOOD[x.p].includes(h)?'good':'hard'],seedOf(x.p,h),1)[0])}`}).join(' '):`No major planet changes sign during ${mn}, so the month keeps one steady mood from start to finish.`,
  `The best days for important meetings, applications, travel and family occasions are ${goodDays.length?list(goodDays.map(String)):'few this month'}, when the Moon passes a supportive part of your chart and things tend to move smoothly.`,
  careDays.length?`Take extra care on ${list(careDays.map(String))} ${mn}. These are the days when the Moon crosses the 8th house from your ${isL?'lagna':'Moon sign'} (Chandrashtama), when moods dip and misunderstandings come easily. Avoid starting new things, signing papers or arguing on those days.`:'There are no Chandrashtama days for you this month.'],['Plan the month around the green days where you can, and keep the red days light.','Check Rahu kalaya on the Nakath page before starting anything important.']);
 const sec=(t,k)=>`<div class="card"><span class="tag">${t}</span><div class="prose">${nMonth(k,F,PMODE)}</div></div>`;
 return head(isL?'Lagna palapala':'Moon sign palapala',`<span class="sym-hero"><span class="ring2" title="${EMBLEM[r]}">${glyph(r,52)}</span><span>${SIGNS[r][0]} <em>${mn}</em></span></span>`,`For everyone born with ${SIGNS[r][0]} (${SIGNS[r][1]}) ${isL?'lagna':'as their Moon sign'}${mine?', which is yours':''}. Read from where the planets travel this month, counted from your ${isL?'lagna':'Moon sign'}.`,
  `<div class="ctas">${Qchip(F.q,F.label)}<div class="seg"><button aria-selected="${isL}" data-act="pmode" data-m="lagna">By lagna</button><button aria-selected="${!isL}" data-act="pmode" data-m="rashi">By Moon sign</button></div><div class="seg"><button aria-selected="${PMONTH===0}" data-act="pmonth" data-m="0">This month</button><button aria-selected="${PMONTH===1}" data-act="pmonth" data-m="1">Next month</button></div></div>`)+
 `<section class="g"><div class="cap"><div class="rail">${rashiCards(r,'prashi',PMODE)}</div></div></section>
 <section class="s g" style="padding-top:40px"><div class="cap grid2">${sec('The month as a whole','big')}${sec('Work and money','work')}${sec('Love and family','love')}${sec('Health and energy','health')}</div>
 <div class="cap grid2" style="margin-top:14px"><div class="card"><span class="tag">Day by day</span>${cal}<div class="chips">${Qchip('good','Good days')}${Qchip('hard','Chandrashtama: be careful')}</div></div>
  <div class="card"><span class="tag">Key dates this month</span><div class="prose">${keyText}</div></div></div>
 ${C?'':`<div class="cap" style="margin-top:14px"><a class="card" href="#reading" style="text-decoration:none;flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap"><p class="big" style="font-size:1.5rem">Not sure of your lagna?</p><span class="btn glass sm">Cast my chart ${ARROW}</span></a></div>`}
 </section>`}
/* ---------- PORONDAM ---------- */
function porondam(G,B){const gs=G.moonS,bs=B.moonS,gn=G.planets.Mo.nak.i,bn=B.planets.Mo.nak.i,rows=[];
 const vg=VARNA(gs),vb=VARNA(bs);rows.push(['Varna',1,vg>=vb?1:0,`${VARNA_N[vg]} and ${VARNA_N[vb]}`,'Spiritual temperament of the two Moon signs.']);
 const a=VASHYA(gs),c=VASHYA(bs);rows.push(['Vashya',2,VASHYA_PTS[a][c],`${VASHYA_N[a]} and ${VASHYA_N[c]}`,'How naturally you attract and influence each other.']);
 const tg=x=>{const r=((x%27)+1)%9;return![3,5,7].includes(r)};const t=(tg(gn-bn+27)?1.5:0)+(tg(bn-gn+27)?1.5:0);rows.push(['Tara',3,t,`${NAKS[gn][0]} and ${NAKS[bn][0]}`,'Wellbeing and good fortune between your birth stars.']);
 const ya=YONI[gn],yb=YONI[bn],en=YONI_ENEMY.some(([p,q])=>(p===ya&&q===yb)||(p===yb&&q===ya));rows.push(['Yoni',4,ya===yb?4:en?0:2,`${ya} and ${yb}`,'Physical and emotional compatibility.']);
 const la=SIGN_LORD[gs],lb=SIGN_LORD[bs],rel=(x,y)=>x===y||FRIEND[x].includes(y)?'f':ENEMY[x].includes(y)?'e':'n',k=[rel(la,lb),rel(lb,la)].sort().join('');
 rows.push(['Graha maitri',5,{ff:5,fn:4,nn:3,ef:1,en:.5,ee:0}[k],`${P[la].n} and ${P[lb].n}`,'Mental compatibility: how the rulers of your Moon signs get on.']);
 const ga=NAK_D[gn][2],gb=NAK_D[bn][2];rows.push(['Gana',6,GANA_PTS[ga][gb],`${ga} and ${gb}`,'Temperament: gentle, human or intense.']);
 const d=houseFrom(gs,bs);rows.push(['Bhakoot',7,[2,12,5,9,6,8].includes(d)?0:7,`${SIGNS[gs][0]} and ${SIGNS[bs][0]}`,'Family life, finances and growth together.']);
 rows.push(['Nadi',8,NADI(gn)===NADI(bn)?0:8,`${NADI(gn)} and ${NADI(bn)}`,'Health and children. The most important factor.']);
 const total=rows.reduce((s,r)=>s+r[2],0),rj=RAJJU(gn)===RAJJU(bn),kg=G.doshas.some(x=>x[0].startsWith('Kuja')),kb=B.doshas.some(x=>x[0].startsWith('Kuja'));
 return{rows,total,rj,rajju:[RAJJU(gn),RAJJU(bn)],kg,kb}}
function vPorondam(){const st=POR||STORE.get('gk-por')||{g:STORE.get('gk-last')&&STORE.get('gk-last').gender!=='f'?STORE.get('gk-last'):EXAMPLE,b:EXAMPLE_B};
 let res='';if(POR){const G=analyse(POR.g),B=analyse(POR.b),R=porondam(G,B),q=R.total>=24?'good':R.total>=18?'mixed':'hard',v=R.total>=28?'An excellent match':R.total>=24?'A good match':R.total>=18?'An acceptable match':'A weak match by points';
  res=`<section class="s g" id="result" style="padding-top:20px"><div class="cap grid3">
   <div class="card" style="align-items:center;text-align:center"><span class="tag">Total</span><svg class="ring" style="width:170px;height:170px" viewBox="0 0 120 120" role="img" aria-label="${R.total} of 36"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9"/><circle cx="60" cy="60" r="50" fill="none" stroke="url(#kg)" stroke-width="9" stroke-linecap="round" stroke-dasharray="${(R.total/36*314).toFixed(1)} 314" transform="rotate(-90 60 60)"/><text x="60" y="62" text-anchor="middle" font-family="Instrument Serif,Georgia" font-size="38" fill="#f5f3fc">${R.total%1?R.total.toFixed(1):R.total}</text><text x="60" y="80" text-anchor="middle" font-family="Geist Mono,monospace" font-size="10" fill="#8e88a8">of 36</text></svg>${Qchip(q,v)}</div>
   <div class="card" style="grid-column:span 2"><span class="tag">What it means</span><p class="big" style="font-size:1.6rem">${esc(firstName(POR.b)||'Bride')} and ${esc(firstName(POR.g)||'Groom')}: ${v.toLowerCase()}.</p>
    <div class="prose" style="max-width:none">${nPorondam(R,firstName(POR.b)||'The bride',firstName(POR.g)||'the groom')}</div>
    <div class="grid2" style="gap:12px;margin-top:6px"><div><span class="tag">Rajju</span><p>${R.rj?`Both are ${R.rajju[0]}: <b style="color:var(--hard);font-weight:500">Rajju dosha</b>, which Sri Lankan astrologers avoid.`:`${R.rajju[0]} and ${R.rajju[1]}: <b style="color:var(--good);font-weight:500">no Rajju dosha</b>.`}</p></div>
    <div><span class="tag">Kuja dosha</span><p>${R.kg===R.kb?(R.kg?'Both charts have Kuja dosha, so it balances out.':'Neither chart has Kuja dosha.'):`Only the ${R.kg?'groom':'bride'}'s chart has Kuja dosha. Have an astrologer check for cancellations.`}</p></div></div></div></div>
   <div class="cap tbl" style="margin-top:14px"><table><thead><tr><th>Factor</th><th>Points</th><th>Your pair</th><th>What it checks</th></tr></thead><tbody>${R.rows.map(r=>`<tr><td><b style="font-weight:500">${r[0]}</b></td><td style="font-family:var(--mono)">${r[2]} / ${r[1]}</td><td>${r[3]}</td><td class="wrap">${r[4]}</td></tr>`).join('')}</tbody></table></div>
   <p class="cap fine" style="text-align:left;margin-top:12px">Ashtakoota matching from both Moon signs and birth stars. Yoni uses same, enemy and neutral pairs only. A score is a starting point; consult an astrologer before a final decision.</p></section>`}
 return head('Porondam','Check a <em>match</em>','Compare two birth charts with the eight classical factors (36 points), plus Rajju and Kuja dosha.')+
 `<section class="g"><form class="cap grid2" data-form="por" novalidate>
  <div class="formcard"><h3>Bride</h3><div class="fgrid">${birthFields('pb',st.b)}</div></div>
  <div class="formcard"><h3>Groom</h3><div class="fgrid">${birthFields('pg',st.g)}</div></div>
  <div style="grid-column:1/-1;display:flex;gap:12px;flex-wrap:wrap"><button class="btn primary" type="submit">Check porondam ${ARROW}</button>${POR?'':'<span class="fine" style="align-self:center">The forms start with an example couple.</span>'}</div></form></section>`+res}

/* ---------- NAKATH ---------- */
function vNakath(){const C=STORE.get('gk-last')?getChart():null,S=skyNow(),c=S.c,tz=c[3];
 const ev=MUHURTA[MEVENT],rows=[];
 for(let i=1;i<=75;i++){const dt=new Date(S.loc.getTime()+i*864e5),y=dt.getUTCFullYear(),m=dt.getUTCMonth()+1,d=dt.getUTCDate(),wd=dt.getUTCDay(),se=sunEvents(y,m,d,c[1],c[2],tz),hr=se?se.rise+1:7;
  const jd=julianDay(y,m,d,hr-tz),tp=tropical(jd),sp=siderealAll(jd),ti=Math.floor(norm(tp.Mo-tp.Su)/12),tn=(ti%15)+1,nk=nakOf(sp.Mo);
  if(ti===29||[4,9,14].includes(tn)||!ev.naks.includes(nk.i))continue;let sc=3,why=[`${nk.name} nakshatra suits this`];
  if(GOOD_TITHI.includes(tn)){sc+=2;why.push(`${pk(ti)} ${tname(ti)} is a favourable tithi`)}else if(ti===14){sc+=1;why.push('Full moon (Poya)')}
  if(ev.days.includes(wd)){sc+=1;why.push(`${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][wd]} is a good weekday`)}else sc-=1;
  if(C){const tara=((nk.i-A.planets.Mo.nak.i+27)%27)%9+1;if([2,4,6,8,9].includes(tara)){sc+=1;why.push('good for your birth star')}if([3,5,7].includes(tara)){sc-=2;why.push('weak for your birth star')}
   const ch=houseFrom(signOf(sp.Mo),A.moonS);if(ch===8){sc-=3;why.push('Chandrashtama for you')}}
  rows.push({dt,sc,why,k:kalams(se,wd)})}
 rows.sort((a,b)=>b.sc-a.sc);const best=rows.slice(0,8).sort((a,b)=>a.dt-b.dt);
 const tara=C?((S.nk.i-A.planets.Mo.nak.i+27)%27)%9+1:0;
 return head(`Nakath · ${c[0]}`,'Good times, <em>today and ahead</em>',`Auspicious and inauspicious periods for ${c[0]}, from today's sunrise and sunset.${C?' Personalised with your birth star.':''}`)+
 `<section class="g"><div class="cap bento" style="grid-auto-rows:auto">
  <div class="tile t-2"><span class="tag">Today · ${S.loc.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',timeZone:'UTC'})}</span><div class="moonrow"><canvas class="moon" width="192" height="192" data-e="${S.el}" aria-label="Moon phase"></canvas><div class="kv">
   <div><span>Tithi</span><b>${pk(S.ti)} ${tname(S.ti)}</b></div><div><span>Nakshatra</span><b>${S.nk.name}</b></div><div><span>Yoga</span><b>${YOGA[S.yi]}</b></div><div><span>Weekday</span><b>${VARA[S.wd]}</b></div><div><span>Sunrise</span><b>${S.ev?fmtHr(S.ev.rise):'—'}</b></div><div><span>Sunset</span><b>${S.ev?fmtHr(S.ev.set):'—'}</b></div></div></div>
   ${C?`<p>Today's star is ${[2,4,6,8,9].includes(tara)?'<b style="color:var(--good);font-weight:500">favourable</b>':[3,5,7].includes(tara)?'<b style="color:var(--hard);font-weight:500">unfavourable</b>':'neutral'} for your birth star ${A.planets.Mo.nak.name}.</p>`:''}</div>
  <div class="tile t-1"><span class="tag">Good times</span><div class="list"><div><b style="font-weight:500">Abhijit</b><span>${S.k?rng(S.k.abhijit):'—'}</span></div></div><p style="font-size:13.5px">The midday muhurta, good for most beginnings${S.wd===3?' (traditionally skipped on Wednesdays)':''}.</p></div>
  <div class="tile t-1"><span class="tag">Avoid</span><div class="list"><div><b style="font-weight:500">Rahu kalaya</b><span>${S.k?rng(S.k.rahu):'—'}</span></div><div><b style="font-weight:500">Yamagandam</b><span>${S.k?rng(S.k.yama):'—'}</span></div><div><b style="font-weight:500">Gulika</b><span>${S.k?rng(S.k.gulika):'—'}</span></div></div></div>
 </div></section>
 <section class="s g" style="padding-top:56px"><div class="cap"><div class="head"><div><span class="eyebrow">Find a good day</span><h2>The best days in the next <em>ten weeks</em></h2></div><p>Days with a suitable birth star, a good tithi and weekday${C?', and support for your own birth star':''}. Avoid each day's Rahu kalaya.</p></div>
  <div class="seg" style="margin-bottom:20px">${Object.entries(MUHURTA).map(([k,v])=>`<button aria-selected="${MEVENT===k}" data-act="mevent" data-k="${k}">${v.n}</button>`).join('')}</div>
  <div class="grid2">${best.map(r=>`<div class="card"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap"><p class="big" style="font-size:1.7rem">${r.dt.toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'long',timeZone:'UTC'})}</p>${Qchip(r.sc>=7?'good':'mixed',r.sc>=7?'Very good':'Good')}</div><ul class="clean good">${r.why.map(w=>`<li><span>${w}</span></li>`).join('')}</ul>${r.k?`<p style="font-size:13.5px">Avoid ${rng(r.k.rahu)} (Rahu kalaya).</p>`:''}</div>`).join('')||'<p class="muted">No suitable days found in this range.</p>'}</div>
  <p class="fine" style="text-align:left;margin-top:14px">Based on the nakshatra and tithi at sunrise in ${c[0]}. For weddings and major ceremonies, confirm the exact nakath with your astrologer.</p></div></section>`}

/* ---------- LEARN, GUIDES, METHOD ---------- */
function vLearn(){return head('Learn','Guides to your <em>chart</em>','Short, plain-language explanations of the ideas behind your reading.')+`<section class="g"><div class="cap">${guidesGrid()}<a class="card" href="#method" style="text-decoration:none;margin-top:18px;flex-direction:row;align-items:center;gap:22px;flex-wrap:wrap"><div class="art a4" style="width:140px;aspect-ratio:1"></div><div style="flex:1 1 260px;display:grid;gap:6px"><span class="tag">Method</span><h3 style="font:400 1.9rem var(--serif)">How we calculate</h3><p>The astronomy, the ayanamsa, houses, dashas and how readings are put together.</p></div><span class="btn glass sm">Read ${ARROW}</span></a></div></section>`+closing()}
function vGuide(k){const g=GUIDES[k];return head(`${g.tag} · ${g.min} min read`,g.t,g.lede)+`<section class="g"><div class="cap article">${g.body.map(([h,t])=>`<h2>${h}</h2><p>${t}</p>`).join('')}<div class="ctas" style="margin-top:40px"><a class="btn primary" href="#reading">Open my reading ${ARROW}</a><a class="btn glass" href="#learn">More guides</a></div></div></section>`}
function vMethod(){const S=[['The astronomy','Your local birth time is converted to Universal Time, then to a Julian Day number. Planet positions come from Keplerian orbital elements with their slow changes over time, with the main corrections for the Moon (twelve terms), Jupiter and Saturn. Results agree with professional ephemerides to within about one or two arcminutes for the Sun and Moon, and a few arcminutes for the planets, between roughly 1900 and 2100. Rahu is the Moon\'s mean node; Ketu is opposite. The ascendant comes from local sidereal time, your latitude and the tilt of the Earth\'s axis.'],
 ['The sidereal zodiac','Vedic astrology measures signs against the stars. We subtract the Lahiri (Chitrapaksha) ayanamsa, the standard used in Sri Lanka and India: about 23°51′ in 2000, growing by 50.3 arcseconds a year. Sri Lankan time-zone changes between 1996 and 2006 (UTC +6:30 and +6:00) are applied automatically.'],
 ['Houses and divisions','Houses are whole signs: your rising sign is the first house, the next sign the second, and so on. Nakshatras are 27 equal parts of 13°20′, each with four padas. The Navamsa (D9) divides each sign into nine parts.'],
 ['Strength and friendliness','Each planet\'s dignity (exalted, own sign, friendly, enemy or debilitated) follows Brihat Parashara Hora Shastra. Whether a planet helps your particular rising sign depends on the houses it rules: rulers of the 1st, 5th and 9th help; rulers of the 3rd, 6th and 11th test you; a planet ruling both a kendra and a trikona is a yogakaraka.'],
 ['Life periods','Vimshottari dasha: nine periods totalling 120 years, starting from the ruler of the Moon\'s nakshatra at birth. Sub-periods are proportional. A period is rated by how helpful and how strong its planet is, and by how the main and sub-period planets relate.'],
 ['Event windows','An event is flagged when both life-period planets are linked to the relevant house and the slow planets Jupiter and Saturn both influence that house at the same time (the double-transit rule).'],
 ['Monthly palapala','Each planet\'s position is counted from the Moon sign, following the transit rules of Phaladeepika. Chandrashtama days are when the Moon passes the 8th sign from yours.'],
 ['Porondam and nakath','Porondam uses the eight-factor Ashtakoota system (36 points), plus Rajju and Kuja dosha. Nakath uses the nakshatra and tithi at sunrise, weekday rules, and Rahu kalaya, Yamagandam and Gulika from local sunrise and sunset.'],
 ['Limits','Readings combine classical meanings by rule; a human astrologer also weighs the whole chart, other divisional charts and full planetary strength. A four-minute error in birth time moves the rising degree by about one degree, so check your time if your lagna is near the edge of a sign.']];
 return head('Method','How we <em>calculate</em>','Every number on this site is computed in your browser from your birth details. Here is exactly how.')+`<section class="g"><div class="cap article">${S.map(([h,t])=>`<h2>${h}</h2><p>${t}</p>`).join('')}</div></section>`}

function kendaraya(X,d9,style){const lag=d9?Math.floor(X.c.asc/(30/9))%12:X.lag,items=Array.from({length:12},()=>[]);
 for(const p of ORDER){const x=X.planets[p],s=d9?x.d9:x.sign;items[s].push(`${p}${d9?'':' '+Math.floor(x.lon%30)+'°'}${x.retro&&!['Ra','Ke'].includes(p)?'<tspan class="rt" dy="-4">R</tspan>':''}`)}
 const block=(x,y,s,isLag,two)=>{const rows=[];const it=items[s];for(let i=0;i<it.length;i+=two?2:1)rows.push(it.slice(i,i+(two?2:1)).join('  '));
  const lines=[`<tspan class="${isLag?'sg lg':'sg'}">${isLag?'LAGNA · ':''}${SIGNS[s][0].toUpperCase()} ${s+1}</tspan>`,...rows.map(r=>`<tspan class="pl">${r}</tspan>`)];
  const lh=15,y0=y-((lines.length-1)*lh)/2;return lines.map((l,i)=>`<text x="${x}" y="${y0+i*lh+4}" text-anchor="middle">${l}</text>`).join('')};
 let g='';const wm=(x,y,s,isLag)=>`<path class="wm${isLag?' wl':''}" d="${GLYPH[s]}" transform="translate(${x-21},${y-21}) scale(.875)"/>`;
 if(style==='south'){const CELL={11:[0,0],0:[1,0],1:[2,0],2:[3,0],3:[3,1],4:[3,2],5:[3,3],6:[2,3],7:[1,3],8:[0,3],9:[0,2],10:[0,1]},[lx,ly]=CELL[lag];
  g+=`<rect class="lagbg" x="${lx*100}" y="${ly*100}" width="100" height="100"/><path class="ln" d="M1 1H399V399H1Z M100 1V399 M300 1V399 M1 100H399 M1 300H399"/><rect x="101" y="101" width="198" height="198" fill="#05040b"/><text class="ct" x="200" y="196" text-anchor="middle">${d9?'Navamsa':'Rashi'}</text><text class="sg" x="200" y="218" text-anchor="middle">${SIGNS[lag][0]} lagna</text>`;
  for(let s=0;s<12;s++){const [cx,cy]=CELL[s];g+=wm(cx*100+50,cy*100+50,s,s===lag)+block(cx*100+50,cy*100+52,s,s===lag,items[s].length>4)}}
 else{const C=[[200,100],[100,42],[40,100],[100,200],[40,300],[100,358],[200,300],[300,358],[360,300],[300,200],[360,100],[300,42]],DIA=[1,4,7,10];
  g+=`<path class="lagbg" d="M200 2L299 101L200 200L101 101Z"/><path class="ln" d="M1 1H399V399H1Z M1 1L399 399 M399 1L1 399 M200 1L399 200L200 399L1 200Z"/>`;
  for(let h=1;h<=12;h++){const s=(lag+h-1)%12;g+=wm(C[h-1][0],C[h-1][1],s,h===1)+block(C[h-1][0],C[h-1][1]+(DIA.includes(h)?0:(h===2||h===12?-6:h===6||h===8?6:0)),s,h===1,DIA.includes(h))}}
 return `<svg class="kd" viewBox="0 0 400 400" role="img" aria-label="${d9?'Navamsa':'Birth'} chart, ${SIGNS[lag][0]} lagna">${g}</svg>`}
/* ---------- router ---------- */
/* ---------- ACCOUNT ---------- */
const AUTH=()=>window.GK_AUTH||null;
function vAccount(){const au=AUTH();
 if(!au)return head('Account','Accounts are <em>not available</em>','Sign-in works on the live website.')+closing();
 if(!au.user)return head('Your account','Save your charts <em>everywhere</em>','Create a free account to keep your charts and open them on any phone or computer.')+
  `<section class="g"><div class="cap grid2" style="gap:14px"><div class="card"><span class="tag">New here</span><p class="big" style="font-size:1.7rem">Create a free account</p><p>Your readings stay free. An account simply keeps your charts, and the charts of your family, safe in one place.</p><button class="btn primary" data-act="auth" data-m="signup">Create account</button></div>
  <div class="card"><span class="tag">Already have one</span><p class="big" style="font-size:1.7rem">Sign in</p><p>Use your email and password, or continue with Google.</p><button class="btn glass" data-act="auth" data-m="signin">Sign in</button></div></div></section>`;
 const nm=au.user.name||au.user.email;
 setTimeout(loadCharts,0);
 return head('Your account',`Hello, <em>${esc((nm||'').split(/[\s@]/)[0])}</em>`,`Signed in as ${esc(au.user.email||'')}. Every chart you cast while signed in is saved here.`,`<div class="ctas"><a class="btn primary" href="#reading">${ARROW} New reading</a><button class="btn glass" data-act="signout">Sign out</button></div>`)+
 `<section class="g"><div class="cap"><div class="head" style="margin-bottom:20px"><div><span class="eyebrow">Saved charts</span><h2 style="font-size:clamp(1.8rem,3.4vw,2.6rem)">Your charts</h2></div></div><div class="grid3" id="chartsList"><p class="muted">Loading your charts…</p></div></div></section>`}
async function loadCharts(){const el=$id('chartsList');if(!el||!AUTH())return;
 try{const list=await AUTH().listCharts();window.__charts=list;
  el.innerHTML=list.length?list.map((b,i)=>{let C;try{C=analyse(b)}catch(_){C=null}return `<div class="card">${C?orb(C.lag,true):''}<span class="tag">${C?`${SIGNS[C.lag][0]} lagna · Moon in ${SIGNS[C.moonS][0]}`:'Chart'}</span><p class="big" style="font-size:1.6rem">${esc(b.name||'Unnamed chart')}</p><p>${b.d}/${b.m}/${b.y} · ${hm(b)} · ${esc(b.place||'')}</p><div class="ctas" style="margin-top:auto"><button class="btn primary sm" data-act="openchart" data-i="${i}">Open reading</button><button class="btn glass sm" data-act="delchart" data-i="${i}">Delete</button></div></div>`}).join(''):`<div class="card" style="grid-column:1/-1"><p class="big" style="font-size:1.6rem">No saved charts yet</p><p>Cast a chart on the reading page and it will appear here automatically.</p><a class="btn primary sm" href="#reading" style="align-self:start">Cast a chart</a></div>`}
 catch(e){el.innerHTML='<p class="err">Your charts could not be loaded. Check your connection and refresh the page.</p>'}}
function renderAcct(){const slot=$id('acct'),au=AUTH();if(!slot)return;if(!au){slot.hidden=true;return}slot.hidden=false;
 if(au.user){const n=(au.user.name||au.user.email||'?').trim();slot.innerHTML=`<a class="avatar" href="#account" title="Your account">${esc(n.charAt(0).toUpperCase())}</a>`}
 else slot.innerHTML=`<button class="btn glass sm" data-act="auth" data-m="signin">Sign in</button>`;
 const ml=$id('mobileAcct');if(ml)ml.textContent=au.user?'My account':'Sign in';}
const ROUTES={home:vHome,reading:vReading,palapala:vPalapala,porondam:vPorondam,nakath:vNakath,learn:vLearn,method:vMethod,account:vAccount};
let CUR='';
function render(keepScroll){let h=location.hash.slice(1)||'home',fn=ROUTES[h];if(!fn&&GUIDES[h])fn=()=>vGuide(h);if(!fn){h='home';fn=vHome}
 const y=scrollY;$id('app').innerHTML=fn();CUR=h;
 document.querySelectorAll('#links a').forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')==='#'+h));document.querySelectorAll('#links a[aria-current]').forEach(a=>a.setAttribute('aria-current','page'));
 $id('navCta').textContent=STORE.get('gk-last')?'My reading':'Get my reading';
 renderAcct();
 $id('links').classList.remove('open');$id('menuBtn').setAttribute('aria-expanded','false');
 document.querySelectorAll('canvas.moon').forEach(drawMoon);
 if(keepScroll)scrollTo({top:y,behavior:'instant'});else scrollTo({top:0,behavior:'instant'});
 SKY.fit()}
addEventListener('hashchange',()=>{EDIT=false;render()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
 if(a==='rashi'){RASHI=+t.dataset.r;PMONTH=0;PMODE='lagna';location.hash='palapala';return}
 if(a==='pmode'){PMODE=t.dataset.m;RASHI=null;render(true);return}
 if(a==='prashi'){RASHI=+t.dataset.r;render(true);return}
 if(a==='pmonth'){PMONTH=+t.dataset.m;render(true);return}
 if(a==='tab'){RTAB=t.dataset.t;if(CUR!=='reading'){return}e.preventDefault();render(true);return}
 if(a==='chstyle'){CHSTYLE=t.dataset.s;render(true);return}
 if(a==='mevent'){MEVENT=t.dataset.k;render(true);return}
 if(a==='edit'){EDIT=true;render();return}
 if(a==='canceledit'){EDIT=false;render();return}
 if(a==='clear'){STORE.del('gk-last');A=null;LASTKEY='';EDIT=false;render();return}
 if(a==='example'){STORE.set('gk-last',EXAMPLE);RTAB='overview';render();return}
 if(a==='top'){e.preventDefault();scrollTo({top:0,behavior:'smooth'})}
 if(a==='auth'){e.preventDefault();if(AUTH())AUTH().open(t.dataset.m);return}
 if(a==='signout'){if(AUTH())AUTH().signOut().then(()=>{location.hash='home'});return}
 if(a==='openchart'){const b=(window.__charts||[])[+t.dataset.i];if(b){const{id,savedAt,...c}=b;STORE.set('gk-last',c);A=null;LASTKEY='';RTAB='overview';location.hash='reading'}return}
 if(a==='delchart'){const b=(window.__charts||[])[+t.dataset.i];if(!b)return;if(t.dataset.confirm!=='1'){t.dataset.confirm='1';t.textContent='Tap again to delete';setTimeout(()=>{if(t.isConnected){t.dataset.confirm='';t.textContent='Delete'}},4000);return}
  AUTH().deleteChart(b.id).then(loadCharts);return}});
addEventListener('gk-auth',()=>{renderAcct();if(CUR==='account'||CUR==='home'||CUR==='reading')render(true)});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();const k=f.dataset.form;
 if(k==='home'||k==='reading'){const b=readBirth(k==='home'?'h':'r');if(!b)return;STORE.set('gk-last',b);if(AUTH()&&AUTH().user)AUTH().saveChart(b).catch(()=>{});EDIT=false;RTAB='overview';A=null;LASTKEY='';if(location.hash==='#reading')render();else location.hash='reading';return}
 if(k==='por'){const g=readBirth('pg'),b=readBirth('pb');if(!g||!b)return;POR={g,b};STORE.set('gk-por',POR);render(true);setTimeout(()=>{const r=$id('result');if(r)r.scrollIntoView({behavior:'smooth'})},50)}});
$id('menuBtn').addEventListener('click',()=>{const o=$id('links').classList.toggle('open');$id('menuBtn').setAttribute('aria-expanded',o)});

/* ---------- rendered sky (WebGL) ---------- */
const SKY=(function(){
 const wrap=$id('skywrap'),cv=$id('sky');let gl=null;try{gl=cv.getContext('webgl',{antialias:false})}catch(_){}
 const api={fit(){const h=document.querySelector('#app .hero,#app .pagehead');wrap.style.setProperty('--skyh',((h?h.offsetHeight:600)+160)+'px');if(api.size)api.size()}};
 if(!gl){cv.remove();return api}
 const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
 const fs=`precision highp float;uniform vec2 uRes;uniform float uTime;uniform vec3 uP1;uniform vec3 uP2;
float h3(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h3(i),h3(i+vec3(1,0,0)),f.x),mix(h3(i+vec3(0,1,0)),h3(i+vec3(1,1,0)),f.x),f.y),mix(mix(h3(i+vec3(0,0,1)),h3(i+vec3(1,0,1)),f.x),mix(h3(i+vec3(0,1,1)),h3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n3(p);p=p*2.02+vec3(1.7,9.2,3.1);a*=.5;}return s;}
float h2(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 L=normalize(vec3(-.72,.42,.55));
vec4 planet(vec2 uv,vec3 P,float seed,float bandF,vec3 cA,vec3 cB,vec3 cC,vec3 atm){vec2 d=(uv-P.xy)/P.z;float r=length(d);
 float facing=dot(normalize(d+1e-5),normalize(L.xy))*.5+.5;
 if(r>=1.)return vec4(atm*exp(-(r-1.)*7.)*(.25+.75*facing)*.55,0.);
 vec3 n=vec3(d,sqrt(1.-r*r));float a=uTime*.012+seed;vec3 q=vec3(cos(a)*n.x+sin(a)*n.z,n.y,-sin(a)*n.x+cos(a)*n.z);
 float w=fbm(q*2.2+seed);float lat=q.y*.94+q.x*.34;float bands=sin(lat*bandF+w*5.)*.5+.5;float det=fbm(q*7.+seed*2.);
 vec3 col=mix(cA,cB,bands);col=mix(col,cC,smoothstep(.5,.85,det)*.55);
 float diff=clamp(dot(n,L),0.,1.);float term=smoothstep(-.2,.45,dot(n,L));float rim=pow(1.-n.z,2.2);
 vec3 lit=col*(.025+1.15*diff)+atm*rim*(.18+1.1*term);lit+=pow(max(dot(reflect(-L,n),vec3(0,0,1)),0.),24.)*.12;
 return vec4(lit,smoothstep(1.,.992,r));}
void main(){vec2 fc=gl_FragCoord.xy;float m=min(uRes.x,uRes.y);vec2 uv=(fc-.5*uRes)/m;vec3 col=vec3(.010,.008,.026);
 float nb=fbm(vec3(uv*1.4,uTime*.006));float nb2=fbm(vec3(uv*2.6+4.,uTime*.005+3.));
 col+=vec3(.36,.13,.50)*pow(nb,3.2)*.75;col+=vec3(.10,.16,.52)*pow(nb2,3.8)*.7;
 for(int k=0;k<3;k++){float sc=k==0?110.:k==1?55.:28.;vec2 g=uv*sc+float(k)*17.;vec2 id=floor(g);vec2 f=fract(g)-.5;float h=h2(id+float(k)*13.1);
  float th=k==0?.86:k==1?.93:.975;if(h>th){vec2 o=(vec2(h2(id+1.3),h2(id+7.7))-.5)*.7;float dd=length(f-o)*m/sc;
   float tw=.7+.3*sin(uTime*(.8+h*2.)+h*50.);float sz=k==0?.7:k==1?1.:1.4;col+=mix(vec3(.75,.8,1.),vec3(1.,.85,.9),h2(id+3.))*exp(-dd*dd/(sz*sz))*tw*(h-th)/(1.-th)*(k==2?1.6:1.1);}}
 vec4 p1=planet(uv,uP1,1.3,11.,vec3(.20,.16,.48),vec3(.52,.42,.86),vec3(.86,.55,.80),vec3(.62,.50,1.));col=col*(1.-p1.a)+p1.rgb*p1.a+(p1.a<.5?p1.rgb:vec3(0.));
 vec4 p2=planet(uv,uP2,7.7,4.,vec3(.42,.20,.36),vec3(.85,.56,.70),vec3(.30,.18,.40),vec3(1.,.62,.82));col=col*(1.-p2.a)+p2.rgb*p2.a+(p2.a<.5?p2.rgb:vec3(0.));
 col=1.-exp(-col*1.25);col=pow(col,vec3(.92));col+=(h2(fc+fract(uTime))-.5)/255.;gl_FragColor=vec4(col,1.);}`;
 const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null};
 const v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,fs);if(!v||!f){cv.remove();return api}
 const pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);gl.useProgram(pr);
 gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 const uRes=gl.getUniformLocation(pr,'uRes'),uT=gl.getUniformLocation(pr,'uTime'),u1=gl.getUniformLocation(pr,'uP1'),u2=gl.getUniformLocation(pr,'uP2');
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches;let vis=true,t0=performance.now(),last=0;
 const draw=t=>{gl.uniform1f(uT,t);gl.drawArrays(gl.TRIANGLES,0,3)};
 api.size=()=>{const d=Math.min(devicePixelRatio||1,1.6),r=cv.getBoundingClientRect(),W=Math.max(1,Math.round(r.width*d)),H=Math.max(1,Math.round(r.height*d));if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}gl.viewport(0,0,W,H);gl.uniform2f(uRes,W,H);
  const m=Math.min(W,H),xr=W/m/2,yr=H/m/2,home=CUR==='home';
  if(W>H){if(home){gl.uniform3f(u1,xr*1.02,yr*.30,.64);gl.uniform3f(u2,xr*.30,-yr*.72,.085)}else{gl.uniform3f(u1,xr*.98,yr*.55,.62);gl.uniform3f(u2,xr*.22,-yr*.30,.06)}}
  else{gl.uniform3f(u1,.36,yr*.70,.46);gl.uniform3f(u2,.30,-yr*.80,.07)}
  if(still)draw(40)};
 const frame=t=>{if(vis&&t-last>33){draw((t-t0)/1000+40);last=t}requestAnimationFrame(frame)};
 addEventListener('resize',()=>api.size());
 new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(cv);
 if(!still)requestAnimationFrame(frame);
 return api})();

render();
