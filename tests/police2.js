// 0.36: the police on every map (single player): they arrive, the van leaves, they come for you and shoot; no errors anywhere.
const {chromium}=require('playwright-core');
const PAGE=process.argv[2]||'test.html';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:800,height:450}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/'+PAGE);await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
for(const m of ["spin","harbor","harborDay","meridian","meridianDay","club","jewel","jewelDay","manor","casino","port","tower","whiteout"]){
  console.log(m,JSON.stringify(await run(`q.setMode("free");q.pickMap("${m}");q.resetGame();q.setState("playing");q.guards.forEach(g=>{g.route=[[200,200],[200,201]];g.x=200;g.z=200;});q.civs.forEach(c=>{c.x=300;c.z=300;c.route=[[300,300]];});
    q.P.masked=true;const sp=q.LV.def.spawn,fx=-Math.sin(sp.yaw||0),fz=-Math.cos(sp.yaw||0);
    // a trail: ten metres in from the start
    for(let i=0;i<34;i++)q.G.trail.push({x:sp.x+fx*i*0.3,z:sp.z+fz*i*0.3,l:sp.lvl||0});go(sp.x+fx*10,sp.z+fz*10,sp.lvl||0,sp.yaw||0);
    q.G.vanTake=30000;q.G.secured=1;q.triggerAlarm("t");q.G.alarmT=0.05;step(3);
    const r={onFoot:q.onFoot(),banked:q.G.banked,spawn:q.G.police.spawn};step(120);r.cops=q.COPS.length;
    const d0=Math.min(...q.COPS.map(c=>Math.hypot(c.x-q.P.x,c.z-q.P.z)));step(240);const d1=Math.min(...q.COPS.map(c=>Math.hypot(c.x-q.P.x,c.z-q.P.z)));
    r.dist=[+d0.toFixed(1),+d1.toFixed(1)];r.hp=Math.round(q.P.hp);r.state=q.state;
    q.P.hp=100;q.G.police.next=0;step(2);r.wave2=q.COPS.length;return r;`)));
}
console.log(errs.join("\n")||"no errors");await b.close();})();
