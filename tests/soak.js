// 3 minutes of game time per map with everyone patrolling; player parked out of sight.
const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:320,height:180}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  for(const m of ["harbor","harborDay","meridian","meridianDay","club","manor","casino","port","tower","jewel","jewelDay","whiteout"]){
    const r=await p.evaluate(m=>{const q=__qh;q.setState("menu");q.pickMap(m);q.resetGame();q.setState("playing");q.DEV.ghost=true;q.P.y=200;
      const npc=q.guards.concat(q.civs);const st=npc.map(g=>({n:g.name||g.label,moved:0,lx:g.x,lz:g.z,nan:false,maxStill:0,still:0,route:g.route.length}));
      let err=null;
      try{for(let i=0;i<30*180;i++){q.stepGame(1/30);if(i%30===0)q.sbCheck&&0;npc.forEach((g,k)=>{const s=st[k];const d=Math.hypot(g.x-s.lx,g.z-s.lz);s.moved+=d;if(d<0.001)s.still++;else{s.maxStill=Math.max(s.maxStill,s.still);s.still=0;}s.lx=g.x;s.lz=g.z;if(!isFinite(g.x)||!isFinite(g.z))s.nan=true;});if(q.state!=="playing")break;}}catch(e){err=e.message+" "+(e.stack||"").split("\n")[1];}
      st.forEach(s=>{s.maxStill=Math.max(s.maxStill,s.still);});
      const stuck=st.filter(s=>s.route>1&&s.maxStill>30*40).map(s=>s.n+" still "+(s.maxStill/30|0)+"s @"+s.lx.toFixed(1)+","+s.lz.toFixed(1));
      const nan=st.filter(s=>s.nan).map(s=>s.n);
      return {state:q.state,alarm:q.G.alarm,err,stuck,nan,moved:st.filter(s=>s.route>1).map(s=>s.n+":"+(s.moved|0)).join(" ")};},m);
    console.log(m,JSON.stringify(r));
  }
  console.log(errs.join("\n")||"no page errors");await b.close();
})();
