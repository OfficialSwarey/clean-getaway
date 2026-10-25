// 0.35: the main menu. Home, singleplayer, co-op, settings and help screens; back with the button, Escape or B on a controller; settings switches.
const {chromium}=require('playwright-core');
const PAGE=process.argv[2]||'test.html';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:680}});p.setDefaultTimeout(15000);const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.addInitScript(()=>{const btn=()=>({pressed:false,value:0,touched:false});window.__pad={id:"Fake pad",index:0,connected:false,mapping:"standard",axes:[0,0,0,0],buttons:Array.from({length:17},btn),timestamp:0};
  navigator.getGamepads=()=>[window.__pad.connected?window.__pad:null];window.padSet=(i,v)=>{window.__pad.connected=true;window.__pad.buttons[i].pressed=v;window.__pad.buttons[i].value=v?1:0;};});
await p.goto('file://'+__dirname+'/'+PAGE+'?screen=home');await p.waitForTimeout(1200);
const C=sel=>p.evaluate(s=>document.querySelector(s).click(),sel);
const st=()=>p.evaluate(()=>({screen:document.querySelector('.card.menu').dataset.screen,stamp:document.getElementById('menuStamp').textContent,mode:__qh.MODE}));
const out={};
out.start=await st();
out.homeButtons=await p.evaluate(()=>[...document.querySelectorAll('.home-btn b')].map(x=>x.textContent));
await C('#homeSolo');out.solo=await st();out.soloVisible=await p.evaluate(()=>({career:!!document.getElementById('careerPanel').offsetParent||!!document.getElementById('freePanel').offsetParent,modes:!!document.querySelector('.modes').offsetParent}));
await C('#menuBack');out.back=await st();
await C('#homeCoop');out.coop=await st();out.coopUI=await p.evaluate(()=>({code:!!document.getElementById('coopCode').offsetParent,start:document.getElementById('startBtn').textContent,dis:document.getElementById('startBtn').disabled,modes:!!document.querySelector('.modes').offsetParent,career:!!document.getElementById('careerPanel').offsetParent}));
await p.keyboard.press('Escape');await p.waitForTimeout(100);out.esc=await st();
await C('#homeSolo');out.soloAgain=await st();
await C('#menuBack');
await C('#homeSettings');out.settings=await st();
const before=await p.evaluate(()=>({sound:document.getElementById('setSound').textContent,obj:document.getElementById('setObj').textContent,dev:document.getElementById('devToggle').checked}));
await C('#setSound');await C('#setObj');await C('label.dev');
out.toggles={before,after:await p.evaluate(()=>({sound:document.getElementById('setSound').textContent,muted:__qh.A?.muted,obj:document.getElementById('setObj').textContent,objHide:__qh.IN.objHide,dev:document.getElementById('devToggle').checked,devOn:__qh.DEV.on}))};
await C('#setSound');await C('#setObj');await C('label.dev');
await C('#menuBack');await C('#homeHelp');out.help=await p.evaluate(()=>({screen:document.querySelector('.card.menu').dataset.screen,open:document.querySelector('details.help').open,visible:!!document.querySelector('details.help dl').offsetParent}));
// a controller: B backs out to the main menu
await p.evaluate(()=>padSet(1,true));await p.waitForTimeout(200);await p.evaluate(()=>padSet(1,false));await p.waitForTimeout(250);out.padB=await st();
await p.screenshot({path:'../menu-home.png'});
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
