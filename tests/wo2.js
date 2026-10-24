const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:640,height:360}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,4).join(' | ')));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const fresh=`q.setState("menu");q.pickMap("whiteout");q.resetGame();q.setState("playing");away();q.civs.forEach(c=>{if(c.state!=="asleep"){c.x=200;c.z=200;c.route=[[200,200]];}});const w=q.G.w,D=q.LV.def;w.windT=999;`;
const out={};
// 1. station door, walking out on the path (no prints), then across fresh snow (prints)
out.prints=await run(fresh+`go(-29,0,0,-Math.PI/2);const a=pr();q.pressE();step(10);walk(-Math.PI/2,40);const onPath=w.prints.length;const p1=at();
  go(-20,6,0,0);walk(Math.PI,60);return {door:a,onPath,afterPath:p1,snowPrints:w.prints.length,tip:toastT(),surf:D.surface(q.P.x,q.P.z,0)};`);
// 2. a guard who sees fresh prints follows them
out.track=await run(fresh+`go(-22,4,0,0);walk(Math.PI,90);const n=w.prints.length;const g=w.trackers.size;
  const h=q.guards.find(g=>g.name==="Halvorsen");h.x=-22;h.z=1;h.yaw=0;h.route=[[-22,1],[-22,1.1]];h.wp=0;q.LV.def.X.routes.set(h,[[-13,0],[-13,12]]);
  go(-30,-20,0,0);step(10);const tr=w.trackers.has(h);const toast=toastT();step(200);const mid={x:+h.x.toFixed(1),z:+h.z.toFixed(1)};step(900);
  return {prints:n,tracking:tr,toast,mid,after:{x:+h.x.toFixed(1),z:+h.z.toFixed(1),tracking:w.trackers.has(h)},route0:h.route[0]};`);
// 3. gusts: vision drops outside, prints fade faster
out.gust=await run(fresh+`go(-20,6,0,0);const before=D.visMul(0,0,0);w.windT=0;step(90);const k=w.k;const vm=D.visMul(-20,10,0);const fog=q.scene.fog.density;const chip=D.chip();
  go(-5,4,0,0);const inside=D.visMul(-4,4,0);return {before,k:+k.toFixed(2),vm:+vm.toFixed(2),fog:+fog.toFixed(3),chip,insideBoth:inside,tip:toastT()};`);
// 4. lasers: walk into a lane standing while beams are on; crouch under high; off
out.lasers=await run(fresh+`const L=D.X.lanes[0];const res={};
  const cross=(stance)=>{q.resetGame();q.setState("playing");away();const w=q.G.w;w.windT=999;
     let t=0;for(;t<300;t++){step(1);if(D.X.lanes[0].state===stance)break;}
     go(3.5,3,0,-Math.PI/2);q.P.crouch=stance==="high";q.P.eye=stance==="high"?1.05:1.65;q.keys.KeyW=true;for(let i=0;i<14;i++){step(1);if(q.G.alarm)break;}q.keys.KeyW=false;
     return {state:D.X.lanes[0].state,x:+q.P.x.toFixed(2),alarm:q.G.alarm};};
  res.standFull=cross("full");res.standLow=cross("low");res.crouchHigh=cross("high");res.standOff=cross("off");
  q.resetGame();q.setState("playing");away();q.G.w.lasersOff=true;step(2);go(3.5,3,0,-Math.PI/2);walk(-Math.PI/2,60);res.offAll={x:+q.P.x.toFixed(2),alarm:q.G.alarm};
  return res;`);
// 5. the puzzle: poster, log, keypad, meteorite
out.puzzle=await run(fresh+`q.P.masked=true;go(-5,-0.4,0,0);const a=pr();q.pressE();step(2);const poster=w.poster;
  go(-5.3,-8.0,1,0);const b=pr();q.pressE();step(2);const log=w.log;const target=w.target;
  w.lasersOff=true;go(9.6,3,0,-Math.PI/2);const c=pr();q.pressE();step(2);const kp=q.G.keypad;
  for(const d of q.G.safeCode)digit(d);return {a,poster,b,log,c,kp,code:q.G.safeCode,chip:D.chip()};`);
await p.waitForTimeout(6000);
out.puzzle2=await run(`const w=q.G.w;step(30);const open=q.G.vaultOpen;const a=pr();go(9.6,3,0,-Math.PI/2);step(20);const b=pr();q.pressE();step(2);return {open,a,b,has:q.G.hasDiamond,val:q.G.diamondVal,obj:document.getElementById("objText").textContent.slice(0,90)};`);
// 6. keycard, the store, the bags; the director's safe
out.store=await run(fresh+`q.P.masked=true;q.P.hasCard=true;go(11.7,-3.0,0,0);const a=pr();q.pressE();step(30);const d=q.doors.find(d=>d.name==="collection store door");
  go(9,-8.0,0,0);const b=pr();q.pressE();step(2);const carry=!!q.P.carry;
  q.P.carry=null;go(-7.2,6.4,1,Math.PI);const s1=pr();q.keys.KeyE=true;step(330);q.keys.KeyE=false;step(40);const open=D.X.dsafe.open;const bag=q.bags.find(b=>b.box==="dsafe").state;
  return {a,open:d.open,b,carry,s1,safeOpen:open,bag};`);
// 7. the relay: pull it, radios dead, someone comes to fix it
out.relay=await run(fresh+`q.P.masked=true;const h=q.guards.find(g=>g.name==="Halvorsen");q.resetGame();q.setState("playing");q.P.masked=true;const w2=q.G.w;w2.windT=999;
  q.doors.find(d=>d.name==="radio hut door").locked=false;go(30,17,0,-Math.PI/2);const a=pr();q.keys.KeyE=true;step(200);q.keys.KeyE=false;step(2);
  const down=w2.relayDown;const jam=typeof jamming==="function";go(-30,-25,0,0);
  step(1300);const fixer=w2.fixer?w2.fixer.name:null;const dispatched=toastT();step(3000);
  return {a,down,fixer,dispatched,stillDown:w2.relayDown,fixerAt:w2.fixer?[+w2.fixer.x.toFixed(1),+w2.fixer.z.toFixed(1)]:null,toast:toastT(),alarm:q.G.alarm};`);
// 8. getaways: the cable car and the snowcat
out.leave=await run(fresh+`q.P.masked=true;q.G.hasDiamond=true;q.G.diamondVal=320000;const bg=q.bags[0];bg.state="carried";bg.mesh.visible=false;q.P.carry=bg;
  go(-36.4,0,0,Math.PI/2);const a=pr();q.pressE();step(3);const sec=q.G.secured;step(5);const b=pr();
  w.catKey=true;go(28,-18.4,0,0);const c=pr();go(-36.4,0,0,Math.PI/2);q.keys.KeyE=true;step(80);q.keys.KeyE=false;return {a,sec,b,c,state:q.state,score:document.getElementById("endScore")?document.getElementById("endScore").textContent:""};`);
// 9. ladder to the balcony
out.ladder=await run(fresh+`go(11,-12.6,0,Math.PI);const a=pr();q.pressE();step(2);q.keys.KeyW=true;step(120);q.keys.KeyW=false;step(40);const top=at();
  go(11,-10.5,1,0);const b=pr();return {a,top,b};`);
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
