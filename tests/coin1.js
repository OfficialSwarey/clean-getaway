const {chromium}=require('playwright-core');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:640,height:360}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
// casino floor-ish: use meridian. Put a guard on a patrol, throw a coin near him, watch him walk to it and come back
const r=await run(`q.setState("menu");q.pickMap("jewel");q.resetGame();q.setState("playing");q.civs.forEach(c=>{c.x=300;c.z=300;c.route=[[300,300]];});
  const g=q.guards.find(g=>g.name==="Nystrom");const r0=JSON.stringify(g.route);g.x=-14;g.z=-12;g.wp=0;g.yaw=-Math.PI/2;
  go(-2,-12,0,Math.PI/2);q.P.pitch=0.05;const coins0=q.G.coins;
  window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyT"}));window.dispatchEvent(new KeyboardEvent("keyup",{code:"KeyT"}));
  step(40);const landed=q.G.coins;const cp=q.LV.group.children.filter(o=>o.geometry&&o.geometry.type==="CylinderGeometry"&&o.geometry.parameters.radiusTop===0.03).map(o=>[+o.position.x.toFixed(1),+o.position.y.toFixed(2),+o.position.z.toFixed(1)]);const sd=g.seeDist;const inv=!!g.invest;const tgt=g.invest?[+g.invest.x.toFixed(1),+g.invest.z.toFixed(1)]:null;const toast=toastT();
  go(5,-14,0,0);step(150);const mid=[+g.x.toFixed(1),+g.z.toFixed(1)];const arrived=g.invest?+g.invest.arrive.toFixed(1):null;step(500);
  return {cp,sd,coins0,landed,inv,tgt,toast,mid,arrived,after:!!g.invest,routeBack:JSON.stringify(g.route)===r0,chip:document.getElementById("coinChip").textContent};`);
console.log(JSON.stringify(r),errs.join('\n')||'no errors');await b.close();})();
