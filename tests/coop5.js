// Co-op part 5: the police waves in co-op. Both see the officers, they shoot at the guest too, the guest can drop one,
// a guest who goes down is in custody while the host plays on, and the driver leaves with the van for both.
const {setup,wait}=require('./coopH');
(async()=>{
const {H,G,errs,close,T}=await setup('harbor');
const out={};
await H.evaluate(()=>{__qh.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});__qh.G.vanTake=30000;__qh.G.secured=1;});
await G.keyboard.down('KeyG');await H.waitForFunction(()=>__qh.PLAYERS[1].P.masked,null,{timeout:T}).catch(()=>{});await G.keyboard.up('KeyG');
// the guest walks in a little (a trail for the officers), then the alarm runs out
await G.keyboard.down('KeyW');await wait(2500);await G.keyboard.up('KeyW');
await H.evaluate(()=>{__qh.triggerAlarm("test");__qh.G.alarmT=0.05;});
await H.waitForFunction(()=>__qh.G.police&&__qh.activeCops().length>=2,null,{timeout:T}).catch(()=>{});
out.arrive={host:await H.evaluate(()=>({wave:__qh.G.police&&__qh.G.police.wave,cops:__qh.activeCops().length,onFoot:__qh.onFoot(),banked:__qh.G.banked}))};
{const t0=await H.evaluate(()=>__qh.G.time);await H.waitForFunction(t=>__qh.G.time>t+1.0,t0,{timeout:T}).catch(()=>{});}
await wait(1500);
const hc=await H.evaluate(()=>__qh.activeCops().map(c=>[c.root.position.x,c.root.position.z,c.root.visible]));
const gc=await G.evaluate(()=>__qh.COPS.filter(c=>c.root.visible).map(c=>[c.root.position.x,c.root.position.z]));
out.arrive.guestSees=gc.length;
// the way-out ring: the host shows it when the driver leaves, and the guest sees it in the same place
const ringOf=()=>{const r=__qh.SYNC.objs.find(o=>o.geometry&&o.geometry.type==="RingGeometry"&&o.geometry.parameters.innerRadius===0.9&&o.material&&o.material.color&&o.material.color.getHex()===0xf4ab3d);return r?{vis:r.visible,at:[+r.position.x.toFixed(1),+r.position.z.toFixed(1)]}:null;};
out.arrive.ring={host:await H.evaluate(ringOf),guest:await G.evaluate(ringOf)};out.arrive.vanHiddenGuest=await G.evaluate(()=>__qh.VAN_PARTS.every(o=>!o.visible));
// the host steps into the vault, out of sight; an officer right in front of the guest shoots, the guest is hurt
await H.evaluate(()=>{const q=__qh;q.P.x=q.VAULT.x;q.P.z=q.VAULT.z-3;q.P.level=0;});
await H.evaluate(()=>{const q=__qh,p=q.PLAYERS[1].P,c=q.activeCops()[0];const fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw);c.x=p.x+fx*5;c.z=p.z+fz*5;c.level=p.level;c.fireT=0.1;c.route=[[c.x,c.z]];
  q.activeCops().slice(1).forEach(o=>{o.x=150;o.z=150;});});
{const t0=await H.evaluate(()=>__qh.G.time);await H.waitForFunction(t=>__qh.G.time>t+3,t0,{timeout:T}).catch(()=>{});}
await wait(800);
out.hurt={hostHp:await H.evaluate(()=>Math.round(__qh.P.hp)),hostSide:await H.evaluate(()=>Math.round(__qh.PLAYERS[1].P.hp)),guestSide:await G.evaluate(()=>Math.round(__qh.P.hp)),guestChip:await G.evaluate(()=>document.getElementById("hpChip").textContent)};
// the guest shoots him (three body hits)
const tgt=await H.evaluate(()=>{const c=__qh.activeCops()[0];c.fireT=99;return {x:c.x,z:c.z};});
await G.evaluate(s=>{const P=__qh.P;P.yaw=Math.atan2(-(s.x-P.x),-(s.z-P.z));P.pitch=-0.1;},tgt);
{const t0=await H.evaluate(()=>__qh.G.time);await H.waitForFunction(t=>__qh.G.time>t+0.8,t0,{timeout:T}).catch(()=>{});}
out.shots=[];for(let i=0;i<4;i++){await G.evaluate(()=>{__qh.P.fireCD=0;__qh.shoot();});{const t0=await H.evaluate(()=>__qh.G.time);await H.waitForFunction(t=>__qh.G.time>t+0.45,t0,{timeout:T}).catch(()=>{});}await wait(300);out.shots.push(await H.evaluate(()=>{const q=__qh,c=q.activeCops()[0],p=q.PLAYERS[1].P;c.fireT=99;return {hp:c.hp,mag:p.mag,cd:+p.fireCD.toFixed(2),raise:+p.raise.toFixed(2),yaw:+p.yaw.toFixed(2),pitch:+p.pitch.toFixed(2),copAt:[+c.x.toFixed(1),+c.z.toFixed(1)],me:[+p.x.toFixed(1),+p.z.toFixed(1)],down:c.down,stag:+(c.stagger||0).toFixed(2)};}));}
await wait(1000);
out.shot={copHp:await H.evaluate(()=>__qh.activeCops()[0].hp),down:await H.evaluate(()=>__qh.activeCops()[0].down)};
// the guest goes down: custody, the host plays on
await H.evaluate(()=>{const q=__qh;q.withPlayer(q.PLAYERS[1],"sim",()=>{for(let i=0;i<12;i++)q.hurtPlayer(15);});});
await G.waitForFunction(()=>__qh.GS.out,null,{timeout:T}).catch(()=>{});
out.down={guestOut:await G.evaluate(()=>!!__qh.GS.out),hostState:await H.evaluate(()=>__qh.state),hostOut:await H.evaluate(()=>__qh.PLAYERS[1].out)};
// the host walks out on foot where they came in: paid, with the van's money
await H.evaluate(()=>{const q=__qh,sp=q.LV.def.spawn;q.P.x=sp.x;q.P.z=sp.z;q.P.level=0;q.activeCops().forEach(c=>{c.x=150;c.z=150;});});
await H.evaluate(()=>{__qh.keys.KeyE=true;});await H.waitForFunction(()=>__qh.state==="ended",null,{timeout:T}).catch(()=>{});await H.evaluate(()=>{__qh.keys.KeyE=false;});
await G.waitForFunction(()=>__qh.state==="ended",null,{timeout:T}).catch(()=>{});
out.end={host:await H.evaluate(()=>({st:__qh.state,title:document.getElementById("endTitle").textContent,take:document.getElementById("endTakeVal").textContent})),guest:await G.evaluate(()=>({st:__qh.state,title:document.getElementById("endTitle").textContent}))};
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await close();})();
