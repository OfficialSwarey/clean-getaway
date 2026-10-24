const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  const run=async(map,fn)=>{await p.evaluate(m=>{__qh.setState("menu");__qh.pickMap(m);__qh.resetGame();__qh.setState("playing");},map);await p.waitForTimeout(200);return p.evaluate(fn);};
  const H=`const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const fresh=()=>{q.resetGame();q.setState("playing");q.DEV.ghost=false;};
    const hold=(k,s)=>{q.keys[k]=true;step(Math.round(s*30));q.keys[k]=false;};
    const promptT=()=>document.getElementById("promptText").textContent;`;
  const res={};
  res.meridian=await run("meridian",new Function(H+`
    // ladder: eye never inside the back wall, never inside the roof slab outside the hatch hole
    fresh();q.DEV.ghost=true;q.P.x=-18;q.P.z=-19;q.P.yaw=0;q.P.pitch=0;step(2);
    const lt=promptT();q.pressE();step(1);let bad=0,maxY=0;
    for(let i=0;i<120&&q.P.climb;i++){step(1);const ey=q.P.y+q.P.eye;maxY=Math.max(maxY,q.P.y);if(ey<4.85&&q.P.z>-18.3&&q.P.z<-17.7)bad++;}
    out.ladderUp={prompt:lt,level:q.P.level,x:q.P.x,z:q.P.z,clipFrames:bad,maxY:+maxY.toFixed(2)};
    step(5);q.pressE();step(1);bad=0;for(let i=0;i<120&&q.P.climb;i++){step(1);const ey=q.P.y+q.P.eye;if(ey<4.85&&q.P.z>-18.3&&q.P.z<-17.7)bad++;}
    out.ladderDown={level:q.P.level,z:+q.P.z.toFixed(2),clipFrames:bad};
    // hatch up
    q.hatches[0].open=true;q.P.x=-9;q.P.z=-14.7;q.P.level=0;q.P.y=0;step(2);q.pressE();step(1);bad=0;
    for(let i=0;i<120&&q.P.climb;i++){step(1);const ey=q.P.y+q.P.eye;if(ey>3.9&&ey<4.4&&!(q.P.x>-9.6&&q.P.x<-8.4&&q.P.z>-15.6&&q.P.z<-14.4))bad++;}
    out.hatchUp={level:q.P.level,clipFrames:bad};
    q.pressE();step(1);bad=0;for(let i=0;i<120&&q.P.climb;i++){step(1);const ey=q.P.y+q.P.eye;if(ey>3.9&&ey<4.4&&!(q.P.x>-9.6&&q.P.x<-8.4&&q.P.z>-15.6&&q.P.z<-14.4))bad++;}
    out.hatchDown={level:q.P.level,clipFrames:bad};
    // camera loop: cam 0 in the lobby corner
    fresh();q.DEV.ghost=true;const c=q.cams[0];q.P.x=c.x-1.0;q.P.z=c.z-0.9;const dx=c.x-q.P.x,dz=c.z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=0.8;step(1);
    const p1=promptT();hold("KeyE",2.1);out.loop={prompt:p1,loopT:+c.loopT.toFixed(1)};
    step(30*20);out.loop.after20=+c.loopT.toFixed(1);const p2=promptT();hold("KeyE",2.1);out.loop.refresh={prompt:p2,loopT:+c.loopT.toFixed(1)};
    // looped camera can't see a masked player standing in its view
    out.loop.alarm=q.G.alarm;q.DEV.ghost=false;q.guards.forEach(g=>{if(!g.security){g.route=[[20,-16]];g.x=20;g.z=-16;}});q.P.masked=true;q.P.pitch=0;q.P.x=4;q.P.z=8;let seen=0;for(let i=0;i<30*10;i++){step(1);if(c.seeDist>=0)seen++;}
    out.loop.seenWhileLooped=seen;c.loopT=0.5;step(30*12);out.loop.liveAgainSeen=c.seeDist>=0||q.G.secAlert>0||q.G.susp>0;
    // lockpick the server room door
    fresh();const d=q.doors.find(d=>d.name==="server room door");q.P.x=-15;q.P.z=-6.8;q.P.yaw=0;q.P.pitch=0;step(1);
    const lp=promptT();q.pressE();step(1);const stillLocked=d.locked&&!d.open;hold("KeyE",2);const mid={pickT:+d.pickT.toFixed(2),prompt:promptT()};
    step(10);hold("KeyE",3.2);const unlocked=!d.locked;q.pressE();step(1);out.pick={prompt:lp,pressEdoesNothing:stillLocked,mid,unlocked,open:d.open};
    // window: closed blocks you, pick opens, jump through
    fresh();const w=q.windows.find(w=>w.name==="loading bay window");q.P.x=21.5;q.P.z=-19;q.P.yaw=Math.PI;q.P.pitch=0;step(1);
    hold("KeyW",1.2);const blockedZ=q.P.z;q.P.x=21.5;q.P.z=-18.8;step(1);const wp=promptT();
    hold("KeyE",3.7);out.window={blockedZ:+blockedZ.toFixed(2),prompt:wp,state:w.state};step(20);
    hold("KeyW",0.8);const noJumpZ=q.P.z;q.keys.KeyW=true;q.tryJump();step(40);q.keys.KeyW=false;step(20);
    out.window.walkOnlyZ=+noJumpZ.toFixed(2);out.window.afterJumpZ=+q.P.z.toFixed(2);out.window.inside=q.P.z>-17.7;
    // smash the other window
    fresh();q.guards[1].route=[[-20,8,0,0]];q.guards[1].x=-20;q.guards[1].z=8;const w2=q.windows.find(w=>w.name==="office window");q.P.masked=true;q.P.raise=1;q.P.x=-27;q.P.z=10;
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-(q.P.y+q.P.eye),Math.hypot(dx,dz));};
    look(-24,1.6,10.3);step(2);look(-24,1.6,10.3);q.P.fireCD=0;q.shoot();step(1);out.smash={state:w2.state,heard:q.guards.some(g=>g.heard)};
    return out;`));
  res.harbor=await run("harbor",new Function(H+`
    fresh();q.DEV.ghost=true;
    // jumps: peak height, then onto an office desk
    q.P.x=-10;q.P.z=-6;step(2);q.tryJump();let pk=0;for(let i=0;i<40;i++){step(1);pk=Math.max(pk,q.P.jh);}out.jump={peak:+pk.toFixed(2),landed:q.P.jh};
    q.P.x=-12.2;q.P.z=-6;q.P.yaw=Math.PI/2;step(2);hold("KeyW",0.5);const xWalk=q.P.x;q.P.x=-12.2;step(1);q.keys.KeyW=true;q.tryJump();step(25);q.keys.KeyW=false;step(10);
    out.desk={walkStopsAt:+xWalk.toFixed(2),onDeskX:+q.P.x.toFixed(2),standing:+q.P.gnd.toFixed(2),stance:(q.updateHUD(),document.getElementById("stance").textContent)};
    // the back door is locked; the front windows still can't be jumped through
    const bd=q.doors.find(d=>d.name==="back door");out.backLocked=bd.locked;
    fresh();q.DEV.ghost=true;q.P.x=-8;q.P.z=11.2;q.P.yaw=Math.PI;q.keys.KeyW=true;q.tryJump();step(40);q.keys.KeyW=false;out.frontWindowZ=+q.P.z.toFixed(2);
    return out;`));
  res.meridianDay=await run("meridianDay",new Function(H+`
    fresh();q.P.x=2;q.P.z=24;
    const c=q.cams[0];q.guards.forEach(g=>{if(!g.security){g.route=[[20,-16]];g.x=20;g.z=-16;}});
    const v=q.civs.find(v=>v.label==="A customer"&&v.route.length===1&&!v.seated);
    let t=0,hit=null;
    for(const [x,z] of [[4,7],[2,10],[-2,6],[6,9],[0,12]]){
      fresh();q.P.x=2;q.P.z=24;v.x=x;v.z=z;v.route=[[x,z,0,0]];v.panic();v.callT=99;v.flee=0;
      for(t=0;t<30*12&&!(q.G.secAlert>0);t++)step(1);
      if(q.G.secAlert>0){hit={at:[x,z],secs:+(t/30).toFixed(1),msg:q.G.secMsg};break;}
    }
    out.camCiv=hit;
    return out;`));
  console.log(JSON.stringify(res,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
