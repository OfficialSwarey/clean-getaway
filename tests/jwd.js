const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');
  const run=src=>p.evaluate(new Function(H+src));
  const out={};
  out.load=await run(`q.setState("menu");q.pickMap("jewelDay");q.resetGame();q.setState("playing");for(let i=0;i<30*20;i++)q.stepGame(1/30);
    const d=q.doors.find(d=>d.name==="shop door");return {state:q.state,alarm:q.G.alarm,guards:q.guards.map(g=>g.name),civs:q.civs.length,doorOpen:d&&d.t,sunny:q.LV.sunny,obj:document.getElementById("objText").textContent.slice(0,60)};`);
  out.walkIn=await run(`go(0,10,0,0);walk(0,60);const a=at();const r=q.restricted(q.P.x,q.P.z);walk(0,20);return {at:a,restricted:r,alarm:q.G.alarm,susp:+q.G.susp.toFixed(2),chip:document.getElementById("maskChip")?document.getElementById("maskChip").textContent:""};`);
  out.pirOff=await run(`go(-5,3.5,0,Math.PI/2);walk(Math.PI/2,40);return {alarm:q.G.alarm,sensorT:q.G.j.sensorT};`);
  out.staff=await run(`go(5.75,1.2,0,0);return {restricted:q.restricted(5.75,-1.0),floor:q.restricted(0,4)};`);
  out.back=await run(`away();q.civs.forEach(c=>{c.x=200;c.z=200;c.route=[[200,200]];});go(6.8,-9.0,0,Math.PI);q.keys.KeyE=true;step(30*7);q.keys.KeyE=false;step(2);q.pressE();step(10);return {delay:q.G.j.delay,alarm:q.G.alarm,open:q.doors.find(d=>d.name==="back door").open};`);
  out.errs=errs;
  console.log(JSON.stringify(out,null,1));
  await b.close();
})();
