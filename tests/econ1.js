// Career economy (0.33): the plan screen, the kit you bring, what it allows on the job, pay, a bust, old saves, free play untouched.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:700}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const out={};
// a fresh career, Quiet Hours on the board
out.fresh=await run(`localStorage.removeItem("cg-career-v1");const C=q.newCareer();q.CAREER=C;C.board[0]={id:"e1",map:"harbor",tw:[],pay:1,xp:1,stars:1,mins:6};q.fillBoard();q.setMode("career");q.crTab="jobs";q.renderCareer();
  return {cash:C.cash,btn:document.querySelector('[data-take="e1"]').textContent,upTo:document.querySelector('.offer .offer-pay').textContent};`);
await p.click('[data-take="e1"]');await p.waitForTimeout(300);
out.plan=await run(`const P=q.PLAN;return {sel:P.sel,cost:q.kitCost(P.sel,P.c),check:[...document.querySelectorAll('.plan-check li')].map(l=>l.className+":"+l.querySelector('b').textContent),intel:document.querySelector('.plan-intel').innerText.replace(/\\n/g," "),go:document.getElementById('planGo').textContent};`);
await p.screenshot({path:'../econ-plan.png'});
// nothing at all: a hands-only job
await p.click('#planClear');await p.waitForTimeout(100);
out.nothing=await run(`return {cost:q.kitCost(q.PLAN.sel,q.PLAN.c),check:[...document.querySelectorAll('.plan-check li.miss')].length};`);
await p.click('#planGo');await p.waitForTimeout(300);
out.bare=await run(`q.setState("playing");away();q.P.masked=true;step(2);
  const r={state:q.state,gun:q.P.hasGun,mag:q.P.mag,res:q.P.reserve,ties:q.P.ties,jam:q.P.jammers,coins:q.G.coins,duffels:q.G.duffels,ammo:document.getElementById("ammo").textContent,kit:document.getElementById("kitChip").textContent};
  // the back door: no picks
  const d=q.doors.find(d=>d.name==="back door");go(d.x+Math.sin(d.rot)*1.2,d.z+Math.cos(d.rot)*1.2,0,d.rot);step(2);r.doorPr0=pr();
  q.keys.KeyE=true;step(200);q.keys.KeyE=false;r.door={locked:d.locked,pr:pr()};
  // the vault: no drill
  go(q.VAULT.x,q.VAULT.z+1.2,0,0);step(2);r.drill=pr();
  // a loot bag: no duffel
  const sp=q.LV.def.spawn;go(sp.x,sp.z,0,0);const bg=q.bags[0];bg.state="ground";bg.box=null;bg.level=0;bg.mesh.position.set(q.P.x,0.22,q.P.z-1.0);q.P.pitch=-0.4;step(2);r.loot=pr();q.pressE();step(2);r.carry=!!q.P.carry;
  // shooting without a gun
  q.shoot();r.shootToast=document.getElementById("toast").textContent;
  return r;`);
// walk away: the job stays on the board, nothing was brought
out.abandon=await run(`q.toMenu();return {kit:q.CAREER.kit,active:q.CAREER.active,board:q.CAREER.board.some(c=>c.id==="e1"),stash:q.CAREER.stash};`);
// rich enough for the full plan this time
await run(`q.CAREER.cash=50000;q.openPlan("e1");`);await p.waitForTimeout(200);
out.full=await run(`const P=q.PLAN;return {sel:P.sel,cost:q.kitCost(P.sel,P.c),miss:document.querySelectorAll('.plan-check li.miss').length};`);
await p.click('#planGo');await p.waitForTimeout(300);
out.kitted=await run(`q.setState("playing");away();q.P.masked=true;step(2);
  const r={cash:q.CAREER.cash,gun:q.P.hasGun,mag:q.P.mag,res:q.P.reserve,ties:q.P.ties,jam:q.P.jammers,coins:q.G.coins,duffels:q.G.duffels,body:q.G.bodyBags,drill:q.G.kit.drill,picks:q.G.kit.picks,driver:q.G.kit.driver};
  const d=q.doors.find(d=>d.name==="back door");go(d.x+Math.sin(d.rot)*1.2,d.z+Math.cos(d.rot)*1.2,0,d.rot);step(2);r.doorPr0=pr();
  q.keys.KeyE=true;step(260);q.keys.KeyE=false;r.door=d.locked;
  go(q.VAULT.x,q.VAULT.z+1.2,0,0);step(2);r.drillPr=pr();
  // throw a coin and drop a jammer: they come off the kit
  q.throwCoin();step(2);r.coinsLeft=q.G.coins;
  // a bag into the van, then leave
  const sp=q.LV.def.spawn;go(sp.x,sp.z,0,0);const bg=q.bags[0];bg.state="ground";bg.box=null;bg.level=0;bg.mesh.position.set(q.P.x,0.22,q.P.z-1.0);q.P.pitch=-0.4;step(2);q.pressE();step(2);r.carry=!!q.P.carry;r.duffelsLeft=q.G.duffels;
  q.P.x=q.SECURE.x;q.P.z=q.SECURE.z;step(2);q.pressE();step(3);r.secured=q.G.secured;
  q.keys.KeyE=true;step(80);q.keys.KeyE=false;
  r.state=q.state;r.end=document.getElementById("endCareer").innerText.replace(/\\n/g," | ");r.cashAfter=q.CAREER.cash;r.stash=q.CAREER.stash;r.kit=q.CAREER.kit;
  return r;`);
await p.screenshot({path:'../econ-end.png'});
// on foot: one bag only
out.foot=await run(`q.toMenu();const C=q.CAREER;C.board[0]={id:"e2",map:"harbor",tw:[],pay:1,xp:1,stars:1,mins:6};q.openPlan("e2");q.PLAN.sel.driver=false;q.startPlan();
  q.setState("playing");away();q.P.masked=true;step(2);
  const load=i=>{const bg=q.bags[i];bg.state="carried";bg.duffel=true;q.P.carry=bg;q.P.x=q.SECURE.x;q.P.z=q.SECURE.z;step(2);const t=pr();q.pressE();step(3);return t;};
  const a=load(0);q.keys.KeyE=false;step(2);const bpr=load(1);
  const r={first:a,second:bpr,secured:q.G.secured,chip:document.getElementById("kitChip").textContent};
  q.dropCarry();step(2);q.bags[1].mesh.position.set(300,0,300);q.P.x=q.SECURE.x;q.P.z=q.SECURE.z;step(2);r.leave=pr();return r;`);
// busted: the kit is gone, lawyers take 15%
out.bust=await run(`const C=q.CAREER;const st0=JSON.stringify(C.stash);const k0=JSON.stringify(C.kit);const cash0=C.cash;q.endGame(false,"Caught.");
  return {k0,st0,stash:C.stash,kit:C.kit,fee:cash0-C.cash,cash0,end:document.getElementById("endCareer").innerText.replace(/\\n/g," | ")};`);
// shop: level locks and goals
out.shop=await run(`q.toMenu();q.CAREER.cash=999999;q.crTab="shop";q.renderCareer();return {locked:[...document.querySelectorAll('#crShop .item.lockd h3')].map(h=>h.textContent),buy:[...document.querySelectorAll('#crShop [data-buy]')].map(b=>b.dataset.buy)};`);
await p.screenshot({path:'../econ-shop.png',fullPage:true});
// an old save: free-item gear becomes stash, cash untouched
out.old=await run(`localStorage.setItem("cg-career-v1",JSON.stringify({v:1,cash:432100,xp:5000,skills:{signal:true},gear:{jammer:true,bandolier:true,coins:true,bit:true,picks:true},board:[],active:null,stats:{jobs:3,clean:1,busts:0,earned:500000,best:200000}}));
  q.loadCareer();const C=q.CAREER;return {cash:C.cash,gear:C.gear,stash:C.stash,econ:C.econ,goals:C.goals,board:C.board.length};`);
// big goals: what they change
out.goals=await run(`const C=q.newCareer();q.CAREER=C;C.xp=99999999;C.cash=2000000;q.fillBoard();q.setMode("career");q.crTab="shop";q.renderCareer();
  const c={id:"g1",map:"tower",tw:[],pay:1,xp:1,stars:3,mins:13};C.board[0]=c;const K=n=>q.KIT.find(k=>k.id===n);
  const before={driver:q.kitCost({driver:true},c),jam:q.kitCost({jammer:1},c),cut:q.fullCut(c)};
  for(const b of [...document.querySelectorAll('#crShop [data-buy^="goal:"]')])b.click();
  const after={driver:q.kitCost({driver:true},c),jam:q.kitCost({jammer:1},c),cut:q.fullCut(c),goals:Object.keys(C.goals),stamp:document.getElementById("menuStamp").textContent,cash:C.cash};
  return {before,after};`);
// free play: the old free kit
out.free=await run(`q.setMode("free");q.pickMap("harbor");q.resetGame();return {mode:q.MODE,kit:q.G.kit,gun:q.P.hasGun,mag:q.P.mag,res:q.P.reserve,jam:q.P.jammers,coins:q.G.coins,ties:q.P.ties};`);
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
