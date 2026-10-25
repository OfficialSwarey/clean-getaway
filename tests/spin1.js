// Spin Cycle (Suds & Spin): the pick-up ticket, loaded and empty dryers, the office safe, the ways in, and the patrols.
const {chromium}=require('playwright-core');
const PAGE=process.argv[2]||'test.html';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:900,height:520}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/'+PAGE);await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const out={};
const setup=`q.setMode("free");q.pickMap("spin");q.resetGame();q.setState("playing");away();q.civs.forEach(c=>{c.x=300;c.z=300;c.route=[[300,300]];});q.P.masked=true;`;
// the ticket
out.ticket=await run(setup+`const T=q.LV.def.X.ticket,sp=T.spot;const nx=Math.sin(sp[3]),nz=Math.cos(sp[3]);go(sp[0]+nx*1.0,sp[2]+nz*1.0,0,sp[3]);step(2);
  const r={pr:pr()};q.pressE();step(2);r.read=q.G.lf.ticket;r.toast=toastT();r.chip=document.getElementById("codeChip").textContent;return r;`);
// open a loaded dryer and an empty one
out.dryers=await run(setup+`const L=q.G.lf,Z=q.LV.def.DRYER_Z;const empty=[0,1,2,3,4].find(i=>!L.loaded.includes(i));
  go(-8.1,Z[L.loaded[0]],0,Math.PI/2);step(2);const r={pr:pr()};q.pressE();step(20);r.loaded=q.bags.filter(b=>b.dryer===L.loaded[0]).map(b=>b.state);r.toast=toastT();
  r.door=+q.LV.def.X.dryers[L.loaded[0]].piv.rotation.y.toFixed(2);
  // bag the cash straight out of the drum
  q.P.pitch=-0.3;step(2);r.bagPr=pr();q.keys.KeyE=true;step(70);q.keys.KeyE=false;step(2);r.carry=!!q.P.carry;q.dropCarry();step(2);
  const g=q.guards.find(g=>g.name==="Rocco");g.route=[[-3,Z[empty]],[-3,Z[empty]+0.01]];g.wp=0;g.x=-3;g.z=Z[empty];g.yaw=Math.PI/2;g.face=Math.PI/2;g.sus=0;g.heard=null;
  go(-8.1,Z[empty],0,Math.PI/2);q.P.masked=false;step(2);q.pressE();step(4);r.empty={toast:toastT(),heard:!!g.heard||g.sus>0||!!g.invest};return r;`);
// the safe with its code
out.safe=await run(setup+`go(8.5,-6.6,0,0);step(2);const r={pr:pr()};q.G.knowCode=true;step(1);q.pressE();step(2);
  for(const d of q.G.safeCode)q.keypadDigit(d);q.keypadEnter();return r;`);
for(let i=0;i<20&&!(await p.evaluate(()=>__qh.G.vaultOpen));i++)await p.waitForTimeout(500);
Object.assign(out.safe,await run(`step(30);return {open:q.G.vaultOpen,bag:q.bags.find(b=>b.box==="vault").state};`));
// the ways in: back door and office door are pickable, the office window opens
out.entries=await run(setup+`const r={};for(const n of ["back door","office door"]){const d=q.doors.find(x=>x.name===n);for(const s of [1,-1]){go(d.x+Math.sin(d.rot)*1.2*s,d.z+Math.cos(d.rot)*1.2*s,0,s>0?d.rot:d.rot+Math.PI);step(2);if(/pick/.test(pr()))break;}
    q.keys.KeyE=true;for(let i=0;i<300&&d.locked;i++)step(1);q.keys.KeyE=false;r[n]=!d.locked;}
  const w=q.windows.find(w=>/office/.test(w.name||""))||q.windows[q.windows.length-1];r.window=!!w;go(11.3,-5,0,Math.PI/2);step(2);r.winPr=pr();return r;`);
// the patrols keep moving for a minute and stay inside the map
out.patrols=await run(`q.setMode("free");q.pickMap("spin");q.resetGame();q.setState("playing");q.P.masked=false;go(3,15,0,0);
  const s0=q.guards.map(g=>[g.x,g.z]);let moved=q.guards.map(()=>0);for(let i=0;i<60;i++){step(30);q.guards.forEach((g,k)=>{moved[k]+=Math.hypot(g.x-s0[k][0],g.z-s0[k][1]);});}
  return q.guards.map((g,k)=>({name:g.name,moved:+moved[k].toFixed(0),at:[+g.x.toFixed(1),+g.z.toFixed(1)],ok:Number.isFinite(g.x)&&Math.abs(g.x)<20&&Math.abs(g.z)<20}));`);
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
