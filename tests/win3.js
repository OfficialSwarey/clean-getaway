const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  const out=await p.evaluate(()=>{const q=__qh;q.setState("menu");q.pickMap("port");q.resetGame();q.setState("playing");
      const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
      const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
      q.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});
      const r=[];for(const w of q.windows.filter(w=>w.fixed)){
        for(const sgn of [1,-1]){const nx=w.alongZ?sgn:0,nz=w.alongZ?0:sgn;
          q.P.ladder=null;q.P.x=w.x-nx*0.9;q.P.z=w.z-nz*0.9;q.P.level=w.level;q.P.jh=0;q.P.y=w.level*4;q.P.vy=0;q.P.pitch=0;q.P.yaw=Math.atan2(-nx,-nz);step(1);
          r.push([w.x,w.z,w.level,w.alongZ,sgn,+q.P.x.toFixed(2),+q.P.z.toFixed(2),q.P.level,pr()]);}}
      return r;});
  out.forEach(l=>console.log(JSON.stringify(l)));console.log(errs.join('\n')||'no errors');await b.close();
})();
