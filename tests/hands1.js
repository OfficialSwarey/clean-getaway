// Hands only (a career job without a pistol): a guard can be taken down from behind with the keyboard (F), on a touch screen (ACTION) and on a controller (Y).
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const errs=[];const out={};
const setup=`const C=q.newCareer();q.CAREER=C;C.board[0]={id:"h1",map:"harbor",tw:[],pay:1,xp:1,stars:1,mins:6};q.fillBoard();q.setMode("career");q.openPlan("h1");q.PLAN.sel={};q.startPlan();
  q.setState("playing");away();q.P.masked=true;go(0,22,0,0);step(2);
  const g=q.guards.find(g=>!g.security);g.down=false;g.x=0;g.z=20.6;g.route=[[0,20.6]];g.wait=99;g.yaw=Math.PI;g.face=Math.PI;step(2);
  return {gun:q.P.hasGun,target:!!q.takedownTarget(),fire:!!document.querySelector('.tb[data-act="fire"]')&&document.querySelector('.tb[data-act="fire"]').hidden};`;
const done=`const g=q.guards.find(g=>!g.security);return {down:g.down,takedowns:q.G.takedowns,toast:document.getElementById("toast").textContent};`;
// keyboard
{const p=await b.newPage({viewport:{width:1100,height:650}});p.on('pageerror',e=>errs.push('kbd '+e.message));
 await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);const run=src=>p.evaluate(new Function(H+src));
 out.kbd={before:await run(setup)};await p.evaluate(()=>{window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyF"}));window.dispatchEvent(new KeyboardEvent("keyup",{code:"KeyF"}));});
 out.kbd.after=await run(done);
 // the trigger without a pistol also takes a guard down
 await run(`const g=q.guards.filter(g=>!g.security)[1];g.down=false;g.x=0;g.z=20.6;g.route=[[0,20.6]];g.wait=99;g.yaw=Math.PI;g.face=Math.PI;step(2);q.shoot();`);
 out.kbd.trigger=await run(`return q.guards.filter(g=>!g.security)[1].down;`);await p.close();}
// touch
{const ctx=await b.newContext({viewport:{width:844,height:390},hasTouch:true,isMobile:true});const p=await ctx.newPage();p.on('pageerror',e=>errs.push('touch '+e.message));
 await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);const run=src=>p.evaluate(new Function(H+src));
 await p.tap('#menu').catch(()=>{});
 out.touch={before:await run(setup)};await p.waitForTimeout(400);
 out.touch.label=await p.evaluate(()=>{const f=document.querySelector('.tb[data-act="f"]');const fi=document.querySelector('.tb[data-act="fire"]'),ai=document.querySelector('.tb[data-act="aim"]');return {txt:f.textContent,hidden:f.hidden,src:__qh.IN.src,fireHidden:fi.hidden,aimHidden:ai.hidden};});
 await p.tap('.tb[data-act="f"]');await p.waitForTimeout(300);out.touch.after=await run(done);await ctx.close();}
// controller
{const p=await b.newPage({viewport:{width:1100,height:650}});p.on('pageerror',e=>errs.push('pad '+e.message));
 await p.addInitScript(()=>{const btn=()=>({pressed:false,value:0,touched:false});window.__pad={id:"Fake pad",index:0,connected:true,mapping:"standard",axes:[0,0,0,0],buttons:Array.from({length:17},btn),timestamp:0};
   navigator.getGamepads=()=>[window.__pad];window.padSet=(i,v)=>{window.__pad.buttons[i].pressed=v;window.__pad.buttons[i].value=v?1:0;};});
 await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);const run=src=>p.evaluate(new Function(H+src));
 await p.evaluate(()=>padSet(0,true));await p.waitForTimeout(200);await p.evaluate(()=>padSet(0,false));await p.waitForTimeout(200);
 out.pad={before:await run(setup)};await p.evaluate(()=>padSet(3,true));await p.waitForTimeout(250);await p.evaluate(()=>padSet(3,false));await p.waitForTimeout(300);
 out.pad.after=await run(done);out.pad.src=await p.evaluate(()=>__qh.IN.src);await p.close();}
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
