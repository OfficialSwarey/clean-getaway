// Co-op part 2: the guest opens a door, shoots a guard, gets caught; the host plays on and ends the job.
const {setup,wait}=require('./coopH');
(async()=>{
const {H,G,errs,close,T}=await setup('harbor');
const out={};
await H.evaluate(()=>{__qh.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});});
// 1) a door: the guest stands in front of an unlocked one and presses E
const door=await H.evaluate(()=>{const ds=__qh.doors;const i=ds.findIndex(d=>!d.locked&&!d.open&&d.level===0&&!d.glass);const d=ds[i];return {i,x:d.x,z:d.z,rot:d.rot,name:d.name};});
out.door=door;
await G.evaluate(d=>{const P=__qh.P,nx=Math.sin(d.rot),nz=Math.cos(d.rot);P.x=d.x+nx*1.2;P.z=d.z+nz*1.2;P.yaw=Math.atan2(-(d.x-P.x),-(d.z-P.z));P.pitch=0;},door);
await wait(1500);
out.prompt=await G.evaluate(()=>document.getElementById('promptText').textContent);
await G.keyboard.press('KeyE');
await H.waitForFunction(i=>__qh.doors[i].open,door.i,{timeout:T}).catch(()=>{});
await G.waitForFunction(i=>__qh.doors[i].open,door.i,{timeout:T}).catch(()=>{});
out.doorOpen={host:await H.evaluate(i=>__qh.doors[i].open,door.i),guest:await G.evaluate(i=>__qh.doors[i].open,door.i),guestCollider:await G.evaluate(i=>__qh.colliders.includes(__qh.doors[i].col),door.i)};
// 2) mask, then shoot a guard who stands three metres in front
await G.keyboard.down('KeyG');
await H.waitForFunction(()=>__qh.PLAYERS[1].P.masked,null,{timeout:T}).catch(()=>{});
await G.keyboard.up('KeyG');
await G.waitForFunction(()=>__qh.P.masked&&__qh.P.raise>0.95,null,{timeout:T}).catch(()=>{});
const tgt=await H.evaluate(()=>{const q=__qh,p=q.PLAYERS[1].P,g=q.guards[1];g.wait=99;g.level=p.level;
  const fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw);g.x=p.x+fx*3;g.z=p.z+fz*3;g.yaw=p.yaw;g.route=[[g.x,g.z]];return {x:g.x,z:g.z};});
await G.evaluate(s=>{const P=__qh.P;P.yaw=Math.atan2(-(s.x-P.x),-(s.z-P.z));P.pitch=-0.05;},tgt);
await wait(1500);
await H.evaluate(t=>{const g=__qh.guards[1];g.x=t.x;g.z=t.z;},tgt);
// the guest's shot is judged against where the guard was on their screen: let him stand there a moment (host time)
{const t0=await H.evaluate(()=>__qh.G.time);await H.waitForFunction(t=>__qh.G.time>t+0.6,t0,{timeout:T}).catch(()=>{});}
await G.evaluate(()=>__qh.shoot());
await H.waitForFunction(()=>__qh.guards[1].hp<2||__qh.guards[1].down,null,{timeout:T}).catch(()=>{});
out.shot={hp:await H.evaluate(()=>__qh.guards[1].hp),hostMag:await H.evaluate(()=>__qh.PLAYERS[1].P.mag)};
await G.waitForFunction(()=>__qh.P.mag<12,null,{timeout:T}).catch(()=>{});
out.guestMag=await G.evaluate(()=>__qh.P.mag);
// 3) alarm, and a guard grabs the guest: custody for the guest, the host plays on
await H.evaluate(()=>{const q=__qh,g=q.guards[2],p=q.PLAYERS[1].P;q.G.alarm=true;q.G.alarmT=999;g.down=false;g.route=[[p.x,p.z]];g.level=p.level;g.chase=true;
  for(let i=0;i<10;i++){g.x=p.x+0.5;g.z=p.z;g.last={x:p.x,z:p.z};q.stepGame(1/30);}});
await G.waitForFunction(()=>__qh.GS.out,null,{timeout:T}).catch(()=>{});
out.custody={host:await H.evaluate(()=>__qh.PLAYERS[1].out),guest:await G.evaluate(()=>__qh.GS.out),hostState:await H.evaluate(()=>__qh.state)};
// 4) the host ends the job: the guest gets the same report
await H.evaluate(()=>__qh.endGame(true));
await G.waitForFunction(()=>__qh.state==='ended',null,{timeout:T}).catch(()=>{});
out.end={host:await H.evaluate(()=>({st:__qh.state,title:document.getElementById('endTitle').textContent})),guest:await G.evaluate(()=>({st:__qh.state,title:document.getElementById('endTitle').textContent,menu:document.getElementById('menuBtn').textContent,again:!document.getElementById('againBtn').hidden}))};
// 5) back to the jobs: the guest follows the host to the lobby
await H.evaluate(()=>document.getElementById('menuBtn').click());
await G.waitForFunction(()=>__qh.state==='menu',null,{timeout:T}).catch(()=>{});
out.lobby={host:await H.evaluate(()=>__qh.state),guest:await G.evaluate(()=>__qh.state),still:await G.evaluate(()=>__qh.NET.on)};
await G.screenshot({path:'../coop2-guest.png',timeout:180000});
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await close();})();
