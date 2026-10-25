const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:960,height:540}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="harbor"]');await p.waitForTimeout(400);await p.click('#startBtn');await p.waitForTimeout(1000);
  await p.evaluate(()=>{const q=__qh;q.DEV.ghost=true;const c=q.CASH[2];q.P.x=c.x;q.P.z=c.z+1.0;q.P.yaw=0;q.P.pitch=-0.45;for(let i=0;i<3;i++)q.stepGame(1/30);});
  await p.waitForTimeout(300);await p.screenshot({path:'71-cash.png'});
  await p.evaluate(()=>{const q=__qh;q.pressE();q.stepGame(1/30);q.G.vaultOpen=true;q.P.masked=true;const b=q.bags[1];q.P.x=b.mesh.position.x;q.P.z=b.mesh.position.z+1;q.P.yaw=0;q.P.pitch=-0.5;q.stepGame(1/30);q.keys.KeyE=true;for(let i=0;i<70;i++)q.stepGame(1/30);q.keys.KeyE=false;q.stepGame(1/30);q.P.x=q.SECURE.x+0.6;q.P.z=q.SECURE.z+0.3;q.P.yaw=-Math.PI/2;q.P.pitch=-0.2;q.pressE();q.stepGame(1/30);q.keys.KeyE=false;for(let i=0;i<3;i++)q.stepGame(1/30);q.keys.KeyE=true;for(let i=0;i<20;i++)q.stepGame(1/30);});
  await p.waitForTimeout(300);await p.screenshot({path:'72-driveoff.png'});
  await p.evaluate(()=>{const q=__qh;for(let i=0;i<30;i++)q.stepGame(1/30);q.keys.KeyE=false;});
  await p.waitForTimeout(400);await p.screenshot({path:'73-end.png'});
  console.log(errs.join('\n')||'no errors');await b.close();
})();
