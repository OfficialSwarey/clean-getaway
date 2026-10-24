const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:640,height:360}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const all=["softstep","shadow","talker","quickchange","lightload","vanish","fingers","signal","drilltune","loop","coolhead","masterkey","stash","aim","hands","voice","heavy","iron"];
const setup=(skills,gear,map)=>`const C=q.newCareer();C.xp=99999999;C.cash=0;${JSON.stringify(skills)}.forEach(k=>C.skills[k]=true);${JSON.stringify(gear||[])}.forEach(k=>C.gear[k]=true);
  C.board[0]={id:"s1",map:"${map||"meridian"}",tw:[],pay:1,xp:1,stars:1,mins:9};C.active="s1";q.CAREER=C;q.setMode("career");q.pickMap("${map||"meridian"}");q.resetGame();q.setState("playing");away();q.civs.forEach(c=>{c.x=300;c.z=300;c.route=[[300,300]];});`;
const out={};
// base values with everything vs nothing
out.sk=await run(setup(all,["picks","shoes","silencer","jammer","mag","bit","bandolier","coins","badge"])+`const s=q.SK;return {pick:+s.pick.toFixed(2),drill:+s.drill.toFixed(3),ties:q.P.ties,jam:q.P.jammers,mag:q.P.mag,coins:q.G.coins,pagers:q.maxPagers(),kp:s.kp,mask:s.mask};`);
// master key: first locked door opens at once
out.master=await run(setup(["masterkey"])+`const d=q.doors.find(d=>d.name==="server room door");q.P.masked=true;go(-15,-6.8,0,0);const pr0=pr();
  q.keys.KeyE=true;step(3);q.keys.KeyE=false;step(1);return {pr0,door:d.name,locked:d.locked,used:q.G.masterUsed,toast:toastT()};`);
// vanish: a guard who would radio you in loses you
out.vanish=await run(setup(["vanish"])+`const g=q.guards.find(g=>!g.security);g.x=0;g.z=-14;g.yaw=0;g.route=[[0,-14]];g.face=0;q.P.masked=true;go(0,-9,0,Math.PI);let sd=[];for(let i=0;i<300&&!q.G.vanishUsed;i++){step(1);if(i%60==0)sd.push(+g.seeDist.toFixed(1)+"/"+q.G.susp.toFixed(2));}
  return {sd,used:q.G.vanishUsed,report:g.reportT,alarm:q.G.alarm,toast:toastT()};`);
// iron grip: grabbed once during an alarm, break free
out.iron=await run(setup(["iron"])+`q.P.masked=true;const g=q.guards.find(g=>!g.security);q.triggerAlarm("test");go(5,5,0,0);g.x=5;g.z=5.6;g.chase=true;g.last={x:5,z:5};step(3);
  return {used:q.G.ironUsed,down:g.down,state:q.state,toast:toastT()};`);
// heavy lifter: sprint with gold
out.heavy=await run(setup(["heavy"])+`q.P.masked=true;const bg=q.bags.find(b=>b.gold)||q.bags[0];bg.gold=true;bg.state="carried";q.P.carry=bg;go(0,20,0,0);q.keys.KeyW=true;q.keys.ShiftLeft=true;step(10);q.keys.KeyW=false;q.keys.ShiftLeft=false;return {sprinting:q.P.sprinting};`);
// cool head: 3 wrong codes don't trip the alarm, the 4th does
out.cool=await run(setup(["coolhead"])+`q.G.safeFails=3;const a=q.G.alarm;return {kp:q.SK.kp,alarmAt3:a};`);
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close();})();
