// Harbor Savings & Loan: the locked staff door from the back alley into the security room; pick it, walk in behind the guard and take him down unseen.
const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:1100,height:620}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
for(const map of ["harbor","harborDay"]){
console.log(map,JSON.stringify(await run(`q.setMode("free");q.pickMap("${map}");q.resetGame();q.setState("playing");
 const pt=q.guards.find(g=>g.security);
 const r={};const d=q.doors.find(d=>d.name==="security back door");r.door=!!d&&{locked:d.locked,x:d.x,z:d.z,rot:+d.rot.toFixed(2)};
 // outside in the alley, masked, facing the door: no camera or guard should be on us yet (normal patrols)
 q.P.masked=true;go(6.5,-13.3,0,Math.PI);step(3);r.pr=pr();r.susp0=+q.G.susp.toFixed(2);
 q.keys.KeyE=true;for(let i=0;i<300&&d.locked;i++)step(1);q.keys.KeyE=false;r.picked=!d.locked;step(2);
 q.pressE();step(20);r.open=d.open;
 // walk in and up behind the chair
 const res=[];for(const [x,z] of [[6.5,-11.2],[7.5,-10],[9.5,-9.3],[11,-9.1]]){go(x,z,0,-Math.PI/2);step(10);res.push([x,z,+pt.seeDist.toFixed(1),+q.G.susp.toFixed(2),q.G.alarm,q.G.secAlert>0]);}
 r.walk=res;r.target=!!q.takedownTarget()&&q.takedownTarget().security;q.pressF();step(2);r.down=pt.down;r.alarm=q.G.alarm;
 return r;`)));}
await run(`q.setMode("free");q.pickMap("harbor");q.resetGame();q.setState("playing");q.P.masked=false;go(4.5,-15.5,0,Math.PI-0.5,0.1);step(3);`);
console.log(errs.join('\n')||'no errors');await b.close();})();
