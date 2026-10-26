// 0.40: settings. CS mouse sensitivity, key bindings and layouts, volumes, field of view, Counter-Strike movement
// (momentum, friction, air strafing, bunny hops).
const {chromium}=require('playwright-core');
const PAGE=process.argv[2]||'test.html';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:700}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/'+PAGE+'?screen=settings');await p.waitForTimeout(1500);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const out={};
// the settings screen and the sensitivity number
out.screen=await p.evaluate(()=>({rows:document.querySelectorAll('#setMore .set-row').length,binds:document.querySelectorAll('#setMore [data-bind]').length,sens:document.querySelector('[data-num="sens"]').value,movement:__qh.SET.move}));
await p.fill('[data-num="sens"]','1.5');await p.press('[data-num="sens"]','Tab');
out.sens=await run(`const s=q.SET.sens,r=q.lookSens();return {sens:s,degPer100:+(r*100*180/Math.PI).toFixed(3),saved:JSON.parse(localStorage.getItem("cg-settings-v1")).sens,slider:document.querySelector('[data-rng="sens"]').value};`);
// rebinding: Use to F (Takedown moves to E), then a key press on F counts as Use
await p.click('[data-bind="use"]');await p.keyboard.press('KeyF');
out.bind=await run(`return {use:q.SET.binds.use,fight:q.SET.binds.fight,layout:q.SET.layout,label:document.querySelector('[data-bind="use"]').textContent,prompt:q.keyWords("Hold <kbd>E</kbd> to open it")};`);
out.mapped=await run(`q.setMode("free");q.pickMap("harbor");q.resetGame();q.setState("playing");away();
  window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyF"}));const a=!!q.keys.KeyE,b=!!q.keys.KeyF;window.dispatchEvent(new KeyboardEvent("keyup",{code:"KeyF"}));
  window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyE"}));const c=!!q.keys.KeyF;window.dispatchEvent(new KeyboardEvent("keyup",{code:"KeyE"}));
  return {fPressMeansUse:a,fPressMeansFight:b,ePressMeansFight:c};`);
// layouts
await run(`q.setState("menu");q.menuScreen("settings");`);
await p.click('[data-seg="layout"][data-v="cs"]');
out.cs=await run(`return {crouch:q.SET.binds.crouch,crouchHold:q.SET.crouchHold,use:q.SET.binds.use||"KeyE",layout:q.SET.layout};`);
await p.click('[data-seg="layout"][data-v="classic"]');
// volume and field of view
out.volfov=await run(`q.setSet("vol.master",40);q.setSet("fov",110);return {vol:q.SET.vol.master,fov:+q.camera.fov.toFixed(2),expect:+(2*Math.atan(Math.tan(55*Math.PI/180)*0.75)*180/Math.PI).toFixed(2)};`);
await run(`q.setSet("fov",90);`);
// Counter-Strike movement
out.move=await run(`q.setSet("move","cs");q.setMode("free");q.pickMap("harbor");q.resetGame();q.setState("playing");away();q.civs.forEach(c=>{c.x=300;c.z=300;});
  const sp=q.LV.def.spawn;go(sp.x,sp.z,0,sp.yaw||0,0);const hs=()=>+Math.hypot(q.P.mvx,q.P.mvz).toFixed(2);const r={};
  q.keys.KeyW=true;step(2);r.after2=hs();step(28);r.after30=hs();q.keys.KeyW=false;step(2);r.letGo2=hs();step(28);r.letGo30=hs();
  // bunny hop: running fast in the air, press jump just before landing: no friction, straight back up
  const hop=(press)=>{go(sp.x,sp.z,0,sp.yaw||0,0);q.P.mvx=-Math.sin(q.P.yaw)*4.6;q.P.mvz=-Math.cos(q.P.yaw)*4.6;q.P.jh=0.25;q.P.vy=-2;
    let landed=false;for(let i=0;i<20&&!landed;i++){if(press&&q.P.jh<0.2)q.tryJump();step(1);landed=q.P.vy>0||q.P.jh<=q.P.gnd+0.001;}step(1);return {speed:hs(),up:q.P.vy>0||q.P.jh>q.P.gnd+0.02};};
  r.hop=hop(true);r.noHop=hop(false);
  // air strafe: in the air, hold right and turn right: you speed up
  go(sp.x,sp.z,0,sp.yaw||0,0);q.P.mvx=-Math.sin(q.P.yaw)*3.1;q.P.mvz=-Math.cos(q.P.yaw)*3.1;q.P.jh=3;q.P.vy=0;
  q.keys.KeyD=true;for(let i=0;i<15;i++){q.P.yaw-=0.05;q.P.vy=0;q.P.jh=3;step(1);}q.keys.KeyD=false;r.strafe=hs();
  q.setSet("move","classic");go(sp.x,sp.z,0,sp.yaw||0,0);q.keys.KeyW=true;step(2);r.classic2=hs();q.keys.KeyW=false;step(1);r.classicStop=hs();
  return r;`);
console.log(JSON.stringify(out,null,1));console.log(errs.join("\n")||"no errors");
await b.close();})();
