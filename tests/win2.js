const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:640,height:360}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  const out={};
  for(const m of ["meridian","manor","casino","port"]){
    out[m]=await p.evaluate(m=>{const q=__qh;q.setState("menu");q.pickMap(m);q.resetGame();q.setState("playing");
      const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
      const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
      q.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});q.cams.forEach(c=>c.dead=true);
      q.civs&&q.civs.forEach(c=>{c.x=200;c.z=200;});
      const ws=q.windows.filter(w=>w.fixed);const w=ws.sort((a,b)=>b.level-a.level)[0];if(!w)return {none:true};
      // stand 1m inside facing window; try both sides
      let res=null;
      for(const sgn of [1,-1]){
        const nx=w.alongZ?sgn:0,nz=w.alongZ?0:sgn;
        q.P.ladder=null;q.P.x=w.x-nx*0.9;q.P.z=w.z-nz*0.9;q.P.level=w.level;q.P.jh=0;q.P.y=w.level*4;q.P.vy=0;q.P.pitch=0;
        q.P.yaw=Math.atan2(-nx,-nz);step(1);const a=pr();
        if(!/smash/i.test(a))continue;
        q.pressF();step(10);const st=w.state;
        q.keys.KeyW=true;step(4);q.tryJump();step(30);q.keys.KeyW=false;step(60);
        res={sgn,prompt:a,state:st,lvl:w.level,at:{x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),lvl:q.P.level},alarmish:q.G.alarm};break;
      }
      return res||{fail:true,w:{x:w.x,z:w.z,l:w.level}};
    },m);
  }
  console.log(JSON.stringify(out,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
