// Co-op part 4: a day job. The guest shouts a civilian down, zip-ties them and leads them; then carries a bag to the van.
const {setup,wait}=require('./coopH');
(async()=>{
const {H,G,errs,close,T}=await setup('meridianDay');
const out={};
// nobody else around
await H.evaluate(()=>{__qh.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});__qh.civs.slice(1).forEach(c=>{c.route=[[210,210]];c.x=210;c.z=210;});});
await G.keyboard.down('KeyG');
await H.waitForFunction(()=>__qh.PLAYERS[1].P.masked,null,{timeout:T}).catch(()=>{});
await G.keyboard.up('KeyG');
await G.waitForFunction(()=>__qh.P.masked,null,{timeout:T}).catch(()=>{});
// a civilian six metres in front of the guest
const civ=await H.evaluate(()=>{const q=__qh,p=q.PLAYERS[1].P,c=q.civs[0];const fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw);
  c.route=[[p.x+fx*6,p.z+fz*6]];c.x=p.x+fx*6;c.z=p.z+fz*6;c.level=p.level;c.state="idle";c.sus=0;c.wait=99;q.G.alarm=false;return {x:c.x,z:c.z};});
await wait(1200);
await G.keyboard.press('KeyF');
await H.waitForFunction(()=>__qh.civs[0].state==="ground",null,{timeout:T}).catch(()=>{});
out.shout={civ:await H.evaluate(()=>__qh.civs[0].state),alarm:await H.evaluate(()=>__qh.G.alarm)};
// walk up to them and hold E to tie them
await G.evaluate(c=>{const P=__qh.P,dx=c.x-P.x,dz=c.z-P.z,d=Math.hypot(dx,dz);P.x=c.x-dx/d*1.2;P.z=c.z-dz/d*1.2;P.yaw=Math.atan2(-dx,-dz);},civ);
await wait(1500);
out.tiePrompt=await G.evaluate(()=>document.getElementById('promptText').textContent);
await G.keyboard.down('KeyE');
await H.waitForFunction(()=>__qh.civs[0].state==="tied",null,{timeout:T}).catch(()=>{});
await G.keyboard.up('KeyE');
out.tied=await H.evaluate(()=>__qh.civs[0].state);
await wait(1200);
await G.keyboard.press('KeyE');
await H.waitForFunction(()=>__qh.civs[0].follow,null,{timeout:T}).catch(()=>{});
out.follow={on:await H.evaluate(()=>__qh.civs[0].follow),leader:await H.evaluate(()=>__qh.civs[0].leader&&__qh.civs[0].leader.id)};
// the guest walks away: the hostage follows the guest, not the host
const c0=await H.evaluate(()=>[__qh.civs[0].x,__qh.civs[0].z]);
await G.evaluate(()=>{__qh.P.yaw+=Math.PI;});
await G.keyboard.down('KeyW');await wait(4000);await G.keyboard.up('KeyW');await wait(2000);
const c1=await H.evaluate(()=>[__qh.civs[0].x,__qh.civs[0].z]);
out.followed=+Math.hypot(c1[0]-c0[0],c1[1]-c0[1]).toFixed(2);
// a loot bag at the guest's feet: pick it up, then load it into the van
const bag=await H.evaluate(()=>{const q=__qh,p=q.PLAYERS[1].P,b=q.bags[0];const fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw);b.state="ground";b.box=null;b.level=p.level;b.mesh.visible=true;b.mesh.position.set(p.x+fx*1.0,p.level*4+0.22,p.z+fz*1.0);return 0;});
await wait(1200);
await G.keyboard.press('KeyE');
await H.waitForFunction(()=>!!__qh.PLAYERS[1].P.carry,null,{timeout:T}).catch(()=>{});
await G.waitForFunction(()=>!!__qh.P.carry,null,{timeout:T}).catch(()=>{});
out.carry={host:await H.evaluate(()=>__qh.PLAYERS[1].P.carry&&__qh.PLAYERS[1].P.carry.kind),guest:await G.evaluate(()=>__qh.P.carry&&__qh.P.carry.kind),view:await G.evaluate(()=>!!document.querySelector('canvas'))};
const van=await H.evaluate(()=>({x:__qh.SECURE.x,z:__qh.SECURE.z}));
await G.evaluate(v=>{const P=__qh.P;P.x=v.x+1.8;P.z=v.z;P.level=0;P.jh=0;P.y=0;P.yaw=Math.atan2(-(v.x-P.x),-(v.z-P.z));},van);
await wait(1500);
await G.keyboard.press('KeyE');
await H.waitForFunction(()=>__qh.G.secured>=1,null,{timeout:T}).catch(()=>{});
await wait(1000);
out.secured={host:await H.evaluate(()=>__qh.G.secured),guestHud:await G.evaluate(()=>document.getElementById('bagsVal').textContent),hostHud:await H.evaluate(()=>document.getElementById('bagsVal').textContent)};
await G.screenshot({path:'../coop4-guest.png',timeout:180000});
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await close();})();
