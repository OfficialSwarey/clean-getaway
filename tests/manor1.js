const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:960,height:540}});
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+'\n'+(e.stack||'').split('\n').slice(0,4).join('\n')));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
  await p.click('.job[data-map="manor"]');await p.waitForTimeout(1500);
  await p.screenshot({path:'80-manor-menu.png'});
  await p.click('#startBtn');await p.waitForTimeout(1500);
  const r=await p.evaluate(()=>{
    const q=__qh,out={};q.DEV.ghost=false;
    q.guards.forEach(g=>{g.route=[[40,40]];g.x=40;g.z=40;});q.cams.forEach(c=>c.dead=true);q.civs.forEach(c=>{if(c.label!=="Lord Blackwood"){c.route=[[40,41]];c.x=40;c.z=41;}});
    const step=n=>{for(let i=0;i<n;i++){q.stepGame(1/30);if(q.state!=="playing")break;}};
    const walk=(yaw,secs)=>{q.P.yaw=yaw;q.keys.KeyW=true;step(Math.round(secs*30));q.keys.KeyW=false;step(2);};
    const at=()=>({x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),y:+q.P.y.toFixed(2),lvl:q.P.level});
    out.counts={guards:q.guards.length,civs:q.civs.length,cams:q.cams.length,doors:q.doors.length,windows:q.windows.length,bags:q.bags.length,stairs:q.STAIRS.length,ladders:q.LADDERS.length,cash:q.CASH.length};
    // grand staircase up (rises toward -z) and back down
    q.P.x=0;q.P.z=10.6;q.P.level=0;q.P.jh=0;step(1);walk(0,4);out.grandUp=at();
    walk(Math.PI,4);out.grandDown=at();
    // walking into the stairs from the side at level 0 is blocked
    q.P.x=3;q.P.z=6;walk(Math.PI/2,2);out.sideBlock=at();
    // kitchen stairs down to the cellar (descend toward -z), and back up
    q.P.x=18.6;q.P.z=-1.0;q.P.level=0;q.P.jh=0;step(1);walk(0,4);out.cellarDown=at();
    walk(Math.PI,4);out.cellarUp=at();
    // servants' stairs to the attic
    q.P.x=18.6;q.P.z=-11.2;q.P.level=1;q.P.jh=0;step(1);walk(Math.PI,4);out.atticUp=at();
    walk(0,4);out.atticDown=at();
    // secret stairs: blocked by the bookcase until it opens
    q.P.x=-15;q.P.z=-10;q.P.level=0;q.P.jh=0;step(1);walk(-Math.PI/2,2);out.bookcaseBlocks=at();
    // trellis to the balcony
    q.P.x=4.6;q.P.z=15.6;q.P.level=0;q.P.jh=0;q.P.yaw=0;step(1);const tp=document.getElementById("promptText").textContent;q.pressE();step(1);q.keys.KeyW=true;step(90);q.keys.KeyW=false;step(40);
    out.trellis={prompt:tp,...at()};
    // balcony window: pick it, go in
    q.P.yaw=0;step(1);out.balconyPrompt=document.getElementById("promptText").textContent;
    return out;});
  console.log(JSON.stringify(r,null,1));
  const shot=async(f,n)=>{await p.evaluate(f);await p.waitForTimeout(500);await p.screenshot({path:n});};
  await shot(()=>{const q=__qh;q.DEV.ghost=true;q.P.x=0;q.P.z=36;q.P.y=1.5;q.P.yaw=0;q.P.pitch=0.05;q.stepGame(1/30);},'81-gate.png');
  await shot(()=>{const q=__qh;q.P.x=-14;q.P.z=26;q.P.y=6;q.P.yaw=-0.5;q.P.pitch=-0.2;q.stepGame(1/30);},'82-house.png');
  await shot(()=>{const q=__qh;q.DEV.ghost=false;q.P.x=0;q.P.z=11;q.P.level=0;q.P.jh=0;q.P.y=0;q.P.yaw=0;q.P.pitch=0.15;q.stepGame(1/30);},'83-foyer.png');
  await shot(()=>{const q=__qh;q.P.x=-9;q.P.z=-5;q.P.level=0;q.P.yaw=Math.PI/2+0.15;q.P.pitch=0.05;q.stepGame(1/30);},'84-library.png');
  await shot(()=>{const q=__qh;q.P.x=-8;q.P.z=8;q.P.level=1;q.P.jh=0;q.P.yaw=Math.PI/2;q.P.pitch=-0.1;q.stepGame(1/30);},'85-gallery.png');
  await shot(()=>{const q=__qh;q.P.x=5;q.P.z=-4;q.P.level=1;q.P.jh=0;q.P.yaw=0.6;q.P.pitch=-0.25;q.stepGame(1/30);},'86-master.png');
  await shot(()=>{const q=__qh;q.P.x=-8.5;q.P.z=-1.2;q.P.level=-1;q.P.jh=0;q.P.yaw=0;q.P.pitch=-0.05;q.stepGame(1/30);},'87-lasers.png');
  await shot(()=>{const q=__qh;q.G.vaultOpen=true;q.P.x=-8.5;q.P.z=-15.2;q.P.level=-1;q.P.jh=0;q.P.yaw=0;q.P.pitch=-0.25;q.stepGame(1/30);},'88-vault.png');
  await shot(()=>{const q=__qh;q.G.vaultOpen=false;q.P.x=10;q.P.z=-4;q.P.level=-1;q.P.jh=0;q.P.yaw=-2.2;q.P.pitch=-0.05;q.stepGame(1/30);},'89-cellar.png');
  await shot(()=>{const q=__qh;q.P.x=4;q.P.z=-1.5;q.P.level=2;q.P.jh=0;q.P.yaw=0.4;q.P.pitch=-0.1;q.stepGame(1/30);},'90-attic.png');
  console.log(errs.join('\n')||'no errors');await b.close();
})();
