const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:960,height:540}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="club"]');await p.waitForTimeout(500);await p.click('#startBtn');await p.waitForTimeout(1000);
  const ev=f=>p.evaluate(f);
  const out={};
  out.notes=await ev(()=>{const q=__qh,res=[];const step=n=>{for(let i=0;i<n;i++)q.stepGame(1/30);};
    for(const sp of q.NOTE.spots){q.resetGame();q.setState("playing");q.DEV.ghost=true;
      q.NOTE.mesh.position.set(sp[0],sp[1],sp[2]);q.NOTE.mesh.rotation.set(0,sp[3],0);
      const nx=Math.sin(sp[3]),nz=Math.cos(sp[3]);let dist=1.3;
      if(sp[2]>13)dist=2.3; // coat check: stand in front of the counter
      q.P.x=sp[0]+nx*dist;q.P.z=sp[2]+nz*dist;q.P.yaw=Math.atan2(nx,nz);step(1);
      const pr=document.getElementById("prompt").hidden?"(none)":document.getElementById("promptText").textContent;
      q.pressE();step(1);res.push({spot:sp.slice(0,3),prompt:pr,know:q.G.knowCode});}
    return res;});
  out.code=await ev(()=>{const q=__qh;q.resetGame();q.setState("playing");q.DEV.ghost=true;return {code:q.G.safeCode,spot:q.NOTE.spot.slice(0,3),bagStates:q.bags.map(b=>b.state)};});
  // at the safe: wrong code, then the right one
  await ev(()=>{const q=__qh;const d=q.doors.find(d=>d.name==="office door");d.locked=false;q.P.x=-2;q.P.z=-12.6;q.P.yaw=0;q.P.pitch=-0.1;for(let i=0;i<2;i++)q.stepGame(1/30);});
  const pr0=await ev(()=>document.getElementById("promptText").textContent);
  await ev(()=>{const q=__qh;q.pressE();q.stepGame(1/30);});
  const open1=await ev(()=>({keypad:__qh.G.keypad,locked:__qh.P.locked,hidden:document.getElementById("keypad").hidden}));
  await ev(()=>{const q=__qh,w=q.G.safeCode==="1111"?"2222":"1111";for(const c of w)window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+c}));});
  await p.waitForTimeout(2500);
  const wrong=await ev(()=>({fails:__qh.G.safeFails,screen:document.getElementById("kpScreen").textContent,title:document.getElementById("kpTitle").textContent}));
  await p.waitForTimeout(2500);
  await ev(()=>{const c=__qh.G.safeCode;for(const d of c.slice(0,3))window.dispatchEvent(new KeyboardEvent("keydown",{code:"Numpad"+d}));});
  await p.screenshot({path:'60-keypad.png'});
  await ev(()=>{const c=__qh.G.safeCode;window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+c[3]}));});
  await p.waitForTimeout(3000);
  await ev(()=>{const q=__qh;for(let i=0;i<60;i++)q.stepGame(1/30);});
  out.safe={prompt:pr0,open1,wrong,...await ev(()=>({open:__qh.G.vaultOpen,keypad:__qh.G.keypad,bagStates:__qh.bags.map(b=>b.state),alarm:__qh.G.alarm}))};
  await ev(()=>{const q=__qh;q.P.x=-1.6;q.P.z=-13.9;q.P.yaw=0.15;q.P.pitch=-0.45;q.stepGame(1/30);});
  await p.waitForTimeout(300);await p.screenshot({path:'61-safe-open.png'});
  out.pickup=await ev(()=>{const q=__qh;const pr=document.getElementById("promptText").textContent;q.pressE();q.stepGame(1/30);return {prompt:pr,carry:q.P.carry&&q.P.carry.kind};});
  // three wrong codes trip the alarm
  await ev(()=>{const q=__qh;q.resetGame();q.setState("playing");q.DEV.ghost=true;const d=q.doors.find(d=>d.name==="office door");d.locked=false;q.P.x=-2;q.P.z=-12.6;q.P.yaw=0;q.stepGame(1/30);q.pressE();q.stepGame(1/30);});
  for(let k=0;k<3;k++){await p.waitForFunction(()=>document.getElementById('kpScreen').textContent.includes('_'),null,{timeout:20000});await ev(()=>{const w=__qh.G.safeCode==="1111"?"2222":"1111";for(const c of w)window.dispatchEvent(new KeyboardEvent("keydown",{code:"Digit"+c}));});await p.waitForTimeout(3000);}
  out.threeWrong=await ev(()=>({fails:__qh.G.safeFails,alarm:__qh.G.alarm,toast:document.getElementById("toast").textContent,keypad:__qh.G.keypad}));
  // a closed safe: can't take bags through the door
  await ev(()=>{const q=__qh;q.resetGame();q.setState("playing");q.DEV.ghost=true;q.P.x=-1.4;q.P.z=-13.0;q.P.yaw=0;q.stepGame(1/30);q.pressE();q.stepGame(1/30);});
  out.closedCarry=await ev(()=>__qh.P.carry);
  // note close-up
  await ev(()=>{const q=__qh;const sp=q.NOTE.spot;const nx=Math.sin(sp[3]),nz=Math.cos(sp[3]);q.P.x=sp[0]+nx*0.9;q.P.z=sp[2]+nz*0.9;q.P.yaw=Math.atan2(nx,nz);q.P.pitch=Math.atan2(sp[1]-1.65,0.9);q.stepGame(1/30);});
  await p.waitForTimeout(300);await p.screenshot({path:'62-note.png'});
  console.log(JSON.stringify(out,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
