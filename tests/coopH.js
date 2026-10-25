// Shared setup for the co-op tests: serves tests/ over http (BroadcastChannel needs a real origin),
// opens a host and a guest page on ?net=local, connects them and starts a job.
const http=require('http'),fs=require('fs'),path=require('path');
const {chromium}=require('playwright-core');
const TYPES={'.html':'text/html','.js':'text/javascript','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json'};
function serve(){
  return new Promise(res=>{
    const srv=http.createServer((req,resp)=>{
      const f=path.join(__dirname,decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(f,(err,data)=>{if(err){resp.writeHead(404);resp.end();return;}resp.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});resp.end(data);});
    });
    srv.listen(0,'127.0.0.1',()=>res(srv));
  });
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
// opts.peer: "host:port" of a PeerJS server and the path of peerjs.min.js: test the real WebRTC connection instead of the tab-to-tab one
async function setup(map,viewport,opts){
  opts=opts||{};
  const srv=await serve(),url=`http://127.0.0.1:${srv.address().port}/${opts.page||process.env.QA_PAGE||'test.html'}?`+(opts.peer?`peer=${opts.peer}`:`net=local`)+'&screen=coop';
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required','--disable-features=WebRtcHideLocalIpsWithMdns']});
  const ctx=await b.newContext({viewport:viewport||{width:800,height:450}});
  if(opts.peerjs)await ctx.route('**/peerjs.min.js',r=>r.fulfill({body:fs.readFileSync(opts.peerjs),contentType:'text/javascript'}));
  const errs=[];
  const open=async name=>{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(name+' PAGEERR '+e.message));await p.goto(url);await p.waitForTimeout(2500);return p;};
  const H=await open('host'),G=await open('guest');
  const T=90000;
  await H.evaluate(()=>document.getElementById('coopHostBtn').click());
  await H.waitForFunction(()=>!!document.querySelector('#coopCodeShow:not([hidden]) b'),null,{timeout:T});
  const code=await H.evaluate(()=>document.querySelector('#coopCodeShow b')?.textContent);
  // small windows use the phone layout: co-op sits behind the Co-op · Dev button
  await G.evaluate(()=>{const t=document.getElementById('coopToggle');if(t&&getComputedStyle(t).display!=='none'&&t.getAttribute('aria-expanded')!=='true')t.click();});
  await G.fill('#coopCode',code);await G.evaluate(()=>document.getElementById('coopJoinBtn').click());
  await H.waitForFunction(()=>__qh.NET.on&&__qh.PLAYERS.length===2,null,{timeout:T});
  if(opts.noStart){const close=async()=>{await b.close();srv.close();};return {b,ctx,H,G,errs,close,T,code,url};}
  await H.evaluate(m=>__qh.pickMap(m),map||'harbor');await wait(300);
  await H.evaluate(()=>document.getElementById('startBtn').click());
  await G.waitForFunction(()=>__qh.state==='paused',null,{timeout:T});
  await G.evaluate(()=>document.getElementById('resumeBtn').click());
  await H.waitForFunction(()=>__qh.state==='playing'&&__qh.PLAYERS[1].ready,null,{timeout:T});
  await G.waitForFunction(()=>__qh.state==='playing',null,{timeout:T});
  const close=async()=>{await b.close();srv.close();};
  return {b,ctx,H,G,errs,close,T,code};
}
module.exports={setup,wait,serve};
