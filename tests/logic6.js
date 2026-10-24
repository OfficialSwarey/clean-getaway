const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+e.stack));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('#startBtn');await p.waitForTimeout(2000);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-q.P.eye,Math.hypot(dx,dz));};
    const fresh=(iso)=>{q.resetGame();q.setState("playing");q.P.masked=true;q.P.raise=1;if(iso){q.cams.forEach(c=>c.dead=true);q.guards.slice(1).forEach((g,i)=>{g.route=[[22,-20+i]];g.x=22;g.z=-20+i;g.seated=false;});}};
    const s=q.secGuard;
    out.audio=q.A.ctx&&q.A.ctx.state;
    // 1. operator is seated and does not see you come through the door
    fresh();out.op={seated:s.seated,pos:[s.x,s.z],yaw:+s.yaw.toFixed(2)};
    const sd=q.doors.find(d=>d.name==="security door");q.openDoor(sd,10,1,false);
    q.P.x=10;q.P.z=-1;q.P.crouch=false;q.guards[2].x=-12;q.guards[2].z=8;q.guards[2].route=[[-12,8]];
    step(90);out.op.suspAfter3s=+q.G.susp.toFixed(2);out.op.yawAfter=+s.yaw.toFixed(2);
    // 2. sprinting next to him: he hears and turns
    q.keys.ShiftLeft=true;q.keys.KeyD=true;q.P.yaw=Math.PI/2;q.P.x=10;q.P.z=-6.5;step(20);q.keys.ShiftLeft=false;q.keys.KeyD=false;
    out.op.heard=!!s.heard;out.op.turnedYaw=+s.yaw.toFixed(2);
    // 3. pager answered
    fresh(true);step(100);const g=q.guards[0];q.P.x=g.x-Math.sin(g.yaw)*4;q.P.z=g.z-Math.cos(g.yaw)*4;step(2);
    look(g.x,1.66,g.z);step(1);look(g.x,1.66,g.z);q.P.fireCD=0;q.shoot();
    out.pg={dead:g.dead,state0:g.pager&&g.pager.state};step(90);out.pg.after3s=g.pager.state;
    q.P.x=g.x+1.2;q.P.z=g.z;look(g.x,0.3,g.z);q.keys.KeyE=true;step(2);
    out.pg.answering=g.pager.state;out.pg.locked=q.P.locked;out.pg.voices=q.voices.length;
    const subs=[];let last="";
    for(let i=0;i<600&&g.pager.state==="answering";i++){step(1);const t=document.getElementById('subLine').textContent;if(t!==last){subs.push(t);last=t;}}
    q.keys.KeyE=false;
    out.pg.final=g.pager.state;out.pg.used=q.G.pagersUsed;out.pg.alarm=q.G.alarm;out.pg.locked2=q.P.locked;out.pg.subs=subs;
    // bagging is allowed now
    q.keys.KeyE=true;step(70);q.keys.KeyE=false;out.pg.baggedAfter=g.bagged;
    // 4. let go mid-call
    fresh(true);step(100);const g1=q.guards[0];q.P.x=g1.x-Math.sin(g1.yaw)*4;q.P.z=g1.z-Math.cos(g1.yaw)*4;step(2);look(g1.x,1.66,g1.z);step(1);look(g1.x,1.66,g1.z);q.P.fireCD=0;q.shoot();step(90);
    q.P.x=g1.x+1.2;q.P.z=g1.z;look(g1.x,0.3,g1.z);q.keys.KeyE=true;step(40);q.keys.KeyE=false;step(3);
    out.letGo={alarm:q.G.alarm,toast:document.getElementById('toast').textContent,sub:document.getElementById('subLine').textContent};
    // 5. ignore it
    fresh(true);step(100);const g2=q.guards[0];q.P.x=g2.x-Math.sin(g2.yaw)*4;q.P.z=g2.z-Math.cos(g2.yaw)*4;step(2);look(g2.x,1.66,g2.z);step(1);look(g2.x,1.66,g2.z);q.P.fireCD=0;q.shoot();
    q.P.x=2;q.P.z=25;let t=0;while(!q.G.alarm&&t<900){step(1);t++;}
    out.ignored={alarm:q.G.alarm,seconds:+(t/30).toFixed(1),toast:document.getElementById('toast').textContent};
    // 6. fourth call fails
    fresh(true);q.G.pagersUsed=3;step(100);const g3=q.guards[0];q.P.x=g3.x-Math.sin(g3.yaw)*4;q.P.z=g3.z-Math.cos(g3.yaw)*4;step(2);look(g3.x,1.66,g3.z);step(1);look(g3.x,1.66,g3.z);q.P.fireCD=0;q.shoot();step(90);
    q.P.x=g3.x+1.2;q.P.z=g3.z;look(g3.x,0.3,g3.z);q.keys.KeyE=true;for(let i=0;i<600&&!q.G.alarm;i++)step(1);q.keys.KeyE=false;
    out.fourth={alarm:q.G.alarm,toast:document.getElementById('toast').textContent};
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  console.log(errs.join('\n')||'no page errors');await b.close();
})();
