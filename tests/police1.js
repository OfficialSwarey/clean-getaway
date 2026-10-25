// 0.36: when the alarm runs out the police arrive in waves and shoot; the driver leaves with the van (that money is safe); you get out on foot.
const {chromium}=require('playwright-core');
const PAGE=process.argv[2]||'test.html';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:960,height:560}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/'+PAGE);await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const out={};
const setup=`q.setMode("free");q.pickMap("harbor");q.resetGame();q.setState("playing");q.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.x=200;g.z=200;});q.P.masked=true;
  // walk a trail: in through the front door, to the lobby
  const sp=q.LV.def.spawn;for(let z=sp.z;z>6;z-=0.3){q.G.trail.push({x:1,z,l:0});}go(1,6,0,0);
  // a bag in the van first
  q.G.vanTake=40000;q.G.secured=1;`;
out.arrive=await run(setup+`q.triggerAlarm("test");q.G.alarmT=0.05;step(3);
  const r={police:!!q.G.police,banked:q.G.banked,onFoot:q.onFoot(),vanHidden:q.VAN_PARTS.every(o=>!o.visible),toast:toastT(),clock:document.getElementById("clockLbl").textContent};
  step(100);r.cops=q.COPS.length;r.wave=q.G.police.wave;r.clockVal=document.getElementById("clockVal").textContent;
  const d0=Math.min(...q.COPS.map(c=>Math.hypot(c.x-q.P.x,c.z-q.P.z)));step(300);const d1=Math.min(...q.COPS.map(c=>Math.hypot(c.x-q.P.x,c.z-q.P.z)));
  r.closing=[+d0.toFixed(1),+d1.toFixed(1)];r.hp=Math.round(q.P.hp);r.hpChip=document.getElementById("hpChip").textContent;r.state=q.state;return r;`);
// shoot an officer: three body hits
out.shootCop=await run(setup+`q.triggerAlarm("t");q.G.alarmT=0.05;step(3);step(100);const c=q.COPS[0];c.x=q.P.x;c.z=q.P.z-4;c.level=0;c.fireT=99;q.P.yaw=0;q.P.pitch=-0.12;q.P.raise=1;q.P.mag=12;step(2);
  const hits=[];for(let i=0;i<5&&!c.down;i++){c.x=q.P.x;c.z=q.P.z-4;c.fireT=99;q.P.fireCD=0;q.shoot();step(12);hits.push(c.hp);}return {hits,down:c.down,copsDown:q.G.copsDown};`);
// escape on foot: the van's bag plus the one in your hands
out.escape=await run(setup+`q.triggerAlarm("t");q.G.alarmT=0.05;step(3);const bg=q.bags[1];q.setBagged(bg,true);bg.state="carried";q.P.carry=bg;go(sp.x,sp.z,0,0);step(2);const pr0=pr();
  q.keys.KeyE=true;step(70);q.keys.KeyE=false;return {pr0,state:q.state,title:document.getElementById("endTitle").textContent,take:document.getElementById("endTakeVal").textContent,reason:document.getElementById("endReason").textContent};`);
// shot down: busted, but the van's money is still yours (career)
out.downCareer=await run(`const C=q.newCareer();C.cash=10000;q.CAREER=C;C.board[0]={id:"p1",map:"harbor",tw:[],pay:1,xp:1,stars:1,mins:6};q.fillBoard();q.setMode("career");q.openPlan("p1");q.PLAN.sel={driver:true,duffel:2};q.startPlan();q.setState("playing");
  q.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.x=200;g.z=200;});q.P.masked=true;q.G.vanTake=40000;q.G.secured=1;q.triggerAlarm("t");q.G.alarmT=0.05;step(3);
  const cash0=C.cash;for(let i=0;i<12&&q.state==="playing";i++)q.hurtPlayer(12);
  return {state:q.state,reason:document.getElementById("endReason").textContent,lbl:document.getElementById("endTakeLbl").textContent,career:document.getElementById("endCareer").innerText.replace(/\\n/g," | "),cash0,cash:C.cash};`);
await run(setup+`q.triggerAlarm("t");q.G.alarmT=0.05;step(3);step(140);const c=q.COPS[0];go(c.x,c.z+5,c.level,0,0.05);q.hurtPlayer(30);step(2);`);await p.waitForTimeout(500);await p.screenshot({path:'../police.png'});
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
