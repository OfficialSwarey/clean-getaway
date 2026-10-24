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
    q.resetGame();q.setState("playing");q.P.masked=true;q.P.raise=1;q.P.aim=true;step(100);
    const g=q.guards[0];q.P.x=g.x-Math.sin(g.yaw)*4;q.P.z=g.z-Math.cos(g.yaw)*4;step(4);look(g.x,1.66,g.z);step(1);look(g.x,1.66,g.z);q.P.fireCD=0;q.shoot();step(20);
    q.P.x=g.x+1.2;q.P.z=g.z;look(g.x,0.3,g.z);q.keys.KeyE=true;step(70);q.keys.KeyE=false;
    q.P.x=6;q.P.z=7.5;q.P.yaw=-Math.PI/2;q.dropCarry();
    q.P.x=2;q.P.z=25;step(1);
    let t=0;while(q.state==="playing"&&!q.G.alarm&&t<600){step(1);t++;}
    out.E={bodies:q.G.bodies.length,alarm:q.G.alarm,cause:q.G.lastCause,spotter:q.G.lastSpotter,seconds:+(t/30).toFixed(1),toast:document.getElementById('toast').textContent};
    return out;
  })));
  console.log(errs.join('\n')||'no page errors');await b.close();
})();
