const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:960,height:540}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};q.setState("menu");q.pickMap("meridian");q.resetGame();q.setState("playing");q.DEV.on=true;q.DEV.ghost=false;
    const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const pr=()=>document.getElementById("prompt").hidden?"":document.getElementById("promptText").textContent;
    // outside ladder: grab, climb, top
    q.guards.forEach(g=>{g.route=[[30,30]];g.x=30;g.z=30;});q.cams.forEach(c=>c.dead=true);
    q.P.x=-18;q.P.z=-19.4;q.P.yaw=Math.PI;step(1);out.p1=pr();q.pressE();step(1);out.onLadder=!!q.P.ladder;
    q.keys.KeyW=true;step(30);out.half={y:+q.P.y.toFixed(2),z:q.P.z};step(60);q.keys.KeyW=false;step(40);
    out.top={level:q.P.level,x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),ladder:!!q.P.ladder};
    // climb down from the top
    step(1);out.p2=pr();q.pressE();step(40);out.downGrab={ladder:!!q.P.ladder,y:+q.P.y.toFixed(2)};
    q.keys.KeyS=true;step(30);out.mid=+q.P.y.toFixed(2);q.keys.KeyS=false;
    q.tryJump();step(40);out.letGo={ladder:!!q.P.ladder,level:q.P.level,y:+q.P.y.toFixed(2),z:+q.P.z.toFixed(2)};
    // hatch ladder: hatch closed, climb up from storage pushes it open
    q.P.x=-9;q.P.z=-14.6;q.P.yaw=0;q.P.level=0;q.P.jh=0;step(2);out.p3=pr();q.pressE();step(1);q.keys.KeyW=true;step(70);q.keys.KeyW=false;step(40);
    out.hatch={level:q.P.level,z:+q.P.z.toFixed(2),open:q.hatches[0].open};
    // noclip: fly up out of the building, through the wall; drop back down
    q.DEV.ghost=true;q.P.x=0;q.P.z=0;q.P.level=0;q.P.y=0;q.P.yaw=0;q.P.pitch=0;q.keys.KeyW=true;step(60);q.keys.KeyW=false;
    out.fly={z:+q.P.z.toFixed(1)};q.keys.Space=true;step(30);q.keys.Space=false;out.flyUp={y:+q.P.y.toFixed(1),level:q.P.level};
    q.DEV.ghost=false;q.settleAfterGhost();step(90);out.landed={level:q.P.level,y:+q.P.y.toFixed(2),x:q.P.x,z:+q.P.z.toFixed(1)};
    // noclip above the roof, release: land on the roof
    q.DEV.ghost=true;q.P.x=0;q.P.z=5;q.P.y=9;step(2);q.DEV.ghost=false;q.settleAfterGhost();step(90);out.roof={level:q.P.level,y:+q.P.y.toFixed(2)};
    return out;});
  console.log(JSON.stringify(r,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
