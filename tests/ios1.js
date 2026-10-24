// iPhone browsers fire a fake mousedown after every tap, without sourceCapabilities. That must not switch the game to mouse and keyboard.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const out={};
const fakeMouse=()=>document.dispatchEvent(new MouseEvent("mousedown",{bubbles:true,button:0}));
// phone
let ctx=await b.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,isMobile:true,hasTouch:true});
let p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1500);
out.phoneAtLoad=await p.evaluate(()=>document.body.classList.contains("touch"));
// like an iPhone: right after the finger lifts, a compatibility mousedown with no sourceCapabilities
await p.evaluate(()=>addEventListener("touchend",()=>setTimeout(()=>document.dispatchEvent(new MouseEvent("mousedown",{bubbles:true,button:0})),0),true));
await p.tap('.job[data-map="meridian"]');await p.waitForTimeout(300);
out.afterTileTap=await p.evaluate(()=>document.body.classList.contains("touch"));
await p.tap('#startBtn');await p.waitForTimeout(1500);
out.playing=await p.evaluate(()=>__qh.state);
out.touchLayer=await p.evaluate(()=>!document.getElementById("touch").hidden);
await p.screenshot({path:'../ios-touch.png',timeout:180000});
await ctx.close();
// desktop: a real mouse click still means mouse and keyboard
ctx=await b.newContext({viewport:{width:1280,height:720}});p=await ctx.newPage();
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1500);
await p.click('.job[data-map="meridian"]');await p.waitForTimeout(300);
out.desktopTouch=await p.evaluate(()=>document.body.classList.contains("touch"));
console.log(JSON.stringify(out),errs.join("\n")||"no errors");await b.close();})();
