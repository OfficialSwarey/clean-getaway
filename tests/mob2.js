const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await b.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1200);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const code=await run(`q.pickMap("jewel");q.resetGame();q.setState("playing");away();q.P.masked=true;go(9.0,-4,0,-Math.PI/2);q.pressE();step(2);return {kp:q.G.keypad,code:q.G.safeCode};`);
await p.waitForTimeout(300);await p.screenshot({path:'../mob-keypad.png',timeout:180000});
for(const d of code.code){await p.tap(`#kpKeys span[data-k="${d}"]`);await p.waitForTimeout(150);}
await p.waitForTimeout(6000);
const r=await run(`return {armed:q.G.j.armed,kp:q.G.keypad};`);
console.log(JSON.stringify({code,r}),errs.join("\n")||"no errors");await b.close();})();
