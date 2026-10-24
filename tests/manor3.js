const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const q=__qh;q.setState("menu");q.pickMap("manor");q.resetGame();q.setState("playing");
    const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    q.guards.forEach(g=>{if(g.name!=="Brennan"){g.route=[[40,40]];g.x=40;g.z=40;}});q.cams.forEach(c=>c.dead=true);
    q.DEV.ghost=true;q.P.x=30;q.P.z=40;step(1);
    q.G.m.powerOff=true;q.G.m.powerT=0;step(30*41);const b=q.guards.find(g=>g.name==="Brennan");const r1=q.G.m.fixing;
    let t=0;for(;t<30*40&&q.G.m.powerOff;t++)step(1);
    const restored=!q.G.m.powerOff;step(30*10);
    return {sent:r1,restoredAfter:+(t/30).toFixed(1),restored,backOnPatrol:b.route.length,lasers:q.LV.def.X.lasers[0].visible};});
  console.log(JSON.stringify(r));console.log(errs.join('\n')||'no errors');await b.close();
})();
