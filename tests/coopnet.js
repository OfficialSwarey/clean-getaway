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
// the guest leaves: the host is told and keeps playing
await G.evaluate(()=>document.getElementById('pauseMenuBtn').click());
await H.waitForFunction(()=>!__qh.NET.on,null,{timeout:T}).catch(()=>{});
out.left={hostNet:await H.evaluate(()=>__qh.NET.on),hostState:await H.evaluate(()=>__qh.state),players:await H.evaluate(()=>__qh.PLAYERS.length),waitingAgain:await H.evaluate(()=>__qh.NET.waiting)};
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await close();})();
