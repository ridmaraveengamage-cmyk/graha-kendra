/* Narrative engine: turns chart facts into plain, life-focused explanations of at least 150 words */

// What each part of life looks like when it is active: real events, not theory
const HOUSE_LIFE=[
 {focus:'yourself, your health and the direction of your life',
  good:['You feel more confident and visible, and people start to take your opinions more seriously.','Your energy and health tend to improve, and it becomes easier to start the personal plans you have been postponing.','You may change your appearance, style or daily routine in a way that reflects who you are becoming.','Opportunities come to you directly, often through your own reputation rather than through other people.'],
  hard:['You may feel tired, restless or unsure of your direction, and small health complaints can linger longer than usual.','Other people may misread your intentions, so it is easy to feel misunderstood.','There can be pressure to make big decisions about your life before you feel ready.','Stress tends to show up in the body first, through sleep, digestion or headaches.'],
  advice:['Protect your sleep and keep a simple daily routine; it steadies everything else.','Make decisions about your direction slowly, and write down what you actually want before you act.','A short daily walk, prayer or meditation will do more for you now than any dramatic change.']},
 {focus:'money, savings and family life',
  good:['Savings can grow, and you may receive money from family, a bonus or a payment you have been waiting for.','Family life feels warmer; there may be a gathering, a celebration or a new member in the household.','Your words carry weight, so negotiations, interviews and teaching tend to go well.','It is a good time to set up a budget, open a savings account or put money into something stable.'],
  hard:['Money can slip away through family needs, repairs or expenses you did not plan for.','Sharp words at home can cause hurt that lasts longer than the argument itself.','You may need to support a relative, financially or emotionally.','Eating habits, teeth or eyes may need some attention.'],
  advice:['Keep a written record of spending and avoid lending money you cannot afford to lose.','Choose your words carefully at home; a calm tone prevents most quarrels.','Put a small fixed amount aside every month, even if it is modest.']},
 {focus:'your own efforts, courage, siblings and communication',
  good:['You feel bold enough to try new things: a course, a side business, a creative project or a move.','Short trips, calls and messages bring useful news and new contacts.','Brothers, sisters, cousins or close colleagues can be a real support.','Writing, speaking, marketing and anything done with your hands goes well.'],
  hard:['You may feel your efforts are not being rewarded, which can be frustrating.','Disagreements with siblings or neighbours can flare up over small matters.','Too many small tasks can scatter your energy.','Travel plans may change at short notice.'],
  advice:['Pick one goal and put steady effort into it rather than starting many things at once.','Keep in touch with siblings and close friends; small gestures matter now.','Double-check messages, documents and travel bookings.']},
 {focus:'home, property, your mother and peace of mind',
  good:['Home life becomes more settled; you may move, renovate or buy something important for the house.','Matters to do with land, property or a vehicle can move forward.','Your relationship with your mother or a mother figure grows closer.','You find more peace of mind, and evenings at home feel restful.'],
  hard:['There may be restlessness at home, repairs, or disagreements about living arrangements.','Your mother or an older woman in the family may need extra care.','Property or vehicle dealings can be delayed by paperwork.','You may feel emotionally unsettled without a clear reason.'],
  advice:['Check documents carefully before signing anything to do with property or vehicles.','Spend unhurried time with your mother or elders.','Make your home a calm place: clear clutter and share regular meals together.']},
 {focus:'children, studies, creativity and romance',
  good:['Children bring joy and pride, and for some this is a time of pregnancy or a birth.','Studies, exams and creative work go well; your ideas are sharp.','Romance and simple enjoyment come more easily.','Your intuition is good, and the advice you give others is valued.'],
  hard:['Worries about children, studies or a romantic relationship can occupy your mind.','Speculation and risky investments are more likely to lose than gain.','Overthinking can make simple decisions feel heavy.','Creative blocks or exam pressure are possible.'],
  advice:['Avoid gambling, share tips and quick-profit schemes.','Give children time and patience rather than pressure.','Turn worry into action: plan study or creative work in short, steady sessions.']},
 {focus:'daily work, health routines, debts and competition',
  good:['You handle competition well; interviews, exams and disputes tend to go in your favour.','Health improves through discipline, and old complaints can be resolved.','Debts can be cleared or brought under control.','Daily work becomes more organised and productive.'],
  hard:['Workload increases, and office politics or a difficult colleague can be draining.','Minor illnesses, digestive trouble or stress-related problems are more likely.','Loans or legal matters may need attention.','You may feel you are serving others without enough appreciation.'],
  advice:['Keep health check-ups up to date and do not ignore small symptoms.','Avoid new loans unless they are truly necessary, and settle disputes on paper.','Do your work well and quietly; results speak louder than arguments.']},
 {focus:'marriage, your partner and close partnerships',
  good:['Relationships take centre stage: for single people, a serious proposal or marriage is possible.','Married life feels more cooperative, and you and your partner can make plans together.','Business partnerships, contracts and dealings with the public go well.','Travel with your partner, or travel for a partnership, is favoured.'],
  hard:['Misunderstandings with your spouse or a business partner can build up if left unspoken.','Your partner may be stressed or need extra care.','Contracts need careful reading; someone may not deliver what was promised.','You may feel you are giving more than you receive in a relationship.'],
  advice:['Talk openly and early about expectations, money and family plans.','Put business agreements in writing.','Make time for your partner with phones and work put aside.']},
 {focus:'sudden changes, shared money and hidden matters',
  good:['Unexpected help, an inheritance, insurance money or a joint asset may come through.','Research, investigation and deep study go well.','An ending makes room for a better beginning.','You gain insight into yourself and others that changes how you live.'],
  hard:['Sudden changes at work or at home can unsettle you.','Health needs more attention, especially for long-standing or hidden problems.','Joint finances, in-laws or taxes can bring complications.','You may feel anxious and keep problems to yourself.'],
  advice:['Keep emergency savings and insurance in order.','Do not ignore health warnings; get proper tests done.','Share worries with someone you trust instead of carrying them alone.']},
 {focus:'luck, your father, teachers, faith and long journeys',
  good:['Luck is on your side; things you have worked for begin to pay off.','Higher studies, long journeys or foreign connections open up.','A teacher, mentor or your father gives valuable support.','Faith, pilgrimage and a sense of purpose grow stronger.'],
  hard:['Plans may be delayed, and luck can feel thin for a while.','Your father or a mentor may face difficulties or disagree with you.','Long journeys or visa matters can become complicated.','You may question your beliefs or feel you lack guidance.'],
  advice:['Respect elders and teachers even when you disagree with them.','Prepare travel documents and applications early and completely.','Regular religious or charitable practice steadies your fortune.']},
 {focus:'career, status and your public reputation',
  good:['Your career moves forward: a promotion, a new job, more responsibility or public recognition.','People in authority notice your work.','It is a good time to start a business or take on a leadership role.','Your reputation grows through visible, practical achievement.'],
  hard:['Work pressure rises, with demanding bosses or heavy responsibility.','A job change may be forced on you rather than chosen.','Mistakes are noticed more easily, so your reputation needs care.','Balancing work and family can be hard.'],
  advice:['Keep a record of your achievements and keep your manager informed.','Avoid shortcuts at work; integrity protects your position.','If you change jobs, secure the new role before leaving the old one.']},
 {focus:'income, friends and the wishes you have been working toward',
  good:['Income rises, and wishes you have held for a long time can come true.','Friends, networks and elder brothers or sisters bring opportunities.','Group projects, clubs and community work are rewarding.','Returns from past efforts finally arrive.'],
  hard:['Gains may come with conditions attached, or be smaller than expected.','A friend may disappoint you or need your help.','Ambition can run ahead of what is practical.','Social life can become expensive.'],
  advice:['Choose friends and partners who share your values.','Reinvest part of any gain rather than spending all of it.','Write down your goals clearly; this is a time when clear wishes are fulfilled.']},
 {focus:'spending, rest, travel abroad and inner life',
  good:['Travel abroad, foreign work or settling overseas becomes possible.','Rest, retreat and spiritual practice bring real peace.','Charity and helping others feel meaningful.','Work in hospitals, large institutions or behind the scenes can be rewarding.'],
  hard:['Expenses rise, sometimes through travel, health or family needs.','Sleep can be disturbed, and you may feel isolated.','Losses through carelessness or misplaced trust are possible.','You may feel far from home, physically or emotionally.'],
  advice:['Plan big expenses in advance and keep a buffer.','Protect your sleep: keep a regular bedtime and limit screens at night.','Give some time or money to a good cause; it eases this period.']}
];
// How each planet's influence feels in everyday life
const PLANET_LIFE={
 Su:{how:'The Sun brings a need to be seen, respected and in charge of your own life.',people:'People in authority, government offices and your father become more important.',good:'confidence, recognition and leadership',hard:'ego clashes, tiredness and pressure from authorities'},
 Mo:{how:'The Moon makes life more emotional and changeable; how you feel matters as much as what happens.',people:'Your mother, the women in your life and the public play a bigger role.',good:'comfort, popularity and close family bonds',hard:'mood swings, worry and restlessness'},
 Ma:{how:'Mars brings energy, urgency and a fighting spirit; you want results now.',people:'Brothers, colleagues, engineers, police or sports people may feature.',good:'courage, quick progress and property gains',hard:'anger, accidents and conflict'},
 Me:{how:'Mercury puts the focus on thinking, talking, learning and trading.',people:'Students, young people, business contacts and friends feature strongly.',good:'learning, good deals and clear communication',hard:'nervous strain, misunderstandings and scattered effort'},
 Ju:{how:'Jupiter brings growth, good advice and a stronger sense of meaning.',people:'Teachers, mentors, children and religious figures become important.',good:'growth, wisdom, children and financial expansion',hard:'over-optimism, weight gain and misplaced trust'},
 Ve:{how:'Venus makes relationships, comfort and beauty central.',people:'Your partner, women, artists and friends play a bigger role.',good:'love, comfort, vehicles and enjoyment',hard:'overspending, indulgence and tension in relationships'},
 Sa:{how:'Saturn slows things down and asks for patience, discipline and hard work.',people:'Older people, workers and those who depend on you become important.',good:'lasting results, stability and earned respect',hard:'delays, fatigue and heavy responsibility'},
 Ra:{how:'Rahu brings ambition, a hunger for change and unusual opportunities.',people:'Foreigners, technology, large organisations and unconventional people feature.',good:'big leaps, foreign links and sudden gains',hard:'confusion, impatience and risky shortcuts'},
 Ke:{how:'Ketu turns your attention inward and loosens your attachment to things that no longer fit.',people:'Spiritual teachers, healers and quiet, private people may enter your life.',good:'insight, spiritual growth and freedom from old burdens',hard:'detachment, sudden endings and unclear direction'}
};
const EVENT_LIFE={
 marriage:'This is when proposals, family discussions about marriage or a decision to commit are most likely. If you are already married, expect an important shared step instead, such as a new home, a child or a renewed closeness.',
 career:'This is when a promotion, a new role, a job offer or a decision to start something of your own is most likely. Responsibility grows, and people in authority notice what you do.',
 property:'This is when buying land, a house or a vehicle, or a major renovation, is most likely. Family discussions about where you live, or an inheritance of property, can also come up.',
 children:'This is the most likely time for a pregnancy or the birth of a child. For those who already have children, it brings important milestones in their lives and education.',
 education:'This is when admissions, scholarships, important exams and starting a new course of study are most favoured. A teacher or mentor may open a door for you.',
 foreign:'This is when travel abroad, a visa approval, foreign work or a move overseas is most likely. Connections with people from other countries also become more useful.',
 wealth:'This is when income is most likely to rise, savings to grow and money owed to you to arrive. Investments made earlier can begin to pay off.'
};

const wc=s=>String(s).replace(/<[^>]+>/g,' ').split(/\s+/).filter(Boolean).length;
const seedOf=(p,h)=>((ORDER.indexOf(p)+1)*7+(h||0)*3)%4;
const pick=(arr,seed,n)=>{const o=[];for(let i=0;i<n&&i<arr.length;i++)o.push(arr[(seed+i)%arr.length]);return o};
const KEEP_CAPS=/^(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu|Sade|Kuja|Rohini|Sri|Kataragama|Hanuman|Om)\b/;
const lc=s=>!s||KEEP_CAPS.test(s)?s:s.charAt(0).toLowerCase()+s.slice(1);
const focusList=hs=>hs.length>1?`${HOUSE_LIFE[hs[0]-1].focus}, as well as ${HOUSE_LIFE[hs[1]-1].focus}`:HOUSE_LIFE[hs[0]-1].focus;
const sname=s=>`${SIGNS[s][0]} (${SIGNS[s][1]})`;
const yours=s=>`Specifically for you: ${lc(s)}`;
function fill(paras,pool,min){min=min||150;const t=paras.filter(Boolean);let i=0;while(wc(t.join(' '))<min&&i<pool.length){const x=pool[i++];if(x&&!t.join(' ').includes(x))t[t.length-1]+=' '+x}
 return t.map(p=>`<p>${p}</p>`).join('')}
// Everything relevant about one planet acting on one part of life, used to deepen an explanation
function ctx(p,h,isGood){const H=HOUSE_LIFE[h-1],PL=PLANET_LIFE[p];
 return [PL.people,`${P[p].n} at its best brings ${PL.good}; under pressure it shows up as ${PL.hard}.`,...H[isGood?'good':'hard'],...H.advice,...H[isGood?'hard':'good'].slice(0,1).map(s=>`Even so, be aware that ${lc(s)}`)]}
const allAdvice=h=>HOUSE_LIFE[h-1].advice;

/* ---- a life period or phase ---- */
function nPeriod(md,ad,s,e){const L=ad||md,q=quality(md,ad),hs=areasOf(L),PL=PLANET_LIFE[L],now=Date.now(),main=hs.slice(0,2);
 const tone=q==='good'?'Overall this is a supportive time, and effort tends to bring results without too much struggle.':q==='hard'?'Overall this is a testing time: progress is still possible, but it asks for patience and care.':'Overall this is a mixed time, with real opportunities alongside a few frustrations.';
 const p1=`From ${fmtMonth(Math.max(s,now))} to ${fmtMonth(e)}, your life is likely to revolve around ${focusList(main)}. ${PL.how} ${tone}`;
 const lines=main.map(h=>{const H=HOUSE_LIFE[h-1];return (q==='good'?pick(H.good,seedOf(L,h),2):q==='hard'?pick(H.hard,seedOf(L,h),2):[pick(H.good,seedOf(L,h),1)[0],pick(H.hard,seedOf(L,h),1)[0]]).join(' ')});
 const p2=lines.join(' ');
 const p3=`${PL.people}${ad&&ad!==md?` All of this sits inside your longer ${P[md].n} chapter, which keeps ${HOUSE_LIFE[areasOf(md)[0]-1].focus} running in the background, so those themes colour what happens now.`:''}`;
 const ing=transitTables().ingress.filter(x=>x.ms>=Math.max(s,now)&&x.ms<e&&x.p!=='Ra').slice(0,2);
 const p4=ing.map(x=>`Around ${fmtMonth(x.ms)}, ${P[x.p].n} moves into ${sname(x.to)} and the mood shifts: ${lc(TR[x.p][houseFrom(x.to,A.moonS)-1])}`).join(' ');
 const p5=`What helps most: ${lc(pick(allAdvice(main[0]),seedOf(L,main[0]),2).join(' '))}`;
 const pool=[yours(PIH[L][A.planets[L].house-1]),...pick(HOUSE_LIFE[main[0]-1][q==='hard'?'hard':'good'],seedOf(L,main[0])+2,2),...(main[1]?pick(allAdvice(main[1]),1,2):[]),...ctx(L,main[0],q!=="hard"),...(main[1]?ctx(L,main[1],q!=="hard"):[])];
 return fill([p1,p2,p3,p4,p5],pool)}

/* ---- one area of life ---- */
function nArea(a){const s=a.hs.reduce((t,h)=>t+A.houseScore(h),0)/a.hs.length,q=s>=1.5?'good':s>=0?'mixed':'hard',{md,ad}=currentDasha();
 const p1=`${q==='good'?'This is one of the stronger parts of your life.':q==='hard'?'This part of your life asks for more care than most.':'This part of your life is steady, with easier and harder stretches.'} ${yours(a.hs.map(h=>LIH[h-1][A.planets[A.lordOf(h)].house-1]).join(' '))}`;
 const occ=a.hs.flatMap(h=>A.occupants(h).map(p=>`With ${P[p].n} placed here: ${lc(PIH[p][h-1])}`));
 const p2=occ.length?occ.slice(0,2).join(' '):pick(HOUSE_LIFE[a.hs[0]-1][q==='hard'?'hard':'good'],a.hs[0],2).join(' ');
 const active=md?a.hs.filter(h=>areasOf(md.lord).includes(h)||areasOf(ad.lord).includes(h)):[];
 const pq=md?quality(md.lord,ad.lord):'mixed';
 const p3=active.length?`Right now this area is switched on. Your current phase, running until ${fmtMonth(ad.end)}, touches ${HOUSE_LIFE[active[0]-1].focus}, so ${lc(pick(HOUSE_LIFE[active[0]-1][pq==='hard'?'hard':'good'],seedOf(ad.lord,active[0]),1)[0])}`:`At the moment this area sits in the background; the main action in your life is elsewhere, so steady, ordinary effort is enough here for now.`;
 const w=a.ev?bestWindow(a.ev):null;
 const p4=w?`The clearest window ahead is ${windowWhen(w)}, when you will be about ${ageAt(w.dt.length?w.dt[0][0]:w.s)}. ${EVENT_LIFE[a.ev]}`:'';
 const p5=`What helps: ${lc(pick(allAdvice(a.hs[0]),a.hs[0],2).join(' '))}`;
 return fill([p1,p2,p3,p4,p5],[...pick(HOUSE_LIFE[a.hs[0]-1].good,a.hs[0]+1,2),...(a.hs[1]?pick(allAdvice(a.hs[1]),0,2):[]),...ctx(A.lordOf(a.hs[0]),a.hs[0],q!=="hard")])}

/* ---- a big-moment window ---- */
function nEvent(ev,w,all){const H=HOUSE_LIFE[ev.h-1],age=ageAt(w.dt.length?w.dt[0][0]:w.s);
 const p1=`${EVENT_LIFE[ev.k]} For you, the strongest opening is ${windowWhen(w)}, when you will be about ${age}.`;
 const p2=`Two things line up then. Your life phase at that time is led by ${P[w.ad].n}, which brings ${PLANET_LIFE[w.ad].good} and points straight at ${H.focus}. ${w.dt.length?`At the same time, the two slowest planets, Jupiter and Saturn, both support this part of your life, which is the classic sign that promise turns into a real event.`:`The slow planets are not both supporting it at that point, so the timing rests mainly on your life phase and on the effort you put in.`}`;
 const p3=`In practice it may look like this: ${lc(pick(H.good,seedOf(w.ad,ev.h),2).join(' '))}`;
 const next=all.filter(x=>x!==w&&x.s>w.s)[0];
 const p4=`To prepare, ${lc(pick(H.advice,seedOf(w.ad,ev.h),2).join(' '))}${next?` If it does not happen then, the next opening is ${windowWhen(next)}.`:''}`;
 return fill([p1,p2,p3,p4],[PLANET_LIFE[w.ad].people,...pick(H.good,seedOf(w.ad,ev.h)+2,2),...ctx(w.ad,ev.h,true)])}

/* ---- about you ---- */
function nPersonality(){const LD=LAGNA_D[A.lag],LL=SIGN_LORD[A.lag],pl=A.planets;
 return fill([`People tend to see you as ${lc(LD.nature.replace(/\.$/,''))}. ${LD.look} ${LD.str.replace(/\.$/,'')} are your natural strengths, and you are at your best when you can use them openly rather than holding back.`,
  `Your growth edge is ${lc(LD.weak.replace(/\.$/,''))}. These are not faults so much as habits that show up under stress; noticing them early saves you a lot of trouble in relationships and at work.`,
  `Work that tends to suit you: ${lc(LD.career)} Your body is most sensitive in the areas of ${lc(LD.health)}`,
  `Where your life naturally points: ${lc(LIH[0][pl[LL].house-1])} ${A.occupants(1).map(p=>`With ${P[p].n} on your lagna: ${lc(PIH[p][0])}`).join(' ')}`],[...pick(HOUSE_LIFE[0].good,A.lag,2),...pick(HOUSE_LIFE[0].advice,A.lag,2),...ctx(SIGN_LORD[A.lag],A.planets[SIGN_LORD[A.lag]].house,true)])}
function nMind(){const pl=A.planets,h=pl.Mo.house;
 return fill([MOON_D[A.moonS],`Your feelings are strongly tied to ${HOUSE_LIFE[h-1].focus}. ${yours(PIH.Mo[h-1])}`,`When you are emotionally steady, ${lc(pick(HOUSE_LIFE[h-1].good,A.moonS,1)[0])} When you are stressed, ${lc(pick(HOUSE_LIFE[h-1].hard,A.moonS,1)[0])}`,`What keeps your mind calm: ${lc(pick(HOUSE_LIFE[h-1].advice,A.moonS,2).join(' '))}`],[PLANET_LIFE.Mo.people,...ctx("Mo",A.planets.Mo.house,true)])}
function nStar(){const n=A.planets.Mo.nak,d=NAK_D[n.i],L=n.lord;
 return fill([`You were born under ${n.name}. ${d[3]} People often notice this quality in you before anything else, and it shapes how you handle both opportunities and setbacks.`,
  `Work that tends to fit this star: ${lc(d[4])} You do best in roles where these qualities are needed every day rather than occasionally.`,
  `The thing to watch is ${lc(d[5].replace(/\.$/,''))}. It tends to appear when you are tired or under pressure, so it helps to recognise the early signs.`,
  `Your birth star is ruled by ${P[L].n}, so ${lc(PLANET_LIFE[L].how)} The period of ${P[L].n} was running when you were born and set the tone of your early childhood.`],[PLANET_LIFE[L].people,...pick(HOUSE_LIFE[A.planets.Mo.house-1].good,n.i,2),...ctx(L,A.planets[L].house,true)])}
function nLagna(){const deg=A.c.asc%30,LD=LAGNA_D[A.lag],b=A.birth,LL=SIGN_LORD[A.lag];
 return fill([`Your lagna is ${SIGNS[A.lag][0]} (${SIGNS[A.lag][1]}), at ${dms(A.c.asc)} within the sign. It means that at ${hm(b)} on the day you were born, ${SIGNS[A.lag][1]} was rising on the eastern horizon over ${esc(b.place)}. In Sri Lankan astrology this rising sign becomes the first house of your kendaraya, and every other part of your life is counted from it.`,
  `In everyday terms, your lagna describes your body, your temperament and the path you naturally walk. People tend to see you as ${lc(LD.nature.replace(/\.$/,''))}, and ${lc(LD.look)}`,
  `Your lagna is ruled by ${P[LL].n}, and the way your life unfolds follows where that planet sits: ${lc(LIH[0][A.planets[LL].house-1])}`,
  deg<1.5||deg>28.5?`Your lagna is very close to the edge of the sign, so even a few minutes' difference in your birth time could change it. If your time is approximate, check it against your birth certificate.`:`Your lagna sits comfortably inside the sign, so small errors in your birth time will not change it.`],[...pick(HOUSE_LIFE[0].good,A.lag,2),...ctx(SIGN_LORD[A.lag],1,true)])}

/* ---- what to do now ---- */
function nRemedies(){const{md,ad}=currentDasha(),T=transitInfo(),L=ad?ad.lord:md.lord,fn=funcNature(L),LL=SIGN_LORD[A.lag],h=areasOf(L)[0];
 const calm=fn.cls==='bad'||fn.shadow;
 const p1=`At this point in your life the influence of ${P[L].n} is strongest, so that is where simple remedies make the biggest difference. ${calm?`${P[L].n} tends to test you, which usually shows up as ${PLANET_LIFE[L].hard}. The aim is to calm it, not to strengthen it.`:`${P[L].n} is on your side, and it brings ${PLANET_LIFE[L].good} when it is well supported. The aim is to give it more strength.`}`;
 const p2=`In practice: ${plainPeriod(L).todo} Small, regular practice matters more than one big ritual; doing it every week for the length of this phase is what counts.`;
 const p3=[12,1,2].includes(T.Sa.fromMoon)?`You are also in Sade Sati, the seven and a half years when Saturn passes over your Moon sign. This can feel like heavier responsibility and slower progress. Keep steady routines, avoid new debt, look after elders, and light a sesame-oil lamp on Saturday evenings.`:T.Sa.fromMoon===8?`Saturn is also passing the 8th sign from your Moon, a time that can bring sudden changes. Avoid risky ventures and keep health check-ups regular.`:'';
 const p4=`Day to day, the most useful habits are practical: ${lc(pick(allAdvice(h),seedOf(L,h),2).join(' '))} Your lucky day is ${P[LL].day}, the day of the planet that rules your lagna, so start important things then where you can, and outside Rahu kalaya.`;
 return fill([p1,p2,p3,p4],[...pick(allAdvice(1),0,2),...ctx(L,h,!calm)])}

/* ---- a yoga or dosha ---- */
function nYoga(y,isDosha){const now=Date.now(),ps=ORDER.filter(p=>y[1].includes(P[p].n)),p=ps[0]||'Mo',h=A.planets[p].house;
 const next=A.dasha.flatMap(d=>d.subs.map(s=>({...s,md:d.lord}))).find(s=>s.end>now&&(s.lord===p||s.md===p));
 const p1=y[1];
 const p2=isDosha?`In everyday life this shows up mostly around ${HOUSE_LIFE[h-1].focus}. ${pick(HOUSE_LIFE[h-1].hard,seedOf(p,h),2).join(' ')} It is a tendency to manage, not a fixed fate, and many charts carry it without serious trouble.`:`In everyday life this shows up mostly around ${HOUSE_LIFE[h-1].focus}. ${pick(HOUSE_LIFE[h-1].good,seedOf(p,h),2).join(' ')} You may notice it as a quiet advantage that keeps helping you at important moments.`;
 const p3=next?`It is most noticeable when ${P[p].n} is leading your life phases; the next such stretch runs from ${fmtMonth(Math.max(next.start,now))} to ${fmtMonth(next.end)}.`:'';
 const p4=`To make the most of it, ${lc(pick(allAdvice(h),seedOf(p,h),2).join(' '))}`;
 return fill([p1,p2,p3,p4],[PLANET_LIFE[p].how,PLANET_LIFE[p].people,...ctx(p,h,!isDosha)])}

/* ---- monthly palapala ---- */
function nMonth(sec,F,mode){const H=F.H,good=p=>GOCHARA_GOOD[p].includes(H[p]),focus=p=>HOUSE_LIFE[H[p]-1].focus;
 const line=(p)=>`${P[p].n} is moving through your ${ord(H[p])} house, the part of life about ${focus(p)}. ${good(p)?pick(HOUSE_LIFE[H[p]-1].good,seedOf(p,H[p]),1)[0]:pick(HOUSE_LIFE[H[p]-1].hard,seedOf(p,H[p]),1)[0]}`;
 const ref=mode==='rashi'?'Moon sign':'lagna';
 if(sec==='big'){const t=['Sa','Ju'].filter(good).length;
  return fill([`${t===2?'The two slowest and most important planets are both on your side this month, which gives a stable, hopeful background to everything else.':t===1?'Of the two slowest planets, one supports you and one asks for patience, so expect steady progress with some friction.':'Both of the slow planets are asking for patience this month, so slower progress is normal; it does not mean anything is going wrong.'}`,
   line('Sa')+(mode==='rashi'?' '+TR.Sa[H.Sa-1]:''),line('Ju'),`Rahu adds a restless edge around ${focus('Ra')}, while Ketu loosens your grip on ${focus('Ke')}.`,`For this month as a whole: ${lc(pick(allAdvice(H.Sa),H.Ju,2).join(' '))}`],[...pick(HOUSE_LIFE[H.Ju-1].good,1,2),...ctx("Ju",H.Ju,good("Ju")),...ctx("Sa",H.Sa,good("Sa"))])}
 if(sec==='work'){const tenth=['Su','Ma','Me','Ju','Ve','Sa'].filter(p=>H[p]===10||H[p]===11||H[p]===6);
  return fill([`At work, ${good('Su')?'you are more visible than usual and your efforts are noticed':'it is wiser to keep a lower profile and let results speak'}. `+line('Su'),H.Me===H.Su?`Mercury travels alongside the Sun this month, so ${lc(PLANET_LIFE.Me.how)} ${good('Me')?'Clear communication helps your work move forward.':'Double-check emails, figures and agreements before you send them.'}`:line('Me'),tenth.length?`${list(tenth.map(p=>P[p].n))} ${tenth.length>1?'are':'is'} also passing through the parts of your chart linked to work and income, so ${good(tenth[0])?'opportunities and extra income are likely':'expect more workload before the reward'}.`:'No planet is passing directly through your career house this month, so steady, ordinary effort is the best approach.',`With money: ${lc(pick(allAdvice(2),H.Me,1)[0])} ${pick(allAdvice(10),H.Su,1)[0]}`],[...pick(HOUSE_LIFE[9].good,H.Su,2),...ctx("Su",H.Su,good("Su")),...ctx("Me",H.Me,good("Me")),...HOUSE_LIFE[9].advice,...HOUSE_LIFE[1].advice])}
 if(sec==='love'){return fill([`In love and family life, ${good('Ve')?'the mood is warm and affectionate':'small tensions need patience'}. `+line('Ve'),[2,4,5,7].includes(H.Ju)?`Jupiter is also blessing ${focus('Ju')}, so family occasions and relationship decisions are well supported.`:`Jupiter is busy with ${focus('Ju')}, so relationships rely more on your own care and attention this month.`,H.Ma===7||H.Ma===4||H.Ma===2?`Mars passing your ${ord(H.Ma)} house can bring short tempers at home; count to ten before replying.`:'Mars is not stirring up your home or relationships this month, which helps.',`What helps: ${lc(pick(allAdvice(7),H.Ve,2).join(' '))}`],[...pick(HOUSE_LIFE[6].good,H.Ve,2),...ctx("Ve",H.Ve,good("Ve")),...HOUSE_LIFE[6].advice,...HOUSE_LIFE[3].advice])}
 return fill([`Your energy this month is ${good('Ma')&&good('Su')?'strong, and you can take on more than usual':good('Ma')||good('Su')?'reasonable, though it dips at times':'lower than usual, so pace yourself'}. `+line('Ma'),line('Su'),[1,6,8,12].includes(H.Sa)?`Saturn's position asks for extra care with sleep, joints and long-standing complaints.`:'Saturn is not pressing on your health this month.',`What keeps you well: ${lc(pick(allAdvice(1),H.Ma,2).join(' '))} ${pick(allAdvice(6),H.Su,1)[0]}`],[...pick(allAdvice(12),1,2),...ctx("Ma",H.Ma,good("Ma")),...ctx("Su",H.Su,good("Su")),...HOUSE_LIFE[5].advice])}

/* ---- porondam ---- */
function nPorondam(R,bn,gn){const r=Object.fromEntries(R.rows.map(x=>[x[0],x[2]/x[1]]));
 const strengths=[],watch=[];
 (r['Graha maitri']>=.6?strengths:watch).push(r['Graha maitri']>=.6?'you understand each other easily and can talk things through':'you think differently, so patience in conversation matters');
 (r.Gana>=.8?strengths:watch).push(r.Gana>=.8?'your temperaments sit comfortably together':'your temperaments differ, and one of you may feel the other is too intense or too relaxed');
 (r.Yoni>=.5?strengths:watch).push(r.Yoni>=.5?'there is natural physical and emotional comfort between you':'physical and emotional rhythms may take time to align');
 (r.Bhakoot===1?strengths:watch).push(r.Bhakoot===1?'family life and money plans tend to support each other':'family plans and money decisions need more discussion');
 (r.Nadi===1?strengths:watch).push(r.Nadi===1?'health and children are well supported':'health and children are traditionally the area to look at most carefully');
 (r.Tara>=.5?strengths:watch).push(r.Tara>=.5?'you tend to bring each other good fortune':'you may need to support each other more through difficult phases');
 return fill([`${esc(bn)} and ${esc(gn)} score ${R.total%1?R.total.toFixed(1):R.total} out of 36. ${R.total>=24?'That is a strong match by the classical method.':R.total>=18?'That passes the traditional threshold of 18, so the match is considered acceptable.':'That is below the traditional threshold of 18, which means astrologers would look very carefully at both full charts before advising.'}`,
  strengths.length?`The strengths of this pair: ${list(strengths)}.`:'',watch.length?`Areas to give more attention: ${list(watch)}.`:'',
  `${R.rj?`Both of you share the same rajju (${R.rajju[0]}). Sri Lankan astrologers usually treat this seriously and avoid it unless other factors cancel it.`:`Your rajjus are different (${R.rajju[0]} and ${R.rajju[1]}), which is what Sri Lankan astrologers look for.`} ${R.kg===R.kb?(R.kg?'Both charts carry Kuja dosha, so it balances out between you.':'Neither chart has Kuja dosha.'):`Only one chart has Kuja dosha, which an astrologer should check for cancellations before a final decision.`}`,
  `A score is a starting point, not a verdict. Many happy marriages have modest scores, and the way two people talk, share responsibilities and handle family pressure matters as much as any number.`],['Spend time talking about money, children, family roles and where you want to live; agreement on these is the best predictor of a calm marriage.',...HOUSE_LIFE[6].advice,...HOUSE_LIFE[6].good.slice(1,3)])}
