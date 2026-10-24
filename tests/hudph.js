// Phone HUD: nothing overlaps at 844x390 (the iPhone landscape size), and prompts name the touch buttons, not keys.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const W=+(process.argv[2]||844),Hh=+(process.argv[3]||390);
const ctx=await b.newContext({viewport:{width:W,height:Hh},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1500);
// iPhone safe areas (notch side 47 px, home bar 21 px): emulate by replacing env() in the stylesheet
await p.evaluate(()=>{for(const st of document.querySelectorAll("style"))st.textContent=st.textContent.replace(/env\(safe-area-inset-(left|right),0px\)/g,"47px").replace(/env\(safe-area-inset-bottom,0px\)/g,"21px");});
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
await run(`q.pickMap("jewel");q.resetGame();q.setState("playing");away();q.P.masked=true;step(3);q.triggerAlarm("test");q.G.alarmT=9999;q.showSub("D","Unit 4, respond. Possible break-in at the jeweller's on Kings Street.",8000);step(2);q.G.bodies.push({x:0,z:0,hostage:false});step(1);`);
await p.waitForTimeout(1200);
const r=await p.evaluate(()=>{const R=id=>{const e=document.getElementById(id);if(!e||e.hidden||getComputedStyle(e).display==="none")return null;const r=e.getBoundingClientRect();return {l:Math.round(r.left),t:Math.round(r.top),r:Math.round(r.right),b:Math.round(r.bottom)};};
  const out={obj:R("obj"),detect:R("detect"),status:R("status"),clock:R("clock"),subs:R("subs"),tPause:R("tPause")};
  document.querySelectorAll(".tb").forEach(b=>{if(!b.hidden&&b.id!=="tPause"){const r=b.getBoundingClientRect();out["btn_"+b.dataset.act]={l:Math.round(r.left),t:Math.round(r.top),r:Math.round(r.right),b:Math.round(r.bottom)};}});
  return out;});
const ks=Object.keys(r).filter(k=>r[k]);const hits=[];
for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++){const a=r[ks[i]],c=r[ks[j]];if(a.l<c.r&&c.l<a.r&&a.t<c.b&&c.t<a.b)hits.push(ks[i]+" x "+ks[j]);}
// tips name the touch buttons
const tip=await p.evaluate(()=>["Press <kbd>E</kbd> to tell them to follow you","Hold <kbd>G</kbd>","Stop the call! Look at the clerk and press F to shout before it goes through.","You can bag a body (hold E) and dump it in a bin. Q drops it.","<kbd>W</kbd> / <kbd>S</kbd> to climb · <kbd>SPACE</kbd> to let go","Gondola at Lobby · press <kbd>0</kbd>–<kbd>6</kbd> to move it"].map(__qh.keyWords));
// OBJ folds the objective away (the urgent line would stay; there is none here once the alarm is up)
await p.touchscreen.tap(81,84);await run(`step(2);`);await p.waitForTimeout(400);
const folded=await p.evaluate(()=>({hidden:document.getElementById("obj").hidden,mini:document.getElementById("obj").classList.contains("mini")}));
await p.screenshot({path:`../hud-${W}-folded.png`,timeout:180000});
await p.touchscreen.tap(81,84);await run(`step(2);`);
const back=await p.evaluate(()=>!document.getElementById("obj").hidden);
await p.screenshot({path:`../hud-${W}.png`,timeout:180000});
console.log(JSON.stringify({W,hits,tip,folded,back,r}),errs.join("\n")||"no errors");await b.close();})();
