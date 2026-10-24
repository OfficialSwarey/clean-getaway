const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text());});
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(2500);
const r=await p.evaluate(()=>({state:__qh.state,coop:!!document.getElementById("coopBox")}));
console.log(JSON.stringify(r),errs.join("\n")||"no errors");await b.close();})();
