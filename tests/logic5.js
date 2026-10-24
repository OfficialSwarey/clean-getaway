const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:400,height:225}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('#startBtn');await p.waitForTimeout(1500);
  console.log(JSON.stringify(await p.evaluate(()=>{
    const q=__qh;const step=()=>q.stepGame(1/30);
    q.resetGame();q.setState("playing");q.P.masked=true;q.P.raise=1;
    q.P.x=0;q.P.z=-3.2;q.P.yaw=0;q.P.pitch=0;step();q.pressE();step();
    const started=q.G.drilling;q.P.x=2;q.P.z=25;const gg=q.guards[2];gg.x=-3;gg.z=-2;gg.yaw=Math.PI/2;gg.wp=6;
    let heardAt=null,who=null,minD=99;
    for(let i=0;i<600&&q.G.drilling;i++){step();for(const g of q.guards){const d=Math.hypot(g.x-0.45,g.z+4.5);if(d<minD)minD=d;if(!heardAt&&g.heard&&Math.abs(g.heard.z+4.5)<0.1){heardAt=+(i/30).toFixed(1);who=q.guards.indexOf(g);}}}
    return {started,heardAt,who,closestGuard:+minD.toFixed(1),vaultOpen:q.G.vaultOpen};
  })));
  console.log(errs.join('\n')||'no page errors');await b.close();
})();
