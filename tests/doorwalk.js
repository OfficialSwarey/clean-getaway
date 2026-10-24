const {chromium}=require('playwright-core');
(async()=>{const maps=process.argv.slice(2).length?process.argv.slice(2):["harbor","harborDay","meridian","meridianDay","club","manor","casino","port","tower","jewel","jewelDay","whiteout"];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:320,height:180}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(800);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');
for(const m of maps){
 const r=await p.evaluate(new Function(H+`q.setState("menu");q.pickMap("${m}");q.resetGame();q.setState("playing");away();q.civs.forEach(c=>{c.x=300;c.z=300;c.route=[[300,300]];});
  const bad=[];const n=q.doors.length;
  for(let i=0;i<n;i++){const d=q.doors[i];
    for(const side of [1,-1]){
      q.resetGame();q.setState("playing");away();q.civs.forEach(c=>{c.x=300;c.z=300;c.route=[[300,300]];});q.G.alarm=false;
      const D=q.doors[i];D.locked=false;if(D.reader)D.locked=false;q.P.hasCard=true;
      const nx=Math.abs(Math.sin(D.rot))>0.5?1:0,nz=1-nx;
      const sx=D.x+nx*1.3*side,sz=D.z+nz*1.3*side,vx=-nx*side,vz=-nz*side;
      go(sx,sz,D.level||0,Math.atan2(-vx,-vz));q.pressE();step(25);
      q.keys.KeyW=true;for(let k=0;k<45;k++){q.P.yaw=Math.atan2(-vx,-vz);step(1);}q.keys.KeyW=false;step(2);
      const prog=(q.P.x-D.x)*nx*side+(q.P.z-D.z)*nz*side;
      if(prog>-0.6)bad.push({door:D.name,lvl:D.level||0,at:[+D.x.toFixed(1),+D.z.toFixed(1)],side,open:D.open,end:[+q.P.x.toFixed(2),+q.P.z.toFixed(2)],lvlNow:q.P.level});
    }}
  return {n,bad};`));
 console.log(m,"doors",r.n,"blocked",r.bad.length);r.bad.forEach(x=>console.log("   ",JSON.stringify(x)));}
console.log(errs.length?errs:"no page errors");await b.close();})();
