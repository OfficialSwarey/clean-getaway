const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('#startBtn');await p.waitForTimeout(2500);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=(n)=>{for(let i=0;i<n;i++)q.stepGame(1/30);};
    out.state=q.state;
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-q.P.eye,Math.hypot(dx,dz));};
    // 1. unmasked in public, right in front of guard 0
    const g0=q.guards[0];q.P.x=g0.x+Math.sin(g0.yaw)*3;q.P.z=g0.z+Math.cos(g0.yaw)*3;step(20);
    out.publicSusp=+q.G.susp.toFixed(2);out.publicRestricted=q.restricted(q.P.x,q.P.z);
    // 2. unmasked in staff area, in front of guard 2
    q.resetGame();const g2=q.guards[2];
    q.P.x=g2.x+Math.sin(g2.yaw)*3;q.P.z=g2.z+Math.cos(g2.yaw)*3;step(15);
    out.staffSusp=+q.G.susp.toFixed(2);out.staffRestricted=q.restricted(q.P.x,q.P.z);
    // 3. mask on
    q.resetGame();q.keys.KeyG=true;step(20);out.maskHalf=q.P.masked;step(15);q.keys.KeyG=false;out.masked=q.P.masked;step(20);
    // 4. headshot guard 0 from behind (lobby)
    const g=q.guards[0];q.P.x=g.x-Math.sin(g.yaw)*5;q.P.z=g.z-Math.cos(g.yaw)*5;q.P.aim=true;step(10);
    look(g.x,1.66,g.z);step(1);look(g.x,1.66,g.z);q.camera.updateMatrixWorld();
    q.P.fireCD=0;q.shoot();out.head={dead:g.dead,kills:q.G.kills,mag:q.P.mag};
    // 5. body shot guard 1 -> wounded -> alarm after 2s
    const g1=q.guards[1];q.P.x=g1.x-Math.sin(g1.yaw)*4;q.P.z=g1.z-Math.cos(g1.yaw)*4;step(2);look(g1.x,1.1,g1.z);step(1);look(g1.x,1.1,g1.z);
    q.P.fireCD=0;q.shoot();out.body={hp:g1.hp,wounded:+g1.wounded.toFixed(2),dead:g1.dead};
    step(70);out.alarmAfterWound=q.G.alarm;
    // 6. camera shot
    q.resetGame();q.P.masked=true;q.P.raise=1;
    const c=q.cams[0];q.P.x=10;q.P.z=8;q.P.aim=true;step(8);
    const wp=c.body.getWorldPosition(new q.camera.position.constructor());look(wp.x,wp.y,wp.z);step(1);look(wp.x,wp.y,wp.z);q.camera.updateMatrixWorld();
    q.P.fireCD=0;q.shoot();out.camDead=c.dead;out.camsShot=q.G.camsShot;const c1=q.cams[1];q.P.x=c1.x-3;q.P.z=c1.z-3;step(2);const w1=c1.body.getWorldPosition(new q.camera.position.constructor());look(w1.x,w1.y,w1.z);step(1);look(w1.x,w1.y,w1.z);q.camera.updateMatrixWorld();q.P.fireCD=0;q.shoot();out.cam2Dead=c1.dead;
    // 7. reload
    q.P.mag=3;q.startReload();step(50);out.afterReload=[q.P.mag,q.P.reserve];
    out.finalState=q.state;
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  // render a masked, aiming frame for a visual check
  await p.evaluate(()=>{const q=__qh;q.resetGame();q.P.masked=true;q.P.raise=1;q.P.x=-3;q.P.z=8;q.P.yaw=0;q.P.aim=false;q.stepGame(1/30);});
  await p.waitForTimeout(3000);await p.screenshot({path:'7-gun-hip.png'});
  console.log(errs.join('\n')||'no page errors');await b.close();
})();
