const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});const errs=[];
for(const [w,h,tag,touch] of [[1100,680,'d',false],[844,390,'p',true]]){
 const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:touch,isMobile:touch});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(tag+' '+e.message));
 await p.goto('file://'+__dirname+'/test2.html?screen=home');await p.waitForTimeout(2500);
 await p.screenshot({path:`../m-${tag}-home.png`});
 for(const sc of ['settings','coop','solo']){await p.evaluate(s=>document.querySelector(`[data-go="${s}"]`).click(),sc);await p.waitForTimeout(400);await p.screenshot({path:`../m-${tag}-${sc}.png`});
   console.log(tag,sc,await p.evaluate(()=>({screen:document.querySelector('.card.menu').dataset.screen,stamp:document.getElementById('menuStamp').textContent,start:document.getElementById('startBtn').textContent,startDis:document.getElementById('startBtn').disabled,coopVis:!!document.getElementById('coopCode').offsetParent})));
   await p.evaluate(()=>document.getElementById('menuBack').click());await p.waitForTimeout(200);}
 await ctx.close();}
console.log(errs.join('\n')||'no errors');await b.close();})();
