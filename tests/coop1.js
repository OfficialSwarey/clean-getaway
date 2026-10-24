// Co-op part 1: connect, start, same world on both screens, the guest walks and masks up, the host sees their avatar,
// a guard who looks at the masked guest fills the meter.
const {setup,wait}=require('./coopH');
(async()=>{
const {H,G,errs,close,T}=await setup('harbor',{width:960,height:540});
const out={};
out.sync={host:await H.evaluate(()=>__qh.SYNC.objs.length),guest:await G.evaluate(()=>__qh.SYNC.objs.length)};
await H.evaluate(()=>{__qh.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.wp=0;g.x=200;g.z=200;});});
await wait(1500);
// the guest walks forward: the host sees them where they are
const g0=await G.evaluate(()=>[__qh.P.x,__qh.P.z]);
await G.keyboard.down('KeyW');await wait(2500);await G.keyboard.up('KeyW');
const gl=await G.evaluate(()=>[__qh.P.x,__qh.P.z]);
await H.waitForFunction(gl=>{const p=__qh.PLAYERS[1].P;return Math.hypot(p.x-gl[0],p.z-gl[1])<0.05;},gl,{timeout:T}).catch(()=>{});
const g1=await H.evaluate(()=>{const p=__qh.PLAYERS[1].P;return [p.x,p.z];});
out.walk={guestLocal:gl.map(v=>+v.toFixed(2)),onHost:g1.map(v=>+v.toFixed(2)),moved:+Math.hypot(gl[0]-g0[0],gl[1]-g0[1]).toFixed(2)};
// guards stand in the same places on both screens
const gh=await H.evaluate(()=>__qh.guards.map(g=>[g.root.position.x,g.root.position.z]));
await wait(1500);
const gg=await G.evaluate(()=>__qh.guards.map(g=>[g.root.position.x,g.root.position.z]));
out.guardsMaxDiff=+Math.max(...gh.map((p,i)=>Math.hypot(p[0]-gg[i][0],p[1]-gg[i][1]))).toFixed(2);
// the guest holds G: the host's game puts the mask on, both agree
await G.keyboard.down('KeyG');
await H.waitForFunction(()=>__qh.PLAYERS[1].P.masked,null,{timeout:T}).catch(()=>{});
await G.keyboard.up('KeyG');
await G.waitForFunction(()=>__qh.P.masked,null,{timeout:T}).catch(()=>{});
out.mask={host:await H.evaluate(()=>__qh.PLAYERS[1].P.masked),guest:await G.evaluate(()=>__qh.P.masked),edge:await G.evaluate(()=>!document.getElementById('maskEdge').hidden)};
// the guest's HUD is the host's picture of the guest
await wait(800);
out.hud=await G.evaluate(()=>({obj:document.getElementById('objText')?.textContent.slice(0,60),mate:document.getElementById('mateChip')?.textContent,maskChip:document.getElementById('maskChip')?.textContent}));
out.hostMate=await H.evaluate(()=>document.getElementById('mateChip').textContent);
out.avatar=await H.evaluate(()=>{const a=__qh.AVATARS.get(1);return a?{vis:a.root.visible,mask:a.mask.visible,x:+a.x.toFixed(1),z:+a.z.toFixed(1)}:null;});
out.hostAvatarOnGuest=await G.evaluate(()=>{const a=__qh.AVATARS.get(0);return a?{vis:a.root.visible,x:+a.x.toFixed(1),z:+a.z.toFixed(1)}:null;});
// a guard who looks straight at the masked guest
out.detect=await H.evaluate(()=>{
  const q=__qh,p=q.PLAYERS[1].P,g=q.guards[0];
  g.route=[[p.x,p.z-5]];g.wait=99;
  for(let i=0;i<20;i++){g.x=p.x;g.z=p.z-5;g.yaw=0;g.face=0;q.stepGame(1/30);}
  return {susp:+q.G.susp.toFixed(2),seeDist:+g.seeDist.toFixed(2),focus:g.focus&&g.focus.id};
});
await wait(800);
out.guestMeter=await G.evaluate(()=>document.getElementById('detectFill')?.style.width);
await H.screenshot({path:'../coop-host.png',timeout:180000});
await G.screenshot({path:'../coop-guest.png',timeout:180000});
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await close();})();
