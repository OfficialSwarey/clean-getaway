const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="harbor"]');await p.waitForTimeout(400);
  await p.click('#startBtn');await p.waitForTimeout(1200);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-(q.P.y+q.P.eye),Math.hypot(dx,dz));};
    const fire=(x,y,z)=>{look(x,y,z);step(1);look(x,y,z);q.P.fireCD=0;q.P.reload=0;q.shoot();};
    const fresh=()=>{q.resetGame();q.setState("playing");};
    const setup=()=>{fresh();q.cams.forEach(c=>{c.dead=true;});const m=q.guards[0];q.guards.forEach(g=>{if(g!==m&&!g.security){g.route=[[14,-11]];g.x=14;g.z=-11;}});
      m.route=[[-6,8,0,0]];m.x=-6;m.z=8;m.yaw=0;m.face=0;q.P.masked=true;q.P.raise=1;q.P.x=-6;q.P.z=13;return m;};
    // spotted, nobody stops him: alarm about 6 s after the meter fills
    let m=setup();let t=0;for(;t<300&&!(m.reportT>0);t++)step(1);
    const tFull=t/30;let t2=0;for(;t2<400&&!q.G.alarm;t2++)step(1);
    out.noKill={meterFullAfter:+tFull.toFixed(1),alarmAfterReport:+(t2/30).toFixed(1),toast:document.getElementById("toast").textContent};
    // spotted, then shot 4 s into the report: no alarm
    m=setup();for(t=0;t<300&&!(m.reportT>0);t++)step(1);step(120);
    const lbl=(q.updateHUD(),document.getElementById("detectLbl").textContent);
    fire(m.x,1.63,m.z);step(1);fire(m.x,1.63,m.z);step(30*8);
    out.kill={label:lbl,down:m.down,alarm:q.G.alarm};
    // jammer freezes the report for 15 s
    m=setup();for(t=0;t<300&&!(m.reportT>0);t++)step(1);step(60);const before=m.reportT;
    q.keys.KeyJ=true;window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyJ"}));q.keys.KeyJ=false;
    step(30*10);const during=m.reportT;q.updateHUD();const jl=document.getElementById("detectLbl").textContent;
    step(30*5.5);const afterJam=q.G.jamT;let t3=0;for(;t3<400&&!q.G.alarm;t3++)step(1);
    out.jammer={before:+before.toFixed(2),after10s:+during.toFixed(2),label:jl,jamLeftAt15:+afterJam.toFixed(2),alarmAfterJam:+(t3/30).toFixed(1),jammersLeft:q.P.jammers};
    // camera spots you -> security guard has 6 s
    fresh();q.guards.forEach(g=>{if(!g.security){g.route=[[14,-11]];g.x=14;g.z=-11;}});q.P.masked=true;q.P.raise=1;
    q.P.x=10;q.P.z=8;let seen=false;for(t=0;t<600&&!(q.G.secAlert>0);t++)step(1);
    out.camera={secAlert:+q.G.secAlert.toFixed(2),after:+(t/30).toFixed(1)};
    for(t=0;t<400&&!q.G.alarm;t++)step(1);out.camera.alarmAfter=+(t/30).toFixed(1);out.camera.toast=document.getElementById("toast").textContent;
    // Meridian: locked security door, keycard
    q.pickMap("meridian");fresh();
    const sd=q.doors.find(d=>d.name==="security door");q.guards.forEach(g=>{if(!g.security){g.route=[[0,25]];g.x=0;g.z=25;}});
    q.P.x=9;q.P.z=-6.6;look(9,1.2,-8);step(1);q.pressE();step(2);
    out.card={lockedOpen:sd.open,prompt:document.getElementById("promptText").textContent};
    const k=q.KEYCARD;const kp=k.mesh.position;q.P.x=kp.x;q.P.z=kp.z+1.0;look(kp.x,kp.y,kp.z);step(1);
    out.card.pickPrompt=document.getElementById("promptText").textContent;q.pressE();step(1);out.card.hasCard=q.P.hasCard;out.card.at=[+kp.x.toFixed(1),+kp.z.toFixed(1)];
    q.P.x=9;q.P.z=-6.6;look(9,1.2,-8);step(1);out.card.swipePrompt=document.getElementById("promptText").textContent;q.pressE();step(20);out.card.opened=sd.open;
    // a few resets: keycard moves around
    const spots=new Set();for(let i=0;i<12;i++){fresh();spots.add(q.KEYCARD.mesh.position.x.toFixed(1));}out.card.distinctSpots=spots.size;
    // day: civilian's call stalls while jammed
    q.pickMap("harborDay");fresh();q.guards.forEach(g=>{g.route=[[-14,-11]];g.x=-14;g.z=-11;});q.P.masked=true;q.P.raise=1;
    const c=q.civs[6];c.sus=1;c.panic();step(30);const cb=c.callT;window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyJ"}));step(30*5);
    out.civJam={before:+cb.toFixed(2),after5s:+c.callT.toFixed(2),alarm:q.G.alarm};
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  console.log(errs.join('\n')||'no errors');await b.close();
})();
