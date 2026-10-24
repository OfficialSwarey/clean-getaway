const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{const q=__qh;q.setState("menu");q.pickMap("casino");q.resetGame();q.setState("playing");
    const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const pr=()=>document.getElementById("prompt").hidden?"(hidden)":document.getElementById("promptText").textContent;
    const out={};const m=q.civs.find(c=>c.label==="The manager");
    out.m0={state:m.state,level:m.level,x:m.x,z:m.z};
    q.guards.forEach(g=>{g.route=[[50,50],[50,51]];g.wp=0;g.x=50;g.z=50;});
    q.P.x=25.3;q.P.z=-3.7;q.P.level=0;q.P.jh=0;q.P.yaw=0;step(2);out.fire={prompt:pr(),state:q.state,lad:q.LADDERS.map(l=>[l.x,l.z,l.lo])};
    return out;});
  console.log(JSON.stringify(r,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
