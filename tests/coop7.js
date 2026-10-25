// Co-op part 7: the crew career. A new crew, both players join it, the guest's shop and skills run on the host,
// the host plans a job and each brings their own kit from the shared cash, the job pays the crew and gives each
// their experience, the save is on both devices; then the roles swap and the crew is recognised, and a player
// on a "new device" claims their slot by name.
const {setup,wait}=require('./coopH');
(async()=>{
const {H,G,errs,close,T,ctx,url}=await setup('harbor',null,{noStart:true});
const out={};
const click=async(pg,sel)=>{await pg.waitForFunction(s=>!!document.querySelector(s),sel,{timeout:T}).catch(()=>{console.log('missing',sel));return pg.evaluate(s=>{const e=document.querySelector(s);if(!e)return false;e.click();return true;},sel);};
process.on('unhandledRejection',e=>{console.log('FAILED',e.message.split('\n')[0]);console.log(JSON.stringify(out,null,1));console.log(errs.join('\n'));process.exit(1);});
const hostWait=async s=>{const t0=await H.evaluate(()=>__qh.G.time);await H.waitForFunction(([t,s])=>__qh.G.time>t+s,[t0,s],{timeout:T}).catch(()=>{});};
await H.waitForFunction(()=>__qh.NET.remote&&__qh.NET.remote.pid,null,{timeout:T}).catch(()=>{});
out.pids={host:await H.evaluate(()=>__qh.myPid()),guest:await G.evaluate(()=>__qh.myPid()),hostKnowsGuest:await H.evaluate(()=>__qh.NET.remote.pid)};
// the host starts a new crew and joins it as Alice; the guest joins as Bob
await click(H,'[data-cm="crew"]');await wait(300);await click(H,'#crewNew');
await H.waitForFunction(()=>!!__qh.CREW,null,{timeout:T});
await H.waitForFunction(()=>!!document.getElementById('crewJoin'),null,{timeout:T});await H.evaluate(()=>{document.getElementById('crewMe').value='Alice';document.getElementById('crewJoin').click();});
await G.waitForFunction(()=>!!__qh.CREW&&!!document.getElementById('crewMe'),null,{timeout:T});
await G.evaluate(()=>{document.getElementById('crewMe').value='Bob';document.getElementById('crewJoin').click();});
await H.waitForFunction(()=>Object.keys(__qh.CREW.slots).length===2,null,{timeout:T}).catch(()=>{});
await G.waitForFunction(()=>__qh.CREW&&Object.keys(__qh.CREW.slots).length===2,null,{timeout:T}).catch(()=>{});
out.joined={host:await H.evaluate(()=>({slots:Object.values(__qh.CREW.slots).map(s=>s.name),panel:document.querySelector('.card.menu').dataset.crew,board:__qh.CREW.board.length})),
  guest:await G.evaluate(()=>({slots:Object.values(__qh.CREW.slots).map(s=>s.name),panel:document.querySelector('.card.menu').dataset.crew,careerShown:getComputedStyle(document.getElementById('careerPanel')).display,stamp:document.getElementById('menuStamp').textContent}))};
// cash and experience for testing; the guest buys gear and learns a skill from their own screen
const gp=out.pids.guest,hp=out.pids.host;
await H.evaluate(gp=>{const C=__qh.CREW;C.cash=60000;C.slots[gp].xp=6000;__qh.crewSave();__qh.renderCareer();},gp);
await G.waitForFunction(()=>__qh.CREW.cash===60000,null,{timeout:T}).catch(()=>{});
await G.evaluate(()=>{__qh.crAct("buy","gear","mag");__qh.crAct("learn","softstep");});
await H.waitForFunction(gp=>__qh.CREW.slots[gp].skills.softstep&&__qh.CREW.slots[gp].gear.mag,gp,{timeout:T}).catch(()=>{});
await wait(500);
out.shop={host:await H.evaluate(([gp,hp])=>({cash:__qh.CREW.cash,guestGear:__qh.CREW.slots[gp].gear,guestSkills:__qh.CREW.slots[gp].skills,hostGear:__qh.CREW.slots[hp].gear,hostSkills:__qh.CREW.slots[hp].skills}),[gp,hp]),
  guest:await G.evaluate(()=>({cash:__qh.CREW.cash,myGear:__qh.CAREER.gear,mySkills:__qh.CAREER.skills,level:__qh.levelInfo(__qh.CAREER.xp).level}))};
// a short job on the board; the host plans it, the guest's plan opens and the guest picks a kit
await H.evaluate(()=>{const C=__qh.CREW;C.board[0].map="harbor";C.board[0].tw=[];C.board[0].pay=1;C.board[0].xp=1;__qh.crewSave();});
await G.waitForFunction(()=>__qh.CREW.board[0].map==="harbor",null,{timeout:T}).catch(()=>{});
await H.evaluate(()=>{__qh.openPlan(__qh.CREW.board[0].id);});
await G.waitForFunction(()=>!!__qh.PLAN,null,{timeout:T}).catch(()=>{});
await G.evaluate(()=>{const s=__qh.PLAN.sel;s.duffel=3;s.tie=2;s.gun=1;s.mag=1;s.pick=2;__qh.renderCareer();});
await H.waitForFunction(()=>__qh.PLAN&&__qh.PLAN.partnerSel&&__qh.PLAN.partnerSel.duffel===3,null,{timeout:T}).catch(()=>{});
await H.evaluate(()=>{const s=__qh.PLAN.sel;s.driver=true;s.duffel=1;s.gun=0;s.mag=0;s.tie=0;s.pick=1;__qh.renderCareer();});
await wait(600);
out.plan={host:await H.evaluate(()=>({btn:document.getElementById('planGo').textContent,dis:document.getElementById('planGo').disabled,foot:document.querySelector('.plan-total').textContent})),
  guest:await G.evaluate(()=>({btn:document.getElementById('planGo').textContent,driverRow:[...document.querySelectorAll('.kit-row')][0].textContent.slice(-25),foot:document.querySelector('.plan-total').textContent}))};
const cash0=await H.evaluate(()=>__qh.CREW.cash);
await H.evaluate(()=>__qh.startPlan());
await G.waitForFunction(()=>__qh.state==='paused'&&document.getElementById('resumeBtn').textContent==='Join the job',null,{timeout:T}).catch(()=>{});
await G.evaluate(()=>document.getElementById('resumeBtn').click());
await H.waitForFunction(()=>__qh.state==='playing'&&__qh.PLAYERS[1].ready,null,{timeout:T}).catch(()=>{});
await wait(800);
out.job={host:await H.evaluate(()=>{const q=__qh,g=q.PLAYERS[1];return {contract:!!q.G.contract,mode:q.MODE,cashPaid:null,myDuffels:q.G.duffels,myGun:q.P.hasGun,guestDuffels:g.g.duffels,guestTies:g.P.ties,guestGun:g.P.hasGun,guestMag:g.P.mag,guestCrouchSK:g.SK.crouch,mySK:q.SK.crouch,driver:!q.onFoot(),objsH:q.SYNC.objs.length};}),
  guest:await G.evaluate(()=>({mode:__qh.MODE,sk:__qh.SK.crouch,objs:__qh.SYNC.objs.length})),cashBefore:cash0,cashNow:await H.evaluate(()=>__qh.CREW.cash)};
// the guest uses a duffel on the job (their own count), then the crew gets away
await H.evaluate(()=>{const q=__qh;q.withPlayer(q.PLAYERS[1],"sim",()=>{q.G.duffels--;});q.G.vanTake=20000;q.G.secured=1;});
const xp0=await H.evaluate(()=>Object.fromEntries(Object.entries(__qh.CREW.slots).map(([k,s])=>[k,s.xp])));
const cashPre=await H.evaluate(()=>__qh.CREW.cash);
await H.evaluate(()=>__qh.endGame(true));
await G.waitForFunction(()=>__qh.state==='ended',null,{timeout:T}).catch(()=>{});await wait(800);
out.end={host:await H.evaluate(([xp0,cashPre])=>{const C=__qh.CREW;return {cashGain:C.cash-cashPre,xpGain:Object.fromEntries(Object.entries(C.slots).map(([k,s])=>[s.name,s.xp-xp0[k]])),stash:Object.fromEntries(Object.entries(C.slots).map(([k,s])=>[s.name,s.stash])),kits:Object.values(C.slots).map(s=>s.kit),active:C.active,report:document.getElementById('endCareer').textContent.slice(0,90)};},[xp0,cashPre]),
  guest:await G.evaluate(()=>({report:document.getElementById('endCareer').hidden?null:document.getElementById('endCareer').textContent.slice(0,120),cash:__qh.CREW.cash}))};
// both devices keep the crew
out.saved={host:await H.evaluate(()=>{const c=JSON.parse(localStorage.getItem('cg-crews-v1'));return Object.values(c.crews).map(x=>[x.cash,Object.keys(x.slots).length,x.at]);}),guest:await G.evaluate(()=>{const c=JSON.parse(localStorage.getItem('cg-crews-v1'));return Object.values(c.crews).map(x=>[x.cash,Object.keys(x.slots).length,x.at]);})};
// back to the lobby; then swap: the guest hosts, the host joins from a "new device" (a new player ID)
await H.evaluate(()=>document.getElementById('menuBtn').click());await G.evaluate(()=>document.getElementById('menuBtn').click());await wait(500);
await H.evaluate(()=>document.getElementById('coopLeaveBtn').click());await G.evaluate(()=>document.getElementById('coopLeaveBtn').click());await wait(800);
out.left={host:await H.evaluate(()=>({crew:!!__qh.CREW,mode:__qh.MODE,career:!!__qh.CAREER&&!__qh.CAREER.crew}))};
await H.evaluate(()=>localStorage.setItem('cg-player-id','newdevice123'));
await G.evaluate(()=>document.getElementById('coopHostBtn').click());
await G.waitForFunction(()=>!!document.querySelector('#coopCodeShow:not([hidden]) b'),null,{timeout:T});
const code2=await G.evaluate(()=>document.querySelector('#coopCodeShow b').textContent);
await H.fill('#coopCode',code2);await H.evaluate(()=>document.getElementById('coopJoinBtn').click());
await G.waitForFunction(()=>__qh.NET.on&&__qh.PLAYERS.length===2&&__qh.NET.remote.pid,null,{timeout:T});
await click(G,'[data-cm="crew"]');await wait(300);
const cid=await G.evaluate(()=>__qh.crewList()[0].id);
await G.evaluate(id=>document.querySelector(`[data-crew="${id}"]`).click(),cid);
await H.waitForFunction(()=>!!__qh.CREW&&!!document.querySelector('[data-claim]'),null,{timeout:T}).catch(()=>{});
out.swap={guestNowHost:await G.evaluate(()=>({mySlot:!!__qh.CREW.slots[__qh.myPid()],name:__qh.CREW.slots[__qh.myPid()]&&__qh.CREW.slots[__qh.myPid()].name,panel:document.querySelector('.card.menu').dataset.crew})),
  newDevice:await H.evaluate(()=>({claims:[...document.querySelectorAll('[data-claim]')].map(b=>b.textContent)}))};
await H.evaluate(()=>document.querySelector('[data-claim]').click());
await G.waitForFunction(()=>!!__qh.CREW.slots['newdevice123'],null,{timeout:T}).catch(()=>{});await wait(600);
out.claimed={host:await G.evaluate(()=>Object.entries(__qh.CREW.slots).map(([k,s])=>[k===__qh.myPid()?"me":k,s.name,s.xp])),joiner:await H.evaluate(()=>({panel:document.querySelector('.card.menu').dataset.crew,name:__qh.CAREER.crew&&__qh.CREW.slots[__qh.myPid()].name,gear:__qh.CAREER.gear}))};
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await close();})();
