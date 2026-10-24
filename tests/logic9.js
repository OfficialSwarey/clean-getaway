const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="harborDay"]');await p.waitForTimeout(500);
  await p.click('#startBtn');await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const fresh=()=>{q.resetGame();q.setState("playing");};
    // a clerk notices you unmasked in the staff office
    fresh();q.guards.forEach(g=>{g.route=[[14,-11]];g.x=14;g.z=-11;});
    const cl=q.civs.find(c=>c.label==="A clerk");cl.route=[[-12.2,-6,-Math.PI/2,0]];cl.x=-12.2;cl.z=-6;cl.yaw=-Math.PI/2;cl.face=-Math.PI/2;
    q.P.x=-14.4;q.P.z=-7.2;let s=0;for(;s<300&&cl.state!=="calling";s++){step(1);q.G.susp=0;}
    out.clerk={state:cl.state,secs:+(s/30).toFixed(1),restricted:q.restricted(q.P.x,q.P.z)};
    // a guard catches you unmasked behind the counter
    fresh();const ok=q.guards.find(g=>g.name==="Okafor");q.guards.forEach(g=>{if(g!==ok){g.route=[[14,-11]];g.x=14;g.z=-11;}});
    ok.route=[[-12,2,Math.PI/2,0]];ok.x=-12;ok.z=2;ok.yaw=Math.PI/2;q.civs.forEach(c=>{c.route=[[14,10]];c.x=14;c.z=10;});
    q.P.x=-6;q.P.z=1.5;for(let i=0;i<300&&!q.G.alarm;i++)step(1);
    out.guardDay={alarm:q.G.alarm,toast:document.getElementById("toast").textContent};
    // Meridian by day
    q.pickMap("meridianDay");fresh();
    out.meridian={civs:q.civs.length,guards:q.guards.length,ties:q.P.ties,
      openDoors:q.doors.filter(d=>d.open).map(d=>d.name),
      staff:{lobby:q.restricted(0,10,0),accounts:q.restricted(-17,9,0),corridor:q.restricted(0,2,0),street:q.restricted(0,20,0),loadingYard:q.restricted(27,-11,0)}};
    // let everyone go about their day for two minutes: nobody should notice an unmasked customer in the lobby
    q.P.x=3;q.P.z=11;step(30*120);
    out.meridian.afterTwoMin={alarm:q.G.alarm,calling:q.civs.filter(c=>c.state!=="idle").length,susp:+q.G.susp.toFixed(2),
      walker:q.civs.filter(c=>c.route.length>1).map(c=>[+c.x.toFixed(1),+c.z.toFixed(1)])};
    // and the night maps still load
    q.pickMap("meridian");fresh();out.night={civs:q.civs.length,guards:q.guards.length,openDoors:q.doors.filter(d=>d.open).length};
    let sl=0;q.pickMap("meridianDay");fresh();q.scene.traverse(o=>{if(o.isLight&&o.castShadow)sl++;});out.dayShadowLights=sl;
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  console.log(errs.join('\n')||'no errors');await b.close();
})();
