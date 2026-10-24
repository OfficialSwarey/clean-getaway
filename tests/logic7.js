const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n')));
  p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))errs.push('CONSOLE '+m.text().slice(0,300));});
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  // pick the new job in the menu, then start
  await p.click('.job[data-map="meridian"]');await p.waitForTimeout(500);
  await p.click('#startBtn');await p.waitForTimeout(2500);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-(q.P.y+q.P.eye),Math.hypot(dx,dz));};
    const fire=(x,y,z)=>{look(x,y,z);step(1);look(x,y,z);q.P.fireCD=0;q.P.reload=0;q.shoot();};
    const fresh=()=>{q.resetGame();q.setState("playing");};
    const G=n=>q.guards.find(g=>g.name===n);
    out.map={id:q.LV.id,guards:q.guards.length,cams:q.cams.length,doors:q.doors.length,bins:q.bins.length,bags:q.bags.length,spawn:[q.P.x,q.P.z],state:q.state,
      shadowLights:(()=>{let n=0;q.scene.traverse(o=>{if(o.isLight&&o.castShadow)n++;});return n;})()};
    // ghost mode
    fresh();q.P.masked=true;q.P.raise=1;const m=G("Morris");q.P.x=m.x+Math.sin(m.yaw)*3;q.P.z=m.z+Math.cos(m.yaw)*3;
    q.DEV.on=true;q.DEV.ghost=true;step(30);out.ghost={suspGhost:+q.G.susp.toFixed(2)};
    q.DEV.ghost=false;step(15);out.ghost.suspVisible=+q.G.susp.toFixed(2);q.DEV.on=false;
    // cameras online before, offline after the operator goes down
    fresh();q.P.masked=true;q.P.raise=1;q.P.x=3;q.P.z=11;q.P.yaw=0;let seen=false;
    G("Morris").route=[[-8,12.5]];G("Morris").x=-8;G("Morris").z=12.5; // keep the lobby guard out of the way
    for(let i=0;i<300&&!seen;i++){step(1);if(q.cams[0].seeDist>=0)seen=true;q.G.susp=0;}
    out.cams={lobbyCamSawYou:seen};
    const op=q.secGuard;q.P.x=op.x-2.2;q.P.z=op.z;step(2);fire(op.x,1.2,op.z);out.cams.operatorDown=op.down;
    q.P.x=3;q.P.z=11;let seenAfter=false;for(let i=0;i<300;i++){step(1);if(q.cams.some(c=>c.seeDist>=0))seenAfter=true;q.G.susp=0;}
    out.cams.seenAfterOperatorDown=seenAfter;out.cams.alarm=q.G.alarm;
    // ladder up, roof guard sees you, ground guard does not, hatch down
    fresh();q.P.masked=true;q.P.raise=1;
    const nov=G("Novak");nov.route=[[20,11.5]];nov.x=20;nov.z=11.5;nov.yaw=0;
    q.P.x=-18;q.P.z=-19.1;look(-18,1,-18.3);step(1);q.pressE();step(1);step(40);
    out.roof={level:q.P.level,y:+q.P.y.toFixed(2),pos:[+q.P.x.toFixed(1),+q.P.z.toFixed(1)],restricted:q.restricted(q.P.x,q.P.z)};
    q.P.x=-9;q.P.z=-13.6;look(-9,4,-15);step(1);q.pressE();step(25);out.roof.hatchOpen=q.hatches[0].open;
    q.pressE();step(40);out.roof.afterHatch={level:q.P.level,y:+q.P.y.toFixed(2),pos:[+q.P.x.toFixed(1),+q.P.z.toFixed(1)]};
    // roof sight rules
    fresh();q.P.masked=true;q.P.raise=1;q.P.level=1;q.P.y=4;
    const m2=G("Morris");m2.route=[[0,7]];m2.x=0;m2.z=7;m2.yaw=0;q.P.x=0;q.P.z=10;step(10);
    out.sight={groundGuardSeesRoofPlayer:m2.seeDist>=0};
    const n2=G("Novak");n2.route=[[-21,-15.5]];n2.x=-21;n2.z=-15.5;n2.yaw=Math.PI/2;q.P.x=-15;q.P.z=-15.5;step(5);
    out.sight.roofGuardSees=n2.seeDist>=0;
    // loading door: Reyes opens it on his way out
    fresh();q.P.x=0;q.P.z=25;const ld=q.doors.find(d=>d.name==="loading door");let opened=false;
    for(let i=0;i<1500&&!opened;i++){step(1);if(ld.open)opened=true;}
    out.loadingDoor={openedByGuard:opened,t:+(q.G.time).toFixed(1)};
    // drill and van
    fresh();q.P.masked=true;q.P.raise=1;q.P.x=0;q.P.z=-6.9;look(0,1.2,-8);step(1);q.pressE();step(1);
    out.drill={running:q.G.drilling};q.P.x=0;q.P.z=25;step(620);out.drill.vaultOpen=q.G.vaultOpen;
    const bag=q.bags[0];bag.state="carried";bag.mesh.visible=false;q.P.carry=bag;
    q.P.x=q.SECURE.x+1;q.P.z=q.SECURE.z;look(q.SECURE.x-1,0.5,q.SECURE.z);q.pressE();step(1);
    out.van={secured:q.G.secured,of:q.bags.length,alarm:q.G.alarm};
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  await p.evaluate(()=>{__qh.setState("menu");});await p.waitForTimeout(3500);await p.screenshot({path:'15-menu.png'});
  console.log(errs.join('\n')||'no errors');await b.close();
})();
