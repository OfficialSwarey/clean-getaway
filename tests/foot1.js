// 0.35: every map, career. With a driver: the van is there and takes a 10% cut. Without one: no van, and you leave on foot
// where you came in, with the bag in your hands. Loot starts as a pile you bag yourself.
const {chromium}=require('playwright-core');
const PAGE=process.argv[2]||'test.html';
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:900,height:520}});const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(0,3).join(' | ')));
await p.goto('file://'+__dirname+'/'+PAGE);await p.waitForTimeout(1000);
const H=require('fs').readFileSync(__dirname+'/twH.js','utf8');const run=src=>p.evaluate(new Function(H+src));
const maps=["spin","harbor","harborDay","meridian","meridianDay","club","jewel","jewelDay","manor","casino","port","tower","whiteout"];
const out={};
for(const m of maps){
  out[m]=await run(`const C=q.newCareer();C.cash=99999;C.xp=99999999;q.CAREER=C;C.board[0]={id:"f1",map:"${m}",tw:[],pay:1,xp:1,stars:1,mins:9};q.fillBoard();q.setMode("career");
    q.openPlan("f1");q.PLAN.sel={driver:false,duffel:2};q.startPlan();q.setState("playing");away();q.civs.forEach(c=>{c.x=300;c.z=300;c.route=[[300,300]];});q.P.masked=true;step(2);
    const sp=q.LV.def.spawn,r={};
    r.vanHidden=q.VAN_PARTS?q.VAN_PARTS.length:"n/a";
    r.secureAtSpawn=Math.hypot(q.SECURE.x-sp.x,q.SECURE.z-sp.z)<0.01;
    // bag a pile at the start, then walk out with it
    const bg=q.bags.find(b=>!b.gold)||q.bags[0];bg.state="ground";bg.box=null;bg.level=sp.lvl||0;bg.mesh.visible=true;
    go(sp.x,sp.z,sp.lvl||0,sp.yaw||0,-0.6);const fx=-Math.sin(sp.yaw||0),fz=-Math.cos(sp.yaw||0);bg.mesh.position.set(sp.x+fx*1.1,(sp.lvl||0)*q.ROOF_Y+0.22,sp.z+fz*1.1);step(2);
    r.bagPr=pr();q.keys.KeyE=true;step(80);q.keys.KeyE=false;step(2);r.carry=!!(q.P.carry&&q.P.carry.bagged);r.duffels=q.G.duffels;
    go(sp.x,sp.z,sp.lvl||0,sp.yaw||0,0);step(2);r.leavePr=pr();r.obj=document.getElementById("objText").textContent.slice(0,60);
    if(q.LV.def.needDiamond){q.G.hasDiamond=true;q.G.diamondVal=q.LV.def.diamondValue;step(1);}
    q.keys.KeyE=true;step(80);q.keys.KeyE=false;r.state=q.state;r.won=document.getElementById("endTitle").className;r.reason=document.getElementById("endReason").textContent.slice(0,70);
    r.end=document.getElementById("endCareer").innerText.replace(/\\n/g," | ").slice(0,90);
    // now with a driver: the van is back
    q.toMenu();C.board[0]={id:"f2",map:"${m}",tw:[],pay:1,xp:1,stars:1,mins:9};q.openPlan("f2");q.PLAN.sel={driver:true,duffel:1};q.startPlan();q.setState("playing");step(1);
    r.withDriver={vanShown:q.VAN_PARTS.every(o=>o.visible),secureAtSpawn:Math.hypot(q.SECURE.x-sp.x,q.SECURE.z-sp.z)<0.01};
    q.G.vanTake=40000;q.G.secured=1;q.P.carry=null;q.endGame(true);r.withDriver.end=document.getElementById("endCareer").innerText.replace(/\\n/g," | ").slice(0,120);
    q.toMenu();return r;`);
  console.log(m,JSON.stringify(out[m]));
}
console.log(errs.join("\n")||"no errors");await b.close();})();
