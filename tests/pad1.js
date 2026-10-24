const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.addInitScript(()=>{
  const btn=()=>({pressed:false,value:0,touched:false});
  window.__pad={id:"Fake pad",index:0,connected:true,mapping:"standard",axes:[0,0,0,0],buttons:Array.from({length:17},btn),timestamp:0};
  navigator.getGamepads=()=>[window.__pad];
  window.padSet=(i,v)=>{window.__pad.buttons[i].pressed=v;window.__pad.buttons[i].value=v?1:0;};
});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1200);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const press=async(i,ms=200)=>{await p.evaluate(i=>padSet(i,true),i);await p.waitForTimeout(ms);await p.evaluate(i=>padSet(i,false),i);await p.waitForTimeout(250);};
const out={};
// menu: d-pad moves focus, A clicks
await press(13);await press(15);const f1=await p.evaluate(()=>document.activeElement&&(document.activeElement.textContent||"").trim().slice(0,30));
out.menu={src:await p.evaluate(()=>document.body.className),focused:f1};
// switch to career via focus + A? use the tab directly then RB to cycle tabs
await p.evaluate(()=>document.querySelector('.modes button[data-mode="career"]').click());await press(5);
out.tab=await p.evaluate(()=>[...document.querySelectorAll(".cr-tabs button")].find(b=>b.getAttribute("aria-selected")==="true").dataset.tab);
// in game: start free play on harbor, stick to move, right stick to look
await run(`q.setMode("free");q.pickMap("harbor");q.resetGame();q.setState("playing");away();`);
await p.evaluate(()=>{__pad.axes=[0,-1,0.8,0];});await p.waitForTimeout(1500);await p.evaluate(()=>{__pad.axes=[0,0,0,0];});await p.waitForTimeout(300);
out.move=await run(`return {x:+q.P.x.toFixed(2),z:+q.P.z.toFixed(2),yaw:+q.P.yaw.toFixed(2),src:document.body.className};`);
// aim assist: a guard just off the crosshair; hold LT and watch the view pull onto him
out.assist=await run(`q.P.masked=true;go(0,22,0,0);const g=q.guards.find(g=>!g.security);g.down=false;g.x=1.0;g.z=14.5;g.route=[[1.0,14.5]];g.face=0;g.yaw=0;step(2);
  const ang0=Math.atan2(-(g.x-q.P.x),-(g.z-q.P.z))-q.P.yaw;return {ang0:+ang0.toFixed(3)};`);
await p.evaluate(()=>padSet(6,true));await p.waitForTimeout(2500);
out.assist.after=await run(`const g=q.guards.find(g=>!g.security);return {src:q.IN.src,t:q.aimTarget(0.3),st:q.state,P:[q.P.x,q.P.z,q.P.pitch],g:[g.x,g.z,g.down],yaw:+q.P.yaw.toFixed(3),want:+Math.atan2(-(g.x-q.P.x),-(g.z-q.P.z)).toFixed(3),aim:q.P.aim,aimT:+q.P.aimT.toFixed(2)};`);
await p.evaluate(()=>padSet(6,false));await p.waitForTimeout(300);
// mouse input: the same setup gets no help
out.kbm=await run(`window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyZ"}));q.P.aim=true;q.P.yaw=0;q.P.aimT=1;const y0=q.P.yaw;step(30);return {src:document.body.className,yaw:+q.P.yaw.toFixed(3),moved:Math.abs(q.P.yaw-y0)>0.001};`);
// start pauses
await p.evaluate(()=>{__pad.axes=[0,0.0,0,0];});await press(9);out.pause=await p.evaluate(()=>__qh.state);
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
