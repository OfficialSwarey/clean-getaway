const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.evaluate(()=>{__qh.setState("menu");__qh.pickMap("manor");__qh.resetGame();__qh.setState("playing");});
  await p.waitForTimeout(300);
  const ev=f=>p.evaluate(f);
  const H=`const q=__qh;const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
    const go=(x,z,lvl,yaw,pitch)=>{q.P.x=x;q.P.z=z;q.P.level=lvl;q.P.jh=0;q.P.y=lvl*4;q.P.vy=0;q.P.yaw=yaw;q.P.pitch=pitch||0;step(1);};
    const walk=(yaw,secs)=>{q.P.yaw=yaw;q.keys.KeyW=true;step(Math.round(secs*30));q.keys.KeyW=false;step(2);};
    const at=()=>({x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),lvl:q.P.level});
    const hold=s=>{q.keys.KeyE=true;step(Math.round(s*30));q.keys.KeyE=false;step(1);};`;
  const run=src=>ev(new Function(H+src));
  const out={};
  out.setup=await run(`q.guards.forEach(g=>{if(g.name!=="Brennan"){g.route=[[40,40]];g.x=40;g.z=40;}});q.cams.forEach(c=>c.dead=true);
    q.civs.forEach(c=>{if(c.label!=="Lord Blackwood"){c.route=[[40,41]];c.x=40;c.z=41;}});
    const b=q.guards.find(g=>g.name==="Brennan");b.route=[[8,-4,0,999]];b.x=8;b.z=-4;b.wp=0;
    return {code:q.G.safeCode,book:q.G.m.book.c+" "+q.G.m.book.sh};`);
  // 1. diary
  out.diary=await run(`go(-13.8,-6.3,1,0,-0.4);const a=pr();q.pressE();step(1);return {prompt:a,know:q.G.m.diary,obj:(q.updateHUD(),document.getElementById("objText").textContent),chip:document.getElementById("codeChip").textContent};`);
  // 2. books: a wrong one, then the right one
  out.books=await run(`const B=q.LV.def.X.BOOKS,right=q.G.m.book,wrong=B.find(k=>k!==right);
    const lookAt=k=>{go(-14.6,k.z,0,0,0);const dx=-16.3-q.P.x,dz=k.z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(k.y-1.65,Math.hypot(dx,dz));step(1);};
    lookAt(wrong);const wp=pr();q.pressE();step(1);const wrongOpen=q.G.m.secretOpen;
    lookAt(right);const rp=pr();q.pressE();step(60);
    return {wrongPrompt:wp,wrongOpened:wrongOpen,rightPrompt:rp,open:q.G.m.secretOpen};`);
  // 3. walk through the bookcase and down the secret stairs
  out.secret=await run(`go(-15.5,-10,0,Math.PI/2);walk(Math.PI/2,1.3);const a=at();walk(Math.PI,3.2);const b=at();walk(-Math.PI/2,2.4);const c=at();return {inHidden:a,bottom:b,corridor:c};`);
  // 4. lasers armed: stepping in trips the alarm (then reset that)
  out.laserTrip=await run(`go(-8.5,-1.2,-1,0);walk(0,1.2);return {alarm:q.G.alarm,toast:document.getElementById("toast").textContent};`);
  await run(`q.resetGame();q.setState("playing");q.guards.forEach(g=>{g.route=[[40,40]];g.x=40;g.z=40;});q.cams.forEach(c=>c.dead=true);q.civs.forEach(c=>{if(c.label!=="Lord Blackwood"){c.route=[[40,41]];c.x=40;c.z=41;}});
    const b=q.guards.find(g=>g.name==="Brennan");b.route=[[8,-4,0,999]];b.x=8;b.z=-4;b.wp=0;q.LV.def.X.brennanRoute=b.route;
    q.G.m.diary=true;q.G.m.secretOpen=true;`);
  // 5. fuse box: walk down the kitchen stairs, cut the power
  out.fuse=await run(`go(18.6,-2.6,0,0);walk(0,3.5);const down=at();go(15.2,-6,-1,Math.PI/2);const a=pr();hold(2.2);
    return {cellar:down,prompt:a,powerOff:q.G.m.powerOff,lasersVisible:q.LV.def.X.lasers[0].visible};`);
  out.corridor=await run(`go(-8.5,-1.2,-1,0);walk(0,3.5);return {at:at(),alarm:q.G.alarm};`);
  // 6. Brennan comes to fix it after 40 s
  out.brennan=await run(`step(30*42);const b=q.guards.find(g=>g.name==="Brennan");const r1=JSON.stringify(b.route);step(30*12);return {fixingRoute:r1,powerOff:q.G.m.powerOff,dist:+Math.hypot(b.x-14.85,b.z+6).toFixed(2)};`);
  // 7. security computer instead
  out.computer=await run(`go(-1.8,-8.6,0,-Math.PI/2);const a=pr();hold(2.7);return {prompt:a,laserOff:q.G.laserOff};`);
  // 8. the ring next to the sleeping owner (crouched), then walking wakes him
  out.ring=await run(`const o=q.civs.find(c=>c.label==="Lord Blackwood");q.P.crouch=true;go(4.2,-9.0,1,0.6);q.P.crouch=true;
    q.keys.KeyW=true;q.P.yaw=Math.atan2(-(3.6-4.2),-(-11.5+9.0));step(20);q.keys.KeyW=false;step(5);const a=pr();q.pressE();step(1);
    const st1=o.state;step(30*3);const st2=o.state;
    return {prompt:a,ring:q.G.m.ring,ownerWhileCrouched:st1,after3s:st2};`);
  out.wake=await run(`const o=q.civs.find(c=>c.label==="Lord Blackwood");q.P.crouch=false;go(4.5,-7,1,Math.PI);
    q.keys.KeyW=true;q.keys.KeyS=false;let t=0;for(;t<60&&o.state==="asleep";t++){q.P.yaw=t%20<10?Math.PI:0;step(1);}q.keys.KeyW=false;
    const r={state:o.state,secs:+(t/30).toFixed(1)};o.state="asleep";o.wakeT=0;o.sus=0;return r;`);
  // 9. notes
  out.notes=await run(`const X=q.LV.def.X,r=[];for(const n of X.notes){const s=n.spot,lvl=n.level;let x=s[0],z=s[2];
      if(s[3]==="flat"){z+=1.0;}else{x+=Math.sin(s[3])*1.0;z+=Math.cos(s[3])*1.0;}
      go(x,z,lvl,Math.atan2(-(s[0]-x),-(s[2]-z)),-0.4);const a=pr();q.pressE();step(1);r.push(a);}
    return {prompts:r,knowA:q.G.m.knowA,knowB:q.G.m.knowB,chip:(q.updateHUD(),document.getElementById("codeChip").textContent)};`);
  // 10. replica
  out.replica=await run(`go(-12.5,7.3,1,0,-0.3);const a=pr();q.pressE();step(1);return {prompt:a,replica:q.G.m.replica};`);
  // 11. the vault: ring then keypad
  out.vault1=await run(`go(-8.5,-12.6,-1,0,-0.1);const a=pr();q.pressE();step(1);const b=pr();q.pressE();step(1);return {ringPrompt:a,ringOk:q.G.m.ringOk,keypadPrompt:b,keypad:q.G.keypad,title:document.getElementById("kpTitle").textContent,screen:document.getElementById("kpScreen").textContent};`);
  await ev(()=>{const c=__qh.G.safeCode;for(const d of c)window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+d}));});
  await p.waitForFunction(()=>__qh.G.vaultOpen,null,{timeout:20000}).catch(()=>{});
  out.vault2=await run(`step(60);return {open:q.G.vaultOpen,codeOk:q.G.m.codeOk,bags:q.bags.map(b=>b.state+(b.gold?"G":"")).join(","),obj:(q.updateHUD(),document.getElementById("objText").textContent)};`);
  // 12. van refuses without the diamond
  out.vanNo=await run(`go(q.SECURE.x+0.5,q.SECURE.z,0,0);return pr();`);
  // 13. swap the diamond
  out.swap=await run(`go(-8.5,-17.2,-1,0,-0.4);const a=pr();hold(1.7);return {prompt:a,has:q.G.hasDiamond,alarm:q.G.alarm,chip:(q.updateHUD(),document.getElementById("codeChip").textContent)};`);
  // 14. a gold bag: heavy
  out.gold=await run(`q.P.masked=true;q.P.raise=1;const g=q.bags.find(b=>b.gold);go(g.mesh.position.x,g.mesh.position.z+1.0,-1,0,-0.5);q.pressE();step(1);
    const carry=q.P.carry&&q.P.carry.gold;q.keys.ShiftLeft=true;q.keys.KeyW=true;step(2);const spr=q.P.sprinting;q.keys.ShiftLeft=false;q.keys.KeyW=false;
    q.tryJump();step(1);const toast=document.getElementById("toast").textContent;
    go(q.SECURE.x+0.5,q.SECURE.z,0,0);q.pressE();step(1);q.keys.KeyE=false;step(2);
    const vp=pr();q.keys.KeyE=true;step(50);q.keys.KeyE=false;
    return {carryGold:carry,sprinting:spr,jumpToast:toast,vanPrompt:vp,state:q.state,score:document.getElementById("endTakeVal").textContent,breakdown:document.getElementById("endBreak").innerText.replace(/\\n/g," | "),reason:document.getElementById("endReason").textContent};`);
  // 15. grab without replica: alarm
  out.grab=await run(`q.setState("menu");q.resetGame();q.setState("playing");q.G.vaultOpen=true;go(-8.5,-17.2,-1,0,-0.4);const a=pr();hold(1.2);return {prompt:a,has:q.G.hasDiamond,alarm:q.G.alarm,toast:document.getElementById("toast").textContent};`);
  console.log(JSON.stringify(out,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
