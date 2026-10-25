// Co-op part 6: the long jobs in co-op. What the guest does on each one counts on the host:
// Manor (a wall that appears later reaches the guest, the guest trips the laser grid), Casino (the guest's own uniform,
// the anteroom sensors), Tower (the guest rides the elevator), Port (the hatch opens under the guest), Whiteout
// (the guest leaves footprints both see, the guest trips a laser lane).
const {setup,wait}=require('./coopH');
(async()=>{
const only=(process.argv[2]||"manor,casino,tower,port,whiteout").split(",");
const {H,G,errs,close,T}=await setup(only[0]);
const out={};
const hostWait=async s=>{const t0=await H.evaluate(()=>__qh.G.time);await H.waitForFunction(([t,s])=>__qh.G.time>t+s,[t0,s],{timeout:T}).catch(()=>{});};
const switchMap=async m=>{
  await H.evaluate(()=>document.getElementById('pauseMenuBtn').click());
  await G.waitForFunction(()=>__qh.state==='menu',null,{timeout:T}).catch(()=>{});
  await H.evaluate(m=>__qh.pickMap(m),m);await wait(300);
  await H.evaluate(()=>document.getElementById('startBtn').click());
  await G.waitForFunction(()=>__qh.state==='paused'&&document.getElementById('resumeBtn').textContent==='Join the job',null,{timeout:T});
  await G.evaluate(()=>document.getElementById('resumeBtn').click());
  await H.waitForFunction(()=>__qh.state==='playing'&&__qh.PLAYERS[1].ready,null,{timeout:T});
};
// guards out of the way so nobody spots anyone while we test
const clear=()=>H.evaluate(()=>{__qh.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;g.level=0;});});
const put=(x,z,l,extra)=>G.evaluate(([x,z,l,e])=>{const P=__qh.P;P.x=x;P.z=z;P.level=l;P.y=l*__qh.ROOF_Y;P.jh=0;P.vy=0;Object.assign(P,e||{});},[x,z,l,extra||{}]);
for(let i=0;i<only.length;i++){
  const m=only[i];if(i>0)await switchMap(m);
  await clear();await wait(500);
  // the guest's game must be in play (not on the pause screen) for key presses to count
  for(let k=0;k<5&&await G.evaluate(()=>__qh.state!=='playing');k++){await G.evaluate(()=>document.getElementById('resumeBtn').click());await wait(600);}
  const r={};
  if(m==="manor"){
    // the bookcase leaf is a wall the map keeps for later: it has to reach the guest too
    await H.evaluate(()=>{const q=__qh,X=q.LV.def.X;q.G.m.secretOpen=true;const i=q.colliders.indexOf(X.secretCol);if(i>=0)q.colliders.splice(i,1);q.colliders.push(X.secretLeaf);});
    await hostWait(1);await wait(800);
    r.leaf=await G.evaluate(()=>{const q=__qh,X=q.LV.def.X;return {leaf:q.colliders.includes(X.secretLeaf),gone:!q.colliders.includes(X.secretCol)};});
    // the guest walks into the laser grid in the basement
    const z=await G.evaluate(()=>__qh.LV.def.X.lzs[0]);
    await put(-8.5,z,-1);await hostWait(1);
    r.laser=await H.evaluate(()=>({alarm:__qh.G.alarm,guestLvl:__qh.PLAYERS[1].P.level,msg:document.getElementById('status')?.textContent?.slice(0,60)}));
  }
  if(m==="casino"){
    // the guest picks a locker: the guest wears the uniform, the host doesn't
    await put(-19,-14.2,0,{masked:false});await hostWait(0.5);
    await G.keyboard.down('KeyE');await hostWait(3.6);await G.keyboard.up('KeyE');await wait(500);
    r.uniform=await H.evaluate(()=>({guest:!!__qh.PLAYERS[1].P.uniform,host:!!__qh.P.uniform,holdT:+(__qh.G.c.holdT||0).toFixed(2)}));
    // the guest sprints through the vault anteroom: the sensors trip
    await put(0,-11,-1);await G.keyboard.down('KeyW');await hostWait(1.5);await G.keyboard.up('KeyW');
    r.sensors=await H.evaluate(()=>({alarm:__qh.G.alarm,lvl:__qh.PLAYERS[1].P.level,sensorT:+__qh.G.c.sensorT.toFixed(2)}));
  }
  if(m==="tower"){
    await H.evaluate(()=>{const d=__qh.LV.def;if(__qh.G.t.el.lvl!==0)d.elCall(0);});
    await H.waitForFunction(()=>__qh.G.t.el.lvl===0&&!__qh.G.t.el.moving,null,{timeout:T}).catch(()=>{});
    await put(-3.3,-0.5,0);await hostWait(0.6);await wait(400);
    await G.keyboard.press('Digit1');
    await H.waitForFunction(()=>__qh.G.t.el.moving,null,{timeout:T}).catch(()=>{});
    let drove=false;for(let k=0;k<30;k++){if(await H.evaluate(()=>__qh.PLAYERS[1].hd)){drove=true;break;}await wait(100);}
    await H.waitForFunction(()=>!__qh.G.t.el.moving,null,{timeout:T}).catch(()=>{});
    await hostWait(0.5);await wait(800);
    r.elevator={drove,carLvl:await H.evaluate(()=>__qh.G.t.el.lvl),hostSide:await H.evaluate(()=>{const p=__qh.PLAYERS[1].P;return [p.level,+p.y.toFixed(2)];}),guestSide:await G.evaluate(()=>{const P=__qh.P;return [P.level,+P.y.toFixed(2),__qh.G.t.el.lvl];})};
    // and the shaft door opens for the guest standing at it on floor 1
    await put(-5.0,-0.5,1);await hostWait(1.2);
    r.shaftDoor=await H.evaluate(()=>+__qh.LV.def.X.shaftDoors[1].t.toFixed(2));
  }
  if(m==="port"){
    // the guest stands on the deck over the hatch; the host opens it: the guest drops into the hold
    await put(-7,31,1);await hostWait(0.8);
    await H.evaluate(()=>{__qh.G.p.hatchOpen=true;});
    await hostWait(2.5);await wait(800);
    r.hatch={guestKnows:await G.evaluate(()=>__qh.G.p.hatchOpen),guestLvl:await G.evaluate(()=>__qh.P.level),hostSide:await H.evaluate(()=>__qh.PLAYERS[1].P.level)};
  }
  if(m==="whiteout"){
    // the guest walks through fresh snow: prints on both screens
    const spot=await G.evaluate(()=>{for(let x=-30;x<40;x+=1.5)for(let z=-30;z<40;z+=1.5)if(__qh.woOutdoor(x,z,0)&&!__qh.woOnPath(x,z)&&__qh.woOutdoor(x,z-4,0)&&!__qh.woOnPath(x,z-4)&&__qh.colliders.every(c=>(c.lvl||0)!==0||x<c.minX-1||x>c.maxX+1||z<c.minZ-5||z>c.maxZ+1))return [x,z];return null;});
    r.spot=spot;
    if(spot){
      await put(spot[0],spot[1],0,{yaw:0});const n0=await H.evaluate(()=>__qh.G.w.prints.length);
      await G.keyboard.down('KeyW');await hostWait(1.8);await G.keyboard.up('KeyW');await wait(800);
      r.prints={host:(await H.evaluate(()=>__qh.G.w.prints.length))-n0,guest:await G.evaluate(()=>__qh.G.w.prints.length),fog:[await H.evaluate(()=>+__qh.scene.fog.density.toFixed(3)),await G.evaluate(()=>+__qh.scene.fog.density.toFixed(3))]};
    }
    // a laser lane: stand in it and wait for the beams
    await H.evaluate(()=>{__qh.G.w.lasersOff=false;});
    const lx=await G.evaluate(()=>__qh.LV.def.X.lanes[0].x);
    await put(lx,3,0);await hostWait(5.5);
    r.laser=await H.evaluate(()=>({alarm:__qh.G.alarm,guestAt:[+__qh.PLAYERS[1].P.x.toFixed(1),__qh.PLAYERS[1].P.level]}));
  }
  r.state=[await H.evaluate(()=>__qh.state),await G.evaluate(()=>__qh.state)];r.errs=errs.length;
  out[m]=r;console.log(m,JSON.stringify(r));
}
console.log(errs.join("\n")||"no errors");
await close();})();
