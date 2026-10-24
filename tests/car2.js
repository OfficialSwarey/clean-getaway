const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:700}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const out={};
// a fresh career with enough xp and cash to buy things
out.setup=await run(`const C=q.newCareer();C.xp=20000;C.cash=200000;q.CAREER=C;q.fillBoard();q.setMode("career");q.renderCareer();
  return {lvl:q.levelInfo(C.xp).level,pts:q.pointsFree(),board:C.board.map(c=>c.map+":"+c.tw.join("+")).join(" | ")};`);
// buy skills through the UI
await p.click('.cr-tabs button[data-tab="skills"]');await p.waitForTimeout(200);
for(const id of ["fingers","signal","drilltune","loop","coolhead","masterkey","softstep","shadow"]){await p.click(`[data-skill="${id}"]`).catch(()=>{});await p.waitForTimeout(80);}
await p.click('.cr-tabs button[data-tab="shop"]');await p.waitForTimeout(200);
for(const id of ["mag","jammer","coins"]){await p.click(`[data-buy="${id}"]`).catch(()=>{});await p.waitForTimeout(80);}
out.bought=await run(`return {skills:Object.keys(q.CAREER.skills).join(","),gear:Object.keys(q.CAREER.gear).join(","),cash:q.CAREER.cash,pts:q.pointsFree()};`);
await p.screenshot({path:'../car-skills2.png',timeout:180000});
// take a job with a forced twist set
out.take=await run(`const C=q.CAREER;C.board[0]={id:"t1",map:"harbor",tw:["tight","light"],pay:1.56,xp:1.44,stars:2,mins:6};q.saveCareer();q.takeContract("t1");
  return {mode:q.MODE,contract:!!q.G.contract,tw:Object.keys(q.G.tw).join(","),dead:q.G.deadline,jam:q.P.jammers,mag:q.P.mag,res:q.P.reserve,coins:q.G.coins,pick:q.SK.pick,kp:q.SK.kp,chip:document.getElementById("ctChip").textContent};`);
// win it: put a bag in the van and leave
out.win=await run(`q.setState("playing");away();q.P.masked=true;const bg=q.bags[0];bg.state="carried";bg.mesh.visible=false;q.P.carry=bg;q.G.vanTake=0;
  q.P.x=q.SECURE.x;q.P.z=q.SECURE.z;step(2);q.pressE();step(3);const sec=q.G.secured;q.keys.KeyE=true;step(80);q.keys.KeyE=false;
  return {sec,state:q.state,ec:document.getElementById("endCareer").innerText.replace(/\\n/g," | "),cash:q.CAREER.cash,xp:q.CAREER.xp,board:q.CAREER.board.length,menuBtn:document.getElementById("menuBtn").textContent,again:document.getElementById("againBtn").hidden};`);
await p.screenshot({path:'../car-end.png',timeout:180000});
// bust on the next one
out.bust=await run(`const C=q.CAREER;const cash0=C.cash;const c=C.board[1];q.takeContract(c.id);q.setState("playing");q.endGame(false,"A guard caught you.");
  return {cash0,cash:C.cash,busts:C.stats.busts,ec:document.getElementById("endCareer").innerText.replace(/\\n/g," | ")};`);
// free play: no skills, no twists
out.free=await run(`q.setMode("free");q.pickMap("harbor");q.resetGame();return {mode:q.MODE,contract:q.G.contract,pick:q.SK.pick,mag:q.P.mag,jam:q.P.jammers,coins:q.G.coins};`);
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
