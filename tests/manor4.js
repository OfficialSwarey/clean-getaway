const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:960,height:540}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="manor"]');await p.waitForTimeout(1200);await p.click('#startBtn');await p.waitForTimeout(1200);
  const shot=async(f,n)=>{await p.evaluate(f);await p.waitForTimeout(500);await p.screenshot({path:n});};
  const go=(x,z,l,yaw,pitch)=>`const q=__qh;q.DEV.ghost=false;q.P.x=${x};q.P.z=${z};q.P.level=${l};q.P.jh=0;q.P.y=${l}*4;q.P.yaw=${yaw};q.P.pitch=${pitch};for(let i=0;i<2;i++)q.stepGame(1/30);`;
  await shot(new Function(go(2,-7.6,1,0,-0.35)),'91-owner.png');
  await shot(new Function(go(-14.5,-5.5,0,Math.PI/2,0.05)),'92-books.png');
  await shot(new Function(`__qh.G.m.secretOpen=true;`+go(-14,-8,0,Math.PI/2+0.6,0)+`for(let i=0;i<60;i++)q.stepGame(1/30);`),'93-secret.png');
  await shot(new Function(go(-18.5,-10.5,0,Math.PI,-0.45)),'94-secret-stairs.png');
  await shot(new Function(go(18.6,-2.7,0,0,-0.4)),'95-kitchen-stairs.png');
  await shot(new Function(go(4.6,16.4,0,0,0.35)),'96-trellis.png');
  await shot(new Function(go(10,-4,-1,-2.2,-0.05)),'97-cellar.png');
  await shot(new Function(go(4,-1.5,2,0.4,-0.1)),'98-attic.png');
  console.log(errs.join('\n')||'no errors');await b.close();
})();
