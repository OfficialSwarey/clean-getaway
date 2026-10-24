const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.evaluate(()=>{__qh.setState("menu");__qh.pickMap("casino");__qh.resetGame();__qh.setState("playing");});
  const H=`const q=__qh;const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
    const go=(x,z,lvl,yaw,pitch)=>{q.P.x=x;q.P.z=z;q.P.level=lvl;q.P.jh=0;q.P.y=lvl*4;q.P.vy=0;q.P.yaw=yaw;q.P.pitch=pitch||0;step(1);};
    const walk=(yaw,secs)=>{q.P.yaw=yaw;q.keys.KeyW=true;step(Math.round(secs*30));q.keys.KeyW=false;step(2);};
    const at=()=>({x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),lvl:q.P.level});
    const hold=s=>{q.keys.KeyE=true;step(Math.round(s*30));q.keys.KeyE=false;step(1);};`;
  const run=src=>p.evaluate(new Function(H+src));
  const out={};
  out.setup=await run(`return {guards:q.guards.length,civs:q.civs.length,cams:q.cams.length,doors:q.doors.length,stairs:q.STAIRS.length,ladders:q.LADDERS.length,bags:q.bags.length,cash:q.CASH.length,sec:q.secGuard&&q.secGuard.name};`);
  // walk in unmasked: nobody cares on the floor for 20 s
  out.floor=await run(`go(0,20,0,0);walk(0,4);let mx=0;for(let i=0;i<600;i++){step(1);for(const c of q.civs)mx=Math.max(mx,c.sus);}q.updateHUD();return {at:at(),alarm:q.G.alarm,maxSus:+mx.toFixed(2),mask:document.getElementById("maskChip").textContent,restricted:q.restricted(q.P.x,q.P.z)};`);
  await run(`q.guards.forEach(g=>{g.route=[[50,50],[50,51]];g.wp=0;g.x=50;g.z=50;});q.cams.forEach(c=>c.dead=true);q.civs.forEach(c=>{if(c.label!=="The manager"){c.route=[[50,52]];c.wp=0;c.x=50;c.z=52;}});`);
  // grand stairs, service stairs up, roof stairs, down (door blocks without keycard)
  out.grand=await run(`go(12.25,9.0,0,0);walk(0,3.5);return at();`);
  out.svcUp=await run(`go(5.4,-6.2,0,0);walk(0,3.5);return at();`);
  out.roof=await run(`go(10.6,-15.2,1,Math.PI);walk(Math.PI,4);return at();`);
  out.downBlocked=await run(`go(10.6,-6.0,0,0);walk(0,2);return at();`);
  out.downCard=await run(`q.P.hasCard=true;go(10.6,-6.0,0,0);step(1);const a=pr();q.pressE();step(25);q.P.crouch=true;walk(0,6);const r={prompt:a,...at(),alarm:q.G.alarm};q.P.crouch=false;return r;`);
  // uniform
  out.uniform=await run(`go(-19,-13.5,0,0,-0.2);const a=pr();hold(3.2);const r=q.restricted(-8,-3.5,0);q.updateHUD();return {prompt:a,disguise:q.G.c.disguise,corridorRestricted:r,countRestricted:q.restricted(-8,-10,0),mask:(go(-8,-3.5,0,0),q.updateHUD(),document.getElementById("maskChip").textContent)};`);
  // pickpocket the manager from behind
  out.pre=await run(`const m=q.civs.find(c=>c.label==="The manager");return {st:m.state,alarm:q.G.alarm,state:q.state,lvl:m.level,sus:m.sus};`);
  out.pp=await run(`const m=q.civs.find(c=>c.label==="The manager");m.route=[[0,-0.5,Math.PI/2,999],[0,-0.6,Math.PI/2,999]];m.x=0;m.z=-0.5;m.yaw=Math.PI/2;m.wp=0;m.wait=99;m.face=Math.PI/2;step(5);
    go(-1.0,-0.5,1,-Math.PI/2);step(1);const a=pr();hold(1.8);return {prompt:a,key:q.G.c.key};`);
  // vent: unscrew, crawl, unscrew the far end
  out.vent=await run(`go(-5.0,-15.2,1,Math.PI/2);const a=pr();hold(2.2);walk(Math.PI/2,1.0);const inDuct=at();const cr=q.P.crouch;walk(Math.PI/2,6);const end=at();const b=pr();hold(2.2);walk(Math.PI/2,1.5);return {prompt:a,inDuct,crouched:cr,end,farPrompt:b,out:at()};`);
  out.sensors=await run(`go(-14.3,-9.6,1,-Math.PI/2);const a=pr();hold(3.2);return {prompt:a,off:q.G.c.sensorsOff};`);
  // sensors trip when armed (separate check)
  // time lock
  out.timelock=await run(`go(-3.2,-14.3,-1,0,-0.2);const a=pr();hold(1.7);const t0=q.G.c.timer;step(30*76);return {prompt:a,started:t0,open:q.G.vaultOpen,bags:q.bags.filter(b=>b.box==="vault").map(b=>b.state).join(",")};`);
  // fire escape: ground to landing, landing to roof
  out.preFire=await run(`return {state:q.state,alarm:q.G.alarm,reason:document.getElementById('endReason').textContent};`);
  out.fire=await run(`go(25.3,-3.7,0,0);const a=pr();q.pressE();step(1);q.keys.KeyW=true;step(90);q.keys.KeyW=false;step(40);const l1=at();
    go(24.75,-9.0,1,Math.PI/2);step(1);const b=pr();q.pressE();step(1);q.keys.KeyW=true;step(120);q.keys.KeyW=false;step(40);return {p1:a,landing:l1,p2:b,roof:at()};`);
  // sensors trip test
  out.sensorTrip=await run(`q.resetGame();q.setState("playing");q.guards.forEach(g=>{g.route=[[50,50],[50,51]];g.wp=0;g.x=50;g.z=50;});go(0,-10,-1,0);walk(0,1.0);return {alarm:q.G.alarm,toast:document.getElementById("toast").textContent};`);
  out.crouchOK=await run(`q.resetGame();q.setState("playing");q.guards.forEach(g=>{g.route=[[50,50],[50,51]];g.wp=0;g.x=50;g.z=50;});go(0,-10,-1,0);q.P.crouch=true;walk(0,2.0);return {alarm:q.G.alarm};`);
  out.lockdown=await run(`q.resetGame();q.setState("playing");q.G.c.key=true;q.G.c.sensorsOff=true;go(-3.2,-14.3,-1,0,-0.2);hold(1.7);step(30);q.civs[0].panic();q.civs[0].callT=0.05;step(30);return {lockdown:q.G.c.lockdown,timer:q.G.c.timer,open:q.G.vaultOpen};`);
  console.log(JSON.stringify(out,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
