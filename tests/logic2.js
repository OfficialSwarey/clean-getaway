const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' '+e.stack));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('#startBtn');await p.waitForTimeout(2500);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-q.P.eye,Math.hypot(dx,dz));};
    const fire=(x,y,z)=>{look(x,y,z);step(1);look(x,y,z);q.camera.updateMatrixWorld();q.P.fireCD=0;q.P.reload=0;q.shoot();};
    const fresh=()=>{q.resetGame();q.setState("playing");q.P.masked=true;q.P.raise=1;q.P.aim=true;};
    const camPos=c=>c.body.getWorldPosition(new q.camera.position.constructor());
    // A: camera shot while operator alive -> alarm after ~3s
    fresh();q.P.x=10;q.P.z=8;step(8);let w=camPos(q.cams[0]);fire(w.x,w.y,w.z);
    out.A={camDead:q.cams[0].dead,secAlert:+q.G.secAlert.toFixed(2)};step(100);out.A.alarm=q.G.alarm;
    // B: kill operator first, then camera -> no alert
    fresh();const s=q.secGuard;out.B={secStart:[+s.x.toFixed(1),+s.z.toFixed(1),+s.yaw.toFixed(2)]};
    q.P.x=s.x-2.5;q.P.z=s.z;step(6);fire(s.x,1.66,s.z);out.B.secDown=s.down;
    q.P.x=10;q.P.z=8;step(4);w=camPos(q.cams[0]);fire(w.x,w.y,w.z);out.B.camDead=q.cams[0].dead;out.B.secAlert=q.G.secAlert;out.B.alarm=q.G.alarm;
    // C: body left in the lobby gets found by the camera, player far outside
    fresh();step(100);const g=q.guards[0];q.P.x=g.x-Math.sin(g.yaw)*4;q.P.z=g.z-Math.cos(g.yaw)*4;step(4);fire(g.x,1.66,g.z);
    out.C={dead:g.dead,gpos:[+g.x.toFixed(1),+g.z.toFixed(1)]};q.P.x=-20;q.P.z=20;step(30);
    out.C.bodies=q.G.bodies.length;out.C.camSeesBody=q.cams[0].bodyDist;out.C.susp=+q.G.susp.toFixed(2);step(150);out.C.alarm=q.G.alarm;out.C.cause=q.G.lastCause;
    // D: bag the body and bin it
    fresh();step(100);const g2=q.guards[0];q.P.x=g2.x-Math.sin(g2.yaw)*4;q.P.z=g2.z-Math.cos(g2.yaw)*4;step(4);fire(g2.x,1.66,g2.z);step(20);
    q.P.aim=false;q.P.x=g2.x+1.2;q.P.z=g2.z;look(g2.x,0.3,g2.z);q.keys.KeyE=true;step(70);q.keys.KeyE=false;
    out.D={carry:q.P.carry&&q.P.carry.kind,bagged:g2.bagged,bodies:q.G.bodies.length};
    q.dropCarry();step(1);out.D.afterDrop={state:g2.item.state,bodies:q.G.bodies.length};
    q.P.x=g2.item.mesh.position.x+1;q.P.z=g2.item.mesh.position.z;look(g2.item.mesh.position.x,0.2,g2.item.mesh.position.z);q.pressE();step(1);
    out.D.repick=q.P.carry&&q.P.carry.kind;
    const bin=q.bins[0];q.P.x=bin.x;q.P.z=bin.z+1.3;look(bin.x,0.8,bin.z);q.pressE();step(1);
    out.D.binned=q.G.binned;out.D.binCount=bin.count;out.D.carry=q.P.carry;out.D.bodiesAfter=q.G.bodies.length;out.D.state=q.state;out.D.alarm=q.G.alarm;
    return out;
  });
  console.log(JSON.stringify(r));
  // ADS frame to check the sights
  await p.evaluate(()=>{const q=__qh;q.resetGame();q.setState("playing");q.P.masked=true;q.P.raise=1;q.P.aim=true;q.P.x=0;q.P.z=9;q.P.yaw=0;q.P.pitch=0;for(let i=0;i<20;i++)q.stepGame(1/30);});
  await p.waitForTimeout(3500);await p.screenshot({path:'8-ads.png'});
  await p.evaluate(()=>{const q=__qh;q.P.aim=false;q.P.x=11;q.P.z=-3;q.P.yaw=-Math.PI*0.6;for(let i=0;i<20;i++)q.stepGame(1/30);});
  await p.waitForTimeout(3500);await p.screenshot({path:'9-secroom.png'});
  console.log(errs.join('\n')||'no page errors');await b.close();
})();
