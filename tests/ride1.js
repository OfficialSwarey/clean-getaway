// Elevator and gondola: you can walk about while they move, you arrive standing on the new floor,
// and on a phone the floor numbers don't sit under the buttons.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await b.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1500);
await p.evaluate(()=>{for(const st of document.querySelectorAll("style"))st.textContent=st.textContent.replace(/env\(safe-area-inset-(left|right),0px\)/g,"47px").replace(/env\(safe-area-inset-bottom,0px\)/g,"21px");});
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const out={};
await run(`q.pickMap("tower");q.resetGame();q.setState("playing");away();go(-2.15,-0.5,0,Math.PI/2);step(10);`);
await p.waitForTimeout(900);
// 1) the floor numbers clear of the touch buttons and of the prompt
out.layout=await p.evaluate(()=>{const R=e=>{const r=e.getBoundingClientRect();return {l:r.left,t:r.top,r:r.right,b:r.bottom};};
  const np=document.getElementById("tNum");if(np.hidden)return {shown:false};
  const a=R(np),pr=R(document.getElementById("promptText"));const hit=(x,y)=>x.l<y.r&&y.l<x.r&&x.t<y.b&&y.t<x.b;
  const bad=[...document.querySelectorAll(".tb")].filter(b=>!b.hidden&&getComputedStyle(b).display!=="none").filter(b=>hit(a,R(b))||hit(pr,R(b))).map(b=>b.dataset.act);
  return {shown:true,buttons:np.querySelectorAll("button").length,overlaps:bad,promptVsNumbers:hit(a,pr)};});
await p.screenshot({path:'../ride-elevator.png',timeout:180000});
// 2) ride to floor 2 and walk about on the way
out.el=await run(`
  q.LV.def.onDigit(2);
  const e=q.G.t.el,trace=[];let x0=q.P.x;
  for(let i=0;i<240&&e.moving;i++){q.keys.KeyD=i>40&&i<90;q.keys.KeyA=i>=90&&i<140;q.stepGame(1/30);if(i%30===0)trace.push([+q.P.y.toFixed(2),q.P.level,+q.P.jh.toFixed(2),+q.P.x.toFixed(2)]);}
  q.keys.KeyD=q.keys.KeyA=false;step(20);
  return {arrived:!e.moving,lvl:e.lvl,P:[+q.P.x.toFixed(2),+q.P.z.toFixed(2),q.P.level,+q.P.jh.toFixed(2)],locked:!!q.P.locked,trace,movedSideways:trace.some(t=>Math.abs(t[3]-x0)>0.15)};`);
// 3) the gondola, from the street to floor 3, walking on it on the way
out.gon=await run(`
  const g=q.G.t.gon;g.lvl=0;g.moving=false;step(5);
  go(17.1,0,0,0);step(10);
  q.LV.def.onDigit(3);
  const trace=[];
  for(let i=0;i<400&&g.moving;i++){q.keys.KeyW=i>30&&i<70;q.keys.KeyS=i>=70&&i<110;q.stepGame(1/30);if(i%40===0)trace.push([+q.P.y.toFixed(2),q.P.level,+q.P.jh.toFixed(2),+q.P.z.toFixed(2)]);}
  q.keys.KeyW=q.keys.KeyS=false;step(20);
  const inside=q.P.x>16.1&&q.P.x<18.2&&q.P.z>-4&&q.P.z<4;
  return {arrived:!g.moving,lvl:g.lvl,P:[+q.P.x.toFixed(2),+q.P.z.toFixed(2),q.P.level,+q.P.jh.toFixed(2)],inside,trace};`);
console.log(JSON.stringify(out,null,1),errs.join("\n")||"no errors");await b.close();})();
