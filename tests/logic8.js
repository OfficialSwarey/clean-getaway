const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))errs.push('CONSOLE '+m.text().slice(0,300));});
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="harborDay"]');await p.waitForTimeout(500);
  await p.click('#startBtn');await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const look=(x,y,z)=>{const dx=x-q.P.x,dz=z-q.P.z;q.P.yaw=Math.atan2(-dx,-dz);q.P.pitch=Math.atan2(y-(q.P.y+q.P.eye),Math.hypot(dx,dz));};
    const fresh=()=>{q.resetGame();q.setState("playing");};
    const C=l=>q.civs.filter(c=>c.label===l);
    out.map={id:q.LV.id,day:q.LV.day,guards:q.guards.length,civs:q.civs.length,ties:q.P.ties,frontOpen:q.doors.find(d=>d.name==="front door").open};
    // unmasked in the public lobby: nobody cares
    fresh();q.P.x=0;q.P.z=7;q.P.yaw=0;step(150);
    out.lobby={susp:+q.G.susp.toFixed(2),civMax:+Math.max(...q.civs.map(c=>c.sus)).toFixed(2),restricted:q.restricted(0,7),alarm:q.G.alarm};
    // unmasked behind the counter: tellers notice you
    fresh();const t=C("A teller")[1];q.P.x=t.x;q.P.z=t.z+-3.5;q.G.susp=0;
    // keep guards away
    q.guards.forEach(g=>{g.route=[[-14,-11]];g.x=-14;g.z=-11;});
    let panicked=false,steps=0;for(;steps<200&&!panicked;steps++){step(1);q.G.susp=0;if(q.civs.some(c=>c.state==="calling"))panicked=true;}
    out.trespass={restricted:q.restricted(q.P.x,q.P.z),panicked,afterSec:+(steps/30).toFixed(1)};
    // masked in lobby: customer panics and calls; call completes -> alarm
    fresh();q.guards.forEach(g=>{g.route=[[-14,-11]];g.x=-14;g.z=-11;});
    q.P.masked=true;q.P.raise=1;q.P.x=0;q.P.z=9;const cu=C("A customer")[0];look(cu.x,1.4,cu.z);
    let st=0;for(;st<100&&cu.state!=="calling";st++)step(1);
    out.call={state:cu.state,secsToPanic:+(st/30).toFixed(2)};
    step(30*7);out.call.alarm=q.G.alarm;
    // stop the call by shouting
    fresh();q.guards.forEach(g=>{g.route=[[-14,-11]];g.x=-14;g.z=-11;});
    q.P.masked=true;q.P.raise=1;q.P.x=0;q.P.z=9;look(cu.x,1.4,cu.z);
    for(let i=0;i<60&&cu.state!=="calling";i++)step(1);
    step(30);look(cu.x,1.2,cu.z);const tgt=q.shoutTarget();q.pressF();step(2);
    out.shout={target:tgt?tgt.label:null,state:cu.state,others:q.civs.map(c=>c.state).join(","),alarm:q.G.alarm};
    // zip-tie
    q.P.x=cu.x;q.P.z=cu.z+1.2;look(cu.x,0.8,cu.z);q.keys.KeyE=true;step(40);q.keys.KeyE=false;step(1);
    out.tie={state:cu.state,ties:q.P.ties};
    // follow me
    q.pressE();step(1);out.tie.follow=cu.follow;
    const path=[[0,9],[8,9],[8,6],[-4,6]];
    for(const [x,z] of path){for(let i=0;i<120;i++){const dx=x-q.P.x,dz=z-q.P.z,d=Math.hypot(dx,dz);if(d<0.2)break;q.P.yaw=Math.atan2(-dx,-dz);q.keys.KeyW=true;step(1);}}
    q.keys.KeyW=false;step(60);
    out.follow={civ:[+cu.x.toFixed(1),+cu.z.toFixed(1)],player:[+q.P.x.toFixed(1),+q.P.z.toFixed(1)],dist:+Math.hypot(cu.x-q.P.x,cu.z-q.P.z).toFixed(2)};
    look(cu.x,0.8,cu.z);q.pressE();step(1);out.follow.stays=!cu.follow;
    // guard sees a hostage -> alarm
    const m=q.guards[0];m.route=[[cu.x,cu.z-5]];m.x=cu.x;m.z=cu.z-5;m.yaw=0;m.face=0;q.P.x=14;q.P.z=10;
    for(let i=0;i<200&&!q.G.alarm;i++)step(1);
    out.hostageSeen={alarm:q.G.alarm,toast:document.getElementById("toast").textContent};
    // shoot a civilian, bag the body
    fresh();q.guards.forEach(g=>{g.route=[[-14,-11]];g.x=-14;g.z=-11;});
    const bench=C("A customer")[3];q.P.masked=true;q.P.raise=1;q.P.x=bench.x;q.P.z=bench.z-3;
    look(bench.x,1.0,bench.z);step(1);look(bench.x,1.0,bench.z);q.P.fireCD=0;q.shoot();step(40);
    out.kill={dead:bench.dead,civKills:q.G.civKills};
    q.P.x=bench.x;q.P.z=bench.z-1.3;look(bench.x,0.3,bench.z);q.keys.KeyE=true;step(70);q.keys.KeyE=false;
    out.kill.carrying=q.P.carry&&q.P.carry.kind;
    // ADS toggle via real mouse events
    fresh();q.P.masked=true;q.P.raise=1;
    const cv=q.renderer.domElement;cv.dispatchEvent(new MouseEvent("mousedown",{button:2,bubbles:true}));step(1);const a1=q.P.aim;
    window.dispatchEvent(new MouseEvent("mouseup",{button:2,bubbles:true}));step(10);const a2=q.P.aim,aimT=q.P.aimT;
    cv.dispatchEvent(new MouseEvent("mousedown",{button:2,bubbles:true}));step(10);
    out.ads={afterClick:a1,afterRelease:a2,aimT:+aimT.toFixed(2),afterSecondClick:q.P.aim};
    // night harbor: open door leaf hides you
    q.pickMap("harbor");fresh();
    const od=q.doors.find(d=>d.name==="office door");q.openDoor(od,od.x,od.z+1,false);step(30);
    out.leaf={leafCols:od.leafCols&&od.leafCols.map(c=>[c.minX,c.maxX,c.minZ,c.maxZ].map(v=>+v.toFixed(2)))};
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  console.log(errs.join('\n')||'no errors');await b.close();
})();
