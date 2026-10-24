const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('#startBtn');await p.waitForTimeout(2000);
  console.log(JSON.stringify(await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-q.P.eye,Math.hypot(dx,dz));};
    const D=n=>q.doors.find(d=>d.name===n);
    // 1. restricted zones
    out.restricted={lobby:q.restricted(0,8),street:q.restricted(2,20),yard:q.restricted(-10,-16)};
    // 2. player opens/closes the front door
    q.resetGame();q.setState("playing");const fd=D("front door");
    out.front={closedBlocks:q.colliders.includes(fd.col),glassSeeThrough:!q.blocked(0,8,0,16,1.6)};
    q.P.x=0;q.P.z=13.6;look(0,1.2,12);step(1);q.pressE();step(1);step(20);
    out.front.open=fd.open;out.front.colRemoved=!q.colliders.includes(fd.col);out.front.t=+fd.t.toFixed(2);
    q.P.x=0;q.P.z=8;step(2);out.front.walkedIn=q.restricted(q.P.x,q.P.z);
    // 3. solid door blocks sight; guard opens and recloses back door
    const bd=D("back door");out.back={blocksSight:q.blocked(-10.75,-9,-10.75,-15,1.6)};
    let opened=false,closedAfter=false,t=0;
    q.P.x=2;q.P.z=25;
    while(t<1800){step(1);t++;if(bd.open)opened=true;if(opened&&!bd.open){closedAfter=true;break;}}
    out.back.guardOpened=opened;out.back.reclosed=closedAfter;out.back.seconds=+(t/30).toFixed(1);
    // 4. lobby guard walking along z=1.5 must NOT open the interior doors
    q.resetGame();q.setState("playing");q.P.x=2;q.P.z=25;
    const g2=q.guards[2];const others=["office door"].map(D);let spurious=false;
    for(let i=0;i<900;i++){step(1);if(D("office door").open)spurious=true;}
    out.lobbyGuardOpensOffice=spurious;
    // 5. drill: one press, runs by itself, guard hears it
    q.resetGame();q.setState("playing");q.P.masked=true;q.P.raise=1;
    q.P.x=0;q.P.z=-3.2;look(0,1.2,-4.7);step(1);q.pressE();step(1);
    out.drill={running:q.G.drilling};
    q.P.x=2;q.P.z=25;step(150);out.drill.pct5s=Math.round(q.G.drill*100);
    out.drill.guardHeard=q.guards.some(g=>g.heard&&Math.abs(g.heard.z+4.5)<0.1);
    step(500);out.drill.vaultOpen=q.G.vaultOpen;out.drill.running=q.G.drilling;out.drill.state=q.state;out.drill.alarm=q.G.alarm;
    return out;
  })));
  console.log(errs.join('\n')||'no page errors');await b.close();
})();
