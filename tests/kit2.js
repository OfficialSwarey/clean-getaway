// 0.34: save codes, the pistol / lockpicks / drill as stash items (drill carried in its bag), front takedowns, the cuff struggle, throwing bags.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:700}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));const arun=src=>p.evaluate(new Function("return (async()=>{"+H+src+"})()"));
const out={};
// ---- save codes
out.code=await arun(`localStorage.setItem("cg-best-harbor","123450");const C=q.newCareer();C.cash=77770;C.xp=9000;C.skills.signal=true;C.gear.mag=true;C.goals.workshop=true;C.stash={gun:1,pick:4};C.stats.jobs=11;q.CAREER=C;q.saveCareer();
  const code=await q.exportCode();const ok=await q.readCode(code);
  const flip=code.slice(0,20)+(code[20]==="A"?"B":"A")+code.slice(21);const bad=await q.readCode(flip);const junk=await q.readCode("CG1-hello-I-want-money");const cut=await q.readCode(code.slice(0,code.length-6));
  localStorage.removeItem("cg-best-harbor");q.CAREER=q.newCareer();q.importBundle(ok);
  return {len:code.length,prefix:code.slice(0,4),ok:!!ok,bad,junk,cut,after:{cash:q.CAREER.cash,xp:q.CAREER.xp,skills:Object.keys(q.CAREER.skills),gear:Object.keys(q.CAREER.gear),goals:Object.keys(q.CAREER.goals),stash:q.CAREER.stash,jobs:q.CAREER.stats.jobs,best:localStorage.getItem("cg-best-harbor")}};`);
// the same through the buttons
await run(`q.setMode("career");q.renderCareer();`);
await p.fill('#crName','Night Shift');await p.waitForTimeout(100);out.name={saved:await run(`return q.CAREER.name`),stamp:await p.evaluate(()=>document.getElementById('menuStamp').textContent)};
await p.click('#crExport');await p.waitForFunction(()=>/^CG1-/.test(document.getElementById('crCode').value));const code=await p.evaluate(()=>document.getElementById('crCode').value);
await run(`q.CAREER=q.newCareer();q.saveCareer();q.renderCareer();`);
await p.click('#crImport');await p.fill('#crCode','CG1-nonsense');await p.click('#crCheck');await p.waitForTimeout(300);
const badMsg=await p.evaluate(()=>document.getElementById('crSaveMsg').textContent);
await p.fill('#crCode',code);await p.click('#crCheck');await p.waitForSelector('#crReplace');const preview=await p.evaluate(()=>document.getElementById('crSaveMsg').textContent);
await p.click('#crReplace');await p.waitForTimeout(200);
out.codeUI={badMsg,preview,cash:await run(`return q.CAREER.cash`),panel:await p.evaluate(()=>document.getElementById('crSave').hidden)};
// ---- the plan: pistol, picks and the drill are counted
out.plan=await run(`const C=q.newCareer();C.cash=20000;q.CAREER=C;C.board[0]={id:"k1",map:"harbor",tw:[],pay:1,xp:1,stars:1,mins:6};q.fillBoard();q.setMode("career");q.openPlan("k1");
  const P=q.PLAN;return {sel:P.sel,cost:q.kitCost(P.sel,P.c),check:[...document.querySelectorAll('.plan-check li')].map(l=>l.className[0]+":"+l.querySelector('b').textContent).join(" | ")};`);
out.job=await run(`q.startPlan();q.setState("playing");away();q.P.masked=true;step(2);
  const r={gun:q.P.hasGun,picks:q.G.picksLeft,drills:q.DRILLS.length,chip:document.getElementById("kitChip").textContent};
  // the drill bag is next to the start: pick it up, walk it to the vault, set up
  const d=q.DRILLS[0];const sp=q.LV.def.spawn;r.dist=+Math.hypot(d.mesh.position.x-sp.x,d.mesh.position.z-sp.z).toFixed(2);
  go(q.VAULT.x,q.VAULT.z+1.2,0,0);step(2);r.vaultNoDrill=pr();
  go(d.mesh.position.x,d.mesh.position.z+1.0,0,0);q.P.pitch=-0.5;step(2);r.drillPr=pr();q.pressE();step(2);r.carry=q.P.carry&&q.P.carry.kind;r.carryChip=document.getElementById("carry").textContent;
  go(q.VAULT.x,q.VAULT.z+1.2,0,0);step(2);r.vaultPr=pr();q.pressE();step(2);r.drilling=q.G.drilling;r.carryAfter=!!q.P.carry;
  // pick the back door: one lockpick used
  const bd=q.doors.find(x=>x.name==="back door");go(bd.x+Math.sin(bd.rot)*1.2,bd.z+Math.cos(bd.rot)*1.2,0,bd.rot);step(2);q.keys.KeyE=true;for(let i=0;i<300&&bd.locked;i++)step(1);q.keys.KeyE=false;r.door=bd.locked;r.picksAfter=q.G.picksLeft;
  return r;`);
out.home=await run(`q.G.vanTake=0;q.P.x=q.SECURE.x;q.P.z=q.SECURE.z;step(2);q.keys.KeyE=true;step(80);q.keys.KeyE=false;return {state:q.state,stash:q.CAREER.stash,end:document.getElementById("endCareer").innerText.replace(/\\n/g," | ")};`);
// out of picks: the door won't give
out.nopicks=await run(`q.toMenu();const C=q.CAREER;C.board[0]={id:"k2",map:"harbor",tw:[],pay:1,xp:1,stars:1,mins:6};q.openPlan("k2");q.PLAN.sel={driver:true};q.startPlan();q.setState("playing");away();q.P.masked=true;step(2);
  const bd=q.doors.find(x=>x.name==="back door");go(bd.x+Math.sin(bd.rot)*1.2,bd.z+Math.cos(bd.rot)*1.2,0,bd.rot);step(2);q.keys.KeyE=true;step(200);q.keys.KeyE=false;return {locked:bd.locked,pr:pr(),gun:q.P.hasGun,drills:q.DRILLS.length};`);
// busted: the pistol and the drill are gone too
out.bust=await run(`q.toMenu();const C=q.CAREER;C.cash=20000;C.board[0]={id:"k3",map:"harbor",tw:[],pay:1,xp:1,stars:1,mins:6};q.openPlan("k3");q.startPlan();q.setState("playing");const before=JSON.stringify(q.CAREER.stash);q.endGame(false,"Caught.");return {before,after:q.CAREER.stash};`);
// ---- front takedown (free play)
const freeSetup=`q.toMenu();q.setMode("free");q.pickMap("harbor");q.resetGame();q.setState("playing");away();q.P.masked=true;go(0,22,0,0);step(2);
  const g=q.guards.find(g=>!g.security);g.down=false;g.x=0;g.z=20.6;g.route=[[0,20.6]];g.wait=99;g.yaw=0;g.face=0;step(2);`;
out.front=await run(freeSetup+`const r={};q.pressF();step(2);r.first={down:g.down,stagger:+g.stagger.toFixed(2),toast:toastT()};q.pressF();step(2);r.second={down:g.down};
  // missing the window: he recovers
  const g2=q.guards.filter(g=>!g.security)[1];g2.down=false;g2.x=0;g2.z=20.6;g2.route=[[0,20.6]];g2.wait=99;g2.yaw=0;g2.face=0;step(2);q.pressF();step(60);r.recovered={down:g2.down,stagger:+g2.stagger.toFixed(2)};
  return r;`);
// ---- the cuff struggle
out.struggleWin=await run(freeSetup+`q.triggerAlarm("test");g.chase=true;g.last={x:q.P.x,z:q.P.z};g.x=0;g.z=21.4;step(3);
  const r={struggle:!!q.P.struggle,pr:pr(),state:q.state};for(let i=0;i<6;i++){q.pressF();step(2);}r.after={down:g.down,struggle:!!q.P.struggle,state:q.state,toast:toastT()};return r;`);
out.struggleLose=await run(freeSetup+`q.triggerAlarm("test");g.chase=true;g.last={x:q.P.x,z:q.P.z};g.x=0;g.z=21.4;step(3);const r={struggle:!!q.P.struggle};q.pressF();step(2);q.pressF();step(110);r.after={state:q.state,reason:document.getElementById("endReason").textContent};return r;`);
out.struggleTwo=await run(freeSetup+`q.triggerAlarm("test");g.chase=true;g.last={x:q.P.x,z:q.P.z};g.x=0;g.z=21.4;step(3);const r={struggle:!!q.P.struggle};
  const g2=q.guards.filter(g=>!g.security)[1];g2.down=false;g2.chase=true;g2.last={x:q.P.x,z:q.P.z};g2.x=0.8;g2.z=22.2;step(10);r.after={state:q.state,reason:document.getElementById("endReason").textContent};return r;`);
// ---- throwing bags: cash goes further than gold; one lands in the van
out.throw=await run(`q.toMenu();q.setMode("free");q.pickMap("harbor");q.resetGame();q.setState("playing");away();q.P.masked=true;
  const t=(gold)=>{go(-20,5,0,0,0.25);const bg=q.bags[0];bg.gold=gold;bg.state="carried";bg.mesh.visible=false;q.P.carry=bg;q.throwCoin();step(90);return {d:+Math.hypot(bg.mesh.position.x-(-20),bg.mesh.position.z-5).toFixed(2),state:bg.state};};
  const cash=t(false),gold=t(true);q.bags[0].gold=false;
  // throw at the van from four metres away
  const v=q.SECURE;go(v.x+4,v.z,0,Math.PI/2,0.15);const bg=q.bags[1];bg.state="carried";bg.mesh.visible=false;q.P.carry=bg;const s0=q.G.secured;q.throwCoin();step(90);
  return {cash,gold,van:{state:bg.state,secured:q.G.secured-s0,take:q.G.vanTake}};`);
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
