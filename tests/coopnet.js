// Co-op over a real WebRTC connection through a PeerJS server (start one with: npx peerjs --port 9000).
// node coopnet.js <host:port> <path to peerjs.min.js>
const {setup,wait}=require('./coopH');
(async()=>{
const {H,G,errs,close,T,code}=await setup('harbor',null,{peer:process.argv[2]||'127.0.0.1:9000',peerjs:process.argv[3]});
const out={code};
out.conn={host:await H.evaluate(()=>!!(__qh.NET.conn&&__qh.NET.conn.open)),guest:await G.evaluate(()=>!!(__qh.NET.conn&&__qh.NET.conn.open))};
await G.keyboard.down('KeyG');
await H.waitForFunction(()=>__qh.PLAYERS[1].P.masked,null,{timeout:T}).catch(()=>{});
await G.keyboard.up('KeyG');
await G.waitForFunction(()=>__qh.P.masked,null,{timeout:T}).catch(()=>{});
out.mask={host:await H.evaluate(()=>__qh.PLAYERS[1].P.masked),guest:await G.evaluate(()=>__qh.P.masked)};
out.sync={host:await H.evaluate(()=>__qh.SYNC.objs.length),guest:await G.evaluate(()=>__qh.SYNC.objs.length)};
// the lossy channel is open on both sides, and carries the moving world
out.fast={host:await H.evaluate(()=>!!(__qh.NET.fast&&__qh.NET.fast.readyState==="open")),guest:await G.evaluate(()=>!!(__qh.NET.fast&&__qh.NET.fast.readyState==="open"))};
// lose 30% of the fast packets both ways while the guards walk; once they settle the guest still matches the host
await H.evaluate(()=>{__qh.NET.dropFast=0.3;});await G.evaluate(()=>{__qh.NET.dropFast=0.3;});
await G.keyboard.down('KeyW');await wait(3000);await G.keyboard.up('KeyW');
await H.evaluate(()=>{__qh.guards.forEach(g=>{g.route=[[g.x,g.z]];g.wait=99;});});
await wait(4000);
await H.evaluate(()=>{__qh.NET.dropFast=0;});await G.evaluate(()=>{__qh.NET.dropFast=0;});
out.lossy={guardsDiff:+Math.max(...(await H.evaluate(()=>__qh.guards.map(g=>[g.root.position.x,g.root.position.z]))).map((p,i,a)=>0)).toFixed(2)};
{const ga=await H.evaluate(()=>__qh.guards.map(g=>[g.root.position.x,g.root.position.z]));const gb=await G.evaluate(()=>__qh.guards.map(g=>[g.root.position.x,g.root.position.z]));
 out.lossy.guardsDiff=+Math.max(...ga.map((p,i)=>Math.hypot(p[0]-gb[i][0],p[1]-gb[i][1]))).toFixed(2);}
out.lossy.guestAtHost=await H.evaluate(()=>{const p=__qh.PLAYERS[1].P;return [+p.x.toFixed(2),+p.z.toFixed(2)];});
out.lossy.guestOwn=await G.evaluate(()=>[+__qh.P.x.toFixed(2),+__qh.P.z.toFixed(2)]);
// the guest leaves: the host is told and keeps playing
await G.evaluate(()=>document.getElementById('pauseMenuBtn').click());
await H.waitForFunction(()=>!__qh.NET.on,null,{timeout:T}).catch(()=>{});
out.left={hostNet:await H.evaluate(()=>__qh.NET.on),hostState:await H.evaluate(()=>__qh.state),players:await H.evaluate(()=>__qh.PLAYERS.length),waitingAgain:await H.evaluate(()=>__qh.NET.waiting)};
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await close();})();
