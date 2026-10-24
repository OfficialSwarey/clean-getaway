const {chromium}=require('playwright-core');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
  for(const [w,h] of [[1366,768],[1920,1080]]){
    const p=await b.newPage({viewport:{width:w,height:h}});
    const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
    await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1500);
    await p.screenshot({path:`../ui-${w}-menu.png`,timeout:120000});
    const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');
    await p.evaluate(new Function(H+`q.setState("menu");q.pickMap("tower");q.resetGame();q.setState("playing");q.P.masked=true;q.G.t.exec=true;q.G.t.rec=4.2;q.G.t.override="uploading";q.G.t.ovT=12;q.P.hasCard=true;q.LV.def.startFire();go(6,0.8,1,Math.PI/2);step(5);`));
    await p.waitForTimeout(800);await p.screenshot({path:`../ui-${w}-hud.png`,timeout:120000});
    await p.evaluate(new Function(H+`q.setState("paused");`));await p.waitForTimeout(500);await p.screenshot({path:`../ui-${w}-pause.png`,timeout:120000});
    await p.evaluate(new Function(H+`q.setState("playing");go(-13,-6.4,2,Math.PI);q.G.t.override=null;q.pressE();step(2);`));await p.waitForTimeout(500);await p.screenshot({path:`../ui-${w}-keypad.png`,timeout:120000});
    await p.evaluate(new Function(H+`q.closeKeypad();q.setState("menu");q.pickMap("jewel");q.resetGame();q.setState("playing");q.G.hasDiamond=true;q.G.diamondVal=260000;q.G.pocket=12400;go(q.SECURE.x,q.SECURE.z,0,0);q.keys.KeyE=true;step(60);q.keys.KeyE=false;`));
    await p.waitForTimeout(800);await p.screenshot({path:`../ui-${w}-end.png`,timeout:120000});
    console.log(w,errs);await p.close();
  }
  await b.close();
})();
