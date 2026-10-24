const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
  const p=await b.newPage({viewport:{width:800,height:450}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="club"]');await p.waitForTimeout(500);await p.click('#startBtn');await p.waitForTimeout(1000);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const fresh=()=>{q.resetGame();q.setState("playing");q.DEV.ghost=false;};
    const hold=(k,s)=>{q.keys[k]=true;step(Math.round(s*30));q.keys[k]=false;};
    const promptT=()=>document.getElementById("promptText").textContent;
    // walk in the front door and down the middle to the staff door, unmasked
    fresh();q.P.x=0;q.P.z=18;q.P.yaw=0;q.keys.KeyW=true;let t=0;for(;t<30*12&&q.P.z>-0.6;t++)step(1);q.keys.KeyW=false;
    const reach={z:+q.P.z.toFixed(2),secs:+(t/30).toFixed(1),noiseWalk:q.G.noise,stance:(q.updateHUD(),document.getElementById("stance").textContent)};
    // hang around the dance floor for 30 s: nobody cares
    q.P.x=-6;q.P.z=5;let maxSus=0;for(let i=0;i<30*30;i++){step(1);for(const c of q.civs)maxSus=Math.max(maxSus,c.sus);}
    out.walkIn={...reach,maxCivSusOnFloor:+maxSus.toFixed(2),alarm:q.G.alarm,calling:q.civs.filter(c=>c.state==="calling").length,gsusp:+q.G.susp.toFixed(2)};
    // behind the bar: bartender notices
    fresh();q.P.x=14.4;q.P.z=12.6;q.P.yaw=0;let t2=0;for(;t2<30*15&&!q.civs.some(c=>c.label==="A bartender"&&c.sus>0.3)&&!(q.G.susp>0.3);t2++)step(1);
    out.behindBar={restricted:q.restricted(q.P.x,q.P.z),noticedAfter:+(t2/30).toFixed(1)};
    // VIP is staff only, dance floor isn't
    out.zones={vip:q.restricted(-15,12),floor:q.restricted(-6,6),bar:q.restricted(12,5),behindBar:q.restricted(15,5),coat:q.restricted(-4.5,13),corridor:q.restricted(0,-3.5),street:q.restricted(0,20)};
    // masked on the dance floor: someone calls the police fast
    fresh();q.P.x=-6;q.P.z=1;q.P.masked=true;q.P.raise=1;let t3=0;for(;t3<30*10&&!q.civs.some(c=>c.state==="calling");t3++)step(1);
    out.masked={callAfter:+(t3/30).toFixed(1)};
    // music: playing in the hall, cut on alarm, house lights up
    fresh();q.P.x=-6;q.P.z=5;step(30);const m=q.A.music;
    out.music={exists:!!m};
    q.P.masked=true;q.P.x=-6;q.P.z=5;
    // office: pick the door, drill, safe opens, bag to the van
    fresh();q.DEV.ghost=true;q.P.x=-2;q.P.z=-3.6;q.P.yaw=0;step(1);const op=promptT();hold("KeyE",5.2);const ofd=q.doors.find(d=>d.name==="office door");
    q.pressE();step(20);out.office={prompt:op,unlocked:!ofd.locked,open:ofd.open};
    q.P.masked=true;q.P.raise=1;q.P.x=-2;q.P.z=-9.4;q.P.yaw=0;step(1);const dp=promptT();q.pressE();step(1);step(30*21);
    out.safe={prompt:dp,open:q.G.vaultOpen};
    q.P.x=-1.2;q.P.z=-13.6;q.P.yaw=0;q.P.pitch=-0.4;step(1);const lp=promptT();q.pressE();step(1);out.loot={prompt:lp,carry:q.P.carry&&q.P.carry.kind};
    // carry out through the loading door to the van
    q.P.x=17.0;q.P.z=-11;step(1);const ld=q.doors.find(d=>d.name==="loading door");ld.locked=false;q.openDoor(ld,17,-11,false);step(20);
    q.P.yaw=-Math.PI/2;q.keys.KeyD=false;q.keys.KeyW=true;step(30*1.2);q.keys.KeyW=false;const outX=q.P.x;
    // walk north to the van ring
    q.P.x=19.4;q.P.yaw=Math.PI;q.keys.KeyW=true;let t4=0;for(;t4<30*6&&Math.hypot(q.SECURE.x-q.P.x,q.SECURE.z-q.P.z)>1.5;t4++)step(1);q.keys.KeyW=false;
    step(1);const vp=promptT();q.pressE();step(1);
    out.van={outsideX:+outX.toFixed(2),secure:[+q.SECURE.x.toFixed(1),q.SECURE.z],at:[+q.P.x.toFixed(2),+q.P.z.toFixed(2)],prompt:vp,secured:q.G.secured};
    // security room: keycard door, operator, cameras
    fresh();const sd=q.doors.find(d=>d.name==="security door");out.sec={locked:sd.locked,reader:!!sd.reader,op:q.secGuard&&q.secGuard.name,keycard:!!q.KEYCARD};
    // alarm kills the music
    fresh();q.P.x=-6;q.P.z=5;step(30);const g1=m?m.out.gain.value:null;q.P.masked=true;
    // trigger alarm directly via a caller
    const c=q.civs.find(c=>c.label==="A clubber");c.panic();c.callT=0.1;step(60);
    out.alarm={alarm:q.G.alarm,musicGainBefore:g1&&+g1.toFixed(3),musicGainAfter:m&&+m.out.gain.value.toFixed(3),cowering:q.civs.filter(c=>c.state==="cower").length};
    return out;
  });
  console.log(JSON.stringify(r,null,1));console.log(errs.join('\n')||'no errors');await b.close();
})();
