// 0.40.1: dev mode puts money and level buttons in the safehouse; without dev mode they're gone.
const {chromium}=require('playwright-core');
const PAGE=process.argv[2]||'test.html';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:700}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/'+PAGE);await p.waitForTimeout(1500);
const out={};
await p.evaluate(()=>{const q=__qh;q.CAREER=q.newCareer();q.fillBoard();q.setMode("career");q.renderCareer();});
out.off=await p.evaluate(()=>document.getElementById('crDev').hidden);
await p.evaluate(()=>{const t=document.getElementById('devToggle');t.checked=true;t.dispatchEvent(new Event('change'));});
out.on=await p.evaluate(()=>({shown:!document.getElementById('crDev').hidden,buttons:document.querySelectorAll('#crDev [data-dev]').length}));
await p.evaluate(()=>{document.querySelector('[data-dev="cash:100000"]').click();document.querySelector('[data-dev="lvl:5"]').click();});
out.after5=await p.evaluate(()=>({cash:__qh.CAREER.cash,level:__qh.levelInfo(__qh.CAREER.xp).level,shown:document.getElementById('crLevel').textContent,points:__qh.pointsFree()}));
await p.evaluate(()=>document.querySelector('[data-dev="lvl:max"]').click());
out.max=await p.evaluate(()=>({level:__qh.levelInfo(__qh.CAREER.xp).level,saved:JSON.parse(localStorage.getItem("cg-career-v1")).cash}));
await p.evaluate(()=>{const t=document.getElementById('devToggle');t.checked=false;t.dispatchEvent(new Event('change'));});
out.offAgain=await p.evaluate(()=>document.getElementById('crDev').hidden);
console.log(JSON.stringify(out));console.log(errs.join("\n")||"no errors");await b.close();})();
