// Co-op part 3: every co-op job builds the same world on both screens, runs without errors, and stays in step;
// plus how much the host sends per second.
const {setup,wait}=require('./coopH');
(async()=>{
const maps=(process.argv[2]||"harbor,harborDay,meridian,meridianDay,club,jewel,jewelDay").split(",");
const {H,G,errs,close,T}=await setup(maps[0]);
const out={};
for(let i=0;i<maps.length;i++){
  const m=maps[i];
  if(i>0){
    await H.evaluate(()=>document.getElementById('pauseMenuBtn').click());
    await G.waitForFunction(()=>__qh.state==='menu',null,{timeout:T}).catch(()=>{});
    await H.evaluate(m=>__qh.pickMap(m),m);await wait(300);
    await H.evaluate(()=>document.getElementById('startBtn').click());
    await G.waitForFunction(()=>__qh.state==='paused'&&document.getElementById('resumeBtn').textContent==='Join the job',null,{timeout:T});
    await G.evaluate(()=>document.getElementById('resumeBtn').click());
    await H.waitForFunction(()=>__qh.state==='playing'&&__qh.PLAYERS[1].ready,null,{timeout:T});
  }
  // count what the host sends for a few seconds
  await H.evaluate(()=>{const N=__qh.NET,s0=N.send;window.__bytes=0;window.__msgs=0;window.__t0=performance.now();N.send=d=>{window.__bytes+=JSON.stringify(d).length;window.__msgs++;s0(d);};window.__restore=()=>{N.send=s0;};});
  await G.keyboard.down('KeyW');await wait(3000);await G.keyboard.up('KeyW');
  await wait(2000);
  const net=await H.evaluate(()=>{const s=(performance.now()-window.__t0)/1000;const r={kbps:+(window.__bytes/1024/s).toFixed(1),perMsg:Math.round(window.__bytes/Math.max(1,window.__msgs)),fps:null};window.__restore();return r;});
  const sync={host:await H.evaluate(()=>__qh.SYNC.objs.length),guest:await G.evaluate(()=>__qh.SYNC.objs.length)};
  // the same objects, in the same places
  const ph=await H.evaluate(()=>__qh.SYNC.objs.slice(0,400).map(o=>o.position.x+o.position.y+o.position.z).reduce((a,b)=>a+b,0));
  await wait(1500);
  const pg=await G.evaluate(()=>__qh.SYNC.objs.slice(0,400).map(o=>o.position.x+o.position.y+o.position.z).reduce((a,b)=>a+b,0));
  const ga=await H.evaluate(()=>__qh.guards.map(g=>[g.root.position.x,g.root.position.z]));
  const gb=await G.evaluate(()=>__qh.guards.map(g=>[g.root.position.x,g.root.position.z]));
  out[m]={sync,net,posSum:[+ph.toFixed(1),+pg.toFixed(1)],guardsDiff:+Math.max(0,...ga.map((p,i)=>Math.hypot(p[0]-gb[i][0],p[1]-gb[i][1]))).toFixed(2),state:[await H.evaluate(()=>__qh.state),await G.evaluate(()=>__qh.state)],errs:errs.length};
  console.log(m,JSON.stringify(out[m]));
}
console.log(errs.join("\n")||"no errors");
await close();})();
